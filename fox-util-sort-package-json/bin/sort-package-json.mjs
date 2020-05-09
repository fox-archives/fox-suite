#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import minimist from 'minimist'


import { sortPackageJsonFile } from '../lib/sort.mjs'

const argv = minimist(process.argv.slice(2))
if (argv.help || argv.h) {
  console.log(`fox-util-sort-package-json

Usage:
  sort-package-json [...packageJsonLocations]

Description:
  Sorts the package.json of the current project

Options:
  --help  show help
  -h      show help

Examples:
  sort-package-json --help
  sort-package-json
  sort-package-json customFile.package.json other.json`)

  process.exitCode = 0
}

/**
 * @description given the location of this binary, this finds the package.json
 * folder of the parent project
 * @async returns walkup which is async
 * @todo make more robust; this probably won't work for pnpm and yarn 2
 */
function findParentPackageJson() {
  function parentDirOf(fileOrDir) {
    return path.join(fileOrDir, '..')
  }
  async function packageJsonExists(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
    return dirents.some(dirent => dirent.isFile() && dirent.name === 'package.json')
  }

  // currentLocation could be a file or dir
  async function walkUp(currentLocation) {
    if (await packageJsonExists(currentLocation)) {
      return path.join(currentLocation, 'package.json')
    }
    else {
      const newLocation = parentDirOf(currentLocation)
      return walkUp(newLocation)
    }
  }

  const currentFile = fileURLToPath(import.meta.url)
  const currentDir = parentDirOf(currentFile)
  return walkUp(currentDir)
}

findParentPackageJson()
  .then(packageJsonFile => {
    return sortPackageJsonFile(packageJsonFile)
  })
  .catch(err => {
    console.error(err)
  })
