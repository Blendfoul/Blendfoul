export function createRunTargets() {
  return {
    "run-windows":{
      "executor": "@blendfoul/react-native-windows:run-windows",
      "dependsOn": ["ensure-symlink", "sync-deps"],
      defaultConfiguration: "debug",
      "configurations": {
        "release": {
          release: true,
        },
        "debug": {
        },
      },
    },
    "run-macos":{
      "executor": "@blendfoul/react-native-windows:run-macos",
      "dependsOn": ["ensure-symlink", "sync-deps"],
      defaultConfiguration: "debug",
      "configurations": {
        "release": {
          release: true,
        },
        "debug": {
        },
      },
    },
  };
}
