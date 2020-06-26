## Building your own modules

### How to make a `preset`

TODO: make a template repo so it's actualy clear

it's similar to other tools. feel free to use esmodules and `export default`, since everything (including non-plugin code) is loaded with the `esm` package. within your plugin, you must dynamically import with the `import()` any syntax (or `require()`) any modules that require on `FOX_SUITE` environment variables

### Treatment of `template` files

Files are copied over from your plugin's `template` directly to the project's root directory - templated with `handlebars` (see variables below) - json files are merged with existing json files

-   opt to use `(await getProjectData()).location` over `path.dirname((await import('read-pkg-up')()).path)`-ish over `process.cwd()` where applicable

```sh
these are the variables and options passd to handlebars
{
	noEscape: true,
	data: {
		projectLocation: projectData.location,
		projectFoxConfigPath: projectData.foxConfigPath,
		projectPackageJsonPath: projectData.packageJsonPath,
		pluginRoot: pluginData.pluginRoot,
		pluginTemplateDir: pluginData.templateDir
	}
}
```
