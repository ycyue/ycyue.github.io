---
title: 算法基础 06｜反转链表：先保存后继，再改变指向
date: 2026-09-04 10:20:00
permalink: 2026/09/04/algorithm-06-reverse-linked-list/
categories:
  - 算法
tags:
  - Python
  - 链表
  - LeetCode
  - 算法基础
description: 用三指针图解链表反转，解释为什么必须先保存 next，并扩展到局部与分组反转。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-05-binary-search-advanced/">← 05 二分查找变形</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-07-fast-slow-pointers/">07 快慢指针 →</a>
</nav>

链表没有数组下标。变量保存的是节点引用，改变 `node.next` 就会改变整条链的连接关系。反转时最危险的不是写错循环，而是还没保存后继就把剩余链表弄丢。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：单链表 `1 → 2 → 3 → None` 的头节点。
- **输出**：反转后的头节点 `3 → 2 → 1 → None`。
- **直接想法**：把所有值放入列表，再倒序创建一条新链表。
- **真正瓶颈**：需要 O(n) 额外空间，而且创建了新节点，没有真正修改原链表的指向。

## 2. 从暴力解法开始

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_with_array(head):
    values = []
    while head:
        values.append(head.val)
        head = head.next
    new_head = None
    for value in values:
        new_head = ListNode(value, new_head)
    return new_head
```

遍历和重建都是 O(n)，但列表与新节点都占用 O(n) 空间。原地反转只需要三个引用。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>每轮先保存 cur.next，再让 cur.next 指向 prev，最后让 prev 和 cur 同步向前。</strong></div>

`prev` 始终指向已经反转好的前缀，`cur` 指向尚未处理部分的第一个节点。保存 `next_node` 是为了在修改 `cur.next` 后仍能找到剩余链表。

<figure class="algorithm-figure">
  <img src="/images/algorithms/06-reverse-linked-list/process.svg" alt="反转链表执行过程图" loading="lazy">
  <figcaption>顺序不能交换：保存后继是改变箭头之前的保险绳。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么不丢节点

执行 `cur.next = prev` 后，原来从 cur 指向后继的箭头被覆盖。如果此前已保存 `next_node = cur.next`，剩余链仍可从 `next_node` 到达。

### 2. 为什么 prev 最终是新头

每轮把未处理后缀的第一个节点搬到已反转前缀前面。处理完最后一个节点时，`prev` 指向原链表尾节点，它现在位于整条反转链的开头。

### 3. 递归版本在做什么

递归先反转 `head.next` 开始的后缀，再执行 `head.next.next = head` 把当前节点接到后缀末尾，并把 `head.next` 断开。它与迭代版维护的是同一个连接关系，只是使用调用栈保存现场。

<figure class="algorithm-figure">
  <img src="/images/algorithms/06-reverse-linked-list/proof.svg" alt="反转链表正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    prev = None
    cur = head

    while cur is not None:
        next_node = cur.next
        cur.next = prev
        prev = cur
        cur = next_node

    return prev
```

变量名写成 `next_node`，不要覆盖 Python 内置函数 `next()`。画出三个引用后再写四行更新，比背缩写可靠。

## 6. 手工模拟一次

输入：`1 → 2 → 3 → None`

| 轮次 | prev | cur | 保存 next | 反转后 |
|---|---|---|---|---|
| 开始 | None | 1 | — | — |
| 1 | 1 | 2 | 2 | None ← 1 |
| 2 | 2 | 3 | 3 | None ← 1 ← 2 |
| 3 | 3 | None | None | None ← 1 ← 2 ← 3 |

`cur` 走到 None 时结束，`prev` 指向节点 3，因此返回 prev。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个节点只访问并改写一次 next。
- **空间复杂度：O(1)**。迭代版只维护三个节点引用；没有按输入规模增长的容器。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>链表方向改变 + 必须保留剩余链入口 → prev / cur / next 三指针</strong></div>

- 反转整条、局部或每 k 个节点。
- 需要改变 next，而不是只倒序输出值。
- 操作后仍要能访问尚未处理的节点。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：先改指向再保存后继

```python
cur.next = prev
cur = cur.next
```

此时 `cur.next` 已指回前缀，剩余链丢失。先保存 `next_node`。

### 坑 2：返回 head

```python
return head
```

循环结束后原 head 已成为尾节点，新头是 prev。

### 坑 3：忘记局部反转后的两端连接

反转 `[left,right]` 后，原区间头变成尾，要接后半段；区间前驱要接新头。

## 10. Python 补充

### `is not None` 表达节点存在

`while cur is not None` 明确检查引用。节点对象通常都为真，`while cur` 也可用，但显式写法更适合初学阶段。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)（简单）  
  画 prev、cur、next_node 三个引用。

### 标准

- [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)（中等）  
  增加哨兵节点，先找到反转区间前驱。

### 进阶

- [25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)（困难）  
  每组先确认有 k 个节点，再反转并连接。
- [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)（中等）  
  它是 k=2 的特殊情况。

<details>
<summary>检查答案：本节核心实现</summary>

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    prev = None
    cur = head

    while cur is not None:
        next_node = cur.next
        cur.next = prev
        prev = cur
        cur = next_node

    return prev
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释变量保存的是引用而非节点副本。
- [ ] 能画出一轮箭头变化。
- [ ] 能按正确顺序写四行更新。
- [ ] 能解释返回 prev。
- [ ] 完成 206 和 92。

## 下一节

下一节不改变链表结构，而是让两个指针以不同速度前进，解决中点、环和环入口。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-05-binary-search-advanced/">← 05 二分查找变形</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-07-fast-slow-pointers/">07 快慢指针 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 06》](https://www.bilibili.com/video/BV1sd4y1x7KN/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
