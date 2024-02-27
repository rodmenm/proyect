import { IssuerFinal } from "./Issuer/Issuer.js";
import { HolderFinal } from "./Holder/Holder.js";

// Llamar a la función initializeHolder
const Issuer = new IssuerFinal();
const Holder = new HolderFinal();
await Issuer.initializeIssuer();
const { outOfBandRecord, invitationUrl } =
  await Issuer.issuerFinal.createNewInvitation(Issuer.issuerFinal.agent);
console.log(outOfBandRecord);
console.log("");
console.log(invitationUrl);
console.log("");
Issuer.issuerFinal.setupConnectionListener(Issuer.issuerFinal.agent, outOfBandRecord, () => {
    console.log('Ahora tenemos una conexión activa para usar en los siguientes tutoriales');
  });
const outOfBandRecord2 = await Holder.holderFinal.receiveInvitation(Holder.holderFinal.agent,invitationUrl);
console.log(outOfBandRecord2)