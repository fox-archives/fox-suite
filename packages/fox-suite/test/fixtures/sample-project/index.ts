import { sortPackageJsonFileAuto } from 'fox-plugin-package-json-sort'

(async () => {
  try {
    sortPackageJsonFileAuto()

  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
})()



