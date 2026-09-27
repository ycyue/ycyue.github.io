"""Execute current Markdown templates, not copied implementations.
SQL checks use SQLite for the portable subset, not a MySQL integration test.
"""
from pathlib import Path
import itertools
import re
import sqlite3

POSTS = Path(__file__).resolve().parents[1] / 'source' / '_posts'

def blocks(text, language='python'):
    return re.findall(r'```' + language + r'\n(.*?)```', text, re.S)

class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

implementations = {}
for path in sorted(POSTS.glob('algorithm-*.md')):
    text = path.read_text()
    number = int(path.name.split('-')[1])
    core = re.search(r'## 5\..*?(?=\n## 6\.)', text, re.S).group()
    if number == 1:
        core += re.search(r'## 7\..*?(?=\n## 8\.)', text, re.S).group()
    ns = {'ListNode': ListNode, 'TreeNode': TreeNode}
    for code in blocks(core):
        exec(compile(code, str(path), 'exec'), ns)
    selftest = text.split('## 边界自测与迁移')[1].split('## 下一节')[0]
    assert blocks(selftest), path.name
    for code in blocks(selftest):
        exec(compile(code, str(path) + ':selftest', 'exec'), ns)
    implementations[number] = ns
assert len(implementations) == 28
print('PASS: actual templates and boundary assertions from all 28 algorithm articles')

# Independent exhaustive oracles: compare results, not implementation details.
checks = 0
for n in range(7):
    for values in itertools.product(range(3), repeat=n):
        a = list(values)
        area = max((min(a[i], a[j]) * (j-i) for i in range(n) for j in range(i+1,n)), default=0)
        water = sum(max(0, min(max(a[:i+1]), max(a[i:])) - a[i]) for i in range(n))
        assert implementations[2]['max_area'](a) == area
        assert implementations[2]['trap'](a) == water
        for k in range(1,n+1):
            assert implementations[27]['max_sliding_window'](a,k) == [max(a[i:i+k]) for i in range(n-k+1)]
        expected = [next((j-i for j in range(i+1,n) if a[j]>a[i]),0) for i in range(n)]
        assert implementations[26]['daily_temperatures'](a) == expected
        if n and all(a[i]!=a[i+1] for i in range(n-1)):
            peak = implementations[5]['find_peak'](a)
            assert (peak==0 or a[peak]>a[peak-1]) and (peak==n-1 or a[peak]>a[peak+1])
        sorted_a = sorted(a)
        for target in range(-1,4):
            expected = next((i for i,x in enumerate(sorted_a) if x>=target),n)
            assert implementations[4]['lower_bound'](sorted_a,target)==expected
        checks += 1
for n in range(6):
    for a in itertools.product(range(1,4),repeat=n):
        for target in range(1,10):
            expected = min((j-i for i in range(n) for j in range(i+1,n+1) if sum(a[i:j])>=target), default=0)
            assert implementations[3]['min_subarray_len'](target,list(a))==expected
            checks += 1
print(f'PASS: {checks} exhaustive input cases with independent oracles')

text = (POSTS/'python-basic-syntax.md').read_text().split('## 把零散语法连成一个程序')[1]
exec(blocks(text)[0], {})
print('PASS: Python tutorial complete exercise and invalid-input checks')

text = (POSTS/'sql-basic-usage.md').read_text()
sql = blocks(text,'sql')
conn=sqlite3.connect(':memory:')
conn.execute('PRAGMA foreign_keys=ON')
conn.executescript(sql[0]); conn.executescript(sql[1])
assert conn.execute('SELECT COUNT(*) FROM users').fetchone()==(3,)
assert conn.execute("SELECT SUM(amount) FROM orders WHERE status='paid'").fetchone()==(300,)
join=next(q for q in sql if 'COUNT(o.id)' in q)
assert [row[2] for row in conn.execute(join)]==[2,1,0]
for q in sql[2:]:
    if q.lstrip().startswith('SELECT') and 'EXPLAIN' not in q:
        conn.executescript(q)
transaction=next(q for q in sql if q.startswith('BEGIN;'))
before=conn.execute('SELECT city FROM users WHERE id=1').fetchone()
conn.executescript(transaction)
assert conn.execute('SELECT city FROM users WHERE id=1').fetchone()==before
conn.close()
print('PASS: SQL seed data, portable SELECT statements and rollback (SQLite; MySQL not run)')
