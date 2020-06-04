module.exports = function(m) {
	return require('esm')(m, {
		"cjs": true,
		"mode": "auto",
		"await": false,
		"cache": true,
		"sourceMap": process.env.NODE_ENV === 'development'
	})
}
