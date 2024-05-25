import express from "express";
import { cre_schem, cre_cred, testeo, glob } from "../controllers/IssuerMainController.js";

const router = express.Router();

router.get("/cre_schem", cre_schem);

router.get("/cre_cred", cre_cred);

router.get("/testeo", testeo);

router.get("/glob([a-zA-Z]+)", glob);

export default router;
