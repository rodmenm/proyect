import "./../shim.js";
import { Issuer_gen } from "./Issuer_gen.js";
import { modules, Issuer_agentConfig } from "../config.js";
import { HttpInboundTransport } from "@aries-framework/node";
import {
  WsOutboundTransport,
  HttpOutboundTransport,
} from "@aries-framework/core";

export class IssuerFinal {
  constructor() {
    this.issuerFinal = null;
  }

  initializeIssuer = async () => {
    const Finalissuer = new Issuer_gen(Issuer_agentConfig, modules);

    // Registra `WebSocket` con outbound transport
    Finalissuer.agent.registerOutboundTransport(new WsOutboundTransport());

    // Registra `Http` con outbound transport
    Finalissuer.agent.registerOutboundTransport(new HttpOutboundTransport());

    // Registra `Http` con inbound transport
    Finalissuer.agent.registerInboundTransport(
      new HttpInboundTransport({ port: 5000 })
    );

    await Finalissuer.agent.initialize();
    this.issuerFinal = Finalissuer;
  };

  shutdownIssuer = async () => {
    await this.issuerFinal.agent.shutdown();
    console.log("Agente finalizado");
  };
}
