---
title: SQL函数（一）
date: 2024/12/16
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />



## SQL 函数

SQL 拥有很多可用于计数和计算的内建函数

### 1 SQL Aggregate 函数

SQL Aggregate 函数计算从列中取得的值，返回一个单一的值。

有用的 Aggregate 函数：

- `AVG()`：返回平均值
- `COUNT()`：返回行数
- `FIRST()`：返回第一个记录的值
- `LAST()`：返回最后一个记录的值
- `MAX()`：返回最大值
- `MIN()`：返回最小值
- `SUM()`：返回总合



### 2 SQL Scalar 函数

SQL Scalar 函数基于输入值，返回一个单一的值。

有用的 Scalar 函数：

- `UCASE()`：将某个字段转换为大写
- `LCASE()`：将某个字段转换为小写
- `MID()`：从某个文本字段提取字符，MySQL 中使用
- `SubString(字段,1,end)`：从某个文本字段提前字符
- `LEN()`：返回某个文本字段的长度
- `ROUND()`：对某个数值字段进行指定小数位数的四舍五入
- `NOW()`：返回当前的系统日期和时间
- `FORMAT()`：格式化某个字段的显示方式





## SQL AVG() 函数

::: tip

AVG() 函数返回数值列的平均值。

:::

### 1 SQL AVG() 语法

```sql
SELECT AVG(column_name) FROM table_name;
```



### 2 演示数据库

`access_log` 表：

```sql
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
```



### 3 SQL AVG() 实例

① 下面的 SQL 语句从 access_log 表的 count 列获取平均值：

**实例**：

```sql
SELECT AVG(count) AS CountAverage FROM access_log;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/avg1.jpg)

② 下面的 SQL 语句选择访问量高于平均访问量的 site_id 和 count：

**实例**：

```sql
SELECT site_id,count FROM access_log
WHERE count > (SELECT AVG(count) FROM access_log);
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/avg2.jpg)



## SQL COUNT() 函数

::: tip

`COUNT()` 函数返回匹配指定条件的行数。

:::

**① SQL COUNT(column_name) 语法**

`COUNT(column_name)` 函数返回指定列的值的数目（NULL 不计入）：

```sql
SELECT COUNT(column_name) FROM table_name;
```

**② SQL COUNT(*) 语法**

`COUNT(*)` 函数返回表中的记录数：

```sql
SELECT COUNT(*) FROM table_name;
```

**③ SQL COUNT(DISTINCT column_name) 语法**

`COUNT(DISTINCT column_name)` 函数返回指定列的不同值的数目：

```sql
SELECT COUNT(DISTINCT column_name) FROM table_name;
```

::: tip

**注释**：`COUNT(DISTINCT column_name)` 适用于 ORACLE 和 Microsoft SQL Server，但是无法用于 Microsoft Access。

:::

### 1 演示数据库

`access_log` 表：

```sql
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
```



### 2 SQL COUNT(column_name) 实例

下面的 SQL 语句计算 `access_log` 表中 site_id = 3 的总访问量：

**实例**：

```sql
SELECT COUNT(count) AS nums FROM access_log
WHERE site_id=3;
```



### 3 SQL COUNT(*) 实例

下面的 SQL 语句计算 access_log 表中总记录数：

**实例**：

```sql
SELECT COUNT(*) AS nums FROM access_log;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/count1.jpg)



### 4 SQL COUNT(DISTINCT column_name) 实例

下面的 SQL 语句计算 access_log 表中不同 site_id 的记录数：

**实例**：

```sql
SELECT COUNT(DISTINCT site_id) AS nums FROM access_log;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/count2.jpg)





## SQL FIRST() 函数

::: tip

FIRST() 函数返回指定的列中第一个记录的值。

:::



### 1 SQL FIRST() 语法

```sql
SELECT FIRST(column_name) FROM table_name;
```

::: tip

**注释**：只有 MS Access 支持 FIRST() 函数。

:::



### 2 SQL Server、MySQL 和 Oracle 中的 SQL FIRST() 工作区

:::: code-group

::: code-group-item SQL Server 语法

```sql
SELECT TOP 1 column_name FROM table_name
ORDER BY column_name ASC;
```

::: tip

**实例**：

```sql
SELECT TOP 1 name FROM Websites
ORDER BY id ASC;
```

:::

:::

::: code-group-item MySQL 语法

```sql
SELECT column_name FROM table_name
ORDER BY column_name ASC
LIMIT 1;
```

::: tip

**实例**：

```sql
SELECT name FROM Websites
ORDER BY id ASC
LIMIT 1;
```

:::

:::

::: code-group-item Oracle 语法

```sql
SELECT column_name FROM table_name
ORDER BY column_name ASC
WHERE ROWNUM <=1;
```

::: tip

**实例**：

```sql
SELECT name FROM Websites
ORDER BY id ASC
WHERE ROWNUM <=1;
```

:::

:::

::::



### 3 演示数据库

`Websites`表

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
|  6 | 百度         | https://www.baidu.com/    |     4 | CN      |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 4 SQL FIRST() 实例

下面的 SQL 语句选取 Websites 表的 name 列中第一个记录的值：

**实例**：

```sql
SELECT name AS FirstSite FROM Websites LIMIT 1;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/limit1.jpg)





## SQL LAST() 函数

::: tip

LAST() 函数返回指定列中最后一个记录的值。

**SQL LAST() 语法**

```sql
SELECT LAST(column_name) FROM table_name;
```

**注释**：只有 MS Access 支持 LAST() 函数。

:::



### 1 SQL Server、MySQL 和 Oracle 中的 SQL LAST() 工作区

:::: code-group

::: code-group-item SQL Server 语法

```sql
SELECT TOP 1 column_name FROM table_name
ORDER BY column_name DESC;
```

::: tip

**实例**：

```sql
SELECT TOP 1 name FROM Websites
ORDER BY id DESC;
```

:::

:::

::: code-group-item MySQL 语法

```sql
SELECT column_name FROM table_name
ORDER BY column_name DESC
LIMIT 1;
```

::: tip

**实例**：

```sql
SELECT name FROM Websites
ORDER BY id DESC
LIMIT 1;
```

:::

:::

::: code-group-item Oracle 语法

```sql
SELECT column_name FROM table_name
ORDER BY column_name DESC
WHERE ROWNUM <=1;
```

::: tip

**实例**：

```sql
SELECT name FROM Websites
ORDER BY id DESC
WHERE ROWNUM <=1;
```

:::

:::

::::



### 2 演示数据库

`Websites`表

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
|  6 | 百度         | https://www.baidu.com/    |     4 | CN      |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 3 SQL LAST() 实例

下面的 SQL 语句选取 Websites 表的 name 列中最后一个记录的值：

**实例**：

```sql
SELECT name FROM Websites
ORDER BY id DESC
LIMIT 1;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/last1.jpg)





## SQL MAX() 函数

::: tip

MAX() 函数返回指定列的最大值。

**SQL MAX() 语法**

```sql
SELECT MAX(column_name) FROM table_name;
```

:::

### 1 演示数据库

`Websites`表

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
|  6 | 百度         | https://www.baidu.com/    |     4 | CN      |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 2 SQL MAX 实例

下面的 SQL 语句从 Websites 表的 alexa 列获取最大值：

**实例**：

```sql
SELECT MAX(alexa) AS max_alexa FROM Websites;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/max1.jpg)





## SQL MIN() Function

::: tip

**MIN() 函数**

MIN() 函数返回指定列的最小值。

**SQL MIN 语法**

```sql
SELECT MIN(column_name) FROM table_name;
```

:::



### 1 演示数据库

`Websites`表

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
|  6 | 百度         | https://www.baidu.com/    |     4 | CN      |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 2 SQL MIN() 实例 

下面的 SQL 语句从 Websites 表的 alexa 列获取最小值：

**实例**：

```sql
SELECT MIN(alexa) AS min_alexa FROM Websites;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/min1.jpg)





## SQL SUM() 函数

::: tip

SUM() 函数返回数值列的总数。

**SQL SUM() 语法**

```sql
SELECT SUM(column_name) FROM table_name;
```

:::



### 1 演示数据库

`Websites`表

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
|  6 | 百度         | https://www.baidu.com/    |     4 | CN      |
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 2 SQL SUM() 实例

下面的 SQL 语句查找 access_log 表的 count 字段的总数：

**实例**：

```sql
SELECT SUM(count) AS nums FROM access_log;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/sum1.jpg)

















































































































































































































































































































































































































































































































































