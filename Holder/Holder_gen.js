import { Agente } from "./Agente.js";

export class Holder_gen extends Agente {
  constructor(config, modules = {}) {
    super(config, modules);
  }

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

}
