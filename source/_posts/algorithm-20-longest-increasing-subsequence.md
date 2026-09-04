---
title: 算法基础 20｜最长递增子序列 LIS：从位置 DP 到贪心二分
date: 2026-09-04 12:40:00
permalink: 2026/09/04/algorithm-20-longest-increasing-subsequence/
categories:
  - 算法
tags:
  - Python
  - 动态规划
  - LeetCode
  - 算法基础
description: 推导以位置结尾的 LIS 状态，并图解 tails 数组为何可用二分维护最小结尾。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-19-longest-common-subsequence/">← 19 最长公共子序列</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-21-state-machine-dp/">21 状态机 DP →</a>
</nav>

LIS 允许跳过元素。若只记录“前 i 个元素的最长长度”，很难判断 nums[i] 能否接上。更有用的状态是：必须以 nums[i] 结尾时，最长长度是多少。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：整数数组 nums。
- **输出**：最长严格递增子序列长度。
- **直接想法**：对每个元素选择加入或跳过，同时记录上一个选择值。
- **真正瓶颈**：选择树指数增长；位置 DP 降到 O(n²)，再利用“同长度结尾越小越好”降到 O(n log n)。

## 2. 从暴力解法开始

```python
def lis_brute(nums):
    def dfs(i, previous):
        if i == len(nums):
            return 0
        best = dfs(i + 1, previous)
        if previous is None or nums[i] > previous:
            best = max(best, 1 + dfs(i + 1, nums[i]))
        return best
    return dfs(0, None)
```

状态若直接带 previous 值不易压缩。位置 DP 定义 `dp[i]` 为以 i 结尾的 LIS，就只需检查所有更早且更小的 nums[j]。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>基础 DP 看“接在哪个更小位置后”；优化版 tails[length-1] 保存该长度递增子序列的最小结尾。</strong></div>

结尾越小，未来越容易接入新数。对每个 value，在 tails 中找到第一个大于等于它的位置替换；若不存在则追加，表示最长长度增加。tails 本身不是最终 LIS，但长度正确。

<figure class="algorithm-figure">
  <img src="/images/algorithms/20-longest-increasing-subsequence/process.svg" alt="最长递增子序列执行过程图" loading="lazy">
  <figcaption>tails 压缩了大量具体序列，只保留每个长度最有希望的结尾。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 位置 DP 为什么成立

任何以 i 结尾、长度大于 1 的递增子序列，倒数第二个元素必在某个 j<i 且 nums[j]<nums[i]。选择其中 dp[j] 最大者再加 1，覆盖所有可能前驱。

### 2. 为什么替换不会损失答案

对于相同长度，结尾更小的序列能接入的未来数集合包含结尾更大者能接入的集合。因此保留最小结尾至少同样有利。

### 3. 为什么用 lower_bound

严格递增时，相等值不能延长长度，所以要替换第一个 `>= value` 的结尾。若求非递减序列，才寻找第一个 `> value`。

<figure class="algorithm-figure">
  <img src="/images/algorithms/20-longest-increasing-subsequence/proof.svg" alt="最长递增子序列正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for value in nums:
        index = bisect_left(tails, value)
        if index == len(tails):
            tails.append(value)
        else:
            tails[index] = value
    return len(tails)
```

`bisect_left` 返回第一个大于等于 value 的位置。若需要还原具体序列，还要保存前驱与位置，不能直接返回 tails。

## 6. 手工模拟一次

输入：`nums=[10,9,2,5,3,7,101,18]`

| value | 操作位置 | tails 更新后 | 含义 |
|---|---|---|---|
| 10 | 0 | [10] | 长度1最小结尾10 |
| 9 | 0 | [9] | 改善长度1结尾 |
| 2 | 0 | [2] | 继续改善 |
| 5 | 1 | [2,5] | 最长长度2 |
| 3 | 1 | [2,3] | 改善长度2结尾 |
| 7 | 2 | [2,3,7] | 最长长度3 |
| 18 | 3 | [2,3,7,18] | 最终长度4 |

tails 的长度是 4；其中内容恰好递增，但不保证对应原数组中的最终最优路径。

## 7. 复杂度分析

- **时间复杂度：O(n log n)**。每个元素在 tails 上做一次二分，tails 长度至多 n。
- **空间复杂度：O(n)**。最坏严格递增时 tails 保存 n 个结尾。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>最长递增子序列 + 只求长度 → 最小结尾贪心 + lower_bound</strong></div>

- 子序列且要求严格递增。
- 二维偏序可排序一维后转成 LIS。
- O(n²) 位置 DP 超时。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：把 tails 当成原序列答案

```python
return tails
```

tails 用替换压缩状态，可能不是实际 LIS；只返回长度。

### 坑 2：严格递增用 bisect_right

```python
index = bisect_right(tails, value)
```

相等值会错误延长；严格递增用 bisect_left。

### 坑 3：忘记空数组

```python
return max(dp)
```

空 dp 会报错；tails 写法自然返回 0。

## 10. Python 补充

### `bisect_left`

标准库二分要求输入列表有序。它返回保持有序插入 value 的最左位置，也就是第一个 `>= value` 的位置。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)（中等）  
  先写 O(n²) 再优化。

### 标准

- [1671. 得到山形数组的最少删除次数](https://leetcode.cn/problems/minimum-number-of-removals-to-make-mountain-array/)（困难）  
  正向与反向 LIS。
- [354. 俄罗斯套娃信封问题](https://leetcode.cn/problems/russian-doll-envelopes/)（困难）  
  宽升序、高降序后对高度做 LIS。

### 进阶

- [1964. 找出到每个位置为止最长的有效障碍赛跑路线](https://leetcode.cn/problems/find-the-longest-valid-obstacle-course-at-each-position/)（困难）  
  非递减版本使用 bisect_right。

<details>
<summary>检查答案：本节核心实现</summary>

```python
from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for value in nums:
        index = bisect_left(tails, value)
        if index == len(tails):
            tails.append(value)
        else:
            tails[index] = value
    return len(tails)
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能定义以 i 结尾的 dp。
- [ ] 能解释最小结尾贪心。
- [ ] 能区分 lower_bound 与 upper_bound。
- [ ] 知道 tails 不能直接还原答案。
- [ ] 完成 300 和 354。

## 下一节

下一节一个下标需要多个状态：当天结束时持有或不持有股票，形成状态机 DP。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-19-longest-common-subsequence/">← 19 最长公共子序列</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-21-state-machine-dp/">21 状态机 DP →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 20》](https://www.bilibili.com/video/BV1ub411Q7sB/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
