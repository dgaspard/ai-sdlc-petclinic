import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync,spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const requireDelivery=createRequire(new URL('../../delivery/package.json',import.meta.url));
const workflow=requireDelivery('yaml').parse(fs.readFileSync(path.join(root,'.github/workflows/guard.yml'),'utf8'));
const realGit=execFileSync('which',['git'],{encoding:'utf8'}).trim();

// Exercise the actual workflow bootstrap shell. A test Git shim refuses the first
// dependency operation, proving rejected authority never fetches or executes code.
function fixture(t) {
 const parent=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'ci-authority-')));
 t.after(()=>fs.rmSync(parent,{recursive:true,force:true}));
 const repo=path.join(parent,'consumer'),bin=path.join(parent,'bin'),tmp=path.join(parent,'runner-temp');
 for(const p of [path.join(repo,'spec/factory/petclinic'),bin,tmp])fs.mkdirSync(p,{recursive:true});
 const config=path.join(repo,'spec/factory/petclinic/config.json'),manifest=path.join(repo,'spec/protected.sha256');
 fs.writeFileSync(config,JSON.stringify({factory:{revision:'a'.repeat(40)}}));
 fs.writeFileSync(manifest,'synthetic reviewed manifest\n');
 const git=(...a)=>execFileSync(realGit,a,{cwd:repo,encoding:'utf8'}).trim();
 git('init','-q');git('add','.');git('-c','user.name=CI Fixture','-c','user.email=fixture@example.invalid','commit','-qm','synthetic reviewed authority');
 const revision=git('rev-parse','HEAD'),marker=path.join(parent,'dependency-operation');
 fs.writeFileSync(path.join(bin,'git'),`#!/usr/bin/env node
const fs=require('node:fs'),{spawnSync}=require('node:child_process');
const args=process.argv.slice(2);
if(args.includes('init')||args.includes('fetch')){fs.writeFileSync(${JSON.stringify(marker)},'attempted');process.exit(90);}
const r=spawnSync(${JSON.stringify(realGit)},args,{stdio:'inherit'});process.exit(r.status??1);
`,{mode:0o755});
 const run=(script,trust=revision)=>spawnSync('bash',['-c',script],{cwd:repo,encoding:'utf8',env:{...process.env,PATH:bin+path.delimiter+process.env.PATH,TRUST_REVISION:trust,RUNNER_TEMP:tmp,GITHUB_ENV:path.join(parent,'github-env')}});
 return {config,manifest,marker,run};
}
for(const [job,definition] of Object.entries(workflow.jobs)) {
 const bootstrap=definition.steps.find(s=>s.name==='Fetch the immutable factory dependency');
 test(`CI ${job}: changed proposed pin is rejected before dependency execution`,t=>{
  assert.ok(bootstrap);const f=fixture(t);fs.writeFileSync(f.config,JSON.stringify({factory:{revision:'b'.repeat(40)}}));
  const r=f.run(bootstrap.run);assert.notEqual(r.status,0);assert.notEqual(r.status,90);assert.ok(!fs.existsSync(f.marker));
 });
 test(`CI ${job}: changed manifest is rejected before dependency execution`,t=>{
  const f=fixture(t);fs.writeFileSync(f.manifest,'unreviewed replacement\n');const r=f.run(bootstrap.run);
  assert.notEqual(r.status,0);assert.notEqual(r.status,90);assert.ok(!fs.existsSync(f.marker));
 });
 test(`CI ${job}: missing external authority is rejected before dependency execution`,t=>{
  const f=fixture(t),r=f.run(bootstrap.run,'');assert.notEqual(r.status,0);assert.ok(!fs.existsSync(f.marker));
 });
 test(`CI ${job}: reviewed inputs reach the dependency installation barrier`,t=>{
  const f=fixture(t),r=f.run(bootstrap.run);assert.equal(r.status,90,r.stderr);assert.ok(fs.existsSync(f.marker));
 });
}
