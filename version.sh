#!/bin/sh -eu

# usage
# ./version.sh 0.2.0

# shellcheck disable=SC2039
test -z "${1-}" && echo -e "\033[0;31mversion cannot be empty. exiting.\033[0m" && exit 1

cd "packages/fox-suite"
pnpm run build
cd ../..

# shellcheck disable=SC2046,SC2116,SC2010
packageJsonFiles=$(echo $(ls -- **/**/package.json | grep -v node_modules) test/package.json package.json lerna.json)
for packageJsonFile in $packageJsonFiles; do
	sed -i "s/\"version\".*/\"version\": \"${1}\",/g" "$packageJsonFile"
	sed -Ei "s/(fox-.*\")(workspace.*\")(.*)/\1workspace:\^${1}\"\3/g" "$packageJsonFile"
	sed -Ei "s/(.*-fox\": \")(workspace.*\")(.*)/\1workspace:\^${1}\"\3/g" "$packageJsonFile"
	sed -Ei "s/(babel-plugin-fox-.*\")(workspace.*\")(.*)/\1workspace:^${1}\"\3/g" "$packageJsonFile"
done

git commit -a -m "release: v${1-}"
git tag "v$1"
git push origin dev
