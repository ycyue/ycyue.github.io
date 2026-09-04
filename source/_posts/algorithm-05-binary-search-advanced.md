---
title: 算法基础 05｜二分查找变形：自己设计单调判定
date: 2026-09-04 10:10:00
permalink: 2026/09/04/algorithm-05-binary-search-advanced/
categories:
  - 算法
tags:
  - Python
  - 二分查找
  - LeetCode
  - 算法基础
description: 通过寻找峰值和旋转数组最小值，学习在非整体有序数组中设计二分判定。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-04-binary-search/">← 04 二分查找</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-06-reverse-linked-list/">06 反转链表 →</a>
</nav>

很多二分题没有直接给出“升序数组”。真正可二分的是一个单调的真假判定：只要能把候选划分成两块，并证明答案所在的一块，就能丢掉另一半。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：先严格递增后严格递减的数组，或由升序数组旋转得到的数组。
- **输出**：峰值下标，或旋转数组中的最小值。
- **直接想法**：线性扫描相邻元素或整段最小值。
- **真正瓶颈**：O(n) 扫描没有利用局部斜率或旋转点两侧的结构。

## 2. 从暴力解法开始

```python
def find_peak_brute(nums):
    for i in range(len(nums) - 1):
        if nums[i] > nums[i + 1]:
            return i
    return len(nums) - 1
```

线性法正确但最坏检查 n 个位置。峰值题可把 `nums[mid] < nums[mid+1]` 视为“仍在上坡”，把另一种情况视为“峰值在左边或就是 mid”。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>二分的对象不是数组本身，而是你设计出的、沿搜索方向只改变一次的判定。</strong></div>

寻找峰值时比较 `mid` 与 `mid+1`，判断当前位于上坡还是下坡；寻找旋转数组最小值时比较 `mid` 与最右值，判断 `mid` 属于最小值左边的“大数段”还是右边的“小数段”。

<figure class="algorithm-figure">
  <img src="/images/algorithms/05-binary-search-advanced/process.svg" alt="二分查找变形执行过程图" loading="lazy">
  <figcaption>先为每个位置定义“颜色”，再复用二分边界；不要先写模板再猜条件。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 峰值为何能看斜率

若 `nums[mid] < nums[mid+1]`，从 mid 到 mid+1 正在上升。右侧最终要么继续上升到末端，要么某处转为下降，两种情况都保证右侧存在峰值，所以可令 `left=mid+1`。否则 mid 已在下降侧或就是峰值，令 `right=mid`。

### 2. 旋转数组为何与末尾比较

无重复元素时，最小值右侧到末尾是小数段。若 `nums[mid] < nums[right]`，mid 和 right 位于同一递增段，最小值不会在 mid 右侧，保留 mid；否则 mid 位于大数段，最小值严格在右侧。

### 3. 重复元素带来的困难

若允许 `nums[mid] == nums[right]`，无法判断 mid 在哪一段，只能令 `right -= 1` 排除一个重复值。最坏情况下每次只缩一格，复杂度退化到 O(n)。

<figure class="algorithm-figure">
  <img src="/images/algorithms/05-binary-search-advanced/proof.svg" alt="二分查找变形正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def find_peak(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left


def find_min_rotated(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[right]:
            right = mid
        else:
            left = mid + 1
    return nums[left]
```

两段代码都用闭区间中的单点收敛形式。峰值模板访问 `mid+1` 仍安全，因为 `left < right` 保证 `mid < right`。

## 6. 手工模拟一次

输入：`nums = [4, 5, 6, 7, 0, 1, 2]`

| 轮次 | left/mid/right | 比较 | 结论 | 新区间 |
|---|---|---|---|---|
| 1 | 0/3/6 | 7 > 2 | mid 在大数段 | [4,6] |
| 2 | 4/5/6 | 1 < 2 | 最小值不在 mid 右侧 | [4,5] |
| 3 | 4/4/5 | 0 < 1 | 保留 mid | [4,4] |

区间收敛到下标 4，最小值为 0。

## 7. 复杂度分析

- **时间复杂度：O(log n)**。无重复元素时每轮保留至多一半区间。
- **空间复杂度：O(1)**。只保存边界与中点。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>非整体有序 + 能按局部特征分成两类 + 目标是分界点 → 设计判定后二分</strong></div>

- 峰值、谷值或旋转点。
- 答案越大越容易/越难满足某条件。
- 可以回答“mid 位于目标左边还是右边”。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：峰值访问越界

```python
mid = (left + right + 1) // 2
if nums[mid] < nums[mid + 1]:
```

使用向下取整的 mid，才能保证循环内 `mid+1 <= right`。

### 坑 2：旋转数组与固定末尾比较

模板每轮比较当前 `right`，不要随意改成初始末尾；区间含义变化后证明也会变化。

### 坑 3：忽略重复值

无重复模板遇到相等无法确定方向；先确认题目是否保证互不相同。

## 10. Python 补充

### 布尔判定也可以写成函数

答案二分时可把条件封装为 `check(value)`。主循环只关心 False/True 分界，具体计算留在函数内，便于测试。

```python
def check(speed):
    return required_hours(speed) <= limit
```

## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [162. 寻找峰值](https://leetcode.cn/problems/find-peak-element/)（中等）  
  比较 mid 和 mid+1 的斜率。

### 标准

- [153. 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)（中等）  
  与当前右端比较判断所在段。
- [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)（中等）  
  每轮先判断哪一半有序，再判断 target 是否落入。

### 进阶

- [154. 寻找旋转排序数组中的最小值 II](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array-ii/)（困难）  
  相等时只能安全缩掉一个右端。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def find_peak(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left


def find_min_rotated(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[right]:
            right = mid
        else:
            left = mid + 1
    return nums[left]
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能把局部比较解释成颜色判定。
- [ ] 能证明峰值向哪侧存在。
- [ ] 能写出旋转数组最小值模板。
- [ ] 知道重复值为何导致退化。
- [ ] 完成 162 和 153。

## 下一节

数组下标可以随机访问，链表却只能沿 next 前进。下一节先画清引用，再完成最基础的反转。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-04-binary-search/">← 04 二分查找</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-06-reverse-linked-list/">06 反转链表 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 05》](https://www.bilibili.com/video/BV1QK411d76w/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
