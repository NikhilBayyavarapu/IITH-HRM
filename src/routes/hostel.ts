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
  issueInventory,
  returnInventoryItem,
  sendStudentData,
  uploadStudentDataFromExcel,
  uploadAttendanceDataFromExcel,
  uploadStaffDataFromExcel,
} from "../controllers/hostel";
import sendError from "../utils/error-handle";
import sendData from "../utils/send-data";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "./uploads/student",
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");

function checkFileType(file, cb) {
  const filetypes = /xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb("Please upload excel only");
  }
}

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

router.post("/inventoryissue", async (req, res) => {
  try {
    return sendData(
      res,
      200,
      await issueInventory(req.body.id, req.body.rollNo)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post("/inventoryreturn", async (req, res) => {
  try {
    return sendData(res, 200, await returnInventoryItem(req.body.id));
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.get("/student", async (_req, res) => {
  try {
    return sendData(res, 200, await sendStudentData());
  } catch (error) {
    return sendError(res, 500, error);
  }
});

router.post("/studentexcel", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return sendError(res, 500, err);
    }
    if (req.file === undefined) {
      return sendError(res, 400, "No file sent");
    }
    try {
      return sendData(
        res,
        200,
        await uploadStudentDataFromExcel(req.file.filename)
      );
    } catch (error) {
      return sendError(res, 500, error);
    }
  });
});

router.post("/attendanceexcel", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return sendError(res, 500, err);
    }
    if (req.file === undefined) {
      return sendError(res, 400, "No file sent");
    }
    try {
      return sendData(
        res,
        200,
        await uploadAttendanceDataFromExcel(req.file.filename)
      );
    } catch (error) {
      return sendError(res, 500, error);
    }
  });
});

router.post("/staffexcel", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return sendError(res, 500, err);
    }
    if (req.file === undefined) {
      return sendError(res, 400, "No file sent");
    }
    try {
      return sendData(
        res,
        200,
        await uploadStaffDataFromExcel(req.file.filename)
      );
    } catch (error) {
      return sendError(res, 500, error);
    }
  });
});

export default router;
