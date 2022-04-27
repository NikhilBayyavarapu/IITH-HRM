import { Router } from "express";
import {
  getStudentData,
  getStudentAttendanceData,
  getRoomData,
  applyRoomForStudent,
  getStudentSwapRequestData,
  getStudentServiceRequestData,
  getInventoryDataForStudent,
  respondToSwapRequest,
  vacateStudent,
  createServiceRequest,
  completeServiceRequest,
} from "../controllers/student";
import sendError from "../utils/error-handle";
import sendData from "../utils/send-data";

const router = Router();

router.get(`/data`, async (_req, res) => {
  getStudentData(res.locals.user.email)
    .then((resp) => {
      return sendData(res, 200, resp);
    })
    .catch((err) => {
      return sendError(res, 500, err);
    });
});

router.get(`/attendance`, async (_req, res) => {
  getStudentAttendanceData(res.locals.user.email)
    .then((resp) => {
      return sendData(res, 200, resp);
    })
    .catch((err) => {
      return sendError(res, 500, err);
    });
});

router.get(`/roomdata`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      JSON.parse(
        JSON.stringify(
          await getRoomData(req.query.block ? req.query.block.toString() : "A")
        )
      )
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/applyroom`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await applyRoomForStudent(
        res.locals.user.email,
        req.body.block,
        req.body.roomno
      )
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/swaprequests`, async (_req, res) => {
  try {
    return sendData(
      res,
      200,
      await getStudentSwapRequestData(res.locals.user.email)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/respondrequest`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await respondToSwapRequest(
        req.body.roll_no,
        res.locals.user.email,
        req.body.consent
      )
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/vacation`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await vacateStudent(res.locals.user.email, req.body.time)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/createrequest`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await createServiceRequest(
        res.locals.user.email,
        req.body.staff_type,
        req.body.desc
      )
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/servicerequests`, async (_req, res) => {
  try {
    return sendData(
      res,
      200,
      await getStudentServiceRequestData(res.locals.user.email)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/completed`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await completeServiceRequest(
        req.body.rating,
        req.body.id,
        res.locals.user.email
      )
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/inventory`, async (_req, res) => {
  return sendData(res, 200, getInventoryDataForStudent());
});

export default router;
