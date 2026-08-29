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
npm install
git clone https://github.com/SumiMakito/hexo-theme-typography.git themes/typography
git -C themes/typography checkout ddbe45aabe5ee3d431426cbd6c2f62ae448fc6d1
npm run preview
```

浏览器打开 `http://localhost:4000`。

## 常用命令

```bash
npm run build    # 生成静态页面
npm run preview  # 本地预览
```
