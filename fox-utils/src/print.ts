import chalk from 'chalk'

/**
 * @desc prints text in green color
 */
export function printSuccess(text: string): void {
  console.log(chalk.green(text))
}
