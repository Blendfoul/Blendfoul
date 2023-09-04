// Original source: @nx/react-native/src/utils/pod-install-task

import { execSync } from 'child_process';
import { platform } from 'os';
import * as chalk from 'chalk';
import { GeneratorCallback, logger } from '@nx/devkit';
import { existsSync } from 'fs-extra';
import { join } from 'path';

const podInstallErrorMessage = `
Running ${chalk.bold('pod install')} failed, see above.
Do you have CocoaPods (https://cocoapods.org/) installed?

Check that your XCode path is correct:
${chalk.bold('sudo xcode-select --print-path')}

If the path is wrong, switch the path: (your path may be different)
${chalk.bold('sudo xcode-select --switch /Applications/Xcode.app')}
`;

/**
 * Run pod install on ios directory
 * @param macosDirectory ios directory that contains Podfile
 * @returns resolve with 0 if not error, reject with error otherwise
 */
export function runPodInstall(
{ macosDirectory, install = true, options = {
  buildFolder: './build',
  repoUpdate: false,
  deployment: false,
} }: {
  macosDirectory: string; install?: boolean; options?: {
    buildFolder?: string;
    repoUpdate?: boolean;
    deployment?: boolean;
  };
}): GeneratorCallback {
  return () => {
    if (platform() !== 'darwin') {
      logger.info('Skipping `pod install` on non-darwin platform');
      return;
    }

    if (!install || !existsSync(join(macosDirectory, 'Podfile'))) {
      logger.info('Skipping `pod install`');
      return;
    }

    logger.info(`Running \`pod install\` from "${macosDirectory}"`);

    return podInstall(macosDirectory, options);
  };
}

export function podInstall(
  macosDirectory: string,
  options: {
    buildFolder?: string;
    repoUpdate?: boolean;
    deployment?: boolean;
  } = {
    buildFolder: './build',
    repoUpdate: false,
    deployment: false,
  }
) {
  try {
    execSync(
      `pod install ${options.repoUpdate ? '--repo-update' : ''} ${
        options.deployment ? '--deployment' : ''
      }`,
      {
        cwd: macosDirectory,
        stdio: 'inherit',
      }
    );
  } catch (e) {
    logger.error(podInstallErrorMessage);
    throw e;
  }
}
