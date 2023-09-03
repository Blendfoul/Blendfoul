import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  runTasksInSerial,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { resolve as pathResolve } from 'path';
import { ChildProcess, spawn } from 'child_process';
import { ApplicationGeneratorSchema } from './schema';
import { normalizeOptions } from './utils/normalize-options';
import { runSymlink } from '@nx/react-native/src/utils/symlink-task';
import { createRunTargets } from './utils/create-run-targets';
import path = require('path');

export async function applicationGenerator(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  const options = await normalizeOptions(tree, schema);
  
  await updateDependencies(tree);
  
  const symlinkTask = runSymlink(tree.root, options.appProjectRoot);

  await symlinkTask();

  await runRNWcli(tree.root, options.appProjectRoot);

  const pathForFilesToCopy = path.join(__dirname, 'files');
  
  generateFiles(tree, pathForFilesToCopy, options.appProjectRoot, options);
  
  updateProjectConfiguration(tree, options.projectName, {
    root: options.appProjectRoot,
    targets: {
      ...createRunTargets(),
    }
  });

  await formatFiles(tree);

  return 
}

async function runRNWcli(
  workspaceRoot: string, 
  projectRoot: string
) {
  return new Promise<ChildProcess>((resolve, reject) => {
    const childProcess = spawn('npx', [
      "react-native-windows-init",
      "--overwrite",
      ], {
        shell: true,
        stdio: 'inherit',
        cwd: pathResolve(workspaceRoot, projectRoot),
        env: process.env,
    });

    const processExitListener = (signal?: number | NodeJS.Signals) => () => {
      childProcess.kill(signal);
      process.exit();
    };
    process.once('exit', (signal) => childProcess.kill(signal));
    process.once('SIGTERM', processExitListener);
    process.once('SIGINT', processExitListener);
    process.once('SIGQUIT', processExitListener);

    childProcess.on('error', (err) => {
      reject(err);
    });
    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(childProcess);
      } else {
        reject(code);
      }
    });
  });
}

async function updateDependencies(host: Tree) {
  const generator = addDependenciesToPackageJson(
    host,
    {
      'react-native-windows': '0.72.8',
    },
    {}
  );

  await runTasksInSerial(generator);

  return installPackagesTask(host);
}

export default applicationGenerator;
