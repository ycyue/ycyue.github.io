---
title: 算法基础 09｜二叉树递归基础：把大树交给两棵子树
date: 2026-09-04 10:50:00
permalink: 2026/09/04/algorithm-09-binary-tree-recursion/
categories:
  - 算法
tags:
  - Python
  - 二叉树
  - LeetCode
  - 算法基础
description: 从最大深度出发，图解二叉树递归的返回值、基本情况和自底向上信息合并。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-08-linked-list-deletion/">← 08 链表删除与前后指针</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-10-binary-tree-recursion-advanced/">10 二叉树递归进阶 →</a>
</nav>

递归不是“函数自己调用自己”这么简单。树上递归最稳定的思考顺序是：当前函数代表哪棵子树？空树返回什么？左右子树各返回什么？当前节点怎样合并？

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一棵二叉树的根节点。
- **输出**：树的最大深度。
- **直接想法**：枚举所有从根出发的路径，记录最长路径节点数。
- **真正瓶颈**：若不断复制路径列表，会产生额外存储；更重要的是没有利用“整棵树深度由左右子树深度决定”的结构。

## 2. 从暴力解法开始

```python
def max_depth_paths(root):
    if root is None:
        return 0
    paths = [(root, 1)]
    answer = 0
    while paths:
        node, depth = paths.pop()
        answer = max(answer, depth)
        if node.left:
            paths.append((node.left, depth + 1))
        if node.right:
            paths.append((node.right, depth + 1))
    return answer
```

显式栈方法是正确的 O(n) 解法，但它把递归调用栈手动写了出来。递归能更直接表达子树定义。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>定义 dfs(node) 为“以 node 为根的子树最大深度”；答案就是 1 + 左右子树深度的较大值。</strong></div>

空节点代表空树，深度为 0。非空节点自己贡献 1 层，剩余深度来自更深的那棵子树。先得到孩子返回值再计算当前值，属于自底向上的后序递归。

<figure class="algorithm-figure">
  <img src="/images/algorithms/09-binary-tree-recursion/process.svg" alt="二叉树递归基础执行过程图" loading="lazy">
  <figcaption>节点 2 收到孩子 4、5 的深度后返回 2；根节点再把它变成 3。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么能拆成左右子树

从当前根到任一叶子的路径，第一步只能进入左子树或右子树。最长路径必然等于两棵子树最长路径中的较大者，再加当前根这一层。

### 2. 为什么空节点返回 0

空树没有节点。叶子节点的左右孩子都为空，于是它返回 `max(0,0)+1=1`，与“叶子深度为 1”的定义一致。

### 3. 递归为什么会停

每次调用都进入更小的子树，最终遇到 None。有限节点的树不可能无限下降。

<figure class="algorithm-figure">
  <img src="/images/algorithms/09-binary-tree-recursion/proof.svg" alt="二叉树递归基础正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def max_depth(root):
    if root is None:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return max(left_depth, right_depth) + 1
```

先把 `max_depth(root)` 的含义写成一句话。函数含义一旦改变，基本情况和返回式也必须一起改变。

## 6. 手工模拟一次

输入：`1 的孩子是 2、3；2 的孩子是 4、5`

| 节点 | 左子树返回 | 右子树返回 | 当前返回 |
|---|---|---|---|
| 4 | 0 | 0 | 1 |
| 5 | 0 | 0 | 1 |
| 2 | 1 | 1 | 2 |
| 3 | 0 | 0 | 1 |
| 1 | 2 | 1 | 3 |

计算顺序从叶子向根汇总，这就是后序位置使用返回值。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个非空节点进入一次，并做常数次比较。
- **空间复杂度：O(h)**。递归栈深度等于树高 h；平衡树为 O(log n)，退化链状树为 O(n)。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>整棵树答案能由左右子树答案合并 → 定义子树递归函数</strong></div>

- 问题天然描述“以某节点为根的子树”。
- 父节点只需要孩子返回少量信息。
- 空树能给出自然的单位值或边界值。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：忘记基本情况

```python
def dfs(node):
    return 1 + dfs(node.left)
```

遇到 None 后仍访问 left，会报错。先处理空节点。

### 坑 2：函数含义中途改变

不要一会儿让 dfs 返回节点数，一会儿又当边数使用；深度定义要统一。

### 坑 3：只递归不返回

父节点依赖子树结果时必须 `return`；仅访问节点的遍历才可能不返回值。

## 10. Python 补充

### 递归调用栈

每次函数调用都保存参数和返回位置。Python 默认递归深度有限，极深的链状树可能触发 `RecursionError`；题目约束很大时可改用显式栈。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)（简单）  
  定义 dfs 为子树深度。
- [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)（简单）  
  只有一个孩子时不能错误地取 0。

### 标准

- [112. 路径总和](https://leetcode.cn/problems/path-sum/)（简单）  
  把剩余目标传给孩子。

### 进阶

- [129. 求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/)（中等）  
  沿路径维护当前数字。

<details>
<summary>检查答案：本节核心实现</summary>

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def max_depth(root):
    if root is None:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return max(left_depth, right_depth) + 1
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能用一句话定义递归函数。
- [ ] 能解释空树返回值。
- [ ] 能区分自顶向下参数与自底向上返回值。
- [ ] 能分析递归栈空间。
- [ ] 完成 104 和 112。

## 下一节

下一节让子树返回不止一个数字，并学习在发现失败后提前终止。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-08-linked-list-deletion/">← 08 链表删除与前后指针</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-10-binary-tree-recursion-advanced/">10 二叉树递归进阶 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 09》](https://www.bilibili.com/video/BV1UD4y1Y769/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
