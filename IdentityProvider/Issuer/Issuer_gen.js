import "./../shim.js";
import { Agente } from "./../Agente.js";
import { modules, Issuer_agentConfig } from "../config.js";
import { HttpInboundTransport } from "@credo-ts/node";
import {
  WsOutboundTransport,
  HttpOutboundTransport,
} from "@credo-ts/core";

export class Issuer_gen extends Agente {
  constructor() {
    super(Issuer_agentConfig, modules);
    this.outOfBandId = null;
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
      new HttpInboundTransport({ port: 4002 }) // CAMBIAR A FUTURO, ABRIR MAS PUERTOS PARA MAS HOLDERS
    ); 

    await this.agent.initialize();
    console.log("Issuer agent inicializado correctamente")
    } catch(error) {
      console.error(`Error inicializando Issuer agent: ${error}`)
    }
  }
  
  shutdown = async () => {
    try {
      await this.agent.shutdown();
    console.log("Issuer agent finalizado correctamente");
    } catch(error){
      console.error(`Error finalizando Issuer agent; ${error}`)
    }
  };
   
  
  // 2 maneras de establecer crear conex
  createNewInvitation = async () => {
    const outOfBandRecord = await this.agent.oob.createInvitation();
    this.outOfBandId = outOfBandRecord.id
    return {
      invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({
        domain: "http://localhost:4003",
      }),
      outOfBandRecord,
    };
  };

  createLegacyInvitation = async () => {
    const { invitation } = await this.agent.oob.createLegacyInvitation();

    return invitation.toUrl({ domain: "http://localhost:4003" });
  };

  getConnectionRecord = async () => {
    if (!this.outOfBandId) {
      throw Error(`No hay registro de una outOfBandId`);
    }

    const [connection] = await this.agent.connections.findAllByOutOfBandId(this.outOfBandId)

    if (!connection) {
      throw Error(`No hay registro de una conexion establecida`)
    }

    return connection
  }
  
}
