import path from 'path';
import fs from 'fs';

/**
 * @description `fs.promises.mkdir()`, but ensures folder structure
 * exists and writes with consistent mode
 */
export async function writeFile(
	filePath: string,
	content: string | Record<string, any>
): Promise<void> {
	if (typeof content === 'object' && content !== null) {
		content = JSON.stringify(content, null, 2);
	}
	try {
		await fs.promises.mkdir(path.dirname(filePath));
	} catch (err) {
		if (err.code !== 'EEXIST') console.error(err);
	}
	await fs.promises.writeFile(path.join(filePath), content, { mode: 0o644 });
}
