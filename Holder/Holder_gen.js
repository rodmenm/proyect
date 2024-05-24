import { WsOutboundTransport, HttpOutboundTransport, CredentialEventTypes, CredentialState} from "@credo-ts/core";
import { HttpInboundTransport } from "@credo-ts/node";
import { modules, Holder_agentConfig } from "./config.js";
import { Agente } from "./Agente.js";
import "./shim.js";

export class Holder_gen extends Agente {
  constructor() {
    super(Holder_agentConfig, modules);
    this.connected = null;
    this.connectionRecordIssuerId = null;
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
        new HttpInboundTransport({ port: 4001 }) // CAMBIAR A FUTURO, ABRIR MAS PUERTOS PARA MAS HOLDERS
      );

      await this.agent.initialize();
      console.log("Holder agent inicializado correctamente");
    } catch (error) {
      console.error(`Error inicializando Holder agent: ${error}`);
    }
  };

  // Apaga el agente
  shutdown = async () => {
    try {
      await this.agent.shutdown();
      console.log("Holder agent finalizado correctamente");
    } catch (error) {
      console.error(`Error finalizando Holder agent; ${error}`);
    }
  };

  // Maneja la solicitud de conexion y guara un registro
  receiveConnectionRequest = async (invitationUrl) => {
    const { connectionRecord } = await this.agent.oob.receiveInvitationFromUrl(
      invitationUrl
    );
    if (!connectionRecord) {
      throw new Error("No se recibió la invitación");
    }
    return connectionRecord;
  };

  // Espera a que se establezca una conexion
  waitForConnection = async (connectionRecord) => {
    connectionRecord = await this.agent.connections.returnWhenIsConnected(
      connectionRecord.id
    );
    this.connected = true;
    console.log(`Holder conexión establecida correctamente`);
    return connectionRecord.id;
  };

  // Acepta la conexion recibida a partir de un enlace
  acceptConnection = async (invitation_url) => {
    try {
      const connectionRecord = await this.receiveConnectionRequest(
        invitation_url
      );
      this.connectionRecordIssuerId = await this.waitForConnection(
        connectionRecord
      );
    } catch (error) {
      console.error(`Error aceptando la invitación: ${error}`);
    }
  };

  // Escucha a las posibles credenciales que pueda recibir y LAS ACEPTA AUTOMATICAMENTE
  credentialOfferListener = async () => {
    this.agent.events.on(
      CredentialEventTypes.CredentialStateChanged,
      async ({ payload }) => {
        if (payload.credentialRecord.state === CredentialState.OfferReceived) {
          console.log("Aceptando la credencial con los siguientes atributos");
          await this.agent.credentials.acceptOffer({
            credentialRecordId: payload.credentialRecord.id
          });
        }
      }
    );
  };

  // ESTO NO SE USA, SE INCLUYE EN LA FUNCION DE ARRIBA
  acceptCredentialOffer = async (credentialRecord) => {
    // DE MOMENTO SE VAN A ACEPTAR SIEMPRE LAS CREDENCIALES
    try {
      if (false) {
        await this.agent.credentials.declineOffer({
          credentialRecordId: credentialRecord.id,
        });
      } else {
        await this.agent.credentials.acceptOffer({
          credentialRecordId: credentialRecord.id,
        });
      }
    } catch (error) {
      console.error(`Error aceptando la credencial ${error}`);
    }
  };

  // ESTA FUNCION TAMPOCO SE USA
  acceptCred = async () => {
    const self = this;
    this.agent.events.on(
      "CredentialStateChanged",
      async function ({ payload }) {
        switch (payload.credentialRecord.state) {
          case "offer-received":
            console.log("received a credential");
            await self.agent.credentials.acceptOffer({
              credentialRecordId: payload.credentialRecord.id,
            });
            break;
          case "Done":
            console.log(
              `Credential for credential id ${payload.credentialRecord.id} is accepted`
            );
            break;
        }
      }
    );
  };
}


