import { Holder_gen } from './Holder_gen.js'; 


const agentConfig = {
    label: "agente", // Nombre del agente
    walletConfig: {
      id: "wallet", // ID de la cartera
      key: "testkey000000000000000000000", // Clave de la cartera (debe ser una contraseña segura en un entorno real)
      keyDerivationMethod: KeyDerivationMethod.Argon2IMod, // Método de derivación de clave
      storage: {
        type: "postgres_storage", // Tipo de almacenamiento de la cartera
        // Otras configuraciones específicas del tipo de almacenamiento, si es necesario
      },
    },
    endpoints: ["http://localhost:4000"], // Endpoints a través de los cuales otros agentes pueden comunicarse con este agente
    logger: new ConsoleLogger(LogLevel.info), // Configuración del registro de eventos
    didCommMimeType: DidCommMimeType.V1, // Tipo MIME para el intercambio de mensajes
    useDidSovPrefixWhereAllowed: true,  // Indicación para usar el prefijo did:sov en los mensajes si está permitido
    useDidKeyInProtocols: true,
    // connectionImageUrl: 'https://fotico'
    autoUpdateStorageOnStartup: false
  };
  

const holderAgent = new Holder_gen(agentConfig);


holderAgent.initialize();


