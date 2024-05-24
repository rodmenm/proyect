import express from "express";
import { glob } from "../controllers/VerifierMainController.js";

const router = express.Router();

router.get("/glob", glob);

export default router;
