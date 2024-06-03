import { holder_semilla } from "../../config.js";
import { Holder_gen } from "../../Holder_gen.js";
import { KeyType } from "@credo-ts/core";
import jwt from "jsonwebtoken";
import axios from "axios";

// CONSTANTES--------------------------------------------------------------------------------------------------------------->

// Esto son unos valores registrados en el ledger de la red local
// CAMBIAR POR LOS OBTENIDOS AL REGISTRARLOS EN EL LEDGER
const holder_did = {
  Seed: "holdersemilladebemantenersecreto",
  DID: "6qfdvdUv1BdUAmAmK7SVjp",
  Verkey: "4BauU6X7K5GG7Gq6t2r5BV9gjuYoQbSRBr6MFFvXfq1b",
};

// DID de INDY (SOLO LA PARTE FINAL)
const imported_did = holder_did.DID;

// Metodo descartado para los dids
// const cheqddid = `did:cheqd:${unqualifiedIndyDid}`;

// CONTROLADORES PARA TESTEAR----------------------------------------------------------------------------------------------->

// SIRVE PARA TESTEAR LA OBTENCION DE UNA CREDENCIAL
export const testeo = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Holder = new Holder_gen();

  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    await Holder.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: holder_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    // CAMBIAR TESTEAR EN IP PUBLICA
    const url = "http://issuer:5000/testeo"; // En teoria deberia de poner loclahost, pero entonces no funciona
    let invitation_url;
    await axios
      .get(url)
      .then((response) => {
        invitation_url = response.data.invitationurl.invitationUrl;
        console.log("Respuesta peticion:", invitation_url);
      })
      .catch((error) => {
        throw new Error(`Hubo un problema con la peticion: ${error}`);
      });

    await Holder.acceptConnection(invitation_url);

    await Holder.credentialOfferListener();
    await esperar10Segundos();
    res.send("TODO GUAY!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Holder.shutdown();
  }
};

// SIRVE PARA TESTER LA VERIFICACION DE UNA CREDENCIAL
export const testeo2 = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Holder = new Holder_gen();

  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    await Holder.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: holder_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    const url = "http://verifier:6000/testeo"; // En teoria deberia de poner loclahost, pero entonces no funciona
    let invitation_url;
    await axios
      .get(url)
      .then((response) => {
        invitation_url = response.data.invitationurl.invitationUrl;
        console.log("Respuesta peticion:", invitation_url);
      })
      .catch((error) => {
        throw new Error(`Hubo un problema con la peticion: ${error}`);
      });

    await Holder.acceptConnection(invitation_url);

    await Holder.ProofRequestListener();

    await esperar10Segundos();
    if (Holder.hayerror) {
      res.send("Credencial Invalida");
      return;
    }
    res.send("TODO GUAY!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Holder.shutdown();
  }
};

export const testeo3 = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Holder = new Holder_gen();

  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    let did_glob = await Holder.agent.dids.create({
        method: "indy",
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


    res.send(did_glob);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Holder.shutdown();
  }
};


// CONTROLADORES FINALES-------------------------------------------------------------------------------------------------->

// SIRVE PARA ALMACENAR LAS VARIABLES PASADAS A LA VISTA
export const cred_cre = (req, res) => {
  req.session.wallet_id = req.body.id;
  req.session.wallet_key = req.body.key;
  req.session.wallet_name = req.body.name;
  res.redirect("/solitarcred");
};

// SIRVE PARA SOLICITAR UNA CREDENCIAL AL ISSUER CON EL NOMBRE PASADO ANTERIORMENTE Y GUARDARLO EN LA WALLET CREADA O ACCEDIDA ANTERIORMENTE
export const sol_cred = async (req, res) => {
  const name = req.session.wallet_name;
  const key = req.session.wallet_key;
  const id = req.session.wallet_id;
  let Holder = new Holder_gen(id, key);

  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    // CAMBIAR TESTEAR EN IP PUBLICA
    const base_url = "http://issuer:5000/glob"; // En teoria deberia de poner loclahost, pero entonces no funciona
    const url = `${base_url}/${name}`;
    let invitation_url;
    await axios
      .get(url)
      .then((response) => {
        invitation_url = response.data.invitationurl.invitationUrl;
        console.log("Respuesta peticion:", invitation_url);
      })
      .catch((error) => {
        throw new Error(`Hubo un problema con la peticion: ${error}`);
      });

    await Holder.acceptConnection(invitation_url);

    await Holder.credentialOfferListener(); // LAS CREDENCIALES SE ACEPTAN AUTOMATICAMENTE

    await esperar10Segundos(); // COMPLETAR BAJAR TIEMPO DE ESPERA
    res.redirect("/login"); // COMPLETAR PASAR PARAMETROS PARA LA VISTA KEYCLOAK
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Holder.shutdown();
  }
};

// MUESTRA LA VISTA PARA CREAR UNA WALLET Y OBTENER CREDENCIAL (AMBAS VISTAS HACEN LUEGO LO MISMO, SI NO EXISTE UNA WALLET PARA ABRIRLA, SE CRE AUTOMATICAMENTE)
export const crear_wall = (req, res) => {
  res.render("cre_wall");
};

// MUESTRA LA VISTA PARA ACCEDER A UNA WALLET Y OBTENER CREDENCIAL (AMBAS VISTAS HACEN LUEGO LO MISMO, SI NO EXISTE UNA WALLET PARA ABRIRLA, SE CRE AUTOMATICAMENTE)
export const crear_cred = (req, res) => {
  res.render("cre_cred");
};

// PROTOCOLO OIDC A PARTIR DE AQUI -------------------------------------------------------------------------------------------------->

let kk = null; // major security problem
const secretKey = "myclientsecret";

// SIRVE PARA GENERAR UN TOKEN NORMAL DE ACCESO PARA KEYCLOAK
const generateToken = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";
  for (let k = 0; k < 10; k++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
};

// SIRVE PARA GENERAR UN JWT DE ACCESO PARA KEYCLOAK
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
    audience: "myclientid", // Audiencia del token (tu cliente en Keycloak)
    issuer: "invented", // Emisor del token (tu proveedor de identidad)
  });
  return token;
};

// GENERA UN CODIGO QUE KEYCLOAK LUEGO USA PARA SOLICITAR UN TOKEN DE ACCESO, WORKFLOW TIPICO DE OIDC
const codegen = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";
  for (let k = 0; k < 22; k++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
};

// ATIENDE A LA RUTA PARA LOGEARSE Y **DEBERIA** COMPROBAR LOS PARAMETROS
export const logeo = (req, res) => {
  const { scope, state, response_type, client_id, redirect_uri, nonce } =
    req.query;

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

// SERVIA COMO TESTEO PARA EL PROTOCOLO OIDC
export const logeocheck2 = (req, res) => {
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

// COMPRUEBA QUE SE TENGA UNA CREDENCIAL Y REDIRIGE A KEYCLOAK DE VUELTA CON UN CODIGO
export const logeocheck = async (req, res) => {
  const { scope, state, response_type, client_id, redirect_uri, nonce } =
    req.session.authParams;

  const wid = req.body.id;
  const wkey = req.body.key;
  let autenticado = null;

  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Holder = new Holder_gen(wid, wkey);

  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }

    await Holder.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: holder_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    const url = "http://verifier:6000/glob"; // En teoria deberia de poner loclahost, pero entonces no funciona
    let invitation_url;
    await axios
      .get(url)
      .then((response) => {
        invitation_url = response.data.invitationurl.invitationUrl;
        console.log("Respuesta peticion:", invitation_url);
      })
      .catch((error) => {
        throw new Error(`Hubo un problema con la peticion: ${error}`);
      });

    await Holder.acceptConnection(invitation_url);

    await Holder.ProofRequestListener();

    await esperar10Segundos();
    if (Holder.hayerror) {
      res.send("Credencial Invalida");
      return;
    }
    autenticado = true;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await Holder.shutdown();
  }

  if (autenticado) {
    let code = codegen();
    let redirectUrl = encodeURIComponent(redirect_uri);
    let url = `${redirect_uri}?code=${code}&state=${state}&redirect_uri=${redirectUrl}`;
    console.log(url);
    res.redirect(url);
  } else {
    res.send("NO LOGEADO");
  }
};

// KEYCLOAK HACE UNA PETICON AQUI CON EL CODIGO ANTERIOR PARA OBTENER UN TOKEN
export const givtok = (req, res) => {
  let pp = req.body; // COMPLETAR
  console.log(pp); // COMPROBAR CODIGO DE ACCESI

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

// ESTA FUNCION ESTA SOLO PARA QUE SE AUTOCOMPLETEN LAS PETICIONES, SINO SE APAGAN LOS AGENTES
function esperar10Segundos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 20000);
  });
}
