---
title: SQL高级教程（二）
date: 2024/12/02
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />



## SQL 连接（JOIN）

::: tip

SQL JOIN 用于把来自两个或多个表的行结合起来。

:::

下图展示了 `LEFT JOIN` 、`RIGHT JOIN` 、`INNER JOIN` 、`OUTER JOIN` 相关的 7 种用法。

![img](https://www.runoob.com/wp-content/uploads/2019/01/sql-join.png)

| 类型                | 描述                                                         |
| :------------------ | :----------------------------------------------------------- |
| **INNER JOIN**      | 返回两个表中满足连接条件的记录（交集）。                     |
| **LEFT JOIN**       | 返回左表中的所有记录，即使右表中没有匹配的记录（保留左表）。 |
| **RIGHT JOIN**      | 返回右表中的所有记录，即使左表中没有匹配的记录（保留右表）。 |
| **FULL OUTER JOIN** | 返回两个表的并集，包含匹配和不匹配的记录。                   |
| **CROSS JOIN**      | 返回两个表的笛卡尔积，每条左表记录与每条右表记录进行组合。   |
| **SELF JOIN**       | 将一个表与自身连接。                                         |
| **NATURAL JOIN**    | 基于同名字段自动匹配连接的表。                               |



### 1 示例数据

**表1：Customers**

| CustomerID | Name    |
| :--------- | :------ |
| 1          | Alice   |
| 2          | Bob     |
| 3          | Charlie |

**表2：Orders**

| OrderID | CustomerID | Product |
| :------ | :--------- | :------ |
| 101     | 1          | Laptop  |
| 102     | 2          | Phone   |
| 103     | 4          | Tablet  |

### 2 各连接结果对比

| JOIN 类型           | 结果                                                         |
| :------------------ | :----------------------------------------------------------- |
| **INNER JOIN**      | 返回 `CustomerID` 为 1 和 2 的记录（两表匹配）。             |
| **LEFT JOIN**       | 返回所有 `Customers` 记录，以及 `CustomerID` 为 4 的记录对应 `NULL`（保留左表）。 |
| **RIGHT JOIN**      | 返回所有 `Orders` 记录，以及 `CustomerID` 为 3 的记录对应 `NULL`（保留右表）。 |
| **FULL OUTER JOIN** | 返回所有 `Customers` 和 `Orders` 的记录，未匹配部分用 `NULL` 填充。 |
| **CROSS JOIN**      | 返回 `Customers` 和 `Orders` 的笛卡尔积（每条左表记录与每条右表记录组合）。 |
| **SELF JOIN**       | 例如匹配员工和其经理（需要通过自身表关系定义）。             |



### 3 SQL  JOIN

SQL JOIN 子句用于把来自两个或多个表的行结合起来，基于这些表之间的共同字段。

最常见的 JOIN 类型：`SQL INNER JOIN (简单的 JOIN)` 。SQL INNER JOIN 从多个表中返回满足 JON 条件的所有行。

**语法**：

```sql
SELECT column1,column2,...
FROM table1
JOIN table2 ON condition;
```

**参数说明**：

- `column1,column2,...`：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- `table1`：要连接的第一个表。
- `table2`：要连接的第二个表。
- `condition`：连接条件，用于指定连接方式。



### 4 演示数据库

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



::: tip

请注意，Websites 表种的 id 列指向 access_log 表中的字段 site_id 。上面这两个表是通过 site_id 列联系起来的。

:::

然后，如果我们运行下面的 SQL 语句，（包含 INNER JONI）：

**实例**：

```sql
SELECT Websites.id,Websites.name,access_log.count,access_log.date
FROM Websites
INNER JOIN access_log
ON Websites.id=access_log.site_id;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/join1.jpg)



### 5 不同的 SQL JOIN

SQL JOIN 类型：

- `INNER JOIN`：如果表中有至少一个匹配，则返回行
- `LEFT JOIN`：即使右表中没有匹配。也从左表中返回所有行
- `RIGHT JOIN`：即使左表中没有匹配，也从右表返回所有的行
- `FULL JOIN`：只要其中一个表中存在匹配，则返回行



## SQL INNER JOIN 关键字

::: tip

INNER JOIN 是 SQL 中最常用的连接方式之一，用于从多个表中根据它们之间的关系提取匹配的记录。

INNER JOIN 关键字在表中存在至少一个匹配时返回行，返回的是两个表中满足连接条件的交集，即同时存在与两个表中的数据。

:::

### 1 SQL INNER JOIN 语法

```sql
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name=table2.column_name;
```

或：

```sql
SELECT column_name(s)
FROM table1
JOIN table2
ON table1.column_name=table2.column_name;
```

**参数说明**：

- `columns`：要显示的列名
- `table1`：表1的名称
- `table2`：表2的名称
- `column_name`：表中用于连接的列名

::: tip

**注释**：INNER JOIN 与 JOIN 是相同的。

:::

<div style="background-color: white; padding: 10px; border-radius: 5px;">
  <img src="https://www.runoob.com/wp-content/uploads/2013/09/img_innerjoin.gif" alt="SQL INNER JOIN">
</div>



假设有两个表：`Students` 和 `Enrollments`

**Students 表**：

| StudentID | Name    | Age  |
| :-------- | :------ | :--- |
| 1         | Alice   | 22   |
| 2         | Bob     | 23   |
| 3         | Charlie | 24   |

**Enrollments 表**：

| EnrollmentID | StudentID | Course  |
| :----------- | :-------- | :------ |
| 101          | 1         | Math    |
| 102          | 2         | Science |
| 103          | 4         | History |

**使用 INNER JOIN 查询**

```sql
SELECT Students.Name,Enrollments.Course
FROM Students
INNER JOIN Enrollments
ON Students.StudentID = Enrollments.StudentID;
```

得到结果如下：

| Name  | Course  |
| :---- | :------ |
| Alice | Math    |
| Bob   | Science |

::: tip

**解释**：INNER JOIN 返回的是 Students 和 Enrollments 表中 StudentID 匹配的数据。没有匹配上的记录（如 Charlie 和 EnrollmentID 为 103 的数据）将被排除。

:::

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



### 3 SQL INNNER JOIN 实例

下面的 SQL 语句将返回所有网站的访问记录：

**实例**：

```sql
SELECT Websites.name,access_log.count,access_log.date
FROM Websites
INNER JOIN access_log
ON Websites.id=access_log.site_id
ORDER BY access_log.count;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/inner-join1.jpg)

::: tip

**注释**：INNER JOIN 关键字在表中存在至少一个匹配时返回行。如果 Websites 表中的行在 access_log 中没有匹配，则不会列出这些行。

:::



## SQL LEFT JOIN 关键字

::: tip

LEFT JOIN 是 SQL 中的一个连接关键字，用于从多个表中提取数据。

LEFT JOIN 与 INNER JOIN 不同之处在于，LEFT JOIN 会返回左表中的所有记录，即使在右表中没有匹配的记录。

LEFT JOIN 关键字从做表（table1）返回所有的行，即使右表（table2）中没有匹配。如果右表中没有匹配，则结果为 NULL。

:::

### 1 SQL LEFT JOIN 语法

```sql
SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name=table2.column_name;
```

或：

```sql
SELECT column_name(s)
FROM table1
LEFT OUTER JOIN table2
ON table1.column_name=table2.column_name;
```

**注释**：在某些数据库中，LEFT JOIN 称为 LEFT OUTER JOIN

- `table1`：左表（主表），LEFT JOIN 会保留该表的所有记录。
- `table2`：右表（从表），如果没有匹配的数据，用 NULL 填充对应的列。
- `ON table1.column_name=table2.column_name`：指定连接条件，通常是两个表的共同字段。

<div style="background-color: white; padding: 10px; border-radius: 5px;">
  <img src="https://www.runoob.com/wp-content/uploads/2013/09/img_leftjoin.gif" alt="SQL INNER JOIN">
</div>



**特点**：

- 返回左表中的所有记录，即使右表没有匹配的数据
- 如果右表没有匹配的记录，结果中该行右表字段为 NULL

假设有两个表：`Customers` 和 `Orders`

**Customers 表**：

| CustomerID | Name    |
| :--------- | :------ |
| 1          | Alice   |
| 2          | Bob     |
| 3          | Charlie |
| 4          | David   |

**Orders 表**：

| OrderID | CustomerID | Product    |
| :------ | :--------- | :--------- |
| 101     | 1          | Laptop     |
| 102     | 2          | Smartphone |

### 2 使用 LEFT JOIN 查询

```sql
SELECT Customers.Name, Orders.Product
FROM Customers
LEFT JOIN Orders
ON Customers.CustomerID = Orders.CustomerID;
```

**查询输出结果**：

| Name    | Product    |
| :------ | :--------- |
| Alice   | Laptop     |
| Bob     | Smartphone |
| Charlie | NULL       |
| David   | NULL       |

::: tip

**解释**：`LEFT JOIN` 返回了 `Customers` 表中的所有记录。对于 `Charlie` 和 `David`，由于在 `Orders` 表中没有匹配的 `CustomerID`，它们对应的 `Product` 列为 `NULL`。

:::

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



### 4 SQL LEFT JOIN 实例

下面的 SQL 语句将返回所有网站及他们的访问量（如果有的话）。

一下实例中我们把 Websites 作为左表，access_log 作为右表：

**实例**：

```sql
SELECT Websites.name,access_log.count,access_log.date
FROM Websites
LEFT JOIN access_log
ON Websites.id=access_log.site_id
ORDER BY access_log.count DESC;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/left-join1.jpg)

::: tip

**注释**：LEFT JOIN 关键字从左表（Websites）返回所有的行，即使右表（access_log）中没有匹配。

:::



## SQL RIGHT JOIN 关键字

::: tip

RIGHT JOIN 是 SQL 中的一个连接关键字，用于从多个表中提取数据。

与 LEFT JOIN 类似，但其行为相反：RIGHT JOIN 会返回右表中的所有记录，即使左表中没有匹配的记录。

RIGHT JOIN 关键字从右表（table2）返回所有的行，即使左表（table1）中没有匹配。如果左表中没有匹配，则结果为 NULL 。

:::

### 1 SQL RIGHT JOIN 语法

```sql
SELECT column_name(s)
FROM table1
RIGHT JOIN table2
ON table1.column_name=table2.column_name;
```

或：

```sql
SELECT column_name(s)
FROM table1
RIGHT OUTER JOIN table2
ON table1.column_name=table2.column_name;
```

::: tip

**注释**：在某些数据库中，RIGHT JOIN 称为 RIGHT OUTER JOIN

:::

- `table1`：左表
- `table2`：右表
- `ON table1.column_name=table2.column_name`：指定连接条件，通常是两个表的共同字段。

<div style="background-color: white; padding: 10px; border-radius: 5px;">
  <img src="https://www.runoob.com/wp-content/uploads/2013/09/img_rightjoin.gif" alt="SQL INNER JOIN">
</div>



**特点**：

- `保留右表的所有记录`：即使左表中没有匹配的记录，也会在结果中包含右表的所有记录。
- `左表未匹配时填充 NULL`：如果左表中没有对应的记录，用 NULL 填充左表的列。

假设有两个表：`Employees` 和 `Departments`。

**Employees 表**：

| EmployeeID | Name    | DepartmentID |
| :--------- | :------ | :----------- |
| 1          | Alice   | 10           |
| 2          | Bob     | 20           |
| 3          | Charlie | NULL         |

**Departments 表**：

| DepartmentID | DepartmentName |
| :----------- | :------------- |
| 10           | HR             |
| 20           | IT             |
| 30           | Finance        |

------

### 2 使用 RIGHT JOIN 查询

```sql
SELECT Employees.Name, Departments.DepartmentName
FROM Employees
RIGHT JOIN Departments
ON Employees.DepartmentID = Departments.DepartmentID;
```

**查询输出结果**：

| Name  | DepartmentName |
| :---- | :------------- |
| Alice | HR             |
| Bob   | IT             |
| NULL  | Finance        |

::: tip

**解释**：RIGHT JOIN 返回了 Departments 表中的所有记录。对于 DepartmentID = 30 的记录，由于 Employees 表中没有匹配数据，其 Name 列为 NULL 。

**与 LEFT JOIN 的区别**：

- `LEFT JOIN`：返回左表的所有记录，即使右表没有匹配项。
- `RIGHT JOIN`：返回右表的所有记录，即使左表没有匹配项。

:::

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



### 4 SQL RIGHT JOIN 实例

下面的 SQL 语句将返回网站的访问记录。

以下实例中我们把 Websites 作为左表，access_log 作为右表

**实例**：

```sql
SELECT Websites.name,access_log.count,access_log.date
FROM Websites
RIGHT JOIN access_log
ON access_log.site_id=Websites.id
ORDER BY access_log.count DESC;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/402A662D-3553-449C-B980-942D864412BD.jpg)

::: tip

**注释**：RIGHT JOIN 关键字从右表（access_log）返回所有的行，即使左表（Websites）中没有匹配。

:::



## SQL FULL OUTER JOIN 关键字

::: tip

FULL OUTER JOIN 是 SQL 中的一种连接方式，用于同时保留两个表中所有的记录，即使其中一方没有匹配项。

FULL OUTER JOIN 结果包括两个表中满足条件的记录（交集部分）以及不满足条件的记录（并集中的非交集部分）。如果某条记录在一张表中存在，而在另一张表中没有匹配项，则该记录的缺失列会以 NULL 填充。

FULL OUTER JOIN 关键字只要左表（table1）和右表（table2）其中一个表中存在匹配值，则返回行。

FULL OUTER JOIN 关键字结合了 LEFT JOIN 和 RIGHT JOIN 的结果。

:::

### 1 SQL FULL OUTER JOIN 语法

```sql
SELECT column_name(s)
FROM table1
FULL OUTER JOIN table2
ON table1.column_name=table2.column_name;
```

- `table1、table2`：需要进行连接的两个表。
- `ON table1.column_name=table2.column_name`：指定连接条件，通常是两个表的共同字段。
- `column_name(s)`：从两个表中选择需要的字段。

<div style="background-color: white; padding: 10px; border-radius: 5px;">
  <img src="https://www.runoob.com/wp-content/uploads/2013/09/img_fulljoin.gif" alt="SQL INNER JOIN">
</div>

**特点**

- `返回两个表的并集`：包含所有匹配和未匹配的记录。
- `未匹配的记录填充 NULL`：如果某条记录在一张表中没有匹配项，则其对应的字段以 NULL 表示。
- `对等性`：FULL OUTER JOIN 包含了 LEFT JOIN 和 RIGHT JOIN 的结果。

假设有两个表：`Students` 和 `Courses`。

**Students 表**：

| StudentID | Name    |
| :-------- | :------ |
| 1         | Alice   |
| 2         | Bob     |
| 3         | Charlie |

**Courses 表**：

| CourseID | StudentID | CourseName |
| :------- | :-------- | :--------- |
| 101      | 1         | Math       |
| 102      | 2         | Science    |
| 103      | 4         | History    |

------

### 2 使用 FULL OUTER JOIN 查询

```sql
SELECT Students.StudentID, Students.Name, Courses.CourseName
FROM Students
FULL OUTER JOIN Courses
ON Students.StudentID = Courses.StudentID;
```

**查询输出结果**：

| StudentID | Name    | CourseName |
| :-------- | :------ | :--------- |
| 1         | Alice   | Math       |
| 2         | Bob     | Science    |
| 3         | Charlie | NULL       |
| 4         | NULL    | History    |

**解释**：

- `StudentID = 1` 和 `2` 是交集部分，两表中都有数据。
- `StudentID = 3` 存在于 `Students` 表，但在 `Courses` 表中没有匹配，`CourseName` 列为 `NULL`。
- `StudentID = 4` 存在于 `Courses` 表，但在 `Students` 表中没有匹配，`Name` 列为 `NULL`。



### 3 总结

| JOIN 类型         | 返回内容                               |
| :---------------- | :------------------------------------- |
| `INNER JOIN`      | 两个表的交集部分，匹配的记录           |
| `LEFT JOIN`       | 左表的所有记录，以及匹配的右表记录     |
| `RIGHT JOIN`      | 右表的所有记录，以及匹配的左表记录     |
| `FULL OUTER JOIN` | 两个表的并集部分，包含匹配和未匹配记录 |



### 4 演示数据库

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



### 5 SQL FULL OUTER JOIN 实例

下面的 SQL 语句选取所有网站访问记录。

::: tip

MySQL 中不支持 FULL OUTER JOIN，你可以在 SQL Server 测试以下实例。

:::

**实例**：

```sql
SELECT Websites.name, access_log.count, access_log.date
FROM Websites
FULL OUTER JOIN access_log
ON Websites.id=access_log.site_id
ORDER BY access_log.count DESC;
```

::: tip

注释：FULL OUTER JOIN 关键字返回左表（Websites）和右表（access_log）中所有的行。如果 Websites 表中的行在 access_log 中没有匹配或者 access_log 表中的行在 Websites 表中没有匹配，也会列出这些行。

:::



## SQL UNION 操作符

::: tip

SQL UNION 操作符合并两个或多个 SELECT 语句的结果。

UNION 操作符用于合并两个或多个 SELECT 语句的结果集。它可以从多个表中选择数据，并将结果集组合成一个结果集。使用 UNION 时，每个 SELECT 语句必须具有相同数量的列，且对应列的数据类型必须相似。

:::

### 1 SQL UNION 语法

```sql
SELECT column1,column2,...
FROM table1
UNION
SELECT column1,column2,...
FROM table2;
```

`UNION` 操作符默认会去除重复的记录，如果需要保留重复记录，可以使用 UNION ALL 操作符。

![img](https://www.runoob.com/wp-content/uploads/2013/09/53e8e79b70093d886b466af8e7f71c5.png)

### 2 SQL UNION ALL 语法

```sql
SELECT column1,column2,...
FROM table1
UNION ALL
SELECT column1,column2,...
FROM table2;
```

![img](https://www.runoob.com/wp-content/uploads/2013/09/SQL-UNION-ALL.png)

::: tip

**注释**：UNION 结果集中的列名总是等于 UNION 中第一个 SELECT 语句中的列名。

:::

### 3 演示数据库

在本教程中，我们将使用 RUNOOB 样本数据库。

下面是选自 `Websites` 表的数据：

```sql
mysql> SELECT * FROM Websites;
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+
```

下面是 `apps` APP 的数据：

```sql
mysql> SELECT * FROM apps;
+----+------------+-------------------------+---------+
| id | app_name   | url                     | country |
+----+------------+-------------------------+---------+
|  1 | QQ APP     | http://im.qq.com/       | CN      |
|  2 | 微博 APP | http://weibo.com/       | CN      |
|  3 | 淘宝 APP | https://www.taobao.com/ | CN      |
+----+------------+-------------------------+---------+
3 rows in set (0.00 sec)
```



### 4 SQL UNION 实例

下面的 SQL 语句从 Websites 和 apps 表中选取所有不同的 country（只有不同的值）：

**实例**：

```sql
SELECT country FROM Websites
UNION 
SELECT country FROM apps
ORDER BY country;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/union1.jpg)

::: tip

**注释**：UNION 不能用于列出两个表中所有的 country。如果一些网站和 APP 来自同一个国家，每个国家只会列出一次，UNION 只会选取不同的值。请使用 UNION ALL 来选取重复的值！

:::

### 5 SQL UNION ALL 实例

下面的 sQL 语句使用 UNION ALL 从 Websites 和 apps 表中选取所有的 country（也有重复的值）：

**实例**：

```sql
SELECT country FROM Websites
UNION ALL
SELECT country FROM apps
ORDER BY country;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/union2.jpg)



### 6 带有 WHERE 的 SQL UNION ALL

下面的 SQL 语句使用 UNION ALL 从 Websites 和 apps 表中选取**所有的**中国（CN）的数据（也有重复的值）：

**实例**：

```sql
SELECT country,name FROM Websites
WHERE country='CN'
UNION ALL
SELECT country,app_name FROM apps
WHERE country='CN'
ORDER BY country;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/AAA99C7B-36A5-43FB-B489-F8CE63B62C71.jpg)

































































































































































































































































































