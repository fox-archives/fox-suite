import path from 'path';
import fs from 'fs';
// import htmlhint from 'htmlhint'
import type { IFoxConfig } from 'fox-types';
import * as foxUtils from 'fox-utils';
import { HTMLHint } from 'htmlhint';

const { debug, c, glob } = foxUtils;

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
				path.join(project.location, '.config/build/htmlhint.config.js'),
				config
			);

			const htmlFiles = await glob(`${project.location}/**/*.{html,htm}`);

			for (const htmlFile of htmlFiles) {
				const htmlFileContent = await fs.promises.readFile(htmlFile, {
					encoding: 'utf8',
				});

				const results = HTMLHint.verify(htmlFileContent, {});

				for (const result of results) {
					console.info(
						c.bold(
							c.red(`${htmlFile}:${result.line}:${result.col}`)
						)
					);
					console.info(result.message);
					// @ts-ignore
					console.info(result.raw);
					console.info(result.rule);
					console.info();
				}
			}
		},
	});
}
