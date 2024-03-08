import {
  KeyType,
  TypedArrayEncoder,
  KeyDerivationMethod,
} from "@aries-framework/core";

// Define una semilla que se utilizará para generar claves criptográficas
const seed = TypedArrayEncoder.fromString(`walletestkey`); // Debe mantenerse seguro en producción!

// Define un DID de Indy no calificado que será devuelto después de registrar la semilla en bcovrin
const unqualifiedIndyDid = `poner_aqui_parte_final_did_no_reconocido`;

// Construye el DID de Indy completo utilizando el DID no calificado
const indyDid = `did:cheqd:bcovrin:test:${unqualifiedIndyDid}`;

// Configuracion de la wallet
let walletConfig = {
  id: "WalletCrear", // ID de la cartera
  key: "WalletKeyCrear0000", // Clave de la cartera (debe ser una contraseña segura en un entorno real)
  keyDerivationMethod: KeyDerivationMethod.Argon2IMod, // Método de derivación de clave
  storage: {
    type: "sqlite", // Tipo de almacenamiento: SQLite
    database: "holder.db", // Ruta al archivo de base de datos SQLite
  },
};

export const index = (req, res) => {
  res.render("index", { w_id: global.w_id, w_key: global.w_key });
};

export async function res_did(req, res) {
  //NO VA
  try {
    Holder = global.Holder;
    let didDoc = await Holder.holderFinal.agent.dids.resolve({
      did: req.body.did_url,
      options: req.body.options,
    });
    res.send(didDoc);
  } catch (error) {
    console.error("Error al resolver el DID:", error);
    res.status(500).send("Error al resolver el DID: " + error);
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
    res.status(500).send("Error al crear el DID: " + error);
  }
}

export async function update_did(req, res) {
  // TESTEAR
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.dids.update({
      did: req.body.did_url,
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
    res.status(500).send("Error al actualizar el DID: " + error);
  }
}

export async function deac_did(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.dids.deactivate({
      did: req.body.did_url,
      options: req.body.options,
      /*options: {
        network: "testnet",
        methodSpecificIdAlgo: "uuid",
      },*/
      secret: req.body.secret,
    });
    console.log("DID desactivado correctamente");
    res.send("Deactivated " + req.body.did_url);
  } catch (error) {
    console.error("Error al desactivar el DID:", error);
    res.status(500).send("Error al desactivar el DID: " + error);
  }
}

export async function dids_creados(req, res) {
  try {
    Holder = global.Holder;
    let dids = await Holder.holderFinal.agent.dids.getCreatedDids();
    console.log("DIDs mostrados correctamente");
    res.send(dids);
  } catch (error) {
    console.error("Error al mostrar los DIDS:", error);
    res.status(500).send("Error al mostrar los DIDS: " + error);
  }
}

export async function import_did(req, res) {
  // TESTEAR
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.dids.import({
      did: req.body.did_url,
      privateKeys: [
        {
          privateKey: seed,
          keyType: KeyType.Ed25519,
        },
      ],
      overwrite: true,
    });
    console.log("DID importado correctamente");
    res.send("DID importado correctamente");
  } catch (error) {
    console.error("Error al importar el DID:", error);
    res.status(500).send("Error al importar el DID: " + error);
  }
}

// WALLET

export async function cre_wallet(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.wallet.create(walletConfig);
    console.log("Wallet creada correctamente");
    res.redirect("/");
  } catch (error) {
    console.error("Wallet no creada ", error);
    res.status(500).send("Error " + error);
  }
}

export async function ini_wallet(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.wallet.initialize(walletConfig);
    console.log("Wallet inicializada correctamente");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cre_op_wallet(req, res) {
  //LA WALLET DEBE ESTAR CERRADA ANTES DE CORRER EL COMANDO
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.wallet.createAndOpen(walletConfig);
    console.log("Wallet creada y abierta correctamente");
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function op_wallet(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.wallet.open(walletConfig);
    console.log("Wallet abierta correctamente");
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cl_wallet(req, res) {
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.wallet.close(walletConfig);
    console.log("Wallet cerrada correctamente");
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function gnonce(req, res) {
  try {
    Holder = global.Holder;
    let nonce = await Holder.holderFinal.agent.wallet.generateNonce(
      walletConfig
    );
    console.log(nonce);
    res.send(nonce);
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function del_wallet(req, res) {
  // Borra wallet pero no su almacenamiento
  try {
    Holder = global.Holder;
    await Holder.holderFinal.agent.wallet.delete();
    console.log("Wallet borrada correctamente");
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function exp_wallet(req, res) {
  //NO VA
  try {
    res.send("Not implemented yet");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function imp_wallet(req, res) {
  //NO VA
  try {
    res.send("Not implemented yet");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function save_wallet(req, res) {
  try {
    if (req.body.id) {
      global.w_id = req.body.id;
      walletConfig = req.body.id;
    }
    if (req.body.id) {
      global.w_key = req.body.key;
      walletConfig = req.body.key;
    }
    console.log("Datos guardados");
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cre_key(req, res) {
  try {
    Holder = global.Holder;
    const key = await Holder.holderFinal.agent.wallet.createKey({
      seed: null,
      privateKey: null,
      keyType: "ed25519",
    });
    console.log(key);
    console.log("Key generada");
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}
