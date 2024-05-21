import { Agent } from "@credo-ts/core";

import { agentDependencies } from "@credo-ts/node";

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

      console.log("Agente creado correctamente");
    } catch (error) {
      console.error(`Error creando agente: ${error}`)
    }
  }
}
