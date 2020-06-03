# fox-plugin-package-json-sort

## Description

Automatically sorts package.json according to predefined schema.

// TODO: normalize-package-data

## Usage

### 1. Passing an object to sort

```js
import { sortPackageJson } from 'fox-util-sort-package-json'

const packageJson = JSON.parse(await fs.promises.readFile('package.json'))
const sortedPackageJson = sortPackageJson(packageJson)
```

### 2. Passing location of package.json file

```js
import { sortPackageJsonFile } from 'fox-util-sort-package-json'

// 'packageJsonFile' must be absolute path
const packageJsonFile = path.join(__dirname, 'package.json')
await sortPackageJsonFile(packageJsonFile)
```

### 3. Autofinding and formating package.json

More specifically, search begins at `./bin/sort-package-json.mjs` file location. the cli uses this option

```js
import { sortPackageJsonFileAuto } from 'fox-util-sort-package-json'

await sortPackageJsonFileAuto()
```

## Acknowledgements

Inspired by [sort-package-json](https://github.com/keithamus/sort-package-json)
