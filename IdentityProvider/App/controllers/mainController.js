export const index = (req, res) => {
  res.render("index");
};

export async function res_did(req, res) {
  try {
    Holder = global.Holder;
    let didDoc = await Holder.holderFinal.agent.dids.resolve({
      did: req.body.did_url,
      options: req.body.options,
    });
    res.send(didDoc);
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la creación del DID
    console.error("Error al resolver el DID:", error);
    res.status(500).send("Error al resolver el DID" + error);
  }
}

export async function crear_did(req, res) {
  try {
    Holder = global.Holder;
    let did = await Holder.holderFinal.agent.dids.create({
      method: "cheqd",
      // El secreto contiene el tipo de método de verificación y el ID
      secret: {
        verificationMethod: {
          id: "key-1",
          type: "Ed25519VerificationKey2020",
        },
      },
      options: {
        network: "testnet",
        methodSpecificIdAlgo: "uuid",
      },
    });
    console.log("DID creado correctamente");
    res.send(did);
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la creación del DID
    console.error("Error al crear el DID:", error);
    res.status(500).send("Error al crear el DID");
  }
}

/*
router.post("/resolve_did", res_did(did_url, options));
// Create, register and store a did and did document.                                                       | options
router.post("/crear_did", crear_did(options));
// Update an existing did document. did_url -> entrada a actualizar, did_document -> salida actualizada     | secret, didDocumentOperation
router.post("/update_did", update_did(did_url, did_document, secret, didDocumentOperation));
// Deactivate an existing did.                                                                              | options, secret
router.post("/deactivate_did", deac_did(did_url, options, secret));
// Resolve a did to a did document.
router.post("/resolve_didoc", res_didoc(did_url));
// Get a list of all dids created by the agent
router.post("/dids_creados", dids_creados());
// Importa un did que fue creado de una forma no natural
router.post("/import_did", import_did(did_url, did_document, privateKeys, overwrite)); */
