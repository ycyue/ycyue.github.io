---
title: 算法基础 22｜区间 DP：从短区间推到长区间
date: 2026-09-04 13:00:00
permalink: 2026/09/04/algorithm-22-interval-dp/
categories:
  - 算法
tags:
  - Python
  - 动态规划
  - LeetCode
  - 算法基础
description: 用最长回文子序列图解区间状态、两端决策和按长度递增的遍历顺序。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-21-state-machine-dp/">← 21 状态机 DP</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-23-tree-dp-diameter/">23 树形 DP：直径 →</a>
</nav>

当一次决策会删掉左端、右端或把区间分成两段时，前缀 dp 很难表达。区间 DP 直接定义 `dp[left][right]`，让更长区间依赖更短区间。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：字符串 s。
- **输出**：最长回文子序列长度。
- **直接想法**：枚举所有子序列并检查是否回文。
- **真正瓶颈**：共有 2ⁿ 个子序列；而同一左右边界会被不同删除顺序反复到达。

## 2. 从暴力解法开始

```python
def lps_brute(s):
    def dfs(left, right):
        if left > right:
            return 0
        if left == right:
            return 1
        if s[left] == s[right]:
            return 2 + dfs(left + 1, right - 1)
        return max(dfs(left + 1, right), dfs(left, right - 1))
    return dfs(0, len(s) - 1)
```

递归状态只有 O(n²) 个。区间表按长度递增填充，确保 `[left+1,right-1]`、`[left+1,right]`、`[left,right-1]` 都已计算。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>dp[left][right] 表示闭区间 s[left:right+1] 的答案；短区间是长区间的地基。</strong></div>

两端相等时可同时进入回文序列，中间取最优；两端不同则至少舍弃一端，取两个缩短区间的较大值。单字符区间初始化为 1。

<figure class="algorithm-figure">
  <img src="/images/algorithms/22-interval-dp/process.svg" alt="区间 DP执行过程图" loading="lazy">
  <figcaption>按长度填表比按普通行列更直观：所有箭头都从短区间指向长区间。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 两端相等为什么加二

若 `s[l]==s[r]`，可以把它们放到区间 `(l,r)` 的最长回文子序列两端，形成更长回文。存在一个最优解能同时使用这两个边界字符。

### 2. 两端不同为什么舍弃一端

回文序列的首尾字符必须相等，因此不同的 s[l]、s[r] 不可能同时作为所选序列两端。任一最优解至少不使用其中一个，被两个子区间之一覆盖。

### 3. 为什么必须先算短区间

当前状态依赖长度减少 1 或 2 的状态。如果按错误方向遍历，读到的仍是初始 0，会让结果偏小。

<figure class="algorithm-figure">
  <img src="/images/algorithms/22-interval-dp/proof.svg" alt="区间 DP正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def longest_palindrome_subseq(s):
    n = len(s)
    if n == 0:
        return 0

    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1

    for length in range(2, n + 1):
        for left in range(0, n - length + 1):
            right = left + length - 1
            if s[left] == s[right]:
                dp[left][right] = 2 + (dp[left + 1][right - 1] if length > 2 else 0)
            else:
                dp[left][right] = max(dp[left + 1][right], dp[left][right - 1])

    return dp[0][n - 1]
```

长度为 2 且两端相等时内部是空区间，所以额外取 0。也可把表扩展或改变遍历方式统一边界。

## 6. 手工模拟一次

输入：`s="bbbab"`

| 区间 | 两端 | 来源 | dp |
|---|---|---|---|
| [0,0] | b | 单字符 | 1 |
| [0,1] | b=b | 空内部+2 | 2 |
| [1,3] | b≠a | max([2,3],[1,2]) | 2 |
| [0,4] | b=b | dp[1][3]+2 | 4 |

答案 4，对应子序列 "bbbb"。

## 7. 复杂度分析

- **时间复杂度：O(n²)**。共有约 n²/2 个有效区间，每个常数转移。
- **空间复杂度：O(n²)**。保存所有左右边界组合。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>答案定义在连续区间 + 决策缩两端或枚举分割点 → 区间 DP</strong></div>

- 回文、合并石子、切割区间。
- 操作对象始终是一段 `[l,r]`。
- 大区间由更短区间或两段子区间得到。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：按 left 从小到大、right 从小到大

```python
for left in range(n):
    for right in range(left, n):
```

可能在依赖尚未计算时读取。按长度递增最清楚。

### 坑 2：空字符串返回 dp[0]

先处理 n==0。

### 坑 3：长度2访问反向区间

```python
dp[left + 1][right - 1]
```

为长度 2 单独把内部贡献设为 0。

## 10. Python 补充

### 切片与区间 DP 下标

Python 切片右端不包含，而本文 dp 使用闭区间。写 `s[left:right+1]` 才对应 dp 的范围；不要让两套边界混在一起。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [516. 最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/)（中等）  
  两端相等/不等。

### 标准

- [1039. 多边形三角剖分的最低得分](https://leetcode.cn/problems/minimum-score-triangulation-of-polygon/)（中等）  
  枚举区间内分割点。
- [1547. 切棍子的最小成本](https://leetcode.cn/problems/minimum-cost-to-cut-a-stick/)（困难）  
  排序切点，区间代价加左右子问题。

### 进阶

- [312. 戳气球](https://leetcode.cn/problems/burst-balloons/)（困难）  
  反向思考区间内最后戳哪个。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def longest_palindrome_subseq(s):
    n = len(s)
    if n == 0:
        return 0

    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1

    for length in range(2, n + 1):
        for left in range(0, n - length + 1):
            right = left + length - 1
            if s[left] == s[right]:
                dp[left][right] = 2 + (dp[left + 1][right - 1] if length > 2 else 0)
            else:
                dp[left][right] = max(dp[left + 1][right], dp[left][right - 1])

    return dp[0][n - 1]
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能定义闭区间状态。
- [ ] 能推导两端分支。
- [ ] 能按长度确定遍历顺序。
- [ ] 能处理单字符、空区间。
- [ ] 完成 516 和 1039。

## 下一节

下一阶段把 DP 搬到树上：子树返回向下延伸的链，当前节点把两条链拼成直径。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-21-state-machine-dp/">← 21 状态机 DP</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-23-tree-dp-diameter/">23 树形 DP：直径 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 22》](https://www.bilibili.com/video/BV1Gs4y1E7EU/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
