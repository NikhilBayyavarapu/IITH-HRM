import { pool } from "../configs/db";
import { getReadableStringFromTimestamp } from "../utils/getReadableDateFromTimestamp";
import xlsx from "xlsx";
const { readFile, utils } = xlsx;

export const getRoomSwapRequests = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select room_swap_requests.id, name,requested_block,requested_room from student_details inner join room_swap_requests on room_swap_requests.roll_no = student_details.roll_no; `,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

export const getRoomEmptyRequests = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select empty_room_allocataion_requests.id, name,requested_block,requested_room from student_details inner join empty_room_allocataion_requests on empty_room_allocataion_requests.roll_no = student_details.roll_no; `,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

export const respondEmptyRoomUpdate = async (swapId: number, resp: boolean) => {
  return new Promise((resolve, reject) => {
    let query = "";
    if (resp === true) {
      query = `SELECT empty_room_update(${pool.escape(swapId)}) as response ;`;
    } else {
      query = `DELETE FROM empty_room_allocataion_requests WHERE id = ${pool.escape(
        swapId
      )} ;`;
    }
    pool.query(query, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve("Successfully Updated");
    });
  });
};

export const respondSwapRoomUpdate = async (swapId: number, resp: boolean) => {
  return new Promise((resolve, reject) => {
    let query = "";
    if (resp === true) {
      query = `SELECT room_update(${pool.escape(swapId)}) as response ;`;
    } else {
      query = `DELETE FROM room_swap_requests WHERE id = ${pool.escape(
        swapId
      )} ;`;
    }
    pool.query(query, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve("Successfully Updated");
    });
  });
};

export const respondVacationRequest = async (rollNumber: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `update student_details set room_no = NULL, block = NULL where roll_no = ${pool.escape(
        rollNumber
      )}; `,
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve("Succesfully Vacated");
      }
    );
  });
};

export const getAllStaffData = async () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM staff_details ;`, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

export const assignStaffToServiceRequest = async (
  id: number,
  staffId: number
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE service_requests SET assigned_staff = ${pool.escape(
        staffId
      )} , assigned_timestamp = current_timestamp() WHERE id = ${pool.escape(
        id
      )} ;`,
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve("Succesfully Updated");
      }
    );
  });
};

export const getVacationRequests = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select name,student_details.roll_no,block,room_no,vacating_time from student_details inner join room_vacataion_requests on room_vacataion_requests.roll_no = student_details.roll_no;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(
          results.map((result) => {
            result.vacating_time = getReadableStringFromTimestamp(
              result.vacating_time
            );
            return result;
          })
        );
      }
    );
  });
};

export const getServiceRequests = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select service_requests.id AS serviceid, student_details.name,service_requests.roll_no,staff_type,requested_timestamp from service_requests inner join student_details on service_requests.roll_no = student_details.roll_no;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(
          results.map((result) => {
            result.requested_timestamp = getReadableStringFromTimestamp(
              result.requested_timestamp
            );
            return result;
          })
        );
      }
    );
  });
};

export const getInventoryDataForHO = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT A.id AS id,item_name,item_status,B.issued AS issued FROM inventory AS A LEFT JOIN (SELECT * FROM inventory_history ORDER BY time DESC) AS B ON A.id = B.item_id;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

export const getInventoryHistoryDataForHO = async (id: number) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM inventory_history WHERE id = ${pool.escape(
        id
      )} ORDER BY time DESC;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

export const updateInventoryHistoryData = async (id: number) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM inventory_history WHERE id = ${pool.escape(
        id
      )} ORDER BY time DESC;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

export const issueInventory = async (id: number, rollNo: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM inventory_history WHERE item_id = ${pool.escape(
        id
      )} ORDER BY time DESC LIMIT 1;`,
      (err1, result1) => {
        if (err1) {
          return reject(err1);
        }
        if (result1.length && result1[0].issued === 1) {
          return resolve(
            `Failed: Item already issued to ${result1[0].roll_no}`
          );
        }
        pool.query(
          `INSERT INTO inventory_history (roll_no,item_id,time,issued) VALUES (${pool.escape(
            rollNo
          )},${pool.escape(id)},now(),1) ;`,
          (err2) => {
            if (err2) {
              return reject(err2);
            }
            return resolve("Successfully Issued");
          }
        );
      }
    );
  });
};

export const returnInventoryItem = async (item_id: number) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE inventory_history SET issued = 0 WHERE item_id = ${pool.escape(
        item_id
      )} ;`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows !== 1) {
          return resolve("Failed: Item not issued to anyone");
        }
        return resolve("Successfully Updated");
      }
    );
  });
};

export const sendStudentData = async () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM student_details ;`, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

export const uploadStudentDataFromExcel = async (filename: string) => {
  const wb = readFile(`uploads/student/${filename}`);
  const wsnames = wb.SheetNames;
  const ws = wb.Sheets[wsnames[0]];
  return Promise.all(
    utils.sheet_to_json(ws).map((row) => {
      return new Promise((resolve, reject) => {
        pool.query(
          `INSERT INTO student_details (name,roll_no,room_no,block,contact_no,address,guardian_name,guardian_contact) VALUES (${pool.escape(
            row.name
          )},${pool.escape(row.roll_no)},${pool.escape(
            row.room_no
          )},${pool.escape(row.block)},${pool.escape(
            row.contact_no
          )},${pool.escape(row.address)},${pool.escape(
            row.guardian_name
          )},${pool.escape(row.guardian_contact)}) ;`,
          (err) => {
            if (err) {
              return reject(err);
            }
            return resolve(1);
          }
        );
      });
    })
  );
};

export const uploadAttendanceDataFromExcel = async (filename: string) => {
  const wb = readFile(`uploads/student/${filename}`);
  const wsnames = wb.SheetNames;
  const ws = wb.Sheets[wsnames[0]];
  return Promise.all(
    utils.sheet_to_json(ws).map((row) => {
      return new Promise((resolve, reject) => {
        pool.query(
          `INSERT INTO attendance (roll_no,entry,in_out_time) VALUES (${pool.escape(
            row.roll_no
          )},${pool.escape(row.entry)},${pool.escape(
            row.in_out_time.substring(1, row.in_out_time.length - 1)
          )}) ;`,
          (err) => {
            if (err) {
              return reject(err);
            }
            return resolve(1);
          }
        );
      });
    })
  );
};

export const uploadStaffDataFromExcel = async (filename: string) => {
  const wb = readFile(`uploads/student/${filename}`);
  const wsnames = wb.SheetNames;
  const ws = wb.Sheets[wsnames[0]];
  return Promise.all(
    utils.sheet_to_json(ws).map((row) => {
      return new Promise((resolve, reject) => {
        pool.query(
          `INSERT INTO staff_details (name,contact_no,staff_type) VALUES (${pool.escape(
            row.name
          )},${pool.escape(row.contact_no)},${pool.escape(row.staff_type)}) ;`,
          (err) => {
            if (err) {
              return reject(err);
            }
            return resolve(1);
          }
        );
      });
    })
  );
};
