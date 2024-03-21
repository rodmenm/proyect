import "./../shim.js";
import { Holder_gen } from "./Holder_gen.js";
import { modules, Holder_agentConfig } from "../config.js";
import {
  WsOutboundTransport,
  HttpOutboundTransport,
} from "@aries-framework/core";

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

    await Finalholder.agent.initialize();
    this.holderFinal = Finalholder;
  };

  shutdownHolder = async () => {
    await holderFinal.agent.shutdown();
    console.log("Agente finalizado");
  };
}
