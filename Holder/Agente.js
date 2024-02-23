import {
  Agent,
  DidsModule,
  KeyDerivationMethod,
  DidCommMimeType,
} from "@aries-framework/core";
import { agentDependencies } from "@aries-framework/node";
import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-node";
import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
} from "@aries-framework/cheqd";
import { AnonCredsModule } from "@aries-framework/anoncreds";

export class Agente {
  constructor(config) {
    this.config = config;
    this.agent = null;
  }

  async initialize() {
    try {
      this.agent = new Agent({
        config: this.config,
        dependencies: agentDependencies,
        modules: {
          // Configuración Dids
          dids: new DidsModule({
            registrars: [new CheqdDidRegistrar()],
            resolvers: [new CheqdDidResolver()],
          }),

          // Configuración AnonCreds
          anoncreds: new AnonCredsModule({
            registries: [new CheqdAnonCredsRegistry()],
          }),

          // Configuración Indy Vdr
          indyVdr: new IndyVdrModule({
            indyVdr,
            networks: [
              {
                isProduction: false,
                indyNamespace: "bcovrin:test",
                genesisTransactions: bcovrin,
                connectOnStartup: true,
              },
            ],
          }),

          // Configuración cheqd
          cheqd: new CheqdModule(
            new CheqdModuleConfig({
              networks: [
                {
                  network: "testnet",
                  cosmosPayerSeed:
                    "robust across amount corn curve panther opera wish toe ring bleak empower wreck party abstract glad average muffin picnic jar squeeze annual long aunt",
                },
              ],
            })
          ),
          // Configuración Askar
          askar: new AskarModule({
            ariesAskar,
          }),
        },
      });

      console.log("Agente inicializado correctamente");
    } catch (error) {
      console.error("No se inizalizo correctamente. Ocurrio el error:", error);
    }
  }
}
