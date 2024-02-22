import { Agent, DidsModule, KeyType, DidDocument } from "@aries-framework/core";
import { agentDependencies } from "@aries-framework/node";
import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-node";

import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
  CheqdDidCreateOptions,
} from "@aries-framework/cheqd";
import { AnonCredsModule } from "@aries-framework/anoncreds";

import './shim.js';

const agent = new Agent({
  config,
  dependencies: agentDependencies,
  modules: {
    dids: new DidsModule({
      registrars: [new CheqdDidRegistrar()],
      resolvers: [new CheqdDidResolver()],
    }),

    // AnonCreds
    anoncreds: new AnonCredsModule({
      registries: [new CheqdAnonCredsRegistry()],
    }),

    indyVdr: new IndyVdrModule({
      indyVdr,
      networks: [
        {
          isProduction: false,
          indyNamespace: "bcovrin:test",
          genesisTransactions: "<genesis_transactions>",
          connectOnStartup: true,
        },
      ],
    }),

    // Add cheqd module
    cheqd: new CheqdModule(
      new CheqdModuleConfig({
        networks: [
          {
            network: "<mainnet or testnet>",
            cosmosPayerSeed: "<cosmos payer seed or mnemonic>",
          },
        ],
      })
    ),
    // Indy VDR can optionally be used with Askar as wallet and storage implementation
    askar: new AskarModule({
      ariesAskar,
    }),
  },
});
