---
title: SQL使用教程（三）
date: 2024/11/26

---

<img src="https://roaringelephant.org/wp-content/uploads/sites/5/2016/03/SQL.jpg" alt="SQL" height="300" />

## SQL INSERT INTO

INSERT INTO 语句用于向表中插入新记录



### SQL INSERT INTO 语法

INSERT INTO 语句有两种可以编写形式。

第一种形式无需指定要插入数据的列名，值需要提供被插入的值即可：

```sql
INSERT INTO table_name
VALUES (value1,value2,value3,...);
```

第二种形式需要指定列名及被插入的值：

```sql
INSERT INTO table_name (column1,column2,column3,..)
VALUES (value1,value2,value3,...);
```

参数说明：

- `table_name` ：需要插入新纪录的表名
- `column1,column2,column3,..` ：需要插入的字段名
- `value1,value2,value3,...` ：需要插入的字段值。



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+
​
```



INSERT INTO 实例

假设我们要向 Websites 表中插入一个新列

我们可以使用下面的 SQL 语句

实例：

```sql
INSERT INTO Websites (name,url,alexa,country)
VALUES ('百度','https://www.baidu.com/','4','CN');
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/insert1.jpg](https://www.runoob.com/wp-content/uploads/2013/09/insert1.jpg)



> 💡   你是否注意到，我们没有向 id 字段插入任何数字？
>
> id 列是自动更新的，表中的每条记录都有一个唯一的数字



### 在指定的列插入数据

我们也可以在指定的列插入数据

下面的 SQL 语句将插入一个新行，但只是在 name、url 和 country 列插入数据 (id字段会自动更新)

实例：

```sql
INSERT INTO Websites (name,url,country)
VALUES ('stackoverflow', 'http://stackoverflow.com/', 'IND');
```

输出结果：

![ https://www.runoob.com/wp-content/uploads/2013/09/insert2.jpg](https://www.runoob.com/wp-content/uploads/2013/09/insert2.jpg)





## SQL UPDATE

UPDATE 语句用于更新表中的记录



### SQL UPDATE 语法

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

参数说明：

- `table_name` ：要修改的表的名称
- `column1,column2,...` ：要修改的字段名称，可以为多个字段
- `value1,value2,...` ：要修改的值，可以为多个值
- `condition` ：修改条件，用于指定哪些数据要修改

> 💡   请注意 SQL UPDATE 语句中的 WHERE 子句！
>
> WHERE 子句规定哪条记录或者哪些记录需要更新。如果你省略了 WHERE 子句，所有的记录都将被更新！



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+
​
```



### SQL UPDATE 实例

假设我们要把 菜鸟教程 的 alexa 排名更新为 5000，country 改为 USA

我们使用下面的 SQL 语句

实例：

```sql
UPDATE Websites 
SET alexa='5000', country='USA' 
WHERE name='菜鸟教程';
```

输出结果：

![https://www.runoob.com/wp-content/uploads/2013/09/update1.jpg](https://www.runoob.com/wp-content/uploads/2013/09/update1.jpg)



### UPDATE 警告！

在更新记录时要格外小心！在上面的实例中，如果我们省略了 WHERE 子句，如下所示：

```sql
UPDATE Websites
SET alexa='5000', country='USA'
```

执行以上代码会将 Websites 表中所有数据的 alexa 改为 5000，country 改为 USA

执行没有 WHERE 子句的 UPDATE 要慎重，再慎重。



## SQL DELETE

DELETE 语句用于删除表中的记录



SQL DELETE 语法

```sql
DELETE FROM table_name
WHERE condition;
```

参数说明：

- `table_name` ：要删除的表的名称
- `condition` ：删除条件，用于指定哪些数据要删除

> 💡   请注意 SQL DELETE 语句中的 WHERE 子句！
>
> WHERE 子句规定哪条记录或者哪些记录需要删除，如果你省略了 WHERE 子句，所有的记录都将被删除！



### 演示数据库

下面是选自 "**Websites**" 表的数据：

```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+
​
```



### SQL DELETE 实例

假设我们要从 Websites 表中删除网站名称为 Facebook 且国家为 USA 的网站

我们使用一下 SQL 语句：

实例：

```sql
DELETE FROM Websites
WHERE name = 'Facebook' AND country = 'USA';
```

输出结果：

![ https://www.runoob.com/wp-content/uploads/2013/09/BD5EFB9A-2A65-4AF8-81F3-022E051811DC.jpg](https://www.runoob.com/wp-content/uploads/2013/09/BD5EFB9A-2A65-4AF8-81F3-022E051811DC.jpg)



### 删除所有数据

你可以在不删除表的情况下，删除表中所有的行。这意味着表结构、属性、索引将保持不变：

```sql
DELETE FROM table_name;
```

> **注释**：在删除记录时要格外小心！因为你不能重来！

