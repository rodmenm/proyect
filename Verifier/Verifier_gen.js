import "./shim.js";
import { Agente } from "./Agente.js";
import { modules, Verifier_agentConfig } from "./config.js";
import { HttpInboundTransport } from "@credo-ts/node";
import { WsOutboundTransport, HttpOutboundTransport, ConnectionEventTypes } from "@credo-ts/core";

export class Verifier_gen extends Agente {
  constructor() {
    super(Verifier_agentConfig, modules);
    this.outOfBandId = null;
    this.connectionRecord = null;
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
        new HttpInboundTransport({ port: 6001 }) // CAMBIAR A FUTURO, ABRIR MAS PUERTOS PARA MAS HOLDERS
      );

      await this.agent.initialize();
      console.log("Verifier agent inicializado correctamente");
    } catch (error) {
      console.error(`Error inicializando Verifier agent: ${error}`);
    }
  };

  // Apaga el agente
  shutdown = async () => {
    try {
      await this.agent.shutdown();
      console.log("Verifier agent finalizado correctamente");
    } catch (error) {
      console.error(`Error finalizando Verifier agent; ${error}`);
    }
  };

  // Hay 2 maneras de crear un enlace, cada una tiene sus ventajas
  // Manera 1 (usada en el proyecto)
  createNewInvitation = async () => {
    const outOfBand = await this.agent.oob.createInvitation();
    this.outOfBandId = outOfBand.id;
    return {
      invitationUrl: outOfBand.outOfBandInvitation.toUrl({
        domain: "http://verifier:5001", // CAMBIAR TESTEAR EN IP PUBLICA
      }),
      outOfBand,
    };
  };

  // Manera 2
  createLegacyInvitation = async () => {
    const { invitation } = await this.agent.oob.createLegacyInvitation();

    return invitation.toUrl({ domain: "http://verifier:5001" }); // CAMBIAR TESTEAR EN IP PUBLICA
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
          () => reject(new Error("Timeout Error")),
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
    this.connectionRecord = connectionRecord;


    try {
      await this.agent.connections.returnWhenIsConnected(connectionRecord.id);
    } catch (error) {
      console.error(`Error: ${error}`)
      return;
    }
  console.log("Verifier conexión completada correctamente");

  };
}
