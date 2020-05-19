#!/bin/bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
tsNode="node_modules/.bin/ts-node"

export NODE_ENV=development

alias fox='$dir/$tsNode $dir/fox-suite/bin/fox.ts'
alias fox-package-json-sort='$dir/$tsNode $dir/fox-package-json-sort/bin/fox-package-json-sort.js'
alias fox-package-json-lint='$dir/$tsNode $dir/fox-package-json-lint/bin/fox-package-json-lint.js'
