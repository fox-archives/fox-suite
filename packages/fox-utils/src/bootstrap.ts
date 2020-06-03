import path from 'path'
import fs from 'fs'
import prompts from 'prompts'

import { getProjectData } from './project.js';

/**
 * generate boilerpalte configuration in `.config`
 * folder of local projet
 */

interface IUseBootstrapTemplate {
  templateRoot: string,
  templateFiles: string[]
}

/**
 * @property {string[]} - absolute path of config files to copy over
 */
export async function useBootstrapTemplate({
  templateRoot,
  templateFiles
}: IUseBootstrapTemplate): Promise<void> {
  const { location } = await getProjectData()
  await ensureDotConfigDir(location)


  const retryFiles: { templateSrc: string, templateDest: string }[] = []
  for (const templateFileName of templateFiles) {
    const templateSrc = path.join(templateRoot, templateFileName);
    const templateDest = path.join(location, templateFileName)

    try {
      await fs.promises.copyFile(
        templateSrc,
        templateDest,
        fs.constants.COPYFILE_EXCL,
      );
    } catch (err) {
      if (err.code === 'EEXIST') {
        retryFiles.push({ templateSrc, templateDest })
      } else {
        throw new Error(err)
      }
    }
  }

  // if we have files that would have overriden files that already exist
  // ask the user if they actually want them to be overriden
  if (retryFiles.length > 0) {
    const retryFileNames = retryFiles.map(({ templateSrc }) =>
      templateSrc.slice(templateRoot.length + 1))

    const { wantsToOverwrite } = await prompts({
      type: 'toggle',
      name: 'wantsToOverwrite',
      message: `Overwrite ${retryFiles.length} files that already exist on disk?. Specifically, they are ${JSON.stringify(retryFileNames)}. would you like to override them all?`,
      initial: true,
      active: 'yah!',
      inactive: 'no'
    })

    if (wantsToOverwrite) {
      for (const { templateSrc, templateDest } of retryFiles) {
        await fs.promises.copyFile(
          templateSrc,
          templateDest,
          fs.constants.COPYFILE_FICLONE,
        );
      }
    }
  }

  console.log('done')

}

async function ensureDotConfigDir(location: string): Promise<void> {
  const dotConfigDir = path.join(location, '.config')
  try {
    await fs.promises.access(dotConfigDir, fs.constants.F_OK);
  } catch(err) {
    if (err.code === 'ENOENT') {
      await fs.promises.mkdir(dotConfigDir, { recursive: true, mode: 0o755 })
    } else {
      throw new Error(err)
    }
  }
}
