import { KeyType, KeyDerivationMethod } from "@credo-ts/core";
import { Verifier_gen } from "../../Verifier_gen.js";
import { verifier_semilla } from "../../config.js";

// CONSTANTES --------------------------------------------------------------------------->
// Esto son unos valores registrados en el ledger de la red local
// CAMBIAR POR LOS OBTENIDOS AL REGISTRARLOS EN EL LEDGER
let verifier_did = {
  Seed: "verifisemilladebemantenersecreto",
  DID: "HYcZ7deXQ5nQSLKSEBf7QR",
  Verkey: "A22FzhkJ13gtCCAAbfYHy6GPbrcbRGCoVcWxJMP3ikhT"
};

// SON EL RESULTADO PREVIO DE HABERLOS GENERADO ANTES
// CAMBIAR POR LOS OBTENIDOS AL GENERARLOS EN EL LEDGER
const imported_did = verifier_did.DID;

// RUTAS -------------------------------------------------------------------------------->

// SIRVE PARA SOLICITAR PRUEBAS 
export const glob = async (req, res) => {
  let Verifier = new Verifier_gen();
  let did = `did:indy:bcovrin:test:${imported_did}`;
  try {
    await Verifier.initialize();
    if (Verifier.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Verifier agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR EL DID DE FORMA MANUAL EN LA TESTNET DE BCOVRIN O EN LA RED PERSONAL DE VON(RECOMENDADO)
    await Verifier.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: verifier_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    
    let invitation = await Verifier.createNewInvitation();

    res.json({ invitationurl: invitation });
    await Verifier.waitForConnection();

    
    await esperar100Segundos();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await Issuer.shutdown();
  }
};

// ESTA FUNCION ESTA SOLO PARA QUE SE AUTOCOMPLETEN LAS PETICIONES, SINO SE APAGAN LOS AGENTES
function esperar100Segundos() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 100000);
  });
}