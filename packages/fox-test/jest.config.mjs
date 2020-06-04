export default {
	preset: 'ts-jest/presets/js-with-babel',
	setupFilesAfterEnv: ["jest-extended"],
	// transformIgnorePatterns: [
	// 	"/node_modules/(?!fox-utils).+\\.js$",
	// 	"/node_modules/(?!fox-stylelint).+\\.js$",
	// 	"/node_modules/(?!.*).+\\.js$"
	// ],
	// "moduleDirectories": [
	// 	"node_modules" // This is required
	// ],

	// works (sort of)
	// "transformIgnorePatterns": [],
	// "transform": {
	// 	'.js': 'jest-esm-transformer',
	// },
	// transform: {
	// 	"^.+\\.(ts|tsx|js|jsx)$": "<rootDir>/node_modules/babel-jest",
	// 	"^.+\\.(ts|tsx|js|jsx)$": "ts-jest",
	// },
	// "transform": {
	// 	"\\.m?js$": "esm"
	// },
	// "transformIgnorePatterns": []
}
