---
title: 算法基础 27｜单调队列：同时淘汰过期与劣势候选
date: 2026-09-04 13:50:00
permalink: 2026/09/04/algorithm-27-monotonic-queue/
categories:
  - 算法
tags:
  - Python
  - 单调队列
  - LeetCode
  - 算法基础
description: 图解滑动窗口最大值的单调队列，解释队头过期、队尾淘汰及每个元素只进出一次。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-26-monotonic-stack/">← 26 单调栈</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <span class="series-nav__next series-nav__pending">27 节主线完成 ✓</span>
</nav>

滑动窗口每移动一步，都要删除最左元素、加入最右元素并询问最大值。普通队列能处理进出，却不能 O(1) 找最大；堆能找最大，但删除过期元素较绕。单调队列同时维护有效期和竞争力。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：数组 nums 与固定窗口宽度 k。
- **输出**：每个长度 k 窗口的最大值。
- **直接想法**：枚举每个窗口并调用 max。
- **真正瓶颈**：共有 O(n) 个窗口，每次 max 扫描 k 个元素，总时间 O(nk)。

## 2. 从暴力解法开始

```python
def max_sliding_window_brute(nums, k):
    return [max(nums[left:left + k])
            for left in range(len(nums) - k + 1)]
```

相邻窗口高度重叠，却重新比较几乎全部元素。单调队列只保存仍在窗口内、且可能成为未来最大值的下标。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>队头删除过期下标；队尾删除不大于新值的劣势候选；队头始终是当前窗口最大值下标。</strong></div>

若新值大于等于队尾旧值，新值更大且更晚过期，旧值在任何未来共同窗口中都不可能胜出，因此可永久淘汰。队列对应值保持严格递减。

<figure class="algorithm-figure">
  <img src="/images/algorithms/27-monotonic-queue/process.svg" alt="单调队列执行过程图" loading="lazy">
  <figcaption>队头管“是否过期”，队尾管“是否还值得保留”，两端职责不同。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么能从队尾淘汰

设旧下标 j<当前 i 且 nums[j]<=nums[i]。只要 j 仍在某个未来窗口，i 也一定在，因为 i 更晚；同时 i 的值不小于 j。所以 j 永远不可能成为最大值。

### 2. 为什么队头就是最大

所有保留下标按值严格递减，队头值最大；又因为过期下标已被删除，队头属于当前窗口。

### 3. 为什么仍是 O(n)

每个下标只 append 一次。它之后要么因被更强新值支配从队尾弹出，要么因过期从队头弹出，不会重复进入。

<figure class="algorithm-figure">
  <img src="/images/algorithms/27-monotonic-queue/proof.svg" alt="单调队列正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
from collections import deque

def max_sliding_window(nums, k):
    if not nums or k <= 0:
        return []

    queue = deque()  # 保存下标，对应值严格递减
    answer = []

    for index, value in enumerate(nums):
        left = index - k + 1
        if queue and queue[0] < left:
            queue.popleft()

        while queue and nums[queue[-1]] <= value:
            queue.pop()
        queue.append(index)

        if left >= 0:
            answer.append(nums[queue[0]])

    return answer
```

存下标才能判断过期。使用 `<=` 弹出相等旧值，保留更晚下标；保留相等值也能正确，但队列更长、规则不同。

## 6. 手工模拟一次

输入：`nums=[1,3,-1,-3,5,3,6,7], k=3`

| index/value | 过期 | 队尾弹出 | 队列值 | 窗口最大 |
|---|---|---|---|---|
| 0/1 | 无 | 无 | [1] | 未形成 |
| 1/3 | 无 | 弹1 | [3] | 未形成 |
| 2/-1 | 无 | 无 | [3,-1] | 3 |
| 3/-3 | 无 | 无 | [3,-1,-3] | 3 |
| 4/5 | 3过期前也被支配 | 弹-3,-1 | [5] | 5 |
| 6/6 | 无 | 弹3,5 | [6] | 6 |

输出 `[3,3,5,5,6,7]`；队列中不必保留窗口全部元素。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个下标入队一次，并从队头或队尾离开至多一次。
- **空间复杂度：O(k)**。队列只保存当前窗口候选，下标数量不超过 k。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>固定/变化窗口 + 反复查询最大最小 + 窗口滑动 → 单调队列</strong></div>

- 滑动窗口最大值/最小值。
- 元素会过期，同时较弱候选可提前淘汰。
- 需要把每次查询从 O(k) 降到均摊 O(1)。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：队列存值

```python
queue.append(value)
```

无法知道队头何时离开窗口；必须存下标。

### 坑 2：过期边界写错

```python
if queue[0] <= left:
    queue.popleft()
```

当前窗口左端就是 left，只有下标 `< left` 才过期。

### 坑 3：先输出再清理

必须先删除过期和维护单调性，再读取队头。

## 10. Python 补充

### `deque` 的两端操作

`popleft()` 删除过期队头，`pop()` 删除劣势队尾，`append()` 加入新下标；三者都是 O(1)。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)（困难）  
  下标递增、值递减的 deque。

### 标准

- [1438. 绝对差不超过限制的最长连续子数组](https://leetcode.cn/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)（中等）  
  同时维护最大与最小两个单调队列。
- [1696. 跳跃游戏 VI](https://leetcode.cn/problems/jump-game-vi/)（中等）  
  维护最近 k 个 dp 值最大值。

### 进阶

- [862. 和至少为 K 的最短子数组](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/)（困难）  
  对前缀和维护单调队列。

<details>
<summary>检查答案：本节核心实现</summary>

```python
from collections import deque

def max_sliding_window(nums, k):
    if not nums or k <= 0:
        return []

    queue = deque()  # 保存下标，对应值严格递减
    answer = []

    for index, value in enumerate(nums):
        left = index - k + 1
        if queue and queue[0] < left:
            queue.popleft()

        while queue and nums[queue[-1]] <= value:
            queue.pop()
        queue.append(index)

        if left >= 0:
            answer.append(nums[queue[0]])

    return answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能区分队头过期与队尾支配。
- [ ] 能证明更晚且更大者支配旧值。
- [ ] 能写窗口形成条件。
- [ ] 能用入队出队次数分析 O(n)。
- [ ] 完成 239 和 1438。

## 下一节

27 节主线到这里结束。回到学习地图按模块复盘，并优先重做每篇的两道入门/标准题。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-26-monotonic-stack/">← 26 单调栈</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <span class="series-nav__next series-nav__pending">27 节主线完成 ✓</span>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 27》](https://www.bilibili.com/video/BV1bM411X72E/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
