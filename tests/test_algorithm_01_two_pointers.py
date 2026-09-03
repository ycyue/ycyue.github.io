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


def three_sum(nums):
    nums = sorted(nums)
    answer = []
    n = len(nums)

    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        if nums[i] + nums[i + 1] + nums[i + 2] > 0:
            break
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
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
    return answer


def run_tests():
    # LeetCode 167 samples and required boundaries.
    assert two_sum_sorted([2, 7, 11, 15], 9) == [1, 2]
    assert two_sum_sorted([2, 3, 4], 6) == [1, 3]
    assert two_sum_sorted([-1, 0], -1) == [1, 2]
    assert two_sum_sorted([], 3) == []
    assert two_sum_sorted([3], 6) == []
    assert two_sum_sorted([1, 1, 3], 2) == [1, 2]
    assert two_sum_sorted([1, 2, 3], 10) == []

    # LeetCode 15 samples and duplicate-heavy boundaries.
    assert three_sum([-1, 0, 1, 2, -1, -4]) == [[-1, -1, 2], [-1, 0, 1]]
    assert three_sum([0, 1, 1]) == []
    assert three_sum([0, 0, 0]) == [[0, 0, 0]]
    assert three_sum([]) == []
    assert three_sum([0]) == []
    assert three_sum([-2, 0, 0, 2, 2]) == [[-2, 0, 2]]


if __name__ == "__main__":
    run_tests()
    print("algorithm-01: all tests passed")

