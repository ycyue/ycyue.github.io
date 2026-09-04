---
title: 算法基础 17｜动态规划入门：从记忆化搜索到递推
date: 2026-09-04 12:10:00
permalink: 2026/09/04/algorithm-17-dynamic-programming-intro/
categories:
  - 算法
tags:
  - Python
  - 动态规划
  - LeetCode
  - 算法基础
description: 从打家劫舍出发，完整推导 DP 状态、转移、初始化、遍历顺序与空间优化。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-16-backtracking-permutations/">← 16 排列型回溯</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-18-knapsack/">18 背包 DP →</a>
</nav>

动态规划不是先猜公式。最自然的起点是暴力搜索：面对第 i 间房，选它还是不选？当你发现相同的 `dfs(i)` 被反复计算，缓存与递推就顺理成章。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一排房屋金额 nums，相邻房屋不能同时偷。
- **输出**：能偷到的最大金额。
- **直接想法**：对每间房递归尝试“跳过”或“偷取”。
- **真正瓶颈**：不同选择路径会反复求同一个后缀的最优值，调用数近似指数增长。

## 2. 从暴力解法开始

```python
def rob_brute(nums):
    def dfs(i):
        if i >= len(nums):
            return 0
        return max(dfs(i + 1), nums[i] + dfs(i + 2))
    return dfs(0)
```

状态只有 n 个，暴力却形成两叉递归树。给 `dfs(i)` 缓存后，每个状态只计算一次；再按依赖顺序倒推即可去掉递归。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>先定义状态，再写选择：dfs(i) 表示从第 i 间及以后能偷到的最大金额。</strong></div>

不偷第 i 间得到 `dfs(i+1)`；偷它就必须跳过相邻房，得到 `nums[i]+dfs(i+2)`。两种选择覆盖所有合法方案，取较大值。递推可改成 `dp[i]=max(dp[i-1],dp[i-2]+nums[i])`。

<figure class="algorithm-figure">
  <img src="/images/algorithms/17-dynamic-programming-intro/process.svg" alt="动态规划入门执行过程图" loading="lazy">
  <figcaption>公式中的每一项都对应一个明确选择，表格只是把搜索结果按依赖顺序保存。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 转移为什么完整

任一合法方案对房 i 只有两种情况：不偷，方案完全位于前 i-1 间；偷，则 i-1 不能偷，剩余来自前 i-2 间。这两类覆盖全部方案。

### 2. 为什么子问题必须最优

若偷 i 的最优方案中，前 i-2 间不是最优选择，就可替换成更优前缀且仍不相邻，从而得到更大总额，与原方案最优矛盾。

### 3. 空间为何能压缩

计算当前值只依赖前两个状态，不需要整张 dp 表。保存 `prev2`、`prev1` 并滚动更新即可。压缩前先写清完整状态，避免更新顺序覆盖依赖。

<figure class="algorithm-figure">
  <img src="/images/algorithms/17-dynamic-programming-intro/proof.svg" alt="动态规划入门正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def rob(nums):
    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]

    for money in nums:
        current = max(prev1, prev2 + money)
        prev2 = prev1
        prev1 = current

    return prev1
```

这段写法自然处理空数组和单元素。先算 current，再整体滚动；若先覆盖 prev1，会丢掉旧状态。

## 6. 手工模拟一次

输入：`nums=[2,7,9,3,1]`

| 房屋 | 金额 | 不偷 | 偷 | dp |
|---|---|---|---|---|
| 0 | 2 | 0 | 2 | 2 |
| 1 | 7 | 2 | 7 | 7 |
| 2 | 9 | 7 | 11 | 11 |
| 3 | 3 | 11 | 10 | 11 |
| 4 | 1 | 11 | 12 | 12 |

最优值 12 对应偷 2、9、1。表中每行都比较最后一步的两种选择。

## 7. 复杂度分析

- **时间复杂度：O(n)**。n 个状态各计算一次，每次常数操作。
- **空间复杂度：O(1)**。滚动变量只保存最近两个状态；完整 dp 表则为 O(n)。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>求最优/计数 + 选择后产生重复子问题 + 状态数有限 → 记忆化搜索 / DP</strong></div>

- 最大、最小、方案数或是否可行。
- 问题可由更小前缀/后缀表示。
- 暴力递归反复出现相同参数。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：没定义 dp 含义就写公式

```python
dp[i] = max(dp[i-1], dp[i-2] + nums[i])
```

必须说明 dp[i] 覆盖哪段输入、返回什么。

### 坑 2：空数组初始化越界

```python
dp[0] = nums[0]
```

通用代码要先处理空数组，或使用带空前缀的定义。

### 坑 3：滚动变量覆盖过早

```python
prev1 = max(prev1, prev2 + money)
prev2 = prev1
```

第二行拿到的是新 prev1；先保存 current。

## 10. Python 补充

### `functools.cache` 做记忆化

在递归函数上加 `@cache` 会按参数保存返回值，适合先验证状态与转移。之后再翻译成递推。

```python
from functools import cache

@cache
def dfs(i):
    ...
```

## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)（简单）  
  最后一步来自 i-1 或 i-2。
- [746. 使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)（简单）  
  明确 dp 表示到达台阶还是离开台阶。

### 标准

- [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)（中等）  
  偷与不偷。

### 进阶

- [213. 打家劫舍 II](https://leetcode.cn/problems/house-robber-ii/)（中等）  
  环拆成不含首或不含尾的两条链。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def rob(nums):
    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]

    for money in nums:
        current = max(prev1, prev2 + money)
        prev2 = prev1
        prev1 = current

    return prev1
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能从暴力选择写出递归。
- [ ] 能识别重复状态并加缓存。
- [ ] 能完成 DP 五步：定义、转移、初始化、顺序、答案。
- [ ] 能安全做空间压缩。
- [ ] 完成 198 和 746。

## 下一节

下一节把“选或不选”放进容量限制中，系统区分 0-1 背包、完全背包以及至多、恰好、至少三种状态语义。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-16-backtracking-permutations/">← 16 排列型回溯</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-18-knapsack/">18 背包 DP →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 17》](https://www.bilibili.com/video/BV1Xj411K7oF/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
