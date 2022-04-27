import { pool } from "../configs/db";

export const getRoomRequests = async () => {};

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

export const getServiceRequests = async () => {};

export const getInventoryDataForHO = async () => {};
