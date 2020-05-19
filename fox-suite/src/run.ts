import path from 'path'
import { spawn } from 'child_process'


export function run(script: string): void {
  const scriptPath = path.join(__dirname, '../node_modules/.bin', script)
  const scriptPath2 = path.join(__dirname, '../node_modules', script, 'bin', `${script}.js`)
  const tsNodePath = path.join(__dirname, '../../node_modules/.bin/ts-node')

  const child = spawn('node',['--enable-source-maps', scriptPath2], {
    cwd: process.cwd(),
    windowsHide: true
  })

  let output = ""
  child.stdout.on('data', data => {
    console.log(data.toString())
    output += data
  })
  child.stderr.on('data', data => {
    console.info(data.toString())
    output += data
  })
}
