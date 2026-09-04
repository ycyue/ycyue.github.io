---
title: 算法基础 21｜状态机 DP：把股票交易画成状态转移
date: 2026-09-04 12:50:00
permalink: 2026/09/04/algorithm-21-state-machine-dp/
categories:
  - 算法
tags:
  - Python
  - 动态规划
  - LeetCode
  - 算法基础
description: 用持有、空仓、冷冻状态图解股票 DP，解释每条转移代表哪项合法操作。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-20-longest-increasing-subsequence/">← 20 最长递增子序列</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-22-interval-dp/">22 区间 DP →</a>
</nav>

股票题难在“同一天、同一价格”下可能处于不同状态：手里持有股票与空仓的未来选择完全不同。一个 dp 值不够，需要把状态也放进下标。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：每日价格 prices，卖出后有一天冷冻期。
- **输出**：最多能获得的利润。
- **直接想法**：每天递归选择买、卖或休息，并携带持有/冷冻状态。
- **真正瓶颈**：选择路径指数增长，但真正不同的状态只有“天数 × 少量持仓状态”。

## 2. 从暴力解法开始

```python
def max_profit_brute(prices):
    def dfs(day, holding, cooldown):
        if day == len(prices):
            return 0
        best = dfs(day + 1, holding, False)
        if holding:
            best = max(best, prices[day] + dfs(day + 1, False, True))
        elif not cooldown:
            best = max(best, -prices[day] + dfs(day + 1, True, False))
        return best
    return dfs(0, False, False)
```

每个状态有少量分支。把 `(day, state)` 缓存后为 O(n)，递推只需维护持有、刚卖出、空闲三个状态。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>先列出互斥且完整的状态，再为每条合法操作画有向边；DP 转移就是“从哪些旧状态能到当前状态”。</strong></div>

设 `hold` 为当天结束持有，`sold` 为当天刚卖出，`rest` 为当天结束空仓且不在刚卖状态。更新必须同时使用前一天旧值。

<figure class="algorithm-figure">
  <img src="/images/algorithms/21-state-machine-dp/process.svg" alt="状态机 DP执行过程图" loading="lazy">
  <figcaption>先画状态与合法操作，再写 max；这样不会凭空遗漏冷冻约束。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么需要三个状态

卖出后的第二天不能买入，所以“刚卖出空仓”与“普通空仓”未来允许的动作不同，不能合并。

### 2. 转移为何完整

新 hold 来自旧 hold 休息或旧 rest 买入；新 sold 只能来自旧 hold 卖出；新 rest 来自旧 rest 休息或旧 sold 度过冷冻。每种合法历史的最后动作必属于其中一条边。

### 3. 为什么最后不返回 hold

持有状态的利润已扣除买入成本且股票尚未变现。最优完成利润一定在 sold 或 rest 中，返回两者最大。

<figure class="algorithm-figure">
  <img src="/images/algorithms/21-state-machine-dp/proof.svg" alt="状态机 DP正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def max_profit_with_cooldown(prices):
    if not prices:
        return 0

    hold = -prices[0]
    sold = float('-inf')
    rest = 0

    for price in prices[1:]:
        new_hold = max(hold, rest - price)
        new_sold = hold + price
        new_rest = max(rest, sold)
        hold, sold, rest = new_hold, new_sold, new_rest

    return max(sold, rest)
```

用 `new_*` 明确全部来源是前一天。Python 元组同时赋值也会先计算右侧，因此最后一行安全。

## 6. 手工模拟一次

输入：`prices=[1,2,3,0,2]`

| 天/价格 | hold | sold | rest | 解释 |
|---|---|---|---|---|
| 0/1 | -1 | -∞ | 0 | 初始化 |
| 1/2 | -1 | 1 | 0 | 卖出 |
| 2/3 | -1 | 2 | 1 | 卖出或休息 |
| 3/0 | 1 | -1 | 2 | 冷冻结束后买入 |
| 4/2 | 1 | 3 | 2 | 卖出，总利润3 |

最优操作是买1卖2、冷冻、买0卖2，利润 3。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每天只更新固定三个状态。
- **空间复杂度：O(1)**。滚动保存前一天状态。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>同一位置存在少量互斥模式 + 操作限制模式切换 → 状态机 DP</strong></div>

- 买卖股票、交易次数、冷冻期或手续费。
- 当前位置有持有/未持有等模式。
- 限制可以画成有限状态之间的边。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：原地依次更新

```python
hold = max(hold, rest-price)
sold = hold+price
```

sold 读到新 hold，可能在同一天买入又卖出。使用 new 变量。

### 坑 2：sold 初始化为 0

```python
sold = 0
```

第 0 天不可能刚卖出；用负无穷表示不可达。

### 坑 3：返回 hold

```python
return max(hold, sold, rest)
```

最终持有不是已实现利润，返回空仓状态。

## 10. Python 补充

### 负无穷表示不可达

`float("-inf")` 参与 max 时不会胜过合法利润，但从合法状态转移后可以变为有限值，适合最大化 DP 的不可能状态。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)（中等）  
  持有/空仓两状态。

### 标准

- [309. 最佳买卖股票时机含冷冻期](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)（中等）  
  三个状态。
- [714. 买卖股票的最佳时机含手续费](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)（中等）  
  在买或卖的一侧扣一次手续费。

### 进阶

- [188. 买卖股票的最佳时机 IV](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)（困难）  
  增加交易次数维度。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def max_profit_with_cooldown(prices):
    if not prices:
        return 0

    hold = -prices[0]
    sold = float('-inf')
    rest = 0

    for price in prices[1:]:
        new_hold = max(hold, rest - price)
        new_sold = hold + price
        new_rest = max(rest, sold)
        hold, sold, rest = new_hold, new_sold, new_rest

    return max(sold, rest)
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能列出互斥且完整的状态。
- [ ] 能为每条转移指出具体动作。
- [ ] 能正确初始化不可达状态。
- [ ] 能避免滚动更新污染。
- [ ] 完成 122 和 309。

## 下一节

下一节状态不再是前缀，而是一段区间；计算顺序必须按区间长度从短到长。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-20-longest-increasing-subsequence/">← 20 最长递增子序列</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-22-interval-dp/">22 区间 DP →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 21》](https://www.bilibili.com/video/BV1ho4y1W7QK/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
