# fox-suite

A fly suite of tools for Typescript, Javascript, and web development in general. Personally, I get tired setting up common tools over and over again like creating boilerplate configs for formatters and linters. A lot of tools like markdown linting, packagejson linting, code linting in markdown files are nice to have, but take too long to setup for each individual project to be worth it. Other tools like lint-staged, husky, and others are sometimes required, but setting them up over and over again quickly becomes tiresome, especialy if it is to only lint specific config.

Fox suite provides a unified interface for all formatting, linting, and boilerplate needs. It ensures these independent tools behave as epected and match behavior as closely as possible (ex. file globbing, tty output).

- nearly all configuration is placed in `.config`, to prevent clutter of project directory and `package.json`. this *cannot* be edited. the whole point of `fox-suite` is to remove the need to edit config files
- `.editorconfig` is the only other config file placed at root
- if really needed, use a `fox.config.js` or `.fox.js` file at the project root. here you can specify to `include` and `exclude` directories for each 3rd party tool=

Most of these third party tools are not invoked directly. This would mean we would have to depend on how the third party tool searches the fs for its config file, and probably other things.

`.fox.js` is a javascript module that specifies a few options
```js
.fox.js
export default {
  all: 'cozy',
  eslint: 'cozy',
  stylelint: 'excessive'
}
```

with each project, you may want to slightly change the configuration, geared towards *developer satisfaction*. for example, the above config lints javascript such that only the most aggregous errors are caught and that most autofixable rules are enabled. if your project suddenly becomes a bit more serious / big, you can always increase the parameter to 'cozy', or 'excessive', to give more guarentees
