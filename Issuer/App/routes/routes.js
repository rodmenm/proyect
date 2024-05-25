import express from "express";
import { cre_schem, cre_cred, testeo, glob } from "../controllers/IssuerMainController.js";

const router = express.Router();

router.get("/cre_schem", cre_schem); // CREA UN ESQUEMA PARA LA CREDENCIAL

router.get("/cre_cred", cre_cred); // CREA UNA CREDENTIAL DEFINITION

router.get("/testeo", testeo); // TESTEA EL OTORGAR UNA CRDENCIAL

router.get("/glob/:name([a-zA-Z0-9]+)", glob); // ENTREGA UNA CREDENCIAL CON EL NOMBRE PASADO COMO PARAM

export default router;
