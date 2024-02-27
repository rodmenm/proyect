import { Agente } from "./../Agente.js";


export class Verifier_gen extends Agente {
  constructor(config, modules = {}) {
    super(config, modules);
  }

  createLegacyInvitation = async (agent) => {
    const { invitation } = await agent.oob.createLegacyInvitation();

    return invitation.toUrl({ domain: "https://example.org" });
  };

}
