---
title: SQL使用教程（一）
date: 2024/11/26
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />



**SQL** ( `Structured Query Language` ，结构化查询语言) 是一种用于管理和操作关系型数据库的标准化编程语言。

在线测试工具：[https://www.jyshare.com/front-end/7768/](https://www.jyshare.com/front-end/7768/)



## SQL 简介

**SQL** （ `Structured Query Language` ，结构化查询语言）是用于管理关系数据库管理系统 （**RDBMS**）。

SQL 通过一系列的语句和命令来执行数据定义、数据查询、数据操作和数据控制等功能，包括数据插入、查询、更新和删除，数据库模式创建和修改，以及数据访问控制。



### SQL 是什么？

- SQL 是结构化查询语言，全称是 `Structured Query Language`
- SQL 让你可以访问和处理数据库，包括数据插入、查询、更新和删除
- SQL 语言采用英语关键词，使其易读易写
- SQL 有国际标准化组织 (ISO) 和美国国家标准协会 (ANSI) 标准化
- SQL 提供了丰富的操作数据的功能，从简单的查询到复杂的数据库管理操作



### SQL 能做什么？

- SQL 面向数据库执行查询
- SQL 可以从数据库取回数据
- SQL 可在数据库中插入新的记录
- SQL 可更新数据库中的数据
- SQL 可创建新数据库
- SQL 可在数据库中创建新表
- SQL 可在数据库中创建存储过程
- SQL 可在数据库中创建视图
- SQL 可设置表、存储过程和视图的权限



### SQL 是一种标准-但是 ...

虽然 SQL 是一门 ANSI （`American National Standards Institute` 美国国家标准化组织）标准的计算机语言，但是仍然存在着许多不同版本的 SQL 语言。

然而，为了与 ANSI 标准相兼容，他们必须以相似的方式共同地来支持一些主要的命令 （比如 `SELECT`、`UPDATE`、`DELETE`、`INSERT`、`WHERE` 等等）。

> 💡   注释：除了 SQL 标准外，大部分 SQL 数据库都拥有它们自己的专有扩展！



### 在网站中使用 SQL

要创建一个显示数据库中数据的网站：

- RDBMS 数据库程序（比如 MS Access、SQL Server、MySQL）
- 使用服务器端脚本语言，比如 PHP 或 ASP
- 使用 SQL 来获取您想要的数据
- 使用 HTML / CSS



### RDBMS

RDBMS 指关系型数据库管理系统，全称 `Relational Database Management System`。

RDBMS 是 SQL 的基础，同样也是所有现代数据库系统的基础，比如 MS SQL Server、IBM DB2、Oracle、MySQL 以及 Microsoft Access。

RDBMS 中的数据存储在被称为表的数据库对象中。

表是相关的数据项的集合，它由列和行组成。



### SQL 发展历史

以下是 SQL 发展历史的关键节点：

#### 1970s: 起源与早期发展

1. **1970年**：埃德加·科德（Edgar F. Codd）发表了《A Relational Model of Data for Large Shared Data Banks》论文，提出了关系数据库的概念，为 SQL 的发展奠定了理论基础。
2. **1973年-1974年**：IBM 的研究人员 Donald D. Chamberlin 和 Raymond F. Boyce 在科德的理论基础上开发了一种名为 SEQUEL（Structured English Query Language）的语言，用于操作和管理 IBM 的 System R 关系数据库。
3. **1976年**：SEQUEL 更名为 SQL（Structured Query Language）。

#### 1980s: 标准化与商业化

1. **1981年**：IBM 推出了商用关系数据库系统 SQL/DS（Database System）和 DB2（Database 2）。
2. **1986年**：美国国家标准协会（ANSI）发布了第一个 SQL 标准 ANSI SQL-86（SQL-87）。
3. **1987年**：国际标准化组织（ISO）也采纳了 ANSI SQL-86 作为国际标准。

#### 1990s: 扩展与改进

1. **1992年**：发布了 SQL-92（SQL2）标准，显著扩展了 SQL 语言的功能，包括对新数据类型、嵌套查询和连接的支持。
2. **1999年**：发布了 SQL:1999（SQL3）标准，引入了对象关系数据库（ORDBMS）特性、递归查询、触发器和用户定义函数。

#### 2000s: 持续演进与新特性

1. **2003年**：发布了 SQL:2003 标准，引入了 XML 相关特性和窗口函数。
2. **2006年**：发布了 SQL:2006 标准，主要增强了对 XML 的支持。
3. **2008年**：发布了 SQL:2008 标准，进一步改进了语法和性能优化。

#### 2010s: 新功能与大数据支持

1. **2011年**：发布了 SQL:2011 标准，增加了对时间数据类型和时间旅行（temporal data）的支持。
2. **2016年**：发布了 SQL:2016 标准，引入了 JSON 数据类型和相关操作函数，适应了 NoSQL 数据库和大数据处理需求。

#### 2020s: 现代化与标准更新

1. **2023年**：最新的 SQL 标准持续改进，增加了对更现代化的数据库需求和特性的支持。

#### 总结

SQL 从一种基于关系模型的查询语言发展成为现代数据库管理的核心语言，其标准在不断演进和扩展。各大数据库管理系统（如 MySQL、PostgreSQL、SQLite、SQL Server、Oracle 等）在遵循 SQL 标准的基础上，加入了自身的扩展和优化，使 SQL 成为数据操作和管理的强大工具。SQL 的发展不仅体现了技术的进步，也反映了数据管理需求的变化和增长。



## SQL 语法

**SQL**（Structured Query Language）是一种用于管理和操作关系数据库的标准语言，包括数据查询、数据插入、数据更新、数据删除、数据库结构创建和修改等功能

![ https://www.runoob.com/wp-content/uploads/2013/09/SQL.png](https://www.runoob.com/wp-content/uploads/2013/09/SQL.png)



### 数据库表

一个数据库通常包含一个或多个表，每个表有一个名字标识（例如:"**Websites**"），表包含带有数据的记录（行）。

在本教程中，我们在 MySQL 的 RUNOOB 数据库中创建了 Websites 表，用于存储网站记录。

我们可以通过以下命令查看 "Websites" 表的数据：

```sql
mysql> use RUNOOB;
Database changed

mysql> set names utf8;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM Websites;
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+
5 rows in set (0.01 sec)

```

**解析**

- **use RUNOOB;** 命令用于选择数据库。
- **set names utf8;** 命令用于设置使用的字符集。
- **SELECT \* FROM Websites;** 读取数据表的信息。
- 上面的表包含五条记录（每一条对应一个网站信息）和5个列（id、name、url、alexa 和country）。



### SQL 语句

你需要在数据库上执行的大部分工作都由 SQL 语句完成。

下面的 SQL 语句从 **Websites** 表中选取所有记录：

**实例**

```sql
SELECT * FROM Websites;
```



### 请记住 ...

- SQL 对大小写不敏感：**SELECT** 和 **select** 是相同的



### SQL 语句后面加分号?

某些数据库系统要求在每条 SQL 语句的末端使用分号。

分号是在数据库系统中分隔每条 SQL 语句的标准方法，这样就可以在对服务器的相同请求中执行一条以上的 SQL 语句。



### 一些重要的 SQL 命令

- **SELECT**  - 从数据库中提取数据
- **UPDATE** - 更新数据库中的数据
- **DELETE** - 从数据库中删除数据
- **INSERT INTO** - 向数据库中插入新数据
- **CREATE DATABASE** - 创建新数据库
- **ALTER DATABASE** - 修改数据库
- **DROP TABLE** - 删除表
- **CREATE INDEX** - 创建索引 （搜索值）
- **DROP INDEX** - 删除索引

以下是一些常用的 SQL 语句和语法：

1 `SELECT`：用于从数据库中查询数据

```sql
SELECT column_name(s)
FROM table_name
WHERE condition
ORDER BY column_name [ASC|DESC]
```

- `column_name(s)` ：要查询的列
- `table_name` ：要查询的表
- `condition` ： 查询条件 （可选）
- `ORDER BY` ：排序方式，**ASC** 表示升序，**DESC** 表示降序

2 `INSERT INTO` ：用于向数据库插入新数据

```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...)
```

- `table_name` ：要插入数据的表
- `(column1, column2, ...)` ：要插入数据的列
- `(value1, value2, ...)` ：对应列的值

3 `UPDATE` ：用于更新数据库表中的现有数据

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition
```

- `table_name` ：要更新数据的表
- `column1 = value1, column2 = value2, ...` ：要更新的列及其新值
- `condition` ：更新条件

4 `DELETE` ：用于从数据库表中删除数据

```sql
DELETE FROM table_name
WHERE condition
```

- `table_name` ：要删除数据的表
- `condition` ：删除条件

5 `CREATE TABLE` ：用于创建新的数据库表

```sql
CREATE TABLE table_name (
    column1 data_type constraint,
    column2 data_type constraint,
    ...
)
```

- `table_name` ：要创建的表明
- `column1,column2, ...` ：表的列
- `data_type` ：列的数据类型 （如 **INT**、**VARCHAR** 等）
- `constraint` ：列的约束 （如 **PRIMARY KEY** 、**NOT NULL** 等）

6 `ALETER TABLE` ：用于修改现有数据库表的结构

```sql
ALTER TABLE table_name
ADD column_name data_type
```

- `table_name` ：要修改的表
- `column_name` ：要添加的列
- `data_type` ：列的数据类型

或：

```sql
ALTER TABLE table_name
DROP COLUMN column_name
```

- `column_name`：要删除的列

7 `DROP TABLE` ：用于删除数据库表

```sql
DROP TABLE table_name
```

- `table_name` ：要删除的表

8 `CREATE INDEX` ：用于创建索引，以加快查询速度

```sql
CREATE INDEX index_name
ON table_name (column_name)
```

- `index_name` ：索引的名称
- `column_name` ：要索引的列

9 `DROP INDEX` ：用于删除索引

```sql
DROP INDEX index_name
ON table_name
```

- `index_name` ：要删除的索引名称
- `table_name` ：索引所在的表

10 `WHERE` ：用于指定筛选条件。

```sql
SELECT column_name(s)
FROM table_name
WHERE condition
```

- `condition` ：筛选条件。

11 `ORDER BY` ：用于对结果集进行排序

```sql
SELECT column_name(s)
FROM table_name
ORDER BY column_name [ASC|DESC]
```

- `column_name` ：用于排序的列
- `ASC` ：升序（默认）
- `DESC` ：降序

12 `GROUP BY` ：用于将结果集按一列或多列进行分组

```sql
SELECT column_name(s), aggregate_function(column_name)
FROM table_name
WHERE condition
GROUP BY column_name(s)
```

- `aggregate_function(column_name)` ：聚合函数 （如 **COUNT** 、**SUM** 、**AVG** 等）

13 `HAVING` ：用于对分组后的结果集进行筛选

```sql
SELECT column_name(s), aggregate_function(column_name)
FROM table_name
GROUP BY column_name(s)
HAVING condition
```

- `condition` ：筛选条件

14 `JOIN` ：用于将两个或多个表的记录结合起来

```sql
SELECT column_name(s)
FROM table_name1
JOIN table_name2
ON table_name1.column_name = table_name2.column_name
```

- `JOIN`: 可以是 INNER JOIN、LEFT JOIN、RIGHT JOIN 或 FULL JOIN。

15 `DISTINCT` ：用于返回唯一不同的值。

```sql
SELECT DISTINCT column_name(s)
FROM table_name
```

- `column_name(s)`：要查询的列。

