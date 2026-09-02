---
title: Python 基础语法：零基础入门与实用速查
date: 2026-09-02 18:30:00
categories:
  - 编程基础
tags:
  - Python
  - 基础语法
  - 入门
description: 从变量、数据类型、条件判断、循环、函数到异常处理，用一篇文章掌握 Python 最常用的基础语法。
---

Python 的语法简洁、可读性强，适合作为第一门编程语言。学习基础语法时，不必一次记住所有细节。先掌握变量、判断、循环、函数和常用容器，就可以开始写小程序，并在项目中继续补充知识。

<!-- more -->

## 1. 第一个 Python 程序

```python
print("Hello, Python!")
```

`print()` 用来把内容输出到终端。Python 使用缩进表示代码层级，通常使用 4 个空格，不能随意缩进。

```python
if 10 > 5:
    print("10 大于 5")
```

## 2. 变量与基本数据类型

变量可以理解为给数据起一个名字。Python 不需要提前声明变量类型。

```python
name = "安生"       # str：字符串
age = 22            # int：整数
height = 1.75       # float：浮点数
is_learning = True  # bool：布尔值
```

使用 `type()` 可以查看数据类型：

```python
print(type(name))  # <class 'str'>
print(type(age))   # <class 'int'>
```

常见类型转换：

```python
age_text = "22"
age = int(age_text)
price = float("19.9")
message = str(100)
```

## 3. 输入、输出与字符串

`input()` 接收的内容默认都是字符串。

```python
name = input("请输入姓名：")
age = int(input("请输入年龄："))
print(f"你好，{name}，明年你就 {age + 1} 岁了。")
```

推荐使用 f-string 拼接字符串。常用字符串操作如下：

```python
text = "  Hello Python  "

print(text.strip())          # 去除两端空白
print(text.lower())          # 转为小写
print(text.upper())          # 转为大写
print("Python" in text)     # 判断是否包含
print(text.replace("Python", "World"))
```

## 4. 运算符

```python
a = 10
b = 3

print(a + b)   # 加法：13
print(a - b)   # 减法：7
print(a * b)   # 乘法：30
print(a / b)   # 普通除法
print(a // b)  # 整除：3
print(a % b)   # 取余：1
print(a ** b)  # 幂：1000
```

比较运算符包括 `==`、`!=`、`>`、`<`、`>=` 和 `<=`。逻辑运算符包括 `and`、`or` 和 `not`。

注意：`=` 是赋值，`==` 才是判断两边是否相等。

## 5. 条件判断

```python
score = 82

if score >= 90:
    grade = "优秀"
elif score >= 60:
    grade = "及格"
else:
    grade = "不及格"

print(grade)
```

Python 从上到下判断条件，遇到第一个成立的分支后就不会再执行后面的分支。

## 6. 列表、元组、字典与集合

### 列表 list

列表有顺序、可以修改，适合保存一组同类数据。

```python
skills = ["Python", "Linux", "SQL"]
skills.append("Git")
skills[0] = "Python 基础"

print(skills[0])
print(skills[-1])
print(len(skills))
```

### 元组 tuple

元组有顺序，但创建后通常不修改。

```python
point = (10, 20)
x, y = point
```

### 字典 dict

字典使用“键—值”保存信息。

```python
student = {
    "name": "安生",
    "score": 90,
    "passed": True,
}

print(student["name"])
print(student.get("score"))
student["city"] = "西安"
```

### 集合 set

集合中的元素不重复，适合去重和成员判断。

```python
numbers = {1, 2, 2, 3}
print(numbers)  # {1, 2, 3}
```

## 7. 循环

### for 循环

```python
skills = ["Python", "Linux", "SQL"]

for skill in skills:
    print(skill)
```

`range()` 常用于按次数循环：

```python
for i in range(1, 6):
    print(i)  # 输出 1 到 5
```

### while 循环

```python
count = 3

while count > 0:
    print(count)
    count -= 1
```

`break` 立即结束循环，`continue` 跳过本轮剩余代码。

## 8. 函数

函数把一段可重复使用的逻辑封装起来。

```python
def sum_positive(nums):
    total = 0
    for num in nums:
        if num > 0:
            total += num
    return total


result = sum_positive([3, -1, 0, 4, 3])
print(result)  # 10
```

参数是函数接收的数据，`return` 是函数返回的结果。没有显式 `return` 时，函数默认返回 `None`。

可以为参数设置默认值：

```python
def greet(name, message="你好"):
    return f"{message}，{name}"
```

## 9. 列表推导式

列表推导式可以简洁地生成新列表：

```python
numbers = [1, 2, 3, 4, 5]
squares = [num ** 2 for num in numbers]
even_numbers = [num for num in numbers if num % 2 == 0]
```

初学阶段如果觉得难读，先写普通 `for` 循环，不必强行使用。

## 10. 异常处理

程序遇到非法输入时可能报错。可以使用 `try` 和 `except` 处理可预见的异常。

```python
try:
    age = int(input("请输入年龄："))
    print(100 / age)
except ValueError:
    print("年龄必须是整数")
except ZeroDivisionError:
    print("年龄不能为 0")
```

不要用一个空泛的 `except:` 隐藏所有错误，应尽量捕获具体异常。

## 11. 文件读写

使用 `with` 打开文件，代码结束后文件会自动关闭。

```python
with open("note.txt", "w", encoding="utf-8") as file:
    file.write("今天学习了 Python 基础语法。")

with open("note.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)
```

常见模式：`r` 读取、`w` 覆盖写入、`a` 追加写入。

## 12. 模块与程序入口

```python
import math

print(math.sqrt(16))
```

常见的程序入口写法：

```python
def main():
    print("程序开始运行")


if __name__ == "__main__":
    main()
```

直接运行当前文件时，`main()` 会执行；当前文件被其他文件导入时，它不会自动执行。

## 13. 常见错误

- `IndentationError`：缩进不一致。
- `NameError`：变量名不存在或拼写错误。
- `TypeError`：对不兼容的数据类型执行操作。
- `IndexError`：列表索引超出范围。
- `KeyError`：访问了字典中不存在的键。
- `ValueError`：数据类型可以转换，但具体值不合法。

看报错时，先读最后一行的错误类型和说明，再根据文件名与行号定位代码。

## 14. 入门练习

1. 输入三个数字，输出最大值和平均值。
2. 写函数统计列表中正数、负数和零的数量。
3. 用字典保存三名学生的成绩，输出平均分最高的学生。
4. 读取一个文本文件，统计其中每个单词出现的次数。
5. 写一个命令行待办清单，支持添加、查看和完成任务。

## 总结

Python 基础阶段最重要的不是背语法，而是能把问题拆成数据、判断、循环和函数。掌握本文内容后，就可以继续学习面向对象、包管理、虚拟环境、pytest、HTTP 请求和项目开发。
