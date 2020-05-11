#!/bin/bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
tsNode="node_modules/.bin/ts-node"

alias fox-package-json-sort='$dir/$tsNode $dir/fox-package-json-sort/bin/package-json-sort.ts'
alias fox-package-json-lint='$dir/$tsNode $dir/fox-package-json-lint/bin/package-json-lint.ts'
