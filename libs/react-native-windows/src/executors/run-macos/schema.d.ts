import { ReactNativeStartOptions } from '@nx/react-native/src/executors/start/schema';

export interface ReactNativeRunMacosOptions extends ReactNativeStartOptions {
  release?: boolean;
  root?: string;
  arch?: 'x64' | 'x86' | 'ARM64';
  singleproc?: boolean;
  emulator?: boolean;
  device?: boolean;
  target?: string;
  remoteDebugging?: boolean;
  logging?: boolean;
  noPackager?: boolean;
  bundle?: boolean;
  noLaunch?: boolean;
  noAutolink?: boolean;
  noBuild?: boolean;
  noDeploy?: boolean;
  deployFromLayout?: boolean;
  buildLogDirectory?: string;
  info?: boolean;
  directDebugging?: boolean;
  useHermes?: boolean;
  noTelemetry?: boolean;
}
