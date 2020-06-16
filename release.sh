#!/bin/sh -au

# usage
# ./release

require_clean_work_tree () {
	# update the index
	git update-index -q --ignore-submodules --refresh
	err=0

	# disallow unstaged changes in the working tree
	if ! git diff-files --quiet --ignore-submodules --
	then
		echo "cannot $1: you have unstaged changes."
		git diff-files --name-status -r --ignore-submodules -- >&2
		err=1
	fi

	# disallow uncommitted changes in the index
	if ! git diff-index --cached --quiet HEAD --ignore-submodules --
	then
		echo "cannot $1: your index contains uncommitted changes."
		git diff-index --cached --name-status -r --ignore-submodules HEAD -- >&2
		err=1
	fi

	if [ $err = 1 ]
	then
		echo "Please commit or stash them."
		exit 1
	fi
}

# shellcheck disable=SC1001
require_clean_work_tree \continue

packageJsonFiles=$(ls -- **/**/package.json | grep -v node_modules)
for packageJsonFile in $packageJsonFiles; do
	echo "$packageJsonFile"
	sed -i "s/\"workspace:/\"/g" "$packageJsonFile"
	pushd "$(dirname "$packageJsonFile")" || exit
	echo "$PWD"
	npm publish
	popd 1>/dev/null || exit
	git checkout HEAD -- "$packageJsonFile"
	echo -e "\033[0;94mdone.\033[0m\n"
done

sed -i "s/\"workspace:/\"/g" packages/fox-plugin-sort-package-json/package.json
