import express from "express";
import { cre_schem, cre_cred, glob } from "../controllers/IssuerMainController.js";

const router = express.Router();

router.get("/cre_schem", cre_schem);

router.get("/cre_cred", cre_cred);

router.post("/glob", glob);

export default router;
