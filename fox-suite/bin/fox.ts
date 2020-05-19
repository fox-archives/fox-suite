#!/usr/bin/env node
import prompts from 'prompts'
import { run } from '../src/run'

(async () => {
  const response = await prompts({
    type: 'select',
    name: 'script',
    message: 'run a script',
    choices: [
      { title: 'fox-markdown-lint', description: 'Lint markdown files', value: 'fox-markdown-lint' },
      { title: 'fox-package-json-lint', description: 'Lint package.json', value: 'fox-package-json-lint' },
      { title: 'fox-package-json-sort', description: 'Sort package.json', value: 'fox-package-json-sort'}
    ]
  });

  const script: string = response.script
  run(script)
})()
