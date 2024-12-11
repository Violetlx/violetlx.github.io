---
title: SQL高级教程（四）
date: 2024/12/04
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />

## SQL 约束（Constrains）

::: tip

SQL 约束用于规定表中的数据规则。

如果存在违反约束的数据行为，行为会被约束终止。

约束可以在创建表时规定（通过 CREATE TABLE 语句），或者在表创建之后规定（通过 ALTER TABLE 语句）。

:::

### 1 CREATE TABLE + CONSTRAINT 语法

```sql
CREATE TABLE table_name(
    column_name1 data_type(size) constraint_name,
    column_name2 data_type(size) constraint_name,
    column_name2 data_type(size) constraint_name,
    ...
);
```

在 SQL 中，我们有如下约束：

- `NOT NULL`：指示某列不能存储 NULL 值
- `UNIQUE`：保证某列的每行必须有唯一的值
- `PRIMARY KEY`：NOT NULL 和 UNIQUE 的结合。确保某列（或两个列多个列的结合）有唯一标识，有助于更容易更快速地找到表中的一个特定的记录
- `FOREIGN KEY`：保证一个表中的数据匹配另一个表中的值的参照完整性
- `CHECK`：保证列中的值符合指定的条件
- `DEFAULT`：规定没有给列赋值时的默认值
- `INDEX`：用于快速访问数据库中的数据

**① NOT NULL**

确保列不能有 NULL 值

**实例**：

```sql
CREATE TABLE Students (
    StudentID INT NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    FirstName VARCHAR(50),
    Age INT
);
```



**② UNIQUE**

确保列中的所有值都是唯一的

**实例**：

```sql
CREATE TABLE Employees (
    EmployeeID INT NOT NULL UNIQUE,
    LastName VARCHAR(50) NOT NULL,
    FirstName VARCHAR(50),
    Email VARCHAR(100) UNIQUE
);
```



**③ PRIMARY KEY**

唯一标识表中的每一行记录。PRIMARY KEY 约束是 NOT NULL 和 UNIQUE 的结合。

**实例**：

```sql
CREATE TABLE Orders (
    OrderID INT NOT NULL PRIMARY KEY,
    OrderNumber INT NOT NULL,
    OrderDate DATE NOT NULL
);
```



**④ FOREIGN KEY**

确保一个表中的值匹配另一个表中的值，从而建立两表之间的关系。

**实例**：

```sql
CREATE TABLE Orders (
    OrderID INT NOT NULL PRIMARY KEY,
    OrderNumber INT NOT NULL,
    CustomerID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
```



**⑤ CHECK**

确保列中的值满足特定的条件。

**实例**：

```sql
CREATE TABLE Products (
    ProductID INT NOT NULL PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) CHECK (Price >= 0)
);
```



**⑥ DEFAULT**

为列设置默认值。

**实例**：

```sql
CREATE TABLE Customers (
    CustomerID INT NOT NULL PRIMARY KEY,
    LastName VARCHAR(50) NOT NULL,
    FirstName VARCHAR(50),
    JoinDate DATE DEFAULT GETDATE()
);
```



**⑦ INDEX**

用于快速访问数据库表中的数据。

```sql
CREATE INDEX idx_lastname ON Employees (LastName);
```



### 2 综合示例

**实例**：

```sql
CREATE TABLE Students (
    StudentID INT NOT NULL PRIMARY KEY,
    LastName VARCHAR(50) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    Age INT CHECK (Age >= 18),
    Email VARCHAR(100) UNIQUE,
    EnrollmentDate DATE DEFAULT GETDATE()
);
```

::: tip

通过这些约束，数据库管理系统能够确保数据的一致性、完整性和准确性。

:::



## SQL NOT NULL 约束

::: tip

在默认的情况下，表的列接受 NULL 值。

:::

### 1 SQL NOT NULL 约束

- NOT NULL 约束强制不接受 NULL 值
- NOT NULL 约束强制字段始终包含值。这意味着，如果不向字段添加值，就无法插入新纪录或者更新记录。

下面的 SQL 强制 `ID` 列、`LastName` 列以及 `FirstName` 列不接受 NULL 值：

**实例**：

```sql
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255) NOT NULL,
    Age int
);
```



### 2 添加 NOT NULL 约束

在一个已创建的表 Age 字段中添加 NOT NULL 约束如下所示：

**实例**：

```sql
ALTER TABLE Persons
MODIFY Age int NOT NULL;
```



### 3 删除 NOT NULL 约束

在一个已创建的表的 Age 字段中删除 NOT NULL 约束如下所示：

**实例**：

```sql
ALTER TABLE Persons
MODIFY Age int NULL;
```





## SQL UNIQUE 约束

::: tip

`UNIQUE` 约束在 SQL 中用于确保一列或多列中的所有值都是唯一的，这意味着在约束应用的列中不能有重复的值。

`UNIQUE` 类似于主键（`PRIMARY KEY`） 约束，但 UNIQUE 约束允许列中的值为 NULL，而主键不允许。

`PRIMARY KEY` 约束自带唯一性（`UNIQUE`）约束功能。

每个表可以有多个 UNIQUE 约束，但只能定义一个 PRIMARY KEY 约束。

**使用场景**

- 确保唯一性：例如，确保电子邮件地址、用户名等字段在整个表中是唯一的。
- 在多列上应用：可以在多列上创建 UNIQUE 约束，以确保组合值得唯一性。

:::



### 1 CREATE TABLE 时得 SQL UNIQUE 约束

在创建表时，可以在特定列或多个列上定义 UNIQUE 约束，以确保这些列中得值在表内唯一。

在 `Persons` 表得 P_Id 列上添加 `UNIQUE` 约束

**① MySQL**

```sql
CREATE TABLE Persons (
    P_Id INT NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255),
    UNIQUE (P_Id)
);
```

**② SQL Server / Oracle / MS Access**

```sql
CREATE TABLE Persons (
    P_Id INT NOT NULL UNIQUE,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255)
);
```

**③ UNIQUE 约束并在多列上定义**

如需为 UNIQUE 约束指定名称，并在多个列上应用，可以使用以下语法

`MySQL / SQL Server / Oracle / MS Access`

```sql
CREATE TABLE Persons (
    P_Id INT NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255),
    CONSTRAINT uc_PersonID UNIQUE (P_Id,LastName)
);
```



### 2 在 ALTER TABLE 时添加 UNIQUE 约束

如果表已存在，可以使用 ALTER TABLE 语句在指定列上添加 UNIQUE 约束。

在 P_Id 列上添加 UNIQUE 约束

**MySQL / SQL Server / Oracle / MS Access：**

```sql
ALTER TABLE Persons
ADD UNIQUE (P_Id);
```

命名 UNIQUE 约束并在多列上应用

如需命名 UNIQUE 约束，并定义多个列的 UNIQUE 约束，请使用下面的 SQL 语法：

**MySQL / SQL Server / Oracle / MS Access：**

```sql
ALTER TABLE Persons
ADD CONSTRAINT uc_PersonID UNIQUE (P_Id,LastName);
```



### 3 删除 UNIQUE 约束

如果需要移除一个 UNIQUE 约束，可以使用以下 SQL 语句：

**① MySQL**

```sql
ALTER TABLE Persons
DROP INDEX uc_PersonID;
```

**② SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
DROP CONSTRAINT uc_PersonID;
```



## SQL PRIMARY KEY 约束

::: tip

PRIMARY KEY 约束唯一标识数据库表中的每条记录。

PRIMARY KEY 必须包含唯一的值，且不能包含 NULL 值。

每个表只能有一个 PRIMARY KEY ，该主键可以由单个列或多个列组成。

:::



### 1 CREATE TABLE 时的 SQL PRIMARY KEY 约束

下面的 SQL 在 Persons 表创建时在 P_Id 列上创建 PRIMARY KEY 约束：

**① MySQL**

```sql
CREATE TABLE Persons (
    P_Id int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255),
    PRIMARY KEY (P_Id)
);
```

**②  SQL Server / Oracle / Access**

```sql
CREATE TABLE Persons (
    P_Id int NOT NULL PRIMARY KEY,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
```

如需命名 PRIMARY KEY 约束，并定义多个列的 PRIMARY KEY 约束，请使用下面的 SQL 语法：

**③ MySQL / SQL Server / Oracle / MS Access**

```sql
CREATE TABLE Persons (
    P_Id int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255),
    CONSTRAINT pk_PersonID PRIMARY KEY (P_Id,LastName)
);
```

::: tip

**注释**：在上面的实例中，只有一个主键 PRIMARY KEY (pk_PersonID) 。然而，pk_PersonID 的值是由两个列（P_Id 和 LastName） 组成的。

:::



### 2 ALTER TABLE 时的 SQL PRIMARY KEY 约束

当表已被创建时，如需在 `P_Id` 列创建 PRIMARY KEY 约束，请使用下面的 SQL ：

**MySQL / SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
ADD PRIMARY KEY (P_Id);
```

如需命名 PRIMARY KEY 约束，并定义多个列的 PRIMARY KEY 约束，请使用下面的 SQL 语法：

**MySQL / SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
ADD CONSTRAINT pk_PersonID PRIMARY KEY (P_Id,LastName);
```

::: tip

**注释**：如果你使用 ALTER TABLE 语句添加主键，必须把主键列声明为不包含 NULL 值（在表首次创建时）。

:::



### 3 撤销 PRIMARY KEY 约束

如需撤销 PRIMARY KEY 约束，请使用下面的 SQL：

**① MySQL**

```sql
ALTER TABLE Persons
DROP PRIMARY KEY;
```

**② SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
DROP CONSTRAINT pk_PersonID;
```





## SQL FOREIGN KEY 约束

### 1 SQL FOREIGN KEY 约束

一个表中的 `FOREIGN KEY` 指向另一个表中 `UNIQUE KEY` （唯一约束的键）。

让我们通过一个实例来解释外键。请看下面两个表：

`Persons` 表：

| P_Id | LastName  | FirstName | Address      | City      |
| :--- | :-------- | :-------- | :----------- | :-------- |
| 1    | Hansen    | Ola       | Timoteivn 10 | Sandnes   |
| 2    | Svendson  | Tove      | Borgvn 23    | Sandnes   |
| 3    | Pettersen | Kari      | Storgt 20    | Stavanger |

`Orders` 表：

| O_Id | OrderNo | P_Id |
| :--- | :------ | :--- |
| 1    | 77895   | 3    |
| 2    | 44678   | 3    |
| 3    | 22456   | 2    |
| 4    | 24562   | 1    |

**请注意**：Orders 表中的 P_Id 列指向 Persons 表中的 P_Id 列。

Persons 表中的 P_Id 列是 Persons 表中的 PRIMARY KEY 。

Orders 表中的 P_Id 列是 Orders 表中的 FOREIGN KEY。

FOREIGN KEY 约束用于预防破坏表之间连接的行为。

FOREIGN KEY 约束也能防止非法数据插入外键列，因为它必须是指向它的那个表中的值之一。



### 2 CREATE TABLE 时的 SQL FOREIGN KEY 约束

下面的 SQL 在 Orders 表创建时在 P_Id 列上创建 FOREIGN KEY 约束：

**① MySQL**

```sql
CREATE TABLE Orders (
    O_Id int NOT NULL,
    OrderNo int NOT NULL,
    P_Id
);
```

**② SQL Server / Oracle / MS Access**

```sql
CREATE TABLE Orders (
    O_Id int NOT NULL PRIMARY KEY,
    OrderNO int NOT NULL,
    P_Id int FOREIGN KEY REFERENCES Persons(P_Id)
);
```

如需命名 FOREIGN KEY 约束，并定义多个列的 FOREIGN KEY 约束，请使用下面的 SQL 语法：

**③ MySQL / SQL Server / Oracle / MS Access**

```sql
CREATE TABLE Orders (
    O_Id int NOT NULL,
    OrderNO int NOT NULL,
    P_Id int,
    PRIMARY KEY (O_Id),
    CONSTRAINT fk_PerOrders FOREIGN KEY (P_Id)
    REFERENCES Persons(P_Id)
);
```



### 3 ALTER TABLE 时的 SQL FOREIGN KEY 约束

当 Orders 表已被创建时，如需在 P_Id 列创建 FOREIGN KEY 约束，请使用下面的 SQL：

**① MySQL / SQL Server / Oracle /MS Access**

```sql
ALTER TABLE Orders
ADD FOREIGN KEY (P_Id)
REFERENCES Persons(P_Id);
```

如需命名 FOEIGN KEY 约束，并定义多个列的 FOREIGN KEY 约束，请使用下面的 SQL 语法：

**② MySQL / SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Orders
ADD CONSTRAINT fk_PerOrders
FOREIGN KEY (P_Id)
REFERENCES Persons(P_Id);
```



### 4 撤销 FOREIGN KEY 约束

如需撤销 FOREIGN KEY 约束，请使用下面的 SQL：

**① MySQL**

```sql
ALTER TABLE Orders
DROP FOREIGN KEY fk_PerOrders;
```

**② SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Orders
DROP CONSTRAINT fk_PerOrders;
```



## SQL CHECK 约束

::: tip

CHECK 约束用于限制列中的值的范围。

如果对单个列定义 CHECK 约束，那么该列只允许特定的值。

如果对一个表定义 CHECK 约束，那么此约束会基于行中其他列的值在特定的列中对值进行限制。

:::

### 1 CREATE TABLE 时的 SQL CHECK 约束

**① MySQL**

```sql
CREATE TABLE Persons (
    P_Id int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Address varchar(255),
    CHECK (P_Id>0)
);
```

**② SQL Server / Oracle / MS Access**

```sql
CREATE TABLE Persons (
    P_Id int NOT NULL CHECK (P_Id>0),
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
```

如需命名 CHECK 约束，并定义多个列的 CHECK 约束，请使用下面的 SQL 语法：

**③ MySQL / SQL Server / Oracle / MS Access**

```sql
CREATE TABLE Persons (
    P_Id int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255),
    CONSTRAINT chk_Person CHECK (P_Id>0 AND City='Sandnes')
);
```



### 2 ALTER TABLE 时的 SQL CHECK 约束

当表已被创建时，如需在 `P_Id` 列创建 CHECK 约束，请使用下面的 SQL：

**① MySQL / SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
ADD CHECK (P_Id>0);
```

如需命名 CHECK 约束，并定义多个列的 CHECK 约束，请使用下面的 SQL 语法：

**② MySQL / SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
ADD CONSTRAINT chk_Person CHECK (P_Id>0 AND City='Sandnes');
```



### 3 撤销 CHECK 约束

如需撤销 CHECK 约束，请使用下面的 SQL：

**① SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
DROP CONSTRAINT chk_Person;
```

**② MySQL**

```sql
ALTER TABLE Persons
DROP CHECK chk_Person;
```



## SQL DEFAULT 约束

::: tip

DEFAULT 约束用于向列中插入默认值。

如果没有规定其他的值，那么将会将默认值添加到所有的新纪录。

:::

### 1 CREATE TABLE 时的 SQL DEFAULT 约束

下面的 SQL 在 Persons 表创建时在 City 列上创建 DEFAULT 约束：

**MySQL / SQL Server / Oracle / MS Access**

```sql
CREATE TABLE Persons (
    P_Id int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Address varchar(255),
    City varcahr(255) DEFAULT 'Sandenes'
);
```

通过类似 GETDATE() 这样的函数，DEFAULT 约束也可以用于插入系统值：

```sql
CREATE TABLE Orders (
    O_Id int NOT NULL,
    OrderNo int NOT NULL,
    P_Id int,
    OrderDate date DEFAULT GETDATE()
);
```



### 2 ALTER TABLE 时的 SQL DEFAULT 约束

当表已被创建时，如需再 City 列创建 DEFAULT 约束，请使用下面的 SQL

**① MySQL**

```sql
ALTER TABLE Persons
ALTER City SET DEFAULT 'SANDNES';
```

**② SQL Server / MS Access**

```sql
ALTER TABLE Persons
ADD CONSTRAINT ab_c DEFAULT 'SANDNES' for City;
```

**③ Oracle**

```sql
ALTER TABLE Persons
MODIFY City DEFAULT 'SANDNES';
```



### 3 撤销 DEFAULT 约束

如需撤销 DEFAULT 约束，请使用下面的 SQL：

**① MySQL**

```sql
ALTER TABLE Persons
ALTER City DROP DEFAULT;
```

**② SQL Server / Oracle / MS Access**

```sql
ALTER TABLE Persons
ALTER COLUMN City DROP DEFAULT;
```
