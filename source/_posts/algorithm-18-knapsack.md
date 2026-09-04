---
title: 算法基础 18｜0-1 背包与完全背包：遍历方向为什么相反
date: 2026-09-04 12:20:00
permalink: 2026/09/04/algorithm-18-knapsack/
categories:
  - 算法
tags:
  - Python
  - 动态规划
  - LeetCode
  - 算法基础
description: 图解 0-1 与完全背包的一维表，推导容量遍历方向及至多、恰好、至少的初始化。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-17-dynamic-programming-intro/">← 17 动态规划入门</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-19-longest-common-subsequence/">19 最长公共子序列 →</a>
</nav>

背包题的表面可能是分割数组、凑零钱或目标和，核心都在问：处理到某件物品、容量为 c 时，选或不选如何影响答案？

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：物品重量/价值与容量；每件可用一次或无限次。
- **输出**：最大价值、恰好装满的方案数或最少物品数。
- **直接想法**：枚举每件物品选不选；完全背包还要枚举选几个。
- **真正瓶颈**：选择组合指数增长，而状态只由处理到哪件物品和当前容量决定。

## 2. 从暴力解法开始

```python
def zero_one_brute(weights, values, capacity):
    def dfs(i, remain):
        if i == len(weights):
            return 0
        best = dfs(i + 1, remain)
        if weights[i] <= remain:
            best = max(best, values[i] + dfs(i + 1, remain - weights[i]))
        return best
    return dfs(0, capacity)
```

0-1 背包有 2ⁿ 个选择序列。二维 DP 只有 n·capacity 个状态；一维压缩后，遍历方向负责保留“上一行”或允许使用“当前行”。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>0-1 背包容量倒序，防止本轮物品重复使用；完全背包容量正序，主动允许读取本轮刚更新的状态。</strong></div>

更新 `dp[c]` 时都会读取 `dp[c-weight]`。倒序时较小容量仍是处理上一件物品后的旧值；正序时较小容量已经包含当前物品，因此可以再选一次。

<figure class="algorithm-figure">
  <img src="/images/algorithms/18-knapsack/process.svg" alt="背包 DP执行过程图" loading="lazy">
  <figcaption>同一个一维公式，方向不同就代表物品能否在同一轮再次出现。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 0-1 为什么倒序

处理物品 w 时，若 c 从大到小，`dp[c-w]` 位于更小容量，尚未被本轮更新，代表只使用前面物品的状态。当前物品最多加入一次。

### 2. 完全背包为什么正序

c 从小到大时，`dp[c-w]` 已可能在本轮加入当前物品。再加一次正好表示同一物品可重复使用。

### 3. 恰好装满如何初始化

若求最少物品数，除 `dp[0]=0` 外应设为无穷，表示不可达；若求方案数，`dp[0]=1` 表示“不选任何物品”是一种凑成 0 的方案。其余容量不能初始化成 1 或合法 0。

<figure class="algorithm-figure">
  <img src="/images/algorithms/18-knapsack/proof.svg" alt="背包 DP正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def can_partition(nums):
    total = sum(nums)
    if total % 2 == 1:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for value in nums:
        for capacity in range(target, value - 1, -1):
            dp[capacity] = dp[capacity] or dp[capacity - value]
    return dp[target]


def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for value in range(coin, amount + 1):
            dp[value] = min(dp[value], dp[value - coin] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]
```

`can_partition` 是每个数一次的 0-1 背包，容量倒序；`coin_change` 是硬币无限次的完全背包，容量正序。

## 6. 手工模拟一次

输入：`nums=[1,5,11,5]，target=11`

| 处理数字 | 容量方向 | 新可达容量 | dp[11] |
|---|---|---|---|
| 初始 | — | 0 | False |
| 1 | 11→1 | 1 | False |
| 5 | 11→5 | 5,6 | False |
| 11 | 11 | 11 | True |

一旦 11 可达，就能把总和 22 分成两个和为 11 的子集。

## 7. 复杂度分析

- **时间复杂度：O(n·C)**。n 件物品分别扫描容量 0..C。
- **空间复杂度：O(C)**。压缩后只保留一维容量表。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>若干物品 + 容量/目标和 + 每件一次或无限次 → 背包 DP</strong></div>

- 分割成等和子集、目标和。
- 凑金额的方案数或最少硬币。
- 选择受到总容量、总和或数量限制。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：0-1 容量正序

```python
for c in range(weight, capacity + 1):
```

会在同一轮重复使用当前物品，变成完全背包。

### 坑 2：不可达状态初始化为 0

```python
dp = [0] * (amount + 1)
```

求最少次数时 0 会伪装成可达；使用无穷。

### 坑 3：方案数与排列数混淆

物品在外层通常统计组合；容量在外层可能统计不同顺序，先确认题目是否把顺序视为不同。

## 10. Python 补充

### 倒序 `range`

`range(target, value-1, -1)` 会产生 target 到 value，包含 value、不包含 value-1。步长为 -1 时停止边界也要反向理解。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)（中等）  
  0-1 可达性。

### 标准

- [494. 目标和](https://leetcode.cn/problems/target-sum/)（中等）  
  转成选择正号子集的目标和。
- [322. 零钱兑换](https://leetcode.cn/problems/coin-change/)（中等）  
  完全背包最小值。

### 进阶

- [518. 零钱兑换 II](https://leetcode.cn/problems/coin-change-ii/)（中等）  
  组合方案数与遍历顺序。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def can_partition(nums):
    total = sum(nums)
    if total % 2 == 1:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for value in nums:
        for capacity in range(target, value - 1, -1):
            dp[capacity] = dp[capacity] or dp[capacity - value]
    return dp[target]


def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for value in range(coin, amount + 1):
            dp[value] = min(dp[value], dp[value - coin] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能定义容量状态语义。
- [ ] 能证明两种遍历方向。
- [ ] 能按最大值、最小值、方案数选择初始化。
- [ ] 能识别题目的背包模型。
- [ ] 完成 416 和 322。

## 下一节

下一节处理两条序列：匹配时同时前进，不匹配时跳过一侧，得到经典最长公共子序列。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-17-dynamic-programming-intro/">← 17 动态规划入门</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-19-longest-common-subsequence/">19 最长公共子序列 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 18》](https://www.bilibili.com/video/BV16Y411v7Y6/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
