# create-lily-cli

vue2 项目脚手架 (pnpm + vite + vue2 + eslint)。
自动生成名为 lily-tempmlate-project 的项目（自动创建项目文件、安装依赖、初始化 git 并 commit）

相关文章： [《从零开始的＜ vue2 项目脚手架＞搭建：vite+vue2+eslint》](https://liuzx-emily.github.io/blog/#/post/1ac6fb5e-1737-44a7-881e-31a35ba69e33)

## Usage

```bash
npm init lily-cli
```

## 开发说明

### 发版

使用 github workflow 实现自动发版，设置为在 push tag 时触发。

请勿手动 push tag，而是执行 `npm run release`。此命令会自动执行：

- 更新 package.json 中的 version
- commit changes and push
- create git tag and push - 触发 workflow
