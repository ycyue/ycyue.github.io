---
title: 算法基础 19｜最长公共子序列 LCS：两条序列如何对齐
date: 2026-09-04 12:30:00
permalink: 2026/09/04/algorithm-19-longest-common-subsequence/
categories:
  - 算法
tags:
  - Python
  - 动态规划
  - LeetCode
  - 算法基础
description: 图解 LCS 二维状态表，推导字符相等与不等时的状态转移及编辑距离联系。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-18-knapsack/">← 18 背包 DP</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-20-longest-increasing-subsequence/">20 最长递增子序列 →</a>
</nav>

子序列可以删除字符，但不能改变剩余字符相对顺序。两条字符串末尾字符相等时可以配对；不等时，至少有一边的末尾不会进入当前最优公共子序列。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：两个字符串 text1、text2。
- **输出**：最长公共子序列长度。
- **直接想法**：枚举 text1 的所有子序列，再检查是否也是 text2 的子序列。
- **真正瓶颈**：长度 m 的字符串有 2ᵐ 个子序列；大量不同删除路径落到相同的两个下标状态。

## 2. 从暴力解法开始

```python
def lcs_brute(a, b):
    def dfs(i, j):
        if i == len(a) or j == len(b):
            return 0
        if a[i] == b[j]:
            return 1 + dfs(i + 1, j + 1)
        return max(dfs(i + 1, j), dfs(i, j + 1))
    return dfs(0, 0)
```

递归参数只有 m·n 组，但无缓存时同一 `(i,j)` 会被多次到达。二维表将每个前缀对只计算一次。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>dp[i][j] 表示 text1 前 i 个字符与 text2 前 j 个字符的 LCS 长度。</strong></div>

末尾字符相等时可接在两个更短前缀的 LCS 后；不等时，不可能同时选两个末尾，分别尝试丢掉 text1 末尾或 text2 末尾，取较大值。

<figure class="algorithm-figure">
  <img src="/images/algorithms/19-longest-common-subsequence/process.svg" alt="最长公共子序列执行过程图" loading="lazy">
  <figcaption>二维表的行列分别代表两个字符串前缀，格子只依赖上、左和左上。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 字符相等为何直接加一

当 `a[i-1]==b[j-1]`，可把这个共同字符接到更短前缀的 LCS 后。即使某个最优解没使用它，也能通过交换得到同长度且使用末尾字符的解，因此该转移成立。

### 2. 字符不等为何取两项最大

两个不同末尾不可能作为同一个公共字符同时进入序列。任一最优解至少舍弃其中一个，于是它属于 `dp[i-1][j]` 或 `dp[i][j-1]` 覆盖的情况。

### 3. 为什么不是子串

子序列允许跳过字符，所以状态可从上或左继承；最长公共子串要求连续，不匹配时当前连续长度必须清零。

<figure class="algorithm-figure">
  <img src="/images/algorithms/19-longest-common-subsequence/proof.svg" alt="最长公共子序列正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]
```

dp 多出第 0 行和第 0 列，代表空前缀，使初始化自然为 0；字符串字符因此用 `i-1`、`j-1`。

## 6. 手工模拟一次

输入：`text1="abcde", text2="ace"`

| 前缀1 | 前缀2 | 末尾关系 | dp |
|---|---|---|---|
| a | a | 相等 | 1 |
| abc | ac | c=c | 2 |
| abcd | ace | d≠e | 2 |
| abcde | ace | e=e | 3 |

最长公共子序列为 "ace"，长度 3。

## 7. 复杂度分析

- **时间复杂度：O(mn)**。表中 (m+1)(n+1) 个格子各计算一次。
- **空间复杂度：O(mn)**。保存完整二维表；仅求长度可滚动压缩为 O(min(m,n))。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>两条序列 + 保持相对顺序 + 匹配/跳过 → 双下标二维 DP</strong></div>

- 最长公共子序列、删除后相等。
- 编辑距离或两个字符串对齐。
- 状态需要同时知道两条序列处理到哪里。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：字符下标没减一

```python
if text1[i] == text2[j]:
```

dp 的 i 表示前 i 个字符，最后字符下标是 i-1。

### 坑 2：不等时只丢一边

```python
dp[i][j] = dp[i-1][j]
```

最优解可能需要丢另一边，取两者最大。

### 坑 3：二维列表浅拷贝

```python
dp = [[0] * (n + 1)] * (m + 1)
```

所有行会引用同一列表；使用列表推导式。

## 10. Python 补充

### 正确创建二维列表

`[[0] * cols for _ in range(rows)]` 每轮创建一条新行。乘法复制外层列表只会复制引用。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)（中等）  
  两个前缀二维 DP。

### 标准

- [583. 两个字符串的删除操作](https://leetcode.cn/problems/delete-operation-for-two-strings/)（中等）  
  答案可由 LCS 长度推出。
- [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)（中等）  
  插入、删除、替换对应三个邻格。

### 进阶

- [1035. 不相交的线](https://leetcode.cn/problems/uncrossed-lines/)（中等）  
  连线不交叉等价于保持相对顺序的 LCS。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释 dp 两个下标。
- [ ] 能推导相等与不等分支。
- [ ] 能处理空前缀与字符下标。
- [ ] 能区分子序列和子串。
- [ ] 完成 1143 和 583。

## 下一节

下一节只处理一条序列，但状态要回答“以哪个位置结尾”；随后用贪心与二分把 O(n²) 优化到 O(n log n)。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-18-knapsack/">← 18 背包 DP</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-20-longest-increasing-subsequence/">20 最长递增子序列 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 19》](https://www.bilibili.com/video/BV1TM4y1o7ug/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
