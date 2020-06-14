import path from 'path';
import fs from 'fs';
// @ts-ignore
import htmllint from 'htmllint';
import type { IFoxConfig } from 'fox-types';
import * as foxUtils from 'fox-utils';
import glob from 'glob';
import util from 'util';
import * as c from 'colorette';

export { info } from './info';

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	});
}

export async function fixFunction(): Promise<void> {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn() {
			const project = await foxUtils.getProjectData();

			const config = {};

			await foxUtils.writeFile(
				path.join(
					project.location,
					'.config/build/htmllint.config.json'
				),
				config
			);

			const htmlFiles = await util.promisify(glob)(
				`${project.location}/**/*.html`
			);

			for (const htmlFile of htmlFiles) {
				const htmlFileContent = await fs.promises.readFile(htmlFile, {
					encoding: 'utf8',
				});

				const outputs = await htmllint(htmlFileContent, {});
				console.info(outputs);

				for (const output of outputs) {
					console.info(
						c.bold(
							c.red(`${htmlFile}:${output.line}:${output.column}`)
						)
					);
					console.info(`${output.code}: ${output.rule}`);
					console.info(output.data);
					console.info();
				}
			}
		},
	});
}
