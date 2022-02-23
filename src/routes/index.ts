import { Router } from "express";

const router = Router();

import { helloWorld } from "../controllers/helloWorld";

router.get(`/test`, helloWorld);

export default router;
