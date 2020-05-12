import start from 'unified-args'
import extensions from 'markdown-extensions'
import processor from 'remark'
import proc from 'remark/package.json'
import cli from './package.json'

start({
  processor: processor,
  name: proc.name,
  description: cli.description,
  version: [
    proc.name + ': ' + proc.version,
    cli.name + ': ' + cli.version
  ].join(', '),
  pluginPrefix: proc.name,
  // @ts-ignore
  presetPrefix: proc.name + '-preset',
  packageField: proc.name + 'Config',
  rcName: '.' + proc.name + 'rc',
  ignoreName: '.' + proc.name + 'ignore',
  extensions: extensions
})
