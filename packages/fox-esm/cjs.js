module.exports = function(m) {
	return require('esm')(m, {
		// TODO: disable cjs features
		"cjs": true,
		"mode": "auto",
		"await": false,
		"cache": true,
		"sourceMap": process.env.NODE_ENV === 'development'
	})
}
