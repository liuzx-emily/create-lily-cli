#!/usr/bin/env node
import process from "process";
import path from "path";
import { cp, writeFile } from "fs/promises";
import spawn from "cross-spawn"; // 用法同 nodejs 内置的 child_process 模块，但解决了跨平台的兼容性问题
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // __dirname 当前文件所在目录；process.cwd() 执行命令的目录

async function run() {
  const target_path = path.join(process.cwd(), "template-project");
  await generateFiles(target_path); // 根据模板生成文件
  installDeps(target_path); // 安装依赖
  initGit(target_path); // 初始化 git
}

run();

async function generateFiles(target_path) {
  const src_path = path.join(__dirname, "template");
  await cp(src_path, target_path, { recursive: true }); // 将模板中的所有文件递归复制到目标路径
}

function installDeps(path) {
  spawn.sync("pnpm i", { stdio: "inherit", cwd: path });
}

function initGit(path) {
  const spawnOptions = { stdio: "inherit", cwd: path };
  spawn.sync("git init", spawnOptions);
  writeFile(path.join(path, ".gitignore"), "node_modules");
  spawn.sync("git add .", spawnOptions);
  spawn.sync("git commit", ["-m", "init project"], spawnOptions);
}
