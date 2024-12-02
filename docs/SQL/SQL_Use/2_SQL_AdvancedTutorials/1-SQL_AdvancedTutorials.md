---
title: SQL高级教程
date: 2024/11/26
---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />

## SQL  SELECT  TOP /LIMIT/ROWNUM 子句

SELECT TOP 语句用于在 SQL 中限制返回的结果集中的行数，它通常用于只需要查询前几行数据的情况，尤其在数据集非常大时，可以显著提高查询性能。

SELECT TOP 子句对于拥有数千条记录的大型表来说，是非常有用的。

说明：

- SELECT TOP 在 SQL Server 和 MS Access 中使用，而在 MySQL 和 PostgreSQL 中使用 LIMIT 关键字。
- Oracle 在 12c 版本之前没有直接等效的关键字，可以通过 ROWNUM 实现类似功能，但在 12c 及以上的版本中引入了 FETCH FIRST 。
- 当使用 TOP 或 LIMIT 时，最好结合 ORDER BY 子句，以确保返回的行是特定顺序的前几行。

### SQL Server / MS Access  语法

```sql
SELECT TOP number|percent column1,column2,...
FROM table_name;
```

`number|percent`：指定返回的行数或百分比

- `number`：具体的行数
- `percent`：数据集的百分比

### MySQL 语法

```sql
SELECT column1,column2,...
FROM table_name
LIMIT number;
```

### Oracle 语法

```sql
SELECT column1,column2,...
FROM table_name
FETCH FIRST number ROWS ONLY;
```

### PostgreSQL 语法

```sql
SELECT column1,column2,...
FROM table_name
LIMIT number;
```

### 实例

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

   



























































































































































































































































