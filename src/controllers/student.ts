import { pool } from "../configs/db";
import { roomsByFloor } from "../configs/rooms";
import { getRollFromEmail } from "../utils/getRollNumberFromEmail";

export const getStudentData = async (email: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select * from student_details where roll_no = ${pool.escape(
        getRollFromEmail(email)
      )};`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      }
    );
  });
};

export const getStudentAttendanceData = async (email: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select entry,in_out_time from attendance where roll_no = ${pool.escape(
        getRollFromEmail(email)
      )} ORDER BY in_out_time DESC;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(
          results.map((result: { entry: number | boolean }) => {
            if (result.entry === 1) {
              result.entry = true;
            } else {
              result.entry = false;
            }
            return result;
          })
        );
      }
    );
  });
};

export const getRoomData = async (blockname: string) => {
  return Promise.all(
    roomsByFloor.map((floor) =>
      Promise.all(
        floor.map((room) => {
          return new Promise((resolve, reject) => {
            pool.query(
              `SELECT roll_no FROM student_details WHERE block = ${pool.escape(
                blockname
              )} AND room_no = ${pool.escape(room.roomNo)} ;`,
              (err, result) => {
                if (err) {
                  return reject(err);
                } else {
                  if (result.length > 0) {
                    room.occupied = true;
                  } else {
                    room.occupied = false;
                  }
                  return resolve(room);
                }
              }
            );
          });
        })
      )
    )
  );
};

export const applyRoomForStudent = async (
  email: string,
  block: string,
  roomNo: string
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select apply_for_room(${pool.escape(
        getRollFromEmail(email)
      )},${pool.escape(roomNo)},${pool.escape(block)}) as apply ;`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result[0].apply === 1) {
          return resolve("Successfully Applied");
        }
        return resolve("Failed to apply");
      }
    );
  });
};

export const getStudentSwapRequestData = async (email: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select name,roll_no,contact_no from student_details where roll_no in (select roll_no from room_swap_requests where requested_block in (select block from student_details where roll_no = ${pool.escape(
        getRollFromEmail(email)
      )}) AND requested_room in (select room_no from student_details where roll_no = ${pool.escape(
        getRollFromEmail(email)
      )}));`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

export const respondToSwapRequest = async (
  roll1: string,
  email2: string,
  consent: number
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select respond_to_swap(${pool.escape(roll1)},${pool.escape(
        getRollFromEmail(email2)
      )},${pool.escape(consent)}) AS response;`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result[0].response === 1) {
          return resolve("Successfully Updated");
        } else {
          return resolve("Failed to update");
        }
      }
    );
  });
};

export const vacateStudent = async (email: string, time: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select vacation_request(${pool.escape(
        getRollFromEmail(email)
      )},${pool.escape(time)}) AS response;`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result[0].response === 1) {
          return resolve("Successfully Updated Vacation");
        } else {
          return resolve("Failed create vacation");
        }
      }
    );
  });
};

export const createServiceRequest = async (
  email: string,
  staff_type: string,
  desc: string
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `insert into service_requests(roll_no,staff_type,requested_timestamp,description) values (${pool.escape(
        getRollFromEmail(email)
      )},${pool.escape(staff_type)},current_timestamp(),${pool.escape(desc)});`,
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve("Succesfully Created Request");
      }
    );
  });
};

export const completeServiceRequest = async (
  rating: number,
  id: number,
  email: string
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `update service_requests set completed_timestamp = current_timestamp(),rating = ${pool.escape(
        rating
      )} where id = ${pool.escape(id)} AND roll_no = ${pool.escape(
        getRollFromEmail(email)
      )};`,
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve("Succefully Updated");
      }
    );
  });
};

export const getStudentServiceRequestData = async (email: string) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select staff_type,requested_timestamp,assigned_staff,assigned_timestamp from service_requests where roll_no = ${pool.escape(
        getRollFromEmail(email)
      )};`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

export const getInventoryDataForStudent = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT item_name, count(*) AS count FROM inventory WHERE id NOT IN (SELECT item_id FROM inventory_history WHERE issued = 1) AND item_status = "available" GROUP BY item_name;`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};
