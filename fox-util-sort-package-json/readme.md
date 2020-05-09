# fox-util-sort-package-json

## Description

Automatically sorts package.json according to predefined schema.

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

### 3. Autofinding package.json based on `./bin/sort-package-json.mjs` file location (this is what the cli does)

```js
import { sortPackageJsonFileAuto } from 'fox-util-sort-package-json'

await sortPackageJsonFileAuto()
```

## Acknowledgements

Inspired by [sort-package-json](https://github.com/keithamus/sort-package-json)
