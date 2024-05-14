import "./../shim.js";
import { Holder_gen } from "./Holder_gen.js";
import { modules, Holder_agentConfig } from "../config.js";
import {
  WsOutboundTransport,
  HttpOutboundTransport,
} from "@credo-ts/core";

export class HolderFinal {
  constructor() {
    this.holderFinal = null;
  }

  initializeHolder = async (wallet) => {
    Holder_agentConfig.walletConfig = wallet;
    const Finalholder = new Holder_gen(Holder_agentConfig, modules);

    // Registra `WebSocket` con outbound transport
    Finalholder.agent.registerOutboundTransport(new WsOutboundTransport());

    // Registra `Http` con outbound transport
    Finalholder.agent.registerOutboundTransport(new HttpOutboundTransport());

    // Registra `Http` con inbound transport
    Finalholder.agent.registerInboundTransport(
      new HttpInboundTransport({ port: 5000 })
    );

    await Finalholder.agent.initialize();
    this.holderFinal = Finalholder;
  };

  shutdownHolder = async () => {
    await this.holderFinal.agent.shutdown();
    console.log("Agente finalizado");
  };
}
