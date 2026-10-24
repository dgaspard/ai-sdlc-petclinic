import fs from "node:fs";
import path from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {factoryPath} from "../../tools/petclinic/factory-path.mjs";
const factory=factoryPath();
const {createGuard}=await import(pathToFileURL(path.join(factory,"tools/guard/guard.mjs")));
export const {CONFIG, MANIFEST, listProtected, manifestFor, compare, scanSkips, REVIEW_WARNING_DAYS, taggedElements, scanTags}=createGuard(JSON.parse(fs.readFileSync(new URL("./protected-paths.json",import.meta.url))));
