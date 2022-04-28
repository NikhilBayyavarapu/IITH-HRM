import { Router } from "express";
import {
  getInventoryDataForHO,
  getRoomSwapRequests,
  getServiceRequests,
  getVacationRequests,
  getRoomEmptyRequests,
  respondEmptyRoomUpdate,
  respondSwapRoomUpdate,
  respondVacationRequest,
  getAllStaffData,
  assignStaffToServiceRequest,
  getInventoryHistoryDataForHO,
  updateInventoryHistoryData,
} from "../controllers/hostel";
import sendError from "../utils/error-handle";
import sendData from "../utils/send-data";

const router = Router();

router.get(`/roomswaprequests`, async (_req, res) => {
  try {
    return sendData(res, 200, await getRoomSwapRequests());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/roomemptyrequests`, async (_req, res) => {
  try {
    return sendData(res, 200, await getRoomEmptyRequests());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/respondemptyroomrequest`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await respondEmptyRoomUpdate(req.body.id, req.body.resp)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/respondswaproomrequest`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await respondSwapRoomUpdate(req.body.id, req.body.resp)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/vacation`, async (_req, res) => {
  try {
    return sendData(res, 200, await getVacationRequests());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/respondvacationrequest`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await respondVacationRequest(req.body.rollNumber)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/servicerequest`, async (_req, res) => {
  try {
    return sendData(res, 200, await getServiceRequests());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get("/staff", async (_req, res) => {
  try {
    return sendData(res, 200, await getAllStaffData());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/assignstaff`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await assignStaffToServiceRequest(req.body.id, req.body.staff_id)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/inventory`, async (_req, res) => {
  try {
    return sendData(res, 200, await getInventoryDataForHO());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get(`/inventoryspecific`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await getInventoryHistoryDataForHO(
        req.query.id ? parseInt(req.query.id.toString()) : 1
      )
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/updateinventory`, async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await updateInventoryHistoryData(
        req.query.id ? parseInt(req.query.id.toString()) : 1
      )
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

export default router;
