import { Agente } from "./Agente.js";

export class Issuer_gen extends Agente {
  constructor(config, modules = {}) {
    super(config, modules);
  }

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
}
