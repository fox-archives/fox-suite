import path from 'path'
import stylelint from 'stylelint'

import * as foxUtils from "fox-utils";
import { IFox }from "fox-types";

export async function bootstrapFunction(): Promise<void> {
  const templateFiles = [
    ".config/stylelint.config.js",
    ".config/stylelintignore"
  ]
  await foxUtils.useBootstrapTemplate({
    templateRoot: path.join(foxUtils.__dirname(import.meta), '../src/templates'),
    templateFiles
  })
}

export async function lintFunction(fox: IFox): Promise<void> {
  const { projectPath } =
    await foxUtils.getProjectData();

  const configFn = await import(path.join(projectPath, '.config/stylelint.config.js'))
  const stylelintConfigFoxPath = path.join(foxUtils.__dirname(import.meta), '../node_modules/stylelint-config-fox')
  const cachePath = path.join(projectPath, '.config/.stylelintcache')
  const ignorePath = path.join(projectPath, '.config/stylelintignore')

  const config = configFn.default(fox)
  config.extends = config.extends || [],
  config.extends.unshift(stylelintConfigFoxPath)
  console.log('config::', config)
  const result = await stylelint.lint({
    config,
    files: '**/*.css',
    // TODO: fix
    // @ts-ignore
    globbyOptions: {
      cwd: projectPath,
      ignore: [],
      caseSensitiveMatch: true, // default
      dot: false, // default
      gitignore: false // default
    },
    configBasedir: projectPath,
    fix: true,
    formatter: 'string',
    cache: true,
    cacheLocation: cachePath,
    disableDefaultIgnores: true,
    ignorePath,
    reportNeedlessDisables: true,
    // TODO: fix
    // @ts-ignore
    reportInvalidScopeDisables: true
  })

  console.log('output')
  // console.log(result)
  console.log('a', result.output)
}
