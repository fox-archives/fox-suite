import path from 'path'
// @ts-ignore
import { NpmPackageJsonLint } from "npm-package-json-lint";
import * as foxUtils from "fox-utils";

export async function bootstrapFunction(): Promise<void> {
  const templateFiles = [
    ".config/stylelint.config.js"
  ]
  await foxUtils.useBootstrapTemplate({
    templateRoot: path.join(__dirname, '../src/templates'),
    templateFiles
  })
}

export async function lintFunction(): Promise<void> {
  const { projectPackageJson, projectPackageJsonPath, projectPath } =
    await foxUtils.getProjectData();
  const packageJsonLintConfig = await foxUtils.getAndCreateConfig(
    projectPath,
    "fox-package-json-lint",
  );
  if (!packageJsonLintConfig) return;
}
