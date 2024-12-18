---
title: SQL函数（三）
date: 2024/12/17
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />

## SQL LEN() 函数

::: tip

LEN() 函数返回文本字段中值的长度。

:::

### 1 SQL LEN() 语法

```sql
SELECT LEN(column_name) FROM table_name;
```

**MySQL 中函数为 LENGTH()**

```sql
SELECT LENGTH(column_name) FROM table_name;
```



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
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 3 SQL LEN() 实例

下面的 SQL 语句从 Websites 表中选取 name 和 url 列中的值的长度：

**实例**：

```sql
SELECT name,LEN(url) as LengthOfURL
FROM Websites;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/len1.jpg)





## SQL ROUND() 函数

::: tip

ROUND() 函数用于把数值字段舍入为指定的小数位数。

:::

### 1 SQL ROUND() 语法

```sql
SELECT ROUND(column_name,decimals) FROM TABLE_NAME;
```

| 参数        | 描述                         |
| :---------- | :--------------------------- |
| column_name | 必需。要舍入的字段。         |
| decimals    | 可选。规定要返回的小数位数。 |



### 2 SQL ROUND() 实例

**① ROUND(X)**：返回参数 X 的四舍五入的一个整数。

**实例**：

```sql
mysql> SELECT ROUND(-1.23);
        -> -1
mysql> SELECT ROUND(-1.58);
        -> -2
mysql> SELECT ROUND(1.58);
        -> 2
```

**② ROUND(X,D)**：返回参数 X 的四舍五入的有 D 位小数的一个数字。如果 D 为 0，结果将没有小数点或小数部分。

**实例**：

```sql
mysql> SELECT ROUND(1.298, 1);
        -> 1.3
mysql> SELECT ROUND(1.298, 0);
        -> 1
```

::: warning

注意：ROUND 返回值被变换为一个 BIGINT!

:::



## SQL NOW() 函数

::: tip

NOW() 函数返回当前系统的日期和时间。

:::



### 1 SQL NOIW() 语法

```sql
SELECT NOW() FROM table_name;
```



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
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 3 SQL NOW() 实例

下面的 SQL 语句从 Websites 表中选取 name , url ,及当天日期：

**实例**：

```sql
SELECT name,url,Now() AS date
FROM Websites;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/now1.jpg)





## SQL FORMAT() 函数

::: tip

FORMAT() 函数用于对字段的显示进行格式化。

:::



### 1 SQL FROMAT() 语法

```sql
SELECT FORMAT(column_name,format) FROM table_name;
```

| 参数        | 描述                   |
| :---------- | :--------------------- |
| column_name | 必需。要格式化的字段。 |
| format      | 必需。规定格式。       |



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
|  7 | stackoverflow | http://stackoverflow.com/ |     0 | IND     |
+----+---------------+---------------------------+-------+---------+
```



### 3 SQL FORMAT() 实例

下面的 SQL 语句从 Websites 表中选取 name , url 以及格式化为 YYYY-MM-DD 的日期：

**实例**：

```sql
SELECT name,url,DATE_FORMAT(Now,'%Y-%m-%d') AS date
FROM Websites;
```

**执行输出结果**：

![img](https://www.runoob.com/wp-content/uploads/2013/09/formate1.jpg)





## SQL 快速参考

### 快速参考

| SQL 语句            | 语法                                                         | 说明                                                         |
| :------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **AND / OR**        | SELECT column_name(s) FROM table_name WHERE condition AND\|OR condition | AND：表示逻辑与 OR：表示逻辑或                               |
| **ALTER TABLE**     | `ALTER TABLE table_name ADD column_name datatypeALTER TABLE table_name DROP COLUMN column_name` | 用于修改现有表的结构，添加或删除列。                         |
| **AS (alias)**      | `SELECT column_name AS column_alias FROM table_nameSELECT column_name FROM table_name AS table_alias` | 用于为列或表指定别名。                                       |
| **BETWEEN**         | `SELECT column_name(s) FROM table_name WHERE column_name BETWEEN value1 AND value2` | 用于筛选在指定范围内的记录。                                 |
| **CREATE DATABASE** | `CREATE DATABASE database_name`                              | 用于创建新数据库。                                           |
| **CREATE TABLE**    | `CREATE TABLE table_name (column_name1 data_type, column_name2 data_type, ...)` | 用于创建新表，定义表的列和数据类型。                         |
| **CREATE INDEX**    | `CREATE INDEX index_name ON table_name (column_name)CREATE UNIQUE INDEX index_name ON table_name (column_name)` | 用于在表的列上创建索引，以加速查询。                         |
| **CREATE VIEW**     | `CREATE VIEW view_name AS SELECT column_name(s) FROM table_name WHERE condition` | 用于创建视图，以保存复杂查询的结果。                         |
| **DELETE**          | `DELETE FROM table_name WHERE some_column=some_valueDELETE FROM table_nameDELETE * FROM table_name` | 用于删除表中的记录，`DELETE FROM table_name` 和 `DELETE * FROM table_name` 会删除所有记录。 |
| **DROP DATABASE**   | `DROP DATABASE database_name`                                | 用于删除数据库。                                             |
| **DROP INDEX**      | `DROP INDEX table_name.index_name (SQL Server)DROP INDEX index_name ON table_name (MS Access)DROP INDEX index_name (DB2/Oracle)ALTER TABLE table_name DROP INDEX index_name (MySQL)` | 用于删除表上的索引。                                         |
| **DROP TABLE**      | `DROP TABLE table_name`                                      | 用于删除表及其所有数据。                                     |
| **GROUP BY**        | `SELECT column_name, aggregate_function(column_name) FROM table_name WHERE column_name operator value GROUP BY column_name` | 用于按一个或多个列对结果集进行分组。                         |
| **HAVING**          | `SELECT column_name, aggregate_function(column_name) FROM table_name WHERE column_name operator value GROUP BY column_name HAVING aggregate_function(column_name) operator value` | 用于对分组后的结果集进行过滤。                               |
| **IN**              | `SELECT column_name(s) FROM table_name WHERE column_name IN (value1, value2, ...)` | 用于筛选匹配集合中某一值的记录。                             |
| **INSERT INTO**     | `INSERT INTO table_name VALUES (value1, value2, ...)INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...)` | 用于向表中插入新记录。                                       |
| **INNER JOIN**      | `SELECT column_name(s) FROM table_name1 INNER JOIN table_name2 ON table_name1.column_name=table_name2.column_name` | 用于返回两个表中匹配的记录。                                 |
| **LEFT JOIN**       | `SELECT column_name(s) FROM table_name1 LEFT JOIN table_name2 ON table_name1.column_name=table_name2.column_name` | 用于返回左表中的所有记录和右表中的匹配记录。                 |
| **RIGHT JOIN**      | `SELECT column_name(s) FROM table_name1 RIGHT JOIN table_name2 ON table_name1.column_name=table_name2.column_name` | 用于返回右表中的所有记录和左表中的匹配记录。                 |
| **FULL JOIN**       | `SELECT column_name(s) FROM table_name1 FULL JOIN table_name2 ON table_name1.column_name=table_name2.column_name` | 用于返回两个表中的所有记录，不论是否匹配。                   |
| **LIKE**            | `SELECT column_name(s) FROM table_name WHERE column_name LIKE pattern` | 用于筛选匹配特定模式的记录。                                 |
| **ORDER BY**        | SELECT column_name(s) FROM table_name ORDER BY column_name [ASC\|DESC] | 用于对结果集进行排序。ASC 表示升序排列（默认），DESC 表示降序排列。 |
| **SELECT**          | `SELECT column_name(s) FROM table_name`                      | 用于从表中选择数据。                                         |
| **SELECT**          | `SELECT * FROM table_name`                                   | 用于选择表中的所有列。                                       |
| **SELECT DISTINCT** | `SELECT DISTINCT column_name(s) FROM table_name`             | 用于返回唯一不同的值。                                       |
| **SELECT INTO**     | `SELECT * INTO new_table_name [IN externaldatabase] FROM old_table_nameSELECT column_name(s) INTO new_table_name [IN externaldatabase] FROM old_table_name` | 用于从一个表中选择数据并插入到新表中。                       |
| **SELECT TOP**      | SELECT TOP number\|percent column_name(s) FROM table_name ORDER BY column_name [ASC\|DESC] | 从表中返回前指定数量的记录，可以指定绝对数量或百分比。       |
| **TRUNCATE TABLE**  | `TRUNCATE TABLE table_name`                                  | 用于删除表中的所有数据，但不删除表结构。                     |
| **UNION**           | `SELECT column_name(s) FROM table_name1 UNION SELECT column_name(s) FROM table_name2` | 用于合并两个或多个 SELECT 语句的结果集，不包含重复记录。     |
| **UNION ALL**       | `SELECT column_name(s) FROM table_name1 UNION ALL SELECT column_name(s) FROM table_name2` | 用于合并两个或多个 SELECT 语句的结果集，包含重复记录。       |
| **UPDATE**          | `UPDATE table_name SET column1=value, column2=value, ... WHERE some_column=some_value` | 用于修改表中的现有记录。                                     |
| **WHERE**           | `SELECT column_name(s) FROM table_name WHERE column_name operator value` | 用于过滤记录，指定查询条件。                                 |

