import fs from 'node:fs';
import path from 'node:path';
import { articles, firstCourse, stages } from './algorithm-series-data.mjs';

const root = path.resolve(import.meta.dirname, '..');
const postRoot = path.join(root, 'source', '_posts');
const imageRoot = path.join(root, 'source', 'images', 'algorithms');

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function wrapText(value, max = 20) {
  const chars = [...String(value)];
  const lines = [];
  while (chars.length) lines.push(chars.splice(0, max).join(''));
  return lines.slice(0, 3);
}

function textBlock(value, x, y, className, max = 20, lineHeight = 24) {
  return wrapText(value, max).map((line, index) =>
    `<text x="${x}" y="${y + index * lineHeight}" class="${className}">${escapeXml(line)}</text>`
  ).join('\n');
}

const baseStyle = `
  .bg{fill:#f7fafc}.card{fill:#fff;stroke:#a9bbc6;stroke-width:2}.accent{fill:#286f88}
  .soft{fill:#e8f4f7}.line{stroke:#527987;stroke-width:3;fill:none;marker-end:url(#arrow)}
  .title{font:700 26px system-ui,sans-serif;fill:#18313b}.head{font:700 18px system-ui,sans-serif;fill:#18313b}
  .body{font:15px system-ui,sans-serif;fill:#38505a}.small{font:14px system-ui,sans-serif;fill:#526873}
  .node{fill:#fff;stroke:#286f88;stroke-width:2}.edge{stroke:#6a8792;stroke-width:2}.good{fill:#dff4e7;stroke:#4b9870;stroke-width:2}
  .warn{fill:#fff0e1;stroke:#bd7740;stroke-width:2}
`;

function svgShell(title, inner, height = 560) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="${height}" viewBox="0 0 960 ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(title)}的教学图解</desc>
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#527987"/></marker></defs>
  <style>${baseStyle}</style>
  <rect class="bg" width="960" height="${height}" rx="20"/>
  <text x="48" y="52" class="title">${escapeXml(title)}</text>
  ${inner}
</svg>\n`;
}

function processSvg(article) {
  const positions = [[48, 92], [504, 92], [48, 302], [504, 302]];
  const cards = article.steps.map((step, index) => {
    const [x, y] = positions[index];
    const n = index + 1;
    return `<g>
      <rect x="${x}" y="${y}" width="408" height="166" rx="16" class="card"/>
      <circle cx="${x + 36}" cy="${y + 36}" r="20" class="accent"/>
      <text x="${x + 36}" y="${y + 42}" text-anchor="middle" style="font:700 15px system-ui;fill:#fff">${n}</text>
      ${textBlock(step[0], x + 70, y + 34, 'head', 17, 22)}
      ${textBlock(step[1], x + 24, y + 92, 'body', 25, 23)}
    </g>`;
  }).join('\n');
  const arrows = `<path d="M456 175 H493" class="line"/><path d="M708 260 V291" class="line"/><path d="M504 385 H467" class="line"/>`;
  return svgShell(`${article.short}：执行过程`, `${cards}\n${arrows}`, 520);
}

function prefixSumSvg(article) {
  const nums = [2, -1, 3, 5];
  const prefix = [0, 2, 1, 4, 9];
  const cell = (value, index, x, y, highlighted = false) => `
    <rect x="${x}" y="${y}" width="112" height="64" rx="10" class="${highlighted ? 'good' : 'card'}"/>
    <text x="${x + 56}" y="${y + 39}" text-anchor="middle" class="head">${value}</text>
    <text x="${x + 56}" y="${y - 10}" text-anchor="middle" class="small">${index}</text>`;
  const numsRow = nums.map((value, index) => cell(value, index, 210 + index * 120, 128, index >= 1 && index <= 3)).join('');
  const prefixRow = prefix.map((value, index) => cell(value, index, 150 + index * 120, 286, index === 1 || index === 4)).join('');
  return svgShell(`${article.short}：区间和只做一次减法`, `
    <text x="72" y="164" class="head">nums</text>${numsRow}
    <text x="72" y="322" class="head">prefix</text>${prefixRow}
    <path d="M326 208 V260" class="line"/><path d="M686 208 V260" class="line"/>
    <rect x="190" y="410" width="580" height="62" rx="14" class="soft"/>
    <text x="480" y="448" text-anchor="middle" class="head">sum(1..3) = prefix[4] - prefix[1] = 9 - 2 = 7</text>
  `, 520);
}

function differenceArraySvg(article) {
  const values = [0, 2, 3, 0, -2, -3];
  const result = [0, 2, 5, 5, 3];
  const boxes = (items, startX, y, classFor) => items.map((value, index) => `
    <rect x="${startX + index * 112}" y="${y}" width="104" height="60" rx="10" class="${classFor(index)}"/>
    <text x="${startX + index * 112 + 52}" y="${y + 37}" text-anchor="middle" class="head">${value}</text>
    <text x="${startX + index * 112 + 52}" y="${y - 9}" text-anchor="middle" class="small">${index}</text>`).join('');
  return svgShell(`${article.short}：差分只标记变化边界`, `
    <rect x="80" y="82" width="800" height="74" rx="14" class="soft"/>
    <text x="112" y="112" class="body">区间 [1,3] 加 2：diff[1] += 2，diff[4] -= 2</text>
    <text x="112" y="140" class="body">区间 [2,4] 加 3：diff[2] += 3，diff[5] -= 3</text>
    <text x="72" y="248" class="head">diff</text>${boxes(values, 176, 212, index => index === 1 || index === 2 ? 'good' : index >= 4 ? 'warn' : 'card')}
    <path d="M480 292 V340" class="line"/>
    <text x="72" y="422" class="head">累加</text>${boxes(result, 232, 386, () => 'card')}
    <text x="480" y="496" text-anchor="middle" class="body">从左到右求前缀和，得到最终数组 [0, 2, 5, 5, 3]</text>
  `, 540);
}

function treeSvg(article) {
  const labels = article.treeLabels || ['1', '2', '3', '4', '5'];
  const nodes = [[480,130],[300,240],[660,240],[210,360],[390,360]];
  const edges = [[480,150,300,220],[480,150,660,220],[300,260,210,340],[300,260,390,340]]
    .map(([x1,y1,x2,y2])=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="edge"/>`).join('');
  const circles = nodes.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="28" class="${i === 1 ? 'good' : 'node'}"/><text x="${x}" y="${y+6}" text-anchor="middle" class="head">${escapeXml(labels[i] ?? '')}</text>`).join('');
  const notes = article.steps.slice(0,3).map((step,i)=>`<rect x="${60+i*300}" y="420" width="260" height="88" rx="12" class="card"/>${textBlock(step[0],80+i*300,449,'head',13)}${textBlock(step[1],80+i*300,478,'small',15,20)}`).join('');
  return svgShell(`${article.short}：树上的信息流`, `${edges}${circles}${notes}`, 540);
}

function backtrackSvg(article) {
  const labels = article.treeLabels || ['[]','[1]','[2]','[3]','[1,2]','[1,3]','[2,3]'];
  const nodes = [[480,120],[220,230],[480,230],[740,230],[130,360],[310,360],[650,360]];
  const edges = [[480,145,220,205],[480,145,480,205],[480,145,740,205],[220,255,130,335],[220,255,310,335],[480,255,650,335]]
    .map(([x1,y1,x2,y2])=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="edge"/>`).join('');
  const circles = nodes.map(([x,y],i)=>`<rect x="${x-54}" y="${y-24}" width="108" height="48" rx="12" class="${i>3?'good':'node'}"/><text x="${x}" y="${y+6}" text-anchor="middle" class="head">${escapeXml(labels[i] ?? '')}</text>`).join('');
  const footer = `<rect x="120" y="425" width="720" height="68" rx="14" class="soft"/>${textBlock(article.core,150,456,'body',48,22)}`;
  return svgShell(`${article.short}：搜索树`, `${edges}${circles}${footer}`, 530);
}

function dpSvg(article) {
  const labels = article.dpRow?.labels || ['0','1','2','3','4','5'];
  const values = article.dpRow?.values || ['0','1','1','2','3','5'];
  const cells = labels.map((label,i)=>{
    const x = 142 + i * 112;
    return `<rect x="${x}" y="170" width="112" height="70" class="card"/><text x="${x+56}" y="213" text-anchor="middle" class="head">${escapeXml(label)}</text>
    <rect x="${x}" y="240" width="112" height="82" class="${i===labels.length-1?'good':'card'}"/><text x="${x+56}" y="290" text-anchor="middle" class="head">${escapeXml(values[i] ?? '')}</text>`;
  }).join('');
  const rowNames = `<rect x="48" y="170" width="94" height="70" class="soft"/><text x="95" y="213" text-anchor="middle" class="head">状态</text><rect x="48" y="240" width="94" height="82" class="soft"/><text x="95" y="290" text-anchor="middle" class="head">值</text>`;
  const notes = article.steps.slice(0,3).map((step,i)=>`<rect x="${70+i*290}" y="375" width="250" height="104" rx="12" class="card"/>${textBlock(step[0],90+i*290,406,'head',13)}${textBlock(step[1],90+i*290,440,'small',15,20)}`).join('');
  return svgShell(`${article.short}：状态表`, `${rowNames}${cells}${notes}`, 520);
}

function structureSvg(article) {
  if (article.kind === 'prefix') return prefixSumSvg(article);
  if (article.kind === 'tree') return treeSvg(article);
  if (article.kind === 'backtrack') return backtrackSvg(article);
  if (article.kind === 'dp') return dpSvg(article);
  return processSvg(article);
}

function proofSvg(article) {
  if (article.kind === 'prefix') return differenceArraySvg(article);
  const ys = [108, 214, 320, 426];
  const blocks = article.proofSteps.map((step,i)=>{
    const cls = i === 3 ? 'good' : i === 2 ? 'warn' : 'card';
    return `<rect x="150" y="${ys[i]}" width="660" height="74" rx="14" class="${cls}"/>
      <text x="180" y="${ys[i]+30}" class="head">${escapeXml(step[0])}</text>
      ${textBlock(step[1],350,ys[i]+30,'body',30,21)}`;
  }).join('\n');
  const arrows = ys.slice(0,3).map((y)=>`<path d="M480 ${y+76} V${y+103}" class="line"/>`).join('');
  return svgShell(`${article.short}：为什么成立`, `${blocks}${arrows}`, 540);
}

function nav(prev, next) {
  const nextItem = next
    ? `<a class="series-nav__next" href="/${next.permalink}">${String(next.n).padStart(2,'0')} ${next.short} →</a>`
    : '<span class="series-nav__next series-nav__pending">28 扩展篇完成 ✓</span>';
  return `<nav class="series-nav" aria-label="算法系列导航">
  <a class="series-nav__prev" href="/${prev.permalink}">← ${String(prev.n).padStart(2,'0')} ${prev.short}</a>
  <a class="series-nav__map" href="/2026/09/04/python-algorithm-learning-map/">算法学习地图</a>
  ${nextItem}
</nav>`;
}

function exerciseMarkdown(exercises) {
  const groups = ['入门','标准','进阶'];
  return groups.map(group => {
    const items = exercises.filter(x => x.level === group);
    if (!items.length) return '';
    return `### ${group}\n\n${items.map(x=>`- [${x.id}. ${x.name}](https://leetcode.cn/problems/${x.slug}/)（${x.difficulty}）  \n  ${x.hint}`).join('\n')}`;
  }).filter(Boolean).join('\n\n');
}

function articleMarkdown(article, index, all) {
  const prev = all[index - 1];
  const next = all[index + 1];
  const dateMinutes = 30 + (article.n - 1) * 10 + (article.n >= 28 ? 10 : 0);
  const hour = 9 + Math.floor(dateMinutes / 60);
  const minute = dateMinutes % 60;
  const topNav = nav(prev, next);
  const rows = article.example.rows.map(row=>`| ${row.join(' | ')} |`).join('\n');
  const pitfallText = article.pitfalls.map((item,i)=>`### 坑 ${i+1}：${item.title}\n\n${item.wrong ? `\`\`\`python\n${item.wrong}\n\`\`\`\n\n` : ''}${item.fix}`).join('\n\n');
  return `---
title: 算法基础 ${String(article.n).padStart(2,'0')}｜${article.title}
date: 2026-09-04 ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00
permalink: ${article.permalink}
categories:
  - 算法
tags:
  - Python
  - ${article.tag}
${(article.extraTags || []).map(tag => `  - ${tag}`).join('\n')}${article.extraTags?.length ? '\n' : ''}  - LeetCode
  - 算法基础
description: ${article.description}
---

${topNav}

${article.lead}

这节仍然从最容易想到的方法出发，再把“为什么可以少算”推导清楚。模板只放在证明之后。

<!-- more -->

## 1. 这节解决什么问题？

- **输入**：${article.problem.input}
- **输出**：${article.problem.output}
- **直接想法**：${article.problem.brute}
- **真正瓶颈**：${article.problem.bottleneck}

## 2. 从暴力解法开始

\`\`\`python
${article.bruteCode}
\`\`\`

${article.bruteAnalysis}

暴力法并不是“错误答案”：它给出了完整搜索空间。优化的任务，是找到一个可靠规则，让我们不用逐个检查其中的所有状态。

## 3. 核心思想

<div class="pattern-card"><strong>${article.core}</strong></div>

${article.coreDetail}

<figure class="algorithm-figure">
  <img src="/images/algorithms/${String(article.n).padStart(2,'0')}-${article.slug}/process.svg" alt="${article.short}执行过程图" loading="lazy">
  <figcaption>${article.figureCaption}</figcaption>
</figure>

## 4. 为什么这个算法成立？

${article.proof.map((p,i)=>`### ${i+1}. ${p[0]}\n\n${p[1]}`).join('\n\n')}

<figure class="algorithm-figure">
  <img src="/images/algorithms/${String(article.n).padStart(2,'0')}-${article.slug}/proof.svg" alt="${article.short}正确性推导图" loading="lazy">
  <figcaption>${article.proofCaption || '每次转移、剪枝或淘汰都必须维护同一个不变量，而不是凭感觉移动。'}</figcaption>
</figure>

## 5. Python 模板

\`\`\`python
${article.template}
\`\`\`

${article.templateNotes}

## 6. 手工模拟一次

输入：\`${article.example.input}\`

| ${article.example.headers.join(' | ')} |
|${article.example.headers.map(()=> '---').join('|')}|
${rows}

${article.example.conclusion}

## 7. 复杂度分析

- **时间复杂度：${article.time}**。${article.timeWhy}
- **空间复杂度：${article.space}**。${article.spaceWhy}

## 8. 什么时候想到这个算法？

<div class="pattern-card"><strong>${article.signalFormula}</strong></div>

${article.signals.map(x=>`- ${x}`).join('\n')}

识别信号只是入口，最后仍要检查算法依赖的单调性、状态含义或数据结构不变量是否真的存在。

## 9. 常见坑

${pitfallText}

## 10. Python 补充

### ${article.python.title}

${article.python.body}

${article.python.code ? `\`\`\`python\n${article.python.code}\n\`\`\`` : ''}

## 11. 典型练习题

先根据提示独立画状态，再看代码。不要把练习变成复制模板。

${exerciseMarkdown(article.exercises)}

<details>
<summary>检查答案：本节核心实现</summary>

\`\`\`python
${article.template}
\`\`\`

请先确认：你能不用代码解释“为什么这一步不会漏掉正确答案”吗？
</details>

## 12. 本节你应该掌握

${article.checklist.map(x=>`- [ ] ${x}`).join('\n')}

## 下一节

${article.nextIntro}

${topNav}

${article.referenceNote || `课程顺序参考：[灵茶山艾府《基础算法精讲 ${String(article.n).padStart(2,'0')}》](${article.video})；题目范围参考[课程作者维护的汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)。`}本文讲解、代码组织与图解均为独立编写。
`;
}

function mapMarkdown(all) {
  const stageTables = stages.map(stage => {
    const rows = all.filter(x=>stage.courses.includes(x.n)).map(x=>`| ${String(x.n).padStart(2,'0')} | ${x.mapTitle || x.short} | ${x.difficulty} | <span class="course-status course-status--ready">已完成</span> | ${x.prerequisite} | [开始学习](/${x.permalink}) |`).join('\n');
    return `## ${stage.name}\n\n| # | 算法 | 难度 | 状态 | 前置知识 | 文章 |\n|---:|---|---|---|---|---|\n${rows}`;
  }).join('\n\n');
  return `---
title: Python 基础算法学习地图｜27 节主线 + 扩展篇
date: 2026-09-04 14:00:00
permalink: 2026/09/04/python-algorithm-learning-map/
categories:
  - 算法
tags:
  - Python
  - 算法基础
  - LeetCode
description: 面向 Python 初学者的算法图解教程路线：27 节经典主线加持续扩展，从双指针、链表和二叉树，到动态规划、单调结构与前缀和差分。
---

这是一条给 **Python 刚入门、算法基础较弱、准备 LeetCode 或面试** 的学习路线。顺序参考灵茶山艾府《基础算法精讲》，但每篇教程都从问题、暴力解法和正确性推导重新组织，重点回答“为什么能这样做”。

<!-- more -->

<figure class="algorithm-figure">
  <img src="/images/algorithms/learning-map.svg" alt="Python 基础算法学习地图：27 节主线与前缀和、差分等扩展篇" loading="eager">
  <figcaption>27 节经典主线已经完成，并从第 28 课起补充高频基础工具；可以按依赖顺序学习，也可以从当前薄弱模块开始。</figcaption>
</figure>

## 怎么使用这套教程？

1. 先看“这节解决什么问题”，自己写出暴力解法。
2. 对照图解，手动画一遍指针、队列、搜索树或 DP 表的变化。
3. 合上文章，独立写模板；不要背完整题解。
4. 完成 2 道代表题，并记录识别信号和最容易错的边界。
5. 第二天不看答案再写一次，能写出来才算掌握。

<div class="algorithm-note"><strong>完成状态：</strong>${all.length} 篇正文、${all.length * 2} 张课程图解、代码样例与上一篇/下一篇导航均已接入博客。</div>

${stageTables}

## 你会逐渐建立的能力

- 用“排除哪一批候选”理解双指针和二分查找。
- 用“窗口加入、移出什么”理解连续区间问题。
- 把链表修改画成引用变化，把树题拆成子树返回值。
- 把回溯画成搜索树，把动态规划落实到状态定义、转移、初始化和顺序。
- 用“谁已经不可能成为答案”理解单调栈与单调队列。
- 用“累计后相减”与“边界变化”理解前缀和与差分。

## 主要学习参考

- [灵茶山艾府《基础算法精讲》B 站合集](https://space.bilibili.com/206214/lists/842776?type=season)
- [课程作者维护的配套题目与多语言代码汇总](https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/README.md)
- [LeetCode 中国站题库](https://leetcode.cn/problemset/)

本系列按公开课程主线组织学习顺序；正文、代码说明和 SVG 图解均重新编写与绘制，不复制视频字幕、截图或其他文章正文。
`;
}

const all = [firstCourse, ...articles].sort((a, b) => a.n - b.n);
for (let index = 1; index < all.length; index += 1) {
  const article = all[index];
  const dir = path.join(imageRoot, `${String(article.n).padStart(2,'0')}-${article.slug}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'process.svg'), structureSvg(article));
  fs.writeFileSync(path.join(dir, 'proof.svg'), proofSvg(article));
  fs.writeFileSync(path.join(postRoot, `${article.file}.md`), articleMarkdown(article, index, all));
}

fs.writeFileSync(path.join(postRoot, 'python-algorithm-learning-map.md'), mapMarkdown(all));

const firstPath = path.join(postRoot, 'algorithm-01-two-pointers.md');
let first = fs.readFileSync(firstPath, 'utf8');
first = first.replaceAll('<span class="series-nav__next series-nav__pending">下一篇：容器与接雨水 →</span>', '<a class="series-nav__next" href="/2026/09/04/algorithm-02-two-pointers-container-rainwater/">02 容器与接雨水 →</a>');
fs.writeFileSync(firstPath, first);

const testImplementations = all.slice(1).map(article =>
  `\n# Article ${String(article.n).padStart(2, '0')}: ${article.short}\n${article.template}\n`
).join('\n');
const testCases = String.raw`

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
`;
fs.writeFileSync(path.join(root, 'tests', 'test_algorithm_series_all.py'), testImplementations + testCases);

console.log(`generated ${articles.length} articles plus the hand-written first lesson, ${articles.length * 2 + 2} lesson SVG diagrams, and the full test suite`);
