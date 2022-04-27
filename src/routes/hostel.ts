import { Router } from "express";
import {
  getInventoryDataForHO,
  getRoomRequests,
  getServiceRequests,
  getVacationRequests,
} from "../controllers/hostel";
import sendError from "../utils/error-handle";
import sendData from "../utils/send-data";

const router = Router();

router.get(`/roomrequests`, async (_req, res) => {
  return sendData(res, 200, getRoomRequests());
});

router.post(`/respondroomrequest`, async (_req, res) => {});

router.get(`/vacation`, async (_req, res) => {
  try {
    return sendData(res, 200, await getVacationRequests());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post(`/respondvacationrequest`, async (_req, res) => {});

router.get(`/servicerequest`, async (_req, res) => {
  return sendData(res, 200, getServiceRequests());
});

router.post(`/assignstaff`, async (_req, res) => {});

router.get(`/inventory`, async (_req, res) => {
  return sendData(res, 200, getInventoryDataForHO());
});

router.post(`/updateinventory`, async (_req, res) => {});

export default router;
