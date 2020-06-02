import minimist from 'minimist'
import prompts from 'prompts'
import { run } from './run'

export async function runFoxSuite() {
  const argv = minimist(process.argv.slice(2))

  const actionResponse = await prompts({
    type: 'select',
    name: 'action',
    message: 'choose action',
    choices: [
      { title: 'Bootstrap', description: 'Bootstrap configuration boilerplate', value: 'bootstrap' },
      { title: 'Lint', description: 'Lint via category', value: 'lint' }
    ]
  })

  if (actionResponse.action === 'bootstrap') {
    const bootstrapResponse = await prompts({
      type: 'select',
      name: 'module',
      message: 'which configuration would you like to bootstrap?',
      choices: [
        { title: 'Stylelint', description: 'Lint CSS files', value: 'fox-stylelint' }
      ]
    })

    const bootstrapModule: string = bootstrapResponse.module
    console.log(bootstrapModule)
    const r = '/home/edwin/docs/programming/repos/fox-suite/fox-suite/node_modules/fox-stylelint/build/index.js'
    console.info(r)
    const { bootstrapFunction } = await import(r)
    await bootstrapFunction()

  } else if (actionResponse.action === 'lint') {
    const lintResponse = await prompts({
      type: 'select',
      name: 'module',
      message: 'run a script',
      choices: [
        { title: 'Stylelint', description: 'Lint CSS Files', value: 'fox-stylelint' },
        { title: 'fox-markdown-lint', description: 'Lint markdown files', value: 'fox-markdown-lint' },
        { title: 'fox-package-json-lint', description: 'Lint package.json', value: 'fox-package-json-lint' },
        { title: 'fox-package-json-sort', description: 'Sort package.json', value: 'fox-package-json-sort'},
        { title: 'fox-eslint', description: 'Lint Typescript / Javascript', value: 'fox-eslint' }
      ]
    });

    const lintModule: string = lintResponse.module
    const { lintFunction } = await import(lintModule)
    await lintFunction()

    // const script: string = response.script;
    // run(script);
  }
}
