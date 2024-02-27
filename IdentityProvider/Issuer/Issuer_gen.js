import { Agente } from "./../Agente.js";

export class Issuer_gen extends Agente {
  constructor(config, modules = {}) {
    super(config, modules);
    this.add();
  }

  createNewInvitation = async (agent) => {
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
