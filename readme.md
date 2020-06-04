# fox-suite

A sly suite of tools for web development

Do you ever...

- Get tired of setting up common tools and files (`.editorconfig`, `.prettierrc`, `.eslintconfig.js`, `.lint-stagedrc.json`, `husky.json`, etc.) over and over for each project?
- Want sane defaults for all of these tools without having to think?
- Allow to easily change the settings to something more strict if the project ends up being a bit more serious (and you want to focus on correctness rather than iterability)

If you feel similar, this package is likely for you!

Fox suite provides a unified interface for all formatting, linting, and boilerplate needs. It ensures these independent tools behave as epected and match behavior as closely as possible (ex. file globbing, tty output).

- nearly all configuration is placed in `.config`, to prevent clutter of project directory and `package.json`. rather than trying to abstract over this, you can just edit the files directly if you want to change a setting

- `.editorconfig` is the only other config file placed at root

Most of these third party tools are not invoked directly. This would mean we would have to depend on how the third party tool searches the fs for its config file, and probably other things.

`fox.config.js` is a javascript module that specifies a few options

```js
// fox.config.js
export default {
  all: 'cozy',
  monorepo: true,
  plugin: {
    eslint: 'cozy',
    stylelint: 'excessive'
  }
}
```

with each project, you may want to slightly change the configuration, geared towards *developer satisfaction*. for example, the above config lints javascript such that only the most aggregous errors are caught and that most autofixable rules are enabled. if your project suddenly becomes a bit more serious / big, you can always increase the parameter to 'strict', or 'excessive', to give more guarentees


## Who is this for?

This is for the _modern_ web devleoper. This "toolchain" aims to be as lightweight as possible, with respect to the generated code and the mental tax on the developer. For example, we always configure stylelint with `value-no-vendor-prefix` and `color-function-notation` to `modern`, since we assume the output will be piped through `autoprefixer` (probably via `fox-postcss`) if the user actually wants better browser support. Another example, we target to `ES2018` with typescript for `node` projects because we assume the code will be run on a supported / LTS node version. Last example, we target `ESNext` when linting with `eslint` to make things more flexable and useless errors pop up less.

Another thing, we try to be as explicit as possible. For example, if an API allows us, we try to remove any implicit 'commands'. Example, we explicitly set `node_modules/` in `stylelintignore` and prevent `node_modules` from automatically being added by setting an option when invoking stylelint node api. Again this removes mental tax since everything's more explicit

## Support

- ESlint
- Stylelint
- HTMLHint

## Building your own modules

it's kind of simple. you have to make sure you fork the template, since everything is setup there already. if you try to set it up yourself right now at the moment, you'll run into troubles (ex. since we load directly from `build/index.js` of package, completely bypassing node's module resolution algorithm). sometime in the future this will probably be improved

`info.ts`
```ts
export const info = {
	// used by buildCli. must be the same name as what's in your package.json
	name: 'fox-plugin-htmlhint',
	// used by prompts in fox-suite
	tool: 'Htmlhint',
	toolConfig: 'https://htmlhint.com/docs/user-guide/list-rules',
	// used by prompts in fox-suite and buildCli
	description: 'Lints the HTML files',
	// used by nothing
	descriptionLong: 'Lints HTML files'

}
```

## FAQ

### Supported Versions

right now we support running on node versions `>=12.17.0 >=v13.14.0 >=14.3.0`, but realistically speaking it only works for node `>=14.3.0` since there are issues with loading es modules with node versions 12 and 13 (not to mention lack of non-exclusive `.mjs` support for node 10). Not using ECMAScript modules, even for a compilation feels really dirty in 2020, so I'll try to automatically invoke node 14 through `nvm` and `n` to have better compatability or whatever

### What about Rome?

Rome solves a lot of problems related to tooling interoperability. However, there are some features that Rome will likely not have (such as markdown file linting or easy package release flow). Those seem out of the scope of the project (at least for now). `fox-suite` uses the apis of these somewhat niche tools to help improve your code. Eventually, `fox-suite` will hopefully include a module for easy integration with Rome.

### I don't like rule X

When you use `prettier`, `stylelint`, `eslint`, etc., there are bound to be rules you don't like. You can just, like, totally override them in `.config/*`.
