# 基础算法精讲 · Python 图解教程：制作状态

> 用途：记录研究结论、文章生产状态与后续工作入口。最后更新：2026-09-04（Asia/Shanghai）。

## 已确认的博客架构

- 技术栈：Hexo 7.3.0 + Typography 主题。
- 内容源：`source/_posts/*.md`；根目录的日期页面、分类页、标签页和 `index.html` 均是构建产物。
- 构建：`npm run build`，由 `.github/workflows/publish-blog.yml` 在 `main` 推送后自动生成并提交到仓库根目录。
- Markdown：`hexo-renderer-marked`；当前没有 Mermaid 渲染器。本系列使用自制 SVG，避免线上出现未渲染的 Mermaid 代码块。
- URL：`:year/:month/:day/:title/`。
- 展示能力：Prism 代码高亮、深浅色切换、阅读进度、文章目录、代码复制；系列额外样式位于 `source/css/algorithm-series.css`。

## 课程核实结果

主资料采用课程作者维护的公开资料：

- [B 站《基础算法精讲》合集](https://space.bilibili.com/206214/lists/842776?type=season)
- [灵茶山艾府维护的课程题目汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)

经典主线共 27 节。下表中的标题、视频链接和代表题以作者题目汇总为准；“教程重点、前置、依赖”是本系列面向 Python 初学者重新设计的教学结构。

| # | 原课程标题 / 视频 | 教程重点 | 数据结构 | 代表题 | 前置知识 | 直接依赖 |
|---:|---|---|---|---|---|---|
| 01 | [相向双指针（一）](https://www.bilibili.com/video/BV1bP411c7oJ/) | 有序数组两数和、三数和、排除搜索空间 | 数组 | 167、15、2824 | 列表、排序、循环 | 无 |
| 02 | [相向双指针（二）](https://www.bilibili.com/video/BV1Qg411q7ia/) | 短板决策、前后缀与接雨水 | 数组 | 11、42、125 | 01、最大/最小值 | 01 |
| 03 | [滑动窗口](https://www.bilibili.com/video/BV1hd4y1r7Gq/) | 不定长窗口、最长/最短/计数 | 数组、字符串、哈希表 | 209、3、713 | 双指针、字典 | 01 |
| 04 | [二分查找](https://www.bilibili.com/video/BV1AP41137w7/) | 红蓝染色、区间不变量、边界 | 有序数组 | 34、2529、875 | 有序性、整除 | 01 |
| 05 | [二分查找 - 变形](https://www.bilibili.com/video/BV1QK411d76w/) | 峰值、旋转数组、条件设计 | 数组 | 162、153、33 | 二分边界 | 04 |
| 06 | [链表 - 反转系列](https://www.bilibili.com/video/BV1sd4y1x7KN/) | 三指针反转、局部反转、分组反转 | 单链表 | 206、92、25 | 节点引用、`None` | 无 |
| 07 | [链表 - 快慢指针](https://www.bilibili.com/video/BV1KG4y1G7cu/) | 中点、判环、找环入口 | 单链表 | 876、141、142、143 | 链表遍历 | 06 |
| 08 | [链表 - 删除系列](https://www.bilibili.com/video/BV1VP4y1Q71e/) | 哨兵节点、前后指针、去重 | 单链表 | 237、19、83、82 | 链表修改 | 06、07 |
| 09 | [二叉树与递归 - 深入理解](https://www.bilibili.com/video/BV1UD4y1Y769/) | 自顶向下/自底向上递归 | 二叉树、调用栈 | 104、111、112 | 函数、递归概念 | 无 |
| 10 | [二叉树与递归 - 灵活运用](https://www.bilibili.com/video/BV18M411z7bb/) | 多树比较、提前失败、递归返回信息 | 二叉树 | 100、101、110、199 | 递归返回值 | 09 |
| 11 | [二叉树与递归 - 前序/中序/后序](https://www.bilibili.com/video/BV14G411P7C1/) | 遍历时机、BST 边界与中序有序性 | 二叉搜索树 | 98、938、230 | 三种 DFS | 09、10 |
| 12 | [二叉树与递归 - 最近公共祖先](https://www.bilibili.com/video/BV1W44y1Z7AR/) | 分类讨论、由子树向上汇报 | 二叉树、BST | 236、235、1123 | 后序递归 | 09、11 |
| 13 | [二叉树 - BFS](https://www.bilibili.com/video/BV1hG4y1277i/) | 层序遍历、队列分层 | 二叉树、队列 | 102、103、513 | 树节点、队列 | 09 |
| 14 | [回溯 - 子集型](https://www.bilibili.com/video/BV1mG4y1A7Gu/) | 选/不选、枚举所有子集 | 列表、搜索树 | 17、78、131 | 递归、DFS | 09 |
| 15 | [回溯 - 组合型与剪枝](https://www.bilibili.com/video/BV1xG4y1F7nC/) | 从哪里选、剩余数量剪枝 | 列表、搜索树 | 77、216、22 | 子集型回溯 | 14 |
| 16 | [回溯 - 排列型](https://www.bilibili.com/video/BV1mY411D7f6/) | `used` 集合、位置决策、N 皇后 | 列表、集合、棋盘 | 46、51、52 | 回溯、集合 | 14、15 |
| 17 | [动态规划 - 从记忆化搜索到递推](https://www.bilibili.com/video/BV1Xj411K7oF/) | 状态定义、转移、初始值、顺序 | 数组、缓存 | 198、70、746 | 递归、数组 | 09 |
| 18 | [0-1 背包 完全背包 至多/恰好/至少](https://www.bilibili.com/video/BV16Y411v7Y6/) | 选或不选、容量语义、遍历方向 | 一维/二维 DP 表 | 494、322、416、518 | DP 五步法 | 17 |
| 19 | [最长公共子序列 LCS](https://www.bilibili.com/video/BV1TM4y1o7ug/) | 双序列状态、匹配/跳过 | 二维 DP 表、字符串 | 1143、72 | DP、字符串下标 | 17 |
| 20 | [最长递增子序列 LIS](https://www.bilibili.com/video/BV1ub411Q7sB/) | 选哪个结尾、贪心二分优化 | 数组、DP 表 | 300、1671、354 | DP、二分 | 04、17 |
| 21 | [状态机 DP - 买卖股票系列](https://www.bilibili.com/video/BV1ho4y1W7QK/) | 持有/未持有状态、交易次数 | 状态表 | 122、309、188 | DP 状态定义 | 17 |
| 22 | [区间 DP](https://www.bilibili.com/video/BV1Gs4y1E7EU/) | 区间长度、两端决策、枚举分割点 | 二维 DP 表 | 516、1039、1547 | DP、二维数组 | 17、19 |
| 23 | [树形 DP - 直径系列](https://www.bilibili.com/video/BV17o4y187h1/) | 向上返回链、节点处合并两条链 | 树、递归栈 | 543、124、2246 | 后序递归、DP | 09、17 |
| 24 | [树形 DP - 最大独立集](https://www.bilibili.com/video/BV1vu4y1f7dn/) | 选/不选节点的两个状态 | 树、状态对 | 337、2646 | 树形 DP | 23 |
| 25 | [树形 DP - 最小支配集](https://www.bilibili.com/video/BV1oF411U7qL/) | 三状态覆盖、父子约束 | 树、三状态 DP | 968 | 最大独立集模型 | 24 |
| 26 | [单调栈](https://www.bilibili.com/video/BV1VN411J7S7/) | 下一个更大元素、及时淘汰无用候选 | 栈、数组 | 739、42、84 | 栈、下标 | 01 |
| 27 | [单调队列](https://www.bilibili.com/video/BV1bM411X72E/) | 滑窗最大值、过期与支配关系 | 双端队列、数组 | 239、862、1696 | 队列、滑动窗口 | 03、26 |

## 生产进度

状态约定：`研究` → `正文` → `图解` → `代码测试` → `博客集成` → `线上验证`。

| # | Topic | Article | Diagrams | Code Tested | Blog Integrated | Published |
|---:|---|---|---:|---|---|---|
| Map | Python 基础算法学习地图 | Pilot 版 | 1 | N/A | 已完成 | 已上线验证 |
| 01 | 相向双指针（一） | 已完成 | 2 | 已通过 | 已完成 | 已上线验证 |
| 02–05 | 数组与基础算法思想 | 待制作 | 0 | 否 | 否 | 否 |
| 06–08 | 链表 | 待制作 | 0 | 否 | 否 | 否 |
| 09–13 | 二叉树 | 待制作 | 0 | 否 | 否 | 否 |
| 14–16 | 回溯 | 待制作 | 0 | 否 | 否 | 否 |
| 17–22 | 动态规划 | 待制作 | 0 | 否 | 否 | 否 |
| 23–25 | 树形 DP | 待制作 | 0 | 否 | 否 | 否 |
| 26–27 | 单调数据结构 | 待制作 | 0 | 否 | 否 | 否 |

## 下一步

1. 以 Pilot 为模板制作 Batch 1 的 02–05；完成后再次执行代码、构建和链接检查。

## 已发现问题与处理

- Mermaid 未接入：采用本地原创 SVG；不引入外部图片依赖。
- 根目录同时保存构建产物和源码：只编辑 `source/**`、构建脚本与项目状态文件，生成产物交给既有工作流更新。
- 系列尚未完成时不能制造 26 个空链接：学习地图中未完成课程先显示“制作中”，只有页面完成后才添加文章链接。
- Pilot 已通过 Hexo 构建、内部链接、Python 样例、SVG XML、桌面宽度、深色模式、代码横向滚动、学习地图 27 行和阅读进度检查；响应式样式覆盖 640px 以下布局，360px 云端浏览器无法直接切换视口，后续批次发布前继续补充真机或可调视口检查。
- Pilot 已于 2026-09-04（Asia/Shanghai）发布；GitHub Actions 的博客构建与 Pages 部署均成功，总目录、01 教程、系列 CSS 和 3 个 SVG 线上请求均返回 HTTP 200。
