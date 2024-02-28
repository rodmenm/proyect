const modules = {
  // Configuración Askar
  askar: new AskarModule({
    ariesAskar,
  }),
  // Configuracion de conexiones
  connections: new ConnectionsModule({ autoAcceptConnections: true }),

  // Configuración AnonCreds
  anoncredsRs: new AnonCredsRsModule({
    anoncreds,
  }),
  anoncreds: new AnonCredsModule({
    // Here we add an Indy VDR registry as an example, any AnonCreds registry
    // can be used
    registries: [new IndyVdrAnonCredsRegistry()],
  }),

  // Configuración Dids
  dids: new DidsModule({
    registrars: [new CheqdDidRegistrar()],
    resolvers: [new CheqdDidResolver()],
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
};
