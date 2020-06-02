import { bootstrapFunction, lintFunction } from "./";
import * as foxUtils from "fox-utils";
import { setup } from "fox-utils";

setup();

const helpText = `fox-stylelint

Usage:
  fox-stylelint

Description:
  Lints the css files of current project

Options:
  --help  show help
  -h      show help

Examples:
  fox-stylelint --help
  fox-stylelint`;

async function runFunction() {
  await bootstrapFunction();
}

foxUtils.cli(process.argv, {
  helpText,
  runFunction,
});
