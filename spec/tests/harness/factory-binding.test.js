import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';

const resolver=fileURLToPath(new URL('../../../tools/petclinic/factory-path.mjs',import.meta.url));
function fixture(t) {
 const parent=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'consumer-binding-')));
 t.after(()=>fs.rmSync(parent,{recursive:true,force:true}));
 const consumer=path.join(parent,'consumer'),factory=path.join(parent,'dependency');
 fs.mkdirSync(path.join(consumer,'tools/petclinic'),{recursive:true});
 fs.mkdirSync(path.join(consumer,'spec/factory/petclinic'),{recursive:true});
 fs.copyFileSync(resolver,path.join(consumer,'tools/petclinic/factory-path.mjs'));
 fs.mkdirSync(factory);fs.writeFileSync(path.join(factory,'mechanism.txt'),'synthetic mechanism\n');
 const git=(...a)=>execFileSync('git',a,{cwd:factory,encoding:'utf8'}).trim();
 git('init','-q');git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm','synthetic factory');
 const revision=git('rev-parse','HEAD');
 const config=path.join(consumer,'spec/factory/petclinic/config.json');
 const pin=value=>fs.writeFileSync(config,JSON.stringify({factory:{revision:value}}));pin(revision);
 const run=(location=factory)=>{
  const env={...process.env};delete env.FACTORY_CHECKOUT;
  if(location!==null)env.FACTORY_CHECKOUT=location;
  return spawnSync(process.execPath,['--input-type=module','-e',"import {factoryPath} from './tools/petclinic/factory-path.mjs'; console.log(factoryPath());"],{cwd:consumer,env,encoding:'utf8'});
 };
 return {consumer,factory,parent,pin,run};
}
test('consumer binding accepts only an explicit clean immutable dependency',t=>{
 const f=fixture(t),r=f.run();assert.equal(r.status,0,r.stderr);assert.equal(r.stdout.trim(),f.factory);
});
test('consumer binding rejects a missing dependency instead of using a sibling source tree',t=>{
 const f=fixture(t),r=f.run(null);assert.notEqual(r.status,0);assert.match(r.stderr,/Set FACTORY_CHECKOUT/);
});
test('consumer binding rejects a wrong pin and a floating revision',t=>{
 const f=fixture(t);f.pin('0'.repeat(40));assert.match(f.run().stderr,/reviewed immutable revision/);
 f.pin('main');assert.match(f.run().stderr,/Full immutable factory revision/);
});
test('consumer binding rejects a dirty dependency',t=>{
 const f=fixture(t);fs.writeFileSync(path.join(f.factory,'mechanism.txt'),'changed\n');
 const r=f.run();assert.notEqual(r.status,0);assert.match(r.stderr,/clean and at the reviewed/);
});
test('consumer binding rejects a symlink instead of accepting a shortcut',t=>{
 const f=fixture(t),alias=path.join(f.parent,'shortcut');fs.symlinkSync(f.factory,alias,'dir');
 const r=f.run(alias);assert.notEqual(r.status,0);assert.match(r.stderr,/not a symlink/);
});
test('consumer binding rejects a factory checkout inside the consumer',t=>{
 const f=fixture(t),inside=path.join(f.consumer,'factory');fs.renameSync(f.factory,inside);
 const r=f.run(inside);assert.notEqual(r.status,0);assert.match(r.stderr,/must not overlap/);
});
