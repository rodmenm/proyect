import { Agente } from "./../Agente.js";


export class Verifier_gen extends Agente {
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

}
