---
title: SQL高级教程（三）
date: 2024/12/04
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />

## SQL SELECT INTO 语句

::: tip

通过 SQL ，你可以从一个表复制信息到另一个表。

SELECT INTO 语句从一个表复制数据，然后把数据插入到另一个新表中。

:::

### 1 SQL SELECT INTO 语句

SELECT INTO 语句从一个表复制数据，然后把数据插入到另一个新表中。

::: tip

**注意：**

MySQL 数据库不支持 SELECT ... INTO 语句，但支持 [INSERT INTO ... SELECT](https://www.runoob.com/sql/sql-insert-into-select.html) 。

当然你可以使用以下语句来拷贝表结构及数据：

```sql
CREATE TABLE 新表
AS
SELECT * FROM 旧表 
```

:::

**SQL SELECT INTO 语法**

假设有一个名为 employees 的表，包含以下数据：

| EmployeeID | FirstName | LastName | Age  | Department |
| :--------- | :-------- | :------- | :--- | :--------- |
| 1          | John      | Doe      | 30   | Sales      |
| 2          | Jane      | Smith    | 25   | HR         |
| 3          | Sam       | Brown    | 28   | IT         |

要创建一个名为 `employees_backup` 的新表，并将 `employees` 表中的所有数据插入到新表中，可以使用以下 SQL 语句：

```sql
SELECT *
INTO employees_backup
FROM employees;
```

执行此语句后，新的 employees_backup 表将仅包含年龄大于 25 岁的员工的数据。

```sql
SELECT EmployeeID,FirstName,LastName,Age,Department
INTO employees_backup
FROM employees
WHERE Age > 25;
```

执行此语句后，新的 `employees_backup` 表将仅包含年龄大于 25 岁的员工的数据。



**使用注意事项**

::: tip

**表结构**：

- `SELECT INTO` 会创建一个新表，并且新表的结构将基于选择的列和数据类型。
- 如果新表已存在，`SELECT INTO` 语句将失败。在这种情况下，可以使用 `INSERT INTO ... SELECT` 语句。

**数据库支持**：

- `SELECT INTO` 语句在 `SQL Server` 中非常常用，但在 `MySQL` 和 `PostgreSQL` 中通常使用 `CREATE TABLE ... AS SELECT`  语句。

:::



### 2 在其他数据库中的替代方案

**MySQL 和 PostgreSQL**

在 MySQL 和 PostgreSQL 中，可以使用 `CREATE TABLE ... AS SELECT` 来实现类似的功能：

```sql
CREATE TABLE employees_backup AS
SELECT EmployeeID,FirstName,LastName,Age,Department
FROM employees
WHERE Age > 25;
```



## SQL INSERT INTO SELECT 语句 

::: tip

通过 SQL ，你可以从一个表复制信息到另一个表。

INSERT INTO SELECT 语句从一个表复制数据，然后把数据插入到一个已存在的表中。

:::

### 1 SQL INSERT INTO SELECT 语句

INSERT INTO SELECT 语句从一个表复制数据，然后把数据插入到一个已存在的表中。目标表中任何已存在的行都不会受影响。

**SQL INSERT INTO SELECT 语法**

我们可以从一个表中复制所有的列插入到另一个已存在的表中：

```sql
INSERT INTO table2
SELECT * FROM table1;
```

或者我们可以只复制指定的列插入到另一个已存在的表中：

```sql
INSERT INTO table2
(column_name(s))
SELECT column_name(s)
FROM table1;
```



### 2 演示数据库

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



### 3 SQL INSERT INTO SELECT 实例

复制 apps 中的数据插入到 Websites 中：

**实例**：

```sql
INSERT INTO Websites (name,country)
SELECT app_name,country FROM apps;
```

只复制 id=1 的数据到 Websites 中：

**实例**：

```sql
INSERT INTO Websites (name,country)
SELECT app_name,country FROM apps
WHERE id=1;
```



## SQL CREATE DATABASE 语句

::: tip

CREATE DATABASE 语句用于创建数据库。

:::

### 1 SQL CREATE DATABASE 语法

```sql
CREATE DATABASE dbname;
```



### 2 SQL CREATE DATABASE 实例

下面的 SQL 语句创建一个名为 my_db 的数据库：

```sql
CREATE DATABASE my_db;
```

数据库表可以通过 CREATE TABLE 语句来添加。





## SQL CREATE TABLE 语句

::: tip

CREATE TABLE 语句用于创建数据库中的表。

表由行和列组成，每个表都必须有个表名。

:::



### 1 SQL CREATE TABLE 语法

```sql
CREATE TABLE table_name (
    column_name1 data_type(size),
    column_name2 data_type(size),
    column_name3 data_type(size),
    ...
);
```

- `column_name` 参数规定表中列的名称
- `data_type` 参数规定列的数据类型（例如 varchar、integer、decimal、date 等等）
- `size` 参数规定表中列的最大长度。

::: tip

提示：如需了解 MS Access、MySQL 和 SQL Server 中可用数据类型，请参考 [数据类型参考手册](https://www.runoob.com/sql/sql-datatypes.html)

:::



### 2 SQL CREATE TABLE 实例

现在我们想要创建一个名为 Persons 的表，包含五列：PersonID、LastName、FirstName、Address 和 City。

我们使用下面的 CREATE TABLE 语句：

**实例**：

```sql
CREATE TABLE Persons(
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
```

PersonID 列的数据类型是 int，包含整数

LastName、FirstName、Address 和 City 列的数据类型是 varchar，包含字符，且这些字段的最大长度为 255 个字符。

空的 Persons 表如下所示：

|          |          |           |         |      |
| :------- | :------- | :-------- | :------ | :--- |
| PersonID | LastName | FirstName | Address | City |
|          |          |           |         |      |

::: tip

**提示**：可使用 INSERT INTO 语句向空表写入数据。

:::

































































































































































































































































































































































































































