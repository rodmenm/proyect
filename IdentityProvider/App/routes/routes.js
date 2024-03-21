import express from "express";
import {
  index,
  res_did,
  crear_did,
  update_did,
  deac_did,
  dids_creados,
  import_did,
  cre_wallet,
  ini_wallet,
  cre_op_wallet,
  op_wallet,
  cl_wallet,
  gnonce,
  del_wallet,
  exp_wallet,
  imp_wallet,
  cre_key,
} from "../controllers/mainController.js";

const router = express.Router();

router.get("/", index);

// DIDS----------------------------------------------------------------------------------------------------

// Resolve a did to a did document.
router.post("/resolve_did", (req, res, next) => {
  res_did(req, res);
});

// Create, register and store a did and did document.
router.post("/crear_did", (req, res, next) => {
  crear_did(req, res);
});

// Update an existing did document. did_url -> entrada a actualizar, did_document -> salida actualizada     | secret, didDocumentOperation
router.post("/update_did", (req, res, next) => {
  update_did(req, res, next);
});

// Deactivate an existing did.
router.post("/deactivate_did", (req, res, next) => {
  // options y secret optional
  deac_did(req, res, next);
});

// Get a list of all dids created by the agent
router.post("/dids_creados", (req, res, next) => {
  dids_creados(req, res, next);
});

// Importa un did que fue creado de una forma no natural
router.post("/import_did", (req, res, next) => {
  import_did(req, res, next);
});

/**
 * Import an existing did that was created outside of the DidsApi. This will create a `DidRecord` for the did
 * and will allow the did to be used in other parts of the agent. If you need to create a new did document,
 * you can use the {@link DidsApi.create} method to create and register the did.
 *
 * If no `didDocument` is provided, the did document will be resolved using the did resolver. You can optionally provide a list
 * of private key buffer with the respective private key bytes. These keys will be stored in the wallet, and allows you to use the
 * did for other operations. Providing keys that already exist in the wallet is allowed, and those keys will be skipped from being
 * added to the wallet.
 *
 * By default, this method will throw an error if the did already exists in the wallet. You can override this behavior by setting
 * the `overwrite` option to `true`. This will update the did document in the record, and allows you to update the did over time.
 */

// WALLETS--------------------------------------------------------------------------------------

router.post("/cre_wallet", (req, res, next) => {
  cre_wallet(req, res, next);
});

router.post("/ini_wallet", (req, res, next) => {
  ini_wallet(req, res, next);
});

router.post("/cre_op_wallet", (req, res, next) => {
  cre_op_wallet(req, res, next);
});

router.post("/op_wallet", (req, res, next) => {
  op_wallet(req, res, next);
});

router.post("/cl_wallet", (req, res, next) => {
  cl_wallet(req, res, next);
});

router.post("/gnonce", (req, res, next) => {
  gnonce(req, res, next);
});

router.post("/del_wallet", (req, res, next) => {
  del_wallet(req, res, next);
});

router.post("/exp_wallet", (req, res, next) => {
  exp_wallet(req, res, next);
});

router.post("/imp_wallet", (req, res, next) => {
  imp_wallet(req, res, next);
});

router.post("/cre_key", (req, res, next) => {
  cre_key(req, res, next);
});

export default router;
