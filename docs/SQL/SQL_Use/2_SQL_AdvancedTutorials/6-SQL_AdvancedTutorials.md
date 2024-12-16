---
title: SQL高级教程（六）
date: 2024/12/13
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />

## SQL 视图（Views）

::: tip

视图是可视化的表。

:::

### 1 SQL CREATE VIEW 语句

在 SQL 中，视图是基于 SQL 语句的额结果集的可视化的表。

视图包含行和列，就像一个真实的表。视图中的字段就是来自一个或多个数据库中的真实的表中的字段。

你可以向视图添加 SQL 函数、WHERE 以及 JOIN 语句，也可以呈现数据，就像这些数据来自于某个单一的表一样。



**SQL CREATE VIEW 语法**

```sql
CREATE VIEW view_name AS
SELECT column1,column2,...
FROM table_name
WHERE condition;
```

**参数说明**：

- `CREATE VIEW`：声明你要创建一个视图。
- `view_name`：指定视图的名称
- `AS`：指定关键字，表示视图的定义开始。
- `SELECT column1,column2,...`：指定视图中包含的列，可以是表中的列或计算列。
- `FROM table_name`：指定视图从哪个表中获取数据。
- `WHERE condition`：可选部分，用于指定筛选条件，限制视图中的行。

::: tip

**注释**：视图总是显示最新的数据！每当用户查询视图时，数据库引擎通过使用视图的 SQL 语句重建数据。

:::



### 2 SQL CREATE VIEW 实例

假设你有一个包含员工信息的表 employees，包括以下列：employee_id、first_name、last_name、satary 和 department_id，现在，我们将创建一个视图，显示工资高于某个阈值的员工信息。

实例如下：

```sql
-- 创建包含高工资员工信息的视图
CREATE VIEW hign_salary_employees AS
SELECT employee_id,first_name,last_name,salary
FROM employees
WHERE salary > 50000;
```

在这个例子中，我们创建了一个名为 hign_salary_employees 的视图，该视图包含了那些工资高于 50000 的员工的信息。

现在，你可以像查询普通表一样使用这个视图：

```sql
-- 查询高工资员工视图
SELECT *
FROM high_salary_employees;
```

这将返回所有工资高于 50000 的员工的详细信息，而不需要每次都填写相同的筛选条件。

值得注意的是，视图本质上是一个虚拟的表，它并不存储数据，而是基于基础表的查询结果生成。因此，如果基础表的数据发生变化，视图的内容也会相应地更新。



### 3 SQL 更新视图

在 SQL 中，你不能直接使用 UPDATE 语句来更新视图，因为视图是基于查询结果生成的虚拟表，而不是实际存储数据的表。

更新视图的实质是通过更新视图所基于的表中的数据，然后视图会反映这些变化。

```sql
UPDATE table_name
SET column1 = value1,column2 = value2, ...
WHERE condition;
```

其中 table_name 是基础表的名称，`column1,column2,...`是要更新的列，`value1,value2,...` 是新的值，condition 是更新的条件。

现在，我们希望向 `Current Product List` 视图添加 Category 列。我们将通过下列 SQL 更新视图：

举例来说，如果你有一个名为 high_salary_employees 的视图，显示工资高于 50000 的员工信息，而这个视图基于 employees 表的查询结果，你可以通过以下步骤来更新数据：

```sql
-- 步骤 1：更新 employees 表中的数据
UPDATE employees
SET salary = 60000
WHERE employee_id = 1001;

-- 步骤 2：查询更新后的高工资员工视图
SELECT *
FROM high_salary_employees;
```

这样，你更新了 employees 表中的数据，而视图 high_salary_employees 将反映出这些变化。



### 4 SQL 撤销视图

在 SQL 中，撤销（或删除）视图是通过使用 DROP VIEW 语句来实现。

DROP VIEW 语句用于从数据库中删除一个已存在的视图。语法如下：

```sql
DROP VIEW [IF EXISTS] view_name;
```

**参数说明**：

- `DROP VIEW`：表示你要删除一个视图。
- `IF EXISTS`：可选部分，用于检查视图是否存在。如果存在，则执行删除操作；如果不存在，不会发生错误。在某些数据库系统中，这是可选的。
- `view_name`：指定要删除的视图的名称。

在执行以下语句后，视图 high_salary_employees 将被从数据库中删除。

```sql
-- 删除名为 high_salary_employees 的视图
DROP VIEW IF EXISTS high_salary_employees;
```

请注意，这并不影响基础表中的数据，只是删除了视图的定义。

如果你需要撤销或删除某个表中的数据，应该使用 DROP TABLE 语句。

在使用 DROP VIEW 语句时，请确保你真的想要删除该视图，因为一旦删除，将无法恢复视图的定义。



## SQL Date 函数

::: tip

**SQL 日期（Dates）**

💡当我们处理日期时，最难的任务恐怕是确保所插入的日期的格式，与数据库中日期列的格式相匹配。

只要你的数据包含的只是日期部分，运行查询就不会出现问题。但是，如果涉及时间部分，情况就有点复杂了。

在讨论日期查询的复杂性之前，我们先来看看最重要的内建日期处理函数。

:::

### 1 MySQL Date 函数

下面的表格列出了 MySQL 中最重要的内建日期函数：

| 函数                                                         | 描述                                |
| :----------------------------------------------------------- | :---------------------------------- |
| [NOW()](https://www.runoob.com/sql/func-now.html)            | 返回当前的日期和时间                |
| [CURDATE()](https://www.runoob.com/sql/func-curdate.html)    | 返回当前的日期                      |
| [CURTIME()](https://www.runoob.com/sql/func-curtime.html)    | 返回当前的时间                      |
| [DATE()](https://www.runoob.com/sql/func-date.html)          | 提取日期或日期/时间表达式的日期部分 |
| [EXTRACT()](https://www.runoob.com/sql/func-extract.html)    | 返回日期/时间的单独部分             |
| [DATE_ADD()](https://www.runoob.com/sql/func-date-add.html)  | 向日期添加指定的时间间隔            |
| [DATE_SUB()](https://www.runoob.com/sql/func-date-sub.html)  | 从日期减去指定的时间间隔            |
| [DATEDIFF()](https://www.runoob.com/sql/func-datediff-mysql.html) | 返回两个日期之间的天数              |
| [DATE_FORMAT()](https://www.runoob.com/sql/func-date-format.html) | 用不同的格式显示日期/时间           |



### 2 SQL Server Date 函数

下面的表格列出了 SQL Server 中最重要的内建日期函数：

| 函数                                                        | 描述                             |
| :---------------------------------------------------------- | :------------------------------- |
| [GETDATE()](https://www.runoob.com/sql/func-getdate.html)   | 返回当前的日期和时间             |
| [DATEPART()](https://www.runoob.com/sql/func-datepart.html) | 返回日期/时间的单独部分          |
| [DATEADD()](https://www.runoob.com/sql/func-dateadd.html)   | 在日期中添加或减去指定的时间间隔 |
| [DATEDIFF()](https://www.runoob.com/sql/func-datediff.html) | 返回两个日期之间的时间           |
| [CONVERT()](https://www.runoob.com/sql/func-convert.html)   | 用不同的格式显示日期/时间        |



### 3 SQL Date 数据类型

`MySQL` 使用下列数据类型在数据库中存储日期或日期/时间值：

- `DATE` - 格式：`YYYY-MM-DD`
- `DATETIME` - 格式：`YYYY-MM-DD HH:MM:SS`
- `TIMESTAMP` - 格式：`YYYY-MM-DD HH:MM:SS`
- `YEAR` - 格式：`YYYY` 或 `YY`

`SQL Server` 使用下列数据类型在数据库中存储日期或日期/时间值：

- `DATE` - 格式：`YYYY-MM-DD`
- `DATETIME` - 格式：`YYYY-MM-DD HH:MM:SS`
- `SMALLDATETIME` - 格式：`YYYY-MM-DD HH:MM:SS`
- `TIMESTAMP` - 格式：唯一的数字

::: tip

**注释**：当你在数据库中创建一个新表时，需要为列选择数据类型！[数据类型参考手册](https://www.runoob.com/sql/sql-datatypes.html)

:::



### 4 SQL 日期处理

::: tip

💡如果不涉及时间部分，那么我们可以轻松地比较两个日期！

:::

假设我们有如下 `Orders` 表：

| OrderId | ProductName            | OrderDate  |
| :------ | :--------------------- | :--------- |
| 1       | Geitost                | 2008-11-11 |
| 2       | Camembert Pierrot      | 2008-11-09 |
| 3       | Mozzarella di Giovanni | 2008-11-11 |
| 4       | Mascarpone Fabioli     | 2008-10-29 |

现在，我们希望从上表中选取 `OrderDate` 为 `2008-11-11` 的记录。

我们使用下面的 SELECT 语句：

```sql
SELECT * FROM Orders WHERE OrderDate='2008-11-11';
```

结果集如下所示：

| OrderId | ProductName            | OrderDate  |
| :------ | :--------------------- | :--------- |
| 1       | Geitost                | 2008-11-11 |
| 3       | Mozzarella di Giovanni | 2008-11-11 |

现在，假设 Orders 表如下所示（请注意 OrderDate 列中的时间部分）：

| OrderId | ProductName            | OrderDate           |
| :------ | :--------------------- | :------------------ |
| 1       | Geitost                | 2008-11-11 13:23:44 |
| 2       | Camembert Pierrot      | 2008-11-09 15:45:21 |
| 3       | Mozzarella di Giovanni | 2008-11-11 11:12:01 |
| 4       | Mascarpone Fabioli     | 2008-10-29 14:56:59 |

如果我们使用和上面一样的 SELECT 语句：

```sql
SELECT * FROM Orders WHERE OrderDate='2008-11-11';
或
SELECT * FROM Orders WHERE OrderDate='2008-11-11 00:00:00';
```

那么我们将得不到结果！因为表中没有 `2008-11-11 00:00:00` 日期。如果没有时间部分，默认时间为 00:00:00。

::: tip

**提示**：如果你希望使查询简单且更易维护，那么请不要在日期中使用时间部分！

:::



## SQL NULL 值

::: tip

NULL 值代表遗漏的未知数据。

默认地，表的列可以存放 NULL 值。

:::

### 1 SQL NULL 值

如果表中的某个列是可选的，那么我们可以在不向该列添加值得情况下插入新纪录或更新已有得记录。这意味着该字段将以 NULL 值保存。

NULL 值得处理方式与其他值不同。

NULL 用作未知的或不适用的值的占位符。

::: tip

💡注释：无法比较 NULL 和 0；他们是不等价的。

:::



### 2 SQL 的 NULL 值处理

请看下面的 Persons 表：

| P_Id | LastName  | FirstName | Address   | City      |
| :--- | :-------- | :-------- | :-------- | :-------- |
| 1    | Hansen    | Ola       |           | Sandnes   |
| 2    | Svendson  | Tove      | Borgvn 23 | Sandnes   |
| 3    | Pettersen | Kari      |           | Stavanger |

假如 Persons 表中的 Address 列是可选的。这意味着如果在 Address 列插入一条不带值得记录，"Address" 列会使用 NULL 值保存。

那么我们如何测试 NULL 值呢？

无法使用比较运算符来测试 NULL 值，比如=、< 或 <>

我们必须使用 IS NULL 和 IS NOT NULL 操作符。



### 3 SQL IS NULL

我们如何仅仅选取在 Address 列中带有 NULL 值的记录呢？

我们必须使用 IS NULL 操作符：

```sql
SELECT LastName,FirstName,Address FROM Persons
WHERE Address IS NULL
```

结果集如下所示：

| LastName  | FirstName | Address |
| :-------- | :-------- | :------ |
| Hansen    | Ola       |         |
| Pettersen | Kari      |         |

::: tip

💡**提示**：请始终使用 IS NULL 来查找 NULL 值。

:::



### 4 SQL IS NOT NULL

我们如何仅仅选取在 Address 列中不带有 NULL 值得记录呢？

我们必须使用 IS NOT NULL 操作符：

```sql
SELECT LastName,FirstName,Address FROM Persons
WHERE Address IS NOT NULL;
```

结果集如下所示：

| LastName | FirstName | Address   |
| :------- | :-------- | :-------- |
| Svendson | Tove      | Borgvn 23 |





## SQL NULL 函数

### SQL ISNULL()、NVL()、IFNULL() 和 COALESCE() 函数

请看下面得 Products 表：

| P_Id | ProductName | UnitPrice | UnitsInStock | UnitsOnOrder |
| :--- | :---------- | :-------- | :----------- | :----------- |
| 1    | Jarlsberg   | 10.45     | 16           | 15           |
| 2    | Mascarpone  | 32.56     | 23           |              |
| 3    | Gorgonzola  | 15.67     | 9            | 20           |

假如 UnitsOnOrder 是可选的，而且可以包含 NULL 值。

我们使用下面的 SELECT 语句：

```sql
SELECT ProductName,UnitPrice*(UnitsInstock+UnitsOnOrder)
FROM Products;
```

在上面的实例中，如果有 UnitsOnOrder 值是 NULL，那么结果是 NULL。

微软的 ISNULL() 函数用于规定如何处理 NULL 值。

NVL()、IFNUL() 和 COALESCE() 函数也可以达到相同的结果。

在这里，我们希望 NULL 值为 0 。

下面，如果 UnitsOnOrder 是 NULL，则不会影响计算，因为如果值是 NULL 则 ISNULL() 返回 0 。

**① SQL Server / MS Access**

```sql
SELECT ProductName,UnitPrice*(UnitsInStock+ISNULL(UnitsOnOrder,0))
FROM Products;
```

**② Oracle**

Oracle 没有 ISNULL() 函数。不过，我们可以使用 NVL() 函数达到相同的结果：

```sql
SELECT ProductName,UnitPrice*(UnitsInstock+NVL(UnitsOnOrder,0))
FROM Products;
```

**③ MySQL**

MySQL 也拥有类似 ISNULL() 函数。不过，他们的工作方式与微软的 ISNULL() 函数有点不同。

在 MySQL 中，我们可以使用 IFNULL() 函数，如下所示：

```sql
SELECT PriductName,UnitPrice*(UnitsInStock+IFNULL(UnitsOnOrder,0))
FROM Products;
```

或者我们可以使用 COALESCES() 函数，如下所示：

```sql
SELECT ProductName,UnitPrice*(UnitsInStock+COALESCE(UnitsOnOrder,0))
FROM Products;
```





## SQL 通用数据类型

::: tip

数据类型定义列中存放的值的种类。

:::

### 1 SQL 通用数据类型

数据库表中的每个列都要求有名称和数据类型。

`Each column in a database table is required to have a name and a data type.`

SQL 开发人员必须在创建 SQL 表时决定表中每个列将要存储的数据的类型。数据类型是一个标签，是便于 SQL 了解每个列期望存储什么类型的数据的指南，它也标识了 SQL 如何与存储的数据进行交互。

下面的表格列出了 SQL 中通用的数据类型：

| 数据类型                           | 描述                                                         |
| :--------------------------------- | :----------------------------------------------------------- |
| CHARACTER(n)                       | 字符/字符串。固定长度 n。                                    |
| VARCHAR(n) 或 CHARACTER VARYING(n) | 字符/字符串。可变长度。最大长度 n。                          |
| BINARY(n)                          | 二进制串。固定长度 n。                                       |
| BOOLEAN                            | 存储 TRUE 或 FALSE 值                                        |
| VARBINARY(n) 或 BINARY VARYING(n)  | 二进制串。可变长度。最大长度 n。                             |
| INTEGER(p)                         | 整数值（没有小数点）。精度 p。                               |
| SMALLINT                           | 整数值（没有小数点）。精度 5。                               |
| INTEGER                            | 整数值（没有小数点）。精度 10。                              |
| BIGINT                             | 整数值（没有小数点）。精度 19。                              |
| DECIMAL(p,s)                       | 精确数值，精度 p，小数点后位数 s。例如：decimal(5,2) 是一个小数点前有 3 位数，小数点后有 2 位数的数字。 |
| NUMERIC(p,s)                       | 精确数值，精度 p，小数点后位数 s。（与 DECIMAL 相同）        |
| FLOAT(p)                           | 近似数值，尾数精度 p。一个采用以 10 为基数的指数计数法的浮点数。该类型的 size 参数由一个指定最小精度的单一数字组成。 |
| REAL                               | 近似数值，尾数精度 7。                                       |
| FLOAT                              | 近似数值，尾数精度 16。                                      |
| DOUBLE PRECISION                   | 近似数值，尾数精度 16。                                      |
| DATE                               | 存储年、月、日的值。                                         |
| TIME                               | 存储小时、分、秒的值。                                       |
| TIMESTAMP                          | 存储年、月、日、小时、分、秒的值。                           |
| INTERVAL                           | 由一些整数字段组成，代表一段时间，取决于区间的类型。         |
| ARRAY                              | 元素的固定长度的有序集合                                     |
| MULTISET                           | 元素的可变长度的无序集合                                     |
| XML                                | 存储 XML 数据                                                |



### 2 SQL 数据类型快速参考手册

然而，不同的数据库对数据类型定义提供不同的选择。

下面的表格显示了各种不同数据库平台上一些数据类型的通用名称：

| 数据类型            | Access                  | SQLServer                                            | Oracle           | MySQL       | PostgreSQL       |
| :------------------ | :---------------------- | :--------------------------------------------------- | :--------------- | :---------- | :--------------- |
| *boolean*           | Yes/No                  | Bit                                                  | Byte             | N/A         | Boolean          |
| *integer*           | Number (integer)        | Int                                                  | Number           | Int Integer | Int Integer      |
| *float*             | Number (single)         | Float Real                                           | Number           | Float       | Numeric          |
| *currency*          | Currency                | Money                                                | N/A              | N/A         | Money            |
| *string (fixed)*    | N/A                     | Char                                                 | Char             | Char        | Char             |
| *string (variable)* | Text (<256) Memo (65k+) | Varchar                                              | Varchar Varchar2 | Varchar     | Varchar          |
| *binary object*     | OLE Object Memo         | Binary (fixed up to 8K) Varbinary (<8K) Image (<2GB) | Long Raw         | Blob Text   | Binary Varbinary |

::: tip

💡 **注释**：在不同的数据库中，同一种数据类型可能有不同的名称。即使名称相同，尺寸和其他细节也可能不同！**请总是检查文档！**

:::





## SQL 用于各种数据库的数据类型

### 1 Microsoft Access 数据类型

| 数据类型      | 描述                                                         | 存储     |
| :------------ | :----------------------------------------------------------- | :------- |
| Text          | 用于文本或文本与数字的组合。最多 255 个字符。                |          |
| Memo          | Memo 用于更大数量的文本。最多存储 65,536 个字符。**注释：**无法对 memo 字段进行排序。不过它们是可搜索的。 |          |
| Byte          | 允许 0 到 255 的数字。                                       | 1 字节   |
| Integer       | 允许介于 -32,768 与 32,767 之间的全部数字。                  | 2 字节   |
| Long          | 允许介于 -2,147,483,648 与 2,147,483,647 之间的全部数字。    | 4 字节   |
| Single        | 单精度浮点。处理大多数小数。                                 | 4 字节   |
| Double        | 双精度浮点。处理大多数小数。                                 | 8 字节   |
| Currency      | 用于货币。支持 15 位的元，外加 4 位小数。**提示：**您可以选择使用哪个国家的货币。 | 8 字节   |
| AutoNumber    | AutoNumber 字段自动为每条记录分配数字，通常从 1 开始。       | 4 字节   |
| Date/Time     | 用于日期和时间                                               | 8 字节   |
| Yes/No        | 逻辑字段，可以显示为 Yes/No、True/False 或 On/Off。在代码中，使用常量 True 和 False （等价于 1 和 0）。**注释：**Yes/No 字段中不允许 Null 值 | 1 比特   |
| Ole Object    | 可以存储图片、音频、视频或其他 BLOBs（Binary Large OBjects）。 | 最多 1GB |
| Hyperlink     | 包含指向其他文件的链接，包括网页。                           |          |
| Lookup Wizard | 允许您创建一个可从下拉列表中进行选择的选项列表。             | 4 字节   |



### 2 MySQL 数据类型

在 MySQL 中，有三种主要的类型：Text（文本）、Number（数字）和 Date / Time（日期/时间）类型。

:::: code-group

::: code-group-item Text 类型

| 数据类型         | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| CHAR(size)       | 保存固定长度的字符串（可包含字母、数字以及特殊字符）。在括号中指定字符串的长度。最多 255 个字符。 |
| VARCHAR(size)    | 保存可变长度的字符串（可包含字母、数字以及特殊字符）。在括号中指定字符串的最大长度。最多 255 个字符。**注释：**如果值的长度大于 255，则被转换为 TEXT 类型。 |
| TINYTEXT         | 存放最大长度为 255 个字符的字符串。                          |
| TEXT             | 存放最大长度为 65,535 个字符的字符串。                       |
| BLOB             | 用于 BLOBs（Binary Large OBjects）。存放最多 65,535 字节的数据。 |
| MEDIUMTEXT       | 存放最大长度为 16,777,215 个字符的字符串。                   |
| MEDIUMBLOB       | 用于 BLOBs（Binary Large OBjects）。存放最多 16,777,215 字节的数据。 |
| LONGTEXT         | 存放最大长度为 4,294,967,295 个字符的字符串。                |
| LONGBLOB         | 用于 BLOBs (Binary Large OBjects)。存放最多 4,294,967,295 字节的数据。 |
| ENUM(x,y,z,etc.) | 允许您输入可能值的列表。可以在 ENUM 列表中列出最大 65535 个值。如果列表中不存在插入的值，则插入空值。**注释：**这些值是按照您输入的顺序排序的。可以按照此格式输入可能的值： ENUM('X','Y','Z') |
| SET              | 与 ENUM 类似，不同的是，SET 最多只能包含 64 个列表项且 SET 可存储一个以上的选择。 |

:::

::: code-group-item Number 类型

| 数据类型        | 描述                                                         |
| :-------------- | :----------------------------------------------------------- |
| TINYINT(size)   | 带符号-128到127 ，无符号0到255。                             |
| SMALLINT(size)  | 带符号范围-32768到32767，无符号0到65535, size 默认为 6。     |
| MEDIUMINT(size) | 带符号范围-8388608到8388607，无符号的范围是0到16777215。 size 默认为9 |
| INT(size)       | 带符号范围-2147483648到2147483647，无符号的范围是0到4294967295。 size 默认为 11 |
| BIGINT(size)    | 带符号的范围是-9223372036854775808到9223372036854775807，无符号的范围是0到18446744073709551615。size 默认为 20 |
| FLOAT(size,d)   | 带有浮动小数点的小数字。在 size 参数中规定显示最大位数。在 d 参数中规定小数点右侧的最大位数。 |
| DOUBLE(size,d)  | 带有浮动小数点的大数字。在 size 参数中规显示定最大位数。在 d 参数中规定小数点右侧的最大位数。 |
| DECIMAL(size,d) | 作为字符串存储的 DOUBLE 类型，允许固定的小数点。在 size 参数中规定显示最大位数。在 d 参数中规定小数点右侧的最大位数。 |

::: tip

**注意**：以上的 size 代表的并不是存储在数据库中的具体长度，如 int(4) 并不是只能存储 4 个长度的数字。

实际上 int(size) 所占多少存储空间并无任何关系。int(3)、int(4)、int(8) 在磁盘上都是占用 4 bytes 的存储空间。就是在显示给用户的方式有点不同外，int(M) 跟 int 数据类型是相同的。

例如：

1、int 的值为10 （指定 zerofill）

```sql
int（9）显示结果为000000010
int（3）显示结果为010
```

就是显示的长度不一样而已 都是占用四个字节的空间。

:::

:::

::: code-group-item Date 类型

| 数据类型    | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| DATE()      | 日期。格式：YYYY-MM-DD**注释：**支持的范围是从 '1000-01-01' 到 '9999-12-31' |
| DATETIME()  | *日期和时间的组合。格式：YYYY-MM-DD HH:MM:SS**注释：**支持的范围是从 '1000-01-01 00:00:00' 到 '9999-12-31 23:59:59' |
| TIMESTAMP() | *时间戳。TIMESTAMP 值使用 Unix 纪元('1970-01-01 00:00:00' UTC) 至今的秒数来存储。格式：YYYY-MM-DD HH:MM:SS**注释：**支持的范围是从 '1970-01-01 00:00:01' UTC 到 '2038-01-09 03:14:07' UTC |
| TIME()      | 时间。格式：HH:MM:SS**注释：**支持的范围是从 '-838:59:59' 到 '838:59:59' |
| YEAR()      | 2 位或 4 位格式的年。**注释：**4 位格式所允许的值：1901 到 2155。2 位格式所允许的值：70 到 69，表示从 1970 到 2069。 |

> *即便 DATETIME 和 TIMESTAMP 返回相同的格式，它们的工作方式很不同。在 INSERT 或 UPDATE 查询中，TIMESTAMP 自动把自身设置为当前的日期和时间。TIMESTAMP 也接受不同的格式，比如 YYYYMMDDHHMMSS、YYMMDDHHMMSS、YYYYMMDD 或 YYMMDD。

:::

::::



### 3 SQL Server 数据类型

:::: code-group

::: code-group-item String 类型

|                |                                                      |                           |
| :------------- | :--------------------------------------------------- | :------------------------ |
| 数据类型       | 描述                                                 | 存储                      |
| char(n)        | 固定长度的字符串。最多 8,000 个字符。                | Defined width             |
| varchar(n)     | 可变长度的字符串。最多 8,000 个字符。                | 2 bytes + number of chars |
| varchar(max)   | 可变长度的字符串。最多 1,073,741,824 个字符。        | 2 bytes + number of chars |
| text           | 可变长度的字符串。最多 2GB 文本数据。                | 4 bytes + number of chars |
| nchar          | 固定长度的 Unicode 字符串。最多 4,000 个字符。       | Defined width x 2         |
| nvarchar       | 可变长度的 Unicode 字符串。最多 4,000 个字符。       |                           |
| nvarchar(max)  | 可变长度的 Unicode 字符串。最多 536,870,912 个字符。 |                           |
| ntext          | 可变长度的 Unicode 字符串。最多 2GB 文本数据。       |                           |
| bit            | 允许 0、1 或 NULL                                    |                           |
| binary(n)      | 固定长度的二进制字符串。最多 8,000 字节。            |                           |
| varbinary      | 可变长度的二进制字符串。最多 8,000 字节。            |                           |
| varbinary(max) | 可变长度的二进制字符串。最多 2GB。                   |                           |
| image          | 可变长度的二进制字符串。最多 2GB。                   |                           |

:::

::: code-group-item Number 类型

| 数据类型     | 描述                                                         | 存储        |
| :----------- | :----------------------------------------------------------- | :---------- |
| tinyint      | 允许从 0 到 255 的所有数字。                                 | 1 字节      |
| smallint     | 允许介于 -32,768 与 32,767 的所有数字。                      | 2 字节      |
| int          | 允许介于 -2,147,483,648 与 2,147,483,647 的所有数字。        | 4 字节      |
| bigint       | 允许介于 -9,223,372,036,854,775,808 与 9,223,372,036,854,775,807 之间的所有数字。 | 8 字节      |
| decimal(p,s) | 固定精度和比例的数字。允许从 -10^38 +1 到 10^38 -1 之间的数字。p 参数指示可以存储的最大位数（小数点左侧和右侧）。p 必须是 1 到 38 之间的值。默认是 18。s 参数指示小数点右侧存储的最大位数。s 必须是 0 到 p 之间的值。默认是 0。 | 5-17 字节   |
| numeric(p,s) | 固定精度和比例的数字。允许从 -10^38 +1 到 10^38 -1 之间的数字。p 参数指示可以存储的最大位数（小数点左侧和右侧）。p 必须是 1 到 38 之间的值。默认是 18。s 参数指示小数点右侧存储的最大位数。s 必须是 0 到 p 之间的值。默认是 0。 | 5-17 字节   |
| smallmoney   | 介于 -214,748.3648 与 214,748.3647 之间的货币数据。          | 4 字节      |
| money        | 介于 -922,337,203,685,477.5808 与 922,337,203,685,477.5807 之间的货币数据。 | 8 字节      |
| float(n)     | 从 -1.79E + 308 到 1.79E + 308 的浮动精度数字数据。n 参数指示该字段保存 4 字节还是 8 字节。float(24) 保存 4 字节，而 float(53) 保存 8 字节。n 的默认值是 53。 | 4 或 8 字节 |
| real         | 从 -3.40E + 38 到 3.40E + 38 的浮动精度数字数据。            | 4 字节      |

:::

::: code-group-item Date 类型

| 数据类型       | 描述                                                         | 存储      |
| :------------- | :----------------------------------------------------------- | :-------- |
| datetime       | 从 1753 年 1 月 1 日 到 9999 年 12 月 31 日，精度为 3.33 毫秒。 | 8 字节    |
| datetime2      | 从 1753 年 1 月 1 日 到 9999 年 12 月 31 日，精度为 100 纳秒。 | 6-8 字节  |
| smalldatetime  | 从 1900 年 1 月 1 日 到 2079 年 6 月 6 日，精度为 1 分钟。   | 4 字节    |
| date           | 仅存储日期。从 0001 年 1 月 1 日 到 9999 年 12 月 31 日。    | 3 bytes   |
| time           | 仅存储时间。精度为 100 纳秒。                                | 3-5 字节  |
| datetimeoffset | 与 datetime2 相同，外加时区偏移。                            | 8-10 字节 |
| timestamp      | 存储唯一的数字，每当创建或修改某行时，该数字会更新。timestamp 值基于内部时钟，不对应真实时间。每个表只能有一个 timestamp 变量。 |           |

:::

::: code-group-item 其他数据类型

| 数据类型         | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| sql_variant      | 存储最多 8,000 字节不同数据类型的数据，除了 text、ntext 以及 timestamp。 |
| uniqueidentifier | 存储全局唯一标识符 (GUID)。                                  |
| xml              | 存储 XML 格式化数据。最多 2GB。                              |
| cursor           | 存储对用于数据库操作的指针的引用。                           |
| table            | 存储结果集，供稍后处理。                                     |

:::

::::























































































































































































































































