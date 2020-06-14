import path from 'path';
import prettier from 'prettier';
import { IFoxConfig } from 'fox-types';
import * as foxUtils from 'fox-utils';
import fs from 'fs';

const { debug, c, glob } = foxUtils;
const d = debug('fox-suite:fox-plugin-prettier');

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

			const config = (
				await import(
					path.join(__dirname, '../config/prettier.config.js')
				)
			).default;
			d('config/prettier.config.js config: %o', config);

			await foxUtils.writeFile(
				path.join(project.location, '.config/build/eslint.config.json'),
				config
			);
			// xml file endings: https://github.com/prettier/plugin-xml/blob/master/src/plugin.js
			// let fileEndings = 'jsx,tsx,ts,js,json,vue,less,'
			// fileEndings += 'scss,sass,css,postcss,pcss,graphql,md,mdx,yaml,yml,'
			// fileEndings += 'xml,dita,ditamap,ditaval,svg,xsd,'

			const files = await glob(`**/*`, {
				cwd: project.location,
				nodir: true,
				ignore: ['**/node_modules/**'],
			});

			for (const file of files) {
				fs.promises
					.readFile(file, { encoding: 'utf8' })
					.then(
						async (content: string): Promise<any> => {
							try {
								const formatedContent = prettier.format(
									content,
									{
										...config,
										filepath: file,
									}
								);

								const stats = await fs.promises.stat(file);

								return fs.promises.writeFile(
									file,
									formatedContent,
									{
										mode: stats.mode,
									}
								);
							} catch (err) {
								throw new Error(err);
							}
						}
					)
					.catch((err: any) => {
						if (
							!err
								.toString()
								.includes(
									'Error: No parser could be inferred for file'
								)
						) {
							console.error(err);
						}
					});
			}
		},
	});
}
