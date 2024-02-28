import { Agent, KeyType } from "@aries-framework/core";

import { agentDependencies } from "@aries-framework/node";

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
      // Un parámetro opcional methodSpecificIdAlgo
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

  async update_did() {
    const did = await this.agent.dids.update({
      did: "did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411",
      secret: {
        verificationMethod: {
          id: "key-2",
          type: "JsonWebKey2020",
        },
      },
      didDocument: {
        id: "did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411",
        controller: ["did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411"],
        verificationMethod: [
          {
            id: "did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411#key-1",
            type: "Ed25519VerificationKey2020",
            controller:
              "did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411",
            publicKeyMultibase:
              "z6MknkzLUEP5cxqqsaysNMWoh8NJRb3YsowTCj2D6yhwyEdj",
          },
        ],
        authentication: [
          "did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411#key-1",
        ],
        service: [
          {
            id: "did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411#rand",
            type: "rand",
            serviceEndpoint: "https://rand.in",
          },
        ],
      },
    });
    if (did.didState.state == "failed") {
      console.log("DID NO ACTUALIZADO, Error: ");
      console.log(did.didState.reason);
    } else {
      console.log("DID creado correctamente");
    }
    return did;
  }
  async delete_did(did_param, id_param, type_param) {
    await this.agent.dids.deactivate({
      did: "did:cheqd:testnet:b84817b8-43ee-4483-98c5-f03760816411",
      options: {
        versionId: "3.0",
      },
    });
  }
}
