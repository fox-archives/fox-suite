# fox-transpiler

custom babel plugin + rolup combo to output config files for consumption by tooling

### old info

uses AOC and transpilation techniques to ensure `fox-plugin-foo` plugins can be evaluated such that they can be consumed by their respective tools. Some expressions and statements that need to be preevaluated include the following

references to the IPlugin or IConfigFox interfaces

```ts
const fox: IConfigFox = fox
fox.plugin.stylelint // => cozy
```

module definitions

```ts
export default {

}

// => module.exports {
// =>
// => }
```
