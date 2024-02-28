import { IssuerFinal } from "./Issuer/Issuer.js";
import { HolderFinal } from "./Holder/Holder.js";
import { Agente } from "./Agente.js";
import { Agent } from "@aries-framework/core";

const kk = new HolderFinal();
await kk.initializeHolder();
const pp = await kk.holderFinal.create_did();
console.log(pp);
const tt = await kk.holderFinal.agent.dids.getCreatedDids();
console.log(tt);
console.log(tt.length);
