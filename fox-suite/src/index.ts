import chalk from 'chalk'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

let has = (string: string) => argv._.includes(string)
console.log(argv)
if (has('bin') && has('package-json-sort')) {
  console.log('test')
}
