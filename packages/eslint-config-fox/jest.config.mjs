export default {
	preset: 'ts-jest',
	setupFilesAfterEnv: ['jest-extended'],
	globals: {
		'ts-jest': {
			packageJson: 'package.json',
		},
	},
}
