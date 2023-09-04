import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  runTasksInSerial,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { ApplicationGeneratorSchema } from './schema';
import { normalizeOptions } from '../utils/normalize-options';
import { runSymlink } from '@nx/react-native/src/utils/symlink-task';
import { createRunTargets } from '../utils/create-run-targets';
import * as path from 'path';

export async function applicationGenerator(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  const options = await normalizeOptions(tree, schema);
  
  const updateDependenciesTask = updateDependencies(tree);
  
  const symlinkTask = runSymlink(tree.root, options.appProjectRoot);

  const pathForFilesToCopy = path.join(__dirname, 'files');
  
  generateFiles(tree, pathForFilesToCopy, options.appProjectRoot, options);
  
  updateProjectConfiguration(tree, options.projectNameAndRootFormat, {
    root: options.appProjectRoot,
    targets: {
      ...createRunTargets(),
    }
  });

  await formatFiles(tree);

  return runTasksInSerial(updateDependenciesTask, symlinkTask);
}

function updateDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      'react-native-windows': '0.72.8',
    },
    {}
  );
}

export default applicationGenerator;
