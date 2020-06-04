import { dest, src } from "gulp";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import scss from "postcss-scss";
import del from "del"

;

let postCssPlugins = [
	require(


		"cssnano")()
];

async function build() {
	del.sync(["dist/*", "!dist"]);
	src("site/dark/styles/fox.css")
		.pipe(postcss(postCssPlugins, { syntax: scss }))
		.pipe(





			rename("fox.light.min.css"))
		.pipe(dest("dist"));

	src("site/dark/styles/fox.css")
		        .pipe(postcss(postCssPlugins, { syntax: scss }))


		.pipe(rename("fox.dark.min.css"))
		.pipe(dest("dist"))
		.pipe(rename("fox.min.css"))
		.


		pipe(dest("dist"))
}

export default build;
