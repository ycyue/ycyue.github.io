---
title: 算法基础 25｜树形 DP（三）：三状态覆盖与摄像头
date: 2026-09-04 13:30:00
permalink: 2026/09/04/algorithm-25-tree-dp-dominating-set/
categories:
  - 算法
tags:
  - Python
  - 树形DP
  - LeetCode
  - 算法基础
description: 以监控二叉树为例图解未覆盖、有摄像头、已覆盖三状态，推导后序贪心与树形 DP。
---

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-24-tree-dp-independent-set/">← 24 树形 DP：最大独立集</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-26-monotonic-stack/">26 单调栈 →</a>
</nav>

摄像头能覆盖自己、父亲和直接孩子。父节点处理孩子时，必须区分孩子是“自己装了摄像头”“已被孩子覆盖”还是“仍等待父亲覆盖”。两个状态已经不够。

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：一棵二叉树。
- **输出**：覆盖所有节点所需最少摄像头数量。
- **直接想法**：枚举每个节点装或不装摄像头，再检查覆盖。
- **真正瓶颈**：有 2ⁿ 个安装子集，大多数在局部就已不可行或明显浪费。

## 2. 从暴力解法开始

```python
def cameras_brute(root):
    if root is None:
        return 0
    nodes = []
    parent = {root: None}
    stack = [root]
    while stack:
        node = stack.pop()
        nodes.append(node)
        for child in (node.left, node.right):
            if child is not None:
                parent[child] = node
                stack.append(child)

    best = len(nodes)
    for mask in range(1 << len(nodes)):
        covered = set()
        cameras = 0
        for i, node in enumerate(nodes):
            if mask & (1 << i):
                cameras += 1
                covered.update((node, parent[node], node.left, node.right))
        if all(node in covered for node in nodes):
            best = min(best, cameras)
    return best
```

枚举安装集合指数增长。后序处理能在看到孩子状态后做局部必需决策：只要孩子未覆盖，当前节点必须装摄像头。

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>后序返回 0=未覆盖、1=有摄像头、2=已覆盖；孩子未覆盖时当前必须装，孩子有摄像头时当前已覆盖。</strong></div>

空节点返回“已覆盖”，避免给叶子下面安装摄像头。叶子收到两个已覆盖孩子，因此自己返回未覆盖，请求父亲处理；这会把摄像头优先放在叶子的父节点，覆盖更多节点。

<figure class="algorithm-figure">
  <img src="/images/algorithms/25-tree-dp-dominating-set/process.svg" alt="树形 DP：最小支配集执行过程图" loading="lazy">
  <figcaption>状态不仅描述当前节点，还表达它向父节点提出的需求。</figcaption>
</figure>

## 4. 为什么这个算法成立？

### 1. 孩子未覆盖为何必须装

后序阶段孩子自己的子树已决定，孩子没有摄像头且未被它的孩子覆盖。能覆盖它的剩余位置只有当前父节点，因此当前安装是强制选择。

### 2. 都已覆盖为何返回未覆盖

当前节点的孩子不需要当前帮助。若现在安装，可能只覆盖当前和父亲；把决定推迟给父亲，有机会同时覆盖父亲的另一棵子树，不会更差。

### 3. 根为什么单独处理

普通节点可以请求父亲覆盖，但根没有父亲。DFS 结束后若根返回未覆盖，只能在根安装一台。

<figure class="algorithm-figure">
  <img src="/images/algorithms/25-tree-dp-dominating-set/proof.svg" alt="树形 DP：最小支配集正确性推导图" loading="lazy">
  <figcaption>每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。</figcaption>
</figure>

## 5. Python 模板

```python
def min_camera_cover(root):
    cameras = 0

    def dfs(node):
        nonlocal cameras
        if node is None:
            return 2  # 空节点视为已覆盖

        left = dfs(node.left)
        right = dfs(node.right)

        if left == 0 or right == 0:
            cameras += 1
            return 1
        if left == 1 or right == 1:
            return 2
        return 0

    if dfs(root) == 0:
        cameras += 1
    return cameras
```

数字状态要配注释或改用枚举常量。这里保留短数字是为了对照经典转移，但阅读时必须能说出每个值的含义。

## 6. 手工模拟一次

输入：`根只有一个左孩子，左孩子还有两个叶子`

| 节点 | 孩子状态 | 动作 | 返回 |
|---|---|---|---|
| 两个叶子 | 2,2 | 不装，请求父亲 | 0 |
| 左孩子 | 0,0 | 必须装摄像头 | 1 |
| 根 | 1,2 | 被孩子覆盖 | 2 |

只在中间节点安装一台即可覆盖全部四个节点。

## 7. 复杂度分析

- **时间复杂度：O(n)**。每个节点根据两个孩子状态做常数判断。
- **空间复杂度：O(h)**。递归栈随树高增长。

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>树上最小覆盖 + 节点可覆盖邻居 + 需要向父节点表达需求 → 三状态后序 DP/贪心</strong></div>

- 最少设备覆盖节点及邻居。
- 子树状态要区分已满足、主动提供、等待父亲。
- 父节点是孩子未满足时最后的补救位置。

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

### 坑 1：空节点返回未覆盖

```python
if node is None:
    return 0
```

会迫使在叶子安装摄像头；空节点应视为已覆盖。

### 坑 2：忘记根收尾

```python
dfs(root)
return cameras
```

根可能返回未覆盖且没有父节点。

### 坑 3：状态含义混乱

在代码旁写明 0/1/2，修改转移时逐项核对。

## 10. Python 补充

### 用常量提高可读性

工程代码可写 `UNCOVERED, CAMERA, COVERED = range(3)`，转移中使用名字，减少数字含义记错。

```python
UNCOVERED, CAMERA, COVERED = range(3)
```

## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

### 入门

- [968. 监控二叉树](https://leetcode.cn/problems/binary-tree-cameras/)（困难）  
  后序三状态。

### 标准

- [979. 在二叉树中分配硬币](https://leetcode.cn/problems/distribute-coins-in-binary-tree/)（中等）  
  子树向父节点返回硬币盈亏。
- [834. 树中距离之和](https://leetcode.cn/problems/sum-of-distances-in-tree/)（困难）  
  两次 DFS 换根 DP。

### 进阶

- [1245. 树的直径](https://leetcode.cn/problems/tree-diameter/)（中等）  
  复习返回单链模型。

<details>
<summary>检查答案：本节核心实现</summary>

```python
def min_camera_cover(root):
    cameras = 0

    def dfs(node):
        nonlocal cameras
        if node is None:
            return 2  # 空节点视为已覆盖

        left = dfs(node.left)
        right = dfs(node.right)

        if left == 0 or right == 0:
            cameras += 1
            return 1
        if left == 1 or right == 1:
            return 2
        return 0

    if dfs(root) == 0:
        cameras += 1
    return cameras
```

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

- [ ] 能说出三种状态。
- [ ] 能证明孩子未覆盖时当前必须装。
- [ ] 能解释空节点和根的特殊处理。
- [ ] 能独立画状态转移。
- [ ] 完成 968。

## 下一节

最后一个阶段回到数组。单调栈保存尚未找到答案的下标，新元素到来时一次解决一批旧问题。

<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/2026/09/04/algorithm-24-tree-dp-independent-set/">← 24 树形 DP：最大独立集</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <a class="series-nav__next" href="/2026/09/04/algorithm-26-monotonic-stack/">26 单调栈 →</a>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 25》](https://www.bilibili.com/video/BV1oF411U7qL/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
