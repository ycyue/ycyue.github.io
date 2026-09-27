---
title: 博客发布流程已打通
updated: 2026-09-27
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


## 日常写作与本地验证

这是发布链路的历史记录。当前仓库将 Markdown 源码与生成后的页面一起管理；日常编辑应修改 `source/_posts/`，生成页面交给脚本同步。

新文章至少包含以下头部（文件名和 permalink 发布后尽量保持稳定）：

```yaml
---
title: 文章标题
date: 2026-09-27 10:00:00
categories:
  - 学习笔记
tags:
  - Python
description: 用一句话说明读者会解决什么问题。
---
```

首次准备环境按仓库 README 安装依赖、固定版本主题并应用补丁。环境已就绪后：

```bash
npm run build
node tests/check-blog-output.js
python3 tests/test_article_examples.py
node tools/sync-generated.js
```

示例检查直接读取文章中的代码。检查首页、文章页、移动端表格与代码块后，再提交源文件及生成文件。构建成功只说明本地输出成功，不代表线上已更新。

## 更新后页面没有变化时

1. 查看 `Publish blog` 工作流是否由 main 分支的相关文件变更触发。
2. 区分依赖安装、Hexo 构建、内容检查和推送生成文件几个阶段，先定位失败步骤。
3. 工作流成功后，再核对 Pages 部署状态与线上文章内容；必要时刷新缓存。
4. 修改旧文时保留原始 `date`，通过 `updated` 记录维护日期，避免改变按日期生成的链接。

发布配置见仓库 `.github/workflows/publish-blog.yml`。流程调整后，应同步维护这篇说明，不能仅凭旧截图判断发布仍然正常。
