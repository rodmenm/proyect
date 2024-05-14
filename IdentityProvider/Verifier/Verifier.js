import "./../shim.js";
import { Verifier_gen } from "./Verifier_gen.js";
import { modules, Verifier_agentConfig } from "../config.js";
import { HttpInboundTransport } from "@credo-ts/node";
import {
  WsOutboundTransport,
  HttpOutboundTransport,
} from "@credo-ts/core";

export class VerifierFinal {
  constructor() {
    this.verifierFinal = null;
  }

  initializeVerifier = async () => {
    const Finalverifier = new Verifier_gen(Verifier_agentConfig, modules);

    // Registra `WebSocket` con outbound transport
    Finalverifier.agent.registerOutboundTransport(new WsOutboundTransport());

    // Registra `Http` con outbound transport
    Finalverifier.agent.registerOutboundTransport(new HttpOutboundTransport());

    // Registra `Http` con inbound transport
    Finalverifier.agent.registerInboundTransport(
      new HttpInboundTransport({ port: 6000 })
    );

    await Finalverifier.agent.initialize();
    this.verifierFinal = Finalverifier;
  };

  shutdownVerifier = async () => {
    await this.VerifierFinal.agent.shutdown();
    console.log("Agente finalizado");
  };
}
