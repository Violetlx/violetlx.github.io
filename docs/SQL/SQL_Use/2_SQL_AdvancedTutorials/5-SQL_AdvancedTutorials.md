---
title: SQL高级教程（五）
date: 2024/12/12
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />



## SQL CREATE INDEX 语句

::: tip

CREATE INDEX 语句用于在表中创建索引。

在不读取整个表的情况下，索引使数据库应用程序可以更快速地查找数据。

:::

### 1 索引

你可以在表中创建索引，以便更加快速高效地查询数据。

用户无法看到索引，他们只能被用来加速搜索/查询。

> 注释：更新一个包含索引的表需要比更新一个没有索引的表花费更多的时间，这是由于索引本身也需要更新。因此，理想的做法仅仅在常常被搜索的列（以及表）上面创建索引。

**① SQL CREATE INDEX 语法**

在表上创建一个简单的索引。允许使用重复的值：

```sql
CREATE INDEX index_name
ON table_name (column_name);
```

**② SQL CREATE UNIQUE INDEX 语法**

在表上创建一个唯一的索引。不允许使用重复的值：唯一的索引意味着两个行不能拥有相同的索引值。

`Creates a unique index on a table. Duplicate values are not allowed`

```sql
CREATE UNIQUE INDEX index_name
ON table_name (column_name);
```

> **注释**：用于创建索引的语法在不同的数据库中不一样。因此，检查你的数据库中创建索引的语法。



### 2 CREATE INDEX 实例

下面的 SQL 语句在 Persons 表的 LastName 列上创建一个名为 PIndex 的索引：

```sql
CREATE INDEX PIndex
ON Persons (LastName);
```

如果你希望索引不止一个列，你可以在括号中列出这些列的名称，用逗号隔开：

```sql
CREATE INDEX PIndex
ON Persons (LastName,FirstName);
```



## SQL 撤销索引、撤销表以及撤销数据库

::: tip

通过使用 DROP 语句，可以轻松地删除索引、表和数据库。

:::

### 1 DROP INDEX 语句

索引是一种优化数据库查询性能的结构，但有时候可能需要删除某个索引，例如当索引不再需要或需要替换为新的索引时。

DROP INDEX 语句用于删除表中的索引。

:::: code-group 

::: code-group-item 语法格式

```sql
DROP INDEX [IF EXISTS] index_name
ON TABLE_NAME;
```

::: 

::::

**参数说明：**

- `DROP INDEX`：表示要删除索引的操作。
- `IF EXISTS`：是一个可选的子句，用于检查索引是否存在。如果存在，就执行删除操作；如果不存在，不会报错。
- `index_name`：要删除索引的名称。
- `ON table_name`：指定包含要删除索引的表的名称。

:::: code-group

::: code-group-item 实例

```sql
DROP INDEX IF EXISTS idx_example
ON my_table;
```

:::

::::

::: tip

请注意，删除索引可能会影响数据库的查询性能，因此在执行此类操作之前，请确保了解其对数据库的影响，并根据实际需求进行操作。

:::



### 2 DROP  TABLE 语句

DROP TABLE 语句用于删除表。

删除表将同时删除表的结构以及存储在其中的所有数据。因此，在执行 DROP TABLE 语句之前，请确保你真的希望永久删除表及其所有数据，因为此操作是不可逆的。

:::: code-group

::: code-group-item 语法格式

```sql
DROP TABLE [IF EXISTS] TABLE_NAME;
```

:::

::::

**参数说明**：

- `DROP TABLE`：表示删除表的操作。
- `IF EXISTS`：是一个可选的子句，用于检查表是否存在。如果存在，执行删除操作；如果不存在，不会报错。
- `table_name`：要删除的表的名称。

一下是一个简单的例子，假设要删除名为 my_table 的表：

:::: code-group

::: code-group-item 实例

```sql
DROP TABLE IF EXISTS my_table;
```

:::

::::

::: tip

请注意，执行 DROP TABLE 将永久删除表和其所有数据。在执行此类操作之前，请确保你已备份重要的数据，并且你有删除表的权限。

:::



### 3 DROP DATABASE 语句

`DROP DATABASE` 语句用于删除数据库，包括其中的所有表、视图、存储过程等数据库对象。

`DROP DATABASE` 是一个非常强大和危险的操作，因为它会永久删除整个数据库及其所有相关数据，因此在执行之前务必要慎重考虑并确保你真的希望执行此操作。

:::: code-group

::: code-group-item 语法格式

```sql
DROP DATABASE [IF EXISTS] database_name;
```

:::

::::

**参数说明**：

- `DROP DATABASE`：表示删除数据库的操作。
- `IF EXISTS`：是一个可选的子句，用于检查数据库是否存在。如果存在，执行删除操作；如果不存在，不会报错。
- `database_name`：要删除的数据库的名称。

一下是一个简单的例子，假设要删除名为 my_database 的数据库：

:::: code-group

::: code-group-item 实例

```sql
DROP DATABASE IF EXISTS my_database;
```

:::

::::

在执行 `DROP DATABASE` 之前，请确保你已经备份了数据库中的重要数据，并且你确实有权限执行这个操作，因为删除数据库通常需要管理员或超级用户的权限。此外，执行此类操作之前最好先确认没有其他用户正在使用该数据库。



### 4 TRUNCATE  TABLE 语句

如果我们仅仅需要删除表内的数据，但并不删除表本身，那么我们该如何做呢？

在 SQL 中，TRUNCATE TABLE 语句用于快速删除表中的所有数据，但保留表的结构（列、约束等），与 DELETE 语句相比，TRUNCATE TABLE 通常更快，因为它是通过删除表中的所有行而不是逐行删除实现的。

然而，需要注意的是，TRUNCATE TABLE 不会触发触发器，而且无法在事务中进行回滚。

请使用 TRUNCATE TABLE 语句：

**语法格式**：

```sql
TRUNCATE TABLE TABLE_NAME;
```

**参数说明**：

- `TRUNCATE TABLE`：表示清空表的操作。
- `table_name`：要清空表的名称。

以下是一个简单的例子，假设要清空名为 my_table 的表：

**实例**：

```sql
TRUNCATE TABLE my_table;
```

当使用 TRUNCATE TABLE 清除数据时。表的主键自增值将被重置为默认的起始值，通常是从 1 开始。这意味着下一次插入数据时，主键从 1 开始递增。与之不同的是，使用 DELETE 语句删除数据并不会重置主键自增值，而是保留当前的自增值。



## SQL ALTER TABLE 语句

::: tip

ALTER TABLE 语句用于在已有的表中添加、删除或修改列。

:::

### 1 SQL ALTER TABLE 语法

如需在表中添加列，请使用下面的语法：

```sql
ALTER TABLE table_name
ADD column_name datype;
```

如需删除表中的列，请使用下面的语法（请注意，某些数据库系统不允许这种在数据库表中删除列的方式）：

```sql
ALTER TABLE table_name
DROP COLUMN column_name;
```

要改变表中列的数据类型，请使用下面的语法：

**① SQL Server / MS Access**

```sql
ALTER TABLE table_name
ALTER COLUMN column_name datatype;
```

**② MySQL / Oracle**

```sql
ALTER TABLE table_name
MODIFY COLUMN column_name datatype;
```

**③ Oracle 10G 之后版本**

```sql
ALTER TABLE table_name
MODIFY column_name datatype;
```



### 2 SQL ALTER TABLE 实例

`Persons` 表

| P_Id | LastName  | FirstName | Address      | City      |
| :--- | :-------- | :-------- | :----------- | :-------- |
| 1    | Hansen    | Ola       | Timoteivn 10 | Sandnes   |
| 2    | Svendson  | Tove      | Borgvn 23    | Sandnes   |
| 3    | Pettersen | Kari      | Storgt 20    | Stavanger |

现在，我们想在 Persons 表中添加一个名为 DateOfBirth 的列

我们使用下面的 SQL 语句：

```sql
ALTER TABLE Persons
ADD DateOfBirth date;
```

::: tip

**请注意**：新列 DateOfBirth 的类型是 date，可以存放日期。数据类型规定列中可以存放的数据的类型。如需了解 MS Access、MySQL 和 SQL Server 中可用的数据类型，请访问我们完整的  [数据类型参考手册](https://www.runoob.com/sql/sql-datatypes.html)。

:::

现在 Persons 表将如下所示：

|      |           |           |              |           |             |
| :--- | :-------- | :-------- | :----------- | :-------- | :---------- |
| P_Id | LastName  | FirstName | Address      | City      | DateOfBirth |
| 1    | Hansen    | Ola       | Timoteivn 10 | Sandnes   |             |
| 2    | Svendson  | Tove      | Borgvn 23    | Sandnes   |             |
| 3    | Pettersen | Kari      | Storgt 20    | Stavanger |             |



### 3 改变数据类型实例

现在，我们想要改变 Persons 表中 DateOfBirth 列的数据类型。

我们使用下面的 SQL 语句;

```sql
ALTER TABLE Persons
ALTER COLUMN DateOfBirth year;
```

::: tip

**请注意**，现在 `DateOfBirth` 列的类型是 year，可以存放 2 位或 4 位格式的年份。

:::



### 4 DROP COLUMN 实例

接下来，我们想要删除 Persons 表中的 DateOfBirth 列。

我们使用下面的 SQL 语句：

```sql
ALTER TABLE Persons
DROP COLUMN DateOfBirth;
```

现在，`Persons` 表将如下所示：

| P_Id | LastName  | FirstName | Address      | City      |
| :--- | :-------- | :-------- | :----------- | :-------- |
| 1    | Hansen    | Ola       | Timoteivn 10 | Sandnes   |
| 2    | Svendson  | Tove      | Borgvn 23    | Sandnes   |
| 3    | Pettersen | Kari      | Storgt 20    | Stavanger |



## SQL AUTO INCREMENT 字段

::: tip

Auto-increment 会在新纪录插入表中时生成一个唯一的数字。

`AUTO INCREMENT 字段`

我们通常希望在每次插入新纪录时，自动地创建著字段的值。

我们可以在表中创建一个 auto-increment 字段。

:::

### 1 用于 MySQL 的语法

下面的 SQL 语句把 Persons 表中的 ID 列定义为 auto-increment 主键字段：

```sql
CREATE TABLE Persons (
    ID int NOT NULL AUTO_INCREMENT,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Address VARCHAR(255),
    PRIMARY KEY (ID)
);
```

MySQL 使用 `AUTO_INCREMENT` 关键字来执行 auto-increment 任务。

默认地，`AUTO_INCREMENT` 的开始值是 1 ，每条新纪录递增 1.

要让 `AUTO_INCREMENT` 序列以其他的值起始，请使用下面的 SQL 语法：

```sql
ALTER TABLE Persons AUTO_INCREMENT=100;
```

要在 Persons 表中插入新纪录，我们不必为 ID 列规定值（会自动添加一个唯一的值）：

```sql
INSERT INTO Persons (FirstName,LastName)
VALUES ('Lars','Monsen');
```

上面的 SQL 语句会在 Persons 表中插入一条新纪录，ID 列会被赋予一个唯一的值。FirstName 列会被设置为 Lars，LastName 列会被设置为 Monsen 。



### 2 用于 SQL Server 的语法

下面的 SQL 语句把 Persons 表中的 ID 列定义为 auto-increment 主键字段：

```sql
CREATE TABLE Persons (
    ID int IDENTITY(1,1) PRIMARY KEY,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255)
);
```

MS SQL Server 使用 IDENTITY 关键字来执行 auto-increment 任务。

在上面的实例中，IDENTITY 的开始值是 1 ，每条新纪录递增 1 。

::: tip

**提示**：要规定 ID 列以 10 起始且递增 5 ，请把 Identity 改为 IDENTITY(10,5) 。

:::

要在 Persons 表中插入新纪录，我们不必为 ID 列规定值（会自动添加一个唯一的值）：

```sql
INSERT INTO Persons (FirstName,LastName)
VALUES ('Lars','Monsen');
```

上面的 SQL 语句会在 Persons 表中插入一条新纪录。ID 列会被赋予一个唯一的值。FirstName 列会被设置为 Lars，LastName 列会被设置为 Monsen。



### 3 用于 Access 的语法

下面的 SQL 语句把 Persons 表中的 ID 列定义为 auto-increment 主键字段：

```sql
CREATE TABLE Persons (
    ID Integer PRIMARY KEY AUTOINCREMENT,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255)
);
```

MS Access 使用 `AUTOINCREMENT` 关键字来执行 auto-increment 任务。

```sql
CREATE TABLE Persons (
    ID Integer PRIMARY KEY AUTOINCREMENT,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255)
);
```

MS Access 使用 AUTOINCREMENT 关键字来执行 auto-increment 任务。

默认地，AUTOINCREMENT 的开始值是 1 ，每条新纪录递增 1 。

::: tip

**提示**：要规定 ID 列以 10 起始且递增 5，请把 autoincrement 改为 AUTOINCREMENT(10,5)。

:::

要在 Persons 表中插入新纪录，我们不必为 ID 列规定值（会自动添加一个唯一的值）：

```sql
INSERT INTO Persons (FirstName,LastName)
VALUES ('Lars','Monsen');
```

上面的 SQL 语句会在 Persons 表中插入一条新纪录，ID 列会被赋予一个唯一的值。FirstName 列会被设置为 `Lars`，LastName 列会被设置为 `Monsen` 。



### 4 用于 Oracle 的语法

在 Oracle 中，代码稍微复杂一点。

你必须通过 sequence 对象（该对象生成数字序列）创建 auto-increment 字段。

请使用下面的 `CREATE SEQUENCE` 语法：

```sql
CREATE SEQUENCE seq_person
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10
```

上面的代码创建一个名为 seq_person 的 sequence 对象，它以 1 起始且 1 递增。该对象缓存 10 个值以提高性能。cache 选项规定了为了提高访问速度要存储多少个序列值。

要在 Persons 表中插入新纪录，我们必须使用 nextval 函数（该函数从 seq_person 序列中取回下一个值）：

```sql
INSERT INTO Persons (ID,FirstName,LastName)
VALUES (seq_person.nextval,'Lars','Monsen');
```

上面的 SQL 语句会在 Persons 表中插入一条新纪录。ID 列会被赋值为来自 seq_person 序列的下一个数字。FirstName 列会被设置为 `Lars`，LastName 列会被设置为 `Monsen` 。









































































































































































































































































































































































































