import { IssuerFinal } from "./Issuer/Issuer.js";
import { HolderFinal } from "./Holder/Holder.js";
import { Agente } from "./Agente.js";
import { Agent } from "@aries-framework/core";

const kk = new HolderFinal();
await kk.initializeHolder();

const tt = await kk.holderFinal.agent.dids.getCreatedDids();
const pp = tt[0];
/*const pp = await kk.holderFinal.update_did();
console.log(pp);


*/

console.log(tt);
console.log(tt.length);
