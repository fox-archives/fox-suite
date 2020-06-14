export default {
	preset: 'ts-jest/presets/js-with-babel',
	setupFilesAfterEnv: ['jest-extended'],
	globals: {
		'ts-jest': {
			packageJson: 'package.json',
		},
	},
}
