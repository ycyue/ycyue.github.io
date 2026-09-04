---
title: 算法基础 03｜滑动窗口：让连续区间只进出一次
date: 2026-09-04 09:50:00
permalink: 2026/09/04/algorithm-03-sliding-window/
categories:
  - 算法
tags:
  - Python
  - 滑动窗口
  - LeetCode
  - 算法基础
description: 从最短子数组和最长无重复子串出发，图解滑动窗口的加入、移出、更新答案时机。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-02-two-pointers-container-rainwater/">← 02 容器与接雨水</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-04-binary-search/">04 二分查找 →</a>
</nav>

题目要求“连续子数组”或“连续子串”时，暴力枚举每个区间会反复统计相同元素。滑动窗口让元素从右侧进入、从左侧离开，每个元素只处理有限次。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：正整数数组 `nums` 和目标 `target`。
- **输出**：元素和至少为 target 的最短连续子数组长度。
- **直接想法**：枚举左端和右端，再计算区间和。
- **真正瓶颈**：同一段元素被许多重叠区间重复求和；三层写法可到 O(n³)，维护区间和后仍有 O(n²) 个区间。

## 2. 从暴力解法开始

```python
def min_subarray_len_brute(target, nums):
    answer = len(nums) + 1
    for left in range(len(nums)):
        total = 0
        for right in range(left, len(nums)):
            total += nums[right]
            if total >= target:
                answer = min(answer, right - left + 1)
                break
    return 0 if answer == len(nums) + 1 else answer
```

利用正数条件，一旦当前起点达到 target 就可以停止扩展，但每换一个 `left` 仍要重新累加，最坏时间是 O(n²)。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>right 扩大窗口获得新信息；条件满足后，left 尽量收缩并在正确时机更新答案。</strong></div>

窗口不是固定模板，而是一段始终维护特定语义的连续区间。这里窗口 `[left, right]` 的 `total` 必须等于其中所有元素之和。正数保证左端移出元素后总和只会减小，窗口条件具有单调性。

<figure class="algorithm-figure">
  <img src="/images/algorithms/03-sliding-window/process.svg" alt="滑动窗口执行过程图" loading="lazy">
  <figcaption>窗口扩大是主动探索，窗口收缩是恢复或压紧条件；两种动作各有职责。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么能持续收缩

数组元素全为正数。当前和已达到 target 时，若还想缩短长度，只可能删除左端元素；删除后总和只会下降。当条件第一次不再成立时，上一个窗口就是当前 `right` 下能得到的最短可行窗口。

### 2. 为什么不会漏掉更短答案

右端从左到右枚举了每个可能的终点；对每个终点，`while` 又把左端推进到不能再推进的位置，因此所有可能成为全局最短答案的“最紧窗口”都会被检查。

### 3. 负数为什么破坏模板

有负数时，扩大窗口可能让和变小，收缩窗口也可能让和变大，`total >= target` 不再能单调决定 `left` 的移动。此时要考虑前缀和、单调队列等方法。

<figure class="algorithm-figure">
  <img src="/images/algorithms/03-sliding-window/proof.svg" alt="滑动窗口正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def min_subarray_len(target, nums):
    left = 0
    total = 0
    answer = len(nums) + 1

    for right, value in enumerate(nums):
        total += value

        while total >= target:
            answer = min(answer, right - left + 1)
            total -= nums[left]
            left += 1

    return 0 if answer == len(nums) + 1 else answer
```

求最短长度时，在窗口仍然可行的 `while` 内更新；求最长无重复子串时，先收缩到重新合法，再在循环外更新长度。

## 6. 手工模拟一次

输入：`target = 7, nums = [2, 3, 1, 2, 4, 3]`

| right | 加入 | 窗口和 | 收缩结果 | 最短长度 |
|---|---|---|---|---|
| 0 | 2 | 2 | [0,0] | ∞ |
| 3 | 2 | 8 | 移出 2，窗口 [1,3] | 4 |
| 4 | 4 | 10 | 连续移出 3、1，窗口 [3,4] | 2 |
| 5 | 3 | 9 | 收缩到 [4,5] 后再到 [5,5] | 2 |

窗口 `[4,3]` 长度为 2，已经达到最短答案；每次缩左前都先记录合法窗口。

## 7. 复杂度分析

- **时间复杂度：O(n)**。`right` 遍历 n 次，`left` 总共也只会从 0 走到 n；嵌套 `while` 不代表 O(n²)。
- **空间复杂度：O(1)**。求区间和只保存几个整数；若维护字符计数，空间取决于不同字符数。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>连续区间 + 元素可从两端加入/移出 + 条件具有单调性 → 滑动窗口</strong></div>

- 连续子数组或连续子串。
- 最长、最短或满足条件的区间数量。
- 右端加入新元素后，移动左端可以恢复条件。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：把 `if` 写成一次收缩

```python
if total >= target:
    left += 1
```

一个右端可能对应多次收缩，求最短时必须用 `while`。

### 坑 2：先移出再更新答案

窗口合法时先记录 `right-left+1`，再移出左端；否则会记录一个尚未验证的窗口。

### 坑 3：忽略正数前提

最短和模板依赖所有数为正；存在负数时不能沿用同一证明。

## 10. Python 补充

### `enumerate()` 同时得到下标和值

`for right, value in enumerate(nums)` 同时获得当前位置和元素，避免再写 `value = nums[right]`。

```python
for index, value in enumerate([10, 20]):
    print(index, value)  # 0 10，然后 1 20
```

## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)（中等）  
  正数和至少为 target；合法时持续缩左。
- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)（中等）  
  用集合或计数表维护窗口内字符。

### 标准

- [713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/)（中等）  
  每个合法右端可贡献 right-left+1 个子数组。
- [1004. 最大连续 1 的个数 III](https://leetcode.cn/problems/max-consecutive-ones-iii/)（中等）  
  窗口中最多允许 k 个 0。

### 进阶

- [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)（困难）  
  维护缺失字符种类，合法后压缩左端。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def min_subarray_len(target, nums):
    left = 0
    total = 0
    answer = len(nums) + 1

    for right, value in enumerate(nums):
        total += value

        while total >= target:
            answer = min(answer, right - left + 1)
            total -= nums[left]
            left += 1

    return 0 if answer == len(nums) + 1 else answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能说清 `left`、`right` 和窗口状态各自含义。
- [ ] 能解释嵌套 while 为什么仍是 O(n)。
- [ ] 能区分最长题和最短题的答案更新时机。
- [ ] 能识别负数对单调性的破坏。
- [ ] 完成 209 和 3。

## 下一节

下一节把“逐步收缩”升级成“每次直接丢掉一半”：二分查找的关键是先定义搜索区间的不变量。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-02-two-pointers-container-rainwater/">← 02 容器与接雨水</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-04-binary-search/">04 二分查找 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 03》](https://www.bilibili.com/video/BV1hd4y1r7Gq/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
