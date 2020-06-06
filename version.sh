#!/bin/sh

# usage
# ./version.sh 0.2.0

packageJsonFiles=$(ls **/**/package.json | grep -v node_modules)
for packageJsonFile in $packageJsonFiles; do
	sed -i "s/\"version\".*/\"version\": \"${1}\",/g" $packageJsonFile
done
