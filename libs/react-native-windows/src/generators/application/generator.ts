import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  runTasksInSerial,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { ApplicationGeneratorSchema } from './schema';
import { normalizeOptions } from './utils/normalize-options';
import { runSymlink } from '@nx/react-native/src/utils/symlink-task';
import { createRunTargets } from './utils/create-run-targets';
import { determineRunningEnv } from './utils/determine-running-env';

export async function applicationGenerator(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  const options = await normalizeOptions(tree, schema);
  
  updateDependencies(tree);

  const runEnv = determineRunningEnv(tree);

  const pathForFilesToCopy = path.join(__dirname, 'files', runEnv);
  
  generateFiles(tree, pathForFilesToCopy, options.appProjectRoot, options);
  
  const symlinkTask = runSymlink(tree.root, options.appProjectRoot);

  updateProjectConfiguration(tree, options.projectName, {
    root: options.appProjectRoot,
    targets: {
      ...createRunTargets(),
    }
  });

  await formatFiles(tree);

  installPackagesTask(tree);

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
