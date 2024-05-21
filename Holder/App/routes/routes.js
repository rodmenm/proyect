import express from "express";
import {
  logeo,
  logeocheck,
  givtok,
  testeo,
} from "../controllers/HolderMainController.js";

const router = express.Router();

router.get("/test", testeo);

router.get("/login", logeo);

router.post("/login/save", logeocheck);

router.post("/login/token", givtok);

export default router;
