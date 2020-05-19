import minimist from 'minimist'
import prompts from 'prompts'
import { run } from './run'

export async function runFoxSuite() {
  const argv = minimist(process.argv.slice(2))

  let has = (string: string) => argv._.includes(string)
  console.log(argv)
  if (has('bin') && has('package-json-sort')) {
    console.log('test')
  }

   const response = await prompts({
    type: 'select',
    name: 'script',
    message: 'run a script',
    choices: [
      { title: 'fox-markdown-lint', description: 'Lint markdown files', value: 'fox-markdown-lint' },
      { title: 'fox-package-json-lint', description: 'Lint package.json', value: 'fox-package-json-lint' },
      { title: 'fox-package-json-sort', description: 'Sort package.json', value: 'fox-package-json-sort'},
      { title: 'fox-eslint', description: 'Lint Typescript / Javascript', value: 'fox-eslint' }
    ]
  });

  const script: string = response.script
  run(script)
}
