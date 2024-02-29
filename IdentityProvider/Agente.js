import { Agent, KeyType, TypedArrayEncoder } from "@aries-framework/core";

import { agentDependencies } from "@aries-framework/node";

// Define una semilla que se utilizará para generar claves criptográficas
const seed = TypedArrayEncoder.fromString(`Sale_furbo?`); // Debe mantenerse seguro en producción!

// Define un DID de Indy no calificado que será devuelto después de registrar la semilla en bcovrin
const unqualifiedIndyDid = `poner_aqui_lo_que_se_quiera_para generar_un_did_no_reconocido`;

// Construye el DID de Indy completo utilizando el DID no calificado
const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`;

export class Agente {
  constructor(config, modules) {
    this.config = config;
    this.modules = modules;
    this.agent = null;
  }

  async add() {
    try {
      this.agent = new Agent({
        config: this.config,
        modules: this.modules,
        dependencies: agentDependencies,
      });

      console.log("Agente inicializado correctamente");
    } catch (error) {
      console.error("No se inizalizo correctamente. Ocurrio el error:");
      console.error(error);
    }
  }

  async create_did() {
    const did = await this.agent.dids.create({
      method: "cheqd",
      // El secreto contiene el tipo de método de verificación y el ID
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
    if (did.didState.state == "failed") {
      console.log("DID NO CREADO, Error: ");
      console.log(did.didState.reason);
    } else {
      console.log("DID creado correctamente");
    }
    return did;
  }
  // ESTA MANERA SE UTILIZA PARA GENERAR UN DID EN BASE A UNA YA EXISTENTE. NO FUNCIONA
  /*async create_did(id_param, type_param) {
    const key = await this.agent.wallet.createKey({
      keyType: KeyType.Ed25519,
    });

    // Codificar comforme al metodo
    const ed25519PublicKeyBase58 = key.publicKeyBase58;
    // DID generico
    const did = await this.agent.dids.create({
      // De no incluir un DID como parametro aqui, se ha de incluir un secret
      method: "cheqd",
      secret: {}, // De no incluir un DID secret tendra esta pinta     verificationMethod: { id: 'key-1',  type: 'Ed25519VerificationKey2020', },
      options: {
        network: "testnet",
      },
      didDocument: {
        id: "did:cheqd:testnet:92874297-d824-40ea-8ae5-364a1ec9237d",
        controller: ["did:cheqd:testnet:92874297-d824-40ea-8ae5-364a1ec9237d"],
        verificationMethod: [
          {
            id: "did:cheqd:testnet:92874297-d824-40ea-8ae5-364a1ec9237d#key-1",
            type: "Ed25519VerificationKey2018",
            controller:
              "did:cheqd:testnet:92874297-d824-40ea-8ae5-364a1ec9237d",
            publicKeyBase58: ed25519PublicKeyBase58,
          },
        ],
        authentication: [
          "did:cheqd:testnet:92874297-d824-40ea-8ae5-364a1ec9237d#key-1",
        ],
      },
    });
    if (did.didState.state == "failed") {
      console.log("DID NO CREADO, Error: ");
      console.log(did.didState.reason);
    } else {
      console.log("DID creado correctamente");
    }
    return did;
  }*/

  async update_did(did_url, did_document) {
    // Por completar
    const did = await this.agent.dids.update({
      did: did_url,
      didDocument: did_document,
    });

    return did;
  }
  async delete_did(did_url) {
    // No borra, solo desactiva
    await this.agent.dids.deactivate({
      did: did_url,
    });
  }

  async import_did(did_url,did_document, privateKeys, overwrite) {
    try {
      // Importa un DID existente utilizando el agente
      await this.agent.dids.import({
        // Los parametros a pasar son (did,didDocument, privateKeys, overwrite)
        did: did_url, // DID que se importará
        didDocument: did_document,
        privateKeys: privateKeys,
        overwrite: overwrite, // Indica si se debe sobrescribir el DID si ya existe
      });
      console.log("DID importado correctamente");
    } catch (error) {
      console.log("DID NO IMPORTADO, ERROR:");
      console.log(error);
    }
  }


}
