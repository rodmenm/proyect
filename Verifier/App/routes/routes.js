import express from "express";
import { glob, testeo } from "../controllers/VerifierMainController.js";

const router = express.Router();

router.get("/testeo", testeo);

router.get("/glob", glob);

export default router;
