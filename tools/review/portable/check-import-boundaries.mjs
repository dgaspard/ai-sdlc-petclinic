import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {factoryPath} from '../../petclinic/factory-path.mjs';
export const {checkImportBoundaries}=await import(pathToFileURL(path.join(factoryPath(),'tools/review/portable/check-import-boundaries.mjs')));
