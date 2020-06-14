import path from 'path';
import fs from 'fs';
import { HtmlValidate } from 'html-validate';
import type { IFoxConfig } from 'fox-types';
import * as foxUtils from 'fox-utils';

const { c, debug, glob } = foxUtils;

export { info } from './info';

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	});
}

export async function fixFunction(): Promise<void> {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn(): Promise<void> {
			const project = await foxUtils.getProjectData();

			const config = {};

			{
				debug('rebuilding config');
				await foxUtils.writeFile(
					path.join(
						project.location,
						'.config/build/html-validate.config.json'
					),
					config
				);
			}

			const htmlFiles = await glob(`${project.location}/**/*.html`);

			for (const htmlFile of htmlFiles) {
				// const htmlFileContent = await fs.promises.readFile(htmlFile, { encoding: 'utf8' })

				const htmlvalidate = new HtmlValidate();
				const report = htmlvalidate.validateFile(htmlFile);

				// console.log("valid", report.valid);
				if (!report.valid) {
					const file = report.results[0].filePath;
					for (const message of report.results[0].messages) {
						if (message.severity === 1)
							console.info(
								c.bold(
									c.yellow(
										`${file}:${message.line}:${message.column}`
									)
								)
							);
						if (message.severity === 2)
							console.info(
								c.bold(
									c.red(
										`${file}:${message.line}:${message.column}`
									)
								)
							);

						console.info(`${message.ruleId}: ${message.message}`);
						console.info(message.selector);
						if (message.context !== void 0)
							console.info(message.context);
						console.info();
					}
				}
			}
		},
	});
}
