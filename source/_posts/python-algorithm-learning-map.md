---
title: Python 基础算法学习地图｜27 节图解教程
date: 2026-09-04 14:00:00
permalink: 2026/09/04/python-algorithm-learning-map/
categories:
  - 算法
tags:
  - Python
  - 算法基础
  - LeetCode
description: 面向 Python 初学者的 27 节基础算法图解教程路线：从双指针、链表和二叉树，到回溯、动态规划与单调数据结构。
---

这是一条给 **Python 刚入门、算法基础较弱、准备 LeetCode 或面试** 的学习路线。顺序参考灵茶山艾府《基础算法精讲》，但每篇教程都从问题、暴力解法和正确性推导重新组织，重点回答“为什么能这样做”。

<!-- more -->

<figure class="algorithm-figure">
  <img src="/images/algorithms/learning-map.svg" alt="Python 基础算法学习地图：数组、链表、二叉树、回溯、动态规划、树形 DP 和单调数据结构" loading="eager">
  <figcaption>27 节已经全部完成，可以按依赖关系顺序学习，也可以从当前薄弱模块开始。</figcaption>
</figure>

## 怎么使用这套教程？

1. 先看“这节解决什么问题”，自己写出暴力解法。
2. 对照图解，手动画一遍指针、队列、搜索树或 DP 表的变化。
3. 合上文章，独立写模板；不要背完整题解。
4. 完成 2 道代表题，并记录识别信号和最容易错的边界。
5. 第二天不看答案再写一次，能写出来才算掌握。

<div class="algorithm-note"><strong>完成状态：</strong>27 篇正文、54 张课程图解、代码样例与上一篇/下一篇导航均已接入博客。</div>

## Stage 1：数组与基础算法思想

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 01 | 相向双指针（一）：两数之和、三数之和 | 入门 | <span class="course-status course-status--ready">已完成</span> | 列表、排序、循环 | [开始学习](/2026/09/04/algorithm-01-two-pointers/) |
| 02 | 容器与接雨水 | 标准 | <span class="course-status course-status--ready">已完成</span> | 01、有序数组双指针 | [开始学习](/2026/09/04/algorithm-02-two-pointers-container-rainwater/) |
| 03 | 滑动窗口 | 标准 | <span class="course-status course-status--ready">已完成</span> | 双指针、字典 | [开始学习](/2026/09/04/algorithm-03-sliding-window/) |
| 04 | 二分查找 | 标准 | <span class="course-status course-status--ready">已完成</span> | 有序数组、下标 | [开始学习](/2026/09/04/algorithm-04-binary-search/) |
| 05 | 二分查找变形 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 04、lower_bound | [开始学习](/2026/09/04/algorithm-05-binary-search-advanced/) |

## Stage 2：链表

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 06 | 反转链表 | 入门 | <span class="course-status course-status--ready">已完成</span> | 节点、引用、None | [开始学习](/2026/09/04/algorithm-06-reverse-linked-list/) |
| 07 | 快慢指针 | 标准 | <span class="course-status course-status--ready">已完成</span> | 06、链表遍历 | [开始学习](/2026/09/04/algorithm-07-fast-slow-pointers/) |
| 08 | 链表删除与前后指针 | 标准 | <span class="course-status course-status--ready">已完成</span> | 06、07 | [开始学习](/2026/09/04/algorithm-08-linked-list-deletion/) |

## Stage 3：二叉树

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 09 | 二叉树递归基础 | 入门 | <span class="course-status course-status--ready">已完成</span> | 函数、递归概念 | [开始学习](/2026/09/04/algorithm-09-binary-tree-recursion/) |
| 10 | 二叉树递归进阶 | 标准 | <span class="course-status course-status--ready">已完成</span> | 09、递归返回值 | [开始学习](/2026/09/04/algorithm-10-binary-tree-recursion-advanced/) |
| 11 | 遍历与二叉搜索树 | 标准 | <span class="course-status course-status--ready">已完成</span> | 09、10 | [开始学习](/2026/09/04/algorithm-11-bst-traversal/) |
| 12 | 最近公共祖先 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 09、11、后序递归 | [开始学习](/2026/09/04/algorithm-12-lowest-common-ancestor/) |
| 13 | 二叉树 BFS | 标准 | <span class="course-status course-status--ready">已完成</span> | 09、队列 | [开始学习](/2026/09/04/algorithm-13-binary-tree-bfs/) |

## Stage 4：回溯

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 14 | 子集型回溯 | 标准 | <span class="course-status course-status--ready">已完成</span> | 递归、DFS | [开始学习](/2026/09/04/algorithm-14-backtracking-subsets/) |
| 15 | 组合型回溯 | 标准 | <span class="course-status course-status--ready">已完成</span> | 14、子集型回溯 | [开始学习](/2026/09/04/algorithm-15-backtracking-combinations/) |
| 16 | 排列型回溯 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 14、15 | [开始学习](/2026/09/04/algorithm-16-backtracking-permutations/) |

## Stage 5：动态规划

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 17 | 动态规划入门 | 标准 | <span class="course-status course-status--ready">已完成</span> | 递归、数组 | [开始学习](/2026/09/04/algorithm-17-dynamic-programming-intro/) |
| 18 | 背包 DP | 进阶 | <span class="course-status course-status--ready">已完成</span> | 17、DP 五步法 | [开始学习](/2026/09/04/algorithm-18-knapsack/) |
| 19 | 最长公共子序列 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 17、二维数组 | [开始学习](/2026/09/04/algorithm-19-longest-common-subsequence/) |
| 20 | 最长递增子序列 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 04、17 | [开始学习](/2026/09/04/algorithm-20-longest-increasing-subsequence/) |
| 21 | 状态机 DP | 进阶 | <span class="course-status course-status--ready">已完成</span> | 17、状态定义 | [开始学习](/2026/09/04/algorithm-21-state-machine-dp/) |
| 22 | 区间 DP | 进阶 | <span class="course-status course-status--ready">已完成</span> | 17、19 | [开始学习](/2026/09/04/algorithm-22-interval-dp/) |

## Stage 6：树形 DP

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 23 | 树形 DP：直径 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 09、17 | [开始学习](/2026/09/04/algorithm-23-tree-dp-diameter/) |
| 24 | 树形 DP：最大独立集 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 23、后序递归 | [开始学习](/2026/09/04/algorithm-24-tree-dp-independent-set/) |
| 25 | 树形 DP：最小支配集 | 挑战 | <span class="course-status course-status--ready">已完成</span> | 24、多状态 DP | [开始学习](/2026/09/04/algorithm-25-tree-dp-dominating-set/) |

## Stage 7：单调数据结构

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 26 | 单调栈 | 标准 | <span class="course-status course-status--ready">已完成</span> | 数组、栈、下标 | [开始学习](/2026/09/04/algorithm-26-monotonic-stack/) |
| 27 | 单调队列 | 进阶 | <span class="course-status course-status--ready">已完成</span> | 03、26、deque | [开始学习](/2026/09/04/algorithm-27-monotonic-queue/) |

## 你会逐渐建立的能力

- 用“排除哪一批候选”理解双指针和二分查找。
- 用“窗口加入、移出什么”理解连续区间问题。
- 把链表修改画成引用变化，把树题拆成子树返回值。
- 把回溯画成搜索树，把动态规划落实到状态定义、转移、初始化和顺序。
- 用“谁已经不可能成为答案”理解单调栈与单调队列。

## 主要学习参考

- [灵茶山艾府《基础算法精讲》B 站合集](https://space.bilibili.com/206214/lists/842776?type=season)
- [课程作者维护的配套题目与多语言代码汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)
- [LeetCode 中国站题库](https://leetcode.cn/problemset/)

本系列按公开课程主线组织学习顺序；正文、代码说明和 SVG 图解均重新编写与绘制，不复制视频字幕、截图或其他文章正文。
