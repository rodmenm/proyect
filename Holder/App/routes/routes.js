import express from "express";
import {
  crear_wall,
  crear_cred,
  logeocheck,
  cred_cre,
  sol_cred,
  testeo2,
  givtok,
  testeo,
  logeo,
} from "../controllers/HolderMainController.js";

const router = express.Router();

router.get("/test", testeo); // TESTEA EMISION CREDENCIALES

router.get("/testeo", testeo2); // TESTEA VERIFICACION CREDENCIALES

router.get("/crear_wall", crear_wall); // MUESTRA LA VISTA PARA CREAR UNA WALLET Y OBTENER UNA CREDENCIAL

router.get("/crear_cred", crear_cred); // MUESTRA LA VISTA PARA ACCEDER A UNA WALLET Y OBTENER UNA CREDENCIAL

router.post("/cred_cre", cred_cre); // GUARDA LOS DATOS Y REDIRIGE PARA SOLICITAR CREDENCIAL

router.get("/solitarcred", sol_cred); // SOLICITA UNA CREDENCIAL AL ISSUER

router.get("/login", logeo); // PESTAÑA PARA AUTENTICARSE

router.post("/login/save", logeocheck); // COMPRUEBA QUE LA WALLET TENGA UNA CREDENCIAL

router.post("/login/token", givtok); // DA EL TOKEN DE ACCESO A KEYCLOAK

export default router;
