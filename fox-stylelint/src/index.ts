import path from 'path'
import stylelint from 'stylelint'

import * as foxUtils from "fox-utils";

export async function bootstrapFunction(): Promise<void> {
  const templateFiles = [
    ".config/stylelint.config.js"
  ]
  await foxUtils.useBootstrapTemplate({
    templateRoot: path.join(foxUtils.__dirname(import.meta), '../src/templates'),
    templateFiles
  })
}

export async function lintFunction(): Promise<void> {
  const { projectPath } =
    await foxUtils.getProjectData();

  const { default: config } = await import(path.join(projectPath, '.config/stylelint.config.js'))
  const cachePath = path.join(projectPath, '.config/.stylelintcache')
  const ignorePath = path.join(projectPath, '.config/stylelintignore')

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
    configBasedir: path.join(foxUtils.__dirname(import.meta), '..'),
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

  console.log(result)
}
