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
}
