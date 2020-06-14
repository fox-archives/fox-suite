import path from 'path';
import fs from 'fs';
import prompts from 'prompts';
import * as c from 'colorette';
import { getProjectData } from './project.js';
import handlebars from 'handlebars';
import { IBuildBootstrap, ITemplateFile } from 'fox-types';
import { getPluginData } from './plugin.js';
import debug from './debug';
import merge from 'lodash.merge';

/**
 * generate boilerpalte configuration in `.config`
 * folder of local projet
 */

/**
 * @description configure how your project. right now all of this is
 * essentially automatically managed
 */
export async function buildBootstrap(opts: IBuildBootstrap): Promise<void> {
	const [pluginData, projectData] = await Promise.all([
		getPluginData(opts.dirname),
		getProjectData(),
	]);
	const doTemplate = async (
		fileToTemplate: ITemplateFile
	): Promise<{ fileDest: string; templatedText: string }> => {
		const fileContents = await fs.promises.readFile(
			fileToTemplate.absolutePath,
			{ encoding: 'utf8' }
		);
		const templateFn = handlebars.compile(fileContents);
		const templatedText = templateFn({
			noEscape: true,
		});
		const fileDest = path.join(
			projectData.location,
			fileToTemplate.relativePath
		);

		return {
			fileDest,
			templatedText,
		};
	};

	const retryFilesToTemplate: ITemplateFile[] = [];
	for (const fileToTemplate of pluginData.templateFiles) {
		const { fileDest, templatedText } = await doTemplate(fileToTemplate);
		try {
			try {
				await fs.promises.mkdir(path.dirname(fileDest), {
					mode: 0o755,
				});
			} catch {}
			await fs.promises.writeFile(fileDest, templatedText, {
				mode: 0o644,
				flag: 'wx+',
			});
		} catch (err) {
			if (err.code === 'EEXIST') {
				// if the file already exists, but is a json file,
				// merge the keys instead of throwing
				if (isJsonFile(fileToTemplate)) {
					await mergeJsonFiles(fileDest, templatedText);
				} else {
					retryFilesToTemplate.push(fileToTemplate);
				}
			} else {
				throw new Error(err);
			}
		}
	}

	// if we have files that would have overriden files that already exist
	// ask the user if they actually want them to be overriden
	if (retryFilesToTemplate.length > 0) {
		const alreadyExistingFilesFormatted = JSON.stringify(
			retryFilesToTemplate.map(
				(el: ITemplateFile): string => el.relativePath
			)
		);

		const { wantsToOverwrite } = await prompts({
			type: 'toggle',
			name: 'wantsToOverwrite',
			message: `Overwrite ${retryFilesToTemplate.length} files that already exist on disk?. Specifically, they are ${alreadyExistingFilesFormatted}. would you like to override them all?`,
			initial: false,
			active: 'yah!',
			inactive: 'no',
		});

		if (wantsToOverwrite) {
			for (const fileToTemplate of retryFilesToTemplate) {
				const { fileDest, templatedText } = await doTemplate(
					fileToTemplate
				);
				await fs.promises.writeFile(fileDest, templatedText, {
					mode: 0o644,
				});
			}
		} else {
			console.info(c.bold(c.red('exiting tui')));
			process.exit(1);
		}
	}

	console.info(c.bold(c.green('bootstrapped files successfully')));
}

function isJsonFile(templateFile: ITemplateFile): boolean {
	return path.extname(templateFile.relativePath) === '.json';
}

async function mergeJsonFiles(fileDest: string, templatedText: string) {
	const initialJson = JSON.parse(
		await fs.promises.readFile(fileDest, { encoding: 'utf8' })
	);
	const newJson = JSON.parse(templatedText);

	const finalJson = merge(initialJson, newJson);

	await fs.promises.writeFile(fileDest, JSON.stringify(finalJson, null, 2), {
		mode: 0o644,
	});
}
