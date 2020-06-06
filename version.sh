#!/bin/sh -au

# usage
# ./version.sh 0.2.0

test -z ${1-} && echo -e "\033[0;31mversion cannot be empty. exiting.\033[0m" && exit 1

packageJsonFiles=$(ls **/**/package.json | grep -v node_modules)
for packageJsonFile in $packageJsonFiles; do
	sed -i "s/\"version\".*/\"version\": \"${1}\",/g" $packageJsonFile
	sed -Ei "s/(fox-.*)(\"\^.*)/\1\"^${1}\",/g" $packageJsonFile
	sed -Ei "s/(.*-fox)(\"\^.*)/\1\"^${1}\",/g" $packageJsonFile
	sed -Ei "s/(babel-plugin-fox-.*)(\"\^.*)/\1\"^${1}\",/g" $packageJsonFile
done
