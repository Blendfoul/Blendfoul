import { ChildProcess, fork } from 'child_process';
import { ExecutorContext } from '@nx/devkit';
import { resolve as pathResolve } from 'path';

import { getCliOptions } from '@nx/react-native/src/utils/get-cli-options';
import startExecutor from '@nx/react-native/src/executors/start/start.impl';
import { ReactNativeRunMacosOptions } from './schema';

export interface ReactNativeRunMacosOutput {
  success: boolean;
}


let childProcess: ChildProcess;

export default async function* runMacosExecutor(
  options: ReactNativeRunMacosOptions,
  context: ExecutorContext
): AsyncGenerator<ReactNativeRunMacosOutput> {
  const projectRoot =
    context.projectsConfigurations.projects[context.projectName].root;

  if (!options.noPackager && !options.release) {
    const startResults = startExecutor(
      {
        port: options.port,
        resetCache: options.resetCache,
        interactive: true,
      },
      context
    );
    for await (const result of startResults) {
      if (result.success) {
        await runCliRunMacos(context.root, projectRoot, options);
        yield {
          success: true,
        };
      } else {
        return result;
      }
    }
  } else {
    await runCliRunMacos(context.root, projectRoot, options);
  }

  yield { success: true };
}

function runCliRunMacos(
  workspaceRoot: string,
  projectRoot: string,
  options: ReactNativeRunMacosOptions
): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    /**
     * Call the react native cli with option `--no-packager`
     * Not passing '--packager' due to cli will launch start command from the project root
     */
    childProcess = fork(
      require.resolve('react-native/cli.js'),
      ['run-macos', ...createRunMacosOptions(options), '--no-packager'],
      {
        stdio: 'inherit',
        cwd: pathResolve(workspaceRoot, projectRoot),
        env: { ...process.env, RCT_METRO_PORT: options.port.toString() },
      }
    );

    /**
     * Ensure the child process is killed when the parent exits
     */
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

const nxOptions = ['sync', 'packager'];
const startOptions = ['port', 'resetCache'];
const deprecatedOptions = ['variant', 'jetifier'];
const unsupportedOptions = ['mainActivity', 'mode', 'activeArchOnly'];

function createRunMacosOptions(options: ReactNativeRunMacosOptions) {

  const cliOptions= getCliOptions<ReactNativeRunMacosOptions>(
    options,
    [...nxOptions, ...startOptions, ...deprecatedOptions, ...unsupportedOptions],
    ['appId', 'appIdSuffix', 'deviceId']
  );

  return cliOptions;
}
