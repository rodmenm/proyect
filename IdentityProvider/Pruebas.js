import { IssuerFinal } from "./Issuer/Issuer.js";
import { HolderFinal } from "./Holder/Holder.js";

// Llamar a la función initializeHolder
const Issuer = new IssuerFinal();
console.log(Issuer)
await Issuer.initializeIssuer();
console.log(Issuer)
const kk = Issuer.issuerFinal.createLegacyInvitation();
console.log(kk)