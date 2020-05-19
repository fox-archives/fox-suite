import path from 'path'
import { spawn } from 'child_process'


export function run(script: string): void {
  const scriptPath = path.join(__dirname, '../node_modules/.bin', script)
  const tsNodePath = path.join(__dirname, '../../node_modules/.bin/ts-node')

  console.log('ss', `${tsNodePath} ${scriptPath}`)
  const child = spawn(tsNodePath, [scriptPath], {
    cwd: process.cwd(),
    windowsHide: true
  })


  // const child = childProcess.execFile(scriptPath, {
  //   cwd: process.cwd(),
  //   windowsHide: true
  // })

  // if (!child?.stdout) throw new Error('child null')
  // if (!child?.stderr) throw new Error('child null')
  // const child2 = execFile("node", ["--version"], (error, stdout, stderr) => {
  //   if (error) {
  //     throw error;
  //   }
  //   console.log(stdout);
  // });

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
