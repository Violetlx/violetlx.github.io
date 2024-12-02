---
title: SQL使用教程（二）
date: 2024/11/26
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />



## SQL SELECT

**SELECT**  语句用于从数据库中选取数据。

结果被存储在一个结果表中，称为结果集。



### SQL SELECT 语法

```sql
SELECT column1, column2, ...
FROM table_name;
```

与

```sql
SELECT * FROM table_name;
```

参数说明：

- `column1, column2, ...` ：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- `table_name` ：要查询的表名称。
- `*`  ：通配符，表示选择表中的所有列。



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+

```



### SELECT Column 实例

下面的 SQL 语句从 Websites 表中选取 name 和 country 列：

实例：

```sql
SELECT name,country FROM Websites;
```

输出结果：

![ https://www.runoob.com/wp-content/uploads/2013/09/98E6B49C-06AF-469B-B907-81C52BBE6BDC.jpg](https://www.runoob.com/wp-content/uploads/2013/09/98E6B49C-06AF-469B-B907-81C52BBE6BDC.jpg)



### SELECT *  实例

下面的 SQL 语句从 Websites 表中选取所有列：

实例：

```sql
SELECT * FROM Websites;
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/DE979628-6FAF-46BD-920F-18F9565ADD78.jpg](https://www.runoob.com/wp-content/uploads/2013/09/DE979628-6FAF-46BD-920F-18F9565ADD78.jpg)



## SQL SELECT DISTINCT

SELECT DISTINCT 语句用于返回唯一不同的值。

在表中，一个列可能包含多个重复值，有时你也许希望仅仅列出不同 （**distinct**）的值。

DISTINCT 关键词用于返回唯一不同的值。



### SQL SELECT DISTINCT 语法

```
SELECT DISTINCT column1, column2, ...
FROM table_name;
```

参数说明：

- `column1, column2, ...` ：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- `table_name` ：要查询的表名称。



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+

```



### SELECT DISTINCT 实例

下面的 SQL 语句仅从 Websites 表的 country 列中选取唯一不同的值，也就是去掉 contry 列的重复值：

实例：

```sql
SELECT DISTINCT country FROM Websites;
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/E3012A35-35DF-4BBB-8657-8A312C5AEAB6.jpg](//www.runoob.com/wp-content/uploads/2013/09/E3012A35-35DF-4BBB-8657-8A312C5AEAB6.jpg)



------

## SQL WHERE

**where** 子句用于过滤记录



### SQL WHERE 子句

**WHERE** 子句用于提取那些满足指定条件的记录。



### SQL WHERE 语法

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

参数说明：

- `column1, column2, ...`：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- `table_name`：要查询的表名称。



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+

```



### WHERE 子句实例

下面的 SQL 语句从 "Websites" 表中选取国家为 "CN" 的所有网站：

实例：

```sql
SELECT * FROM Websites WHERE country='CN';
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/4B7980AC-2566-43F7-843A-256E868B92A4.jpg](https://www.runoob.com/wp-content/uploads/2013/09/4B7980AC-2566-43F7-843A-256E868B92A4.jpg)



### 文本字段 vs. 数值字段

SQL 使用单引号来环绕文本值 （大部分数据库系统也接受双引号）

在上个实例中 'CN' 文本字段使用了单引号。

如果是数值字段，请不要使用引号。

实例：

```sql
SELECT * FROM Websites WHERE id=1;
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/639D2956-99CE-44E9-B960-EA14D296820E.jpg](https://www.runoob.com/wp-content/uploads/2013/09/639D2956-99CE-44E9-B960-EA14D296820E.jpg)



### WHERE 子句中的运算符

下面的运算符可以在 WHERE 子句中使用：

| 运算符  | 描述                                                       |
| :------ | :--------------------------------------------------------- |
| =       | 等于                                                       |
| <>      | 不等于。**注释：**在 SQL 的一些版本中，该操作符可被写成 != |
| >       | 大于                                                       |
| <       | 小于                                                       |
| >=      | 大于等于                                                   |
| <=      | 小于等于                                                   |
| BETWEEN | 在某个范围内                                               |
| LIKE    | 搜索某种模式                                               |
| IN      | 指定针对某个列的多个可能值                                 |





## SQL AND & OR

AND & OR 运算符用于基于一个以上的条件对记录进行过滤。



### SQL AND & OR 运算符

如果第一个条件和第二个条件都成立，则 AND 运算符显示一条记录。

如果第一个条件和第二个条件只要有一个成立，则 OR 运算符显示一条记录。



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+

```



### AND  运算符实例

下面的 SQL 语句从 **Websites** 表中选取国家为 CN 且 alexa 排名大于 50 的所有网站：

实例：

```sql
SELECT * FROM Websites
WHERE country='CN'
AND alexa > 50;
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/and-or1.jpg](https://www.runoob.com/wp-content/uploads/2013/09/and-or1.jpg)



### OR 运算符实例

下面的 SQL 语句从 Websites 表中选取国家为 USA 或者 CN 的所有客户：

实例：

```sql
SELECT * FROM Websites
WHERE country='USA'
OR country='CN';
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/and-or2.jpg](https://www.runoob.com/wp-content/uploads/2013/09/and-or2.jpg)



结合 AND & OR

可以把 AND 和 OR 结合起来（使用圆括号来组成复杂的表达式）

下面的 SQL 语句从 Websites 表中选取 alexa 排名大于 15 且国家为 CN 或 USA 的所有网站：

实例：

```sql
SELECT * FROM Websites
WHERE alexa > 15
AND (country = 'CN' OR country = 'USA');
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/and-or3.jpg](https://www.runoob.com/wp-content/uploads/2013/09/and-or3.jpg)





## SQL ORDER BY

ORDER BY 关键字用于对结果集进行排序。



### SQL ORDER BY 关键字

ORDER BY 关键字用于对于结果集按照一个列或者多个列进行排序。

ORDER BY 关键字默认按照升序对记录进行排序，如果需要按照降序对记录进行排序，你可以使用 **DESC** 关键字。



### SQL ORDER BY 语法

```sql
SELECT column1,column2, ...
FROM table_name
ORDER BY column1,column2, ... ASC|DESC;
```

- `column1,column2, ...` ：要排序的字段名称，可以为多个字段
- `ASC` ：表示按升序排序
- `DESC` ：表示按降序排序



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+

```



### ORDER BY 实例

下面的 SQL 语句从 Websites 表中选取所有网站，并按照 alexa 列排序：

实例：

```sql
SELECT * FROM Websites
ORDER BY alexa;
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/orderby1.jpg](https://www.runoob.com/wp-content/uploads/2013/09/orderby1.jpg)



### ORDER BY DESC 实例

下面的 SQL 语句从 Websites 表中选取所有网站，并按照 alexa 列降序排序：

实例：

```sql
SELECT * FROM Websites
ORDER BY alexa DESC;
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/orderby2.jpg](https://www.runoob.com/wp-content/uploads/2013/09/orderby2.jpg)



### ORDER BY 多列

下面的 SQL 语句从 Websites 表中选取所有网站，并且按照 country 和 alexa 列排序：

实例：

```sql
SELECT * FROM Websites
ORDER BY country,alexa;
```

输出结果：

![ https://www.runoob.com/wp-content/uploads/2013/09/orderby3.jpg](https://www.runoob.com/wp-content/uploads/2013/09/orderby3.jpg)

