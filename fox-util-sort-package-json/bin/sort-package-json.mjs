#!/usr/bin/env node

import path from 'path'
import fs from 'fs'

import { sortPackageJson } from '../lib/sort.mjs'

// TODO: make this actually work
const projectDir = process.cwd()

const packageJsonFile = path.join(projectDir, 'package.json')
fs.promises.readFile(packageJsonFile)
  .then(packageJsonRaw => {
    const packageJson = JSON.parse(packageJsonRaw)

    const sortedPackageJson = sortPackageJson(packageJson)

    return fs.promises.writeFile(packageJsonFile, JSON.stringify(sortedPackageJson, null, 2))
  })
  .catch(err => {
    console.error(err)
  })
