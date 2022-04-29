import { pool } from "../configs/db";

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
        return resolve(results);
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
        return resolve(results);
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
