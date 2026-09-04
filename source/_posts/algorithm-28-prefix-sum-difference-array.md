---
title: 算法基础 28｜前缀和与差分：把区间操作压缩到 O(1)
date: 2026-09-04 14:10:00
permalink: 2026/09/04/algorithm-28-prefix-sum-difference-array/
categories:
  - 算法
tags:
  - Python
  - 前缀和
  - 差分数组
  - LeetCode
  - 算法基础
description: 从重复区间求和出发，图解前缀和与差分数组的互逆关系，掌握闭区间边界、区间查询和批量区间修改。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-27-monotonic-queue/">← 27 单调队列</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <span class="series-nav__next series-nav__pending">28 扩展篇完成 ✓</span>
</nav>

同一个数组被反复询问“从 left 到 right 的和”时，每次重新相加会重复做大量工作。前缀和把历史累计起来，让一次区间查询只剩一次减法；差分数组则反过来，用两个边界标记一次区间修改。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一个数组，以及多次闭区间 `[left, right]` 求和或区间加值操作。
- **输出**：快速回答每个区间和；或在全部修改结束后还原最终数组。
- **直接想法**：每次查询都遍历区间求和；每次修改都逐个更新区间内元素。
- **真正瓶颈**：若数组和操作数都接近 n，逐段扫描最坏需要 O(n²) 时间。

## 2. 从暴力解法开始

```python
def range_sum_brute(nums, left, right):
    total = 0
    for index in range(left, right + 1):
        total += nums[index]
    return total


def apply_updates_brute(length, updates):
    nums = [0] * length
    for left, right, delta in updates:
        for index in range(left, right + 1):
            nums[index] += delta
    return nums
```

一次操作没有问题，真正的浪费发生在“同一段元素被反复经过”。优化方向不是让加法更快，而是提前保存累计结果，或只记录数值发生变化的位置。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>前缀和保存“到这里一共多少”；差分数组保存“从这里开始改变多少”。</strong></div>

令 `prefix[0]=0`，`prefix[i+1]=prefix[i]+nums[i]`，则闭区间 `[left,right]` 的和是 `prefix[right+1]-prefix[left]`。差分更新 `[left,right]` 加 `delta` 时，只做 `diff[left]+=delta` 与 `diff[right+1]-=delta`，最后从左向右累加还原。

<figure class="algorithm-figure">
  <img src="/images/algorithms/28-prefix-sum-difference-array/process.svg" alt="前缀和与差分执行过程图" loading="lazy">
  <figcaption>多出的 prefix[0] 让 left=0 不再需要特判；两个前缀相减，重叠部分会完整抵消。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么区间和是两个前缀相减

`prefix[right+1]` 包含 `nums[0]` 到 `nums[right]`，`prefix[left]` 包含 `nums[0]` 到 `nums[left-1]`。两者相减后，公共的左侧部分抵消，只剩 `nums[left:right+1]`。

### 2. 为什么前缀数组要多一个位置

若 `prefix[i]` 表示前 i 个元素之和，那么空前缀自然是 `prefix[0]=0`。原数组下标 i 对应 `prefix[i+1]`，查询从 0 开始的区间也统一使用同一公式。

### 3. 为什么差分只改两个边界

`diff[left]+=delta` 表示从 left 起累计值增加 delta；`diff[right+1]-=delta` 表示越过 right 后取消这份增量。中间位置虽然没逐个修改，但还原时的连续累加会自动携带 delta。

<figure class="algorithm-figure">
  <img src="/images/algorithms/28-prefix-sum-difference-array/proof.svg" alt="前缀和与差分正确性推导图" loading="lazy">
  <figcaption>差分数组记录的是相邻位置的变化量：左边界打开增量，右边界之后关闭增量。</figcaption>
</figure>

## 5. Python 模板

```python
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for index, value in enumerate(nums):
        prefix[index + 1] = prefix[index] + value
    return prefix


def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]


def apply_range_updates(length, updates):
    diff = [0] * (length + 1)
    for left, right, delta in updates:
        diff[left] += delta
        diff[right + 1] -= delta

    nums = [0] * length
    running = 0
    for index in range(length):
        running += diff[index]
        nums[index] = running
    return nums
```

`prefix` 和 `diff` 都多开一个位置，用空间换掉边界特判。模板约定输入区间是闭区间 `[left,right]`；若题目使用半开区间，公式要随定义一起调整。

## 6. 手工模拟一次

输入：`nums=[2,-1,3,5]，查询 [1,3]`

| 步骤 | 读取/写入 | 结果 | 含义 |
|---|---|---|---|
| 初始化 | prefix[0] | 0 | 空前缀 |
| 加入 nums[0]=2 | prefix[1] | 2 | 前 1 个元素和 |
| 加入 nums[1]=-1 | prefix[2] | 1 | 前 2 个元素和 |
| 继续累计 | prefix[4] | 9 | 全部元素和 |
| 查询 [1,3] | prefix[4]-prefix[1] | 7 | -1+3+5 |

前缀数组是 `[0,2,1,4,9]`。无论区间多长，建表后每次查询都只访问两个位置。

## 7. 复杂度分析

- **时间复杂度：前缀和 O(n+q)，差分 O(n+q)**。预处理或还原各扫描一次数组，每个查询/更新只做 O(1) 次操作。
- **空间复杂度：O(n)**。额外保存长度 n+1 的 prefix 或 diff 数组。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>多次区间求和 → 前缀和；多次区间加值、最后统一查看 → 差分数组</strong></div>

- 同一份数组上有很多区间和查询。
- 很多区间统一加减，修改期间不要求立刻查询单点。
- 题目出现“连续子数组之和”，可考虑前缀和配合哈希表。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：少写 right+1

```python
return prefix[right] - prefix[left]
```

闭区间右端也属于答案，应使用 `prefix[right+1]`。

### 坑 2：prefix 长度仍是 n

```python
prefix = [0] * len(nums)
```

长度 n+1 才能让空前缀和从 0 开始的查询统一处理。

### 坑 3：差分忘记关闭增量

```python
diff[left] += delta
```

还要在 `right+1` 减去 delta，否则增量会一直延续到数组末尾。

## 10. Python 补充

### `enumerate` 与半开切片

`enumerate(nums)` 同时提供下标和值。Python 切片 `nums[left:right+1]` 是半开区间，而本节题目使用闭区间；写公式前先明确区间定义。

```python
nums = [2, -1, 3, 5]
for index, value in enumerate(nums):
    print(index, value)

# 闭区间 [left, right] 对应切片：
part = nums[left:right + 1]
```

## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [303. 区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/)（简单）  
  构建 n+1 长度的前缀数组。

### 标准

- [724. 寻找数组的中心下标](https://leetcode.cn/problems/find-pivot-index/)（简单）  
  总和减左侧与当前值，得到右侧和。
- [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)（中等）  
  前缀和配合计数哈希表。

### 进阶

- [1109. 航班预订统计](https://leetcode.cn/problems/corporate-flight-bookings/)（中等）  
  每条预订是一次闭区间加值。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for index, value in enumerate(nums):
        prefix[index + 1] = prefix[index] + value
    return prefix


def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]


def apply_range_updates(length, updates):
    diff = [0] * (length + 1)
    for left, right, delta in updates:
        diff[left] += delta
        diff[right + 1] -= delta

    nums = [0] * length
    running = 0
    for index in range(length):
        running += diff[index]
        nums[index] = running
    return nums
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释 `prefix[i]` 表示前 i 个元素之和。
- [ ] 能独立写出闭区间求和公式。
- [ ] 能解释差分数组为什么只修改两个边界。
- [ ] 能区分查询多与修改多时该选哪个工具。
- [ ] 完成 303 和 1109。

## 下一节

完成这一课后，先回到学习地图复盘数组模块：双指针解决“如何移动”，滑动窗口解决“如何维护连续区间”，前缀和与差分解决“如何复用区间累计结果”。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-27-monotonic-queue/">← 27 单调队列</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <span class="series-nav__next series-nav__pending">28 扩展篇完成 ✓</span>
</nav>

本课是 27 节经典主线之后的原创扩展篇；练习题链接来自 LeetCode 中国站。本文讲解、代码组织与图解均为独立编写。
