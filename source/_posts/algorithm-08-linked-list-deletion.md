---
title: 算法基础 08｜链表删除：哨兵节点与固定间距
date: 2026-09-04 10:40:00
permalink: 2026/09/04/algorithm-08-linked-list-deletion/
categories:
  - 算法
tags:
  - Python
  - 链表
  - LeetCode
  - 算法基础
description: 用哨兵节点和前后指针图解删除倒数第 N 个节点，并总结链表删除的连接不变量。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-07-fast-slow-pointers/">← 07 快慢指针</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-09-binary-tree-recursion/">09 二叉树递归基础 →</a>
</nav>

删除链表节点真正需要的是它的前驱：执行 `prev.next = prev.next.next`。头节点没有天然前驱，所以边界处理很容易把主逻辑打断。哨兵节点给头节点补上一个统一的前驱。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：单链表和整数 n。
- **输出**：删除倒数第 n 个节点后的新头节点。
- **直接想法**：先遍历求长度 L，再从头走到第 L-n 个节点的前驱并删除。
- **真正瓶颈**：需要两次遍历；删除头节点还要单独分支。

## 2. 从暴力解法开始

```python
def remove_nth_two_pass(head, n):
    length = 0
    cur = head
    while cur:
        length += 1
        cur = cur.next
    if n == length:
        return head.next
    cur = head
    for _ in range(length - n - 1):
        cur = cur.next
    cur.next = cur.next.next
    return head
```

两次遍历仍是 O(n)，但分支多。前后指针把“倒数距离”转成两个指针之间固定为 n 个节点的间隔，只需一遍。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>在原头前放 dummy；fast 先走 n 步，再让 fast 和 slow 同速，fast 到尾时 slow.next 就是目标。</strong></div>

`slow` 从 dummy 出发，保证目标即使是原头也有前驱。fast 与 slow 的间隔建立后保持不变，因此 fast 指向最后一个节点时，slow 恰好位于待删节点前一位。

<figure class="algorithm-figure">
  <img src="/images/algorithms/08-linked-list-deletion/process.svg" alt="链表删除与前后指针执行过程图" loading="lazy">
  <figcaption>哨兵节点不属于原数据，它只用于统一“删除前驱”的操作。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么 fast 先走 n 步

待删除节点距链尾共有 n 个节点（包含自己）。当 fast 从 head 先走 n 步后，slow.next 与 fast 之间保持这一距离；fast 到 None 时，slow.next 正好是倒数第 n 个。

### 2. 为什么 slow 从 dummy 出发

若删除的是 head，目标前驱应位于 head 之前。dummy 正好扮演这个前驱，于是删除头节点和删除中间节点都使用同一句赋值。

### 3. 删除为什么只改一条边

设目标是 `slow.next`。让 `slow.next` 直接指向目标的后继后，从头出发的链已经绕过目标；目标之后的所有 next 关系无需改变。

<figure class="algorithm-figure">
  <img src="/images/algorithms/08-linked-list-deletion/proof.svg" alt="链表删除与前后指针正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = dummy
    fast = head

    for _ in range(n):
        fast = fast.next

    while fast is not None:
        slow = slow.next
        fast = fast.next

    slow.next = slow.next.next
    return dummy.next
```

题目保证 n 有效。如果写通用函数，应在 fast 提前为 None 时决定返回错误、原链还是抛异常，而不是静默访问空引用。

## 6. 手工模拟一次

输入：`1 → 2 → 3 → 4 → 5，n = 2`

| 阶段 | slow | fast | 间距/操作 |
|---|---|---|---|
| 初始 | dummy | 1 | fast 先走 2 |
| 建立后 | dummy | 3 | 目标候选是 slow.next=1 |
| 同步 1 | 1 | 4 | 间距保持 |
| 同步 2 | 2 | 5 | 间距保持 |
| 同步 3 | 3 | None | 删除 slow.next=4 |

最终链表为 `1 → 2 → 3 → 5`。

## 7. 复杂度分析

- **时间复杂度：O(n)**。fast 与 slow 都只沿链向前，不回退。
- **空间复杂度：O(1)**。dummy 是一个固定新节点，其数量不随链表长度增长。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>删除可能涉及头节点 + 需要目标前驱 + 倒数距离 → dummy + 固定间距双指针</strong></div>

- 删除、去重或合并时头节点可能变化。
- 题目给倒数第 k 个位置。
- 需要统一处理空链、单节点和头部操作。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：slow 从 head 出发

```python
slow = head
```

删除原头时没有前驱。让 slow 从 dummy 出发。

### 坑 2：间距差一位

```python
for _ in range(n + 1):
    fast = fast.next
```

本文 fast 从 head 出发只走 n 步；若从 dummy 出发则更新循环条件也要配套。

### 坑 3：返回旧 head

```python
return head
```

删除头节点后旧 head 已失效，应返回 `dummy.next`。

## 10. Python 补充

### `range(n)` 恰好执行 n 次

`for _ in range(n)` 中下划线表示循环次数重要、循环变量本身不用。执行后 fast 恰好前进 n 条 next 边。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)（中等）  
  dummy + 前后指针。

### 标准

- [83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)（简单）  
  相邻相等时跨过下一个节点。
- [82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)（中等）  
  需要删除整段重复值，dummy 很重要。

### 进阶

- [237. 删除链表中的节点](https://leetcode.cn/problems/delete-node-in-a-linked-list/)（中等）  
  无法访问前驱时，把后继值复制过来并删除后继。

<details>
<summary>检查答案：本节核心实现</summary>

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = dummy
    fast = head

    for _ in range(n):
        fast = fast.next

    while fast is not None:
        slow = slow.next
        fast = fast.next

    slow.next = slow.next.next
    return dummy.next
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释 dummy 为什么统一头节点。
- [ ] 能画出 fast 与 slow 的固定间距。
- [ ] 能独立写一次遍历删除。
- [ ] 能检查 n=链长和单节点情况。
- [ ] 完成 19 和 82。

## 下一节

下一阶段进入二叉树。我们先不背前中后序，而是回答每个递归函数从子树得到什么、向父节点返回什么。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-07-fast-slow-pointers/">← 07 快慢指针</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-09-binary-tree-recursion/">09 二叉树递归基础 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 08》](https://www.bilibili.com/video/BV1VP4y1Q71e/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
