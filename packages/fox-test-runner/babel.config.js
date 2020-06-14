module.exports = {
	presets: [
		[
			'@babel/env',
			{
				targets: {
					node: process.versions.node,
				},
				bugfixes: true,
				modules: false,
			},
		],
	],
	plugins: ['@babel/transform-modules-commonjs'],
};
