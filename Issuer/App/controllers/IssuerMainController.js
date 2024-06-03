import { issuer_semilla } from "../../config.js";
import { Issuer_gen } from "../../Issuer_gen.js";
import { KeyType } from "@credo-ts/core";

// CONSTANTES --------------------------------------------------------------------------->
// Esto son unos valores registrados en el ledger de la red local
// CAMBIAR POR LOS OBTENIDOS AL REGISTRARLOS EN EL LEDGER
const issuer_did = {
  Seed: "issuersemilladebemantenersecreto",
  DID: "7hVEkxK3356FwfmCQ9muR7",
  Verkey: "4ejqSPdmShnQPRjdr9B9PzrQ4pP9p7FALhEyEkBYR9h5",
};

// SON EL RESULTADO PREVIO DE HABERLOS GENERADO ANTES
// CAMBIAR POR LOS OBTENIDOS AL GENERARLOS EN EL LEDGER
const imported_did = issuer_did.DID;
const schemaId =
  "did:indy:bcovrin:test:7hVEkxK3356FwfmCQ9muR7/anoncreds/v0/SCHEMA/Identificador/1.0.0";
const credentialDefId =
  "did:indy:bcovrin:test:7hVEkxK3356FwfmCQ9muR7/anoncreds/v0/CLAIM_DEF/17/default_tag";
  
// CONTROLADORES PARA TESTEAR----------------------------------------------------------------------------------------------->

// SIRVE PARA TESTEAR EL ENTREGAR CREDENCIALES
// ANTES DE CREAR UNA CREDENCIAL, ASEGURARSE DE QUE EL ID DEL SCHEMA Y LA CREDENCIAL ES CORRECTO Y HA SIDO ACTUALIZADO 
// TAMBIEN QUE HAY LA CREDENCIAL HA SIDO REGISTRADA AL CREARSE EL CONTENEDOR (ruta cre_cred)
// DESAFORTUNADAMENTE, SI SE INICIALIZA EL SISTEMA DE FORMA GLOBAL POR PRIMERA VEZ HABRA QUE TUMBAR LA IMAGEN DEL ISSUER PARA PONER EL ID DEL ESQUEMA Y LA CREDENCIAL DE MANERA CORRECTA
export const testeo = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Issuer = new Issuer_gen();
  
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR EL DID DE FORMA MANUAL EN LA TESTNET DE BCOVRIN O EN LA RED PERSONAL DE VON(RECOMENDADO)
    await Issuer.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: issuer_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    const schemaResult = await Issuer.agent.modules.anoncreds.getSchema(schemaId);
    if (!schemaResult) {
      throw new Error(`Error obtaining schema (Check logs)`);
    }

    const credentialDefinitionResult =
      await Issuer.agent.modules.anoncreds.getCredentialDefinition(
        credentialDefId
      );
    if (!credentialDefinitionResult) {
      throw new Error(`Error importing credential definition (Check logs)`);
    }

    const invitation = await Issuer.createNewInvitation();

    res.json({ invitationurl: invitation });
    await Issuer.waitForConnection();

    // Estaria bien mover esto a Issuer_gen
    await Issuer.agent.credentials.offerCredential({
      connectionId: Issuer.connectionRecord.id,
      protocolVersion: "v2",
      credentialFormats: {
        anoncreds: {
          attributes: [
            {
              name: "dni",
              value: "12345678A",
            },
            {
              name: "comunidad",
              value: "Madrid",
            },
            {
              name: "date",
              value: "01/01/2022",
            },
          ],
          credentialDefinitionId:
            credentialDefinitionResult.credentialDefinitionId,
        },
      },
    });
    await esperar10Segundos();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await Issuer.shutdown();
  }
};


// CONTROLADORES FINALES-------------------------------------------------------------------------------------------------->

// Sirve para crear el esquema de atributos que tendra una credencial
export const cre_schem = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Issuer = new Issuer_gen();
  
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR EL DID DE FORMA MANUAL EN LA TESTNET DE BCOVRIN O EN LA RED PERSONAL DE VON(RECOMENDADO)
    await Issuer.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: issuer_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    // NO SE PUEDE CREAR UN ESQUEMA IGUAL 2 VECES, CAMBIAR NOMBRE O VERSION
    // EL ESQUEMA SIRVE PARA DEFINIR LOS ATRIBUTOS TIENE LA CREDENCIAL
    // NO ITENE PORQUE CREARSE UNO, TAMBIEN SE PUEDE IMPORTAR
    let schemaResult = await Issuer.agent.modules.anoncreds.registerSchema({
      schema: {
        attrNames: ["dni", "comunidad", "date"],
        issuerId: did,
        name: "Identificador",
        version: "1.0.0",
      },
      options: {
        endorserMode: "internal",
        endorserDid: did,
      },
    });

    // SOLO SE COMPRUEBA EL ESTADO CUANDO SE CREA
    // CUANDO SE ACCEDE A UNO YA CREADO, EN CASO DE QUE SE DEVUELVA ALGO ES QUE YA ESTA HECHO
    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error creating schema: ${schemaResult.schemaState.reason}`
      );
    }
    console.log(schemaResult);
    res.send(schemaResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Issuer.shutdown();
  }
};

// SIRVE PARA CREAR UNA CREDENCIAL A PARTIR DE UN ESQUEMA
// ANTES DE CREAR UNA CREDENCIAL, ASEGURARSE DE QUE EL ID DEL SCHEMA ES CORRECTO Y HA SIDO ACTUALIZADO Y REGISTRADO EN EL LEDGER
// DESAFORTUNADAMENTE, SI SE INICIALIZA EL SISTEMA DE FORMA GLOBAL POR PRIMERA VEZ HABRA QUE TUMBAR LA IMAGEN DEL ISSUER PARA PONER EL ID DEL ESQUEMA DE MANERA CORRECTA
export const cre_cred = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  let Issuer = new Issuer_gen();
  
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR EL DID DE FORMA MANUAL EN LA TESTNET DE BCOVRIN O EN LA RED PERSONAL DE VON(RECOMENDADO)
    await Issuer.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: issuer_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    let schemaResult = await Issuer.agent.modules.anoncreds.getSchema(schemaId);
    if (!schemaResult) {
      throw new Error(`Error obtaining schema (Check logs)`);
    }

    // CUANDO SE CREA EL SCHEMARESULT, LA ID ESTA EN schemaResult.schemaState.schemaId
    const credentialDefinitionResult =
      await Issuer.agent.modules.anoncreds.registerCredentialDefinition({
        credentialDefinition: {
          tag: "default_tag",
          issuerId: did,
          schemaId: schemaResult.schemaId,
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
    console.log(credentialDefinitionResult);
    res.send(credentialDefinitionResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Issuer.shutdown();
  }
};


// SIRVE PARA ENTREGAR CREDENCIALES CON EL NOMBRE PASADO COMO PARAM
export const glob = async (req, res) => {
  const did = `did:indy:bcovrin:test:${imported_did}`;
  const name = req.params.name;
  let Issuer = new Issuer_gen();
  
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR EL DID DE FORMA MANUAL EN LA TESTNET DE BCOVRIN O EN LA RED PERSONAL DE VON(RECOMENDADO)
    await Issuer.agent.dids.import({
      did: did,
      overwrite: true,
      privateKeys: [
        {
          privateKey: issuer_semilla,
          keyType: KeyType.Ed25519,
        },
      ],
    });

    let schemaResult = await Issuer.agent.modules.anoncreds.getSchema(schemaId);
    if (!schemaResult) {
      throw new Error(`Error obtaining schema (Check logs)`);
    }

    const credentialDefinitionResult =
      await Issuer.agent.modules.anoncreds.getCredentialDefinition(
        credentialDefId
      );
    if (!credentialDefinitionResult) {
      throw new Error(`Error importing credential definition (Check logs)`);
    }

    let invitation = await Issuer.createNewInvitation();

    res.json({ invitationurl: invitation });
    await Issuer.waitForConnection();

    // Estaria bien mover esto a Issuer_gen
    await Issuer.agent.credentials.offerCredential({
      connectionId: Issuer.connectionRecord.id,
      protocolVersion: "v2",
      credentialFormats: {
        anoncreds: {
          attributes: [
            {
              name: "dni",
              value: name,
            },
            {
              name: "comunidad",
              value: "Madrid",
            },
            {
              name: "date",
              value: "01/01/2022",
            },
          ],
          credentialDefinitionId:
            credentialDefinitionResult.credentialDefinitionId,
        },
      },
    });
    await esperar10Segundos();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await Issuer.shutdown();
  }
};



// ESTA FUNCION ESTA SOLO PARA QUE SE AUTOCOMPLETEN LAS PETICIONES, SINO SE APAGAN LOS AGENTES
function esperar10Segundos() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 20000);
  });
}