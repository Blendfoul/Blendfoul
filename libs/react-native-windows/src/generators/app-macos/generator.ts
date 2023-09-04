import {
  addDependenciesToPackageJson,
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
import { runPodInstall } from '../utils/pod-install-task';
import { NormalizedSchema, normalizeOptions } from '../utils/normalize-options';

export async function appMacosGenerator(
  tree: Tree,
  schema: AppMacosGeneratorSchema
) {
  const options = await normalizeOptions(tree, schema);
  
  const updateDependenciesTask = updateDependencies(tree);
  
  const symlinkTask = runSymlink(tree.root, options.appProjectRoot);

  const pathForFilesToCopy = path.join(__dirname, 'files');

  const podInstallTask = podInstall(tree, options);
  
  generateFiles(tree, pathForFilesToCopy, options.appProjectRoot, options);
  
  updateProjectConfiguration(tree, options.projectName, {
    root: options.appProjectRoot,
    targets: {
      ...createRunTargets(),
    }
  });

  await formatFiles(tree);

  return runTasksInSerial(updateDependenciesTask, symlinkTask, podInstallTask);
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

function podInstall(
  tree: Tree,
  options: NormalizedSchema,
) { 
  const macosDirectory = path.join(tree.root, options.appProjectRoot, 'macos');
  return runPodInstall({ macosDirectory, install: true, });
}

export default appMacosGenerator;
