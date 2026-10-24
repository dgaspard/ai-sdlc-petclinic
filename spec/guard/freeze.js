import fs from "node:fs";
import path from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {factoryPath} from "../../tools/petclinic/factory-path.mjs";
const factory=factoryPath();
const {freeze}=await import(pathToFileURL(path.join(factory,"tools/guard/freeze.mjs")));
freeze(fileURLToPath(new URL("../../",import.meta.url)));
