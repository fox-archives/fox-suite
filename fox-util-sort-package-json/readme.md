# fox-util-sort-package-json

## Description

Automatically sorts package.json according to predefined schema.

## Usage

```js
import { sort } from 'fox-util-sort-package-json'

const packageJson = JSON.parse(await fs.promises.readFile('package.json'))
const sortedPackageJson = sort(packageJson)
```

## Acknowledgements

Inspired by [sort-package-json](https://github.com/keithamus/sort-package-json)
