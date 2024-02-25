import { Agent } from "@aries-framework/core";
import { agentDependencies } from "@aries-framework/node";

export class Agente {
  constructor(config, modules) {
    this.config = config;
    this.modules = modules;
    this.agent = null;
    this.add();
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
