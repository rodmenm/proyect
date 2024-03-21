import {
  KeyType,
  TypedArrayEncoder,
  KeyDerivationMethod,
} from "@aries-framework/core";
import { HolderFinal } from "../../Holder/Holder.js";
import { IssuerFinal } from "../../Issuer/Issuer.js";
import { VerifierFinal } from "../../Verifier/Verifier.js";

// CONSTANTES----------------------------------------------------------------------------------------------->

// Define una semilla que se utilizará para generar claves criptográficas
const seed = TypedArrayEncoder.fromString(`semilla`); // Debe mantenerse seguro en producción!

// Define un DID de Indy no calificado que será devuelto después de registrar la semilla en bcovrin
const unqualifiedIndyDid = `poner_aqui_parte_final_did_no_reconocido`;

// Construye el DID de Indy completo utilizando el DID no calificado
const indyDid = `did:cheqd:bcovrin:test:${unqualifiedIndyDid}`;

// Configuracion de la wallet
const defaultHolder_walletConfig = {
  id: "Holder_Wallet", // ID de la cartera
  key: "holdertestkey0000", // Clave de la cartera (debe ser una contraseña segura en un entorno real)
  keyDerivationMethod: KeyDerivationMethod.Argon2IMod, // Método de derivación de clave
  storage: {
    type: "sqlite", // Tipo de almacenamiento: SQLite
    database: "holder.db", // Archivo de base de datos SQLite
  },
};

// FUNCIONES------------------------------------------------------------------------------------------------->
// AGENTES

async function ini_holder(wallet_conf) {
  let Holder = new HolderFinal();
  await Holder.initializeHolder(wallet_conf);
  return Holder;
}

async function shu_holder(Holder) {
  await Holder.shutdownHolder();
}

async function ini_issuer() {
  let Issuer = new IssuerFinal();
  await Issuer.initializeHolder();
  return Issuer;
}

async function ini_verifier() {
  let Verifier = new VerifierFinal();
  await Verifier.initializeVerifier();
  return Verifier;
}

// CONTROLADORES DE LAS RUTAS-------------------------------------------------------------------------------->
export const index = (req, res) => {
  if (!req.session.initialized) {
    req.session.holder_walletConfig = defaultHolder_walletConfig;
    req.session.initialized = true;
  }
  res.render("index", {
    w_id: req.session.holder_walletConfig.id,
    w_key: req.session.holder_walletConfig.key,
  });
};

// WALLET------------------------------------------------------------------------------------------------------------->

export async function save_wallet(req, res) {
  try {
    if (req.body.id) {
      req.session.w_id = req.body.id;
      req.session.holder_walletConfig.id = req.body.id;
    }
    if (req.body.key) {
      req.session.w_key = req.body.key;
      req.session.holder_walletConfig.key = req.body.key;
    }
    console.log("Datos guardados");
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).send("Error al guardar: " + error);
  }
}

export async function cre_wallet(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    await Holder.holderFinal.agent.wallet.create(
      req.session.holder_walletConfig
    );
    console.log("Wallet creada correctamente");
    shu_holder(Holder);
    res.redirect("/");
  } catch (error) {
    console.error("Wallet no creada ", error);
    res.status(500).send("Error " + error);
  }
}

export async function ini_wallet(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    await Holder.holderFinal.agent.wallet.initialize(
      req.session.holder_walletConfig
    );
    console.log("Wallet inicializada correctamente");
    shu_holder(Holder);
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cre_op_wallet(req, res) {
  //LA WALLET DEBE ESTAR CERRADA ANTES DE CORRER EL COMANDO
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    await Holder.holderFinal.agent.wallet.createAndOpen(
      req.session.holder_walletConfig
    );
    console.log("Wallet creada y abierta correctamente");
    shu_holder(Holder);
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function op_wallet(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    await Holder.holderFinal.agent.wallet.open(req.session.holder_walletConfig);
    console.log("Wallet abierta correctamente");
    shu_holder(Holder);
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cl_wallet(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    await Holder.holderFinal.agent.wallet.close(
      req.session.holder_walletConfig
    );
    console.log("Wallet cerrada correctamente");
    shu_holder(Holder);
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function gnonce(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    let nonce = await Holder.holderFinal.agent.wallet.generateNonce(
      req.session.holder_walletConfig
    );
    shu_holder(Holder);
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
    let Holder = ini_holder(req.session.holder_walletConfig);
    await Holder.holderFinal.agent.wallet.delete();
    console.log("Wallet borrada correctamente");
    shu_holder(Holder);
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function exp_wallet(req, res) {
  //NO IMPLEMENTADO
  try {
    res.send("Not implemented yet");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function imp_wallet(req, res) {
  //NO IMPLEMENTADO
  try {
    res.send("Not implemented yet");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cre_key(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    const key = await Holder.holderFinal.agent.wallet.createKey({
      seed: null,
      privateKey: null,
      keyType: "ed25519",
    });
    console.log("Key generada");
    console.log(key);
    shu_holder();
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function res_did(req, res) {
  //NO VA
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    let didDoc = await Holder.holderFinal.agent.dids.resolve({
      did: req.body.did_url,
      options: req.body.options,
    });
    shu_holder(Holder);
    res.send(didDoc);
    l;
  } catch (error) {
    console.error("Error al resolver el DID:", error);
    res.status(500).send("Error al resolver el DID: " + error);
  }
}

export async function crear_did(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
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
    shu_holder(Holder);
    res.send(did);
  } catch (error) {
    console.error("Error al crear el DID:", error);
    res.status(500).send("Error al crear el DID: " + error);
  }
}

export async function update_did(req, res) {
  // TESTEAR
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
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
    shu_holder(Holder);
    res.send(req.body.didDocument);
  } catch (error) {
    console.error("Error al actualizar el DID:", error);
    res.status(500).send("Error al actualizar el DID: " + error);
  }
}

export async function deac_did(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
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
    shu_holder(Holder);
    res.send("Deactivated " + req.body.did_url);
  } catch (error) {
    console.error("Error al desactivar el DID:", error);
    res.status(500).send("Error al desactivar el DID: " + error);
  }
}

export async function dids_creados(req, res) {
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
    let dids = await Holder.holderFinal.agent.dids.getCreatedDids();
    console.log("DIDs mostrados correctamente");
    shu_holder(Holder);
    res.send(dids);
  } catch (error) {
    console.error("Error al mostrar los DIDS:", error);
    res.status(500).send("Error al mostrar los DIDS: " + error);
  }
}

export async function import_did(req, res) {
  // TESTEAR
  try {
    let Holder = ini_holder(req.session.holder_walletConfig);
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
    shu_holder(Holder);
    res.send("DID importado correctamente");
  } catch (error) {
    console.error("Error al importar el DID:", error);
    res.status(500).send("Error al importar el DID: " + error);
  }
}
