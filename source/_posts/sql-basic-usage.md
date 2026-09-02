---
title: SQL 基础用法：从查询到增删改的入门指南
date: 2026-09-02 18:50:00
categories:
  - 数据库
tags:
  - SQL
  - MySQL
  - 数据库
  - 软件测试
description: 通过一套示例数据学习 SQL 查询、筛选、排序、聚合、连接、增删改、事务和索引等基础用法。
---

SQL 是操作关系型数据库的通用语言。MySQL、PostgreSQL、SQLite 和 SQL Server 的细节略有差异，但核心查询思路基本一致。对于开发和软件测试岗位，重点是能够读取数据、构造测试数据、验证业务结果，并安全地执行修改操作。

<!-- more -->

## 1. 表、行、列与主键

关系型数据库以表保存数据：

- 表：一类数据的集合，例如用户表。
- 行：一条完整记录，例如一个用户。
- 列：记录的某个属性，例如用户名。
- 主键：唯一标识一行数据的字段。
- 外键：建立两张表之间的关联。

本文使用两张示例表：

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INTEGER,
    city VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

不同数据库的自增主键写法不同。例如 MySQL 常用 `AUTO_INCREMENT`，PostgreSQL 可使用 identity 列。

## 2. 查询数据：SELECT

查询全部列：

```sql
SELECT * FROM users;
```

生产项目中更推荐明确写出需要的列：

```sql
SELECT id, name, email
FROM users;
```

使用别名提高结果可读性：

```sql
SELECT name AS user_name, created_at AS register_time
FROM users;
```

## 3. 筛选数据：WHERE

```sql
SELECT id, name, age
FROM users
WHERE age >= 18;
```

多个条件：

```sql
SELECT *
FROM users
WHERE age >= 18
  AND city = '西安';
```

常用筛选方式：

```sql
-- 多个候选值
SELECT * FROM users WHERE city IN ('西安', '北京');

-- 范围，包含两端
SELECT * FROM users WHERE age BETWEEN 18 AND 30;

-- 模糊匹配：% 表示任意长度字符
SELECT * FROM users WHERE name LIKE '张%';

-- 判断空值
SELECT * FROM users WHERE email IS NULL;
```

`NULL` 表示未知或缺失，不能写成 `email = NULL`，应使用 `IS NULL` 或 `IS NOT NULL`。

## 4. 排序与限制结果数量

```sql
SELECT id, name, age
FROM users
ORDER BY age DESC, id ASC
LIMIT 10;
```

- `ASC`：升序，默认值。
- `DESC`：降序。
- `LIMIT 10`：最多返回 10 行。

分页查询常见写法：

```sql
SELECT *
FROM users
ORDER BY id
LIMIT 10 OFFSET 20;
```

这表示跳过前 20 行，再返回 10 行。数据量很大时，应考虑基于主键的分页方式。

## 5. 去重：DISTINCT

```sql
SELECT DISTINCT city
FROM users;
```

`DISTINCT` 对所选列的组合进行去重。

## 6. 聚合函数

```sql
SELECT
    COUNT(*) AS user_count,
    AVG(age) AS average_age,
    MIN(age) AS minimum_age,
    MAX(age) AS maximum_age
FROM users;
```

统计订单总额：

```sql
SELECT SUM(amount) AS total_amount
FROM orders
WHERE status = 'paid';
```

`COUNT(*)` 统计行数，`COUNT(email)` 只统计 `email` 不为 `NULL` 的行。

## 7. 分组：GROUP BY 与 HAVING

按城市统计用户数量：

```sql
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city
ORDER BY user_count DESC;
```

只保留用户数不少于 2 的城市：

```sql
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING COUNT(*) >= 2;
```

`WHERE` 在分组前筛选行，`HAVING` 在分组后筛选聚合结果。

## 8. 多表连接：JOIN

查询订单及其用户信息：

```sql
SELECT
    o.id AS order_id,
    u.name AS user_name,
    o.amount,
    o.status
FROM orders AS o
INNER JOIN users AS u
    ON o.user_id = u.id;
```

常见连接：

- `INNER JOIN`：只保留两边能匹配的记录。
- `LEFT JOIN`：保留左表全部记录，右表无法匹配时显示 `NULL`。

查询从未下单的用户：

```sql
SELECT u.id, u.name
FROM users AS u
LEFT JOIN orders AS o
    ON u.id = o.user_id
WHERE o.id IS NULL;
```

## 9. 子查询

查询订单总额高于平均值的订单：

```sql
SELECT id, user_id, amount
FROM orders
WHERE amount > (
    SELECT AVG(amount)
    FROM orders
);
```

子查询有助于表达分步骤逻辑，但复杂场景也可以考虑连接或公共表表达式。

## 10. 新增数据：INSERT

```sql
INSERT INTO users (id, name, email, age, city)
VALUES (1, '小明', 'xiaoming@example.com', 22, '西安');
```

一次插入多行：

```sql
INSERT INTO users (id, name, email, age, city)
VALUES
    (2, '小红', 'xiaohong@example.com', 24, '北京'),
    (3, '小李', 'xiaoli@example.com', 20, '西安');
```

应明确列名，避免表结构变化导致数据错位。

## 11. 修改数据：UPDATE

```sql
UPDATE users
SET city = '上海', age = 23
WHERE id = 1;
```

执行修改前，先用相同条件查询：

```sql
SELECT * FROM users WHERE id = 1;
```

如果忘记 `WHERE`，所有行都可能被更新。

## 12. 删除数据：DELETE

```sql
DELETE FROM users
WHERE id = 3;
```

同样应先执行对应的 `SELECT`，确认目标行准确无误。

`DELETE` 删除数据行；`DROP TABLE users` 会删除整张表及其结构，风险完全不同。

## 13. 事务

事务让一组操作要么全部成功，要么全部失败。以转账为例：

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
```

如果中途发现问题，可以执行：

```sql
ROLLBACK;
```

不同数据库的事务语法和自动提交设置可能不同，在修改生产数据前必须确认当前环境。

## 14. 约束

约束用于保证数据质量：

- `PRIMARY KEY`：主键，唯一且非空。
- `NOT NULL`：不允许空值。
- `UNIQUE`：不允许重复。
- `DEFAULT`：设置默认值。
- `CHECK`：限制数据范围。
- `FOREIGN KEY`：维护表之间的引用关系。

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) CHECK (price >= 0),
    status VARCHAR(20) DEFAULT 'active'
);
```

## 15. 索引基础

索引可以加速查询，但会占用空间，并增加写入成本。

```sql
CREATE INDEX idx_users_email
ON users(email);
```

通常适合为经常出现在 `WHERE`、`JOIN` 和 `ORDER BY` 中的列设计索引。不要看到查询慢就随意添加大量索引，应先查看执行计划。

```sql
EXPLAIN
SELECT * FROM users WHERE email = 'xiaoming@example.com';
```

## 16. SQL 执行顺序

理解逻辑执行顺序有助于读懂复杂查询：

1. `FROM` / `JOIN`
2. `WHERE`
3. `GROUP BY`
4. `HAVING`
5. `SELECT`
6. `DISTINCT`
7. `ORDER BY`
8. `LIMIT`

这也解释了为什么聚合后的条件通常写在 `HAVING` 中。

## 17. 安全与常见错误

### 防止 SQL 注入

应用程序中不要直接拼接用户输入：

```python
# 不安全示例
sql = f"SELECT * FROM users WHERE name = '{name}'"
```

应使用数据库驱动提供的参数化查询。占位符写法因驱动而异：

```python
cursor.execute(
    "SELECT * FROM users WHERE name = %s",
    (name,),
)
```

### 其他常见问题

- 字符串通常使用单引号。
- `NULL` 需要用 `IS NULL` 判断。
- 多表查询应明确列属于哪张表。
- 修改或删除前先执行对应的查询。
- 测试环境与生产环境要明确区分。
- 业务代码中的数据库账户应遵循最小权限原则。

## 18. 软件测试中的 SQL 场景

### 验证注册结果

```sql
SELECT id, name, email, created_at
FROM users
WHERE email = 'xiaoming@example.com';
```

### 验证订单状态和金额

```sql
SELECT id, user_id, amount, status
FROM orders
WHERE id = 10001;
```

### 查找重复数据

```sql
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

### 检查孤立订单

```sql
SELECT o.*
FROM orders AS o
LEFT JOIN users AS u
    ON o.user_id = u.id
WHERE u.id IS NULL;
```

## 19. 入门练习

1. 查询年龄在 18 到 25 岁之间的西安用户。
2. 统计每种订单状态的数量和总金额。
3. 查询订单总金额最高的三个用户。
4. 查询最近 7 天注册但没有下单的用户。
5. 在事务中创建订单并扣减库存，任一步失败时回滚。

## 总结

SQL 学习的主线是 `SELECT → WHERE → ORDER BY → GROUP BY → JOIN → 增删改 → 事务与索引`。初学阶段应多写查询，并养成修改前先查询、明确环境、控制权限的习惯。掌握这些内容后，就可以继续学习数据库设计、执行计划、性能优化和在 Python 中访问数据库。
