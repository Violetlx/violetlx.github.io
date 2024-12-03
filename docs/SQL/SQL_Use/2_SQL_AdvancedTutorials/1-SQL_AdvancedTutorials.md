---
title: SQL高级教程（一）
date: 2024/11/26
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />

## SQL  SELECT  TOP /LIMIT/ROWNUM 子句

:::: tip

SELECT TOP 语句用于在 SQL 中限制返回的结果集中的行数，它通常用于只需要查询前几行数据的情况，尤其在数据集非常大时，可以显著提高查询性能。

SELECT TOP 子句对于拥有数千条记录的大型表来说，是非常有用的。

::::

说明：

- SELECT TOP 在 SQL Server 和 MS Access 中使用，而在 MySQL 和 PostgreSQL 中使用 LIMIT 关键字。
- Oracle 在 12c 版本之前没有直接等效的关键字，可以通过 ROWNUM 实现类似功能，但在 12c 及以上的版本中引入了 FETCH FIRST 。
- 当使用 TOP 或 LIMIT 时，最好结合 ORDER BY 子句，以确保返回的行是特定顺序的前几行。

**① SQL Server / MS Access  语法**

```sql
SELECT TOP number|percent column1,column2,...
FROM table_name;
```

`number|percent`：指定返回的行数或百分比

- `number`：具体的行数
- `percent`：数据集的百分比

**② MySQL 语法**

```sql
SELECT column1,column2,...
FROM table_name
LIMIT number;
```

**③ Oracle 语法**

```sql
SELECT column1,column2,...
FROM table_name
FETCH FIRST number ROWS ONLY;
```

**④ PostgreSQL 语法**

```sql
SELECT column1,column2,...
FROM table_name
LIMIT number;
```

### 1 实例

假设我们有一个名为 `Employees` 的表。其中包含以下数据：

| EmployeeID | EmployeeName | Salary |
| :--------- | :----------- | :----- |
| 1          | John Smith   | 50000  |
| 2          | Maria Garcia | 60000  |
| 3          | Liam Johnson | 70000  |
| 4          | Emma Wilson  | 80000  |
| 5          | Oliver Brown | 90000  |

1. SQL Server 和 MS Access 返回前 3 行数据：

   ```sql
   SELECT TOP 3 Employees,Salary
   FROM Employees;
   ```

2. 返回前 10% 的数据：

   ```sql
   SELECT TOP 10 PERCENT Employees,Salary
   FROM Employees;
   ```

3. MySQL 返回前 3 行数据：

   ```sql
   SELECT EmployeeName,Salary
   FROM Employees
   LIMIT 3;
   ```

4. Postgre SQL 返回前 3 行数据：

   ```sql
   SELECT EmployeeName,Salary
   FROM Employees
   LIMIT 3;
   ```

5. Oracle 返回前 3 行数据：

   ```sql
   SELECT EmployeeName,Salary
   FROM Employees
   FETCH FIRST 3 ROWS ONLY;
   ```


### 2 演示数据库

下面是 `Websites` 表的数据：

```sql
mysql> SELECT * FROM Websites;
+----+---------------+---------------------------+-------+---------+
| id | name          | url                       | alexa | country |
+----+---------------+---------------------------+-------+---------+
|  1 | Google        | https://www.google.cm/    |     1 | USA     |
|  2 | 淘宝          | https://www.taobao.com/   |    13 | CN      |
|  3 | 菜鸟教程       | http://www.runoob.com/    |  5000 | USA     |
|  4 | 微博           | http://weibo.com/         |    20 | CN      |
|  5 | Facebook      | https://www.facebook.com/ |     3 | USA     |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```

### 3 MySQL SELECT LIMIT 实例

下面的 SQL 语句从 Websites 表中选取头两条记录：

**实例**

```sql
SELECT * FROM Websites LIMIT 2;
```

**执行以上 SQL ，数据如下所示：**

![img](https://www.runoob.com/wp-content/uploads/2013/09/A90E535B-A499-4E3D-83DD-6A7AD1144B05.jpg)

### 4 SQL SELECT TOP PERCENT 实例

在 Microsoft SQL Server 中还可以使用百分比作为参数。

下面的 SQL 语句从 Websites 表中选取前面百分之 50 的记录：

```sql
SELECT TOP 50 PERCENT * FROM Websites;
```



## SQL LIKE 操作符

:::: tip

LIKE 操作符用于在 WHERE 子句中搜索列中的指定模式。

LIKE 操作符是 SQL 中用于在 WHERE 子句中进行模糊查询的关键字，它允许我们根据模式匹配来选择数据，通常与 % 和 _ 通配符一起使用。

::::

### 1 SQL LIKE 语法

```sql
SELECT column1,column2,...
FROM table_name
WHERE column_name LIKE pattern;
```

**参数说明：**

- `column1,column2,...`：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- `table_name`：要查询的表名称。
- `column`：要搜索的字段名称。
- `pattern`：搜索模式。

**通配符：**

- `%`：匹配任意字符（包括零个字符）
- `_`：匹配单个字符

### 2 实例

假设我们有一个名为 Products 的表，包含以下数据：

| ProductID | ProductName        | Category    |
| :-------- | :----------------- | :---------- |
| 1         | iPhone 12          | Electronics |
| 2         | Samsung Galaxy S21 | Electronics |
| 3         | Dell XPS 13        | Electronics |
| 4         | Nike Air Zoom      | Footwear    |
| 5         | Adidas Ultraboost  | Footwear    |
| 6         | Sony PlayStation 5 | Electronics |

使用 `%` 通配符找出所有以 `iPhone` 开头的产品：

```sql
SELECT ProductName,Category
FROM Products
WHERE ProductName LIKE 'iPhone%';
```

返回以下数据：

| ProductName | Category    |
| :---------- | :---------- |
| iPhone 12   | Electronics |

使用 `_` 通配符找出所有产品名称为三个字符，第一个字符为 `D` ，第二个字符为 `e` 的产品：

```sql
SELECT ProductName,Category
FROM Products
WHERE ProductName LIKE 'De_';
```

返回以下数据：

| ProductName | Category    |
| :---------- | :---------- |
| Dell XPS 13 | Electronics |

结合 `%` 和 `_` 通配符找出所有产品名称包含 `Zoom` 的产品：

```sql
SELECT ProductName,Category
FROM Products
WHERE ProductName LIKE '%Zoom%';
```

返回以下数据：

| ProductName   | Category |
| :------------ | :------- |
| Nike Air Zoom | Footwear |

### 3 演示数据库

下面是 `Websites` 表的数据：

```sql
mysql> SELECT * FROM Websites;
+----+---------------+---------------------------+-------+---------+
| id | name          | url                       | alexa | country |
+----+---------------+---------------------------+-------+---------+
|  1 | Google        | https://www.google.cm/    |     1 | USA     |
|  2 | 淘宝          | https://www.taobao.com/   |    13 | CN      |
|  3 | 菜鸟教程       | http://www.runoob.com/    |  5000 | USA     |
|  4 | 微博           | http://weibo.com/         |    20 | CN      |
|  5 | Facebook      | https://www.facebook.com/ |     3 | USA     |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 4 SQL LIKE 操作符实例

① 下面的 SQL 语句选取 name 以字母 `G` 开始的所有客户：

**实例**：

```sql
SELECT * RROM Websites
WHERE name LIKE 'G%';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/like1.jpg)

::: tip
`%` 符号用于在模式的前后定义通配符（默认字母）。
:::

② 下面的 SQL 语句选取 name 以字母 `k` 结尾的所有客户：

**实例**：

```sql
SELECT * FROM Websites
WHERE name LIKE '%K';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/like2.jpg)

③ 下面的 SQL 语句选取 name 包含模式 `oo` 的所有客户

**实例**：

```sql
SELECT * FROM Websites
WHERE name NOT LIKE '%oo%';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/like4.jpg)



## SQL 通配符

:::: tip

通配符可用于替代字符串中的任何其他字符。

::::



### 1 SQL 通配符

在 SQL 中，通配符与 SQL LIKE 操作符一起使用。

SQL 通配符用于搜索表中的数据。

在 SQL 中，可使用以下通配符：

| 通配符                         | 描述                       |
| :----------------------------- | :------------------------- |
| %                              | 替代 0 个或多个字符        |
| _                              | 替代一个字符               |
| [*charlist*]                   | 字符列中的任何单一字符     |
| [^*charlist*] 或 [!*charlist*] | 不在字符列中的任何单一字符 |



### 2 演示数据库

下面是 `Websites` 表的数据：

```sql
mysql> SELECT * FROM Websites;
+----+---------------+---------------------------+-------+---------+
| id | name          | url                       | alexa | country |
+----+---------------+---------------------------+-------+---------+
|  1 | Google        | https://www.google.cm/    |     1 | USA     |
|  2 | 淘宝          | https://www.taobao.com/   |    13 | CN      |
|  3 | 菜鸟教程       | http://www.runoob.com/    |  5000 | USA     |
|  4 | 微博           | http://weibo.com/         |    20 | CN      |
|  5 | Facebook      | https://www.facebook.com/ |     3 | USA     |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 3 使用 SQL % 通配符

① 下面的 SQL 语句选取 url 以字母 `https` 开始的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE url LIKE 'https%';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/wildcards1.jpg)

② 下面的 SQL 语句选取 url 包含模式 `oo` 的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE url LIKE '%oo%';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/wildcards2.jpg)



### 4 使用 SQL _ 通配符

① 下面的 SQL 语句选取 name 以一个任意字符开始，然后是 `oogle` 的所有客户：

**实例**：

```sql
SELECT * FROM Websites
WHERE name LIKE '_oogle';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/wildcards3.jpg)

② 下面的 SQL 语句选取 name 以 `G` 开始，然后是一个任意字符，然后是 `o` ，然后是一个任意字符，然后是 `le` 的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE name LIKE 'G_o_le';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/wildcards4.jpg)



### 5 使用 SQL [charlist] 通配符

::: info

在 SQL 中，`[charlist]` 通配符用于指定一个字符列表，用于匹配该列表中的任何一个字符。

它通常与 LIKE 操作符一起使用，用户模糊匹配，比如在 WHERE 子句中。

:::

① 下面的 SQL 语句选取 name 以 `G 、F 或 s` 开始的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE name REGEXP '^[GFs]';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/wildcards5.jpg)

② 下面的 SQL 语句选取 name 以 A 到 H 字母开头的网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE name REGEXP '^[A-H]';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/wildcards6.jpg)

③ 下面的 SQL 语句选取 name 不以 A 到 H 字母开头的网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE name REGEXP '^[^A-H]';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/wildcards7.jpg)



## SQL IN 操作符

::: tip

IN 操作符允许你在 WHERE 子句中规定多个值。

:::

### 1 SQL IN 语法

```sql
SELECT column1,column2,...
FROM table_name
WHERE column IN (value1,value2,...);
```

**参数说明**：

- `column1,column2,...`：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- `table_name`：要查询的表名称。
- `column`：要查询的字段名称。
- `value1,value2,...`：要查询的值，可以为多个值。



### 2 演示数据库

下面是 `Websites` 表的数据：

```sql
mysql> SELECT * FROM Websites;
+----+---------------+---------------------------+-------+---------+
| id | name          | url                       | alexa | country |
+----+---------------+---------------------------+-------+---------+
|  1 | Google        | https://www.google.cm/    |     1 | USA     |
|  2 | 淘宝          | https://www.taobao.com/   |    13 | CN      |
|  3 | 菜鸟教程       | http://www.runoob.com/    |  5000 | USA     |
|  4 | 微博           | http://weibo.com/         |    20 | CN      |
|  5 | Facebook      | https://www.facebook.com/ |     3 | USA     |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 3 IN 操作符实例

下面的 SQL 语法选取 name 为 `Google` 或 `菜鸟教程` 的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE name IN ('Google','菜鸟教程');
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/in1.jpg)



## SQL BETWEEN 操作符

::: tip

BETWEEN 操作符选取介于两个值之间的数据范围内的值，这些值可以是数值、文本或者日期。

:::

### 1 SQL BETWEEN 语法

**参数说明**：

- `column1,column2,...`：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- `table_name`：要查询的表名称。
- `column`：要查询的字段名称。
- `value1`：范围的起始值。
- `value2`：范围的结束值。



### 2 演示数据库

下面是 `Websites` 表的数据：

```sql
mysql> SELECT * FROM Websites;
+----+---------------+---------------------------+-------+---------+
| id | name          | url                       | alexa | country |
+----+---------------+---------------------------+-------+---------+
|  1 | Google        | https://www.google.cm/    |     1 | USA     |
|  2 | 淘宝          | https://www.taobao.com/   |    13 | CN      |
|  3 | 菜鸟教程       | http://www.runoob.com/    |  5000 | USA     |
|  4 | 微博           | http://weibo.com/         |    20 | CN      |
|  5 | Facebook      | https://www.facebook.com/ |     3 | USA     |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 3 BETWEEN 操作符实例

下面的 SQL 语句选取 alexa 介于 1 和 20 之间的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE alexa BETWEEN 1 AND 20;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/btw1.jpg)



### 4 NOT BETWEEN 操作符实例

如需显示不在上面实例范围的网站，请使用 NOT BETWEEN：

**实例**：

```sql
SELECT * FROM Websites
WHERE alexa NOT BETWEEN 1 AND 20;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/btw2.jpg)



### 5 带有 IN 的 BETWEEN 操作符实例

下面的 SQL 语句选取 alexa 介于 1 和 20 之间但 country 不为 USA 和 IND 的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE (alexa BETWEEN 1 AND 20)
AND country NOT IN ('USA','IND');
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/7E2FE939-4679-4C2C-BAFC-FC5BFF6697DC.jpg)



### 6 带有文本值的 BETWEEN 操作符实例

下面的 SQL 语句选取 name 以介于 A 和 H 之间的字母开始的所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE name BETWEEN 'A' AND 'H';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/btw4.jpg)



### 7 带有文本值得 NOT BETWEEN 操作符实例

下面得 SQL 语句选取 name 不接与 A 和  H 之间得字母开始得所有网站：

**实例**：

```sql
SELECT * FROM Websites
WHERE name NOT BETWEEN 'A' AND 'H';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/btw5.jpg)



### 8 示例表

下面是 `access_log` 网站访问记录表得数据，其中：

- `aid`：为自增 id
- `site_id`：为对应 Websites 表得网站 id。
- `count`：访问次数。
- `date`：为访问日期。

```sql
mysql> SELECT * FROM access_log;
+-----+---------+-------+------------+
| aid | site_id | count | date       |
+-----+---------+-------+------------+
|   1 |       1 |    45 | 2016-05-10 |
|   2 |       3 |   100 | 2016-05-13 |
|   3 |       1 |   230 | 2016-05-14 |
|   4 |       2 |    10 | 2016-05-14 |
|   5 |       5 |   205 | 2016-05-14 |
|   6 |       4 |    13 | 2016-05-15 |
|   7 |       3 |   220 | 2016-05-15 |
|   8 |       5 |   545 | 2016-05-16 |
|   9 |       3 |   201 | 2016-05-17 |
+-----+---------+-------+------------+
9 rows in set (0.00 sec)
```

本教程使用到得 `access_log` 表 SQL 文件：[`access_log.sql`](https://static.jyshare.com/download/access_log.sql)



### 9 带有日期值得 BETWEEN 操作符示例

下面得 SQL 语句选取 date 介于 `2016-05-10` 和 `2016-05-14` 之间得所有访问记录：

**实例**：

```sql
SELECT * FROM access_log
WHERE date BETWEEN '2016-05-10' AND '2016-05-14';
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/btw6.jpg)

::: tip

**请注意，在不同得数据库中，BETWEEN 操作符会产生不同得结果！**

在某些数据库中，BETWEEN 选取介于两个值之间但不包括两个测试值得字段。

在某些数据库中，BETWEEN 选取介于两个值之间且包括两个测试值得字段。

在某些数据库中，BETWEEN 选取介于两个值之间且包括第一个测试值但不包括最后一个测试值得字段。

**因此，请检查您得数据库是如何处理 BETWEEN 操作符！**

:::



## SQL 别名

::: tip

通过使用 SQL ，可以为表名或列名称指定别名。

基本上创建别名就是为了让列名称得可读性更强。

:::



### 1 列的 SQL 别名语法

```sql
SELECT column_name AS alias_name
FROM table_name;
```



### 2 表的 SQL 别名语法

```sql
SELECT column_name(s)
FROM table_name AS alia_name;
```



### 3 演示数据库

下面是 `Websites` 表的数据：

```sql
mysql> SELECT * FROM Websites;
+----+---------------+---------------------------+-------+---------+
| id | name          | url                       | alexa | country |
+----+---------------+---------------------------+-------+---------+
|  1 | Google        | https://www.google.cm/    |     1 | USA     |
|  2 | 淘宝          | https://www.taobao.com/   |    13 | CN      |
|  3 | 菜鸟教程       | http://www.runoob.com/    |  5000 | USA     |
|  4 | 微博           | http://weibo.com/         |    20 | CN      |
|  5 | Facebook      | https://www.facebook.com/ |     3 | USA     |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```

下面是 `access_log` 网站访问记录表的数据：

```sql
mysql> SELECT * FROM access_log;
+-----+---------+-------+------------+
| aid | site_id | count | date       |
+-----+---------+-------+------------+
|   1 |       1 |    45 | 2016-05-10 |
|   2 |       3 |   100 | 2016-05-13 |
|   3 |       1 |   230 | 2016-05-14 |
|   4 |       2 |    10 | 2016-05-14 |
|   5 |       5 |   205 | 2016-05-14 |
|   6 |       4 |    13 | 2016-05-15 |
|   7 |       3 |   220 | 2016-05-15 |
|   8 |       5 |   545 | 2016-05-16 |
|   9 |       3 |   201 | 2016-05-17 |
+-----+---------+-------+------------+
9 rows in set (0.00 sec)
```



### 4 列的别名实例

① 下面的 SQL 语句指定了两个别名，一个是 name 列的别名，一个是 country 列的别名。

::: tip

**提示**：如果列名称包含空格，要求使用双引号或方括号

:::

**实例**：

```sql
SELECT name AS n,country AS c
FROM Websites;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/alias1.jpg)



② 在下面的 SQL 语句中，我们把三个列（`url 、alexa 和 country`）结果在一起，并创建一个为 `site_info` 的别名：

**实例**：

```sql
SELECT name,CONCAT(url , ', ' , alexa ,', ', country) AS site_info
FROM Websites;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/alias2.jpg)



### 5 表的别名实例

① 下面的 SQL 语句选取 `菜鸟教程` 的所有访问记录。我们使用 Websites 和 access_log 表，并分别为它们指定表别名 w 和 a ：

::: tip

通过使用别名让 SQL 更简短

:::

**实例**：

```sql
SELECT w.name,w.url,a.count,a.date
FROM Websites AS w,access_log AS a
WHERE  a.site_id=w.id and w.name="菜鸟教程";
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/alias3.jpg)



② 不带别名相同的 SQL 语句：

**实例**：

```sql
SELECT Websites.name, Websites.url, access_log.count, access_log.date 
FROM Websites, access_log  
WHERE Websites.id=access_log.site_id and Websites.name="菜鸟教程";
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/alias4.jpg)



::: tip

在下面的情况下，使用别名很有用：

- 在查询中涉及超过一个表
- 在查询中使用了函数
- 列名称很长或者可读性差
- 需要把两个列或者多个列结合在一起

:::
