import "./../shim.js";
import { Agente } from "./../Agente.js";
import { modules, Verifier_agentConfig } from "../config.js";
import { HttpInboundTransport } from "@credo-ts/node";
import {
  WsOutboundTransport,
  HttpOutboundTransport,
} from "@credo-ts/core";


export class Verifier_gen extends Agente {
  constructor() {
    super(Verifier_agentConfig, modules);
    this.add();
  }

  initialize = async () => {
    try {
      // Registra `WebSocket` con outbound transport
      this.agent.registerOutboundTransport(new WsOutboundTransport());

      // Registra `Http` con outbound transport
      this.agent.registerOutboundTransport(new HttpOutboundTransport());

      // Registra `Http` con inbound transport
      this.agent.registerInboundTransport(
        new HttpInboundTransport({ port: 4003 }) // CAMBIAR A FUTURO, ABRIR MAS PUERTOS PARA MAS HOLDERS
      );

      await this.agent.initialize();
      console.log("Verifier agent inicializado correctamente");
    } catch (error) {
      console.error(`Error inicializando Verifier agent: ${error}`);
    }
  };

  shutdown = async () => {
    try {
      await this.agent.shutdown();
      console.log("Verifier agent finalizado correctamente");
    } catch (error) {
      console.error(`Error finalizando Verifier agent; ${error}`);
    }
  };



  createNewInvitation = async (agent) => {
    const outOfBandRecord = await agent.oob.createInvitation();

    return {
      invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({
        domain: "https://example.org",
      }),
      outOfBandRecord,
    };
  };

  createLegacyInvitation = async (agent) => {
    const { invitation } = await agent.oob.createLegacyInvitation();

    return invitation.toUrl({ domain: "https://example.org" });
  };

  setupConnectionListener = (agent, outOfBandRecord, cb) => {
    agent.events.on("connectionstatechanged", ({ payload }) => {
      if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return;
      if (payload.connectionRecord.state === "completed") {
        // the connection is now ready for usage in other protocols!
        console.log(
          `Connection for out-of-band id ${outOfBandRecord.id} completed`
        );
        cb();
        process.exit(0);
      }
    });
  };

}
