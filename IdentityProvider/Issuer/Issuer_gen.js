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

  

  /*
  async createCredentialRequest(credentialRequest) {
    const {
      credentialRequestRecord,
    } = await this.agent.modules.openId4VcIssuer.createCredentialRequest({
      credentialRequest,
    });
    return credentialRequestRecord;
  }

  async signCredential(credential) {
    return await this.agent.modules.openId4VcIssuer.signCredential({
      credential,
    });
  }

  async signCredentialOffer(credentialOffer) {
    return await this.agent.modules.openId4VcIssuer.signCredentialOffer({
      credentialOffer,
    });
  }

  async exit() {
    console.log(Output.Exit);
    await this.agent.shutdown();
    process.exit(0);
  }
  */
}
