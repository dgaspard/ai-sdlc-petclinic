import fs from "node:fs";
import path from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {factoryPath} from "../../tools/petclinic/factory-path.mjs";
const factory=factoryPath();
const {check}=await import(pathToFileURL(path.join(factory,"tools/guard/check.mjs")));
check(fileURLToPath(new URL("../../",import.meta.url)));
