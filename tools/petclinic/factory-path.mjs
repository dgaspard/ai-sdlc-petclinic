import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export const consumerRoot = fileURLToPath(new URL('../../', import.meta.url));
export function factoryPath() {
 const config=JSON.parse(fs.readFileSync(path.join(consumerRoot,'spec/factory/petclinic/config.json')));
 if (!/^[a-f0-9]{40}$/.test(config.factory.revision)) throw Error('Full immutable factory revision required');
 if (!process.env.FACTORY_CHECKOUT) throw Error('Set FACTORY_CHECKOUT to the separately fetched pinned factory checkout');
 const supplied=path.resolve(process.env.FACTORY_CHECKOUT);
 const root=fs.realpathSync(supplied);
 if (root!==supplied) throw Error('Factory dependency must be a real checkout path, not a symlink');
 const app=fs.realpathSync(consumerRoot);
 if (root===app || root.startsWith(app+path.sep) || app.startsWith(root+path.sep)) throw Error('Factory and consumer checkouts must not overlap');
 const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 if (fs.realpathSync(git('rev-parse','--show-toplevel'))!==root || git('rev-parse','HEAD')!==config.factory.revision || git('status','--porcelain')) throw Error('Factory checkout must be clean and at the reviewed immutable revision');
 return root;
}
