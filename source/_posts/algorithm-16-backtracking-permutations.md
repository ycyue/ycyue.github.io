---
title: 算法基础 16｜排列型回溯：每个位置放谁
date: 2026-09-04 12:00:00
permalink: 2026/09/04/algorithm-16-backtracking-permutations/
categories:
  - 算法
tags:
  - Python
  - 回溯
  - LeetCode
  - 算法基础
description: 用搜索树图解排列型回溯、used 数组和 N 皇后中的列与对角线约束。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-15-backtracking-combinations/">← 15 组合型回溯</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-17-dynamic-programming-intro/">17 动态规划入门 →</a>
</nav>

组合中 `[1,2]` 与 `[2,1]` 相同，排列中却是两个答案。因此状态不再是“从哪里继续选”，而是“哪些元素已被当前路径使用”。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：互不相同的数组 nums。
- **输出**：所有排列。
- **直接想法**：枚举长度 n 的 n 进制序列，再过滤重复使用元素的序列。
- **真正瓶颈**：会检查 nⁿ 个序列，而合法排列只有 n! 个；大量路径在很早就已重复使用元素。

## 2. 从暴力解法开始

```python
from itertools import product

def permute_filter(nums):
    answer = []
    for candidate in product(nums, repeat=len(nums)):
        if len(set(candidate)) == len(nums):
            answer.append(list(candidate))
    return answer
```

这种写法产生 nⁿ 个候选后再筛选。回溯在选择时就禁止已使用元素，只进入可能成为排列的分支。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>第 depth 层决定排列的第 depth 个位置；尝试每个尚未使用的元素，递归后恢复 used。</strong></div>

`used[i]` 表示 nums[i] 是否已在当前 path 中。它和 path 一起构成完整状态：path 决定已放内容，used 决定剩余候选。

<figure class="algorithm-figure">
  <img src="/images/algorithms/16-backtracking-permutations/process.svg" alt="排列型回溯执行过程图" loading="lazy">
  <figcaption>排列搜索树的同一层是在竞争同一个位置，而不是从某个起点继续向后。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么覆盖所有排列

任意排列的第 0、1、…个位置都给出一条唯一选择路径。每层会尝试所有尚未使用元素，所以这条路径一定存在。

### 2. 为什么没有非法答案

只有 path 长度为 n 才记录，而 used 保证 n 次选择对应 n 个不同下标，因此每个原元素恰好出现一次。

### 3. N 皇后如何类比

第 row 层决定这一行把皇后放在哪一列。列集合、防斜线集合与反斜线集合相当于更复杂的 used，负责排除会冲突的候选。

<figure class="algorithm-figure">
  <img src="/images/algorithms/16-backtracking-permutations/proof.svg" alt="排列型回溯正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def permute(nums):
    answer = []
    path = []
    used = [False] * len(nums)

    def dfs():
        if len(path) == len(nums):
            answer.append(path.copy())
            return

        for i, value in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(value)
            dfs()
            path.pop()
            used[i] = False

    dfs()
    return answer
```

有重复值时不能只用值集合，因为相同值来自不同下标；通常先排序，再用“同层跳过重复值”的规则去重。

## 6. 手工模拟一次

输入：`nums=[1,2,3]`

| 层 | path | used | 下一候选 |
|---|---|---|---|
| 0 | [] | FFF | 1、2、3 |
| 1 | [1] | TFF | 2、3 |
| 2 | [1,2] | TTF | 3 |
| 3 | [1,2,3] | TTT | 记录 |
| 回溯 | [1] | TFF | 继续尝试 3 |

回溯同时恢复 path 和 used，才能正确进入 `[1,3,2]` 分支。

## 7. 复杂度分析

- **时间复杂度：O(n·n!)**。共有 n! 个排列，每个答案复制 n 个元素。
- **空间复杂度：O(n)**。path、used 和递归深度都为 n。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>安排顺序/位置 + 每个候选使用一次 → used 状态的排列回溯</strong></div>

- 所有排列、座位安排、顺序方案。
- 第几层对应第几个位置。
- 候选存在列、对角线或其他冲突约束。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：只恢复 path

```python
path.pop()
```

还必须把对应 `used[i]` 恢复为 False。

### 坑 2：用 start 参数

```python
dfs(i + 1)
```

这会强制递增顺序，生成的是组合而非排列。

### 坑 3：重复值直接套模板

输入有重复值时需要排序和同层去重。

## 10. Python 补充

### `[False] * n`

布尔值不可变，因此这样创建 used 列表安全。若元素是可变列表，`[[]] * n` 会让所有位置引用同一个对象，应避免。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [46. 全排列](https://leetcode.cn/problems/permutations/)（中等）  
  used 数组。

### 标准

- [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/)（中等）  
  排序后同层跳过相同值。
- [51. N 皇后](https://leetcode.cn/problems/n-queens/)（困难）  
  每层放一行，维护列和两条对角线。

### 进阶

- [52. N 皇后 II](https://leetcode.cn/problems/n-queens-ii/)（困难）  
  不保存棋盘，只统计叶子数。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def permute(nums):
    answer = []
    path = []
    used = [False] * len(nums)

    def dfs():
        if len(path) == len(nums):
            answer.append(path.copy())
            return

        for i, value in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(value)
            dfs()
            path.pop()
            used[i] = False

    dfs()
    return answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能区分组合的 start 与排列的 used。
- [ ] 能完整恢复两个状态。
- [ ] 能证明每个排列唯一。
- [ ] 能把 N 皇后映射为逐行决策。
- [ ] 完成 46 和 51。

## 下一节

下一阶段进入动态规划：先从暴力递归的重复子问题出发，把搜索结果缓存，再翻译成递推表。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-15-backtracking-combinations/">← 15 组合型回溯</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-17-dynamic-programming-intro/">17 动态规划入门 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 16》](https://www.bilibili.com/video/BV1mY411D7f6/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
