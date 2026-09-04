
# Article 02: 容器与接雨水
def max_area(height):
    left = 0
    right = len(height) - 1
    answer = 0

    while left < right:
        width = right - left
        answer = max(answer, width * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return answer


def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0

    while left <= right:
        left_max = max(left_max, height[left])
        right_max = max(right_max, height[right])
        if left_max <= right_max:
            water += left_max - height[left]
            left += 1
        else:
            water += right_max - height[right]
            right -= 1
    return water


# Article 03: 滑动窗口
def min_subarray_len(target, nums):
    left = 0
    total = 0
    answer = len(nums) + 1

    for right, value in enumerate(nums):
        total += value

        while total >= target:
            answer = min(answer, right - left + 1)
            total -= nums[left]
            left += 1

    return 0 if answer == len(nums) + 1 else answer


# Article 04: 二分查找
def lower_bound(nums, target):
    left = 0
    right = len(nums)  # 搜索区间 [left, right)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] >= target:
            right = mid
        else:
            left = mid + 1

    return left


# Article 05: 二分查找变形
def find_peak(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left


def find_min_rotated(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[right]:
            right = mid
        else:
            left = mid + 1
    return nums[left]


# Article 06: 反转链表
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    prev = None
    cur = head

    while cur is not None:
        next_node = cur.next
        cur.next = prev
        prev = cur
        cur = next_node

    return prev


# Article 07: 快慢指针
def has_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


def detect_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            seeker = head
            while seeker is not slow:
                seeker = seeker.next
                slow = slow.next
            return seeker
    return None


# Article 08: 链表删除与前后指针
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


# Article 09: 二叉树递归基础
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


# Article 10: 二叉树递归进阶
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


# Article 11: 遍历与二叉搜索树
def is_valid_bst(root):
    def dfs(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return (dfs(node.left, low, node.val)
                and dfs(node.right, node.val, high))

    return dfs(root, float('-inf'), float('inf'))


# Article 12: 最近公共祖先
def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left is not None and right is not None:
        return root
    return left if left is not None else right


# Article 13: 二叉树 BFS
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


# Article 14: 子集型回溯
def subsets(nums):
    answer = []
    path = []

    def dfs(i):
        if i == len(nums):
            answer.append(path.copy())
            return

        dfs(i + 1)  # 不选 nums[i]

        path.append(nums[i])
        dfs(i + 1)  # 选择 nums[i]
        path.pop()

    dfs(0)
    return answer


# Article 15: 组合型回溯
def combine(n, k):
    answer = []
    path = []

    def dfs(start):
        if len(path) == k:
            answer.append(path.copy())
            return

        need = k - len(path)
        max_first = n - need + 1
        for value in range(start, max_first + 1):
            path.append(value)
            dfs(value + 1)
            path.pop()

    dfs(1)
    return answer


# Article 16: 排列型回溯
def permute(nums):
    answer = []
    path = []
    used = [False] * len(nums)

    def dfs():
        if len(path) == len(nums):
            answer.append(path.copy())
            return

        for i, value in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(value)
            dfs()
            path.pop()
            used[i] = False

    dfs()
    return answer


# Article 17: 动态规划入门
def rob(nums):
    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]

    for money in nums:
        current = max(prev1, prev2 + money)
        prev2 = prev1
        prev1 = current

    return prev1


# Article 18: 背包 DP
def can_partition(nums):
    total = sum(nums)
    if total % 2 == 1:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for value in nums:
        for capacity in range(target, value - 1, -1):
            dp[capacity] = dp[capacity] or dp[capacity - value]
    return dp[target]


def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for value in range(coin, amount + 1):
            dp[value] = min(dp[value], dp[value - coin] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]


# Article 19: 最长公共子序列
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]


# Article 20: 最长递增子序列
from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for value in nums:
        index = bisect_left(tails, value)
        if index == len(tails):
            tails.append(value)
        else:
            tails[index] = value
    return len(tails)


# Article 21: 状态机 DP
def max_profit_with_cooldown(prices):
    if not prices:
        return 0

    hold = -prices[0]
    sold = float('-inf')
    rest = 0

    for price in prices[1:]:
        new_hold = max(hold, rest - price)
        new_sold = hold + price
        new_rest = max(rest, sold)
        hold, sold, rest = new_hold, new_sold, new_rest

    return max(sold, rest)


# Article 22: 区间 DP
def longest_palindrome_subseq(s):
    n = len(s)
    if n == 0:
        return 0

    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1

    for length in range(2, n + 1):
        for left in range(0, n - length + 1):
            right = left + length - 1
            if s[left] == s[right]:
                dp[left][right] = 2 + (dp[left + 1][right - 1] if length > 2 else 0)
            else:
                dp[left][right] = max(dp[left + 1][right], dp[left][right - 1])

    return dp[0][n - 1]


# Article 23: 树形 DP：直径
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


# Article 24: 树形 DP：最大独立集
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


# Article 25: 树形 DP：最小支配集
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


# Article 26: 单调栈
def daily_temperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []

    for index, temperature in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temperature:
            previous = stack.pop()
            answer[previous] = index - previous
        stack.append(index)

    return answer


# Article 27: 单调队列
from collections import deque

def max_sliding_window(nums, k):
    if not nums or k <= 0:
        return []

    queue = deque()  # 保存下标，对应值严格递减
    answer = []

    for index, value in enumerate(nums):
        left = index - k + 1
        if queue and queue[0] < left:
            queue.popleft()

        while queue and nums[queue[-1]] <= value:
            queue.pop()
        queue.append(index)

        if left >= 0:
            answer.append(nums[queue[0]])

    return answer


# Article 28: 前缀和与差分
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for index, value in enumerate(nums):
        prefix[index + 1] = prefix[index] + value
    return prefix


def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]


def apply_range_updates(length, updates):
    diff = [0] * (length + 1)
    for left, right, delta in updates:
        diff[left] += delta
        diff[right + 1] -= delta

    nums = [0] * length
    running = 0
    for index in range(length):
        running += diff[index]
        nums[index] = running
    return nums


def linked(values, cycle_at=None):
    nodes = [ListNode(value) for value in values]
    for left, right in zip(nodes, nodes[1:]):
        left.next = right
    if nodes and cycle_at is not None:
        nodes[-1].next = nodes[cycle_at]
    return (nodes[0] if nodes else None), nodes


def linked_values(head, limit=20):
    result = []
    while head is not None and len(result) < limit:
        result.append(head.val)
        head = head.next
    return result


assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
assert max_area([]) == 0 and max_area([5]) == 0 and max_area([1, 1]) == 1
assert trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6
assert trap([]) == 0 and trap([1]) == 0 and trap([2, 2, 2]) == 0

assert min_subarray_len(7, [2, 3, 1, 2, 4, 3]) == 2
assert min_subarray_len(1, []) == 0 and min_subarray_len(7, [7]) == 1
assert min_subarray_len(4, [2, 2, 2]) == 2

assert lower_bound([], 3) == 0
assert lower_bound([1], 1) == 0 and lower_bound([1], 2) == 1
assert lower_bound([1, 2, 2, 4], 2) == 1 and lower_bound([1, 3, 5], 4) == 2

peak_data = [1, 2, 3, 1]
peak_index = find_peak(peak_data)
assert peak_index == 2 and find_peak([1]) == 0
assert find_min_rotated([3, 4, 5, 1, 2]) == 1
assert find_min_rotated([1]) == 1 and find_min_rotated([2, 1]) == 1

head, _ = linked([1, 2, 3, 4])
assert linked_values(reverse_list(head)) == [4, 3, 2, 1]
assert reverse_list(None) is None
single, _ = linked([7])
assert reverse_list(single) is single
head, _ = linked([2, 2])
assert linked_values(reverse_list(head)) == [2, 2]

assert has_cycle(None) is False
head, nodes = linked([1])
assert has_cycle(head) is False
head, nodes = linked([3, 2, 0, -4], 1)
assert has_cycle(head) is True and detect_cycle(head) is nodes[1]
self_cycle, nodes = linked([9], 0)
assert detect_cycle(self_cycle) is nodes[0]

head, _ = linked([1, 2, 3, 4, 5])
assert linked_values(remove_nth_from_end(head, 2)) == [1, 2, 3, 5]
head, _ = linked([1])
assert remove_nth_from_end(head, 1) is None
head, _ = linked([1, 1, 1])
assert linked_values(remove_nth_from_end(head, 3)) == [1, 1]

tree = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
assert max_depth(tree) == 3 and max_depth(None) == 0 and max_depth(TreeNode(1)) == 1
assert is_balanced(tree) is True
unbalanced = TreeNode(1, TreeNode(2, TreeNode(3)))
assert is_balanced(unbalanced) is False and is_balanced(None) is True

bst = TreeNode(5, TreeNode(3), TreeNode(7, TreeNode(6), TreeNode(8)))
assert is_valid_bst(bst) is True and is_valid_bst(None) is True
assert is_valid_bst(TreeNode(5, None, TreeNode(7, TreeNode(4)))) is False
assert is_valid_bst(TreeNode(2, TreeNode(2), None)) is False

p_node, q_node = bst.left, bst.right.left
assert lowest_common_ancestor(bst, p_node, q_node) is bst
assert lowest_common_ancestor(bst, bst.right, q_node) is bst.right
assert level_order(None) == []
assert level_order(tree) == [[1], [2, 3], [4, 5]]

assert sorted(subsets([1, 2])) == [[], [1], [1, 2], [2]]
assert subsets([]) == [[]] and len(subsets([1, 1])) == 4
assert combine(4, 2) == [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
assert combine(1, 1) == [[1]] and combine(3, 0) == [[]]
assert sorted(permute([1, 2, 3])) == sorted([[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]])
assert permute([]) == [[]] and permute([1]) == [[1]]

assert rob([2, 7, 9, 3, 1]) == 12
assert rob([]) == 0 and rob([5]) == 5 and rob([2, 2, 2]) == 4
assert can_partition([1, 5, 11, 5]) is True
assert can_partition([]) is True and can_partition([1]) is False
assert can_partition([2, 2, 3, 5]) is False
assert coin_change([1, 2, 5], 11) == 3
assert coin_change([], 3) == -1 and coin_change([2], 0) == 0
assert coin_change([2], 3) == -1

assert longest_common_subsequence('abcde', 'ace') == 3
assert longest_common_subsequence('', 'abc') == 0
assert longest_common_subsequence('a', 'a') == 1
assert longest_common_subsequence('aaa', 'aa') == 2
assert length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]) == 4
assert length_of_lis([]) == 0 and length_of_lis([1]) == 1
assert length_of_lis([2, 2, 2]) == 1

assert max_profit_with_cooldown([1, 2, 3, 0, 2]) == 3
assert max_profit_with_cooldown([]) == 0
assert max_profit_with_cooldown([1]) == 0
assert max_profit_with_cooldown([1, 1, 1]) == 0
assert longest_palindrome_subseq('bbbab') == 4
assert longest_palindrome_subseq('') == 0
assert longest_palindrome_subseq('a') == 1
assert longest_palindrome_subseq('aaaa') == 4

assert diameter_of_binary_tree(tree) == 3
assert diameter_of_binary_tree(None) == 0 and diameter_of_binary_tree(TreeNode(1)) == 0
rob_tree_sample = TreeNode(3, TreeNode(2, None, TreeNode(3)), TreeNode(3, None, TreeNode(1)))
assert rob_tree(rob_tree_sample) == 7
assert rob_tree(None) == 0 and rob_tree(TreeNode(4)) == 4
camera_tree = TreeNode(0, TreeNode(0, TreeNode(0), TreeNode(0)))
assert min_camera_cover(camera_tree) == 1
assert min_camera_cover(None) == 0 and min_camera_cover(TreeNode(0)) == 1

assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]
assert daily_temperatures([]) == [] and daily_temperatures([1]) == [0]
assert daily_temperatures([2, 2, 2]) == [0, 0, 0]
assert max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [3, 3, 5, 5, 6, 7]
assert max_sliding_window([], 3) == [] and max_sliding_window([1], 1) == [1]
assert max_sliding_window([2, 2, 2], 2) == [2, 2]

prefix = build_prefix([2, -1, 3, 5])
assert prefix == [0, 2, 1, 4, 9]
assert range_sum(prefix, 1, 3) == 7
assert range_sum(prefix, 0, 0) == 2
assert build_prefix([]) == [0]
assert apply_range_updates(5, [(1, 3, 2), (2, 4, 3)]) == [0, 2, 5, 5, 3]
assert apply_range_updates(0, []) == []
assert apply_range_updates(3, [(0, 2, -1)]) == [-1, -1, -1]

print('algorithm series: all generated article implementations passed')
