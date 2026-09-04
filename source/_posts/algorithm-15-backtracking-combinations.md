---
title: 算法基础 15｜组合型回溯：从哪里选与剪枝
date: 2026-09-04 11:50:00
permalink: 2026/09/04/algorithm-15-backtracking-combinations/
categories:
  - 算法
tags:
  - Python
  - 回溯
  - LeetCode
  - 算法基础
description: 图解组合回溯的起点参数和剩余数量剪枝，推导为什么循环上界不会漏解。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-14-backtracking-subsets/">← 14 子集型回溯</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-16-backtracking-permutations/">16 排列型回溯 →</a>
</nav>

从 1 到 n 中选 k 个数，顺序不重要。若每层都从 1 重新选，会得到 `[1,2]` 与 `[2,1]` 这类重复排列。组合回溯用 start 保证只向后选。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：整数 n 和 k。
- **输出**：从 1..n 中选择 k 个数的所有组合。
- **直接想法**：枚举所有 2ⁿ 个子集，再筛出长度为 k 的。
- **真正瓶颈**：大量子集长度不可能为 k；组合搜索可以只走长度至多 k 的路径，并提前剪掉剩余数量不足的分支。

## 2. 从暴力解法开始

```python
def combine_filter(n, k):
    all_sets = [[]]
    for value in range(1, n + 1):
        all_sets += [subset + [value] for subset in all_sets]
    return [subset for subset in all_sets if len(subset) == k]
```

生成全部 2ⁿ 个子集后再筛选，浪费明显。直接搜索组合只生成 C(n,k) 个答案及其前缀。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>start 表示下一次只能从哪里开始；还需选择 need 个数时，循环上界只到 n-need+1。</strong></div>

path 严格递增，因此每个集合只按唯一顺序出现。若当前选 value 后，右侧连 need-1 个数都凑不齐，这个 value 以及更大的起点都无需尝试。

<figure class="algorithm-figure">
  <img src="/images/algorithms/15-backtracking-combinations/process.svg" alt="组合型回溯执行过程图" loading="lazy">
  <figcaption>组合只关心选了哪些数，不关心顺序；递增路径正好消除重复排列。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么 start 能去重

任意组合都有唯一的递增排列。规定每次只能选比上次更大的数，就只生成这一个排列，不会生成顺序不同的重复答案。

### 2. 剪枝上界怎样推导

当前还要选 `need` 个数。若第一个选择是 value，那么从 value 到 n 至少要有 need 个数，即 `n-value+1 >= need`，整理得 `value <= n-need+1`。

### 3. 为什么剪枝不会漏

所有超过上界的 value 可用元素只会更少，不可能完成长度 k。因此被剪掉的整段都没有合法叶子。

<figure class="algorithm-figure">
  <img src="/images/algorithms/15-backtracking-combinations/proof.svg" alt="组合型回溯正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def combine(n, k):
    answer = []
    path = []

    def dfs(start):
        if len(path) == k:
            answer.append(path.copy())
            return

        need = k - len(path)
        max_first = n - need + 1
        for value in range(start, max_first + 1):
            path.append(value)
            dfs(value + 1)
            path.pop()

    dfs(1)
    return answer
```

Python `range` 右端不包含，因此要写 `max_first + 1`。先推数学上界，再转换成 range，能减少加一减一错误。

## 6. 手工模拟一次

输入：`n=4, k=2`

| path | start | need | 可选 value |
|---|---|---|---|
| [] | 1 | 2 | 1..3 |
| [1] | 2 | 1 | 2..4 |
| [2] | 3 | 1 | 3..4 |
| [3] | 4 | 1 | 4 |

根节点不会从 4 开始，因为 4 右侧已没有第二个数；这是安全剪枝。

## 7. 复杂度分析

- **时间复杂度：O(k·C(n,k))**。输出 C(n,k) 个组合，每个复制 k 个元素；搜索前缀开销不改变输出主量级。
- **空间复杂度：O(k)**。不计答案，path 与递归深度最多 k。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>从候选中选固定数量 + 顺序不重要 → start 递增 + 剩余数量剪枝</strong></div>

- 组合、选 k 个、总和达到目标。
- 同一批元素不同顺序视为相同。
- 存在明确的剩余数量或剩余和下界。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：每层从 1 开始

```python
for value in range(1, n + 1):
```

会生成排列和重复使用；从 start 开始。

### 坑 2：剪枝少加 1

```python
max_first = n - need
```

正确数学上界是 `n-need+1`。

### 坑 3：找到 k 个后不返回

记录后 return，否则还会生成超长路径。

## 10. Python 补充

### `range(start, stop)` 不包含 stop

若数学上允许取到 `max_first`，代码要写 `range(start, max_first + 1)`。建议先写出闭区间再翻译。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [77. 组合](https://leetcode.cn/problems/combinations/)（中等）  
  start + 数量剪枝。

### 标准

- [216. 组合总和 III](https://leetcode.cn/problems/combination-sum-iii/)（中等）  
  同时维护剩余数量与剩余和。
- [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)（中等）  
  剩余右括号不能少于左括号。

### 进阶

- [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)（中等）  
  排序、同层去重、每个元素只能用一次。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def combine(n, k):
    answer = []
    path = []

    def dfs(start):
        if len(path) == k:
            answer.append(path.copy())
            return

        need = k - len(path)
        max_first = n - need + 1
        for value in range(start, max_first + 1):
            path.append(value)
            dfs(value + 1)
            path.pop()

    dfs(1)
    return answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释组合与排列的区别。
- [ ] 能推导 n-need+1。
- [ ] 能写 start 参数。
- [ ] 能识别数量与和的剪枝。
- [ ] 完成 77 和 216。

## 下一节

下一节顺序变得重要。每一层决定“当前位置放谁”，需要 used 状态防止重复使用。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-14-backtracking-subsets/">← 14 子集型回溯</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-16-backtracking-permutations/">16 排列型回溯 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 15》](https://www.bilibili.com/video/BV1xG4y1F7nC/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
