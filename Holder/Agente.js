import { agentDependencies } from "@credo-ts/node";
import { Agent } from "@credo-ts/core";
import {
  KeyDerivationMethod,
  DidCommMimeType,
  ConsoleLogger,
  LogLevel,
} from "@credo-ts/core";


export class Agente {
  constructor(config, modules, id, key) {
    this.config = this.configure(config, id, key);
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
      console.error(`Error creando agente: ${error}`);
    }
  }

  configure(config, id, key) {
    if (id && key) {
      const configfin = {
        label: "H_agente",
        walletConfig: {
          id: id,
          key: key,
          keyDerivationMethod: KeyDerivationMethod.Argon2IMod,
          storage: {
            type: "sqlite",
            database: "holder.db",
          },
        },
        logger: new ConsoleLogger(LogLevel.debug),
        endpoints: ["http://holder:4001"],
        didCommMimeType: DidCommMimeType.V1,
        useDidSovPrefixWhereAllowed: true,
        useDidKeyInProtocols: true,
        autoUpdateStorageOnStartup: false,
      };
      return configfin;
    } else {
      return config;
    }
  }
}
