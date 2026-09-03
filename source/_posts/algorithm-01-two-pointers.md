---
title: 算法基础 01｜相向双指针：从暴力枚举到 O(n)
date: 2026-09-04 09:30:00
permalink: 2026/09/04/algorithm-01-two-pointers/
categories:
  - 算法
tags:
  - Python
  - 双指针
  - LeetCode
  - 算法基础
description: 从两数之和的暴力枚举开始，用图解和严格推导理解相向双指针为什么不会漏解，并进一步写出三数之和。
---

<nav class="series-nav" aria-label="算法系列导航">
  <span class="series-nav__prev series-nav__pending">← 这是第一篇</span>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <span class="series-nav__next series-nav__pending">下一篇：容器与接雨水 →</span>
</nav>

给你一个**已经升序排列**的数组和一个目标值，怎样找出和等于目标值的两个数？

这道题真正要学的不是一段 `while` 模板，而是一个可迁移的判断：**利用有序性，一次比较就排除一整批不可能的答案。**

<!-- more -->

## 1. 这节解决什么问题？

先用最小例子说明输入与输出：

```text
输入：nums = [2, 7, 11, 15]，target = 9
输出：[1, 2]
解释：nums[0] + nums[1] = 2 + 7 = 9
```

这里输出的是 LeetCode 167 要求的 **从 1 开始计数的下标**，所以 Python 下标 `0, 1` 要返回成 `[1, 2]`。

“指针”在这篇里并不是一个神秘的数据结构。你可以先把它理解成：**保存数组下标的整数变量**。`left = 0` 表示看最左边元素，`right = len(nums) - 1` 表示看最右边元素。

## 2. 从暴力解法开始

最直接的方法是枚举所有下标对 `(i, j)`：固定第一个数，再逐个尝试它右边的数。

```python
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i + 1, j + 1]
    return []
```

### 暴力为什么慢？

长度为 `n` 的数组共有：

```text
(n - 1) + (n - 2) + ... + 1 = n(n - 1) / 2
```

个下标对。数量级与 `n²` 成正比，因此时间复杂度是 **O(n²)**。数组有序这个重要条件，在暴力解法中完全没有被利用。

空间复杂度是 **O(1)**，因为除去返回结果，只使用了 `i`、`j` 等固定数量的变量；输入变长也不会创建同样变长的额外容器。

## 3. 核心思想：从两端夹逼

一句话记忆：

<div class="pattern-card"><strong>左右各放一个指针，根据当前和偏大还是偏小，排除一整片不可能区域。</strong></div>

做法如下：

1. `left` 指向最小的候选数，`right` 指向最大的候选数。
2. 计算 `current = nums[left] + nums[right]`。
3. 如果 `current == target`，找到答案。
4. 如果 `current < target`，让 `left` 右移，尝试把和增大。
5. 如果 `current > target`，让 `right` 左移，尝试把和减小。

<figure class="algorithm-figure">
  <img src="/images/algorithms/01-two-pointers/pointer-movement.svg" alt="相向双指针在 2、7、11、15 中寻找和为 9 的数对，右指针逐步左移" loading="eager">
  <figcaption>两个指针只向中间移动。已经排除的 15、11 不会再被检查。</figcaption>
</figure>

## 4. 为什么这样移动不会漏掉答案？

这是整篇最重要的部分。只说“和小就移动左边，和大就移动右边”不够，我们要证明被丢掉的候选确实不可能是答案。

设当前指针是 `left` 和 `right`，数组升序。

### 情况一：当前和小于 target

```python
nums[left] + nums[right] < target
```

`nums[right]` 已经是当前区间里最大的数。固定 `left` 后，把 `right` 换成任何更靠左的下标 `j`，都有：

```text
nums[left] + nums[j] <= nums[left] + nums[right] < target
```

也就是说，**当前 `left` 和区间内任何数配对都太小**。所以包含 `left` 的所有候选都可以排除，安全地执行 `left += 1`。

注意：此时如果移动 `right`，右边的数只会更小，离目标更远；更重要的是，你没有证明可以丢掉当前 `right`。

### 情况二：当前和大于 target

```python
nums[left] + nums[right] > target
```

`nums[left]` 已经是当前区间里最小的数。固定 `right` 后，把 `left` 换成任何更靠右的下标 `i`，都有：

```text
nums[i] + nums[right] >= nums[left] + nums[right] > target
```

因此，**当前 `right` 和区间内任何数配对都太大**。包含 `right` 的候选全都不可能是答案，可以执行 `right -= 1`。

<figure class="algorithm-figure">
  <img src="/images/algorithms/01-two-pointers/search-space.svg" alt="双指针通过一次比较排除二维候选表中的整列搜索空间" loading="lazy">
  <figcaption>双指针快的原因不是“少写了一层循环”，而是每一步都有依据地淘汰整行或整列候选。</figcaption>
</figure>

### 成立所依赖的前提

上面的不等式推导依赖数组升序。如果数组是 `[7, 1, 9, 2]`，移动指针后数值不一定按预期变大或变小，排除结论就不成立。

无序数组的两数之和通常有两种选择：

- 用哈希表记录见过的数，做到 O(n) 时间和 O(n) 空间；
- 先排序再用双指针，做到 O(n log n) 时间，但如果要返回原下标，需要额外保存下标。

## 5. 两数之和模板

推导清楚以后，代码只是把三个分支翻译出来：

```python
def two_sum_sorted(nums, target):
    left = 0
    right = len(nums) - 1

    while left < right:
        current = nums[left] + nums[right]

        if current == target:
            return [left + 1, right + 1]
        if current < target:
            left += 1
        else:
            right -= 1

    return []
```

这里使用 `left < right`，因为题目要求两个不同位置的元素。当 `left == right` 时，两个指针指向同一个元素，不能把它使用两次。

## 6. 手工模拟一次

输入：

```python
nums = [2, 7, 11, 15]
target = 9
```

| step | left | right | 当前两个数 | 当前和 | 操作 |
|---:|---:|---:|---|---:|---|
| 1 | 0 | 3 | 2 和 15 | 17 | 太大，`right -= 1` |
| 2 | 0 | 2 | 2 和 11 | 13 | 太大，`right -= 1` |
| 3 | 0 | 1 | 2 和 7 | 9 | 找到，返回 `[1, 2]` |

你可以把循环不变量理解成：

> 每轮开始时，如果答案存在，那么答案一定还在闭区间 `[left, right]` 的候选对中。

每次移动前我们都证明了被排除的一端不可能参与答案，所以这个说法始终成立。

## 7. 从两数之和推广到三数之和

LeetCode 15 要找所有满足 `a + b + c = 0` 的不重复三元组。可以把它拆成：

1. 先排序。
2. 枚举第一个数 `nums[i]`。
3. 在 `i` 右侧的有序区间，用相向双指针寻找和等于 `-nums[i]` 的两个数。

```text
固定 nums[i]
        ↓
nums[i] + nums[left] + nums[right] 与 0 比较
        ↓
小于 0：left 右移；大于 0：right 左移
```

完整实现：

```python
def three_sum(nums):
    nums = sorted(nums)
    answer = []
    n = len(nums)

    for i in range(n - 2):
        # 与上一次固定的数相同，会产生重复三元组
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        # 当前最小的三个数都大于 0，后面只会更大
        if nums[i] + nums[i + 1] + nums[i + 2] > 0:
            break

        # 当前数与最大的两个数相加仍小于 0，本轮不可能成功
        if nums[i] + nums[n - 2] + nums[n - 1] < 0:
            continue

        left = i + 1
        right = n - 1

        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                answer.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1

                # 跳过相同值，避免记录重复三元组
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1

    return answer
```

### 为什么三数之和要去重？

输入 `[-2, 0, 0, 2, 2]` 中，下标组合不止一个，但数值三元组 `[-2, 0, 2]` 只能在答案里出现一次。

去重分两层：

- `i` 与前一个固定值相同时，跳过整个本轮；
- 找到答案后，`left`、`right` 先移动一步，再越过与刚才相同的值。

不能在尚未找到答案时随意跳过所有重复值；先明确“这一层在避免哪一种重复”，代码才不容易错。

## 8. 复杂度分析

### 两数之和

- **时间复杂度 O(n)**：`left` 只会向右移动，`right` 只会向左移动。两者各自最多走 `n - 1` 步，并不是在彼此内部重新遍历数组，所以总操作次数与 `n` 成正比。
- **空间复杂度 O(1)**：只使用两个下标和当前和，不随输入长度增长。

### 三数之和

- **时间复杂度 O(n²)**：排序需要 O(n log n)；外层枚举最多 O(n) 次，每次内部双指针最多 O(n)，合计 O(n²)，它主导了排序时间。
- **空间复杂度**：如果不计算返回答案，取决于排序实现。这里 `sorted(nums)` 创建新列表，需要 O(n) 额外空间；如果原地 `nums.sort()`，Python 排序本身仍可能使用额外内存。

## 9. 什么时候想到相向双指针？

看到下面的组合信号时，优先检查双指针：

<div class="pattern-card"><strong>有序数组 + 选择两个位置 + 结果随左右端移动具有单调变化</strong><br>↓<br>尝试从两端向中间收缩，并证明每次能排除哪一批候选。</div>

常见表述包括：

- 在有序数组中找和为目标值的两个数；
- 统计和小于某个值的数对数量；
- 固定一个数后，在剩余有序区间找两个数；
- 从数组两端选择、比较或收缩范围。

只有“两个变量”并不等于能用双指针。必须存在可证明的单调性；否则移动任意一端都可能漏掉答案。

## 10. 常见坑

### 坑 1：无序数组直接夹逼

```python
# 错误：nums 没有保证有序
if nums[left] + nums[right] < target:
    left += 1
```

修正：先确认题目给出有序条件，或者先排序并处理原下标问题。

### 坑 2：写成 `left <= right`

```python
while left <= right:  # 可能把同一个位置使用两次
```

找两个不同元素时用 `left < right`。二分查找是否使用 `<=` 是另一个问题，取决于二分的区间定义，不能把模板混用。

### 坑 3：返回了 Python 下标

LeetCode 167 要求从 1 开始：

```python
return [left + 1, right + 1]
```

而大多数 LeetCode 题使用从 0 开始的下标。先读输出定义，不要机械地 `+1`。

### 坑 4：三数之和在错误的位置去重

固定值去重使用：

```python
if i > 0 and nums[i] == nums[i - 1]:
    continue
```

如果拿 `nums[i] == nums[i + 1]` 当条件，会提前跳过某个值第一次出现的位置，可能漏解。

### 坑 5：把 `sort()` 的返回值赋回去

```python
nums = nums.sort()  # 错误：nums 变成 None
```

Python 的 `list.sort()` 原地修改列表并返回 `None`。使用 `nums.sort()`，或者写 `nums = sorted(nums)` 得到新列表。

## 11. Python 补充

### `range(n - 2)` 为什么停在那里？

三数之和中，固定第一个数后，右边至少还要有两个数。因此 `i` 最大只能到 `n - 3`。`range(n - 2)` 产生 `0` 到 `n - 3`，恰好符合要求。

### `sorted()` 与 `.sort()`

| 写法 | 是否修改原列表 | 返回值 |
|---|---|---|
| `sorted(nums)` | 否 | 新的已排序列表 |
| `nums.sort()` | 是 | `None` |

教程代码使用 `sorted(nums)`，避免调用函数后悄悄改变外部传入的列表。

## 12. 典型练习题

先做入门题，能独立解释指针为什么移动，再做变形。

### 入门

- [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)（中等）  
  观察：数组已排序，当前和相对 `target` 的大小能决定排除哪一端。
- [2824. 统计和小于目标的下标对数目](https://leetcode.cn/problems/count-pairs-whose-sum-is-less-than-target/)（简单）  
  提示：当 `nums[left] + nums[right] < target` 时，固定 `left`，中间有多少个 `right` 都成立？

### 标准

- [15. 三数之和](https://leetcode.cn/problems/3sum/)（中等）  
  观察：排序后固定一个数，把问题降成两数之和；重点是两层去重。
- [16. 最接近的三数之和](https://leetcode.cn/problems/3sum-closest/)（中等）  
  提示：每轮先用当前三数和更新“距离目标最近的答案”，再移动指针。

### 进阶

- [18. 四数之和](https://leetcode.cn/problems/4sum/)（中等）  
  观察：再多固定一层就能降成两数之和，但要处理去重和剪枝。
- [611. 有效三角形的个数](https://leetcode.cn/problems/valid-triangle-number/)（中等）  
  提示：排序后固定最长边，条件变成“两条短边之和大于最长边”；一次成立时能批量统计多少对？

<details>
<summary>检查答案：两数之和完整代码</summary>

```python
def two_sum(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left < right:
        current = numbers[left] + numbers[right]
        if current < target:
            left += 1
        elif current > target:
            right -= 1
        else:
            return [left + 1, right + 1]

    return []
```

先确认你能不看代码回答：和太小时，为什么固定 `left` 的所有其他配对都不可能？
</details>

## 13. 本节你应该掌握

- [ ] 能说出相向双指针的前提：有序性和单调变化。
- [ ] 能解释和偏小时为什么移动 `left`，而不是只背结论。
- [ ] 能手动画出 `[2, 7, 11, 15]` 的三轮变化。
- [ ] 能独立写出 LeetCode 167 的模板并处理下标规则。
- [ ] 能把三数之和拆成“枚举一个数 + 双指针”。
- [ ] 能解释三数之和的两层去重。
- [ ] 至少完成 167 和 2824，再挑战 15。

## 下一节

下一节将继续使用相向双指针，但判断依据不再是“两数和”：我们会解释盛水容器为什么必须移动短板，以及接雨水中怎样只凭一侧确定当前位置的水量。

<nav class="series-nav" aria-label="算法系列导航">
  <span class="series-nav__prev series-nav__pending">← 这是第一篇</span>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  <span class="series-nav__next series-nav__pending">下一篇：容器与接雨水 →</span>
</nav>

课程顺序参考：[灵茶山艾府《基础算法精讲 01》](https://www.bilibili.com/video/BV1bP411c7oJ/)；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。本文讲解、代码组织与图解均为独立编写。
