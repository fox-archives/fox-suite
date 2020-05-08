import path from 'path'
import fs from 'fs'
import test from 'ava'

import { sortPackageJson } from '../lib/sort.js'

const testPackageJsons = ['empty', 'basic', 'full', 'complex']
for (const testPackageJson of testPackageJsons) {
  test(`ensure ${testPackageJson} package.json is ordered properly`, async t => {
    const packageJsonLocation = path.join(__dirname, `./fixtures/${testPackageJson}.package.json`)
    const correctPackageJsonLocation = path.join(__dirname, `./fixtures/${testPackageJson}.fmt.package.json`)

    const packageJsonRaw = await fs.promises.readFile(packageJsonLocation)
    const correctPackageJsonRaw = await fs.promises.readFile(correctPackageJsonLocation)

    const packageJson = JSON.parse(packageJsonRaw)
    const correctPackageJson = JSON.parse(correctPackageJsonRaw)

    const output = sortPackageJson(packageJson)

    t.deepEqual(correctPackageJson, output)
  })
}
