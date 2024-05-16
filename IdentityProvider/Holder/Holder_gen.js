import "./../shim.js";
import { Agente } from "./../Agente.js";
import { modules, Holder_agentConfig } from "../config.js";
import { HttpInboundTransport } from "@credo-ts/node";
import {
  WsOutboundTransport,
  HttpOutboundTransport,
} from "@credo-ts/core";

export class Holder_gen extends Agente {
  constructor() {
    super(Holder_agentConfig, modules);
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
        new HttpInboundTransport({ port: 4001 }) // CAMBIAR A FUTURO, ABRIR MAS PUERTOS PARA MAS HOLDERS
      );

      await this.agent.initialize();
      console.log("Holder agent inicializado correctamente");
    } catch (error) {
      console.error(`Error inicializando Holder agent: ${error}`);
    }
  };

  shutdown = async () => {
    try {
      await this.agent.shutdown();
      console.log("Holder agent finalizado correctamente");
    } catch (error) {
      console.error(`Error finalizando Holder agent; ${error}`);
    }
  };

  receiveInvitation = async (agent, invitationUrl) => {
    const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(
      invitationUrl
    );

    return outOfBandRecord;
  };

  /*
  async resolveCredentialOffer(credentialOffer) {
    return await this.agent.modules.openId4VcHolder.resolveCredentialOffer(
      credentialOffer
    );
  }

  async requestAndStoreCredentials(
    resolvedCredentialOffer,
    credentialsToRequest
  ) {
    const credentials =
      await this.agent.modules.openId4VcHolder.acceptCredentialOfferUsingPreAuthorizedCode(
        resolvedCredentialOffer,
        {
          credentialsToRequest,
          credentialBindingResolver: async () => ({
            method: "did",
            didUrl: this.verificationMethod.id,
          }),
        }
      );

    const storedCredentials = await Promise.all(
      credentials.map((credential) => {
        if (
          credential instanceof W3cJwtVerifiableCredential ||
          credential instanceof W3cJsonLdVerifiableCredential
        ) {
          return this.agent.w3cCredentials.storeCredential({ credential });
        } else {
          return this.agent.sdJwtVc.store(credential.compact);
        }
      })
    );

    return storedCredentials;
  }

  async resolveProofRequest(proofRequest) {
    const resolvedProofRequest =
      await this.agent.modules.openId4VcHolder.resolveSiopAuthorizationRequest(
        proofRequest
      );

    return resolvedProofRequest;
  }

  async acceptPresentationRequest(resolvedPresentationRequest) {
    const presentationExchangeService = this.agent.dependencyManager.resolve(
      DifPresentationExchangeService
    );

    if (!resolvedPresentationRequest.presentationExchange) {
      throw new Error(
        "Missing presentation exchange on resolved authorization request"
      );
    }

    const submissionResult =
      await this.agent.modules.openId4VcHolder.acceptSiopAuthorizationRequest({
        authorizationRequest: resolvedPresentationRequest.authorizationRequest,
        presentationExchange: {
          credentials: presentationExchangeService.selectCredentialsForRequest(
            resolvedPresentationRequest.presentationExchange
              .credentialsForRequest
          ),
        },
      });

    return submissionResult.serverResponse;
  }
  */
}
