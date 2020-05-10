// @ts-ignore
import { sortPackageJsonFileAuto } from 'fox-package-json-sort'

(async () => {
  try {
    sortPackageJsonFileAuto()

  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
})()
