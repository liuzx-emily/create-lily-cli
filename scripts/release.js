import pkg from "enquirer";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import pico from "picocolors";
import semver from "semver";
import { exec } from "./utils.js";

const { prompt } = pkg;
const currentVersion = createRequire(import.meta.url)("../package.json").version;

const versionIncrements = ["patch", "minor", "major"];
const step = (msg) => console.log(pico.cyan(msg));
const run = async (bin, args, opts = {}) => exec(bin, args, { stdio: "inherit", ...opts });

let versionUpdated = false;
async function getTargetVersion() {
  let res;
  const { release } = await prompt({
    type: "select",
    name: "release",
    message: "Select release type",
    choices: versionIncrements
      .map((o) => {
        const targetVersion = semver.inc(currentVersion, o);
        return `${o} (${targetVersion})`;
      })
      .concat(["custom"]),
  });

  if (release === "custom") {
    const result = await prompt({
      type: "input",
      name: "version",
      message: "Input custom version",
      initial: currentVersion,
    });
    res = result.version;
  } else {
    // release = "patch (1.2.1)" , 正则匹配括号内的内容，tres = 1.2.1
    res = release.match(/\((.*)\)/)?.[1] ?? "";
  }

  if (!semver.valid(res)) {
    throw new Error(`invalid target version: ${res}`);
  }
  return res;
}

function updatePackageVersion(version) {
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

async function gitCommitAndPushChanges(targetVersion) {
  step("\nCommit and Push Changes...");
  await run("git", ["add", "."]);
  await run("git", ["commit", "-m", `"release: v${targetVersion}"`]);
  await run("git", ["push"]);
}
async function gitCreateAndPushTag(targetVersion) {
  step("\nCreate and Push Tag...");
  await run("git", ["tag", `v${targetVersion}`]);
  await run("git", ["push", "origin", `v${targetVersion}`]);
}

async function main() {
  const targetVersion = await getTargetVersion();
  // TODO run tests if needed
  updatePackageVersion(targetVersion);
  versionUpdated = true;
  // TODO generate changelog
  await gitCommitAndPushChanges(targetVersion);
  await gitCreateAndPushTag(targetVersion);
}

main().catch((err) => {
  if (versionUpdated) {
    // revert to current version on failed releases
    updatePackageVersion(currentVersion);
  }
  console.error(err);
  process.exit(1);
});
