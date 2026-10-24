import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {factoryPath} from '../../../tools/petclinic/factory-path.mjs';
await import(pathToFileURL(path.join(factoryPath(),'spec/tests/harness/run-all.test.js')));
