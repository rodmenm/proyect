import { KeyType, KeyDerivationMethod } from "@credo-ts/core";
import { Holder_gen } from "../../Holder/Holder_gen.js";
import { Issuer_gen } from "../../Issuer/Issuer_gen.js";
import { Verifier_gen } from "../../Verifier/Verifier_gen.js";
import { semilla } from "../../config.js";
import jwt from "jsonwebtoken";
import axios from "axios";

let kk = null; // major security problem
let mm = null;
const secretKey = "myclientsecret";

const generateToken = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";
  for (let k = 0; k < 10; k++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
};

const tokengen = (user, nonce) => {
  let payload = {
    user: user,
    nonce: nonce,
  }; // COMPLETAR
  // QUE SE DEVUELVAN COSAS EN FUNCION DE CADA USUARIO
  let token = jwt.sign(payload, secretKey, {
    algorithm: "HS256", // Algoritmo de firma
    expiresIn: 3600, // Tiempo de expiración (1 hora en este ejemplo)
    subject: "agente", // Sujeto del token
    audience: "my_client_id", // Audiencia del token (tu cliente en Keycloak)
    issuer: "invented", // Emisor del token (tu proveedor de identidad)
  });
  return token;
};

const codegen = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";
  for (let k = 0; k < 22; k++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

export const logeo = (req, res) => {
  const { scope, state, response_type, client_id, redirect_uri, nonce } =
    req.query;
  if (
    !scope ||
    !state ||
    !response_type ||
    !client_id ||
    !redirect_uri ||
    !nonce
  ) {
    return res
      .status(400)
      .send("Faltan parámetros requeridos en la solicitud.");
  }
  // COMPLETAR
  // COMPROBAR QUE LOS PARAMETROS RECIBIDOS SON CORRECTOS
  kk = nonce;
  req.session.authParams = {
    scope,
    state,
    response_type,
    client_id,
    redirect_uri,
    nonce,
  };
  res.render("login");
};

export const logeocheck = (req, res) => {
  const { scope, state, response_type, client_id, redirect_uri, nonce } =
    req.session.authParams;
  console.log(req.session.authParams);
  console.log(redirect_uri);
  // COMPLETAR
  // ESTO SOLO ES SOLO PARA COMPROBAR EL CORRECTO FUNCIONAMIENTO DEL PROTOCOLO OIDC
  // HABRA QUE ESTABLECER EL SISTEMA DE AUTENTICACiÓN CORRECTAMENTE
  let wid = req.body.id;
  let wkey = req.body.key;
  if (wid == "agente" && wkey == "testkey") {
    let code = codegen();
    console.log(code);
    let redirectUrl = encodeURIComponent(redirect_uri);
    let url = `${redirect_uri}?code=${code}&state=${state}&redirect_uri=${redirectUrl}`;
    console.log(url);
    res.redirect(url);
  } else {
    res.send("NO LOGEADO");
  }
};

export const givtok = (req, res) => {
  let pp = req.body;
  console.log(pp);

  let user = {
    wallet: "agente", // COMPLETAR
    walletkey: "testkey", // pasar datos de usuario de forma correcta
  };
  let nonce = kk;
  let tokenid = tokengen(user, nonce);
  let atoken = generateToken();
  let rtoken = generateToken();

  res.status(200).json({
    access_token: atoken,
    token_type: "Bearer",
    refresh_token: rtoken,
    expires_in: 3600,
    id_token: tokenid,
  });
};

// COMPLETAR
// ESTO ES OPCIONAL
// NO LO INCLUIRIA
export const userinfo = (req, res) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const userInfo = {
    sub: "agente", // depende de lo de antes, y debe ser unico
    email_verified: false,
    preferred_username: "agente",
  };
  res.status(200).json(userInfo);
};

export const testeo = async (req, res) => {
  let Holder = new Holder_gen();
  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    let url = "http://localhost:5000/glob";
    let invitation_url;
    axios
      .get(url)
      .then((response) => {
        invitation_url = response.data.invitation;
        console.log("Respuesta peticion:", invitation);
      })
      .catch((error) => {
        console.error("Hubo un problema con la petición axios:", error);
      });

    await Holder.acceptConnection(invitation_url);

    await Holder.credentialOfferListener();
    
    


  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Holder.shutdown();
  }
};



// CREADO PARA TESTEAR MAS RAPIDO
export const pp = async (req, res) => {
  let Issuer = new Issuer_gen();
  let Holder = new Holder_gen();
  let did = `did:indy:bcovrin:test:${imported_did}`;
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    // NO VA ESTO DEVUELVE UN OBJETO, NO UN STRING
    // let did_glob = await Issuer.issuerFinal.agent.dids.create({
    //   method: "cheqd",
    //   secret: {
    //     verificationMethod: {
    //       id: "key-1",
    //       type: "Ed25519VerificationKey2020",
    //     },
    //   },
    //   options: {
    //     network: "testnet",
    //     methodSpecificIdAlgo: "uuid",
    //   },
    // });

    // ESTE TAMPOCO
    // let did_glob = await Issuer.issuerFinal.agent.dids.create({
    //   method: "indy",
    //   secret: {
    //     verificationMethod: {
    //       id: "key-1",
    //       type: "Ed25519VerificationKey2020",
    //     },
    //   },
    //   options: {
    //     network: "testnet",
    //     methodSpecificIdAlgo: "uuid",
    //   },
    // });
    // if (did_glob.didState.state === "failed") {
    //   throw new Error(
    //     `Error creating did : ${did.didState.reason}`
    //   );
    // }

    await Issuer.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    // NO SE PUEDE CREAR UN SCHEMA 2 VECES CON LOS MISMOS PARAMETROS PASADOS AQUI DEBAJO
    let schemaResult = await Issuer.agent.modules.anoncreds.registerSchema({
      schema: {
        attrNames: ["name", "club", "date"],
        issuerId: did,
        name: "Malorca teamm",
        version: "1.0.0",
      },
      options: {},
    });

    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error creating schema: ${schemaResult.schemaState.reason}`
      );
    }

    const credentialDefinitionResult =
      await Issuer.agent.modules.anoncreds.registerCredentialDefinition({
        credentialDefinition: {
          tag: "default_tag",
          issuerId: did,
          schemaId: schemaResult.schemaState.schemaId,
        },
        options: {
          supportRevocation: false,
          endorserMode: "internal",
          endorserDid: did,
        },
      });

    if (
      credentialDefinitionResult.credentialDefinitionState.state === "failed"
    ) {
      throw new Error(
        `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
      );
    }

    let invitation = await Issuer.createNewInvitation();
    // let invitation2 = await Issuer.createLegacyInvitation();

    // Se acepta una o la otra
    // NO LAS 2 A LA VEZ
    await Holder.acceptConnection(invitation.invitationUrl);
    // await Holder.acceptConnection(invitation2);

    const connectionRecord = await Issuer.getConnectionRecord();

    let credential = await Issuer.agent.credentials.offerCredential({
      connectionId: connectionRecord.id,
      protocolVersion: "v2",
      credentialFormats: {
        anoncreds: {
          attributes: [
            { name: "name", value: "Muriqi" },
            { name: "club", value: "Mallorca" },
            { name: "date", value: "01/01/2022" },
          ],
          credentialDefinitionId:
            credentialDefinitionResult.credentialDefinitionState
              .credentialDefinitionId,
        },
      },
    });

    Holder.acceptCred();

    res.send("TODO GUAY");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Issuer.shutdown();
    await Holder.shutdown();
  }
};

// CREADO PARA TESTEAR MAS RAPIDO
export const tt = async (req, res) => {
  let Issuer = new Issuer_gen();
  let Holder = new Holder_gen();
  let did = `did:indy:bcovrin:test:${imported_did}`;
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    // NO VA ESTO DEVUELVE UN OBJETO, NO UN STRING
    // let did_glob = await Issuer.issuerFinal.agent.dids.create({
    //   method: "cheqd",
    //   secret: {
    //     verificationMethod: {
    //       id: "key-1",
    //       type: "Ed25519VerificationKey2020",
    //     },
    //   },
    //   options: {
    //     network: "testnet",
    //     methodSpecificIdAlgo: "uuid",
    //   },
    // });

    // ESTE TAMPOCO
    // let did_glob = await Issuer.issuerFinal.agent.dids.create({
    //   method: "indy",
    //   secret: {
    //     verificationMethod: {
    //       id: "key-1",
    //       type: "Ed25519VerificationKey2020",
    //     },
    //   },
    //   options: {
    //     network: "testnet",
    //     methodSpecificIdAlgo: "uuid",
    //   },
    // });
    // if (did_glob.didState.state === "failed") {
    //   throw new Error(
    //     `Error creating did : ${did.didState.reason}`
    //   );
    // }

    await Issuer.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    // NO SE PUEDE CREAR UN SCHEMA 2 VECES CON LOS MISMOS PARAMETROS PASADOS AQUI DEBAJO
    let schemaResult = await Issuer.agent.modules.anoncreds.registerSchema({
      schema: {
        attrNames: ["name", "club", "date"],
        issuerId: did,
        name: "Mallorca teamm",
        version: "1.0.0",
      },
      options: {
        endorserMode: "internal",
        endorserDid: did,
      },
    });

    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error creating schema: ${schemaResult.schemaState.reason}`
      );
    }

    const credentialDefinitionResult =
      await Issuer.agent.modules.anoncreds.registerCredentialDefinition({
        credentialDefinition: {
          tag: "default_tag",
          issuerId: did,
          schemaId: schemaResult.schemaState.schemaId,
        },
        options: {
          supportRevocation: false,
          endorserMode: "internal",
          endorserDid: did,
        },
      });

    if (
      credentialDefinitionResult.credentialDefinitionState.state === "failed"
    ) {
      throw new Error(
        `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
      );
    }

    let invitation = await Issuer.createNewInvitation();
    // let invitation2 = await Issuer.createLegacyInvitation();

    // Se acepta una o la otra
    // NO LAS 2 A LA VEZ
    await Holder.acceptConnection(invitation.invitationUrl);
    // await Holder.acceptConnection(invitation2);

    const connectionRecord = await Issuer.getConnectionRecord();
    await Issuer.agent.connections.returnWhenIsConnected(connectionRecord.id);

    let credential = await Issuer.agent.credentials.offerCredential({
      connectionId: connectionRecord.id,
      protocolVersion: "v2",
      credentialFormats: {
        anoncreds: {
          attributes: [
            { name: "name", value: "Muriqi" },
            { name: "club", value: "Mallorca" },
            { name: "date", value: "01/01/2022" },
          ],
          credentialDefinitionId:
            credentialDefinitionResult.credentialDefinitionState
              .credentialDefinitionId,
        },
      },
    });

    Holder.acceptCredentialOffer(credential);

    res.send("TODO GUAY");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Issuer.shutdown();
    await Holder.shutdown();
  }
};

// A PARTIR DE AQUI SE GESTIONAN CONTROLADORES QUE SIRVEN A MODO DE PRUEBA

// CONSTANTES----------------------------------------------------------------------------------------------->

// Esto son unos valores registrados en el ledger de bcovrin
let bcovrin_did = {
  Seed: "misemilladebemantenerseensecreto",
  DID: "No6XpAd5Ek7CnrNJA4a4RB",
  Verkey: "CsyYhd8KzQ6EAyt58Hfs6R984f5QpmTayUdjdTcJU47U",
};

// Define un DID de Indy no calificado que será devuelto después de registrar la semilla en bcovrin
const imported_did = bcovrin_did.DID;

// Construye el DID de Indy completo utilizando el DID no calificado
// const indyDid = `did:cheqd:bcovrin:test:${unqualifiedIndyDid}`;

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
function change(req) {
  let Wallet_config = defaultHolder_walletConfig;
  Wallet_config.id = req.body.new_id;
  Wallet_config.key = req.body.new_key;
  return Wallet_config;
}

async function ini_holder(wallet_conf) {
  let Holder = new HolderFinal();
  await Holder.initializeHolder(wallet_conf);
  return Holder;
}

async function ini_issuer() {
  let Issuer = new IssuerFinal();
  await Issuer.initializeIssuer();
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
// Ahora mismo NO FUNCIONA LAS FUNCIONES WALLETS, ASI ES COMO SE REALIZARA EN CASO DE QUERER MODIFICAR WALLETS

export async function save_wallet(req, res) {
  //NO SIRVE
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
    res.redirect("/");
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).send("Error al guardar: " + error);
  }
}

export async function cre_wallet(req, res) {
  //
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let new_wallet_config = change(req);
    await Holder.holderFinal.agent.wallet.create(new_wallet_config);
    console.log("Wallet creada correctamente");
    await Holder.shutdownHolder();
    res.redirect("/");
  } catch (error) {
    console.error("Wallet no creada ", error);
    res.status(500).send("Error " + error);
  }
}

export async function ini_wallet(req, res) {
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let new_wallet_config = change(req);
    await Holder.holderFinal.agent.wallet.initialize(new_wallet_config);
    console.log("Wallet inicializada correctamente");
    await Holder.shutdownHolder();
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cre_op_wallet(req, res) {
  //LA WALLET DEBE ESTAR CERRADA ANTES DE CORRER EL COMANDO
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let new_wallet_config = change(req);
    await Holder.holderFinal.agent.wallet.createAndOpen(new_wallet_config);
    console.log("Wallet creada y abierta correctamente");
    await Holder.shutdownHolder();
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function op_wallet(req, res) {
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let new_wallet_config = change(req);
    await Holder.holderFinal.agent.wallet.open(new_wallet_config);
    console.log("Wallet abierta correctamente");
    await Holder.shutdownHolder();
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function cl_wallet(req, res) {
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let new_wallet_config = change(req);
    await Holder.holderFinal.agent.wallet.close(new_wallet_config);
    console.log("Wallet cerrada correctamente");
    await Holder.shutdownHolder();
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function gnonce(req, res) {
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let new_wallet_config = change(req);
    let nonce = await Holder.holderFinal.agent.wallet.generateNonce(
      req.session.holder_walletConfig
    );
    await Holder.shutdownHolder();
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
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let new_wallet_config = change(req);
    await Holder.holderFinal.agent.wallet.delete();
    console.log("Wallet borrada correctamente");
    await Holder.shutdownHolder();
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
    let Holder = await ini_holder(req.session.holder_walletConfig);
    const key = await Holder.holderFinal.agent.wallet.createKey({
      seed: null,
      privateKey: null,
      keyType: "ed25519",
    });
    console.log("Key generada");
    console.log(key);
    await Holder.shutdownHolder();
    res.redirect("/");
  } catch (error) {
    console.error("Error ", error);
    res.status(500).send("Error " + error);
  }
}

export async function res_did(req, res) {
  //NO VA
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let didDoc = await Holder.holderFinal.agent.dids.resolve({
      did: req.body.did_url,
      options: req.body.options,
    });
    await Holder.shutdownHolder();
    res.send(didDoc);
    l;
  } catch (error) {
    console.error("Error al resolver el DID:", error);
    res.status(500).send("Error al resolver el DID: " + error);
  }
}

export async function crear_did(req, res) {
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
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
    await Holder.shutdownHolder();
    res.send(did);
  } catch (error) {
    console.error("Error al crear el DID:", error);
    res.status(500).send("Error al crear el DID: " + error);
  }
}

export async function update_did(req, res) {
  // TESTEAR
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
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
    await Holder.shutdownHolder();
    res.send(req.body.didDocument);
  } catch (error) {
    console.error("Error al actualizar el DID:", error);
    res.status(500).send("Error al actualizar el DID: " + error);
  }
}

export async function deac_did(req, res) {
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
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
    await Holder.shutdownHolder();
    res.send("Deactivated " + req.body.did_url);
  } catch (error) {
    console.error("Error al desactivar el DID:", error);
    res.status(500).send("Error al desactivar el DID: " + error);
  }
}

export async function dids_creados(req, res) {
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    let dids = await Holder.holderFinal.agent.dids.getCreatedDids();
    console.log("DIDs mostrados correctamente");
    await Holder.shutdownHolder();
    res.send(dids);
  } catch (error) {
    console.error("Error al mostrar los DIDS:", error);
    res.status(500).send("Error al mostrar los DIDS: " + error);
  }
}

export async function import_did(req, res) {
  // TESTEAR
  try {
    let Holder = await ini_holder(req.session.holder_walletConfig);
    await Holder.holderFinal.agent.dids.import({
      did: req.body.did_url,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
      overwrite: true,
    });

    /*
    
    await Issuer.issuerFinal.agent.dids.import({
      did: did[1].did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });
    */

    console.log("DID importado correctamente");
    await Holder.shutdownHolder();
    res.send("DID importado correctamente");
  } catch (error) {
    console.error("Error al importar el DID:", error);
    res.status(500).send("Error al importar el DID: " + error);
  }
}

export async function schem(req, res) {
  // TESTEAR
  try {
    let Issuer = await ini_issuer();

    await Issuer.issuerFinal.agent.dids.create({
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
    console.log("Issuer DID creado correctamente");

    let dids = await Issuer.issuerFinal.agent.dids.getCreatedDids();

    await Issuer.issuerFinal.agent.dids.import({
      did: dids[0].did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    console.log("Issuer did importado correctamente");

    let schemaResult =
      await Issuer.issuerFinal.agent.modules.anoncreds.registerSchema({
        schema: {
          attrNames: ["name"],
          issuerId: dids[0].did,
          name: "Example Schema to register",
          version: "1.0.0",
        },
        options: {},
      });

    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error creating schema: ${schemaResult.schemaState.reason}`
      );
    }

    console.log(schemaResult);

    const credentialDefinitionResult =
      await Issuer.issuerFinal.agent.modules.anoncreds.registerCredentialDefinition(
        {
          credentialDefinition: {
            tag: "default_tag",
            issuerId: dids[0].did,
            schemaId: schemaResult.schemaState.schemaId,
          },
          options: {},
        }
      );

    if (
      credentialDefinitionResult.credentialDefinitionState.state === "failed"
    ) {
      throw new Error(
        `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
      );
    }

    console.log("------------------------------------");
    console.log(credentialDefinitionResult);

    await Issuer.shutdownIssuer();

    res.redirect("/");
  } catch (error) {
    console.error("Error al importar el DID:", error);
    res.status(500).send("Error al importar el DID: " + error);
  }
}

export async function cred() {
  // TESTEAR
  try {
    let Issuer = await ini_issuer();
    let Holder = await ini_holder();

    await Issuer.issuerFinal.agent.dids.create({
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
    console.log("Issuer DID creado correctamente");

    await Holder.holderFinal.agent.dids.create({
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
    console.log("Holder DID creado correctamente");

    let didis = await Issuer.issuerFinal.agent.dids.getCreatedDids();
    let didho = await Holder.holderFinal.agent.dids.getCreatedDids();

    await Issuer.issuerFinal.agent.dids.import({
      did: didis[0].did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });
    console.log("Issuer did importado correctamente");

    await Holder.holderFinal.agent.dids.import({
      did: didho[0].did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });
    console.log("Holder did importado correctamente");

    let schemaResult =
      await Issuer.issuerFinal.agent.modules.anoncreds.registerSchema({
        schema: {
          attrNames: ["name"],
          issuerId: dids[0].did,
          name: "Example Schema to register",
          version: "1.0.0",
        },
        options: {},
      });

    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error creating schema: ${schemaResult.schemaState.reason}`
      );
    }

    console.log("schemaResult:" + schemaResult);

    const credentialDefinitionResult =
      await Issuer.issuerFinal.agent.modules.anoncreds.registerCredentialDefinition(
        {
          credentialDefinition: {
            tag: "default_tag",
            issuerId: dids[0].did,
            schemaId: schemaResult.schemaState.schemaId,
          },
          options: {},
        }
      );

    if (
      credentialDefinitionResult.credentialDefinitionState.state === "failed"
    ) {
      throw new Error(
        `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
      );
    }

    console.log("crednetial:" + credentialDefinitionResult);

    const indyCredentialExchangeRecord =
      await Issuer.issuerFinal.agent.credentials.offerCredential({
        protocolVersion: "v2",
        connectionId: "<connection id>",
        credentialFormats: {
          indy: {
            credentialDefinitionId: "<credential definition id>",
            attributes: [
              { name: "name", value: "Jane Doe" },
              { name: "age", value: "23" },
            ],
          },
        },
      });

    Holder.holderFinal.agent.events.on <
      CredentialStateChangedEvent >
      (CredentialEventTypes.CredentialStateChanged,
      async ({ payload }) => {
        switch (payload.credentialRecord.state) {
          case CredentialState.OfferReceived:
            console.log("received a credential");
            // custom logic here
            await Holder.holderFinal.agent.credentials.acceptOffer({
              credentialRecordId: payload.credentialRecord.id,
            });
          case CredentialState.Done:
            console.log(
              `Credential for credential id ${payload.credentialRecord.id} is accepted`
            );
            // For demo purposes we exit the program here.
            process.exit(0);
        }
      });

    await Issuer.shutdownIssuer();
    await Holder.shutdownHolder();

    res.redirect("/");
  } catch (error) {
    console.error("Error en la inicialización:", error);
    res.status(500).send("Error" + error);
  }
}

export async function initial_first() {
  // TESTEAR
  try {
    let Issuer = await ini_issuer();

    await Issuer.issuerFinal.agent.dids.create({
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
    console.log("Issuer DID creado correctamente");

    let dids = await Issuer.issuerFinal.agent.dids.getCreatedDids();

    await Issuer.issuerFinal.agent.dids.import({
      did: dids[0].did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    console.log("Issuer did importado correctamente");

    let schemaResult =
      await Issuer.issuerFinal.agent.modules.anoncreds.registerSchema({
        schema: {
          attrNames: ["name"],
          issuerId: dids[0].did,
          name: "Example Schema to register",
          version: "1.0.0",
        },
        options: {},
      });

    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error creating schema: ${schemaResult.schemaState.reason}`
      );
    }

    console.log(schemaResult);

    await Issuer.shutdownIssuer();

    res.redirect("/");
  } catch (error) {
    console.error("Error en la inicialización:", error);
    res.status(500).send("Error" + error);
  }
}
