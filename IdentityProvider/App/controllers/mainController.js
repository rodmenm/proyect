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
    console.error("Error al resolver el DID:", error);
    res.status(500).send("Error al resolver el DID" + error);
  }
}

export async function crear_did(req, res) {
  try {
    Holder = global.Holder;
    let did = await Holder.holderFinal.agent.dids.create({
      method: "cheqd",
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
    console.error("Error al crear el DID:", error);
    res.status(500).send("Error al crear el DID");
  }
}

export async function update_did(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.dids.update({
      did : req.body.did_url,
      // options: req.body.options,     
      options: {
        network: "testnet",
        methodSpecificIdAlgo: "uuid",
      },
      secret: req.body.secret,
      didDocumentOperation: req.body.didDocumentOperation,
      didDocument: req.body.didDocument,
    });
    console.log("DID actualizado correctamente");
    res.send(req.body.didDocument);
  } catch (error) {
    console.error("Error al actualizar el DID:", error);
    res.status(500).send("Error al actualizar el DID");
  }
}

export async function deac_did(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.dids.deactivate({
      did : req.body.did_url,
      options: req.body.options,     
      /*options: {
        network: "testnet",
        methodSpecificIdAlgo: "uuid",
      },*/
      secret: req.body.secret,
    });
    console.log("DID desactivado correctamente");
    res.send("Deactivated did:" + did);
  } catch (error) {
    console.error("Error al desactivar el DID:", error);
    res.status(500).send("Error al desactivar el DID");
  }
}

export async function dids_creados(req, res) {
  try {
    Holder = global.Holder;
    let dids = await Holder.holderFinal.agent.dids.getCreatedDids()
    console.log("DIDs mostrados correctamente");
    res.send(dids);
  } catch (error) {
    console.error("Error al mostrar los DIDS:", error);
    res.status(500).send("Error al mostrar los DIDS");
  }
}

export async function import_did(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.dids.import({
      did: req.body.did_url, 
      didDocument: req.body.did_document,
      privateKeys: req.body.privateKeys,
      overwrite: req.body.overwrite,
    })
    console.log("DID importado correctamente");
    res.send("DID importado correctamente");
  } catch (error) {
    console.error("Error al mostrar los DIDS:", error);
    res.status(500).send("Error al mostrar los DIDS");
  }
}