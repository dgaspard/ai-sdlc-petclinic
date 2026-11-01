// D-67: protected black-box consumer acceptance, not application implementation.
import {Given,When,Then} from "@cucumber/cucumber";
import assert from "node:assert/strict";
import * as seed from "../../harness/seed.js";
const jordan=()=>seed.customer("Jordan Rivera").id;
const morgan=()=>seed.vet("Dr Morgan Reed").id;
async function before(world){world.memo.gpcBefore=structuredClone((await world.api("GET",`/customers/${jordan()}`)).body);}
Given("Jordan's current preferred veterinarian is now inactive",async function(){
 await before(this);const id=this.memo.gpcBefore.preferredVeterinarianId;
 this.stubs.reservation.respond("GET","/veterinarians",200,seed.veterinarians.map(v=>({...v,active:v.id!==id})));
});
When("Jordan submits a preference patch selecting {string} veterinarian and a new phone number",async function(kind){
 await before(this);assert.ok(["active","inactive","unknown"].includes(kind));
 this.memo.gpcResult=await this.api("PATCH",`/customers/${jordan()}`,{body:{preferredVeterinarianId:kind==="unknown"?"10000000-0000-4000-8000-999999999999":morgan(),phoneNumber:"312-555-0188"}});
});
When("Jordan submits only a new phone number",async function(){
 await before(this);this.memo.gpcResult=await this.api("PATCH",`/customers/${jordan()}`,{body:{phoneNumber:"312-555-0188"}});
});
Then("the preference patch returns {int} with code {string}",function(status,code){
 assert.equal(this.memo.gpcResult.status,status);if(code!=="none")assert.equal(this.memo.gpcResult.body.code,code);
});
Then("Jordan's complete profile is unchanged by the rejected patch",async function(){assert.deepEqual((await this.api("GET",`/customers/${jordan()}`)).body,this.memo.gpcBefore);});
Then("Jordan's preference and phone number are updated",async function(){const r=await this.api("GET",`/customers/${jordan()}`);assert.equal(r.body.preferredVeterinarianId,morgan());assert.equal(r.body.phoneNumber,"312-555-0188");});
Then("Jordan's previous preference is preserved",async function(){const r=await this.api("GET",`/customers/${jordan()}`);assert.equal(r.body.preferredVeterinarianId,this.memo.gpcBefore.preferredVeterinarianId);assert.equal(r.body.phoneNumber,"312-555-0188");});
