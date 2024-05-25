import express from "express";
import { glob, testeo } from "../controllers/VerifierMainController.js";

const router = express.Router();

router.get("/testeo", testeo); // SIRVE PARA TESTEAR EL SOLICITAR UNA VERIFICACION

router.get("/glob", glob); // SOLICITA PRUEBAS DE UNA CREDENCIAL

export default router;
