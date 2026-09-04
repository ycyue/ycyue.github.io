---
title: 算法基础 04｜二分查找：用区间不变量消灭边界错误
date: 2026-09-04 10:00:00
permalink: 2026/09/04/algorithm-04-binary-search/
categories:
  - 算法
tags:
  - Python
  - 二分查找
  - LeetCode
  - 算法基础
description: 用红蓝染色和左闭右开区间理解 lower_bound，解释为什么每轮能安全丢弃一半。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-03-sliding-window/">← 03 滑动窗口</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-05-binary-search-advanced/">05 二分查找变形 →</a>
</nav>

二分查找最难的不是算 `mid`，而是回答：循环开始时，答案究竟被保证在哪个区间里？只要区间定义始终一致，`<`、`<=` 和返回值就不需要猜。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：升序数组 `nums` 和目标值 `target`。
- **输出**：第一个大于等于 target 的位置；若都小于 target，返回数组长度。
- **直接想法**：从左到右扫描，遇到第一个满足条件的位置就返回。
- **真正瓶颈**：扫描最多检查 n 个元素，没有利用条件在有序数组上只会从“不满足”变化一次到“满足”。

## 2. 从暴力解法开始

```python
def lower_bound_brute(nums, target):
    for index, value in enumerate(nums):
        if value >= target:
            return index
    return len(nums)
```

线性扫描时间为 O(n)。由于 `nums[i] >= target` 在升序数组上形成一段连续的 True，答案其实是 False 区与 True 区的分界线。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>把不满足条件的位置染成红色、满足条件的位置染成蓝色；二分寻找第一个蓝色位置。</strong></div>

使用左闭右开区间 `[left, right)`：`left` 是尚未确定的最左位置，`right` 可以等于 `len(nums)`，表示答案可能在数组末尾之后。每轮用 `mid` 的颜色决定保留左半还是右半。

<figure class="algorithm-figure">
  <img src="/images/algorithms/04-binary-search/process.svg" alt="二分查找执行过程图" loading="lazy">
  <figcaption>每轮区间都严格缩短，并且始终保留第一个蓝色位置。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么中点为蓝能丢右半

若 `nums[mid] >= target`，`mid` 已经是一个可行位置。我们寻找第一个可行位置，所以答案不可能在 `mid` 右边；但 `mid` 自己仍可能是答案，因此令 `right = mid`。

### 2. 为什么中点为红能丢左半

若 `nums[mid] < target`，升序性保证 `mid` 左侧都不大于它，也都小于 target。这一整段不可能成为答案，所以令 `left = mid + 1`。

### 3. 为什么返回 left

循环终止条件是 `left == right`，候选区间长度变为 0。根据不变量，`left` 左侧全不满足、`left` 及右侧满足或已越过数组，因此 `left` 正是分界点。

<figure class="algorithm-figure">
  <img src="/images/algorithms/04-binary-search/proof.svg" alt="二分查找正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def lower_bound(nums, target):
    left = 0
    right = len(nums)  # 搜索区间 [left, right)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] >= target:
            right = mid
        else:
            left = mid + 1

    return left
```

找“第一个大于 target”只需把判定改成 `nums[mid] > target`。找最后一个小于 target，可以用第一个大于等于 target 的位置减一。

## 6. 手工模拟一次

输入：`nums = [1, 3, 5, 7, 9, 11, 13], target = 8`

| 轮次 | 区间 | mid | nums[mid] | 更新 |
|---|---|---|---|---|
| 1 | [0,7) | 3 | 7 | left=4 |
| 2 | [4,7) | 5 | 11 | right=5 |
| 3 | [4,5) | 4 | 9 | right=4 |

最终 `left == right == 4`，下标 4 的值 9 是第一个大于等于 8 的元素。

## 7. 复杂度分析

- **时间复杂度：O(log n)**。每轮把候选区间至少缩小一半，长度 n 最多连续除以 2 约 log₂n 次。
- **空间复杂度：O(1)**。迭代写法只使用 left、right、mid。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>有序/单调判定 + 寻找第一个或最后一个满足位置 → 二分边界</strong></div>

- 数组已经排序。
- 判定结果随下标只改变一次。
- 题目问第一个、最后一个、至少、至多或插入位置。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：蓝色中点后写 `right = mid - 1`

```python
right = mid - 1
```

当前使用 `[left,right)`，`mid` 仍可能是答案，必须保留为 `right = mid`。

### 坑 2：红色中点后没有越过 mid

```python
left = mid
```

当只剩两个元素时可能死循环；已知 mid 不可行，应写 `mid + 1`。

### 坑 3：混用闭区间模板

先在注释写清 `[left,right)` 或 `[left,right]`，循环条件和更新必须配套。

## 10. Python 补充

### `//` 是向下取整除法

`(left + right) // 2` 得到整数下标。Python 整数不会溢出；在固定宽度整数语言中常写 `left + (right-left)//2`。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)（简单）  
  答案就是第一个 >= target 的位置。

### 标准

- [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)（中等）  
  分别求 >= target 和 > target 的边界。
- [2529. 正整数和负整数的最大计数](https://leetcode.cn/problems/maximum-count-of-positive-integer-and-negative-integer/)（简单）  
  两个边界分别切出负数段和正数段。

### 进阶

- [875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/)（中等）  
  速度越大，所需时间越少；对答案做二分。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def lower_bound(nums, target):
    left = 0
    right = len(nums)  # 搜索区间 [left, right)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] >= target:
            right = mid
        else:
            left = mid + 1

    return left
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能先写出搜索区间含义再写代码。
- [ ] 能证明两个分支为什么保留或排除 mid。
- [ ] 能独立写 lower_bound。
- [ ] 能由 lower_bound 推出上界。
- [ ] 完成 35 和 34。

## 下一节

下一节不再直接搜索排好序的值，而是给峰值、旋转数组和答案空间设计单调判定。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-03-sliding-window/">← 03 滑动窗口</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-05-binary-search-advanced/">05 二分查找变形 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 04》](https://www.bilibili.com/video/BV1AP41137w7/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
