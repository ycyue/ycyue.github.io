---
title: 算法基础 24｜树形 DP（二）：选或不选节点的两个状态
date: 2026-09-04 13:20:00
permalink: 2026/09/04/algorithm-24-tree-dp-independent-set/
categories:
  - 算法
tags:
  - Python
  - 树形DP
  - LeetCode
  - 算法基础
description: 以打家劫舍 III 为例图解树上最大独立集，推导选节点与不选节点的两个返回状态。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-23-tree-dp-diameter/">← 23 树形 DP：直径</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-25-tree-dp-dominating-set/">25 树形 DP：最小支配集 →</a>
</nav>

树上相邻节点不能同时选择。只让子树返回一个最大值不够，因为父节点选择与否会限制孩子能否选择。子树必须同时汇报两种条件下的最优值。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：每个树节点有非负价值。
- **输出**：不同时选择父子节点时的最大价值和。
- **直接想法**：对当前节点选或不选；选时递归孙子，不选时递归孩子。
- **真正瓶颈**：同一孙子会从不同路径反复计算；且跳层写法难推广到多叉树。

## 2. 从暴力解法开始

```python
def rob_tree_brute(node):
    if node is None:
        return 0
    choose = node.val
    if node.left:
        choose += rob_tree_brute(node.left.left) + rob_tree_brute(node.left.right)
    if node.right:
        choose += rob_tree_brute(node.right.left) + rob_tree_brute(node.right.right)
    skip = rob_tree_brute(node.left) + rob_tree_brute(node.right)
    return max(choose, skip)
```

子树被多次调用。后序一次返回 `(skip, choose)`，父节点直接组合孩子两种状态。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>dfs(node) 返回两个值：不选 node 的最大收益 skip，以及选择 node 的最大收益 choose。</strong></div>

选当前节点时孩子必须不选；不选当前节点时，每个孩子可以独立选择它自己的较优状态。两个孩子之间没有边，因此可以分别取最大再相加。

<figure class="algorithm-figure">
  <img src="/images/algorithms/24-tree-dp-independent-set/process.svg" alt="树形 DP：最大独立集执行过程图" loading="lazy">
  <figcaption>两个返回值保留了父节点做决定所需的条件信息，不能过早合并成一个最大值。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 为什么不选时可分别取最大

左右子树之间没有边，选择方案互不冲突。当前节点不选后，孩子是否选择不再受父亲限制，因此每棵子树独立取自身较大状态。

### 2. 为什么选时只能用 skip

当前与孩子相邻，独立集不能同时包含相邻节点。选择当前后，每个直接孩子都必须不选，但孙子选择已经包含在孩子的 skip 最优值中。

### 3. 为什么两个状态足够

父节点对整棵孩子子树的唯一外部约束就是“孩子根能否被选”。子树内部细节已经由最优值概括，无需传完整方案。

<figure class="algorithm-figure">
  <img src="/images/algorithms/24-tree-dp-independent-set/proof.svg" alt="树形 DP：最大独立集正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def rob_tree(root):
    def dfs(node):
        if node is None:
            return 0, 0  # skip, choose

        left_skip, left_choose = dfs(node.left)
        right_skip, right_choose = dfs(node.right)

        choose = node.val + left_skip + right_skip
        skip = max(left_skip, left_choose) + max(right_skip, right_choose)
        return skip, choose

    return max(dfs(root))
```

元组顺序要固定。建议解包时使用带语义变量名，不要写 a、b，否则很容易在转移中选错状态。

## 6. 手工模拟一次

输入：`root=[3,2,3,null,3,null,1]`

| 节点 | skip | choose | 说明 |
|---|---|---|---|
| 叶3 | 0 | 3 | 选叶子收益3 |
| 节点2 | 3 | 2 | 不选2可选孩子3 |
| 节点3(右) | 1 | 3 | 比较孩子1 |
| 根3 | 6 | 7 | 选根+两侧skip |

根选择状态收益 7，大于不选状态 6。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个节点计算一次两个状态。
- **空间复杂度：O(h)**。递归栈；每层只保存常数状态。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>树上选择 + 父子互斥 + 父亲只关心孩子根状态 → 每节点返回选/不选</strong></div>

- 树上不能选相邻节点。
- 选择当前会限制孩子，但不直接限制更深后代。
- 父节点需要条件化的子树最优值。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：子树只返回最大值

```python
return max(skip, choose)
```

父节点选中时必须强制孩子 skip，过早取 max 会丢信息。

### 坑 2：选当前时使用孩子 choose

```python
choose = node.val + max(left) + max(right)
```

这允许父子同时选。

### 坑 3：空节点返回单个 0

```python
return 0
```

调用处要解包两个状态，应返回 `(0,0)`。

## 10. Python 补充

### 元组解包

`left_skip, left_choose = dfs(node.left)` 按位置取出两个结果。返回值顺序必须在注释和所有调用中保持一致。



## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [337. 打家劫舍 III](https://leetcode.cn/problems/house-robber-iii/)（中等）  
  返回 skip、choose。

### 标准

- [2646. 最小化旅行的价格总和](https://leetcode.cn/problems/minimize-the-total-price-of-the-trips/)（困难）  
  先统计经过次数，再做树上选/不选。
- [968. 监控二叉树](https://leetcode.cn/problems/binary-tree-cameras/)（困难）  
  尝试三状态树 DP。

### 进阶

- [2378. 选择边来最大化树的得分](https://leetcode.cn/problems/choose-edges-to-maximize-score-in-a-tree/)（中等）  
  节点与父边选择形成条件状态。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def rob_tree(root):
    def dfs(node):
        if node is None:
            return 0, 0  # skip, choose

        left_skip, left_choose = dfs(node.left)
        right_skip, right_choose = dfs(node.right)

        choose = node.val + left_skip + right_skip
        skip = max(left_skip, left_choose) + max(right_skip, right_choose)
        return skip, choose

    return max(dfs(root))
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能说明为什么一个返回值不够。
- [ ] 能推导 choose 与 skip。
- [ ] 能解释左右子树独立。
- [ ] 能用元组返回状态。
- [ ] 完成 337。

## 下一节

下一节需要三种状态才能描述“被自己覆盖、被孩子覆盖、等待父亲覆盖”，完成最小支配集模型。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-23-tree-dp-diameter/">← 23 树形 DP：直径</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-25-tree-dp-dominating-set/">25 树形 DP：最小支配集 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 24》](https://www.bilibili.com/video/BV1vu4y1f7dn/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
