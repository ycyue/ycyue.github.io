---
title: 算法基础 14｜子集型回溯：每个元素选还是不选
date: 2026-09-04 11:40:00
permalink: 2026/09/04/algorithm-14-backtracking-subsets/
categories:
  - 算法
tags:
  - Python
  - 回溯
  - LeetCode
  - 算法基础
description: 用搜索树图解子集型回溯的选择、递归和撤销，解释为什么能且只枚举每个子集一次。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-13-binary-tree-bfs/">← 13 二叉树 BFS</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-15-backtracking-combinations/">15 组合型回溯 →</a>
</nav>

数组 `[1,2,3]` 有 8 个子集。回溯不是神秘模板：它只是沿搜索树走一条决策路径，到叶子记录答案，再退回上一个分叉点尝试另一条路。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：互不相同的数组 nums。
- **输出**：所有可能子集。
- **直接想法**：从 0 到 2ⁿ-1 枚举二进制掩码，用每一位表示选或不选。
- **真正瓶颈**：位运算能做，但不容易直接推广到分割字符串、组合约束和剪枝；回溯更清楚表达决策树。

## 2. 从暴力解法开始

```python
def subsets_bits(nums):
    answer = []
    for mask in range(1 << len(nums)):
        subset = []
        for i, value in enumerate(nums):
            if mask & (1 << i):
                subset.append(value)
        answer.append(subset)
    return answer
```

共有 2ⁿ 个掩码，每个检查 n 位，时间 O(n·2ⁿ)。回溯也必须输出这么多内容，但更便于加入题目约束。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>在第 i 个元素处分成两条路：不选它，或选它；递归回来后撤销选择，恢复进入分支前的 path。</strong></div>

`path` 表示根到当前节点已选择的元素。它是同一个列表对象，所有递归层共享，因此进入“选”分支前 append，返回后必须 pop。到 `i==n` 时，一条完整决策路径形成一个子集。

<figure class="algorithm-figure">
  <img src="/images/algorithms/14-backtracking-subsets/process.svg" alt="子集型回溯执行过程图" loading="lazy">
  <figcaption>“选择 → 递归 → 撤销”让同一个 path 安全地服务所有分支。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么不会漏

任意一个子集都能写成长度 n 的选/不选序列。DFS 在每一层同时探索两种决定，所以该序列对应的根到叶路径一定被访问。

### 2. 为什么不会重复

不同子集至少在某个元素是否选择上不同，因此对应不同决策序列、不同叶子。每个叶子只访问一次。

### 3. 为什么记录时要复制

`answer.append(path)` 保存的是列表引用。后续 pop 会修改同一个对象，导致所有答案一起变化。`path.copy()` 创建当前快照。

<figure class="algorithm-figure">
  <img src="/images/algorithms/14-backtracking-subsets/proof.svg" alt="子集型回溯正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def subsets(nums):
    answer = []
    path = []

    def dfs(i):
        if i == len(nums):
            answer.append(path.copy())
            return

        dfs(i + 1)  # 不选 nums[i]

        path.append(nums[i])
        dfs(i + 1)  # 选择 nums[i]
        path.pop()

    dfs(0)
    return answer
```

另一种写法在每个节点都记录 path，并用循环枚举下一个选择。两种模型都正确；“选/不选”更适合建立最初的搜索树直觉。

## 6. 手工模拟一次

输入：`nums = [1,2]`

| 路径 | i | 决定 | 记录 |
|---|---|---|---|
| [] | 0 | 不选 1 | — |
| [] | 1 | 不选 2 | [] |
| [2] | 2 | 选 2 | [2] |
| [1] | 1 | 选 1 后不选 2 | [1] |
| [1,2] | 2 | 再选 2 | [1,2] |

四条叶路径对应四个子集，恰好 2² 个。

## 7. 复杂度分析

- **时间复杂度：O(n·2ⁿ)**。有 2ⁿ 个答案，每次复制 path 最多 O(n)。
- **空间复杂度：O(n)**。不计算输出，递归深度和 path 最多为 n。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>枚举所有方案 + 每个元素有若干选择 + 需要恢复路径 → 回溯</strong></div>

- 所有子集、所有分割或所有选择方案。
- 答案是一组路径而非单个最优值。
- 当前选择影响后续可选范围。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：忘记撤销

```python
path.append(nums[i])
dfs(i + 1)
```

选分支结束后必须 pop，否则污染兄弟分支。

### 坑 2：保存 path 引用

```python
answer.append(path)
```

保存快照 `path.copy()`。

### 坑 3：基本情况继续执行

记录叶子后立即 return，避免访问越界。

## 10. Python 补充

### `list.copy()` 创建浅拷贝

路径中存整数时浅拷贝已足够。它复制列表容器，但不会递归复制其中对象；本系列路径通常保存不可变值或节点引用。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [78. 子集](https://leetcode.cn/problems/subsets/)（中等）  
  画选/不选搜索树。

### 标准

- [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)（中等）  
  每层选择当前数字对应的一个字母。
- [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)（中等）  
  每层枚举下一段终点，只进入回文段。

### 进阶

- [90. 子集 II](https://leetcode.cn/problems/subsets-ii/)（中等）  
  排序后同层跳过重复值。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def subsets(nums):
    answer = []
    path = []

    def dfs(i):
        if i == len(nums):
            answer.append(path.copy())
            return

        dfs(i + 1)  # 不选 nums[i]

        path.append(nums[i])
        dfs(i + 1)  # 选择 nums[i]
        path.pop()

    dfs(0)
    return answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能画出两层选/不选树。
- [ ] 能说明 path 的准确含义。
- [ ] 能解释 copy 与 pop。
- [ ] 能证明覆盖且不重复。
- [ ] 完成 78 和 17。

## 下一节

下一节要求恰好选择 k 个数，并利用“剩余元素不够”提前剪掉整棵无解子树。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-13-binary-tree-bfs/">← 13 二叉树 BFS</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-15-backtracking-combinations/">15 组合型回溯 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 14》](https://www.bilibili.com/video/BV1mG4y1A7Gu/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
