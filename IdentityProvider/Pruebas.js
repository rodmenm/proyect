import { IssuerFinal } from "./Issuer/Issuer.js";
import { HolderFinal } from "./Holder/Holder.js";
import { Agente } from "./Agente.js";
import { Agent } from "@aries-framework/core";
const ii = "did:peer:1zQmbRBWLuhLFo4oEJ7kMTu6bAZ4ZM8AUzxt9k2PZMAppCpH";
let kk = new HolderFinal();
await kk.initializeHolder();
const yy = await kk.holderFinal.import_did('did:cheqd:testnet:3f1bb734-a8c8-4e51-9a76-0d373a05d042');
const tt = await kk.holderFinal.agent.dids.getCreatedDids();

// await kk.holderFinal.import_did("did:cheqd:testnet:afc2d43a-2105-4e77-a1f9-50f3803587f7");
console.log(tt)
console.log("--------------------------------------")
const ss = kk.holderFinal.agent.wallet;


/*
const ss = await kk.holderFinal.create_did();
const tt = await kk.holderFinal.update_did();
const tt = await kk.holderFinal.update_did();
const oo = await kk.holderFinal.delete_did(did_url);
console.log(pp);


*/
console.log(tt.length);
