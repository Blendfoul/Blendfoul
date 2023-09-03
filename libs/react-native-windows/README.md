# react-native-windows

This plugin adds support for React Native Windows in React Native projects generated with [Nx](https://nx.dev).

## Usage

### Generate a React Native Windows application

```bash
nx g @blendfoul/react-native-windows:application <name>
```

Generator still under development, will not add react-native-windows to the desired application. So far only the executors are working.

### Usage with executors

```bash
  nx run <project>:run-windows
```

`project.json`
````json
{
  "targets": {
    "run-windows":{
      "executor": "@blendfoul/react-native-windows:run-windows",
      "dependsOn": ["ensure-symlink", "sync-deps"],
      "defaultConfiguration": "debug",
      "configurations": {
        "debug": {},
        "release": {
          "release": true
        }
      }
    },
    "run-macos":{
      "executor": "@blendfoul/react-native-windows:run-macos",
      "dependsOn": ["ensure-symlink", "sync-deps"],
      "defaultConfiguration": "debug",
      "configurations": {
        "debug": {},
        "release": {
          "release": true
        }
      }
    },
  }
}
``
