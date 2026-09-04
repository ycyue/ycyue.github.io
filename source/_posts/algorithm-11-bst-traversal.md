---
title: 算法基础 11｜前中后序与二叉搜索树：处理时机决定信息方向
date: 2026-09-04 11:10:00
permalink: 2026/09/04/algorithm-11-bst-traversal/
categories:
  - 算法
tags:
  - Python
  - 二叉树
  - LeetCode
  - 算法基础
description: 图解前序、中序、后序处理时机，并用取值范围证明二叉搜索树是否合法。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-10-binary-tree-recursion-advanced/">← 10 二叉树递归进阶</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-12-lowest-common-ancestor/">12 最近公共祖先 →</a>
</nav>

前序、中序、后序的区别不是背三个字母顺序，而是“当前节点在什么时候处理”。BST 还提供一个额外性质：左子树所有值小于根，右子树所有值大于根。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一棵二叉树。
- **输出**：判断它是否为严格二叉搜索树。
- **直接想法**：对每个节点分别求左子树最大值和右子树最小值。
- **真正瓶颈**：重复扫描子树，且只比较直接孩子会漏掉更深层违反范围的节点。

## 2. 从暴力解法开始

```python
def inorder_values(node, values):
    if node is None:
        return
    inorder_values(node.left, values)
    values.append(node.val)
    inorder_values(node.right, values)

def is_valid_bst_list(root):
    values = []
    inorder_values(root, values)
    return all(values[i] < values[i + 1] for i in range(len(values) - 1))
```

中序列表法时间 O(n)、空间 O(n)，已经正确。范围递归不用保存全部值，只把祖先施加的上下界传给当前节点。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>前序向下传约束，中序按有序顺序访问，后序向上汇总信息；BST 验证可给每个节点传合法开区间。</strong></div>

根节点范围是 `(-∞,+∞)`。进入左子树，上界收紧为根值；进入右子树，下界提高为根值。当前值只要不严格落在 `(low, high)` 内，就立即失败。

<figure class="algorithm-figure">
  <img src="/images/algorithms/11-bst-traversal/process.svg" alt="遍历与二叉搜索树执行过程图" loading="lazy">
  <figcaption>节点 6 虽小于父节点 7，却仍必须大于祖先 5；范围参数保留了这条信息。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么只比较孩子不够

树 `5 / \ 1 6` 中，6 的左孩子若为 4，它小于直接父节点 6，但落在根 5 的右子树中，必须大于 5。祖先范围不可丢失。

### 2. 为什么使用开区间

题目定义严格 BST，不允许重复值。因此当前值必须满足 `low < node.val < high`，等于任一边界都失败。

### 3. 中序法为什么成立

BST 的左子树值全部更小，右子树值全部更大；递归应用后，中序序列严格递增。反过来，若整棵树中序严格递增，也能保证每个节点满足左右关系。

<figure class="algorithm-figure">
  <img src="/images/algorithms/11-bst-traversal/proof.svg" alt="遍历与二叉搜索树正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def is_valid_bst(root):
    def dfs(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return (dfs(node.left, low, node.val)
                and dfs(node.right, node.val, high))

    return dfs(root, float('-inf'), float('inf'))
```

这里在前序位置检查当前值并向下传范围。若使用中序遍历，则保存上一个访问值并检查严格递增。

## 6. 手工模拟一次

输入：`根 5，左 3，右 7；7 的左孩子是 6`

| 节点 | 合法范围 | 值 | 结果 |
|---|---|---|---|
| 5 | (-∞,+∞) | 5 | 通过 |
| 3 | (-∞,5) | 3 | 通过 |
| 7 | (5,+∞) | 7 | 通过 |
| 6 | (5,7) | 6 | 通过 |

6 的范围同时包含祖先 5 与父节点 7 的约束。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个节点验证一次，失败时可提前结束。
- **空间复杂度：O(h)**。递归栈随树高增长；范围只是每层两个数。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>BST + 顺序查询 → 中序；祖先约束 → 前序传范围；子树统计 → 后序返回</strong></div>

- 题目出现二叉搜索树。
- 要求第 k 小、验证有序或按序输出。
- 当前节点的合法性取决于祖先范围。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：只比较直接孩子

```python
return node.left.val < node.val < node.right.val
```

更深节点可能违反祖先限制。

### 坑 2：允许等号

```python
if low <= node.val <= high:
```

严格 BST 不允许重复，必须用开区间。

### 坑 3：空孩子访问 val

递归基本情况先处理 None。

## 10. Python 补充

### 正负无穷

`float("-inf")` 和 `float("inf")` 比任何有限整数都小或大，适合表示根节点初始无限范围。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)（简单）  
  在递归孩子前记录节点。

### 标准

- [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)（中等）  
  向下传开区间。
- [230. 二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)（中等）  
  中序第 k 个。

### 进阶

- [938. 二叉搜索树的范围和](https://leetcode.cn/problems/range-sum-of-bst/)（简单）  
  利用范围剪掉整棵不可能子树。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def is_valid_bst(root):
    def dfs(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return (dfs(node.left, low, node.val)
                and dfs(node.right, node.val, high))

    return dfs(root, float('-inf'), float('inf'))
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能解释三种遍历是处理时机。
- [ ] 能说明只比较孩子为何错误。
- [ ] 能写范围递归。
- [ ] 能用中序有序性解决第 k 小。
- [ ] 完成 98 和 230。

## 下一节

下一节继续用后序返回值做分类讨论：左右子树分别是否找到目标，决定当前节点是否为最近公共祖先。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-10-binary-tree-recursion-advanced/">← 10 二叉树递归进阶</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-12-lowest-common-ancestor/">12 最近公共祖先 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 11》](https://www.bilibili.com/video/BV14G411P7C1/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
