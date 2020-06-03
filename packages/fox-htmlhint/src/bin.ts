import { bootstrapFunction } from "./";
import * as foxUtils from "fox-utils";
import { setup } from "fox-utils";

setup();

const helpText = `fox-htmlhint

Usage:
  fox-htmlhint

Description:
  Lints the html files of current project

Options:
  --help  show help
  -h      show help

Examples:
  fox-htmlhint --help
  fox-htmlhint`;

async function runFunction() {
	await bootstrapFunction();
}

foxUtils.cli(process.argv, {
	helpText,
	runFunction,
});
