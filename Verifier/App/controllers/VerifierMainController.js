import { Verifier_gen } from "../../Verifier_gen.js";
import { verifier_semilla } from "../../config.js";
import { KeyType } from "@credo-ts/core";

// CONSTANTES --------------------------------------------------------------------------->
// Esto son unos valores registrados en el ledger de la red local
// CAMBIAR POR LOS OBTENIDOS AL REGISTRARLOS EN EL LEDGER
const verifier_did = {
  Seed: "verifisemilladebemantenersecreto",
  DID: "HYcZ7deXQ5nQSLKSEBf7QR",
  Verkey: "A22FzhkJ13gtCCAAbfYHy6GPbrcbRGCoVcWxJMP3ikhT"
};

// SON EL RESULTADO PREVIO DE HABERLOS GENERADO ANTES
// CAMBIAR POR LOS OBTENIDOS AL GENERARLOS EN EL LEDGER
const imported_did = verifier_did.DID;

const schemaId =
  "did:indy:bcovrin:test:7hVEkxK3356FwfmCQ9muR7/anoncreds/v0/SCHEMA/Mallorca teamm/1.0.0";
const credentialDefId =
  "did:indy:bcovrin:test:7hVEkxK3356FwfmCQ9muR7/anoncreds/v0/CLAIM_DEF/8/default_tag";


// CONTROLADORES PARA TESTEAR----------------------------------------------------------------------------------------------->

export const testeo = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Verifier = new Verifier_gen();
  
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

    
    const invitation = await Verifier.createNewInvitation();

    res.json({ invitationurl: invitation });
    await Verifier.waitForConnection();

    const proofAttribute = {
      name: {
        name: 'name',
        restrictions: [
          {
            cred_def_id: credentialDefId,
          },
        ],
      },
    }

    await Verifier.agent.proofs.requestProof({
      protocolVersion: 'v2',
      connectionId: Verifier.connectionRecord.id,
      proofFormats: {
        anoncreds: {
          name: 'proof-request',
          version: '1.0',
          requested_attributes: proofAttribute,
        },
      },
    });
    
    await esperar100Segundos();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await Verifier.shutdown();
  }
};


// CONTROLADORES FINALES-------------------------------------------------------------------------------------------------->

// SIRVE PARA SOLICITAR PRUEBAS DE UNA CREDENCIAL 
export const glob = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Verifier = new Verifier_gen();
  
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

    
    const invitation = await Verifier.createNewInvitation();

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