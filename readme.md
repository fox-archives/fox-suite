# fox-suite

A sly suite of tools for web development

Do you ever...

-   Get tired of setting up common tools and files (EditorConfig, Prettier, ESLint, Stylelint, lint-staged, husky, markdownlint, conventional-commit etc.) over and over for each project?
-   Want sane defaults for all of these tools without having to think?
-   Want to change increase or decrease general strictness of linting without having to change many settings?

If you feel similar, this tool is for you!

Fox suite provides a unified interface for formatting and linting. It ensures these independent tools _just work_. It's meant to be used on tiny to medium sided-projects.

## Who is this for?

- the _modern_ web developer
  - stylelint `color-function-notation` and `value-no-vendor-prefix` are set to modern values
  - target the highest possible ECMAScript when parsing with `eslint`
	- ensure PostCSS and Sass syntax is parsable by `stylelint` (TODO)


## Configuration

```js
// fox.config.js
export default {
	all: 'off | cozy (default) | strict | excessive',
	monorepo: true,
	env: [],
	plugin: {
		eslint: 'cozy',
		stylelint: 'excessive',
		[pluginName]: 'mode'
	},
};
```

Some other config files are automatically generated, like `.editorconfig` (TODO)

with each project, you may want to slightly change the configuration, geared towards _developer satisfaction_. for example, the above config lints javascript such that only the most aggregous errors are caught and that most autofixable rules are enabled. if your project suddenly becomes a bit more serious / big, you can always increase the parameter to 'strict', or 'excessive', to give more guarentees

## Usage

Right now it's _beta-ish quality_. Soon there'll be a `fox-preset-recommended` preset pack to use

```sh
npm i fox-suite fox-preset-all

fox
```

When using with preexisting tools that depend on path to config file (ex. if you're using `eslint-webpack-plugin`), you may need to use `fox > lint` manually to regenerate json config

## Options

With most config key, you can set it to either `off`, `cozy`, `strict`, or `excessive`

## Behavior

-   Exceptions include obviously temporary errors (ex. `no-lone-blocks` (`{}`)) (which may be _off_ or _warning_ when `NODE_ENV === development`)
    -   prevents premature distracting red error lines in code editors

### off

Turns of all functionality

### cozy

Catches code that has / is

-   aggregous errors
-   non-aggregous auto-fixable errors
-   hard to debug / easy to be buggy
-   isn't obviously buggy (but is buggy)
-   not unobviously buggy (and isn't)
-   deprecated syntax

### strict

Catches code that has / is

-   not up to best practices
-   unecessarily verbose / unecessarily misleading
    -   ex. needlessly using `.bind()`
-   ambiguous
-   essentially similar to what you would expect from `eslint-config-airbnr`, `stylelint-config-standard`, etc.

### excessive

Essentially the same as `strict`, but includes options that are
more annoying than helpfull when coding a project

-   ex. forcing default to exist at end of switch


## Support

Not everything has been tested generally and with regards to interop

-   html-validate
-   markdownlint
-   ESlint
-   Stylelint
-   HTMLHint
-   htmllint
-   html-verify
-   prettier
-   sort-package-json
-   package-json-lint

stuff like commit-convention might be added later

-   boilerplating babel, typescript etc configs are out of the scope of this project

## Building your own modules



#### How to make a `preset`

TODO: make a template repo so it's actualy clear

it's similar to other tools. feel free to use esmodules and `export default`, since everything (including non-plugin code) is loaded with the `esm` package. within your plugin, you must dynamically import with the `import()` any  syntax (or `require()`) any modules that require on `FOX_SUITE` environment variables

### Treatment of `template` files

Files are copied over from your plugin's `template` directly to the project's root directory
	- templated with `handlebars` (with no extra variables passed right now)
	- json files are merged with existing json files

-   opt to use `(await getProjectData()).location` over `path.dirname((await import('read-pkg-up')()).path)`-ish over `process.cwd()` where applicable

```
projectLocation: projectData.location,
projectFoxConfigPath: projectData.foxConfigPath,
projectPackageJsonPath: projectData.packageJsonPath
```
## FAQ

### What about Rome?

Rome solves a lot of problems related to tooling interoperability. However, there are some features that Rome will likely not have (such as markdown file linting or easy package release flow). Those seem out of the scope of the project (at least for now). `fox-suite` uses the apis of these somewhat niche tools to help improve your code. Eventually, `fox-suite` will hopefully include a module for easy integration with Rome.

### What about Rush?

Ruch Stack is a great and usefull tool, but I wanted something a but more customizable and lighterweight - something that was able to integrate with existing tooling a bit easier

### I don't like rule X

When you use `prettier`, `stylelint`, `eslint`, etc., there are bound to be rules you don't like. with some rules you can edit what's outputed in `.config`
