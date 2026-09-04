---
title: 算法基础 12｜最近公共祖先：让子树向上汇报找到谁
date: 2026-09-04 11:20:00
permalink: 2026/09/04/algorithm-12-lowest-common-ancestor/
categories:
  - 算法
tags:
  - Python
  - 二叉树
  - LeetCode
  - 算法基础
description: 用后序递归分类讨论最近公共祖先，解释返回目标、返回祖先和返回空的统一含义。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-11-bst-traversal/">← 11 遍历与二叉搜索树</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-13-binary-tree-bfs/">13 二叉树 BFS →</a>
</nav>

最近公共祖先是同时包含 p、q 的最深节点。与其从根向下猜方向，不如让左右子树向上汇报：“我这里找到了 p、q，还是已经找到了它们的公共祖先？”

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：二叉树根节点和两个确定存在的节点 p、q。
- **输出**：p、q 的最近公共祖先节点。
- **直接想法**：分别记录从根到 p、q 的完整路径，再比较最后一个相同节点。
- **真正瓶颈**：需要 O(h) 路径存储和额外路径比较；递归可直接在分叉处得到答案。

## 2. 从暴力解法开始

```python
def lowest_common_ancestor_with_paths(root, p, q):
    def find_path(node, target, path):
        if node is None:
            return False
        path.append(node)
        if node is target:
            return True
        if find_path(node.left, target, path) or find_path(node.right, target, path):
            return True
        path.pop()
        return False

    path_p, path_q = [], []
    find_path(root, p, path_p)
    find_path(root, q, path_q)
    ancestor = None
    for left, right in zip(path_p, path_q):
        if left is not right:
            break
        ancestor = left
    return ancestor
```

路径法是 O(n) 时间。后序方法同样 O(n)，但返回值直接表达“当前子树发现的有效节点”，不需要保存两条完整路径。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>dfs 返回当前子树中的有效发现：None、p/q 本身，或已经确定的最近公共祖先。</strong></div>

先递归左右子树。若两边都返回非空，说明 p、q 分居两侧，当前节点就是第一次汇合处；若只有一边非空，就把该结果继续向上交；当前节点本身等于 p 或 q 时直接返回自己。

<figure class="algorithm-figure">
  <img src="/images/algorithms/12-lowest-common-ancestor/process.svg" alt="最近公共祖先执行过程图" loading="lazy">
  <figcaption>后序顺序让当前节点在拿到左右两份报告后再做决定。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么左右非空时就是答案

左返回非空说明左子树含目标或已含共同祖先，右侧同理。若 p、q 分居两侧，任何严格后代都不可能同时覆盖两边，当前节点就是最近的共同祖先。

### 2. 一个节点是另一个祖先怎么办

遇到 p 时直接返回 p，不再向下找 q。上层最终只会收到 p 这一条非空结果并返回 p。由于题目保证 q 存在于 p 的子树或其他结构中，p 正是公共祖先。标准证明依赖两个目标均存在。

### 3. 为什么子树已有答案不会被覆盖

若某棵子树内部已经找到 LCA，它作为非空节点一路上传；另一侧为空时不会被替换。即使更高层另一侧出现其他信息，题目只有 p、q 两个目标，不会产生第二个目标分叉。

<figure class="algorithm-figure">
  <img src="/images/algorithms/12-lowest-common-ancestor/proof.svg" alt="最近公共祖先正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left is not None and right is not None:
        return root
    return left if left is not None else right
```

比较节点身份使用 `is`。若题目不保证 p、q 都存在，需要额外返回“找到几个目标”，否则只找到一个时也会错误返回它。

## 6. 手工模拟一次

输入：`树 [3,5,1,6,2,0,8]，p=5，q=1`

| 节点 | 左返回 | 右返回 | 当前返回 |
|---|---|---|---|
| 5 | — | — | 5 |
| 1 | — | — | 1 |
| 3 | 5 | 1 | 3 |

根 3 是左右报告第一次同时非空的位置，因此是最近公共祖先。

## 7. 复杂度分析

- **时间复杂度：O(n)**。最坏访问全部节点一次。
- **空间复杂度：O(h)**。递归栈由树高决定。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>两个目标分布在树中 + 要找最深汇合点 → 后序收集左右报告</strong></div>

- 最近公共祖先或最小包含子树。
- 当前结论取决于左右子树是否发现目标。
- 需要从孩子向父亲传播节点身份。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：只按节点值比较

```python
if root.val == p.val:
```

不同节点可能同值；题目给的是节点引用。

### 坑 2：左右都空时返回 root

都没找到应返回 None，不能制造虚假报告。

### 坑 3：忽略目标可能不存在

标准模板假设两节点存在；通用版本要附带找到数量。

## 10. Python 补充

### 条件表达式

`left if left is not None else right` 表示优先返回非空的左结果，否则返回右结果；两者都空时自然返回 None。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [235. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)（中等）  
  利用 BST 值域决定同侧或分叉。

### 标准

- [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)（中等）  
  后序收集两侧结果。

### 进阶

- [1123. 最深叶节点的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-deepest-leaves/)（中等）  
  同时返回深度和祖先。
- [1644. 二叉树的最近公共祖先 II](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-ii/)（中等）  
  额外确认两个目标都存在。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left is not None and right is not None:
        return root
    return left if left is not None else right
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能定义 dfs 非空返回值的语义。
- [ ] 能完成左右结果四种分类。
- [ ] 能解释“最近”如何保证。
- [ ] 知道存在性假设。
- [ ] 完成 235 和 236。

## 下一节

递归擅长沿深度深入；下一节改用队列一层层扩散，建立 BFS 的分层边界。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-11-bst-traversal/">← 11 遍历与二叉搜索树</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-13-binary-tree-bfs/">13 二叉树 BFS →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 12》](https://www.bilibili.com/video/BV1W44y1Z7AR/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
