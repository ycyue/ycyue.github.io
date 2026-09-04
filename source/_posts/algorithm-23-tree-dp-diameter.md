---
title: 算法基础 23｜树形 DP（一）：返回单链，更新两链之和
date: 2026-09-04 13:10:00
permalink: 2026/09/04/algorithm-23-tree-dp-diameter/
categories:
  - 算法
tags:
  - Python
  - 树形DP
  - LeetCode
  - 算法基础
description: 图解树的直径：递归向父节点返回最长单链，在当前节点用左右链之和更新答案。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-22-interval-dp/">← 22 区间 DP</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-24-tree-dp-independent-set/">24 树形 DP：最大独立集 →</a>
</nav>

树的直径可能经过根，也可能完全藏在某棵子树中。关键是区分两种量：向父节点只能贡献一条向下路径；全局答案可以在当前节点拼接左右两条路径。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一棵二叉树。
- **输出**：任意两节点间最长路径的边数。
- **直接想法**：从每个节点出发搜索到所有其他节点，取最大距离。
- **真正瓶颈**：重复经过同一边，最坏 O(n²)；后序递归能让每条边只贡献一次。

## 2. 从暴力解法开始

```python
def diameter_brute(graph):
    answer = 0
    for start in graph:
        stack = [(start, None, 0)]
        while stack:
            node, parent, distance = stack.pop()
            answer = max(answer, distance)
            for nxt in graph[node]:
                if nxt != parent:
                    stack.append((nxt, node, distance + 1))
    return answer
```

对每个起点重新遍历整棵树会重复 O(n) 次。树形 DP 在每个节点汇总孩子信息，全局只遍历一次。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>dfs(node) 返回从 node 向下的最长链长；在 node 处用 left_chain + right_chain 更新全局直径。</strong></div>

返回给父节点的路径不能同时进入左右孩子，否则会在当前节点分叉，不再是一条简单链；但作为完整直径，恰好可以把两条向下链拼起来。

<figure class="algorithm-figure">
  <img src="/images/algorithms/23-tree-dp-diameter/process.svg" alt="树形 DP：直径执行过程图" loading="lazy">
  <figcaption>节点 2 可以把通向 4、5 的两条链拼成局部路径，但向节点 1 只能返回其中一条。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么遍历所有节点就覆盖直径

任意两节点路径都有唯一的最高点（最近公共祖先）。当 DFS 处理这个最高点时，左右返回值正好给出路径向两侧可延伸的最大长度，因此该直径候选一定被比较。

### 2. 为什么返回时只能选一条

父节点若使用当前子树中的路径，进入当前节点后只能继续向一个孩子，否则路径会分叉成三条，不再是两端之间的简单路径。

### 3. 边数与节点数如何统一

空节点返回 0，孩子链长加 1 表示经过一条边。`left+right` 自然是边数。若题目要求节点数，定义和公式要相应调整。

<figure class="algorithm-figure">
  <img src="/images/algorithms/23-tree-dp-diameter/proof.svg" alt="树形 DP：直径正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def diameter_of_binary_tree(root):
    answer = 0

    def dfs(node):
        nonlocal answer
        if node is None:
            return 0
        left = dfs(node.left)
        right = dfs(node.right)
        answer = max(answer, left + right)
        return max(left, right) + 1

    dfs(root)
    return answer
```

`dfs` 的返回值与全局答案不是同一量。看到树形 DP 时先分别写出“向父亲交什么”和“当前节点更新什么”。

## 6. 手工模拟一次

输入：`树 [1,2,3,4,5]`

| 节点 | left | right | 更新直径 | 返回链 |
|---|---|---|---|---|
| 4 | 0 | 0 | 0 | 1 |
| 5 | 0 | 0 | 0 | 1 |
| 2 | 1 | 1 | 2 | 2 |
| 3 | 0 | 0 | 2 | 1 |
| 1 | 2 | 1 | 3 | 3 |

最长路径可为 4→2→1→3，共 3 条边。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个节点后序处理一次。
- **空间复杂度：O(h)**。递归栈随树高增长。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>树上最长路径 + 路径可在节点拼两条链 → 返回单链，局部更新双链</strong></div>

- 树的直径、任意两点最长路径。
- 答案可能经过当前节点，也可能在子树。
- 父节点需要孩子的单方向最佳贡献。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：向父节点返回左右之和

```python
return left + right + 1
```

这会把分叉结构当成单链；只能返回较大一侧。

### 坑 2：忘记 nonlocal

```python
answer = max(answer, left + right)
```

嵌套函数给 answer 赋值前需声明 `nonlocal answer`。

### 坑 3：边数节点数差一

用最小树手算：单节点直径边数应为 0。

## 10. Python 补充

### `nonlocal` 修改外层变量

嵌套函数中给外层局部变量赋值，需要 `nonlocal answer`。若只读取或修改列表内容，则不一定需要。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)（简单）  
  返回单链、更新双链。

### 标准

- [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)（困难）  
  负贡献取 0，节点处拼两侧。
- [2246. 相邻字符不同的最长路径](https://leetcode.cn/problems/longest-path-with-different-adjacent-characters/)（困难）  
  只接字符不同的孩子链。

### 进阶

- [687. 最长同值路径](https://leetcode.cn/problems/longest-univalue-path/)（中等）  
  只延伸与当前值相同的链。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def diameter_of_binary_tree(root):
    answer = 0

    def dfs(node):
        nonlocal answer
        if node is None:
            return 0
        left = dfs(node.left)
        right = dfs(node.right)
        answer = max(answer, left + right)
        return max(left, right) + 1

    dfs(root)
    return answer
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能区分返回值与全局答案。
- [ ] 能解释路径最高点。
- [ ] 能处理边数定义。
- [ ] 能写后序单链模板。
- [ ] 完成 543 和 124。

## 下一节

下一节每个节点有“选”和“不选”两个状态，父子不能同时选择，形成树上的最大独立集。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-22-interval-dp/">← 22 区间 DP</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-24-tree-dp-independent-set/">24 树形 DP：最大独立集 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 23》](https://www.bilibili.com/video/BV17o4y187h1/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
