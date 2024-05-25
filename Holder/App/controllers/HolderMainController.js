import { KeyType, KeyDerivationMethod } from "@credo-ts/core";
import { Holder_gen } from "../../Holder_gen.js";
import { holder_semilla } from "../../config.js";
import jwt from "jsonwebtoken";
import axios from "axios";

// CONSTANTES----------------------------------------------------------------------------------------------->
// Esto son unos valores registrados en el ledger de la red local
// CAMBIAR POR LOS OBTENIDOS AL REGISTRARLOS EN EL LEDGER
let holder_did = {
  Seed: "holdersemilladebemantenersecreto",
  DID: "6qfdvdUv1BdUAmAmK7SVjp",
  Verkey: "4BauU6X7K5GG7Gq6t2r5BV9gjuYoQbSRBr6MFFvXfq1b",
};

// Define un DID de Indy no calificado que será devuelto después de registrar la semilla en el ledger
const imported_did = holder_did.DID;

// Metodo descartado
// const cheqddid = `did:cheqd:${unqualifiedIndyDid}`;

export const testeo = async (req, res) => {
  let Holder = new Holder_gen();
  let did = `did:indy:bcovrin:test:${imported_did}`;
  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }
    // CAMBIAR TESTEAR EN IP PUBLICA
    let url = "http://issuer:5000/testeo"; // En teoria deberia de poner loclahost, pero entonces no funciona
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
    await esperar100Segundos();

    await Holder.shutdown();
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }
    let url2 = "http://verfier:5000/testeo"; // En teoria deberia de poner loclahost, pero entonces no funciona
    let invitation_url2;
    await axios
      .get(url2)
      .then((response) => {
        invitation_url2 = response.data.invitationurl.invitationUrl;
        console.log("Respuesta peticion:", invitation_url2);
      })
      .catch((error) => {
        throw new Error(`Hubo un problema con la peticion: ${error}`);
      });

    await Holder.acceptConnection(invitation_url2);


  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Holder.shutdown();
  }
};

export const cred_cre = (req, res) => {
  req.session.id = req.body.id;
  req.session.key = req.body.key;
  req.session.name = req.body.name;
  res.redirect("/solitarcred");
};

export const sol_cred = async  (req, res) => {
  let id = req.session.id;
  let key = req.session.key;
  let name = req.session.name;
  // COMPLETAR
  // HACER HOLDER WALLET CON PARAMETROS PASADOS
  let Holder = new Holder_gen();
  try {
    await Holder.initialize();
    if (Holder.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Holder agent. It has not initialized`
      );
    }
    // CAMBIAR TESTEAR EN IP PUBLICA
    let base_url = "http://issuer:5000/glob"; // En teoria deberia de poner loclahost, pero entonces no funciona
    let url = `${base_url}?name=${name}`
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
    await esperar100Segundos();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Holder.shutdown();
  }
  res.redirect("/ESTAPORVER")
};



export const crear_wall = (req, res) => {
  
  res.render("cre_wall");
};

export const crear_cred = (req, res) => {
  
  res.render("cre_cred");
};

// PROTOCOLO OIDC A PARTIR DE AQUI ------------------------------------------>

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
};

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

// ESTA FUNCION ESTA SOLO PARA QUE SE AUTOCOMPLETEN LAS PETICIONES, SINO SE APAGAN LOS AGENTES
function esperar100Segundos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100000);
  });
}
