import express from "express";
import {
  logeo,
  logeocheck,
  givtok,
  testeo,
  crear_wall,
  crear_cred,
  cred_cre,
  sol_cred
} from "../controllers/HolderMainController.js";

const router = express.Router();

router.get("/test", testeo);

router.get("/crear_wall", crear_wall);

router.get("/crear_cred", crear_cred);

router.post("/cred_cre", cred_cre);

router.get("/solitarcred", sol_cred);

router.get("/login", logeo);

router.post("/login/save", logeocheck);

router.post("/login/token", givtok);

export default router;
