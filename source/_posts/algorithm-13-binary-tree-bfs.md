---
title: 算法基础 13｜二叉树 BFS：队列如何守住层的边界
date: 2026-09-04 11:30:00
permalink: 2026/09/04/algorithm-13-binary-tree-bfs/
categories:
  - 算法
tags:
  - Python
  - BFS
  - LeetCode
  - 算法基础
description: 用队列变化图解二叉树层序遍历，解释为什么先记录队列长度才能正确分层。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-12-lowest-common-ancestor/">← 12 最近公共祖先</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-14-backtracking-subsets/">14 子集型回溯 →</a>
</nav>

BFS（广度优先搜索）像水波一样从根向外扩散。队列保证先进入的节点先处理，因此深度小的节点一定先于深度大的节点出队。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一棵二叉树。
- **输出**：按层返回节点值，例如 `[[3],[9,20],[15,7]]`。
- **直接想法**：给每个节点递归传深度，把值追加到对应下标列表。
- **真正瓶颈**：递归方案可行，但本节要掌握队列以及最短步数问题通用的 BFS 分层方式。

## 2. 从暴力解法开始

```python
def level_order_dfs(root):
    answer = []
    def dfs(node, depth):
        if node is None:
            return
        if depth == len(answer):
            answer.append([])
        answer[depth].append(node.val)
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    dfs(root, 0)
    return answer
```

DFS 同样是 O(n)，说明“暴力”并不总更慢。选择 BFS 的原因是它天然按距离/层次处理，扩展到无权图最短路时尤其重要。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>每层开始先冻结 `level_size = len(queue)`；本轮只弹出这批旧节点，新加入的孩子留给下一层。</strong></div>

Python 的 `deque` 支持 O(1) 的左端弹出。若在 `for` 循环条件中动态读取队列长度，新孩子会混进当前层；先保存长度就是在队列中画出层边界。

<figure class="algorithm-figure">
  <img src="/images/algorithms/13-binary-tree-bfs/process.svg" alt="二叉树 BFS执行过程图" loading="lazy">
  <figcaption>先读取本层节点数，再扩展孩子，是层序遍历最关键的一行。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么队列按深度有序

根深度为 0。假设某轮处理的节点深度都为 d，它们加入的孩子深度都是 d+1，并排在队尾；处理完本轮后，队列只剩这些 d+1 层节点。归纳即可。

### 2. 为什么要冻结长度

处理本层节点时队列会持续增长。保存旧长度后，循环次数只对应本层；否则可能继续处理刚加入的孩子，所有层被混在一起。

### 3. 为什么 BFS 能求无权最短路

BFS 按步数从小到大访问状态。一个状态第一次被发现时，不可能还存在步数更少但尚未处理的路径，因此第一次距离就是最短距离。

<figure class="algorithm-figure">
  <img src="/images/algorithms/13-binary-tree-bfs/proof.svg" alt="二叉树 BFS正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
from collections import deque

def level_order(root):
    if root is None:
        return []

    queue = deque([root])
    answer = []

    while queue:
        level = []
        level_size = len(queue)
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        answer.append(level)

    return answer
```

若只需逐个访问而不关心层，可省略 `level_size`。只要题目按层统计最大值、右视图或层平均值，就必须保留边界。

## 6. 手工模拟一次

输入：`root = [3,9,20,null,null,15,7]`

| 轮次 | 开始队列 | 弹出 | 加入 | 输出层 |
|---|---|---|---|---|
| 1 | [3] | 3 | 9,20 | [3] |
| 2 | [9,20] | 9,20 | 15,7 | [9,20] |
| 3 | [15,7] | 15,7 | — | [15,7] |

答案为 `[[3],[9,20],[15,7]]`。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个节点入队一次、出队一次。
- **空间复杂度：O(w)**。队列最大长度等于树的最大层宽 w，最坏 O(n)。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>按层/按最少步数扩散 + 每条边代价相同 → BFS + 队列</strong></div>

- 层序、每层最大值、右视图。
- 无权图中的最短步数。
- 从多个起点同时扩散。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：用 list.pop(0)

```python
node = queue.pop(0)
```

列表头部删除需要搬移元素，使用 `deque.popleft()`。

### 坑 2：循环中动态使用 len(queue)

```python
while queue:
    for _ in range(len(queue)):
```

这里只在进入 for 时求值一次尚可，但应显式保存 `level_size`，避免改写时混淆层边界。

### 坑 3：空树仍把 None 入队

先判断 root 是否为 None。

## 10. Python 补充

### `collections.deque`

`deque` 是双端队列，`append()` 从右加入，`popleft()` 从左取出，两者都是 O(1)，适合 BFS。

```python
from collections import deque
queue = deque([1])
queue.append(2)
first = queue.popleft()
```

## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)（中等）  
  冻结每层长度。

### 标准

- [103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)（中等）  
  按层号决定是否反转输出。
- [513. 找树左下角的值](https://leetcode.cn/problems/find-bottom-left-tree-value/)（中等）  
  每层第一个节点更新答案。

### 进阶

- [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)（中等）  
  多源 BFS，每轮代表一分钟。

<details>
<summary>检查答案：本节核心实现</summary>

```python
from collections import deque

def level_order(root):
    if root is None:
        return []

    queue = deque([root])
    answer = []

    while queue:
        level = []
        level_size = len(queue)
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        answer.append(level)

    return answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释队列先进先出。
- [ ] 能证明每轮队列只含同一层。
- [ ] 能写 level_size 分层模板。
- [ ] 能区分 O(h) DFS 栈与 O(w) BFS 队列。
- [ ] 完成 102 和 994。

## 下一节

下一阶段进入回溯：它仍是 DFS，但会在同一路径上做选择、递归，再撤销选择。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-12-lowest-common-ancestor/">← 12 最近公共祖先</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-14-backtracking-subsets/">14 子集型回溯 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 13》](https://www.bilibili.com/video/BV1hG4y1277i/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
