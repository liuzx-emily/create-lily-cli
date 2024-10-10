#!/usr/bin/env node
import pkg from "enquirer";
import { cp, rename } from "fs/promises";
import path, { dirname } from "path";
import pico from "picocolors";
import process from "process";
import { fileURLToPath } from "url";
import { exec } from "../scripts/utils.js";

const { prompt } = pkg;

const run = async (bin, args, opts = {}) => exec(bin, args, { stdio: "inherit", ...opts });
const step = (msg) => console.log(pico.cyan(msg));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // __dirname 当前文件所在目录；process.cwd() 执行命令的目录

// 参考 https://github.com/eslint/create-config/blob/main/lib/config-generator.js

async function main() {
  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "project name",
      initial: "lily-vue2-project",
    },
  ];
  const { projectName } = await prompt(questions);
  const generatedProjectPath = await generateProject(projectName);
  await installDeps(generatedProjectPath);
  await initGit(generatedProjectPath);
}

async function generateProject(projectName) {
  const generatedProjectPath = path.join(process.cwd(), projectName);
  const src_path = path.join(__dirname, "../template");
  await cp(src_path, generatedProjectPath, { recursive: true }); // 将模板中的所有文件递归复制到目标路径
  await run("npm pkg set name=" + projectName, [], { cwd: generatedProjectPath });
  return generatedProjectPath;
}

async function installDeps(generatedProjectPath) {
  const spawnOptions = { cwd: generatedProjectPath };
  const { installDepsNow, pkgManager } = await prompt([
    {
      type: "toggle",
      name: "installDepsNow",
      message: "Would you like to install dependencies now?",
      initial: true,
    },
    {
      type: "select",
      name: "pkgManager",
      message: "Which package manager do you want to use?",
      choices: ["npm", "yarn", "pnpm"],
      initial: "pnpm",
      skip() {
        return !this.state.answers.installDepsNow;
      },
    },
  ]);
  if (installDepsNow) {
    step("Installing...");
    await run(`${pkgManager} install`, [], spawnOptions);
  }
}

async function initGit(generatedProjectPath) {
  const spawnOptions = { cwd: generatedProjectPath };
  await run("git init", [], spawnOptions);
  // 为了解决《npm 在 publish package 时，不会把 .gitignore 文件上传到 npm 仓库》，有两种方案：
  // 方案1：template中给.gitignore改名。这里再改回来
  await rename(
    path.join(generatedProjectPath, "gitignore"),
    path.join(generatedProjectPath, ".gitignore")
  );
  // 方案2：直接用代码创建 .gitignore
  // await writeFile(path.join(dirPath, ".gitignore"), "node_modules");
  await run("git add .", [], spawnOptions);
  const { commitNow } = await prompt([
    {
      type: "toggle",
      name: "commitNow",
      message: "Would you like to commit now?",
      initial: true,
    },
  ]);
  if (commitNow) {
    await run("git commit", ["-m", `"init project"`], spawnOptions);
  }
}

main();
