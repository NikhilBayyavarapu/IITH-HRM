import { pool } from "../configs/db";

export const getRoomSwapRequests = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select name,requested_block,requested_room from student_details inner join room_swap_requests on room_swap_requests.roll_no = student_details.roll_no; `,
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
      `select name,requested_block,requested_room from student_details inner join empty_room_allocataion_requests on empty_room_allocataion_requests.roll_no = student_details.roll_no; `,
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
      `select student_details.name,service_requests.roll_no,staff_type,requested_timestamp from service_requests inner join student_details on service_requests.roll_no = student_details.roll_no;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

export const getInventoryDataForHO = async () => {};
