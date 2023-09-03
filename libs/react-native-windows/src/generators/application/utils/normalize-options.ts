import { joinPathFragments, names, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { ApplicationGeneratorSchema } from '../schema';

export interface NormalizedSchema extends ApplicationGeneratorSchema {
  className: string; // app name in class name
  projectName: string; // directory + app name in kebab case
  appProjectRoot: string; // app directory path
  lowerCaseName: string; // app name in lower case
  entryFile: string;
  macosProjectRoot: string;
  windowsProjectRoot: string;
}

export async function normalizeOptions(
  host: Tree,
  options: ApplicationGeneratorSchema
): Promise<NormalizedSchema> {
  const {
    projectName: appProjectName,
    names: projectNames,
    projectRoot: appProjectRoot,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'application',
    directory: options.directory,
    projectNameAndRootFormat: options.projectNameAndRootFormat,
  });

  const { className } = names(options.name);
  const macosProjectRoot = joinPathFragments(appProjectRoot, 'macos');
  const windowsProjectRoot = joinPathFragments(appProjectRoot, 'windows');

  const entryFile = 'src/main.tsx';

  return {
    ...options,
    name: projectNames.projectSimpleName,
    className,
    lowerCaseName: className.toLowerCase(),
    projectName: appProjectName,
    macosProjectRoot,
    windowsProjectRoot,
    appProjectRoot,
    entryFile,
  };
}
