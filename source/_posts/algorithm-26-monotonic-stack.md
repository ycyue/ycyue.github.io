---
title: 算法基础 26｜单调栈：及时淘汰不可能的候选
date: 2026-09-04 13:40:00
permalink: 2026/09/04/algorithm-26-monotonic-stack/
categories:
  - 算法
tags:
  - Python
  - 单调栈
  - LeetCode
  - 算法基础
description: 从每日温度图解单调栈，解释为什么弹出的下标得到第一个更大元素以及总复杂度为何是 O(n)。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-25-tree-dp-dominating-set/">← 25 树形 DP：最小支配集</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-27-monotonic-queue/">27 单调队列 →</a>
</nav>

对每一天向右扫描寻找第一个更高温度，会反复走过同一段。单调栈反过来处理：新温度到来时，帮助栈中所有更冷且尚未解决的日期结算答案。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：每天温度数组 temperatures。
- **输出**：每一天还要等几天才有更高温度，没有则 0。
- **直接想法**：从每个位置向右逐个找第一个更大值。
- **真正瓶颈**：递减数组中每个起点都扫描到末尾，最坏 O(n²)。

## 2. 从暴力解法开始

```python
def daily_temperatures_brute(temperatures):
    answer = [0] * len(temperatures)
    for i in range(len(temperatures)):
        for j in range(i + 1, len(temperatures)):
            if temperatures[j] > temperatures[i]:
                answer[i] = j - i
                break
    return answer
```

栈保存还没看到更高温度的下标。保持对应温度单调不增，新值更高时不断弹出并结算。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>栈内保存“仍等待第一个更大值”的下标，并保持对应值从栈底到栈顶单调不增。</strong></div>

遍历到 index 时，若当前温度大于栈顶，当前就是栈顶右侧遇到的第一个更大温度：更早位置都不够大，否则栈顶早已弹出。

<figure class="algorithm-figure">
  <img src="/images/algorithms/26-monotonic-stack/process.svg" alt="单调栈执行过程图" loading="lazy">
  <figcaption>栈不是保存所有历史，而是只保存还可能需要未来元素回答的候选。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么当前是第一个更大值

下标 j 从入栈到当前 i 之间一直未被弹出，说明中间没有任何温度大于 temperatures[j]。当前首次满足更大条件，因此距离 i-j 正确。

### 2. 为什么弹出后不再需要

题目只问第一个更大位置。答案一旦确定，后续即使更大也更远，不可能替换当前答案。

### 3. 嵌套 while 为什么 O(n)

一个下标最多入栈一次、弹出一次。某轮弹很多，是在结算以前积累的元素；全程弹出总次数不超过 n。

<figure class="algorithm-figure">
  <img src="/images/algorithms/26-monotonic-stack/proof.svg" alt="单调栈正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def daily_temperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []

    for index, temperature in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temperature:
            previous = stack.pop()
            answer[previous] = index - previous
        stack.append(index)

    return answer
```

严格“更高”使用 `<` 才弹；相等温度不能解决彼此。若题目问大于等于，比较符号才改成 `<=`。

## 6. 手工模拟一次

输入：`temperatures=[73,74,75,71,69,72,76,73]`

| 当前 | 入栈前 | 弹出并结算 | 入栈后 |
|---|---|---|---|
| 73@0 | [] | — | [0] |
| 74@1 | [0] | 0→1天 | [1] |
| 75@2 | [1] | 1→1天 | [2] |
| 72@5 | [2,3,4] | 4→1天，3→2天 | [2,5] |
| 76@6 | [2,5] | 5→1天，2→4天 | [6] |

未被弹出的下标右侧没有更高温度，答案保持 0。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个下标入栈一次、出栈至多一次。
- **空间复杂度：O(n)**。完全递减时所有下标都留在栈中。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>对每个位置找左/右第一个更大或更小 → 单调栈</strong></div>

- 下一个更大元素、每日温度。
- 柱状图左右第一个更矮边界。
- 新元素能一次淘汰一批旧候选。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：栈里只存值

```python
stack.append(temperature)
```

题目要求距离或位置，必须存下标。

### 坑 2：相等时错误弹出

```python
while stack and temperatures[stack[-1]] <= temperature:
```

每日温度要求严格更高，相等不能结算。

### 坑 3：误判 while 为 O(n²)

用每个元素入栈/出栈次数做摊还分析。

## 10. Python 补充

### 列表作为栈

Python 列表尾部 `append()` 与 `pop()` 都是均摊 O(1)。`stack[-1]` 查看栈顶但不删除。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)（中等）  
  单调不增下标栈。

### 标准

- [496. 下一个更大元素 I](https://leetcode.cn/problems/next-greater-element-i/)（简单）  
  新值弹栈时记录映射。
- [84. 柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/)（困难）  
  弹栈时确定高度的左右边界。

### 进阶

- [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)（困难）  
  弹出凹槽底，左右边界结算横向雨水。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def daily_temperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []

    for index, temperature in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temperature:
            previous = stack.pop()
            answer[previous] = index - previous
        stack.append(index)

    return answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能说出栈中元素代表什么。
- [ ] 能证明弹出时是第一个更大值。
- [ ] 能用摊还分析解释 O(n)。
- [ ] 能按严格/非严格选择比较符。
- [ ] 完成 739 和 84。

## 下一节

最后一节给单调结构加上队头过期规则，使它能维护滑动窗口中的最大值。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-25-tree-dp-dominating-set/">← 25 树形 DP：最小支配集</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-27-monotonic-queue/">27 单调队列 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 26》](https://www.bilibili.com/video/BV1VN411J7S7/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
