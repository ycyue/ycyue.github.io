---
title: 博客发布流程已打通
date: 2026-08-29 18:00:00
categories:
  - 博客
tags:
  - GitHub Pages
  - Hexo
desc: 从 Markdown 文章到 GitHub Pages 公网展示的自动发布流程已经完成。
---

这是一篇用于验证完整发布链路的文章。

现在只要在 `source/_posts/` 中新增或修改 Markdown 文件并推送到 GitHub，系统就会自动生成网页并更新博客。无需手工编辑 HTML。

完整流程是：

1. 使用 Markdown 编写文章；
2. 提交到 GitHub 仓库；
3. GitHub Actions 自动运行 Hexo；
4. 生成后的页面更新到 GitHub Pages；
5. 任何人都可以通过公开链接阅读。
