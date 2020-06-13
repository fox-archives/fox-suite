import { IFoxConfig } from "fox-types";

export function simpleImportSortPlugin(fox: IFoxConfig, tier: string): Record<string, any> {
	const obj: Record<string, any> = {
		plugins: [
			'eslint-plugin-simple-import-sort'
		],
		rules: {
			// ensure existing rules are disabled
			'sort-imports': 'off',
			'import/order': 'off',

			"simple-import-sort/sort": "error",
		}
	}

	return obj
}
