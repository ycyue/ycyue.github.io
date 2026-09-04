const q = (level, id, name, slug, difficulty, hint) => ({ level, id, name, slug, difficulty, hint });
const p = (title, wrong, fix) => ({ title, wrong, fix });

export const firstCourse = {
  n: 1,
  short: '相向双指针（一）',
  slug: 'two-pointers',
  file: 'algorithm-01-two-pointers',
  permalink: '2026/09/04/algorithm-01-two-pointers/',
  mapTitle: '相向双指针（一）：两数之和、三数之和',
  difficulty: '入门',
  prerequisite: '列表、排序、循环',
};

export const stages = [
  { name: 'Stage 1：数组与基础算法思想', courses: [1,2,3,4,5] },
  { name: 'Stage 2：链表', courses: [6,7,8] },
  { name: 'Stage 3：二叉树', courses: [9,10,11,12,13] },
  { name: 'Stage 4：回溯', courses: [14,15,16] },
  { name: 'Stage 5：动态规划', courses: [17,18,19,20,21,22] },
  { name: 'Stage 6：树形 DP', courses: [23,24,25] },
  { name: 'Stage 7：单调数据结构', courses: [26,27] },
];

export const articles = [
  {
    n: 2, slug: 'two-pointers-container-rainwater', file: 'algorithm-02-two-pointers-container-rainwater',
    permalink: '2026/09/04/algorithm-02-two-pointers-container-rainwater/', short: '容器与接雨水',
    title: '相向双指针（二）：为什么移动短板', tag: '双指针', difficulty: '标准', prerequisite: '01、有序数组双指针',
    video: 'https://www.bilibili.com/video/BV1Qg411q7ia/',
    description: '从盛最多水的容器和接雨水出发，图解为什么双指针必须移动短板，以及何时能确定一侧水量。',
    lead: '两根柱子围成的容器，面积由“宽度 × 短板高度”决定。指针向内移动后宽度必然变小，怎样移动才仍有机会得到更大面积？',
    problem: { input: '一组非负柱高，例如 `[1,8,6,2,5,4,8,3,7]`。', output: '两根柱子能围成的最大面积；进阶问题是所有位置能接到的雨水总量。', brute: '枚举所有左右边界，计算每个容器；接雨水则对每个位置向两边找最高柱。', bottleneck: '容器有 O(n²) 个边界对；逐点扫描左右最高值也会重复走相同区间。' },
    bruteCode: `def max_area_brute(height):
    answer = 0
    for left in range(len(height)):
        for right in range(left + 1, len(height)):
            area = (right - left) * min(height[left], height[right])
            answer = max(answer, area)
    return answer`,
    bruteAnalysis: '双层循环枚举每一对边界，时间复杂度是 O(n²)。它清楚展示了面积只由宽度和较矮边界决定，这正是优化的突破口。',
    core: '宽度变小不可避免，所以只移动短板：保留长板，才可能用更高的新短板抵消宽度损失。',
    coreDetail: '如果左柱更矮，移动右侧长板后，宽度变小且短板仍不高于左柱，面积一定不会增加；因此所有以当前左柱为边界的更窄容器都可排除。接雨水也用类似思想：较小的左侧最高值已经足以确定左端水量。',
    kind: 'array',
    steps: [['初始边界','left=0，right=n-1，先计算当前面积'],['比较短板','面积高度由 min(left,right) 决定'],['移动短板','左矮则 left++，右矮则 right--'],['持续更新','每轮更新最大面积，直到指针相遇']],
    proofSteps: [['不可改变','指针内移后，容器宽度一定减少'],['唯一机会','面积要变大，新短板必须比旧短板更高'],['安全排除','移动长板不会提高受旧短板限制的高度'],['循环不变量','未检查的最优解仍位于新区间内']],
    figureCaption: '每轮比较的不是“哪边更好看”，而是哪一边已经成为上限。',
    proof: [['左边是短板时','设 `height[left] <= height[right]`。固定 `left`，把右端换成任何更靠左的位置 `j`，新宽度更小，而有效高度 `min(height[left], height[j])` 不会超过 `height[left]`，所以面积不可能超过当前值。当前 `left` 可以整体淘汰。'],['两边等高时','两侧都形成同一个高度上限。移动任意一侧都不会漏掉比当前更大的容器；代码选择移动右侧只是统一写法。'],['接雨水为什么看较小的最高值','若 `left_max <= right_max`，左端右边至少存在一根高达 `right_max` 的柱子。左端水面只能由较小的 `left_max` 限制，因此此刻水量 `left_max - height[left]` 已经确定，无需知道右侧最高柱的精确位置。']],
    template: `def max_area(height):
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
    return water`,
    templateNotes: '`max_area` 比较当前柱高；`trap` 比较的是两侧已经见过的最高柱。两个问题形式相似，但不要混用判断量。',
    example: { input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]', headers: ['轮次','left/right','短板','面积','移动'], rows: [['1','0 / 8','1','8','left++'],['2','1 / 8','7','49','right--'],['3','1 / 7','3','18','right--'],['4','1 / 6','8','40','right--']], conclusion: '第二轮得到面积 49。之后即使出现等高柱，剩余宽度也不足以超过 49。' },
    time: 'O(n)', timeWhy: '左右指针只向中间走，每个位置最多成为一次边界。', space: 'O(1)', spaceWhy: '只维护指针、最大高度和答案等固定数量变量。',
    signalFormula: '两端边界 + 宽度随收缩变小 + 短板决定上限 → 移动短板',
    signals: ['从两端选择边界形成容器或区间。','目标由较弱的一侧限制。','移动一端后可以证明旧边界再也不可能产生更优答案。'],
    pitfalls: [p('总是移动较高的一边','if height[left] < height[right]:\n    right -= 1','这会保留真正的瓶颈，宽度却不断减小。应淘汰较矮边界。'),p('接雨水直接比较当前柱','', '`trap` 需要比较 `left_max` 和 `right_max`，因为水面由两侧历史最高柱决定。'),p('空数组访问下标','', '模板中 `trap` 对空数组会让 `right=-1` 且循环不进入，因此安全；修改循环前仍要重新检查空输入。')],
    python: { title: '`min()` 与 `max()` 表达边界', body: '`min(a, b)` 表示容器短板，`max(old, new)` 表示把当前结果纳入历史最优。把这两个角色分清，代码会更接近推导。' },
    exercises: [q('入门','11','盛最多水的容器','container-with-most-water','中等','先写面积公式，再证明移动长板不可能改进。'),q('标准','42','接雨水','trapping-rain-water','困难','维护左右最高值；较小的一侧可以立刻结算。'),q('标准','125','验证回文串','valid-palindrome','简单','左右向中间移动，先跳过非字母数字字符。'),q('进阶','1616','分割两个字符串得到回文串','split-two-strings-to-make-palindrome','中等','从两端匹配两个字符串，第一次失败后检查剩余段。')],
    checklist: ['能用“宽度必减、短板限高”证明移动规则。','能独立写出 `max_area`。','能区分当前柱高与两侧最高值。','能手算接雨水一轮的结算过程。','完成 11 和 42。'],
    nextIntro: '下一节把两个边界改造成可伸缩的连续窗口：右端负责加入元素，左端负责恢复窗口条件。'
  },
  {
    n: 9, slug: 'binary-tree-recursion', file: 'algorithm-09-binary-tree-recursion', permalink: '2026/09/04/algorithm-09-binary-tree-recursion/',
    short: '二叉树递归基础', title: '二叉树递归基础：把大树交给两棵子树', tag: '二叉树', difficulty: '入门', prerequisite: '函数、递归概念', video: 'https://www.bilibili.com/video/BV1UD4y1Y769/',
    description: '从最大深度出发，图解二叉树递归的返回值、基本情况和自底向上信息合并。',
    lead: '递归不是“函数自己调用自己”这么简单。树上递归最稳定的思考顺序是：当前函数代表哪棵子树？空树返回什么？左右子树各返回什么？当前节点怎样合并？',
    problem: { input: '一棵二叉树的根节点。', output: '树的最大深度。', brute: '枚举所有从根出发的路径，记录最长路径节点数。', bottleneck: '若不断复制路径列表，会产生额外存储；更重要的是没有利用“整棵树深度由左右子树深度决定”的结构。' },
    bruteCode: `def max_depth_paths(root):
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
    return answer`,
    bruteAnalysis: '显式栈方法是正确的 O(n) 解法，但它把递归调用栈手动写了出来。递归能更直接表达子树定义。',
    core: '定义 dfs(node) 为“以 node 为根的子树最大深度”；答案就是 1 + 左右子树深度的较大值。',
    coreDetail: '空节点代表空树，深度为 0。非空节点自己贡献 1 层，剩余深度来自更深的那棵子树。先得到孩子返回值再计算当前值，属于自底向上的后序递归。',
    kind: 'tree', treeLabels: ['1','2','3','4','5'],
    steps: [['函数含义','dfs(node) 返回 node 子树的最大深度'],['基本情况','node=None 时返回 0'],['递归子问题','分别求 dfs(node.left) 与 dfs(node.right)'],['合并返回','max(left,right)+1']],
    proofSteps: [['规模缩小','左右子树都比当前树更小'],['基本情况','空树深度定义为 0'],['归纳假设','递归调用正确返回两棵子树深度'],['合并正确','最长根路径必经过较深子树']],
    figureCaption: '节点 2 收到孩子 4、5 的深度后返回 2；根节点再把它变成 3。',
    proof: [['为什么能拆成左右子树','从当前根到任一叶子的路径，第一步只能进入左子树或右子树。最长路径必然等于两棵子树最长路径中的较大者，再加当前根这一层。'],['为什么空节点返回 0','空树没有节点。叶子节点的左右孩子都为空，于是它返回 `max(0,0)+1=1`，与“叶子深度为 1”的定义一致。'],['递归为什么会停','每次调用都进入更小的子树，最终遇到 None。有限节点的树不可能无限下降。']],
    template: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def max_depth(root):
    if root is None:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return max(left_depth, right_depth) + 1`,
    templateNotes: '先把 `max_depth(root)` 的含义写成一句话。函数含义一旦改变，基本情况和返回式也必须一起改变。',
    example: { input: '1 的孩子是 2、3；2 的孩子是 4、5', headers: ['节点','左子树返回','右子树返回','当前返回'], rows: [['4','0','0','1'],['5','0','0','1'],['2','1','1','2'],['3','0','0','1'],['1','2','1','3']], conclusion: '计算顺序从叶子向根汇总，这就是后序位置使用返回值。' },
    time: 'O(n)', timeWhy: '每个非空节点进入一次，并做常数次比较。', space: 'O(h)', spaceWhy: '递归栈深度等于树高 h；平衡树为 O(log n)，退化链状树为 O(n)。',
    signalFormula: '整棵树答案能由左右子树答案合并 → 定义子树递归函数',
    signals: ['问题天然描述“以某节点为根的子树”。','父节点只需要孩子返回少量信息。','空树能给出自然的单位值或边界值。'],
    pitfalls: [p('忘记基本情况','def dfs(node):\n    return 1 + dfs(node.left)','遇到 None 后仍访问 left，会报错。先处理空节点。'),p('函数含义中途改变','', '不要一会儿让 dfs 返回节点数，一会儿又当边数使用；深度定义要统一。'),p('只递归不返回','', '父节点依赖子树结果时必须 `return`；仅访问节点的遍历才可能不返回值。')],
    python: { title: '递归调用栈', body: '每次函数调用都保存参数和返回位置。Python 默认递归深度有限，极深的链状树可能触发 `RecursionError`；题目约束很大时可改用显式栈。' },
    exercises: [q('入门','104','二叉树的最大深度','maximum-depth-of-binary-tree','简单','定义 dfs 为子树深度。'),q('入门','111','二叉树的最小深度','minimum-depth-of-binary-tree','简单','只有一个孩子时不能错误地取 0。'),q('标准','112','路径总和','path-sum','简单','把剩余目标传给孩子。'),q('进阶','129','求根节点到叶节点数字之和','sum-root-to-leaf-numbers','中等','沿路径维护当前数字。')],
    checklist: ['能用一句话定义递归函数。','能解释空树返回值。','能区分自顶向下参数与自底向上返回值。','能分析递归栈空间。','完成 104 和 112。'],
    nextIntro: '下一节让子树返回不止一个数字，并学习在发现失败后提前终止。'
  },
  {
    n: 10, slug: 'binary-tree-recursion-advanced', file: 'algorithm-10-binary-tree-recursion-advanced', permalink: '2026/09/04/algorithm-10-binary-tree-recursion-advanced/',
    short: '二叉树递归进阶', title: '二叉树递归进阶：让返回值携带足够信息', tag: '二叉树', difficulty: '标准', prerequisite: '09、递归返回值', video: 'https://www.bilibili.com/video/BV18M411z7bb/',
    description: '用平衡二叉树图解如何设计复合返回信息和失败哨兵，避免重复计算子树高度。',
    lead: '判断平衡树时，父节点既需要孩子高度，又需要知道孩子内部是否已经不平衡。若每个节点都重新计算高度，会反复遍历同一子树。更好的办法是让一次递归同时汇报足够信息。',
    problem: { input: '一棵二叉树。', output: '判断任意节点左右子树高度差是否都不超过 1。', brute: '对每个节点分别调用高度函数，再递归检查孩子。', bottleneck: '高度函数会重复访问后代；链状树最坏达到 O(n²)。' },
    bruteCode: `def height(node):
    if node is None:
        return 0
    return max(height(node.left), height(node.right)) + 1

def is_balanced_brute(root):
    if root is None:
        return True
    return (abs(height(root.left) - height(root.right)) <= 1
            and is_balanced_brute(root.left)
            and is_balanced_brute(root.right))`,
    bruteAnalysis: '每个节点都可能再次遍历整棵子树。优化后每个节点只计算一次高度，并用 -1 表示“这棵子树已不平衡”。',
    core: '让 dfs 返回子树高度；若子树不平衡则返回 -1，把失败状态一路向上传播。',
    coreDetail: '-1 是哨兵值：正常高度永不为负，因此它不会与合法结果混淆。父节点收到 -1 后无需继续计算另一侧或高度差，可以立即返回。',
    kind: 'tree', treeLabels: ['根','左','右','深3','深1'],
    steps: [['后序计算','先得到左右子树高度'],['识别失败','任一孩子为 -1，当前也返回 -1'],['检查高度差','abs(left-right)>1 时返回 -1'],['正常汇报','返回 max(left,right)+1']],
    proofSteps: [['信息需求','父节点需要高度与平衡状态'],['哨兵编码','-1 同时表示失败，非负数表示合法高度'],['提前传播','失败子树的祖先不可能重新变平衡'],['一次遍历','每个节点只汇报一次结果']],
    figureCaption: '返回值设计得足够好，父节点不必重新深入子树寻找信息。',
    proof: [['为什么 -1 能提前返回','平衡条件要求每个节点都满足。只要某个子树内部已经违反条件，包含它的任何更大子树也一定不平衡，因此无需继续求完整高度。'],['为什么正常返回高度','若左右子树都平衡且高度差不超过 1，当前子树也平衡；其高度仍由较高子树加 1 得到。'],['如何推广复合信息','不能用单个哨兵时，可以返回元组，如 `(is_balanced, height)`。原则不是追求最短，而是让父节点一次拿到完成判断所需的全部信息。']],
    template: `def is_balanced(root):
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

    return dfs(root) != -1`,
    templateNotes: '内部 `dfs` 只服务当前题目，嵌套函数能清晰限制作用域。外层把哨兵结果转换成题目要求的布尔值。',
    example: { input: '根的左子树高度 3，右子树高度 1', headers: ['节点','左返回','右返回','当前返回'], rows: [['左侧叶子','0','0','1'],['左侧父节点','2','0','-1'],['根','-1','未再计算','-1']], conclusion: '一旦左子树返回 -1，根可直接判定失败，避免无意义遍历。' },
    time: 'O(n)', timeWhy: '每个节点至多访问一次，失败时还可能提前结束。', space: 'O(h)', spaceWhy: '主要额外空间来自递归栈。',
    signalFormula: '父节点需要子树的多种信息 + 暴力反复遍历 → 设计返回值一次汇报',
    signals: ['每个节点都要检查局部条件。','父节点需要高度、大小、最大值或真假状态。','同一子树在暴力法中被多次调用辅助函数。'],
    pitfalls: [p('把 -1 继续当高度计算','return max(left_height, right_height) + 1','收到失败哨兵后应立即传播，不能参与正常运算。'),p('只检查根的高度差','', '平衡要求所有节点都满足，子树内部失败必须汇报。'),p('重复调用 dfs','', '先把返回值保存到变量，避免同一子树求两次。')],
    python: { title: '嵌套函数', body: '把 `dfs` 定义在 `is_balanced` 内，表示它是实现细节，也能自然访问外层变量。每次调用外层函数都会创建独立的 dfs 环境。' },
    exercises: [q('入门','100','相同的树','same-tree','简单','同时递归两个节点。'),q('入门','101','对称二叉树','symmetric-tree','简单','比较外侧与内侧孩子。'),q('标准','110','平衡二叉树','balanced-binary-tree','简单','用 -1 传播失败。'),q('进阶','199','二叉树的右视图','binary-tree-right-side-view','中等','DFS 时按深度记录第一个右侧节点。')],
    checklist: ['能分析暴力重复计算在哪里。','能设计不会与合法值冲突的哨兵。','能解释失败为何可向上传播。','能写出一次遍历版本。','完成 110 和 101。'],
    nextIntro: '下一节专门比较前序、中序、后序的处理时机，并利用二叉搜索树的中序有序性。'
  },
  {
    n: 11, slug: 'bst-traversal', file: 'algorithm-11-bst-traversal', permalink: '2026/09/04/algorithm-11-bst-traversal/',
    short: '遍历与二叉搜索树', title: '前中后序与二叉搜索树：处理时机决定信息方向', tag: '二叉树', difficulty: '标准', prerequisite: '09、10', video: 'https://www.bilibili.com/video/BV14G411P7C1/',
    description: '图解前序、中序、后序处理时机，并用取值范围证明二叉搜索树是否合法。',
    lead: '前序、中序、后序的区别不是背三个字母顺序，而是“当前节点在什么时候处理”。BST 还提供一个额外性质：左子树所有值小于根，右子树所有值大于根。',
    problem: { input: '一棵二叉树。', output: '判断它是否为严格二叉搜索树。', brute: '对每个节点分别求左子树最大值和右子树最小值。', bottleneck: '重复扫描子树，且只比较直接孩子会漏掉更深层违反范围的节点。' },
    bruteCode: `def inorder_values(node, values):
    if node is None:
        return
    inorder_values(node.left, values)
    values.append(node.val)
    inorder_values(node.right, values)

def is_valid_bst_list(root):
    values = []
    inorder_values(root, values)
    return all(values[i] < values[i + 1] for i in range(len(values) - 1))`,
    bruteAnalysis: '中序列表法时间 O(n)、空间 O(n)，已经正确。范围递归不用保存全部值，只把祖先施加的上下界传给当前节点。',
    core: '前序向下传约束，中序按有序顺序访问，后序向上汇总信息；BST 验证可给每个节点传合法开区间。',
    coreDetail: '根节点范围是 `(-∞,+∞)`。进入左子树，上界收紧为根值；进入右子树，下界提高为根值。当前值只要不严格落在 `(low, high)` 内，就立即失败。',
    kind: 'tree', treeLabels: ['5','3','7','2','6'],
    steps: [['前序位置','先处理根，适合向孩子传约束'],['中序位置','左-根-右，BST 中得到严格递增序列'],['后序位置','先拿孩子结果，适合合并子树信息'],['范围验证','每层把祖先边界继续收紧']],
    proofSteps: [['BST 定义','左侧全部小于根，右侧全部大于根'],['祖先约束','节点不仅受父节点，还受所有祖先限制'],['区间传递','左孩子更新 high，右孩子更新 low'],['全局成立','每个节点都落入自己的合法范围']],
    figureCaption: '节点 6 虽小于父节点 7，却仍必须大于祖先 5；范围参数保留了这条信息。',
    proof: [['为什么只比较孩子不够','树 `5 / \\ 1 6` 中，6 的左孩子若为 4，它小于直接父节点 6，但落在根 5 的右子树中，必须大于 5。祖先范围不可丢失。'],['为什么使用开区间','题目定义严格 BST，不允许重复值。因此当前值必须满足 `low < node.val < high`，等于任一边界都失败。'],['中序法为什么成立','BST 的左子树值全部更小，右子树值全部更大；递归应用后，中序序列严格递增。反过来，若整棵树中序严格递增，也能保证每个节点满足左右关系。']],
    template: `def is_valid_bst(root):
    def dfs(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return (dfs(node.left, low, node.val)
                and dfs(node.right, node.val, high))

    return dfs(root, float('-inf'), float('inf'))`,
    templateNotes: '这里在前序位置检查当前值并向下传范围。若使用中序遍历，则保存上一个访问值并检查严格递增。',
    example: { input: '根 5，左 3，右 7；7 的左孩子是 6', headers: ['节点','合法范围','值','结果'], rows: [['5','(-∞,+∞)','5','通过'],['3','(-∞,5)','3','通过'],['7','(5,+∞)','7','通过'],['6','(5,7)','6','通过']], conclusion: '6 的范围同时包含祖先 5 与父节点 7 的约束。' },
    time: 'O(n)', timeWhy: '每个节点验证一次，失败时可提前结束。', space: 'O(h)', spaceWhy: '递归栈随树高增长；范围只是每层两个数。',
    signalFormula: 'BST + 顺序查询 → 中序；祖先约束 → 前序传范围；子树统计 → 后序返回',
    signals: ['题目出现二叉搜索树。','要求第 k 小、验证有序或按序输出。','当前节点的合法性取决于祖先范围。'],
    pitfalls: [p('只比较直接孩子','return node.left.val < node.val < node.right.val','更深节点可能违反祖先限制。'),p('允许等号','if low <= node.val <= high:','严格 BST 不允许重复，必须用开区间。'),p('空孩子访问 val','', '递归基本情况先处理 None。')],
    python: { title: '正负无穷', body: '`float("-inf")` 和 `float("inf")` 比任何有限整数都小或大，适合表示根节点初始无限范围。' },
    exercises: [q('入门','144','二叉树的前序遍历','binary-tree-preorder-traversal','简单','在递归孩子前记录节点。'),q('标准','98','验证二叉搜索树','validate-binary-search-tree','中等','向下传开区间。'),q('标准','230','二叉搜索树中第 K 小的元素','kth-smallest-element-in-a-bst','中等','中序第 k 个。'),q('进阶','938','二叉搜索树的范围和','range-sum-of-bst','简单','利用范围剪掉整棵不可能子树。')],
    checklist: ['能解释三种遍历是处理时机。','能说明只比较孩子为何错误。','能写范围递归。','能用中序有序性解决第 k 小。','完成 98 和 230。'],
    nextIntro: '下一节继续用后序返回值做分类讨论：左右子树分别是否找到目标，决定当前节点是否为最近公共祖先。'
  },
  {
    n: 12, slug: 'lowest-common-ancestor', file: 'algorithm-12-lowest-common-ancestor', permalink: '2026/09/04/algorithm-12-lowest-common-ancestor/',
    short: '最近公共祖先', title: '最近公共祖先：让子树向上汇报找到谁', tag: '二叉树', difficulty: '进阶', prerequisite: '09、11、后序递归', video: 'https://www.bilibili.com/video/BV1W44y1Z7AR/',
    description: '用后序递归分类讨论最近公共祖先，解释返回目标、返回祖先和返回空的统一含义。',
    lead: '最近公共祖先是同时包含 p、q 的最深节点。与其从根向下猜方向，不如让左右子树向上汇报：“我这里找到了 p、q，还是已经找到了它们的公共祖先？”',
    problem: { input: '二叉树根节点和两个确定存在的节点 p、q。', output: 'p、q 的最近公共祖先节点。', brute: '分别记录从根到 p、q 的完整路径，再比较最后一个相同节点。', bottleneck: '需要 O(h) 路径存储和额外路径比较；递归可直接在分叉处得到答案。' },
    bruteCode: `def lowest_common_ancestor_with_paths(root, p, q):
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
    return ancestor`,
    bruteAnalysis: '路径法是 O(n) 时间。后序方法同样 O(n)，但返回值直接表达“当前子树发现的有效节点”，不需要保存两条完整路径。',
    core: 'dfs 返回当前子树中的有效发现：None、p/q 本身，或已经确定的最近公共祖先。',
    coreDetail: '先递归左右子树。若两边都返回非空，说明 p、q 分居两侧，当前节点就是第一次汇合处；若只有一边非空，就把该结果继续向上交；当前节点本身等于 p 或 q 时直接返回自己。',
    kind: 'tree', treeLabels: ['3','5','1','6','2'],
    steps: [['基本情况','空节点返回 None；遇到 p 或 q 返回自己'],['收集左右','left=dfs(left)，right=dfs(right)'],['两边非空','p、q 分居两侧，返回当前节点'],['单边非空','把唯一有效结果继续向上传']],
    proofSteps: [['返回语义','非空结果代表子树中已发现目标或答案'],['首次分叉','左右都非空时当前节点同时覆盖两目标'],['最近保证','更深子树若已同时覆盖，会直接返回其祖先'],['向上传播','单边结果不能在当前层形成更近汇合']],
    figureCaption: '后序顺序让当前节点在拿到左右两份报告后再做决定。',
    proof: [['为什么左右非空时就是答案','左返回非空说明左子树含目标或已含共同祖先，右侧同理。若 p、q 分居两侧，任何严格后代都不可能同时覆盖两边，当前节点就是最近的共同祖先。'],['一个节点是另一个祖先怎么办','遇到 p 时直接返回 p，不再向下找 q。上层最终只会收到 p 这一条非空结果并返回 p。由于题目保证 q 存在于 p 的子树或其他结构中，p 正是公共祖先。标准证明依赖两个目标均存在。'],['为什么子树已有答案不会被覆盖','若某棵子树内部已经找到 LCA，它作为非空节点一路上传；另一侧为空时不会被替换。即使更高层另一侧出现其他信息，题目只有 p、q 两个目标，不会产生第二个目标分叉。']],
    template: `def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left is not None and right is not None:
        return root
    return left if left is not None else right`,
    templateNotes: '比较节点身份使用 `is`。若题目不保证 p、q 都存在，需要额外返回“找到几个目标”，否则只找到一个时也会错误返回它。',
    example: { input: '树 [3,5,1,6,2,0,8]，p=5，q=1', headers: ['节点','左返回','右返回','当前返回'], rows: [['5','—','—','5'],['1','—','—','1'],['3','5','1','3']], conclusion: '根 3 是左右报告第一次同时非空的位置，因此是最近公共祖先。' },
    time: 'O(n)', timeWhy: '最坏访问全部节点一次。', space: 'O(h)', spaceWhy: '递归栈由树高决定。',
    signalFormula: '两个目标分布在树中 + 要找最深汇合点 → 后序收集左右报告',
    signals: ['最近公共祖先或最小包含子树。','当前结论取决于左右子树是否发现目标。','需要从孩子向父亲传播节点身份。'],
    pitfalls: [p('只按节点值比较','if root.val == p.val:','不同节点可能同值；题目给的是节点引用。'),p('左右都空时返回 root','', '都没找到应返回 None，不能制造虚假报告。'),p('忽略目标可能不存在','', '标准模板假设两节点存在；通用版本要附带找到数量。')],
    python: { title: '条件表达式', body: '`left if left is not None else right` 表示优先返回非空的左结果，否则返回右结果；两者都空时自然返回 None。' },
    exercises: [q('入门','235','二叉搜索树的最近公共祖先','lowest-common-ancestor-of-a-binary-search-tree','中等','利用 BST 值域决定同侧或分叉。'),q('标准','236','二叉树的最近公共祖先','lowest-common-ancestor-of-a-binary-tree','中等','后序收集两侧结果。'),q('进阶','1123','最深叶节点的最近公共祖先','lowest-common-ancestor-of-deepest-leaves','中等','同时返回深度和祖先。'),q('进阶','1644','二叉树的最近公共祖先 II','lowest-common-ancestor-of-a-binary-tree-ii','中等','额外确认两个目标都存在。')],
    checklist: ['能定义 dfs 非空返回值的语义。','能完成左右结果四种分类。','能解释“最近”如何保证。','知道存在性假设。','完成 235 和 236。'],
    nextIntro: '递归擅长沿深度深入；下一节改用队列一层层扩散，建立 BFS 的分层边界。'
  },
  {
    n: 13, slug: 'binary-tree-bfs', file: 'algorithm-13-binary-tree-bfs', permalink: '2026/09/04/algorithm-13-binary-tree-bfs/',
    short: '二叉树 BFS', title: '二叉树 BFS：队列如何守住层的边界', tag: 'BFS', difficulty: '标准', prerequisite: '09、队列', video: 'https://www.bilibili.com/video/BV1hG4y1277i/',
    description: '用队列变化图解二叉树层序遍历，解释为什么先记录队列长度才能正确分层。',
    lead: 'BFS（广度优先搜索）像水波一样从根向外扩散。队列保证先进入的节点先处理，因此深度小的节点一定先于深度大的节点出队。',
    problem: { input: '一棵二叉树。', output: '按层返回节点值，例如 `[[3],[9,20],[15,7]]`。', brute: '给每个节点递归传深度，把值追加到对应下标列表。', bottleneck: '递归方案可行，但本节要掌握队列以及最短步数问题通用的 BFS 分层方式。' },
    bruteCode: `def level_order_dfs(root):
    answer = []
    def dfs(node, depth):
        if node is None:
            return
        if depth == len(answer):
            answer.append([])
        answer[depth].append(node.val)
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    dfs(root, 0)
    return answer`,
    bruteAnalysis: 'DFS 同样是 O(n)，说明“暴力”并不总更慢。选择 BFS 的原因是它天然按距离/层次处理，扩展到无权图最短路时尤其重要。',
    core: '每层开始先冻结 `level_size = len(queue)`；本轮只弹出这批旧节点，新加入的孩子留给下一层。',
    coreDetail: 'Python 的 `deque` 支持 O(1) 的左端弹出。若在 `for` 循环条件中动态读取队列长度，新孩子会混进当前层；先保存长度就是在队列中画出层边界。',
    kind: 'tree', treeLabels: ['3','9','20','15','7'],
    steps: [['初始化','根节点入队，queue=[root]'],['冻结层宽','level_size=len(queue)'],['处理本层','连续 popleft level_size 次'],['加入下一层','孩子 append 到队尾，下轮再处理']],
    proofSteps: [['队列顺序','父节点总在孩子之前入队'],['层边界','某轮开始的队列只含同一深度节点'],['冻结长度','新加入孩子不会在本轮出队'],['归纳推进','下一轮队列恰好包含下一层']],
    figureCaption: '先读取本层节点数，再扩展孩子，是层序遍历最关键的一行。',
    proof: [['为什么队列按深度有序','根深度为 0。假设某轮处理的节点深度都为 d，它们加入的孩子深度都是 d+1，并排在队尾；处理完本轮后，队列只剩这些 d+1 层节点。归纳即可。'],['为什么要冻结长度','处理本层节点时队列会持续增长。保存旧长度后，循环次数只对应本层；否则可能继续处理刚加入的孩子，所有层被混在一起。'],['为什么 BFS 能求无权最短路','BFS 按步数从小到大访问状态。一个状态第一次被发现时，不可能还存在步数更少但尚未处理的路径，因此第一次距离就是最短距离。']],
    template: `from collections import deque

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

    return answer`,
    templateNotes: '若只需逐个访问而不关心层，可省略 `level_size`。只要题目按层统计最大值、右视图或层平均值，就必须保留边界。',
    example: { input: 'root = [3,9,20,null,null,15,7]', headers: ['轮次','开始队列','弹出','加入','输出层'], rows: [['1','[3]','3','9,20','[3]'],['2','[9,20]','9,20','15,7','[9,20]'],['3','[15,7]','15,7','—','[15,7]']], conclusion: '答案为 `[[3],[9,20],[15,7]]`。' },
    time: 'O(n)', timeWhy: '每个节点入队一次、出队一次。', space: 'O(w)', spaceWhy: '队列最大长度等于树的最大层宽 w，最坏 O(n)。',
    signalFormula: '按层/按最少步数扩散 + 每条边代价相同 → BFS + 队列',
    signals: ['层序、每层最大值、右视图。','无权图中的最短步数。','从多个起点同时扩散。'],
    pitfalls: [p('用 list.pop(0)','node = queue.pop(0)','列表头部删除需要搬移元素，使用 `deque.popleft()`。'),p('循环中动态使用 len(queue)','while queue:\n    for _ in range(len(queue)):', '这里只在进入 for 时求值一次尚可，但应显式保存 `level_size`，避免改写时混淆层边界。'),p('空树仍把 None 入队','', '先判断 root 是否为 None。')],
    python: { title: '`collections.deque`', body: '`deque` 是双端队列，`append()` 从右加入，`popleft()` 从左取出，两者都是 O(1)，适合 BFS。', code: `from collections import deque
queue = deque([1])
queue.append(2)
first = queue.popleft()` },
    exercises: [q('入门','102','二叉树的层序遍历','binary-tree-level-order-traversal','中等','冻结每层长度。'),q('标准','103','二叉树的锯齿形层序遍历','binary-tree-zigzag-level-order-traversal','中等','按层号决定是否反转输出。'),q('标准','513','找树左下角的值','find-bottom-left-tree-value','中等','每层第一个节点更新答案。'),q('进阶','994','腐烂的橘子','rotting-oranges','中等','多源 BFS，每轮代表一分钟。')],
    checklist: ['能解释队列先进先出。','能证明每轮队列只含同一层。','能写 level_size 分层模板。','能区分 O(h) DFS 栈与 O(w) BFS 队列。','完成 102 和 994。'],
    nextIntro: '下一阶段进入回溯：它仍是 DFS，但会在同一路径上做选择、递归，再撤销选择。'
  },
  {
    n: 14, slug: 'backtracking-subsets', file: 'algorithm-14-backtracking-subsets', permalink: '2026/09/04/algorithm-14-backtracking-subsets/',
    short: '子集型回溯', title: '子集型回溯：每个元素选还是不选', tag: '回溯', difficulty: '标准', prerequisite: '递归、DFS', video: 'https://www.bilibili.com/video/BV1mG4y1A7Gu/',
    description: '用搜索树图解子集型回溯的选择、递归和撤销，解释为什么能且只枚举每个子集一次。',
    lead: '数组 `[1,2,3]` 有 8 个子集。回溯不是神秘模板：它只是沿搜索树走一条决策路径，到叶子记录答案，再退回上一个分叉点尝试另一条路。',
    problem: { input: '互不相同的数组 nums。', output: '所有可能子集。', brute: '从 0 到 2ⁿ-1 枚举二进制掩码，用每一位表示选或不选。', bottleneck: '位运算能做，但不容易直接推广到分割字符串、组合约束和剪枝；回溯更清楚表达决策树。' },
    bruteCode: `def subsets_bits(nums):
    answer = []
    for mask in range(1 << len(nums)):
        subset = []
        for i, value in enumerate(nums):
            if mask & (1 << i):
                subset.append(value)
        answer.append(subset)
    return answer`,
    bruteAnalysis: '共有 2ⁿ 个掩码，每个检查 n 位，时间 O(n·2ⁿ)。回溯也必须输出这么多内容，但更便于加入题目约束。',
    core: '在第 i 个元素处分成两条路：不选它，或选它；递归回来后撤销选择，恢复进入分支前的 path。',
    coreDetail: '`path` 表示根到当前节点已选择的元素。它是同一个列表对象，所有递归层共享，因此进入“选”分支前 append，返回后必须 pop。到 `i==n` 时，一条完整决策路径形成一个子集。',
    kind: 'backtrack', treeLabels: ['[]','不选1','选1','后续','[1,2]','[1,3]','[2,3]'],
    steps: [['当前状态','dfs(i)，前 i 个元素已决定'],['不选分支','直接 dfs(i+1)'],['选择分支','path.append(nums[i]) 后递归'],['撤销选择','path.pop()，恢复现场']],
    proofSteps: [['二元决策','每个元素只有选与不选两种选择'],['路径唯一','一个子集对应唯一的 n 位决策序列'],['覆盖完整','搜索树遍历全部 2ⁿ 条根叶路径'],['状态恢复','pop 保证兄弟分支互不污染']],
    figureCaption: '“选择 → 递归 → 撤销”让同一个 path 安全地服务所有分支。',
    proof: [['为什么不会漏','任意一个子集都能写成长度 n 的选/不选序列。DFS 在每一层同时探索两种决定，所以该序列对应的根到叶路径一定被访问。'],['为什么不会重复','不同子集至少在某个元素是否选择上不同，因此对应不同决策序列、不同叶子。每个叶子只访问一次。'],['为什么记录时要复制','`answer.append(path)` 保存的是列表引用。后续 pop 会修改同一个对象，导致所有答案一起变化。`path.copy()` 创建当前快照。']],
    template: `def subsets(nums):
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
    return answer`,
    templateNotes: '另一种写法在每个节点都记录 path，并用循环枚举下一个选择。两种模型都正确；“选/不选”更适合建立最初的搜索树直觉。',
    example: { input: 'nums = [1,2]', headers: ['路径','i','决定','记录'], rows: [['[]','0','不选 1','—'],['[]','1','不选 2','[]'],['[2]','2','选 2','[2]'],['[1]','1','选 1 后不选 2','[1]'],['[1,2]','2','再选 2','[1,2]']], conclusion: '四条叶路径对应四个子集，恰好 2² 个。' },
    time: 'O(n·2ⁿ)', timeWhy: '有 2ⁿ 个答案，每次复制 path 最多 O(n)。', space: 'O(n)', spaceWhy: '不计算输出，递归深度和 path 最多为 n。',
    signalFormula: '枚举所有方案 + 每个元素有若干选择 + 需要恢复路径 → 回溯',
    signals: ['所有子集、所有分割或所有选择方案。','答案是一组路径而非单个最优值。','当前选择影响后续可选范围。'],
    pitfalls: [p('忘记撤销','path.append(nums[i])\ndfs(i + 1)','选分支结束后必须 pop，否则污染兄弟分支。'),p('保存 path 引用','answer.append(path)','保存快照 `path.copy()`。'),p('基本情况继续执行','', '记录叶子后立即 return，避免访问越界。')],
    python: { title: '`list.copy()` 创建浅拷贝', body: '路径中存整数时浅拷贝已足够。它复制列表容器，但不会递归复制其中对象；本系列路径通常保存不可变值或节点引用。' },
    exercises: [q('入门','78','子集','subsets','中等','画选/不选搜索树。'),q('标准','17','电话号码的字母组合','letter-combinations-of-a-phone-number','中等','每层选择当前数字对应的一个字母。'),q('标准','131','分割回文串','palindrome-partitioning','中等','每层枚举下一段终点，只进入回文段。'),q('进阶','90','子集 II','subsets-ii','中等','排序后同层跳过重复值。')],
    checklist: ['能画出两层选/不选树。','能说明 path 的准确含义。','能解释 copy 与 pop。','能证明覆盖且不重复。','完成 78 和 17。'],
    nextIntro: '下一节要求恰好选择 k 个数，并利用“剩余元素不够”提前剪掉整棵无解子树。'
  },
  {
    n: 15, slug: 'backtracking-combinations', file: 'algorithm-15-backtracking-combinations', permalink: '2026/09/04/algorithm-15-backtracking-combinations/',
    short: '组合型回溯', title: '组合型回溯：从哪里选与剪枝', tag: '回溯', difficulty: '标准', prerequisite: '14、子集型回溯', video: 'https://www.bilibili.com/video/BV1xG4y1F7nC/',
    description: '图解组合回溯的起点参数和剩余数量剪枝，推导为什么循环上界不会漏解。',
    lead: '从 1 到 n 中选 k 个数，顺序不重要。若每层都从 1 重新选，会得到 `[1,2]` 与 `[2,1]` 这类重复排列。组合回溯用 start 保证只向后选。',
    problem: { input: '整数 n 和 k。', output: '从 1..n 中选择 k 个数的所有组合。', brute: '枚举所有 2ⁿ 个子集，再筛出长度为 k 的。', bottleneck: '大量子集长度不可能为 k；组合搜索可以只走长度至多 k 的路径，并提前剪掉剩余数量不足的分支。' },
    bruteCode: `def combine_filter(n, k):
    all_sets = [[]]
    for value in range(1, n + 1):
        all_sets += [subset + [value] for subset in all_sets]
    return [subset for subset in all_sets if len(subset) == k]`,
    bruteAnalysis: '生成全部 2ⁿ 个子集后再筛选，浪费明显。直接搜索组合只生成 C(n,k) 个答案及其前缀。',
    core: 'start 表示下一次只能从哪里开始；还需选择 need 个数时，循环上界只到 n-need+1。',
    coreDetail: 'path 严格递增，因此每个集合只按唯一顺序出现。若当前选 value 后，右侧连 need-1 个数都凑不齐，这个 value 以及更大的起点都无需尝试。',
    kind: 'backtrack', treeLabels: ['[]','[1]','[2]','[3]','[1,2]','[1,3]','[2,3]'],
    steps: [['状态','dfs(start)，path 已选若干递增数字'],['计算缺口','need=k-len(path)'],['剪枝上界','value 最大为 n-need+1'],['选择恢复','append → dfs(value+1) → pop']],
    proofSteps: [['去重规则','后续值必须大于已选最后值'],['数量约束','必须留出 need-1 个更大数字'],['安全剪枝','起点过大时剩余总数小于缺口'],['完整枚举','每个 k 组合有唯一递增表示']],
    figureCaption: '组合只关心选了哪些数，不关心顺序；递增路径正好消除重复排列。',
    proof: [['为什么 start 能去重','任意组合都有唯一的递增排列。规定每次只能选比上次更大的数，就只生成这一个排列，不会生成顺序不同的重复答案。'],['剪枝上界怎样推导','当前还要选 `need` 个数。若第一个选择是 value，那么从 value 到 n 至少要有 need 个数，即 `n-value+1 >= need`，整理得 `value <= n-need+1`。'],['为什么剪枝不会漏','所有超过上界的 value 可用元素只会更少，不可能完成长度 k。因此被剪掉的整段都没有合法叶子。']],
    template: `def combine(n, k):
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
    return answer`,
    templateNotes: 'Python `range` 右端不包含，因此要写 `max_first + 1`。先推数学上界，再转换成 range，能减少加一减一错误。',
    example: { input: 'n=4, k=2', headers: ['path','start','need','可选 value'], rows: [['[]','1','2','1..3'],['[1]','2','1','2..4'],['[2]','3','1','3..4'],['[3]','4','1','4']], conclusion: '根节点不会从 4 开始，因为 4 右侧已没有第二个数；这是安全剪枝。' },
    time: 'O(k·C(n,k))', timeWhy: '输出 C(n,k) 个组合，每个复制 k 个元素；搜索前缀开销不改变输出主量级。', space: 'O(k)', spaceWhy: '不计答案，path 与递归深度最多 k。',
    signalFormula: '从候选中选固定数量 + 顺序不重要 → start 递增 + 剩余数量剪枝',
    signals: ['组合、选 k 个、总和达到目标。','同一批元素不同顺序视为相同。','存在明确的剩余数量或剩余和下界。'],
    pitfalls: [p('每层从 1 开始','for value in range(1, n + 1):','会生成排列和重复使用；从 start 开始。'),p('剪枝少加 1','max_first = n - need','正确数学上界是 `n-need+1`。'),p('找到 k 个后不返回','', '记录后 return，否则还会生成超长路径。')],
    python: { title: '`range(start, stop)` 不包含 stop', body: '若数学上允许取到 `max_first`，代码要写 `range(start, max_first + 1)`。建议先写出闭区间再翻译。' },
    exercises: [q('入门','77','组合','combinations','中等','start + 数量剪枝。'),q('标准','216','组合总和 III','combination-sum-iii','中等','同时维护剩余数量与剩余和。'),q('标准','22','括号生成','generate-parentheses','中等','剩余右括号不能少于左括号。'),q('进阶','40','组合总和 II','combination-sum-ii','中等','排序、同层去重、每个元素只能用一次。')],
    checklist: ['能解释组合与排列的区别。','能推导 n-need+1。','能写 start 参数。','能识别数量与和的剪枝。','完成 77 和 216。'],
    nextIntro: '下一节顺序变得重要。每一层决定“当前位置放谁”，需要 used 状态防止重复使用。'
  },
  {
    n: 16, slug: 'backtracking-permutations', file: 'algorithm-16-backtracking-permutations', permalink: '2026/09/04/algorithm-16-backtracking-permutations/',
    short: '排列型回溯', title: '排列型回溯：每个位置放谁', tag: '回溯', difficulty: '进阶', prerequisite: '14、15', video: 'https://www.bilibili.com/video/BV1mY411D7f6/',
    description: '用搜索树图解排列型回溯、used 数组和 N 皇后中的列与对角线约束。',
    lead: '组合中 `[1,2]` 与 `[2,1]` 相同，排列中却是两个答案。因此状态不再是“从哪里继续选”，而是“哪些元素已被当前路径使用”。',
    problem: { input: '互不相同的数组 nums。', output: '所有排列。', brute: '枚举长度 n 的 n 进制序列，再过滤重复使用元素的序列。', bottleneck: '会检查 nⁿ 个序列，而合法排列只有 n! 个；大量路径在很早就已重复使用元素。' },
    bruteCode: `from itertools import product

def permute_filter(nums):
    answer = []
    for candidate in product(nums, repeat=len(nums)):
        if len(set(candidate)) == len(nums):
            answer.append(list(candidate))
    return answer`,
    bruteAnalysis: '这种写法产生 nⁿ 个候选后再筛选。回溯在选择时就禁止已使用元素，只进入可能成为排列的分支。',
    core: '第 depth 层决定排列的第 depth 个位置；尝试每个尚未使用的元素，递归后恢复 used。',
    coreDetail: '`used[i]` 表示 nums[i] 是否已在当前 path 中。它和 path 一起构成完整状态：path 决定已放内容，used 决定剩余候选。',
    kind: 'backtrack', treeLabels: ['[]','[1]','[2]','[3]','[1,2]','[1,3]','[2,1]'],
    steps: [['位置决策','depth=len(path)，决定当前位置'],['遍历候选','跳过 used[i] 为 True 的元素'],['做出选择','used[i]=True，path.append(nums[i])'],['撤销两处','path.pop()，used[i]=False']],
    proofSteps: [['每层一位置','深度 n 时恰好填满全部位置'],['禁止复用','used 保证一个下标只出现一次'],['顺序保留','不同选择顺序走向不同叶子'],['恢复状态','兄弟分支看到相同的未使用集合']],
    figureCaption: '排列搜索树的同一层是在竞争同一个位置，而不是从某个起点继续向后。',
    proof: [['为什么覆盖所有排列','任意排列的第 0、1、…个位置都给出一条唯一选择路径。每层会尝试所有尚未使用元素，所以这条路径一定存在。'],['为什么没有非法答案','只有 path 长度为 n 才记录，而 used 保证 n 次选择对应 n 个不同下标，因此每个原元素恰好出现一次。'],['N 皇后如何类比','第 row 层决定这一行把皇后放在哪一列。列集合、防斜线集合与反斜线集合相当于更复杂的 used，负责排除会冲突的候选。']],
    template: `def permute(nums):
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
    return answer`,
    templateNotes: '有重复值时不能只用值集合，因为相同值来自不同下标；通常先排序，再用“同层跳过重复值”的规则去重。',
    example: { input: 'nums=[1,2,3]', headers: ['层','path','used','下一候选'], rows: [['0','[]','FFF','1、2、3'],['1','[1]','TFF','2、3'],['2','[1,2]','TTF','3'],['3','[1,2,3]','TTT','记录'],['回溯','[1]','TFF','继续尝试 3']], conclusion: '回溯同时恢复 path 和 used，才能正确进入 `[1,3,2]` 分支。' },
    time: 'O(n·n!)', timeWhy: '共有 n! 个排列，每个答案复制 n 个元素。', space: 'O(n)', spaceWhy: 'path、used 和递归深度都为 n。',
    signalFormula: '安排顺序/位置 + 每个候选使用一次 → used 状态的排列回溯',
    signals: ['所有排列、座位安排、顺序方案。','第几层对应第几个位置。','候选存在列、对角线或其他冲突约束。'],
    pitfalls: [p('只恢复 path','path.pop()','还必须把对应 `used[i]` 恢复为 False。'),p('用 start 参数','dfs(i + 1)','这会强制递增顺序，生成的是组合而非排列。'),p('重复值直接套模板','', '输入有重复值时需要排序和同层去重。')],
    python: { title: '`[False] * n`', body: '布尔值不可变，因此这样创建 used 列表安全。若元素是可变列表，`[[]] * n` 会让所有位置引用同一个对象，应避免。' },
    exercises: [q('入门','46','全排列','permutations','中等','used 数组。'),q('标准','47','全排列 II','permutations-ii','中等','排序后同层跳过相同值。'),q('标准','51','N 皇后','n-queens','困难','每层放一行，维护列和两条对角线。'),q('进阶','52','N 皇后 II','n-queens-ii','困难','不保存棋盘，只统计叶子数。')],
    checklist: ['能区分组合的 start 与排列的 used。','能完整恢复两个状态。','能证明每个排列唯一。','能把 N 皇后映射为逐行决策。','完成 46 和 51。'],
    nextIntro: '下一阶段进入动态规划：先从暴力递归的重复子问题出发，把搜索结果缓存，再翻译成递推表。'
  },
  {
    n: 3, slug: 'sliding-window', file: 'algorithm-03-sliding-window', permalink: '2026/09/04/algorithm-03-sliding-window/',
    short: '滑动窗口', title: '滑动窗口：让连续区间只进出一次', tag: '滑动窗口', difficulty: '标准', prerequisite: '双指针、字典', video: 'https://www.bilibili.com/video/BV1hd4y1r7Gq/',
    description: '从最短子数组和最长无重复子串出发，图解滑动窗口的加入、移出、更新答案时机。',
    lead: '题目要求“连续子数组”或“连续子串”时，暴力枚举每个区间会反复统计相同元素。滑动窗口让元素从右侧进入、从左侧离开，每个元素只处理有限次。',
    problem: { input: '正整数数组 `nums` 和目标 `target`。', output: '元素和至少为 target 的最短连续子数组长度。', brute: '枚举左端和右端，再计算区间和。', bottleneck: '同一段元素被许多重叠区间重复求和；三层写法可到 O(n³)，维护区间和后仍有 O(n²) 个区间。' },
    bruteCode: `def min_subarray_len_brute(target, nums):
    answer = len(nums) + 1
    for left in range(len(nums)):
        total = 0
        for right in range(left, len(nums)):
            total += nums[right]
            if total >= target:
                answer = min(answer, right - left + 1)
                break
    return 0 if answer == len(nums) + 1 else answer`,
    bruteAnalysis: '利用正数条件，一旦当前起点达到 target 就可以停止扩展，但每换一个 `left` 仍要重新累加，最坏时间是 O(n²)。',
    core: 'right 扩大窗口获得新信息；条件满足后，left 尽量收缩并在正确时机更新答案。',
    coreDetail: '窗口不是固定模板，而是一段始终维护特定语义的连续区间。这里窗口 `[left, right]` 的 `total` 必须等于其中所有元素之和。正数保证左端移出元素后总和只会减小，窗口条件具有单调性。',
    kind: 'array', steps: [['右端加入','right 每前进一步，把 nums[right] 加入 total'],['检查条件','total >= target 时已有可行窗口'],['左端收缩','记录长度，再移出 nums[left] 并 left++'],['继续扫描','每个元素进入一次、离开至多一次']],
    proofSteps: [['窗口不变量','total 始终等于 nums[left:right+1] 的和'],['正数单调性','扩右只增大和，缩左只减小和'],['最优时机','可行时持续缩左，枚举当前右端的最短窗口'],['完整性','每个右端对应的最短可行左端都被检查']],
    figureCaption: '窗口扩大是主动探索，窗口收缩是恢复或压紧条件；两种动作各有职责。',
    proof: [['为什么能持续收缩','数组元素全为正数。当前和已达到 target 时，若还想缩短长度，只可能删除左端元素；删除后总和只会下降。当条件第一次不再成立时，上一个窗口就是当前 `right` 下能得到的最短可行窗口。'],['为什么不会漏掉更短答案','右端从左到右枚举了每个可能的终点；对每个终点，`while` 又把左端推进到不能再推进的位置，因此所有可能成为全局最短答案的“最紧窗口”都会被检查。'],['负数为什么破坏模板','有负数时，扩大窗口可能让和变小，收缩窗口也可能让和变大，`total >= target` 不再能单调决定 `left` 的移动。此时要考虑前缀和、单调队列等方法。']],
    template: `def min_subarray_len(target, nums):
    left = 0
    total = 0
    answer = len(nums) + 1

    for right, value in enumerate(nums):
        total += value

        while total >= target:
            answer = min(answer, right - left + 1)
            total -= nums[left]
            left += 1

    return 0 if answer == len(nums) + 1 else answer`,
    templateNotes: '求最短长度时，在窗口仍然可行的 `while` 内更新；求最长无重复子串时，先收缩到重新合法，再在循环外更新长度。',
    example: { input: 'target = 7, nums = [2, 3, 1, 2, 4, 3]', headers: ['right','加入','窗口和','收缩结果','最短长度'], rows: [['0','2','2','[0,0]','∞'],['3','2','8','移出 2，窗口 [1,3]','4'],['4','4','10','连续移出 3、1，窗口 [3,4]','2'],['5','3','9','收缩到 [4,5] 后再到 [5,5]','2']], conclusion: '窗口 `[4,3]` 长度为 2，已经达到最短答案；每次缩左前都先记录合法窗口。' },
    time: 'O(n)', timeWhy: '`right` 遍历 n 次，`left` 总共也只会从 0 走到 n；嵌套 `while` 不代表 O(n²)。', space: 'O(1)', spaceWhy: '求区间和只保存几个整数；若维护字符计数，空间取决于不同字符数。',
    signalFormula: '连续区间 + 元素可从两端加入/移出 + 条件具有单调性 → 滑动窗口',
    signals: ['连续子数组或连续子串。','最长、最短或满足条件的区间数量。','右端加入新元素后，移动左端可以恢复条件。'],
    pitfalls: [p('把 `if` 写成一次收缩','if total >= target:\n    left += 1','一个右端可能对应多次收缩，求最短时必须用 `while`。'),p('先移出再更新答案','', '窗口合法时先记录 `right-left+1`，再移出左端；否则会记录一个尚未验证的窗口。'),p('忽略正数前提','', '最短和模板依赖所有数为正；存在负数时不能沿用同一证明。')],
    python: { title: '`enumerate()` 同时得到下标和值', body: '`for right, value in enumerate(nums)` 同时获得当前位置和元素，避免再写 `value = nums[right]`。', code: `for index, value in enumerate([10, 20]):
    print(index, value)  # 0 10，然后 1 20` },
    exercises: [q('入门','209','长度最小的子数组','minimum-size-subarray-sum','中等','正数和至少为 target；合法时持续缩左。'),q('入门','3','无重复字符的最长子串','longest-substring-without-repeating-characters','中等','用集合或计数表维护窗口内字符。'),q('标准','713','乘积小于 K 的子数组','subarray-product-less-than-k','中等','每个合法右端可贡献 right-left+1 个子数组。'),q('标准','1004','最大连续 1 的个数 III','max-consecutive-ones-iii','中等','窗口中最多允许 k 个 0。'),q('进阶','76','最小覆盖子串','minimum-window-substring','困难','维护缺失字符种类，合法后压缩左端。')],
    checklist: ['能说清 `left`、`right` 和窗口状态各自含义。','能解释嵌套 while 为什么仍是 O(n)。','能区分最长题和最短题的答案更新时机。','能识别负数对单调性的破坏。','完成 209 和 3。'],
    nextIntro: '下一节把“逐步收缩”升级成“每次直接丢掉一半”：二分查找的关键是先定义搜索区间的不变量。'
  },
  {
    n: 4, slug: 'binary-search', file: 'algorithm-04-binary-search', permalink: '2026/09/04/algorithm-04-binary-search/',
    short: '二分查找', title: '二分查找：用区间不变量消灭边界错误', tag: '二分查找', difficulty: '标准', prerequisite: '有序数组、下标', video: 'https://www.bilibili.com/video/BV1AP41137w7/',
    description: '用红蓝染色和左闭右开区间理解 lower_bound，解释为什么每轮能安全丢弃一半。',
    lead: '二分查找最难的不是算 `mid`，而是回答：循环开始时，答案究竟被保证在哪个区间里？只要区间定义始终一致，`<`、`<=` 和返回值就不需要猜。',
    problem: { input: '升序数组 `nums` 和目标值 `target`。', output: '第一个大于等于 target 的位置；若都小于 target，返回数组长度。', brute: '从左到右扫描，遇到第一个满足条件的位置就返回。', bottleneck: '扫描最多检查 n 个元素，没有利用条件在有序数组上只会从“不满足”变化一次到“满足”。' },
    bruteCode: `def lower_bound_brute(nums, target):
    for index, value in enumerate(nums):
        if value >= target:
            return index
    return len(nums)`,
    bruteAnalysis: '线性扫描时间为 O(n)。由于 `nums[i] >= target` 在升序数组上形成一段连续的 True，答案其实是 False 区与 True 区的分界线。',
    core: '把不满足条件的位置染成红色、满足条件的位置染成蓝色；二分寻找第一个蓝色位置。',
    coreDetail: '使用左闭右开区间 `[left, right)`：`left` 是尚未确定的最左位置，`right` 可以等于 `len(nums)`，表示答案可能在数组末尾之后。每轮用 `mid` 的颜色决定保留左半还是右半。',
    kind: 'array', steps: [['定义区间','候选答案位于 [left, right)'],['检查中点','mid=(left+right)//2'],['蓝色中点','nums[mid] >= target，答案在左侧含 mid'],['红色中点','nums[mid] < target，答案严格在 mid 右侧']],
    proofSteps: [['单调前提','判定值沿下标从 False 变为 True'],['中点为真','mid 及右侧无需找更早的答案'],['中点为假','mid 及左侧都不可能满足条件'],['终止状态','left==right，唯一边界就是答案']],
    figureCaption: '每轮区间都严格缩短，并且始终保留第一个蓝色位置。',
    proof: [['为什么中点为蓝能丢右半','若 `nums[mid] >= target`，`mid` 已经是一个可行位置。我们寻找第一个可行位置，所以答案不可能在 `mid` 右边；但 `mid` 自己仍可能是答案，因此令 `right = mid`。'],['为什么中点为红能丢左半','若 `nums[mid] < target`，升序性保证 `mid` 左侧都不大于它，也都小于 target。这一整段不可能成为答案，所以令 `left = mid + 1`。'],['为什么返回 left','循环终止条件是 `left == right`，候选区间长度变为 0。根据不变量，`left` 左侧全不满足、`left` 及右侧满足或已越过数组，因此 `left` 正是分界点。']],
    template: `def lower_bound(nums, target):
    left = 0
    right = len(nums)  # 搜索区间 [left, right)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] >= target:
            right = mid
        else:
            left = mid + 1

    return left`,
    templateNotes: '找“第一个大于 target”只需把判定改成 `nums[mid] > target`。找最后一个小于 target，可以用第一个大于等于 target 的位置减一。',
    example: { input: 'nums = [1, 3, 5, 7, 9, 11, 13], target = 8', headers: ['轮次','区间','mid','nums[mid]','更新'], rows: [['1','[0,7)','3','7','left=4'],['2','[4,7)','5','11','right=5'],['3','[4,5)','4','9','right=4']], conclusion: '最终 `left == right == 4`，下标 4 的值 9 是第一个大于等于 8 的元素。' },
    time: 'O(log n)', timeWhy: '每轮把候选区间至少缩小一半，长度 n 最多连续除以 2 约 log₂n 次。', space: 'O(1)', spaceWhy: '迭代写法只使用 left、right、mid。',
    signalFormula: '有序/单调判定 + 寻找第一个或最后一个满足位置 → 二分边界',
    signals: ['数组已经排序。','判定结果随下标只改变一次。','题目问第一个、最后一个、至少、至多或插入位置。'],
    pitfalls: [p('蓝色中点后写 `right = mid - 1`','right = mid - 1','当前使用 `[left,right)`，`mid` 仍可能是答案，必须保留为 `right = mid`。'),p('红色中点后没有越过 mid','left = mid','当只剩两个元素时可能死循环；已知 mid 不可行，应写 `mid + 1`。'),p('混用闭区间模板','', '先在注释写清 `[left,right)` 或 `[left,right]`，循环条件和更新必须配套。')],
    python: { title: '`//` 是向下取整除法', body: '`(left + right) // 2` 得到整数下标。Python 整数不会溢出；在固定宽度整数语言中常写 `left + (right-left)//2`。' },
    exercises: [q('入门','35','搜索插入位置','search-insert-position','简单','答案就是第一个 >= target 的位置。'),q('标准','34','在排序数组中查找元素的第一个和最后一个位置','find-first-and-last-position-of-element-in-sorted-array','中等','分别求 >= target 和 > target 的边界。'),q('标准','2529','正整数和负整数的最大计数','maximum-count-of-positive-integer-and-negative-integer','简单','两个边界分别切出负数段和正数段。'),q('进阶','875','爱吃香蕉的珂珂','koko-eating-bananas','中等','速度越大，所需时间越少；对答案做二分。')],
    checklist: ['能先写出搜索区间含义再写代码。','能证明两个分支为什么保留或排除 mid。','能独立写 lower_bound。','能由 lower_bound 推出上界。','完成 35 和 34。'],
    nextIntro: '下一节不再直接搜索排好序的值，而是给峰值、旋转数组和答案空间设计单调判定。'
  },
  {
    n: 5, slug: 'binary-search-advanced', file: 'algorithm-05-binary-search-advanced', permalink: '2026/09/04/algorithm-05-binary-search-advanced/',
    short: '二分查找变形', title: '二分查找变形：自己设计单调判定', tag: '二分查找', difficulty: '进阶', prerequisite: '04、lower_bound', video: 'https://www.bilibili.com/video/BV1QK411d76w/',
    description: '通过寻找峰值和旋转数组最小值，学习在非整体有序数组中设计二分判定。',
    lead: '很多二分题没有直接给出“升序数组”。真正可二分的是一个单调的真假判定：只要能把候选划分成两块，并证明答案所在的一块，就能丢掉另一半。',
    problem: { input: '先严格递增后严格递减的数组，或由升序数组旋转得到的数组。', output: '峰值下标，或旋转数组中的最小值。', brute: '线性扫描相邻元素或整段最小值。', bottleneck: 'O(n) 扫描没有利用局部斜率或旋转点两侧的结构。' },
    bruteCode: `def find_peak_brute(nums):
    for i in range(len(nums) - 1):
        if nums[i] > nums[i + 1]:
            return i
    return len(nums) - 1`,
    bruteAnalysis: '线性法正确但最坏检查 n 个位置。峰值题可把 `nums[mid] < nums[mid+1]` 视为“仍在上坡”，把另一种情况视为“峰值在左边或就是 mid”。',
    core: '二分的对象不是数组本身，而是你设计出的、沿搜索方向只改变一次的判定。',
    coreDetail: '寻找峰值时比较 `mid` 与 `mid+1`，判断当前位于上坡还是下坡；寻找旋转数组最小值时比较 `mid` 与最右值，判断 `mid` 属于最小值左边的“大数段”还是右边的“小数段”。',
    kind: 'array', steps: [['选参照物','峰值看 mid+1；旋转数组看 right'],['设计颜色','把一定在答案一侧的状态归成同一色'],['保留答案侧','根据判定更新 left 或 right'],['检查终点','区间缩到一个位置即为答案']],
    proofSteps: [['结构保证','数组虽非整体有序，但由两段单调结构组成'],['局部判定','一次比较能识别 mid 所属区域'],['方向确定','被丢弃区域内不可能有目标边界'],['边界收敛','每轮区间变短且保留至少一个答案']],
    figureCaption: '先为每个位置定义“颜色”，再复用二分边界；不要先写模板再猜条件。',
    proof: [['峰值为何能看斜率','若 `nums[mid] < nums[mid+1]`，从 mid 到 mid+1 正在上升。右侧最终要么继续上升到末端，要么某处转为下降，两种情况都保证右侧存在峰值，所以可令 `left=mid+1`。否则 mid 已在下降侧或就是峰值，令 `right=mid`。'],['旋转数组为何与末尾比较','无重复元素时，最小值右侧到末尾是小数段。若 `nums[mid] < nums[right]`，mid 和 right 位于同一递增段，最小值不会在 mid 右侧，保留 mid；否则 mid 位于大数段，最小值严格在右侧。'],['重复元素带来的困难','若允许 `nums[mid] == nums[right]`，无法判断 mid 在哪一段，只能令 `right -= 1` 排除一个重复值。最坏情况下每次只缩一格，复杂度退化到 O(n)。']],
    template: `def find_peak(nums):
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
    return nums[left]`,
    templateNotes: '两段代码都用闭区间中的单点收敛形式。峰值模板访问 `mid+1` 仍安全，因为 `left < right` 保证 `mid < right`。',
    example: { input: 'nums = [4, 5, 6, 7, 0, 1, 2]', headers: ['轮次','left/mid/right','比较','结论','新区间'], rows: [['1','0/3/6','7 > 2','mid 在大数段','[4,6]'],['2','4/5/6','1 < 2','最小值不在 mid 右侧','[4,5]'],['3','4/4/5','0 < 1','保留 mid','[4,4]']], conclusion: '区间收敛到下标 4，最小值为 0。' },
    time: 'O(log n)', timeWhy: '无重复元素时每轮保留至多一半区间。', space: 'O(1)', spaceWhy: '只保存边界与中点。',
    signalFormula: '非整体有序 + 能按局部特征分成两类 + 目标是分界点 → 设计判定后二分',
    signals: ['峰值、谷值或旋转点。','答案越大越容易/越难满足某条件。','可以回答“mid 位于目标左边还是右边”。'],
    pitfalls: [p('峰值访问越界','mid = (left + right + 1) // 2\nif nums[mid] < nums[mid + 1]:','使用向下取整的 mid，才能保证循环内 `mid+1 <= right`。'),p('旋转数组与固定末尾比较','', '模板每轮比较当前 `right`，不要随意改成初始末尾；区间含义变化后证明也会变化。'),p('忽略重复值','', '无重复模板遇到相等无法确定方向；先确认题目是否保证互不相同。')],
    python: { title: '布尔判定也可以写成函数', body: '答案二分时可把条件封装为 `check(value)`。主循环只关心 False/True 分界，具体计算留在函数内，便于测试。', code: `def check(speed):
    return required_hours(speed) <= limit` },
    exercises: [q('入门','162','寻找峰值','find-peak-element','中等','比较 mid 和 mid+1 的斜率。'),q('标准','153','寻找旋转排序数组中的最小值','find-minimum-in-rotated-sorted-array','中等','与当前右端比较判断所在段。'),q('标准','33','搜索旋转排序数组','search-in-rotated-sorted-array','中等','每轮先判断哪一半有序，再判断 target 是否落入。'),q('进阶','154','寻找旋转排序数组中的最小值 II','find-minimum-in-rotated-sorted-array-ii','困难','相等时只能安全缩掉一个右端。')],
    checklist: ['能把局部比较解释成颜色判定。','能证明峰值向哪侧存在。','能写出旋转数组最小值模板。','知道重复值为何导致退化。','完成 162 和 153。'],
    nextIntro: '数组下标可以随机访问，链表却只能沿 next 前进。下一节先画清引用，再完成最基础的反转。'
  },
  {
    n: 6, slug: 'reverse-linked-list', file: 'algorithm-06-reverse-linked-list', permalink: '2026/09/04/algorithm-06-reverse-linked-list/',
    short: '反转链表', title: '反转链表：先保存后继，再改变指向', tag: '链表', difficulty: '入门', prerequisite: '节点、引用、None', video: 'https://www.bilibili.com/video/BV1sd4y1x7KN/',
    description: '用三指针图解链表反转，解释为什么必须先保存 next，并扩展到局部与分组反转。',
    lead: '链表没有数组下标。变量保存的是节点引用，改变 `node.next` 就会改变整条链的连接关系。反转时最危险的不是写错循环，而是还没保存后继就把剩余链表弄丢。',
    problem: { input: '单链表 `1 → 2 → 3 → None` 的头节点。', output: '反转后的头节点 `3 → 2 → 1 → None`。', brute: '把所有值放入列表，再倒序创建一条新链表。', bottleneck: '需要 O(n) 额外空间，而且创建了新节点，没有真正修改原链表的指向。' },
    bruteCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_with_array(head):
    values = []
    while head:
        values.append(head.val)
        head = head.next
    new_head = None
    for value in values:
        new_head = ListNode(value, new_head)
    return new_head`,
    bruteAnalysis: '遍历和重建都是 O(n)，但列表与新节点都占用 O(n) 空间。原地反转只需要三个引用。',
    core: '每轮先保存 cur.next，再让 cur.next 指向 prev，最后让 prev 和 cur 同步向前。',
    coreDetail: '`prev` 始终指向已经反转好的前缀，`cur` 指向尚未处理部分的第一个节点。保存 `next_node` 是为了在修改 `cur.next` 后仍能找到剩余链表。',
    kind: 'linked', steps: [['初始','prev=None，cur=head'],['保存后继','next_node=cur.next，先留住剩余链'],['反转一条边','cur.next=prev，当前节点接到已反转前缀'],['整体前进','prev=cur，cur=next_node']],
    proofSteps: [['循环不变量','prev 是已反转前缀，cur 是未处理后缀头'],['保存通路','next_node 保留修改前通往后缀的引用'],['扩展前缀','把 cur 接到 prev 后，反转前缀增加一个节点'],['终止状态','cur=None 时 prev 包含全部节点']],
    figureCaption: '顺序不能交换：保存后继是改变箭头之前的保险绳。',
    proof: [['为什么不丢节点','执行 `cur.next = prev` 后，原来从 cur 指向后继的箭头被覆盖。如果此前已保存 `next_node = cur.next`，剩余链仍可从 `next_node` 到达。'],['为什么 prev 最终是新头','每轮把未处理后缀的第一个节点搬到已反转前缀前面。处理完最后一个节点时，`prev` 指向原链表尾节点，它现在位于整条反转链的开头。'],['递归版本在做什么','递归先反转 `head.next` 开始的后缀，再执行 `head.next.next = head` 把当前节点接到后缀末尾，并把 `head.next` 断开。它与迭代版维护的是同一个连接关系，只是使用调用栈保存现场。']],
    template: `class ListNode:
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

    return prev`,
    templateNotes: '变量名写成 `next_node`，不要覆盖 Python 内置函数 `next()`。画出三个引用后再写四行更新，比背缩写可靠。',
    example: { input: '1 → 2 → 3 → None', headers: ['轮次','prev','cur','保存 next','反转后'], rows: [['开始','None','1','—','—'],['1','1','2','2','None ← 1'],['2','2','3','3','None ← 1 ← 2'],['3','3','None','None','None ← 1 ← 2 ← 3']], conclusion: '`cur` 走到 None 时结束，`prev` 指向节点 3，因此返回 prev。' },
    time: 'O(n)', timeWhy: '每个节点只访问并改写一次 next。', space: 'O(1)', spaceWhy: '迭代版只维护三个节点引用；没有按输入规模增长的容器。',
    signalFormula: '链表方向改变 + 必须保留剩余链入口 → prev / cur / next 三指针',
    signals: ['反转整条、局部或每 k 个节点。','需要改变 next，而不是只倒序输出值。','操作后仍要能访问尚未处理的节点。'],
    pitfalls: [p('先改指向再保存后继','cur.next = prev\ncur = cur.next','此时 `cur.next` 已指回前缀，剩余链丢失。先保存 `next_node`。'),p('返回 head','return head','循环结束后原 head 已成为尾节点，新头是 prev。'),p('忘记局部反转后的两端连接','', '反转 `[left,right]` 后，原区间头变成尾，要接后半段；区间前驱要接新头。')],
    python: { title: '`is not None` 表达节点存在', body: '`while cur is not None` 明确检查引用。节点对象通常都为真，`while cur` 也可用，但显式写法更适合初学阶段。' },
    exercises: [q('入门','206','反转链表','reverse-linked-list','简单','画 prev、cur、next_node 三个引用。'),q('标准','92','反转链表 II','reverse-linked-list-ii','中等','增加哨兵节点，先找到反转区间前驱。'),q('进阶','25','K 个一组翻转链表','reverse-nodes-in-k-group','困难','每组先确认有 k 个节点，再反转并连接。'),q('进阶','24','两两交换链表中的节点','swap-nodes-in-pairs','中等','它是 k=2 的特殊情况。')],
    checklist: ['能解释变量保存的是引用而非节点副本。','能画出一轮箭头变化。','能按正确顺序写四行更新。','能解释返回 prev。','完成 206 和 92。'],
    nextIntro: '下一节不改变链表结构，而是让两个指针以不同速度前进，解决中点、环和环入口。'
  },
  {
    n: 7, slug: 'fast-slow-pointers', file: 'algorithm-07-fast-slow-pointers', permalink: '2026/09/04/algorithm-07-fast-slow-pointers/',
    short: '快慢指针', title: '链表快慢指针：中点、判环与环入口', tag: '链表', difficulty: '标准', prerequisite: '06、链表遍历', video: 'https://www.bilibili.com/video/BV1KG4y1G7cu/',
    description: '图解快慢指针的速度差，推导为什么有环必相遇以及如何找到环入口。',
    lead: '链表不能直接知道长度，也不能从尾部往回走。但两个从头出发、速度不同的指针，能把“长度关系”编码进它们的相对位置。',
    problem: { input: '一条可能含环的单链表。', output: '判断是否有环；进一步返回环的入口节点。', brute: '用集合记录访问过的节点，第一次重复即说明有环。', bottleneck: '集合需要 O(n) 额外空间；如果只允许常数空间，就要利用速度差。' },
    bruteCode: `def has_cycle_with_set(head):
    seen = set()
    while head is not None:
        if head in seen:
            return True
        seen.add(head)
        head = head.next
    return False`,
    bruteAnalysis: '时间是 O(n)，空间也是 O(n)。快慢指针保留线性时间，同时把额外空间降为 O(1)。',
    core: 'slow 每次走一步，fast 每次走两步；无环时 fast 先到终点，有环时 fast 每轮追近 slow 一步。',
    coreDetail: '进入环后，把位置看成对环长取模。fast 相对 slow 的速度是 1，因此二者之间的环上距离每轮减少 1，有限步内必然变成 0。',
    kind: 'linked', steps: [['同时出发','slow=head，fast=head'],['不同速度','slow 走 1 步，fast 走 2 步'],['判断终点','fast 或 fast.next 为空说明无环'],['环内相遇','相遇后另设指针从 head 同速前进找入口']],
    proofSteps: [['无环情况','fast 速度更快，会先遇到 None'],['有环情况','进入环后相对距离每轮减少 1'],['第一次相遇','快指针比慢指针多走整数圈'],['入口等式','头到入口距离等于相遇点再走到入口的模意义距离']],
    figureCaption: '速度差负责制造相遇；相遇后的路程等式负责定位入口。',
    proof: [['为什么有环一定相遇','slow 进入环后，fast 已在环中。以 slow 为参照，fast 每轮净前进一个节点。环只有有限个位置，所以相对距离必然经过 0。'],['为什么能找到入口','设头到入口距离为 `a`，入口到相遇点为 `b`，环剩余距离为 `c`。相遇时慢指针走 `a+b`，快指针走 `2(a+b)`，且快指针多走整圈：`a+b = k(b+c)`。整理得 `a = (k-1)(b+c)+c`，所以一个指针从头、另一个从相遇点每次各走一步，会在入口相遇。'],['中点为什么是 slow','fast 每走两步，slow 走一步。当 fast 到尾部时，slow 恰好走了总长度的一半。偶数长度时循环条件的选择决定返回两个中点中的哪一个。']],
    template: `def has_cycle(head):
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
    return None`,
    templateNotes: '判断节点相同要用对象身份 `is`，不是比较 `val`；链表中不同节点完全可以存相同值。',
    example: { input: '3 → 2 → 0 → -4，再由 -4 指回 2', headers: ['轮次','slow','fast','结果'], rows: [['开始','3','3','继续'],['1','2','0','未相遇'],['2','0','2','未相遇'],['3','-4','-4','环内相遇'],['找入口','从 3 与 -4 同速走','在 2 相遇','入口=2']], conclusion: '相遇只能证明有环；再从头同步走一次，才得到入口。' },
    time: 'O(n)', timeWhy: '无环最多走到尾；有环时进入环和追上都不超过线性步数。', space: 'O(1)', spaceWhy: '始终只保存固定数量的节点引用。',
    signalFormula: '单链表 + 长度关系/环 + 不能用额外集合 → 快慢指针',
    signals: ['找中点或倒数位置。','判断环、找环入口或重复状态。','两个过程速度不同会产生可利用的路程关系。'],
    pitfalls: [p('循环条件少检查一层','while fast is not None:\n    fast = fast.next.next','`fast.next` 可能为 None，访问 `.next` 会报错。'),p('比较节点值','if slow.val == fast.val:','值相同不代表同一节点；使用 `slow is fast`。'),p('相遇后直接返回相遇点','', '相遇点通常不是入口；需要从 head 再启动 seeker。')],
    python: { title: '`is` 与 `==`', body: '`is` 判断是否为同一个对象，`==` 判断值是否相等。链表判环关心节点身份，必须使用 `is`。' },
    exercises: [q('入门','876','链表的中间结点','middle-of-the-linked-list','简单','快走二、慢走一。'),q('标准','141','环形链表','linked-list-cycle','简单','相遇即有环。'),q('标准','142','环形链表 II','linked-list-cycle-ii','中等','推导 a、b、c 路程关系。'),q('进阶','143','重排链表','reorder-list','中等','找中点、反转后半段、交替合并。')],
    checklist: ['能解释速度差为什么保证环内相遇。','能推导环入口等式。','能写安全循环条件。','能区分节点身份和值。','完成 876、141、142。'],
    nextIntro: '下一节让两个指针保持固定间距，再配合哨兵节点统一删除头节点和普通节点。'
  },
  {
    n: 8, slug: 'linked-list-deletion', file: 'algorithm-08-linked-list-deletion', permalink: '2026/09/04/algorithm-08-linked-list-deletion/',
    short: '链表删除与前后指针', title: '链表删除：哨兵节点与固定间距', tag: '链表', difficulty: '标准', prerequisite: '06、07', video: 'https://www.bilibili.com/video/BV1VP4y1Q71e/',
    description: '用哨兵节点和前后指针图解删除倒数第 N 个节点，并总结链表删除的连接不变量。',
    lead: '删除链表节点真正需要的是它的前驱：执行 `prev.next = prev.next.next`。头节点没有天然前驱，所以边界处理很容易把主逻辑打断。哨兵节点给头节点补上一个统一的前驱。',
    problem: { input: '单链表和整数 n。', output: '删除倒数第 n 个节点后的新头节点。', brute: '先遍历求长度 L，再从头走到第 L-n 个节点的前驱并删除。', bottleneck: '需要两次遍历；删除头节点还要单独分支。' },
    bruteCode: `def remove_nth_two_pass(head, n):
    length = 0
    cur = head
    while cur:
        length += 1
        cur = cur.next
    if n == length:
        return head.next
    cur = head
    for _ in range(length - n - 1):
        cur = cur.next
    cur.next = cur.next.next
    return head`,
    bruteAnalysis: '两次遍历仍是 O(n)，但分支多。前后指针把“倒数距离”转成两个指针之间固定为 n 个节点的间隔，只需一遍。',
    core: '在原头前放 dummy；fast 先走 n 步，再让 fast 和 slow 同速，fast 到尾时 slow.next 就是目标。',
    coreDetail: '`slow` 从 dummy 出发，保证目标即使是原头也有前驱。fast 与 slow 的间隔建立后保持不变，因此 fast 指向最后一个节点时，slow 恰好位于待删节点前一位。',
    kind: 'linked', steps: [['添加哨兵','dummy.next=head，slow=dummy，fast=head'],['建立间距','fast 先前进 n 步'],['同步前进','fast 未到 None 时两者各走一步'],['执行删除','slow.next=slow.next.next，返回 dummy.next']],
    proofSteps: [['统一前驱','dummy 使原头也成为普通的 next 节点'],['固定间距','fast 领先 slow.next 共 n 个节点'],['到达终点','fast=None 时 slow.next 距尾部正好 n'],['局部改边','跨过目标节点不影响其余顺序']],
    figureCaption: '哨兵节点不属于原数据，它只用于统一“删除前驱”的操作。',
    proof: [['为什么 fast 先走 n 步','待删除节点距链尾共有 n 个节点（包含自己）。当 fast 从 head 先走 n 步后，slow.next 与 fast 之间保持这一距离；fast 到 None 时，slow.next 正好是倒数第 n 个。'],['为什么 slow 从 dummy 出发','若删除的是 head，目标前驱应位于 head 之前。dummy 正好扮演这个前驱，于是删除头节点和删除中间节点都使用同一句赋值。'],['删除为什么只改一条边','设目标是 `slow.next`。让 `slow.next` 直接指向目标的后继后，从头出发的链已经绕过目标；目标之后的所有 next 关系无需改变。']],
    template: `class ListNode:
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
    return dummy.next`,
    templateNotes: '题目保证 n 有效。如果写通用函数，应在 fast 提前为 None 时决定返回错误、原链还是抛异常，而不是静默访问空引用。',
    example: { input: '1 → 2 → 3 → 4 → 5，n = 2', headers: ['阶段','slow','fast','间距/操作'], rows: [['初始','dummy','1','fast 先走 2'],['建立后','dummy','3','目标候选是 slow.next=1'],['同步 1','1','4','间距保持'],['同步 2','2','5','间距保持'],['同步 3','3','None','删除 slow.next=4']], conclusion: '最终链表为 `1 → 2 → 3 → 5`。' },
    time: 'O(n)', timeWhy: 'fast 与 slow 都只沿链向前，不回退。', space: 'O(1)', spaceWhy: 'dummy 是一个固定新节点，其数量不随链表长度增长。',
    signalFormula: '删除可能涉及头节点 + 需要目标前驱 + 倒数距离 → dummy + 固定间距双指针',
    signals: ['删除、去重或合并时头节点可能变化。','题目给倒数第 k 个位置。','需要统一处理空链、单节点和头部操作。'],
    pitfalls: [p('slow 从 head 出发','slow = head','删除原头时没有前驱。让 slow 从 dummy 出发。'),p('间距差一位','for _ in range(n + 1):\n    fast = fast.next','本文 fast 从 head 出发只走 n 步；若从 dummy 出发则更新循环条件也要配套。'),p('返回旧 head','return head','删除头节点后旧 head 已失效，应返回 `dummy.next`。')],
    python: { title: '`range(n)` 恰好执行 n 次', body: '`for _ in range(n)` 中下划线表示循环次数重要、循环变量本身不用。执行后 fast 恰好前进 n 条 next 边。' },
    exercises: [q('入门','19','删除链表的倒数第 N 个结点','remove-nth-node-from-end-of-list','中等','dummy + 前后指针。'),q('标准','83','删除排序链表中的重复元素','remove-duplicates-from-sorted-list','简单','相邻相等时跨过下一个节点。'),q('标准','82','删除排序链表中的重复元素 II','remove-duplicates-from-sorted-list-ii','中等','需要删除整段重复值，dummy 很重要。'),q('进阶','237','删除链表中的节点','delete-node-in-a-linked-list','中等','无法访问前驱时，把后继值复制过来并删除后继。')],
    checklist: ['能解释 dummy 为什么统一头节点。','能画出 fast 与 slow 的固定间距。','能独立写一次遍历删除。','能检查 n=链长和单节点情况。','完成 19 和 82。'],
    nextIntro: '下一阶段进入二叉树。我们先不背前中后序，而是回答每个递归函数从子树得到什么、向父节点返回什么。'
  },
  {
    n: 17, slug: 'dynamic-programming-intro', file: 'algorithm-17-dynamic-programming-intro', permalink: '2026/09/04/algorithm-17-dynamic-programming-intro/',
    short: '动态规划入门', title: '动态规划入门：从记忆化搜索到递推', tag: '动态规划', difficulty: '标准', prerequisite: '递归、数组', video: 'https://www.bilibili.com/video/BV1Xj411K7oF/',
    description: '从打家劫舍出发，完整推导 DP 状态、转移、初始化、遍历顺序与空间优化。',
    lead: '动态规划不是先猜公式。最自然的起点是暴力搜索：面对第 i 间房，选它还是不选？当你发现相同的 `dfs(i)` 被反复计算，缓存与递推就顺理成章。',
    problem: { input: '一排房屋金额 nums，相邻房屋不能同时偷。', output: '能偷到的最大金额。', brute: '对每间房递归尝试“跳过”或“偷取”。', bottleneck: '不同选择路径会反复求同一个后缀的最优值，调用数近似指数增长。' },
    bruteCode: `def rob_brute(nums):
    def dfs(i):
        if i >= len(nums):
            return 0
        return max(dfs(i + 1), nums[i] + dfs(i + 2))
    return dfs(0)`,
    bruteAnalysis: '状态只有 n 个，暴力却形成两叉递归树。给 `dfs(i)` 缓存后，每个状态只计算一次；再按依赖顺序倒推即可去掉递归。',
    core: '先定义状态，再写选择：dfs(i) 表示从第 i 间及以后能偷到的最大金额。',
    coreDetail: '不偷第 i 间得到 `dfs(i+1)`；偷它就必须跳过相邻房，得到 `nums[i]+dfs(i+2)`。两种选择覆盖所有合法方案，取较大值。递推可改成 `dp[i]=max(dp[i-1],dp[i-2]+nums[i])`。',
    kind: 'dp', dpRow: {labels:['空','房0','房1','房2','房3'],values:['0','2','7','11','11']},
    steps: [['状态定义','dp[i] 表示前 i+1 间房的最大收益'],['状态转移','不偷 i：dp[i-1]；偷 i：dp[i-2]+nums[i]'],['初始化','空前缀为 0，第一间收益为 nums[0]'],['遍历顺序','从左到右，因为当前依赖更早状态']],
    proofSteps: [['最后选择','最优方案对最后一间只有偷或不偷'],['互斥完整','两类方案无重叠且覆盖全部合法方案'],['最优子结构','固定最后选择后，前缀必须取自身最优'],['顺序有效','所需的 i-1、i-2 已经计算']],
    figureCaption: '公式中的每一项都对应一个明确选择，表格只是把搜索结果按依赖顺序保存。',
    proof: [['转移为什么完整','任一合法方案对房 i 只有两种情况：不偷，方案完全位于前 i-1 间；偷，则 i-1 不能偷，剩余来自前 i-2 间。这两类覆盖全部方案。'],['为什么子问题必须最优','若偷 i 的最优方案中，前 i-2 间不是最优选择，就可替换成更优前缀且仍不相邻，从而得到更大总额，与原方案最优矛盾。'],['空间为何能压缩','计算当前值只依赖前两个状态，不需要整张 dp 表。保存 `prev2`、`prev1` 并滚动更新即可。压缩前先写清完整状态，避免更新顺序覆盖依赖。']],
    template: `def rob(nums):
    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]

    for money in nums:
        current = max(prev1, prev2 + money)
        prev2 = prev1
        prev1 = current

    return prev1`,
    templateNotes: '这段写法自然处理空数组和单元素。先算 current，再整体滚动；若先覆盖 prev1，会丢掉旧状态。',
    example: { input: 'nums=[2,7,9,3,1]', headers: ['房屋','金额','不偷','偷','dp'], rows: [['0','2','0','2','2'],['1','7','2','7','7'],['2','9','7','11','11'],['3','3','11','10','11'],['4','1','11','12','12']], conclusion: '最优值 12 对应偷 2、9、1。表中每行都比较最后一步的两种选择。' },
    time: 'O(n)', timeWhy: 'n 个状态各计算一次，每次常数操作。', space: 'O(1)', spaceWhy: '滚动变量只保存最近两个状态；完整 dp 表则为 O(n)。',
    signalFormula: '求最优/计数 + 选择后产生重复子问题 + 状态数有限 → 记忆化搜索 / DP',
    signals: ['最大、最小、方案数或是否可行。','问题可由更小前缀/后缀表示。','暴力递归反复出现相同参数。'],
    pitfalls: [p('没定义 dp 含义就写公式','dp[i] = max(dp[i-1], dp[i-2] + nums[i])','必须说明 dp[i] 覆盖哪段输入、返回什么。'),p('空数组初始化越界','dp[0] = nums[0]','通用代码要先处理空数组，或使用带空前缀的定义。'),p('滚动变量覆盖过早','prev1 = max(prev1, prev2 + money)\nprev2 = prev1','第二行拿到的是新 prev1；先保存 current。')],
    python: { title: '`functools.cache` 做记忆化', body: '在递归函数上加 `@cache` 会按参数保存返回值，适合先验证状态与转移。之后再翻译成递推。', code: `from functools import cache

@cache
def dfs(i):
    ...` },
    exercises: [q('入门','70','爬楼梯','climbing-stairs','简单','最后一步来自 i-1 或 i-2。'),q('入门','746','使用最小花费爬楼梯','min-cost-climbing-stairs','简单','明确 dp 表示到达台阶还是离开台阶。'),q('标准','198','打家劫舍','house-robber','中等','偷与不偷。'),q('进阶','213','打家劫舍 II','house-robber-ii','中等','环拆成不含首或不含尾的两条链。')],
    checklist: ['能从暴力选择写出递归。','能识别重复状态并加缓存。','能完成 DP 五步：定义、转移、初始化、顺序、答案。','能安全做空间压缩。','完成 198 和 746。'],
    nextIntro: '下一节把“选或不选”放进容量限制中，系统区分 0-1 背包、完全背包以及至多、恰好、至少三种状态语义。'
  },
  {
    n: 18, slug: 'knapsack', file: 'algorithm-18-knapsack', permalink: '2026/09/04/algorithm-18-knapsack/',
    short: '背包 DP', title: '0-1 背包与完全背包：遍历方向为什么相反', tag: '动态规划', difficulty: '进阶', prerequisite: '17、DP 五步法', video: 'https://www.bilibili.com/video/BV16Y411v7Y6/',
    description: '图解 0-1 与完全背包的一维表，推导容量遍历方向及至多、恰好、至少的初始化。',
    lead: '背包题的表面可能是分割数组、凑零钱或目标和，核心都在问：处理到某件物品、容量为 c 时，选或不选如何影响答案？',
    problem: { input: '物品重量/价值与容量；每件可用一次或无限次。', output: '最大价值、恰好装满的方案数或最少物品数。', brute: '枚举每件物品选不选；完全背包还要枚举选几个。', bottleneck: '选择组合指数增长，而状态只由处理到哪件物品和当前容量决定。' },
    bruteCode: `def zero_one_brute(weights, values, capacity):
    def dfs(i, remain):
        if i == len(weights):
            return 0
        best = dfs(i + 1, remain)
        if weights[i] <= remain:
            best = max(best, values[i] + dfs(i + 1, remain - weights[i]))
        return best
    return dfs(0, capacity)`,
    bruteAnalysis: '0-1 背包有 2ⁿ 个选择序列。二维 DP 只有 n·capacity 个状态；一维压缩后，遍历方向负责保留“上一行”或允许使用“当前行”。',
    core: '0-1 背包容量倒序，防止本轮物品重复使用；完全背包容量正序，主动允许读取本轮刚更新的状态。',
    coreDetail: '更新 `dp[c]` 时都会读取 `dp[c-weight]`。倒序时较小容量仍是处理上一件物品后的旧值；正序时较小容量已经包含当前物品，因此可以再选一次。',
    kind: 'dp', dpRow: {labels:['容量0','1','2','3','4','5'],values:['0','0','3','4','7','7']},
    steps: [['定义语义','dp[c] 是容量 c 的最优值或方案数'],['决定初始化','至多可全 0；恰好通常 dp[0]=0/1，其余不可达'],['选择方向','0-1 倒序；完全背包正序'],['读取答案','按题意取 dp[capacity] 或区间最值']],
    proofSteps: [['转移来源','不选保持 dp[c]，选择来自 dp[c-w]+v'],['0-1 约束','倒序保证来源尚未使用当前物品'],['无限使用','正序让来源可以包含当前物品'],['初始化语义','不可达状态不能伪装成合法零值']],
    figureCaption: '同一个一维公式，方向不同就代表物品能否在同一轮再次出现。',
    proof: [['0-1 为什么倒序','处理物品 w 时，若 c 从大到小，`dp[c-w]` 位于更小容量，尚未被本轮更新，代表只使用前面物品的状态。当前物品最多加入一次。'],['完全背包为什么正序','c 从小到大时，`dp[c-w]` 已可能在本轮加入当前物品。再加一次正好表示同一物品可重复使用。'],['恰好装满如何初始化','若求最少物品数，除 `dp[0]=0` 外应设为无穷，表示不可达；若求方案数，`dp[0]=1` 表示“不选任何物品”是一种凑成 0 的方案。其余容量不能初始化成 1 或合法 0。']],
    template: `def can_partition(nums):
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
    return -1 if dp[amount] == float('inf') else dp[amount]`,
    templateNotes: '`can_partition` 是每个数一次的 0-1 背包，容量倒序；`coin_change` 是硬币无限次的完全背包，容量正序。',
    example: { input: 'nums=[1,5,11,5]，target=11', headers: ['处理数字','容量方向','新可达容量','dp[11]'], rows: [['初始','—','0','False'],['1','11→1','1','False'],['5','11→5','5,6','False'],['11','11','11','True']], conclusion: '一旦 11 可达，就能把总和 22 分成两个和为 11 的子集。' },
    time: 'O(n·C)', timeWhy: 'n 件物品分别扫描容量 0..C。', space: 'O(C)', spaceWhy: '压缩后只保留一维容量表。',
    signalFormula: '若干物品 + 容量/目标和 + 每件一次或无限次 → 背包 DP',
    signals: ['分割成等和子集、目标和。','凑金额的方案数或最少硬币。','选择受到总容量、总和或数量限制。'],
    pitfalls: [p('0-1 容量正序','for c in range(weight, capacity + 1):','会在同一轮重复使用当前物品，变成完全背包。'),p('不可达状态初始化为 0','dp = [0] * (amount + 1)','求最少次数时 0 会伪装成可达；使用无穷。'),p('方案数与排列数混淆','', '物品在外层通常统计组合；容量在外层可能统计不同顺序，先确认题目是否把顺序视为不同。')],
    python: { title: '倒序 `range`', body: '`range(target, value-1, -1)` 会产生 target 到 value，包含 value、不包含 value-1。步长为 -1 时停止边界也要反向理解。' },
    exercises: [q('入门','416','分割等和子集','partition-equal-subset-sum','中等','0-1 可达性。'),q('标准','494','目标和','target-sum','中等','转成选择正号子集的目标和。'),q('标准','322','零钱兑换','coin-change','中等','完全背包最小值。'),q('进阶','518','零钱兑换 II','coin-change-ii','中等','组合方案数与遍历顺序。')],
    checklist: ['能定义容量状态语义。','能证明两种遍历方向。','能按最大值、最小值、方案数选择初始化。','能识别题目的背包模型。','完成 416 和 322。'],
    nextIntro: '下一节处理两条序列：匹配时同时前进，不匹配时跳过一侧，得到经典最长公共子序列。'
  },
  {
    n: 19, slug: 'longest-common-subsequence', file: 'algorithm-19-longest-common-subsequence', permalink: '2026/09/04/algorithm-19-longest-common-subsequence/',
    short: '最长公共子序列', title: '最长公共子序列 LCS：两条序列如何对齐', tag: '动态规划', difficulty: '进阶', prerequisite: '17、二维数组', video: 'https://www.bilibili.com/video/BV1TM4y1o7ug/',
    description: '图解 LCS 二维状态表，推导字符相等与不等时的状态转移及编辑距离联系。',
    lead: '子序列可以删除字符，但不能改变剩余字符相对顺序。两条字符串末尾字符相等时可以配对；不等时，至少有一边的末尾不会进入当前最优公共子序列。',
    problem: { input: '两个字符串 text1、text2。', output: '最长公共子序列长度。', brute: '枚举 text1 的所有子序列，再检查是否也是 text2 的子序列。', bottleneck: '长度 m 的字符串有 2ᵐ 个子序列；大量不同删除路径落到相同的两个下标状态。' },
    bruteCode: `def lcs_brute(a, b):
    def dfs(i, j):
        if i == len(a) or j == len(b):
            return 0
        if a[i] == b[j]:
            return 1 + dfs(i + 1, j + 1)
        return max(dfs(i + 1, j), dfs(i, j + 1))
    return dfs(0, 0)`,
    bruteAnalysis: '递归参数只有 m·n 组，但无缓存时同一 `(i,j)` 会被多次到达。二维表将每个前缀对只计算一次。',
    core: 'dp[i][j] 表示 text1 前 i 个字符与 text2 前 j 个字符的 LCS 长度。',
    coreDetail: '末尾字符相等时可接在两个更短前缀的 LCS 后；不等时，不可能同时选两个末尾，分别尝试丢掉 text1 末尾或 text2 末尾，取较大值。',
    kind: 'dp', dpRow: {labels:['""','a','c','e'],values:['0','1','1','2']},
    steps: [['状态','dp[i][j] 对应两个前缀'],['初始化','任一前缀为空时 LCS=0'],['字符相等','dp[i][j]=dp[i-1][j-1]+1'],['字符不等','max(dp[i-1][j],dp[i][j-1])']],
    proofSteps: [['前缀划分','最后一步只看两个末尾字符'],['相等情况','存在一个最优解可配对两个相等末尾'],['不等情况','最优解至少舍弃一个末尾'],['依赖顺序','上、左、左上状态均已计算']],
    figureCaption: '二维表的行列分别代表两个字符串前缀，格子只依赖上、左和左上。',
    proof: [['字符相等为何直接加一','当 `a[i-1]==b[j-1]`，可把这个共同字符接到更短前缀的 LCS 后。即使某个最优解没使用它，也能通过交换得到同长度且使用末尾字符的解，因此该转移成立。'],['字符不等为何取两项最大','两个不同末尾不可能作为同一个公共字符同时进入序列。任一最优解至少舍弃其中一个，于是它属于 `dp[i-1][j]` 或 `dp[i][j-1]` 覆盖的情况。'],['为什么不是子串','子序列允许跳过字符，所以状态可从上或左继承；最长公共子串要求连续，不匹配时当前连续长度必须清零。']],
    template: `def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]`,
    templateNotes: 'dp 多出第 0 行和第 0 列，代表空前缀，使初始化自然为 0；字符串字符因此用 `i-1`、`j-1`。',
    example: { input: 'text1="abcde", text2="ace"', headers: ['前缀1','前缀2','末尾关系','dp'], rows: [['a','a','相等','1'],['abc','ac','c=c','2'],['abcd','ace','d≠e','2'],['abcde','ace','e=e','3']], conclusion: '最长公共子序列为 "ace"，长度 3。' },
    time: 'O(mn)', timeWhy: '表中 (m+1)(n+1) 个格子各计算一次。', space: 'O(mn)', spaceWhy: '保存完整二维表；仅求长度可滚动压缩为 O(min(m,n))。',
    signalFormula: '两条序列 + 保持相对顺序 + 匹配/跳过 → 双下标二维 DP',
    signals: ['最长公共子序列、删除后相等。','编辑距离或两个字符串对齐。','状态需要同时知道两条序列处理到哪里。'],
    pitfalls: [p('字符下标没减一','if text1[i] == text2[j]:','dp 的 i 表示前 i 个字符，最后字符下标是 i-1。'),p('不等时只丢一边','dp[i][j] = dp[i-1][j]','最优解可能需要丢另一边，取两者最大。'),p('二维列表浅拷贝','dp = [[0] * (n + 1)] * (m + 1)','所有行会引用同一列表；使用列表推导式。')],
    python: { title: '正确创建二维列表', body: '`[[0] * cols for _ in range(rows)]` 每轮创建一条新行。乘法复制外层列表只会复制引用。' },
    exercises: [q('入门','1143','最长公共子序列','longest-common-subsequence','中等','两个前缀二维 DP。'),q('标准','583','两个字符串的删除操作','delete-operation-for-two-strings','中等','答案可由 LCS 长度推出。'),q('标准','72','编辑距离','edit-distance','中等','插入、删除、替换对应三个邻格。'),q('进阶','1035','不相交的线','uncrossed-lines','中等','连线不交叉等价于保持相对顺序的 LCS。')],
    checklist: ['能解释 dp 两个下标。','能推导相等与不等分支。','能处理空前缀与字符下标。','能区分子序列和子串。','完成 1143 和 583。'],
    nextIntro: '下一节只处理一条序列，但状态要回答“以哪个位置结尾”；随后用贪心与二分把 O(n²) 优化到 O(n log n)。'
  },
  {
    n: 20, slug: 'longest-increasing-subsequence', file: 'algorithm-20-longest-increasing-subsequence', permalink: '2026/09/04/algorithm-20-longest-increasing-subsequence/',
    short: '最长递增子序列', title: '最长递增子序列 LIS：从位置 DP 到贪心二分', tag: '动态规划', difficulty: '进阶', prerequisite: '04、17', video: 'https://www.bilibili.com/video/BV1ub411Q7sB/',
    description: '推导以位置结尾的 LIS 状态，并图解 tails 数组为何可用二分维护最小结尾。',
    lead: 'LIS 允许跳过元素。若只记录“前 i 个元素的最长长度”，很难判断 nums[i] 能否接上。更有用的状态是：必须以 nums[i] 结尾时，最长长度是多少。',
    problem: { input: '整数数组 nums。', output: '最长严格递增子序列长度。', brute: '对每个元素选择加入或跳过，同时记录上一个选择值。', bottleneck: '选择树指数增长；位置 DP 降到 O(n²)，再利用“同长度结尾越小越好”降到 O(n log n)。' },
    bruteCode: `def lis_brute(nums):
    def dfs(i, previous):
        if i == len(nums):
            return 0
        best = dfs(i + 1, previous)
        if previous is None or nums[i] > previous:
            best = max(best, 1 + dfs(i + 1, nums[i]))
        return best
    return dfs(0, None)`,
    bruteAnalysis: '状态若直接带 previous 值不易压缩。位置 DP 定义 `dp[i]` 为以 i 结尾的 LIS，就只需检查所有更早且更小的 nums[j]。',
    core: '基础 DP 看“接在哪个更小位置后”；优化版 tails[length-1] 保存该长度递增子序列的最小结尾。',
    coreDetail: '结尾越小，未来越容易接入新数。对每个 value，在 tails 中找到第一个大于等于它的位置替换；若不存在则追加，表示最长长度增加。tails 本身不是最终 LIS，但长度正确。',
    kind: 'dp', dpRow: {labels:['10','9','2','5','3','7'],values:['1','1','1','2','2','3']},
    steps: [['位置状态','dp[i]=以 nums[i] 结尾的最长长度'],['朴素转移','枚举 j<i 且 nums[j]<nums[i]'],['贪心摘要','每个长度只保留最小结尾 tails'],['二分更新','替换第一个 >= value；无则追加']],
    proofSteps: [['可接条件','严格递增要求前一个结尾小于当前值'],['最小结尾','同长度下更小结尾不会让未来选择更差'],['替换安全','只改善该长度的延展能力，不改变长度'],['追加正确','value 大于所有结尾时可延长最长序列']],
    figureCaption: 'tails 压缩了大量具体序列，只保留每个长度最有希望的结尾。',
    proof: [['位置 DP 为什么成立','任何以 i 结尾、长度大于 1 的递增子序列，倒数第二个元素必在某个 j<i 且 nums[j]<nums[i]。选择其中 dp[j] 最大者再加 1，覆盖所有可能前驱。'],['为什么替换不会损失答案','对于相同长度，结尾更小的序列能接入的未来数集合包含结尾更大者能接入的集合。因此保留最小结尾至少同样有利。'],['为什么用 lower_bound','严格递增时，相等值不能延长长度，所以要替换第一个 `>= value` 的结尾。若求非递减序列，才寻找第一个 `> value`。']],
    template: `from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for value in nums:
        index = bisect_left(tails, value)
        if index == len(tails):
            tails.append(value)
        else:
            tails[index] = value
    return len(tails)`,
    templateNotes: '`bisect_left` 返回第一个大于等于 value 的位置。若需要还原具体序列，还要保存前驱与位置，不能直接返回 tails。',
    example: { input: 'nums=[10,9,2,5,3,7,101,18]', headers: ['value','操作位置','tails 更新后','含义'], rows: [['10','0','[10]','长度1最小结尾10'],['9','0','[9]','改善长度1结尾'],['2','0','[2]','继续改善'],['5','1','[2,5]','最长长度2'],['3','1','[2,3]','改善长度2结尾'],['7','2','[2,3,7]','最长长度3'],['18','3','[2,3,7,18]','最终长度4']], conclusion: 'tails 的长度是 4；其中内容恰好递增，但不保证对应原数组中的最终最优路径。' },
    time: 'O(n log n)', timeWhy: '每个元素在 tails 上做一次二分，tails 长度至多 n。', space: 'O(n)', spaceWhy: '最坏严格递增时 tails 保存 n 个结尾。',
    signalFormula: '最长递增子序列 + 只求长度 → 最小结尾贪心 + lower_bound',
    signals: ['子序列且要求严格递增。','二维偏序可排序一维后转成 LIS。','O(n²) 位置 DP 超时。'],
    pitfalls: [p('把 tails 当成原序列答案','return tails','tails 用替换压缩状态，可能不是实际 LIS；只返回长度。'),p('严格递增用 bisect_right','index = bisect_right(tails, value)','相等值会错误延长；严格递增用 bisect_left。'),p('忘记空数组','return max(dp)','空 dp 会报错；tails 写法自然返回 0。')],
    python: { title: '`bisect_left`', body: '标准库二分要求输入列表有序。它返回保持有序插入 value 的最左位置，也就是第一个 `>= value` 的位置。' },
    exercises: [q('入门','300','最长递增子序列','longest-increasing-subsequence','中等','先写 O(n²) 再优化。'),q('标准','1671','得到山形数组的最少删除次数','minimum-number-of-removals-to-make-mountain-array','困难','正向与反向 LIS。'),q('标准','354','俄罗斯套娃信封问题','russian-doll-envelopes','困难','宽升序、高降序后对高度做 LIS。'),q('进阶','1964','找出到每个位置为止最长的有效障碍赛跑路线','find-the-longest-valid-obstacle-course-at-each-position','困难','非递减版本使用 bisect_right。')],
    checklist: ['能定义以 i 结尾的 dp。','能解释最小结尾贪心。','能区分 lower_bound 与 upper_bound。','知道 tails 不能直接还原答案。','完成 300 和 354。'],
    nextIntro: '下一节一个下标需要多个状态：当天结束时持有或不持有股票，形成状态机 DP。'
  },
  {
    n: 21, slug: 'state-machine-dp', file: 'algorithm-21-state-machine-dp', permalink: '2026/09/04/algorithm-21-state-machine-dp/',
    short: '状态机 DP', title: '状态机 DP：把股票交易画成状态转移', tag: '动态规划', difficulty: '进阶', prerequisite: '17、状态定义', video: 'https://www.bilibili.com/video/BV1ho4y1W7QK/',
    description: '用持有、空仓、冷冻状态图解股票 DP，解释每条转移代表哪项合法操作。',
    lead: '股票题难在“同一天、同一价格”下可能处于不同状态：手里持有股票与空仓的未来选择完全不同。一个 dp 值不够，需要把状态也放进下标。',
    problem: { input: '每日价格 prices，卖出后有一天冷冻期。', output: '最多能获得的利润。', brute: '每天递归选择买、卖或休息，并携带持有/冷冻状态。', bottleneck: '选择路径指数增长，但真正不同的状态只有“天数 × 少量持仓状态”。' },
    bruteCode: `def max_profit_brute(prices):
    def dfs(day, holding, cooldown):
        if day == len(prices):
            return 0
        best = dfs(day + 1, holding, False)
        if holding:
            best = max(best, prices[day] + dfs(day + 1, False, True))
        elif not cooldown:
            best = max(best, -prices[day] + dfs(day + 1, True, False))
        return best
    return dfs(0, False, False)`,
    bruteAnalysis: '每个状态有少量分支。把 `(day, state)` 缓存后为 O(n)，递推只需维护持有、刚卖出、空闲三个状态。',
    core: '先列出互斥且完整的状态，再为每条合法操作画有向边；DP 转移就是“从哪些旧状态能到当前状态”。',
    coreDetail: '设 `hold` 为当天结束持有，`sold` 为当天刚卖出，`rest` 为当天结束空仓且不在刚卖状态。更新必须同时使用前一天旧值。',
    kind: 'dp', dpRow: {labels:['第0天','第1天','第2天','第3天','第4天'],values:['0','1','2','2','3']},
    steps: [['定义状态','hold / sold / rest'],['画合法边','持有可保持或卖出；空闲可保持或买入'],['写转移','当前值取所有入边来源最大值'],['同时更新','先计算 new_*，再覆盖旧状态']],
    proofSteps: [['状态互斥','一天结束只能属于一个持仓状态'],['状态完整','所有合法交易历史必落入某状态'],['边合法','每条转移对应休息、买入或卖出'],['最优继承','当前状态取所有合法前驱的最大利润']],
    figureCaption: '先画状态与合法操作，再写 max；这样不会凭空遗漏冷冻约束。',
    proof: [['为什么需要三个状态','卖出后的第二天不能买入，所以“刚卖出空仓”与“普通空仓”未来允许的动作不同，不能合并。'],['转移为何完整','新 hold 来自旧 hold 休息或旧 rest 买入；新 sold 只能来自旧 hold 卖出；新 rest 来自旧 rest 休息或旧 sold 度过冷冻。每种合法历史的最后动作必属于其中一条边。'],['为什么最后不返回 hold','持有状态的利润已扣除买入成本且股票尚未变现。最优完成利润一定在 sold 或 rest 中，返回两者最大。']],
    template: `def max_profit_with_cooldown(prices):
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

    return max(sold, rest)`,
    templateNotes: '用 `new_*` 明确全部来源是前一天。Python 元组同时赋值也会先计算右侧，因此最后一行安全。',
    example: { input: 'prices=[1,2,3,0,2]', headers: ['天/价格','hold','sold','rest','解释'], rows: [['0/1','-1','-∞','0','初始化'],['1/2','-1','1','0','卖出'],['2/3','-1','2','1','卖出或休息'],['3/0','1','-1','2','冷冻结束后买入'],['4/2','1','3','2','卖出，总利润3']], conclusion: '最优操作是买1卖2、冷冻、买0卖2，利润 3。' },
    time: 'O(n)', timeWhy: '每天只更新固定三个状态。', space: 'O(1)', spaceWhy: '滚动保存前一天状态。',
    signalFormula: '同一位置存在少量互斥模式 + 操作限制模式切换 → 状态机 DP',
    signals: ['买卖股票、交易次数、冷冻期或手续费。','当前位置有持有/未持有等模式。','限制可以画成有限状态之间的边。'],
    pitfalls: [p('原地依次更新','hold = max(hold, rest-price)\nsold = hold+price','sold 读到新 hold，可能在同一天买入又卖出。使用 new 变量。'),p('sold 初始化为 0','sold = 0','第 0 天不可能刚卖出；用负无穷表示不可达。'),p('返回 hold','return max(hold, sold, rest)','最终持有不是已实现利润，返回空仓状态。')],
    python: { title: '负无穷表示不可达', body: '`float("-inf")` 参与 max 时不会胜过合法利润，但从合法状态转移后可以变为有限值，适合最大化 DP 的不可能状态。' },
    exercises: [q('入门','122','买卖股票的最佳时机 II','best-time-to-buy-and-sell-stock-ii','中等','持有/空仓两状态。'),q('标准','309','最佳买卖股票时机含冷冻期','best-time-to-buy-and-sell-stock-with-cooldown','中等','三个状态。'),q('标准','714','买卖股票的最佳时机含手续费','best-time-to-buy-and-sell-stock-with-transaction-fee','中等','在买或卖的一侧扣一次手续费。'),q('进阶','188','买卖股票的最佳时机 IV','best-time-to-buy-and-sell-stock-iv','困难','增加交易次数维度。')],
    checklist: ['能列出互斥且完整的状态。','能为每条转移指出具体动作。','能正确初始化不可达状态。','能避免滚动更新污染。','完成 122 和 309。'],
    nextIntro: '下一节状态不再是前缀，而是一段区间；计算顺序必须按区间长度从短到长。'
  },
  {
    n: 22, slug: 'interval-dp', file: 'algorithm-22-interval-dp', permalink: '2026/09/04/algorithm-22-interval-dp/',
    short: '区间 DP', title: '区间 DP：从短区间推到长区间', tag: '动态规划', difficulty: '进阶', prerequisite: '17、19', video: 'https://www.bilibili.com/video/BV1Gs4y1E7EU/',
    description: '用最长回文子序列图解区间状态、两端决策和按长度递增的遍历顺序。',
    lead: '当一次决策会删掉左端、右端或把区间分成两段时，前缀 dp 很难表达。区间 DP 直接定义 `dp[left][right]`，让更长区间依赖更短区间。',
    problem: { input: '字符串 s。', output: '最长回文子序列长度。', brute: '枚举所有子序列并检查是否回文。', bottleneck: '共有 2ⁿ 个子序列；而同一左右边界会被不同删除顺序反复到达。' },
    bruteCode: `def lps_brute(s):
    def dfs(left, right):
        if left > right:
            return 0
        if left == right:
            return 1
        if s[left] == s[right]:
            return 2 + dfs(left + 1, right - 1)
        return max(dfs(left + 1, right), dfs(left, right - 1))
    return dfs(0, len(s) - 1)`,
    bruteAnalysis: '递归状态只有 O(n²) 个。区间表按长度递增填充，确保 `[left+1,right-1]`、`[left+1,right]`、`[left,right-1]` 都已计算。',
    core: 'dp[left][right] 表示闭区间 s[left:right+1] 的答案；短区间是长区间的地基。',
    coreDetail: '两端相等时可同时进入回文序列，中间取最优；两端不同则至少舍弃一端，取两个缩短区间的较大值。单字符区间初始化为 1。',
    kind: 'dp', dpRow: {labels:['长度1','长度2','长度3','长度4','长度5'],values:['1','2','2','3','4']},
    steps: [['状态','dp[l][r] 是闭区间最长回文子序列'],['初始化','dp[i][i]=1'],['按长度枚举','length 从 2 到 n'],['两端转移','相等取内层+2；不等舍弃一端']],
    proofSteps: [['边界缩小','每个来源区间长度都更短'],['两端相等','可把两端放在最优内部序列外侧'],['两端不等','回文序列不可能同时使用不同的两端'],['长度顺序','计算当前格时依赖均已完成']],
    figureCaption: '按长度填表比按普通行列更直观：所有箭头都从短区间指向长区间。',
    proof: [['两端相等为什么加二','若 `s[l]==s[r]`，可以把它们放到区间 `(l,r)` 的最长回文子序列两端，形成更长回文。存在一个最优解能同时使用这两个边界字符。'],['两端不同为什么舍弃一端','回文序列的首尾字符必须相等，因此不同的 s[l]、s[r] 不可能同时作为所选序列两端。任一最优解至少不使用其中一个，被两个子区间之一覆盖。'],['为什么必须先算短区间','当前状态依赖长度减少 1 或 2 的状态。如果按错误方向遍历，读到的仍是初始 0，会让结果偏小。']],
    template: `def longest_palindrome_subseq(s):
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

    return dp[0][n - 1]`,
    templateNotes: '长度为 2 且两端相等时内部是空区间，所以额外取 0。也可把表扩展或改变遍历方式统一边界。',
    example: { input: 's="bbbab"', headers: ['区间','两端','来源','dp'], rows: [['[0,0]','b','单字符','1'],['[0,1]','b=b','空内部+2','2'],['[1,3]','b≠a','max([2,3],[1,2])','2'],['[0,4]','b=b','dp[1][3]+2','4']], conclusion: '答案 4，对应子序列 "bbbb"。' },
    time: 'O(n²)', timeWhy: '共有约 n²/2 个有效区间，每个常数转移。', space: 'O(n²)', spaceWhy: '保存所有左右边界组合。',
    signalFormula: '答案定义在连续区间 + 决策缩两端或枚举分割点 → 区间 DP',
    signals: ['回文、合并石子、切割区间。','操作对象始终是一段 `[l,r]`。','大区间由更短区间或两段子区间得到。'],
    pitfalls: [p('按 left 从小到大、right 从小到大','for left in range(n):\n    for right in range(left, n):','可能在依赖尚未计算时读取。按长度递增最清楚。'),p('空字符串返回 dp[0]','', '先处理 n==0。'),p('长度2访问反向区间','dp[left + 1][right - 1]','为长度 2 单独把内部贡献设为 0。')],
    python: { title: '切片与区间 DP 下标', body: 'Python 切片右端不包含，而本文 dp 使用闭区间。写 `s[left:right+1]` 才对应 dp 的范围；不要让两套边界混在一起。' },
    exercises: [q('入门','516','最长回文子序列','longest-palindromic-subsequence','中等','两端相等/不等。'),q('标准','1039','多边形三角剖分的最低得分','minimum-score-triangulation-of-polygon','中等','枚举区间内分割点。'),q('标准','1547','切棍子的最小成本','minimum-cost-to-cut-a-stick','困难','排序切点，区间代价加左右子问题。'),q('进阶','312','戳气球','burst-balloons','困难','反向思考区间内最后戳哪个。')],
    checklist: ['能定义闭区间状态。','能推导两端分支。','能按长度确定遍历顺序。','能处理单字符、空区间。','完成 516 和 1039。'],
    nextIntro: '下一阶段把 DP 搬到树上：子树返回向下延伸的链，当前节点把两条链拼成直径。'
  },
  {
    n: 23, slug: 'tree-dp-diameter', file: 'algorithm-23-tree-dp-diameter', permalink: '2026/09/04/algorithm-23-tree-dp-diameter/',
    short: '树形 DP：直径', title: '树形 DP（一）：返回单链，更新两链之和', tag: '树形DP', difficulty: '进阶', prerequisite: '09、17', video: 'https://www.bilibili.com/video/BV17o4y187h1/',
    description: '图解树的直径：递归向父节点返回最长单链，在当前节点用左右链之和更新答案。',
    lead: '树的直径可能经过根，也可能完全藏在某棵子树中。关键是区分两种量：向父节点只能贡献一条向下路径；全局答案可以在当前节点拼接左右两条路径。',
    problem: { input: '一棵二叉树。', output: '任意两节点间最长路径的边数。', brute: '从每个节点出发搜索到所有其他节点，取最大距离。', bottleneck: '重复经过同一边，最坏 O(n²)；后序递归能让每条边只贡献一次。' },
    bruteCode: `def diameter_brute(graph):
    answer = 0
    for start in graph:
        stack = [(start, None, 0)]
        while stack:
            node, parent, distance = stack.pop()
            answer = max(answer, distance)
            for nxt in graph[node]:
                if nxt != parent:
                    stack.append((nxt, node, distance + 1))
    return answer`,
    bruteAnalysis: '对每个起点重新遍历整棵树会重复 O(n) 次。树形 DP 在每个节点汇总孩子信息，全局只遍历一次。',
    core: 'dfs(node) 返回从 node 向下的最长链长；在 node 处用 left_chain + right_chain 更新全局直径。',
    coreDetail: '返回给父节点的路径不能同时进入左右孩子，否则会在当前节点分叉，不再是一条简单链；但作为完整直径，恰好可以把两条向下链拼起来。',
    kind: 'tree', treeLabels: ['1','2','3','4','5'],
    steps: [['孩子返回','left、right 是左右向下最长链边数'],['拼接答案','经过当前节点的直径候选=left+right'],['更新全局','answer=max(answer,left+right)'],['向上返回','max(left,right)+1，只选一侧']],
    proofSteps: [['路径最高点','任意路径有唯一最靠近根的节点'],['两侧分解','路径在最高点分为至多两条向下链'],['局部枚举','每个节点都被尝试作为最高点'],['单链返回','父节点只能延续其中较长一侧']],
    figureCaption: '节点 2 可以把通向 4、5 的两条链拼成局部路径，但向节点 1 只能返回其中一条。',
    proof: [['为什么遍历所有节点就覆盖直径','任意两节点路径都有唯一的最高点（最近公共祖先）。当 DFS 处理这个最高点时，左右返回值正好给出路径向两侧可延伸的最大长度，因此该直径候选一定被比较。'],['为什么返回时只能选一条','父节点若使用当前子树中的路径，进入当前节点后只能继续向一个孩子，否则路径会分叉成三条，不再是两端之间的简单路径。'],['边数与节点数如何统一','空节点返回 0，孩子链长加 1 表示经过一条边。`left+right` 自然是边数。若题目要求节点数，定义和公式要相应调整。']],
    template: `def diameter_of_binary_tree(root):
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
    return answer`,
    templateNotes: '`dfs` 的返回值与全局答案不是同一量。看到树形 DP 时先分别写出“向父亲交什么”和“当前节点更新什么”。',
    example: { input: '树 [1,2,3,4,5]', headers: ['节点','left','right','更新直径','返回链'], rows: [['4','0','0','0','1'],['5','0','0','0','1'],['2','1','1','2','2'],['3','0','0','2','1'],['1','2','1','3','3']], conclusion: '最长路径可为 4→2→1→3，共 3 条边。' },
    time: 'O(n)', timeWhy: '每个节点后序处理一次。', space: 'O(h)', spaceWhy: '递归栈随树高增长。',
    signalFormula: '树上最长路径 + 路径可在节点拼两条链 → 返回单链，局部更新双链',
    signals: ['树的直径、任意两点最长路径。','答案可能经过当前节点，也可能在子树。','父节点需要孩子的单方向最佳贡献。'],
    pitfalls: [p('向父节点返回左右之和','return left + right + 1','这会把分叉结构当成单链；只能返回较大一侧。'),p('忘记 nonlocal','answer = max(answer, left + right)','嵌套函数给 answer 赋值前需声明 `nonlocal answer`。'),p('边数节点数差一','', '用最小树手算：单节点直径边数应为 0。')],
    python: { title: '`nonlocal` 修改外层变量', body: '嵌套函数中给外层局部变量赋值，需要 `nonlocal answer`。若只读取或修改列表内容，则不一定需要。' },
    exercises: [q('入门','543','二叉树的直径','diameter-of-binary-tree','简单','返回单链、更新双链。'),q('标准','124','二叉树中的最大路径和','binary-tree-maximum-path-sum','困难','负贡献取 0，节点处拼两侧。'),q('标准','2246','相邻字符不同的最长路径','longest-path-with-different-adjacent-characters','困难','只接字符不同的孩子链。'),q('进阶','687','最长同值路径','longest-univalue-path','中等','只延伸与当前值相同的链。')],
    checklist: ['能区分返回值与全局答案。','能解释路径最高点。','能处理边数定义。','能写后序单链模板。','完成 543 和 124。'],
    nextIntro: '下一节每个节点有“选”和“不选”两个状态，父子不能同时选择，形成树上的最大独立集。'
  },
  {
    n: 24, slug: 'tree-dp-independent-set', file: 'algorithm-24-tree-dp-independent-set', permalink: '2026/09/04/algorithm-24-tree-dp-independent-set/',
    short: '树形 DP：最大独立集', title: '树形 DP（二）：选或不选节点的两个状态', tag: '树形DP', difficulty: '进阶', prerequisite: '23、后序递归', video: 'https://www.bilibili.com/video/BV1vu4y1f7dn/',
    description: '以打家劫舍 III 为例图解树上最大独立集，推导选节点与不选节点的两个返回状态。',
    lead: '树上相邻节点不能同时选择。只让子树返回一个最大值不够，因为父节点选择与否会限制孩子能否选择。子树必须同时汇报两种条件下的最优值。',
    problem: { input: '每个树节点有非负价值。', output: '不同时选择父子节点时的最大价值和。', brute: '对当前节点选或不选；选时递归孙子，不选时递归孩子。', bottleneck: '同一孙子会从不同路径反复计算；且跳层写法难推广到多叉树。' },
    bruteCode: `def rob_tree_brute(node):
    if node is None:
        return 0
    choose = node.val
    if node.left:
        choose += rob_tree_brute(node.left.left) + rob_tree_brute(node.left.right)
    if node.right:
        choose += rob_tree_brute(node.right.left) + rob_tree_brute(node.right.right)
    skip = rob_tree_brute(node.left) + rob_tree_brute(node.right)
    return max(choose, skip)`,
    bruteAnalysis: '子树被多次调用。后序一次返回 `(skip, choose)`，父节点直接组合孩子两种状态。',
    core: 'dfs(node) 返回两个值：不选 node 的最大收益 skip，以及选择 node 的最大收益 choose。',
    coreDetail: '选当前节点时孩子必须不选；不选当前节点时，每个孩子可以独立选择它自己的较优状态。两个孩子之间没有边，因此可以分别取最大再相加。',
    kind: 'tree', treeLabels: ['3','2','3','3','1'],
    steps: [['状态返回','每棵子树返回 (skip, choose)'],['选择当前','node.val + left.skip + right.skip'],['不选当前','max(left) + max(right)'],['根取答案','max(root.skip, root.choose)']],
    proofSteps: [['条件拆分','父节点只需知道孩子是否被选择'],['选当前约束','相邻孩子必须处于 skip'],['不选当前自由','左右孩子状态互不影响，各取最优'],['完整覆盖','根最终也有选/不选两类']],
    figureCaption: '两个返回值保留了父节点做决定所需的条件信息，不能过早合并成一个最大值。',
    proof: [['为什么不选时可分别取最大','左右子树之间没有边，选择方案互不冲突。当前节点不选后，孩子是否选择不再受父亲限制，因此每棵子树独立取自身较大状态。'],['为什么选时只能用 skip','当前与孩子相邻，独立集不能同时包含相邻节点。选择当前后，每个直接孩子都必须不选，但孙子选择已经包含在孩子的 skip 最优值中。'],['为什么两个状态足够','父节点对整棵孩子子树的唯一外部约束就是“孩子根能否被选”。子树内部细节已经由最优值概括，无需传完整方案。']],
    template: `def rob_tree(root):
    def dfs(node):
        if node is None:
            return 0, 0  # skip, choose

        left_skip, left_choose = dfs(node.left)
        right_skip, right_choose = dfs(node.right)

        choose = node.val + left_skip + right_skip
        skip = max(left_skip, left_choose) + max(right_skip, right_choose)
        return skip, choose

    return max(dfs(root))`,
    templateNotes: '元组顺序要固定。建议解包时使用带语义变量名，不要写 a、b，否则很容易在转移中选错状态。',
    example: { input: 'root=[3,2,3,null,3,null,1]', headers: ['节点','skip','choose','说明'], rows: [['叶3','0','3','选叶子收益3'],['节点2','3','2','不选2可选孩子3'],['节点3(右)','1','3','比较孩子1'],['根3','6','7','选根+两侧skip']], conclusion: '根选择状态收益 7，大于不选状态 6。' },
    time: 'O(n)', timeWhy: '每个节点计算一次两个状态。', space: 'O(h)', spaceWhy: '递归栈；每层只保存常数状态。',
    signalFormula: '树上选择 + 父子互斥 + 父亲只关心孩子根状态 → 每节点返回选/不选',
    signals: ['树上不能选相邻节点。','选择当前会限制孩子，但不直接限制更深后代。','父节点需要条件化的子树最优值。'],
    pitfalls: [p('子树只返回最大值','return max(skip, choose)','父节点选中时必须强制孩子 skip，过早取 max 会丢信息。'),p('选当前时使用孩子 choose','choose = node.val + max(left) + max(right)','这允许父子同时选。'),p('空节点返回单个 0','return 0','调用处要解包两个状态，应返回 `(0,0)`。')],
    python: { title: '元组解包', body: '`left_skip, left_choose = dfs(node.left)` 按位置取出两个结果。返回值顺序必须在注释和所有调用中保持一致。' },
    exercises: [q('入门','337','打家劫舍 III','house-robber-iii','中等','返回 skip、choose。'),q('标准','2646','最小化旅行的价格总和','minimize-the-total-price-of-the-trips','困难','先统计经过次数，再做树上选/不选。'),q('标准','968','监控二叉树','binary-tree-cameras','困难','尝试三状态树 DP。'),q('进阶','2378','选择边来最大化树的得分','choose-edges-to-maximize-score-in-a-tree','中等','节点与父边选择形成条件状态。')],
    checklist: ['能说明为什么一个返回值不够。','能推导 choose 与 skip。','能解释左右子树独立。','能用元组返回状态。','完成 337。'],
    nextIntro: '下一节需要三种状态才能描述“被自己覆盖、被孩子覆盖、等待父亲覆盖”，完成最小支配集模型。'
  },
  {
    n: 25, slug: 'tree-dp-dominating-set', file: 'algorithm-25-tree-dp-dominating-set', permalink: '2026/09/04/algorithm-25-tree-dp-dominating-set/',
    short: '树形 DP：最小支配集', title: '树形 DP（三）：三状态覆盖与摄像头', tag: '树形DP', difficulty: '挑战', prerequisite: '24、多状态 DP', video: 'https://www.bilibili.com/video/BV1oF411U7qL/',
    description: '以监控二叉树为例图解未覆盖、有摄像头、已覆盖三状态，推导后序贪心与树形 DP。',
    lead: '摄像头能覆盖自己、父亲和直接孩子。父节点处理孩子时，必须区分孩子是“自己装了摄像头”“已被孩子覆盖”还是“仍等待父亲覆盖”。两个状态已经不够。',
    problem: { input: '一棵二叉树。', output: '覆盖所有节点所需最少摄像头数量。', brute: '枚举每个节点装或不装摄像头，再检查覆盖。', bottleneck: '有 2ⁿ 个安装子集，大多数在局部就已不可行或明显浪费。' },
    bruteCode: `def cameras_brute(root):
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
    return best`,
    bruteAnalysis: '枚举安装集合指数增长。后序处理能在看到孩子状态后做局部必需决策：只要孩子未覆盖，当前节点必须装摄像头。',
    core: '后序返回 0=未覆盖、1=有摄像头、2=已覆盖；孩子未覆盖时当前必须装，孩子有摄像头时当前已覆盖。',
    coreDetail: '空节点返回“已覆盖”，避免给叶子下面安装摄像头。叶子收到两个已覆盖孩子，因此自己返回未覆盖，请求父亲处理；这会把摄像头优先放在叶子的父节点，覆盖更多节点。',
    kind: 'tree', treeLabels: ['父','摄像头','已覆盖','叶','叶'],
    steps: [['状态0','未覆盖：等待父节点放摄像头'],['状态1','有摄像头：覆盖父、自己、孩子'],['状态2','已覆盖：自己无摄像头但孩子有'],['根收尾','根若仍未覆盖，再加一个摄像头']],
    proofSteps: [['叶下空节点','视为已覆盖，不需要设备'],['孩子未覆盖','唯一还能覆盖它的位置是当前节点'],['孩子有设备','当前节点自然已覆盖，无需重复安装'],['都已覆盖','当前暂不安装，向父亲请求可能更优覆盖']],
    figureCaption: '状态不仅描述当前节点，还表达它向父节点提出的需求。',
    proof: [['孩子未覆盖为何必须装','后序阶段孩子自己的子树已决定，孩子没有摄像头且未被它的孩子覆盖。能覆盖它的剩余位置只有当前父节点，因此当前安装是强制选择。'],['都已覆盖为何返回未覆盖','当前节点的孩子不需要当前帮助。若现在安装，可能只覆盖当前和父亲；把决定推迟给父亲，有机会同时覆盖父亲的另一棵子树，不会更差。'],['根为什么单独处理','普通节点可以请求父亲覆盖，但根没有父亲。DFS 结束后若根返回未覆盖，只能在根安装一台。']],
    template: `def min_camera_cover(root):
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
    return cameras`,
    templateNotes: '数字状态要配注释或改用枚举常量。这里保留短数字是为了对照经典转移，但阅读时必须能说出每个值的含义。',
    example: { input: '根只有一个左孩子，左孩子还有两个叶子', headers: ['节点','孩子状态','动作','返回'], rows: [['两个叶子','2,2','不装，请求父亲','0'],['左孩子','0,0','必须装摄像头','1'],['根','1,2','被孩子覆盖','2']], conclusion: '只在中间节点安装一台即可覆盖全部四个节点。' },
    time: 'O(n)', timeWhy: '每个节点根据两个孩子状态做常数判断。', space: 'O(h)', spaceWhy: '递归栈随树高增长。',
    signalFormula: '树上最小覆盖 + 节点可覆盖邻居 + 需要向父节点表达需求 → 三状态后序 DP/贪心',
    signals: ['最少设备覆盖节点及邻居。','子树状态要区分已满足、主动提供、等待父亲。','父节点是孩子未满足时最后的补救位置。'],
    pitfalls: [p('空节点返回未覆盖','if node is None:\n    return 0','会迫使在叶子安装摄像头；空节点应视为已覆盖。'),p('忘记根收尾','dfs(root)\nreturn cameras','根可能返回未覆盖且没有父节点。'),p('状态含义混乱','', '在代码旁写明 0/1/2，修改转移时逐项核对。')],
    python: { title: '用常量提高可读性', body: '工程代码可写 `UNCOVERED, CAMERA, COVERED = range(3)`，转移中使用名字，减少数字含义记错。', code: `UNCOVERED, CAMERA, COVERED = range(3)` },
    exercises: [q('入门','968','监控二叉树','binary-tree-cameras','困难','后序三状态。'),q('标准','979','在二叉树中分配硬币','distribute-coins-in-binary-tree','中等','子树向父节点返回硬币盈亏。'),q('标准','834','树中距离之和','sum-of-distances-in-tree','困难','两次 DFS 换根 DP。'),q('进阶','1245','树的直径','tree-diameter','中等','复习返回单链模型。')],
    checklist: ['能说出三种状态。','能证明孩子未覆盖时当前必须装。','能解释空节点和根的特殊处理。','能独立画状态转移。','完成 968。'],
    nextIntro: '最后一个阶段回到数组。单调栈保存尚未找到答案的下标，新元素到来时一次解决一批旧问题。'
  },
  {
    n: 26, slug: 'monotonic-stack', file: 'algorithm-26-monotonic-stack', permalink: '2026/09/04/algorithm-26-monotonic-stack/',
    short: '单调栈', title: '单调栈：及时淘汰不可能的候选', tag: '单调栈', difficulty: '标准', prerequisite: '数组、栈、下标', video: 'https://www.bilibili.com/video/BV1VN411J7S7/',
    description: '从每日温度图解单调栈，解释为什么弹出的下标得到第一个更大元素以及总复杂度为何是 O(n)。',
    lead: '对每一天向右扫描寻找第一个更高温度，会反复走过同一段。单调栈反过来处理：新温度到来时，帮助栈中所有更冷且尚未解决的日期结算答案。',
    problem: { input: '每天温度数组 temperatures。', output: '每一天还要等几天才有更高温度，没有则 0。', brute: '从每个位置向右逐个找第一个更大值。', bottleneck: '递减数组中每个起点都扫描到末尾，最坏 O(n²)。' },
    bruteCode: `def daily_temperatures_brute(temperatures):
    answer = [0] * len(temperatures)
    for i in range(len(temperatures)):
        for j in range(i + 1, len(temperatures)):
            if temperatures[j] > temperatures[i]:
                answer[i] = j - i
                break
    return answer`,
    bruteAnalysis: '栈保存还没看到更高温度的下标。保持对应温度单调不增，新值更高时不断弹出并结算。',
    core: '栈内保存“仍等待第一个更大值”的下标，并保持对应值从栈底到栈顶单调不增。',
    coreDetail: '遍历到 index 时，若当前温度大于栈顶，当前就是栈顶右侧遇到的第一个更大温度：更早位置都不够大，否则栈顶早已弹出。',
    kind: 'stack', steps: [['栈存下标','下标同时提供温度与距离'],['比较栈顶','当前温度更高时，栈顶问题被解决'],['连续弹出','一次新温度可解决多个更冷日期'],['当前入栈','等待未来第一个更高温度']],
    proofSteps: [['未解决含义','栈中下标右侧已扫描部分都不更大'],['单调维护','弹掉小于当前值的栈顶'],['第一个保证','当前是弹出下标首次遇到的更大值'],['摊还复杂度','每个下标只入栈、出栈各一次']],
    figureCaption: '栈不是保存所有历史，而是只保存还可能需要未来元素回答的候选。',
    proof: [['为什么当前是第一个更大值','下标 j 从入栈到当前 i 之间一直未被弹出，说明中间没有任何温度大于 temperatures[j]。当前首次满足更大条件，因此距离 i-j 正确。'],['为什么弹出后不再需要','题目只问第一个更大位置。答案一旦确定，后续即使更大也更远，不可能替换当前答案。'],['嵌套 while 为什么 O(n)','一个下标最多入栈一次、弹出一次。某轮弹很多，是在结算以前积累的元素；全程弹出总次数不超过 n。']],
    template: `def daily_temperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []

    for index, temperature in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temperature:
            previous = stack.pop()
            answer[previous] = index - previous
        stack.append(index)

    return answer`,
    templateNotes: '严格“更高”使用 `<` 才弹；相等温度不能解决彼此。若题目问大于等于，比较符号才改成 `<=`。',
    example: { input: 'temperatures=[73,74,75,71,69,72,76,73]', headers: ['当前','入栈前','弹出并结算','入栈后'], rows: [['73@0','[]','—','[0]'],['74@1','[0]','0→1天','[1]'],['75@2','[1]','1→1天','[2]'],['72@5','[2,3,4]','4→1天，3→2天','[2,5]'],['76@6','[2,5]','5→1天，2→4天','[6]']], conclusion: '未被弹出的下标右侧没有更高温度，答案保持 0。' },
    time: 'O(n)', timeWhy: '每个下标入栈一次、出栈至多一次。', space: 'O(n)', spaceWhy: '完全递减时所有下标都留在栈中。',
    signalFormula: '对每个位置找左/右第一个更大或更小 → 单调栈',
    signals: ['下一个更大元素、每日温度。','柱状图左右第一个更矮边界。','新元素能一次淘汰一批旧候选。'],
    pitfalls: [p('栈里只存值','stack.append(temperature)','题目要求距离或位置，必须存下标。'),p('相等时错误弹出','while stack and temperatures[stack[-1]] <= temperature:','每日温度要求严格更高，相等不能结算。'),p('误判 while 为 O(n²)','', '用每个元素入栈/出栈次数做摊还分析。')],
    python: { title: '列表作为栈', body: 'Python 列表尾部 `append()` 与 `pop()` 都是均摊 O(1)。`stack[-1]` 查看栈顶但不删除。' },
    exercises: [q('入门','739','每日温度','daily-temperatures','中等','单调不增下标栈。'),q('标准','496','下一个更大元素 I','next-greater-element-i','简单','新值弹栈时记录映射。'),q('标准','84','柱状图中最大的矩形','largest-rectangle-in-histogram','困难','弹栈时确定高度的左右边界。'),q('进阶','42','接雨水','trapping-rain-water','困难','弹出凹槽底，左右边界结算横向雨水。')],
    checklist: ['能说出栈中元素代表什么。','能证明弹出时是第一个更大值。','能用摊还分析解释 O(n)。','能按严格/非严格选择比较符。','完成 739 和 84。'],
    nextIntro: '最后一节给单调结构加上队头过期规则，使它能维护滑动窗口中的最大值。'
  },
  {
    n: 27, slug: 'monotonic-queue', file: 'algorithm-27-monotonic-queue', permalink: '2026/09/04/algorithm-27-monotonic-queue/',
    short: '单调队列', title: '单调队列：同时淘汰过期与劣势候选', tag: '单调队列', difficulty: '进阶', prerequisite: '03、26、deque', video: 'https://www.bilibili.com/video/BV1bM411X72E/',
    description: '图解滑动窗口最大值的单调队列，解释队头过期、队尾淘汰及每个元素只进出一次。',
    lead: '滑动窗口每移动一步，都要删除最左元素、加入最右元素并询问最大值。普通队列能处理进出，却不能 O(1) 找最大；堆能找最大，但删除过期元素较绕。单调队列同时维护有效期和竞争力。',
    problem: { input: '数组 nums 与固定窗口宽度 k。', output: '每个长度 k 窗口的最大值。', brute: '枚举每个窗口并调用 max。', bottleneck: '共有 O(n) 个窗口，每次 max 扫描 k 个元素，总时间 O(nk)。' },
    bruteCode: `def max_sliding_window_brute(nums, k):
    return [max(nums[left:left + k])
            for left in range(len(nums) - k + 1)]`,
    bruteAnalysis: '相邻窗口高度重叠，却重新比较几乎全部元素。单调队列只保存仍在窗口内、且可能成为未来最大值的下标。',
    core: '队头删除过期下标；队尾删除不大于新值的劣势候选；队头始终是当前窗口最大值下标。',
    coreDetail: '若新值大于等于队尾旧值，新值更大且更晚过期，旧值在任何未来共同窗口中都不可能胜出，因此可永久淘汰。队列对应值保持严格递减。',
    kind: 'stack', steps: [['过期检查','队头下标 < index-k+1 时 popleft'],['队尾竞争','nums[tail] <= 当前值时持续 pop'],['新下标入队','保持下标递增、值严格递减'],['读取最大值','窗口形成后 nums[queue[0]]']],
    proofSteps: [['有效期','队列下标始终位于当前窗口'],['支配关系','更晚且不小的新值完全支配旧值'],['单调队列','队头对应保留候选中的最大值'],['摊还成本','每个下标入队一次，从一端出队一次']],
    figureCaption: '队头管“是否过期”，队尾管“是否还值得保留”，两端职责不同。',
    proof: [['为什么能从队尾淘汰','设旧下标 j<当前 i 且 nums[j]<=nums[i]。只要 j 仍在某个未来窗口，i 也一定在，因为 i 更晚；同时 i 的值不小于 j。所以 j 永远不可能成为最大值。'],['为什么队头就是最大','所有保留下标按值严格递减，队头值最大；又因为过期下标已被删除，队头属于当前窗口。'],['为什么仍是 O(n)','每个下标只 append 一次。它之后要么因被更强新值支配从队尾弹出，要么因过期从队头弹出，不会重复进入。']],
    template: `from collections import deque

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

    return answer`,
    templateNotes: '存下标才能判断过期。使用 `<=` 弹出相等旧值，保留更晚下标；保留相等值也能正确，但队列更长、规则不同。',
    example: { input: 'nums=[1,3,-1,-3,5,3,6,7], k=3', headers: ['index/value','过期','队尾弹出','队列值','窗口最大'], rows: [['0/1','无','无','[1]','未形成'],['1/3','无','弹1','[3]','未形成'],['2/-1','无','无','[3,-1]','3'],['3/-3','无','无','[3,-1,-3]','3'],['4/5','3过期前也被支配','弹-3,-1','[5]','5'],['6/6','无','弹3,5','[6]','6']], conclusion: '输出 `[3,3,5,5,6,7]`；队列中不必保留窗口全部元素。' },
    time: 'O(n)', timeWhy: '每个下标入队一次，并从队头或队尾离开至多一次。', space: 'O(k)', spaceWhy: '队列只保存当前窗口候选，下标数量不超过 k。',
    signalFormula: '固定/变化窗口 + 反复查询最大最小 + 窗口滑动 → 单调队列',
    signals: ['滑动窗口最大值/最小值。','元素会过期，同时较弱候选可提前淘汰。','需要把每次查询从 O(k) 降到均摊 O(1)。'],
    pitfalls: [p('队列存值','queue.append(value)','无法知道队头何时离开窗口；必须存下标。'),p('过期边界写错','if queue[0] <= left:\n    queue.popleft()','当前窗口左端就是 left，只有下标 `< left` 才过期。'),p('先输出再清理','', '必须先删除过期和维护单调性，再读取队头。')],
    python: { title: '`deque` 的两端操作', body: '`popleft()` 删除过期队头，`pop()` 删除劣势队尾，`append()` 加入新下标；三者都是 O(1)。' },
    exercises: [q('入门','239','滑动窗口最大值','sliding-window-maximum','困难','下标递增、值递减的 deque。'),q('标准','1438','绝对差不超过限制的最长连续子数组','longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit','中等','同时维护最大与最小两个单调队列。'),q('标准','1696','跳跃游戏 VI','jump-game-vi','中等','维护最近 k 个 dp 值最大值。'),q('进阶','862','和至少为 K 的最短子数组','shortest-subarray-with-sum-at-least-k','困难','对前缀和维护单调队列。')],
    checklist: ['能区分队头过期与队尾支配。','能证明更晚且更大者支配旧值。','能写窗口形成条件。','能用入队出队次数分析 O(n)。','完成 239 和 1438。'],
    nextIntro: '27 节主线到这里结束。回到学习地图按模块复盘，并优先重做每篇的两道入门/标准题。'
  },
];
