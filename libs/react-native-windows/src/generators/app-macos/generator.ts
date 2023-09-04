import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  runTasksInSerial,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { AppMacosGeneratorSchema } from './schema';
import { runSymlink } from '@nx/react-native/src/utils/symlink-task';
import { createRunTargets } from '../utils/create-run-targets';
import { normalizeOptions } from '../utils/normalize-options';

export async function appMacosGenerator(
  tree: Tree,
  schema: AppMacosGeneratorSchema
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
      'react-native-macos': '0.71.34',
    },
    {}
  );
}

export default appMacosGenerator;
