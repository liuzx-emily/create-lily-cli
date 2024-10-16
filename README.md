说明：此包原是为了方便地创建 vue2 项目，但是在添加新功能的过程中我发现不仅 vue2 本身 EOL，vue2 的整个生态不只是 EOL，更是被毁尸灭迹（见[文章](https://liuzx-emily.github.io/blog/#/post/9110fd9a-99f9-4fc2-a40a-ab96c590fa16)）。所以我决定认清现实，放弃 vue2。此包不再更新了。

---

# create-lily-cli

vue2 项目脚手架 (pnpm + vite + vue2 + eslint + sass + jsx)。
自动生成项目（自动创建项目文件、安装依赖、初始化 git 并 commit）

相关文章： [《从零开始的＜ vue2 项目脚手架＞搭建：vite+vue2+eslint》](https://liuzx-emily.github.io/blog/#/post/1ac6fb5e-1737-44a7-881e-31a35ba69e33)

## Usage

```bash
npm init lily-cli@latest
```

## 开发说明

### 发版

使用 github workflow 实现自动发版，设置为在 push tag 时触发。

请勿手动 push tag，而是执行 `npm run release`。此命令会自动执行：

- 更新 package.json 中的 version
- commit changes and push
- create git tag and push - 触发 workflow
