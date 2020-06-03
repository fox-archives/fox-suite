import path from 'path'
import stylelint from 'stylelint'

import * as foxUtils from "fox-utils";
import { IFox }from "fox-types";
import postcssScss from 'postcss-scss'

export async function bootstrapFunction(): Promise<void> {
  const templateFiles = [
    ".config/stylelint.config.js",
    ".config/stylelintignore"
  ]
  await foxUtils.useBootstrapTemplate({
    templateRoot: path.join(__dirname, '../src/templates'),
    // templateRoot: path.join(foxUtils.__dirname(import.meta), '../src/templates'),
    templateFiles
  })
}

export async function lintFunction(fox: IFox): Promise<void> {
  const { projectPath } = await foxUtils.getProjectData();

  foxUtils.setFoxOptionsToEnv(fox)

  const config = (await import(path.join(projectPath, '.config/stylelint.config.js'))).default(fox)

  const resolve = (module: string) =>
    path.join(__dirname, `../node_modules/${module}`)
  // path.join(foxUtils.__dirname(import.meta), `../node_modules/${module}`)
  const stylelintConfigFoxPath =
    path.join(__dirname, '../node_modules/stylelint-config-fox')
    // path.join(foxUtils.__dirname(import.meta), '../node_modules/stylelint-config-fox')

  config.extends = config.extends || [],
  config.extends.unshift(stylelintConfigFoxPath)

  const sharedOptions: Partial<stylelint.LinterOptions> | undefined = {
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
    formatter: "string",
    cache: true,
    cacheLocation: path.join(projectPath, '.config/.stylelintcache'),
    disableDefaultIgnores: true,
    ignorePath: path.join(projectPath, '.config/stylelintignore'),
    reportNeedlessDisables: true,
    // TODO: fix
    // @ts-ignore
    reportInvalidScopeDisables: true
  }

  const result = await stylelint.lint({
    config,
    files: '**/*.css',
    ...sharedOptions
  })

  // const config2: Partial<stylelint.Configuration> = config
  // const i = resolve("postcss-scss/lib/scss-syntax.js");
  // console.log('i', i)
  // const j = (await import(i)).default
  // console.log(j)
  // config2.processors = [ j ];

  // // config2.plugins = [ postcssScss ]
  // // @ts-ignore
  // const result2 = await stylelint.lint({
  //   config: config2,
  //   files: '**/*.css',
  //   ...sharedOptions
  // })

  console.log('a', result.output)
}
