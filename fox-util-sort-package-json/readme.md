# fox-util-sort-package-json

## Description

Automatically sorts package.json according to predefined schema.

## Usage

```js
import { sortPackageJson } from 'fox-util-sort-package-json'

const packageJson = JSON.parse(await fs.promises.readFile('package.json'))
const sortedPackageJson = sortPackageJson(packageJson)
```

## Acknowledgements

Inspired by [sort-package-json](https://github.com/keithamus/sort-package-json)
