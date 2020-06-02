# fox-suite

A sly suite of tools for Typescript, Javascript, and web development in general

Do you ever...

- Get tired of setting up common tools and files (`.editorconfig`, `.prettierrc`, `.eslintconfig.js`, `.lint-stagedrc.json`, `husky.json`, etc.) over and over for each project
- Want sane defaults for all of these tools without having to think?
- Allow to easily change the settings to something more strict if the project ends up being a bit more serious (and you want to focus on correctness rather than iterability)

If you feel similar, this package is likely for you!

Fox suite provides a unified interface for all formatting, linting, and boilerplate needs. It ensures these independent tools behave as epected and match behavior as closely as possible (ex. file globbing, tty output).

- nearly all configuration is placed in `.config`, to prevent clutter of project directory and `package.json`. rather than trying to abstract over this, you can just edit the files directly if you want to change a setting

- `.editorconfig` is the only other config file placed at root

Most of these third party tools are not invoked directly. This would mean we would have to depend on how the third party tool searches the fs for its config file, and probably other things.

`.fox.js` is a javascript module that specifies a few options

```js
// .fox.js
export default {
  all: 'cozy',
  eslint: 'cozy',
  stylelint: 'excessive'
}
```

with each project, you may want to slightly change the configuration, geared towards *developer satisfaction*. for example, the above config lints javascript such that only the most aggregous errors are caught and that most autofixable rules are enabled. if your project suddenly becomes a bit more serious / big, you can always increase the parameter to 'strict', or 'excessive', to give more guarentees

## FAQ

### Supported Versions

right now we support running on node versions `>=12.17.0 >=v13.14.0 >=14.3.0` but realistically speaking it only works for node `>=14.3.0` since there are issues with loading es modules with node versions 12 and 13

### What about Rome?

Rome solves a lot of problems related to tooling interoperability. However, there are some features that Rome will likely not have (such as markdown file linting or easy package release flow). Those seem out of the scope of the project (at least for now). `fox-suite` uses the apis of these somewhat niche tools to help improve your code. Eventually, `fox-suite` will hopefully include a module for easy integration with Rome.
