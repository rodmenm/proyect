const modules = {
  // Configuración Askar OBLGATORIO SIEMPRE
  askar: new AskarModule({
    ariesAskar,
  }),

  // Configuracion de conexiones
  connections: new ConnectionsModule({ autoAcceptConnections: true }),

  // Configuración AnonCreds NO FUNCIONA
  anoncreds: new AnonCredsModule({
    registries: [new CheqdAnonCredsRegistry()],
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
