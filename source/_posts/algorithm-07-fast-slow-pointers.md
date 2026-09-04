---
title: 算法基础 07｜链表快慢指针：中点、判环与环入口
date: 2026-09-04 10:30:00
permalink: 2026/09/04/algorithm-07-fast-slow-pointers/
categories:
  - 算法
tags:
  - Python
  - 链表
  - LeetCode
  - 算法基础
description: 图解快慢指针的速度差，推导为什么有环必相遇以及如何找到环入口。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-06-reverse-linked-list/">← 06 反转链表</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-08-linked-list-deletion/">08 链表删除与前后指针 →</a>
</nav>

链表不能直接知道长度，也不能从尾部往回走。但两个从头出发、速度不同的指针，能把“长度关系”编码进它们的相对位置。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一条可能含环的单链表。
- **输出**：判断是否有环；进一步返回环的入口节点。
- **直接想法**：用集合记录访问过的节点，第一次重复即说明有环。
- **真正瓶颈**：集合需要 O(n) 额外空间；如果只允许常数空间，就要利用速度差。

## 2. 从暴力解法开始

```python
def has_cycle_with_set(head):
    seen = set()
    while head is not None:
        if head in seen:
            return True
        seen.add(head)
        head = head.next
    return False
```

时间是 O(n)，空间也是 O(n)。快慢指针保留线性时间，同时把额外空间降为 O(1)。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>slow 每次走一步，fast 每次走两步；无环时 fast 先到终点，有环时 fast 每轮追近 slow 一步。</strong></div>

进入环后，把位置看成对环长取模。fast 相对 slow 的速度是 1，因此二者之间的环上距离每轮减少 1，有限步内必然变成 0。

<figure class="algorithm-figure">
  <img src="/images/algorithms/07-fast-slow-pointers/process.svg" alt="快慢指针执行过程图" loading="lazy">
  <figcaption>速度差负责制造相遇；相遇后的路程等式负责定位入口。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么有环一定相遇

slow 进入环后，fast 已在环中。以 slow 为参照，fast 每轮净前进一个节点。环只有有限个位置，所以相对距离必然经过 0。

### 2. 为什么能找到入口

设头到入口距离为 `a`，入口到相遇点为 `b`，环剩余距离为 `c`。相遇时慢指针走 `a+b`，快指针走 `2(a+b)`，且快指针多走整圈：`a+b = k(b+c)`。整理得 `a = (k-1)(b+c)+c`，所以一个指针从头、另一个从相遇点每次各走一步，会在入口相遇。

### 3. 中点为什么是 slow

fast 每走两步，slow 走一步。当 fast 到尾部时，slow 恰好走了总长度的一半。偶数长度时循环条件的选择决定返回两个中点中的哪一个。

<figure class="algorithm-figure">
  <img src="/images/algorithms/07-fast-slow-pointers/proof.svg" alt="快慢指针正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def has_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


def detect_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            seeker = head
            while seeker is not slow:
                seeker = seeker.next
                slow = slow.next
            return seeker
    return None
```

判断节点相同要用对象身份 `is`，不是比较 `val`；链表中不同节点完全可以存相同值。

## 6. 手工模拟一次

输入：`3 → 2 → 0 → -4，再由 -4 指回 2`

| 轮次 | slow | fast | 结果 |
|---|---|---|---|
| 开始 | 3 | 3 | 继续 |
| 1 | 2 | 0 | 未相遇 |
| 2 | 0 | 2 | 未相遇 |
| 3 | -4 | -4 | 环内相遇 |
| 找入口 | 从 3 与 -4 同速走 | 在 2 相遇 | 入口=2 |

相遇只能证明有环；再从头同步走一次，才得到入口。

## 7. 复杂度分析

- **时间复杂度：O(n)**。无环最多走到尾；有环时进入环和追上都不超过线性步数。
- **空间复杂度：O(1)**。始终只保存固定数量的节点引用。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>单链表 + 长度关系/环 + 不能用额外集合 → 快慢指针</strong></div>

- 找中点或倒数位置。
- 判断环、找环入口或重复状态。
- 两个过程速度不同会产生可利用的路程关系。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：循环条件少检查一层

```python
while fast is not None:
    fast = fast.next.next
```

`fast.next` 可能为 None，访问 `.next` 会报错。

### 坑 2：比较节点值

```python
if slow.val == fast.val:
```

值相同不代表同一节点；使用 `slow is fast`。

### 坑 3：相遇后直接返回相遇点

相遇点通常不是入口；需要从 head 再启动 seeker。

## 10. Python 补充

### `is` 与 `==`

`is` 判断是否为同一个对象，`==` 判断值是否相等。链表判环关心节点身份，必须使用 `is`。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)（简单）  
  快走二、慢走一。

### 标准

- [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)（简单）  
  相遇即有环。
- [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)（中等）  
  推导 a、b、c 路程关系。

### 进阶

- [143. 重排链表](https://leetcode.cn/problems/reorder-list/)（中等）  
  找中点、反转后半段、交替合并。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def has_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


def detect_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            seeker = head
            while seeker is not slow:
                seeker = seeker.next
                slow = slow.next
            return seeker
    return None
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释速度差为什么保证环内相遇。
- [ ] 能推导环入口等式。
- [ ] 能写安全循环条件。
- [ ] 能区分节点身份和值。
- [ ] 完成 876、141、142。

## 下一节

下一节让两个指针保持固定间距，再配合哨兵节点统一删除头节点和普通节点。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-06-reverse-linked-list/">← 06 反转链表</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-08-linked-list-deletion/">08 链表删除与前后指针 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 07》](https://www.bilibili.com/video/BV1KG4y1G7cu/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
