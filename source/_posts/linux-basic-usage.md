---
title: Linux 基础用法：开发与测试常用命令入门
date: 2026-09-02 18:40:00
categories:
  - 开发工具
tags:
  - Linux
  - 命令行
  - 软件测试
description: 面向开发与软件测试初学者，掌握目录、文件、权限、进程、日志、网络和软件安装等 Linux 高频操作。
---

Linux 广泛用于服务器、云平台、容器和开发环境。初学者不需要立刻学习系统底层，只要先掌握文件操作、权限、进程、日志和网络排查，就能完成大部分开发与软件测试任务。

<!-- more -->

## 1. 终端、Shell 与命令

终端是输入命令的界面，Shell 是解释并执行命令的程序，常见 Shell 有 Bash 和 Zsh。

一条命令通常由“命令 + 选项 + 参数”组成：

```bash
ls -la /var/log
```

- `ls`：命令。
- `-la`：选项。
- `/var/log`：操作目标。

可以使用帮助了解陌生命令：

```bash
man ls
ls --help
```

## 2. Linux 目录结构

- `/`：根目录，所有目录的起点。
- `/home`：普通用户的主目录。
- `/etc`：系统和软件配置文件。
- `/var/log`：日志文件。
- `/tmp`：临时文件。
- `/usr/bin`：常用可执行程序。
- `/opt`：第三方软件常见安装位置。

路径分为绝对路径和相对路径。`/home/user/app` 是绝对路径，`./app` 是相对当前目录的路径。

## 3. 查看与切换目录

```bash
pwd                 # 显示当前目录
ls                  # 列出目录内容
ls -l               # 显示详细信息
ls -la              # 包含隐藏文件
cd /var/log         # 进入指定目录
cd ..               # 返回上一级
cd -                # 返回上一次所在目录
cd                  # 返回当前用户主目录
```

Linux 中以 `.` 开头的文件通常是隐藏文件。

## 4. 创建、复制、移动和删除

```bash
mkdir project                 # 创建目录
mkdir -p project/logs/nginx   # 递归创建多级目录
touch app.py                  # 创建空文件或更新时间
cp app.py app_backup.py       # 复制文件
cp -r project project_copy    # 复制目录
mv old.txt new.txt            # 重命名
mv app.py project/            # 移动文件
rm file.txt                   # 删除文件
rmdir empty_dir               # 删除空目录
```

`rm` 删除后通常不会进入回收站。使用 `rm -r` 前必须确认当前目录和目标路径，避免误删。

## 5. 查看文件内容

```bash
cat config.txt             # 输出整个文件
less large.log             # 分页查看大文件
head -n 20 app.log         # 查看前 20 行
tail -n 20 app.log         # 查看后 20 行
tail -f app.log            # 持续查看新增日志
wc -l app.log              # 统计行数
```

在 `less` 中按 `/` 搜索，按 `n` 跳到下一个结果，按 `q` 退出。

## 6. 搜索文件与文本

```bash
find . -name "*.py"                    # 查找 Python 文件
find /var/log -type f -mtime -1        # 查找一天内修改的文件
grep "ERROR" app.log                   # 查找包含 ERROR 的行
grep -n "ERROR" app.log                # 同时显示行号
grep -ri "timeout" ./logs              # 递归、不区分大小写
```

如果系统安装了 ripgrep，搜索代码通常更快：

```bash
rg "def login" src/
rg --files
```

## 7. 重定向与管道

重定向控制命令的输入和输出，管道把前一个命令的输出交给下一个命令。

```bash
echo "hello" > note.txt       # 覆盖写入
echo "world" >> note.txt      # 追加写入
command 2> error.log           # 保存错误输出
cat app.log | grep "ERROR"    # 管道过滤
ps aux | grep python           # 查找 Python 进程
```

许多命令可以直接接收文件，因此 `grep "ERROR" app.log` 比 `cat app.log | grep "ERROR"` 更简洁。

## 8. 用户与文件权限

执行 `ls -l` 可能看到：

```text
-rwxr-xr-- 1 user group 1024 Sep 2 10:00 deploy.sh
```

权限分为三组：文件所有者、所属组、其他用户。每组包含：

- `r`：读取。
- `w`：写入。
- `x`：执行。

常见操作：

```bash
whoami                 # 当前用户
id                     # 用户与用户组信息
chmod +x deploy.sh     # 添加执行权限
chmod 644 config.txt   # 所有者可读写，其他人只读
chmod 755 deploy.sh    # 所有者可读写执行，其他人可读执行
```

`sudo` 以管理员权限执行命令。不要看到权限错误就盲目加 `sudo`，应先确认操作是否确实需要管理员权限。

## 9. 进程与任务管理

```bash
ps aux                  # 查看进程
top                     # 动态查看系统负载与进程
pgrep -af python        # 查找 Python 进程及命令
kill 1234               # 请求 PID 1234 正常退出
kill -9 1234            # 强制终止，谨慎使用
command &               # 放到后台运行
jobs                    # 查看当前 Shell 的后台任务
```

如果系统使用 systemd，可以管理系统服务：

```bash
systemctl status nginx
sudo systemctl restart nginx
journalctl -u nginx --since today
```

## 10. 磁盘与内存

```bash
df -h                # 查看各文件系统剩余空间
du -sh ./project     # 查看目录占用空间
free -h              # 查看内存使用
uptime               # 查看运行时间与平均负载
```

遇到“磁盘空间不足”时，先用 `df -h` 判断哪个分区已满，再用 `du` 定位大目录。

## 11. 网络排查

```bash
ip addr                         # 查看网络接口与 IP
ping -c 4 example.com           # 测试网络连通性
curl -I https://example.com     # 查看 HTTP 响应头
curl -v https://example.com     # 查看详细请求过程
ss -lntp                        # 查看监听中的 TCP 端口
```

测试接口常用 `curl`：

```bash
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"demo"}'
```

不要把真实密码、令牌等敏感信息直接写进脚本、命令历史或公开日志。

## 12. 压缩与解压

```bash
tar -czf logs.tar.gz logs/     # 打包并使用 gzip 压缩
tar -xzf logs.tar.gz           # 解压
zip -r project.zip project/    # 创建 zip 包
unzip project.zip              # 解压 zip 包
```

## 13. 软件安装

Ubuntu/Debian 常用 `apt`：

```bash
sudo apt update
sudo apt install git
```

CentOS/RHEL 系通常使用 `dnf` 或 `yum`：

```bash
sudo dnf install git
```

安装前先确认 Linux 发行版：

```bash
cat /etc/os-release
```

## 14. 环境变量

```bash
echo "$PATH"                 # 查看 PATH
export APP_ENV="test"       # 当前 Shell 临时设置
printenv APP_ENV             # 查看变量
unset APP_ENV                # 删除变量
```

长期配置通常写入 `~/.bashrc` 或 `~/.zshrc`，修改后可重新打开终端，或执行：

```bash
source ~/.bashrc
```

## 15. 常用组合示例

### 从日志中统计错误

```bash
grep "ERROR" app.log | wc -l
```

### 找到占用端口的进程

```bash
ss -lntp | grep ":8000"
```

### 运行 Python 程序并保存日志

```bash
python app.py > app.log 2>&1 &
```

`2>&1` 表示把错误输出也交给标准输出，因此两者都会写入 `app.log`。

## 16. 新手常见问题

- 命令区分大小写，`File.txt` 和 `file.txt` 可能是两个文件。
- 路径包含空格时要加引号，例如 `cd "My Project"`。
- “Permission denied” 可能是缺少读写或执行权限。
- “Command not found” 可能是软件未安装，或程序目录不在 `PATH` 中。
- 修改配置前先备份，并在重启服务前检查语法。

## 17. 入门练习

1. 创建 `linux-practice` 目录，并在其中创建三个文本文件。
2. 将包含 `ERROR` 的日志行保存到新文件。
3. 找出当前系统最占磁盘空间的几个目录。
4. 启动一个 Python HTTP 服务，查看其进程与监听端口。
5. 编写 `backup.sh`，把指定目录打包为带日期的压缩文件。

## 总结

Linux 入门的核心不是背诵命令，而是理解“当前在哪个目录、以哪个用户操作、目标文件是什么、命令会造成什么结果”。能熟练使用目录、文件、权限、进程、日志和网络命令后，就已经具备开发和初级测试岗位最常用的 Linux 操作能力。
