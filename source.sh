#!/bin/bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
tsNode="node_modules/.bin/ts-node"

export NODE_ENV=development

alias fox='$dir/$tsNode $dir/fox-suite/bin/fox.js'
alias fox-plugin-package-json-sort='$dir/$tsNode $dir/fox-plugin-package-json-sort/bin/fox-plugin-package-json-sort.js'
alias fox-plugin-package-json-lint='$dir/$tsNode $dir/fox-plugin-package-json-lint/bin/fox-plugin-package-json-lint.js'
