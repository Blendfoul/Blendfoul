import { Tree } from "@nx/devkit";

export function determineRunningEnv(tree: Tree) {
  const rootPath = tree.root;

  if (rootPath.includes("\\")) {
    return "windows";
  } else {
    return "macos";
  }
}
