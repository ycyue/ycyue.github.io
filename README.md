# 潜的笔记

这是 `https://ycyue.github.io` 的 Hexo 源码与 GitHub Pages 自动发布仓库。

## 发布一篇文章

1. 在 `source/_posts/` 新建一个 `.md` 文件，例如 `my-first-post.md`。
2. 文件顶部填写：

   ```yaml
   ---
   title: 文章标题
   date: 2026-08-29 18:00:00
   categories:
     - AI学习
   tags:
     - Python
   desc: 一句话摘要
   ---
   ```

3. 在分隔线后用 Markdown 编写正文。
4. 将修改提交到 GitHub 的 `main` 分支。
5. GitHub Actions 会自动生成页面并更新 GitHub Pages。

## 本地预览

需要 Node.js 20 和 Git：

```bash
npm ci
git clone https://github.com/SumiMakito/hexo-theme-typography.git themes/typography
git -C themes/typography checkout ddbe45aabe5ee3d431426cbd6c2f62ae448fc6d1
node scripts/patch-typography-theme.js
npm run preview
```

浏览器打开 `http://localhost:4000`。

## 常用命令

```bash
npm run build    # 生成静态页面
npm run preview  # 本地预览
```

## 界面重构

- `scripts/notebook-layout.js`：构建时添加首页学习地图、跳至正文入口和页面语义，移除旧侧栏定位脚本。
- `source/css/notebook-layout.css`：顶部导航、文章列表、正文与目录布局、浅色 / 深色和移动端样式。
- 文章 Markdown、永久链接、RSS、分类和标签沿用原有结构。
- `npm run build` 后可运行 `node tests/check-blog-output.js` 检查站内引用；使用 `node tools/sync-generated.js` 同步 GitHub Pages 根目录产物。

本次改动尚未推送到远程仓库。
