---
title: Python 基础算法学习地图｜27 节图解教程
date: 2026-09-04 09:20:00
permalink: 2026/09/04/python-algorithm-learning-map/
categories:
  - 算法
tags:
  - Python
  - 算法基础
  - LeetCode
description: 面向 Python 初学者的 27 节基础算法图解教程路线：从双指针、链表和二叉树，到回溯、动态规划与单调数据结构。
---

这是一条给 **Python 刚入门、算法基础较弱、准备 LeetCode 或面试** 的学习路线。顺序参考灵茶山艾府《基础算法精讲》，但每篇教程都会从问题、暴力解法和正确性推导重新组织，重点回答“为什么能这样做”。

<!-- more -->

<figure class="algorithm-figure">
  <img src="/images/algorithms/learning-map.svg" alt="Python 基础算法学习地图：数组、链表、二叉树、回溯、动态规划、树形 DP 和单调数据结构" loading="eager">
  <figcaption>主线按依赖关系推进。单调栈只依赖数组基础，可在动态规划前后灵活学习。</figcaption>
</figure>

## 怎么使用这套教程？

每一节建议按同一个节奏学习：

1. 先看“这节解决什么问题”，自己写出暴力解法。
2. 对照图解，手动画一遍指针、队列、搜索树或 DP 表的变化。
3. 合上文章，独立写模板；不要背完整题解。
4. 完成 2 道代表题，并用一句话记录识别信号和最容易错的边界。
5. 第二天不看答案再写一次，能写出来才算掌握。

<div class="algorithm-note"><strong>进度说明：</strong>系列采用分批制作。已完成的课程提供文章链接；未完成课程显示“制作中”，避免放出空页面或 404。</div>

## Stage 1：数组与基础算法思想

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 01 | 相向双指针（一）：两数之和、三数之和 | 入门 | <span class="course-status course-status--ready">已完成</span> | 列表、排序、循环 | [开始学习](/2026/09/04/algorithm-01-two-pointers/) |
| 02 | 相向双指针（二）：容器与接雨水 | 标准 | <span class="course-status">制作中</span> | 01 | — |
| 03 | 滑动窗口 | 标准 | <span class="course-status">制作中</span> | 双指针、字典 | — |
| 04 | 二分查找：红蓝染色与边界 | 标准 | <span class="course-status">制作中</span> | 有序数组 | — |
| 05 | 二分查找变形 | 进阶 | <span class="course-status">制作中</span> | 04 | — |

## Stage 2：链表

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 06 | 反转链表 | 入门 | <span class="course-status">制作中</span> | 节点与引用 | — |
| 07 | 快慢指针 | 标准 | <span class="course-status">制作中</span> | 06 | — |
| 08 | 删除系列与前后指针 | 标准 | <span class="course-status">制作中</span> | 06、07 | — |

## Stage 3：二叉树

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 09 | 二叉树与递归：深入理解 | 入门 | <span class="course-status">制作中</span> | 函数、递归概念 | — |
| 10 | 二叉树与递归：灵活运用 | 标准 | <span class="course-status">制作中</span> | 09 | — |
| 11 | 前序/中序/后序与二叉搜索树 | 标准 | <span class="course-status">制作中</span> | 09、10 | — |
| 12 | 最近公共祖先 | 进阶 | <span class="course-status">制作中</span> | 后序递归 | — |
| 13 | BFS / 层序遍历 | 标准 | <span class="course-status">制作中</span> | 队列 | — |

## Stage 4：回溯

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 14 | 子集型回溯 | 标准 | <span class="course-status">制作中</span> | 递归、DFS | — |
| 15 | 组合型回溯与剪枝 | 标准 | <span class="course-status">制作中</span> | 14 | — |
| 16 | 排列型回溯与 N 皇后 | 进阶 | <span class="course-status">制作中</span> | 14、15 | — |

## Stage 5：动态规划

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 17 | 从记忆化搜索到递推 | 标准 | <span class="course-status">制作中</span> | 递归、数组 | — |
| 18 | 0-1 / 完全背包，至多/恰好/至少 | 进阶 | <span class="course-status">制作中</span> | 17 | — |
| 19 | 最长公共子序列 LCS | 进阶 | <span class="course-status">制作中</span> | 17 | — |
| 20 | 最长递增子序列 LIS | 进阶 | <span class="course-status">制作中</span> | 04、17 | — |
| 21 | 状态机 DP：股票系列 | 进阶 | <span class="course-status">制作中</span> | 17 | — |
| 22 | 区间 DP | 进阶 | <span class="course-status">制作中</span> | 17、19 | — |

## Stage 6：树形 DP

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 23 | 直径系列 | 进阶 | <span class="course-status">制作中</span> | 09、17 | — |
| 24 | 最大独立集 | 进阶 | <span class="course-status">制作中</span> | 23 | — |
| 25 | 最小支配集 | 挑战 | <span class="course-status">制作中</span> | 24 | — |

## Stage 7：单调数据结构

| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |
|---:|---|---|---|---|---|
| 26 | 单调栈 | 标准 | <span class="course-status">制作中</span> | 数组、栈 | — |
| 27 | 单调队列 | 进阶 | <span class="course-status">制作中</span> | 03、26、deque | — |

## 你会逐渐建立的能力

- 看到“有序 + 两端”时，想到用单调性排除候选。
- 看到“连续区间 + 最长/最短”时，检查滑动窗口是否适用。
- 看到“有序/单调答案”时，设计二分的判定条件。
- 把链表修改画成指针变化，而不是靠脑内模拟。
- 把树的问题拆成“子树返回什么、当前节点合并什么”。
- 把回溯画成搜索树，把 DP 写成状态表。
- 用“不可能再成为答案”理解单调栈与单调队列。

## 主要学习参考

- [灵茶山艾府《基础算法精讲》B 站合集](https://space.bilibili.com/206214/lists/842776?type=season)
- [课程作者维护的配套题目与多语言代码汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)
- [LeetCode 中国站题库](https://leetcode.cn/problemset/)

本系列按公开课程主线组织学习顺序；正文、代码说明和 SVG 图解均重新编写与绘制，不复制视频字幕、截图或其他文章正文。
