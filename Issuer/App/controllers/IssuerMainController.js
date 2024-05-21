import { KeyType, KeyDerivationMethod } from "@credo-ts/core";
import { Issuer_gen } from "../../Issuer_gen.js";
import { issuer_semilla } from "../../config.js";


// CONSTANTES --------------------------------------------------------------------------->
// REGISTRAR DID EN EL LEDGER DE BCOVRIN
let issuer_did = {
  Seed: "issuersemilladebemantenersecreto",
  DID: "7hVEkxK3356FwfmCQ9muR7",
  Verkey: "4ejqSPdmShnQPRjdr9B9PzrQ4pP9p7FALhEyEkBYR9h5"
};

// SON EL RESULTADO PREVIO DE HABERLOS GENERADO ANTES
const imported_did = issuer_did.DID;
const schemaId = "did:indy:bcovrin:test:No6XpAd5Ek7CnrNJA4a4RB/anoncreds/v0/SCHEMA/Malorca teamm/4.1.8";
const credentialDefId = "did:indy:bcovrin:test:No6XpAd5Ek7CnrNJA4a4RB/anoncreds/v0/CLAIM_DEF/711388/default_tag";

// RUTAS -------------------------------------------------------------------------------->

export const cre_schem = async (req, res) => {
  let Issuer = new Issuer_gen();
  let did = `did:indy:bcovrin:test:${imported_did}`;
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR DE FORMA MANUAL EN BCOVRIN
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
    // EL ESQUEMA SIRVE PARA DEFINIR QUE TIENE LA CREDENCIAL
    // NO ITENE PORQUE CREARSE UNO, TAMBIEN SE PUEDE IMPORTAR
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

    //let schemaResult2 = await Issuer.agent.modules.anoncreds.getSchema(schemaId);

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

export const cre_cred = async (req, res) => {
  let Issuer = new Issuer_gen();
  let did = `did:indy:bcovrin:test:${imported_did}`;
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR DE FORMA MANUAL EN BCOVRIN
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
    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error obtaining schema: ${schemaResult.schemaState.reason}`
      );
    }

    const credentialDefinitionResult =
      await Issuer.agent.modules.anoncreds.getCredentialDefinition(credId);

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

export const glob = async (req, res) => {
  let Issuer = new Issuer_gen();
  let did = `did:indy:bcovrin:test:${imported_did}`;
  try {
    await Issuer.initialize();
    if (Issuer.agent._isInitialized != true) {
      throw new Error(
        `Error initialazing Issuer agent. It has not initialized`
      );
    }

    // HAY QUE INCLUIR DE FORMA MANUAL EN BCOVRIN
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
    if (schemaResult.schemaState.state === "failed") {
      throw new Error(
        `Error creating schema: ${schemaResult.schemaState.reason}`
      );
    }

    const credentialDefinitionResult =
      await Issuer.agent.modules.anoncreds.getCredentialDefinition(
        credentialDefId
      );
    if (
      credentialDefinitionResult.credentialDefinitionState.state === "failed"
    ) {
      throw new Error(
        `Error importing credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
      );
    }

    let invitation = await Issuer.createNewInvitation();
    res.json({ invitationurl: invitation });
    await Issuer.waitForConnection(); // AQUI EN TEORIA LA ACEPTA

    const conrecord = await Issuer.agent.connections.findAllByOutOfBandId(Issuer.outOfBandId);
    
    // Estaria bien mover esto a Issuer_gen 
    await this.agent.credentials.offerCredential({
        connectionId: conrecord.id,
        protocolVersion: 'v2',
        credentialFormats: {
          anoncreds: {
            attributes: [
              {
                name: 'name',
                value: 'Muriqi',
              },
              {
                name: 'club',
                value: 'Mallorca',
              },
              {
                name: 'date',
                value: '01/01/2022',
              },
            ],
            credentialDefinitionId: credentialDefinitionResult.credentialDefinitionId,
          },
        },
      })
    


  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + error);
  } finally {
    await Issuer.shutdown();
  }
};
