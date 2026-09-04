---
title: 算法基础 02｜相向双指针（二）：为什么移动短板
date: 2026-09-04 09:40:00
permalink: 2026/09/04/algorithm-02-two-pointers-container-rainwater/
categories:
  - 算法
tags:
  - Python
  - 双指针
  - LeetCode
  - 算法基础
description: 从盛最多水的容器和接雨水出发，图解为什么双指针必须移动短板，以及何时能确定一侧水量。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-01-two-pointers/">← 01 相向双指针（一）</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-03-sliding-window/">03 滑动窗口 →</a>
</nav>

两根柱子围成的容器，面积由“宽度 × 短板高度”决定。指针向内移动后宽度必然变小，怎样移动才仍有机会得到更大面积？

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一组非负柱高，例如 `[1,8,6,2,5,4,8,3,7]`。
- **输出**：两根柱子能围成的最大面积；进阶问题是所有位置能接到的雨水总量。
- **直接想法**：枚举所有左右边界，计算每个容器；接雨水则对每个位置向两边找最高柱。
- **真正瓶颈**：容器有 O(n²) 个边界对；逐点扫描左右最高值也会重复走相同区间。

## 2. 从暴力解法开始

```python
def max_area_brute(height):
    answer = 0
    for left in range(len(height)):
        for right in range(left + 1, len(height)):
            area = (right - left) * min(height[left], height[right])
            answer = max(answer, area)
    return answer
```

双层循环枚举每一对边界，时间复杂度是 O(n²)。它清楚展示了面积只由宽度和较矮边界决定，这正是优化的突破口。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>宽度变小不可避免，所以只移动短板：保留长板，才可能用更高的新短板抵消宽度损失。</strong></div>

如果左柱更矮，移动右侧长板后，宽度变小且短板仍不高于左柱，面积一定不会增加；因此所有以当前左柱为边界的更窄容器都可排除。接雨水也用类似思想：较小的左侧最高值已经足以确定左端水量。

<figure class="algorithm-figure">
  <img src="/images/algorithms/02-two-pointers-container-rainwater/process.svg" alt="容器与接雨水执行过程图" loading="lazy">
  <figcaption>每轮比较的不是“哪边更好看”，而是哪一边已经成为上限。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 左边是短板时

设 `height[left] <= height[right]`。固定 `left`，把右端换成任何更靠左的位置 `j`，新宽度更小，而有效高度 `min(height[left], height[j])` 不会超过 `height[left]`，所以面积不可能超过当前值。当前 `left` 可以整体淘汰。

### 2. 两边等高时

两侧都形成同一个高度上限。移动任意一侧都不会漏掉比当前更大的容器；代码选择移动右侧只是统一写法。

### 3. 接雨水为什么看较小的最高值

若 `left_max <= right_max`，左端右边至少存在一根高达 `right_max` 的柱子。左端水面只能由较小的 `left_max` 限制，因此此刻水量 `left_max - height[left]` 已经确定，无需知道右侧最高柱的精确位置。

<figure class="algorithm-figure">
  <img src="/images/algorithms/02-two-pointers-container-rainwater/proof.svg" alt="容器与接雨水正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def max_area(height):
    left = 0
    right = len(height) - 1
    answer = 0

    while left < right:
        width = right - left
        answer = max(answer, width * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return answer


def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0

    while left <= right:
        left_max = max(left_max, height[left])
        right_max = max(right_max, height[right])
        if left_max <= right_max:
            water += left_max - height[left]
            left += 1
        else:
            water += right_max - height[right]
            right -= 1
    return water
```

`max_area` 比较当前柱高；`trap` 比较的是两侧已经见过的最高柱。两个问题形式相似，但不要混用判断量。

## 6. 手工模拟一次

输入：`height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`

| 轮次 | left/right | 短板 | 面积 | 移动 |
|---|---|---|---|---|
| 1 | 0 / 8 | 1 | 8 | left++ |
| 2 | 1 / 8 | 7 | 49 | right-- |
| 3 | 1 / 7 | 3 | 18 | right-- |
| 4 | 1 / 6 | 8 | 40 | right-- |

第二轮得到面积 49。之后即使出现等高柱，剩余宽度也不足以超过 49。

## 7. 复杂度分析

- **时间复杂度：O(n)**。左右指针只向中间走，每个位置最多成为一次边界。
- **空间复杂度：O(1)**。只维护指针、最大高度和答案等固定数量变量。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>两端边界 + 宽度随收缩变小 + 短板决定上限 → 移动短板</strong></div>

- 从两端选择边界形成容器或区间。
- 目标由较弱的一侧限制。
- 移动一端后可以证明旧边界再也不可能产生更优答案。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：总是移动较高的一边

```python
if height[left] < height[right]:
    right -= 1
```

这会保留真正的瓶颈，宽度却不断减小。应淘汰较矮边界。

### 坑 2：接雨水直接比较当前柱

`trap` 需要比较 `left_max` 和 `right_max`，因为水面由两侧历史最高柱决定。

### 坑 3：空数组访问下标

模板中 `trap` 对空数组会让 `right=-1` 且循环不进入，因此安全；修改循环前仍要重新检查空输入。

## 10. Python 补充

### `min()` 与 `max()` 表达边界

`min(a, b)` 表示容器短板，`max(old, new)` 表示把当前结果纳入历史最优。把这两个角色分清，代码会更接近推导。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)（中等）  
  先写面积公式，再证明移动长板不可能改进。

### 标准

- [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)（困难）  
  维护左右最高值；较小的一侧可以立刻结算。
- [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)（简单）  
  左右向中间移动，先跳过非字母数字字符。

### 进阶

- [1616. 分割两个字符串得到回文串](https://leetcode.cn/problems/split-two-strings-to-make-palindrome/)（中等）  
  从两端匹配两个字符串，第一次失败后检查剩余段。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def max_area(height):
    left = 0
    right = len(height) - 1
    answer = 0

    while left < right:
        width = right - left
        answer = max(answer, width * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return answer


def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0

    while left <= right:
        left_max = max(left_max, height[left])
        right_max = max(right_max, height[right])
        if left_max <= right_max:
            water += left_max - height[left]
            left += 1
        else:
            water += right_max - height[right]
            right -= 1
    return water
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能用“宽度必减、短板限高”证明移动规则。
- [ ] 能独立写出 `max_area`。
- [ ] 能区分当前柱高与两侧最高值。
- [ ] 能手算接雨水一轮的结算过程。
- [ ] 完成 11 和 42。

## 下一节

下一节把两个边界改造成可伸缩的连续窗口：右端负责加入元素，左端负责恢复窗口条件。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-01-two-pointers/">← 01 相向双指针（一）</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-03-sliding-window/">03 滑动窗口 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 02》](https://www.bilibili.com/video/BV1Qg411q7ia/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
