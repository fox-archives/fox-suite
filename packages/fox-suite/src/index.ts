import minimist from 'minimist'
import prompts from 'prompts'
import * as foxUtils from 'fox-utils'

export async function runFoxSuite() {
  const argv = minimist(process.argv.slice(2))

  const projectData = await foxUtils.getProjectData()

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'choose action',
    choices: [
      { title: 'Bootstrap', description: 'Bootstrap configuration boilerplate', value: 'bootstrap' },
      { title: 'Lint', description: 'Lint via category', value: 'lint' }
    ]
  })

  if (action === 'bootstrap') {
    const { plugin } = await prompts({
      type: 'select',
      name: 'plugin',
      message: 'which configuration would you like to bootstrap?',
      choices: [
				{ title: 'Prettier', description: 'Lint most files', value: 'fox-plugin-prettier' },
				{ title: 'Htmlhint', description: 'Lint HTML files', value: 'fox-plugin-htmlhint' },
				{ title: 'Stylelint', description: 'Lint CSS files', value: 'fox-plugin-stylelint' },
				{ title: 'Eslint', description: 'Lint JS files', value: 'fox-plugin-eslint' }
      ]
    })

		if(plugin) {
			const { bootstrapFunction } = await import(plugin)
			await bootstrapFunction()
		} else {
			process.exitCode = 1
		}


  } else if (action === 'lint') {
    const { plugin } = await prompts({
      type: 'select',
      name: 'plugin',
      message: 'run a script',
      choices: [
        { title: 'Stylelint', description: 'Lint CSS Files', value: 'fox-plugin-stylelint' },
        { title: 'fox-plugin-markdown-lint', description: 'Lint markdown files', value: 'fox-plugin-markdown-lint' },
        { title: 'fox-plugin-package-json-lint', description: 'Lint package.json', value: 'fox-plugin-package-json-lint' },
        { title: 'fox-plugin-package-json-sort', description: 'Sort package.json', value: 'fox-plugin-package-json-sort'},
        { title: 'fox-plugin-eslint', description: 'Lint Typescript / Javascript', value: 'fox-plugin-eslint' }
      ]
    });

		if(plugin) {
			const { lintFunction } = await import(plugin)
			await lintFunction(projectData.foxConfig)
		} else {
			process.exitCode = 1
		}
  } else {
		process.exitCode = 1
	}
}
