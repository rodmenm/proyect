import "./shim.js";
import { Agente } from "./Agente.js";
import { modules, Issuer_agentConfig } from "./config.js";
import { HttpInboundTransport } from "@credo-ts/node";
import { WsOutboundTransport, HttpOutboundTransport } from "@credo-ts/core";

export class Issuer_gen extends Agente {
  constructor() {
    super(Issuer_agentConfig, modules);
    this.outOfBandId = null;
    this.add();
  }

  // Inicializa el agente y establece transportes disponibles
  initialize = async () => {
    try {
      // Registra `WebSocket` con outbound transport
      this.agent.registerOutboundTransport(new WsOutboundTransport());

      // Registra `Http` con outbound transport
      this.agent.registerOutboundTransport(new HttpOutboundTransport());

      // Registra `Http` con inbound transport
      this.agent.registerInboundTransport(
        new HttpInboundTransport({ port: 4002 }) // CAMBIAR A FUTURO, ABRIR MAS PUERTOS PARA MAS HOLDERS
      );

      await this.agent.initialize();
      console.log("Issuer agent inicializado correctamente");
    } catch (error) {
      console.error(`Error inicializando Issuer agent: ${error}`);
    }
  };

  // Apaga el agente
  shutdown = async () => {
    try {
      await this.agent.shutdown();
      console.log("Issuer agent finalizado correctamente");
    } catch (error) {
      console.error(`Error finalizando Issuer agent; ${error}`);
    }
  };

  // Hay 2 maneras de crear un enlace, cada una tiene sus ventajas
  // Manera 1 (usada en el proyecto)
  createNewInvitation = async () => {
    const outOfBand = await this.agent.oob.createInvitation();
    this.outOfBandId = outOfBand.id;
    return {
      invitationUrl: outOfBand.outOfBandInvitation.toUrl({
        domain: "http://localhost:5001",
      }),
      outOfBand,
    };
  };

  // Manera 2
  createLegacyInvitation = async () => {
    const { invitation } = await this.agent.oob.createLegacyInvitation();

    return invitation.toUrl({ domain: "http://localhost:4003" });
  };

  // Espera a que se establezca la conexion
  waitForConnection = async () => {
    if (!this.outOfBandId) {
      throw new Error("No hay registro de un outOfBand");
    }

    console.log("Completando conexión...");

    const getConnectionRecord = (outOfBandId) =>
      new Promise((resolve, reject) => {
        const timeoutId = setTimeout(
          () => reject(new Error("Timeout Errora")),
          20000
        );

        this.agent.events.on(
          ConnectionEventTypes.ConnectionStateChanged,
          (e) => {
            if (e.payload.connectionRecord.outOfBandId !== outOfBandId) return;

            clearTimeout(timeoutId);
            resolve(e.payload.connectionRecord);
          }
        );

        this.agent.connections
          .findAllByOutOfBandId(outOfBandId)
          .then(([connectionRecord]) => {
            if (connectionRecord) {
              clearTimeout(timeoutId);
              resolve(connectionRecord);
            }
          })
          .catch(reject);
      });

    const connectionRecord = await getConnectionRecord(this.outOfBandId);

    try {
      await this.agent.connections.returnWhenIsConnected(connectionRecord.id);
    } catch (error) {
      console.error(`Error: ${error}`)
      return;
    }

    console.log(greenText(Output.ConnectionEstablished));
  };
}
