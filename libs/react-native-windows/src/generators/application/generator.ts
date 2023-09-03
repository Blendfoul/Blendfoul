import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { ApplicationGeneratorSchema } from './schema';
import { normalizeOptions } from './utils/normalize-options';
import { runSymlink } from '@nx/react-native/src/utils/symlink-task';

export async function applicationGenerator(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  const options = await normalizeOptions(tree, schema);
  
  updateDependencies(tree);
  
  generateFiles(tree, path.join(__dirname, 'files'), options.appProjectRoot, options);
  
  const symlinkTask = runSymlink(tree.root, options.appProjectRoot);

  await formatFiles(tree);

  return runTasksInSerial(symlinkTask);
}

async function updateDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      'react-native-windows': '0.72.8',
    },
    {}
    );  
}

export default applicationGenerator;
