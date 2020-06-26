# Options

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
