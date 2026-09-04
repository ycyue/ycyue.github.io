---
title: 算法基础 10｜二叉树递归进阶：让返回值携带足够信息
date: 2026-09-04 11:00:00
permalink: 2026/09/04/algorithm-10-binary-tree-recursion-advanced/
categories:
  - 算法
tags:
  - Python
  - 二叉树
  - LeetCode
  - 算法基础
description: 用平衡二叉树图解如何设计复合返回信息和失败哨兵，避免重复计算子树高度。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-09-binary-tree-recursion/">← 09 二叉树递归基础</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-11-bst-traversal/">11 遍历与二叉搜索树 →</a>
</nav>

判断平衡树时，父节点既需要孩子高度，又需要知道孩子内部是否已经不平衡。若每个节点都重新计算高度，会反复遍历同一子树。更好的办法是让一次递归同时汇报足够信息。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一棵二叉树。
- **输出**：判断任意节点左右子树高度差是否都不超过 1。
- **直接想法**：对每个节点分别调用高度函数，再递归检查孩子。
- **真正瓶颈**：高度函数会重复访问后代；链状树最坏达到 O(n²)。

## 2. 从暴力解法开始

```python
def height(node):
    if node is None:
        return 0
    return max(height(node.left), height(node.right)) + 1

def is_balanced_brute(root):
    if root is None:
        return True
    return (abs(height(root.left) - height(root.right)) <= 1
            and is_balanced_brute(root.left)
            and is_balanced_brute(root.right))
```

每个节点都可能再次遍历整棵子树。优化后每个节点只计算一次高度，并用 -1 表示“这棵子树已不平衡”。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>让 dfs 返回子树高度；若子树不平衡则返回 -1，把失败状态一路向上传播。</strong></div>

-1 是哨兵值：正常高度永不为负，因此它不会与合法结果混淆。父节点收到 -1 后无需继续计算另一侧或高度差，可以立即返回。

<figure class="algorithm-figure">
  <img src="/images/algorithms/10-binary-tree-recursion-advanced/process.svg" alt="二叉树递归进阶执行过程图" loading="lazy">
  <figcaption>返回值设计得足够好，父节点不必重新深入子树寻找信息。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么 -1 能提前返回

平衡条件要求每个节点都满足。只要某个子树内部已经违反条件，包含它的任何更大子树也一定不平衡，因此无需继续求完整高度。

### 2. 为什么正常返回高度

若左右子树都平衡且高度差不超过 1，当前子树也平衡；其高度仍由较高子树加 1 得到。

### 3. 如何推广复合信息

不能用单个哨兵时，可以返回元组，如 `(is_balanced, height)`。原则不是追求最短，而是让父节点一次拿到完成判断所需的全部信息。

<figure class="algorithm-figure">
  <img src="/images/algorithms/10-binary-tree-recursion-advanced/proof.svg" alt="二叉树递归进阶正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def is_balanced(root):
    def dfs(node):
        if node is None:
            return 0

        left_height = dfs(node.left)
        if left_height == -1:
            return -1

        right_height = dfs(node.right)
        if right_height == -1 or abs(left_height - right_height) > 1:
            return -1

        return max(left_height, right_height) + 1

    return dfs(root) != -1
```

内部 `dfs` 只服务当前题目，嵌套函数能清晰限制作用域。外层把哨兵结果转换成题目要求的布尔值。

## 6. 手工模拟一次

输入：`根的左子树高度 3，右子树高度 1`

| 节点 | 左返回 | 右返回 | 当前返回 |
|---|---|---|---|
| 左侧叶子 | 0 | 0 | 1 |
| 左侧父节点 | 2 | 0 | -1 |
| 根 | -1 | 未再计算 | -1 |

一旦左子树返回 -1，根可直接判定失败，避免无意义遍历。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个节点至多访问一次，失败时还可能提前结束。
- **空间复杂度：O(h)**。主要额外空间来自递归栈。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>父节点需要子树的多种信息 + 暴力反复遍历 → 设计返回值一次汇报</strong></div>

- 每个节点都要检查局部条件。
- 父节点需要高度、大小、最大值或真假状态。
- 同一子树在暴力法中被多次调用辅助函数。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：把 -1 继续当高度计算

```python
return max(left_height, right_height) + 1
```

收到失败哨兵后应立即传播，不能参与正常运算。

### 坑 2：只检查根的高度差

平衡要求所有节点都满足，子树内部失败必须汇报。

### 坑 3：重复调用 dfs

先把返回值保存到变量，避免同一子树求两次。

## 10. Python 补充

### 嵌套函数

把 `dfs` 定义在 `is_balanced` 内，表示它是实现细节，也能自然访问外层变量。每次调用外层函数都会创建独立的 dfs 环境。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [100. 相同的树](https://leetcode.cn/problems/same-tree/)（简单）  
  同时递归两个节点。
- [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)（简单）  
  比较外侧与内侧孩子。

### 标准

- [110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)（简单）  
  用 -1 传播失败。

### 进阶

- [199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)（中等）  
  DFS 时按深度记录第一个右侧节点。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def is_balanced(root):
    def dfs(node):
        if node is None:
            return 0

        left_height = dfs(node.left)
        if left_height == -1:
            return -1

        right_height = dfs(node.right)
        if right_height == -1 or abs(left_height - right_height) > 1:
            return -1

        return max(left_height, right_height) + 1

    return dfs(root) != -1
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能分析暴力重复计算在哪里。
- [ ] 能设计不会与合法值冲突的哨兵。
- [ ] 能解释失败为何可向上传播。
- [ ] 能写出一次遍历版本。
- [ ] 完成 110 和 101。

## 下一节

下一节专门比较前序、中序、后序的处理时机，并利用二叉搜索树的中序有序性。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-09-binary-tree-recursion/">← 09 二叉树递归基础</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-11-bst-traversal/">11 遍历与二叉搜索树 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 10》](https://www.bilibili.com/video/BV18M411z7bb/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
