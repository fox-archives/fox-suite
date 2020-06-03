import start from 'unified-args'
// @ts-ignore
import extensions from 'markdown-extensions'
// @ts-ignore
import processor from 'remark'
// @ts-ignore
import proc from 'remark/package.json'

export { info } from './info'

export async function runMarkdownLint() {
  // start({
  //   processor: processor,
  //   name: proc.name,
  //   description: cli.description,
  //   version: [
  //     proc.name + ': ' + proc.version,
  //     cli.name + ': ' + cli.version
  //   ].join(', '),
  //   pluginPrefix: proc.name,
  //   // @ts-ignore
  //   presetPrefix: proc.name + '-preset',
  //   packageField: proc.name + 'Config',
  //   rcName: '.' + proc.name + 'rc',
  //   ignoreName: '.' + proc.name + 'ignore',
  //   extensions: extensions
  // })
}
