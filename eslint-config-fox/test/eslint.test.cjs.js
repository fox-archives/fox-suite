const eslint = require('eslint')
const config = require('../')

// jest won't execute matched javascript files ending in '.cjs'

test('config has basic properties', () => {
  expect(config).toBeObject()
  expect(config.parserOptions).toBeObject()
  expect(config.env).toBeObject()
  expect(config.plugins).toBeArray()
  expect(config.extends).toBeArray()
  expect(config.rules).toBeObject()
})

test('eslint engine evaluates config file', () => {
  const CLIEngine = eslint.CLIEngine

  const cli = new CLIEngine({
    useEslintrc: false,
    configFile: require.resolve('../'),
  })

  const code = 'const foo = 1\n'

  expect(cli.executeOnText(code).errorCount).toBe(0)
})
