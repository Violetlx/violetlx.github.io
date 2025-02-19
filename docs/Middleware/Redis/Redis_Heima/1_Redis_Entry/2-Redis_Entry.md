---
title: Redis常见命令
date: 2025/01/16
---

![鬼灭之刃小忍的蝴蝶园](https://bizhi1.com/wp-content/uploads/2025/01/demon-slayer-shinobu-kochos-butterfly-garden-desktop-wallpaper.jpg)

## Redis 常见命令

::: tip

① Redis 数据结构介绍

② Redis 通用命令

③ String 类型

④ Hash 类型

⑤ List 类型

⑥ Set 类型

⑦ SortedSet 类型

:::



## ① Redis 数据结构介绍

Redis 是典型的 key-value 数据库，key 一般是字符串，而 value 包含很多不同的数据类型：

![image-20250116170919611](images/2-Redis_Entry/image-20250116170919611.png)

Redis 为了方便我们学习，将操作不同数据类型的命令也做了分组，在官网（ [https://redis.io/commands ](https://redis.io/commands)）可以查看到不同的命令：

![image-20250116171000418](images/2-Redis_Entry/image-20250116171000418.png)

不同类型的命令称为一个 group ，我们也可以通过 help 命令查看各种不同 group 的命令：

![image-20250116172443078](images/2-Redis_Entry/image-20250116172443078.png)

接下来，我们就学习常见的五种基本数据类型的相关命令。





## ② Redis 通用命令

通用指令是部分数据类型的，都可以使用的指令，常见的有：

- `KEYS`：查看符合模板的所有 key，<font color= 'red'>不建议在生产环境设备上使用</font>
- `DEL`：删除一个指定的 key
- `EXISTS`：判断 key 是否存在
- `EXPIRE`：给一个 key 设置有效期，有效期到期时该 key 会被自动删除
- `TTL`：查看一个 key 的剩余有效期（大于0为剩余的秒数，-2为无效，-1为永久有效）

通过 help [command] 命令可以查看一个命令的具体用法，例如：

```sh
# 查看keys命令的帮助信息：
127.0.0.1:6379> help keys

KEYS pattern
summary: Find all keys matching the given pattern
since: 1.0.0
group: generic
```





## ③ String 类型

String 类型，也就是字符串类型，是 Redis 中最简单的存储类型。

其 value 是字符串，不过根据字符串的格式不同，又可以分为 3 类：

- `String`：普通字符串
- `int`：整数类型，可以做自增、自减操作
- `float`：浮点类型，可以做自增、自减操作

不管是哪种格式，底层都是字节数组形式存储，只不过是编码方式不同。字符串类型的最大空间不能超过 512m.

![image-20250116175638277](images/2-Redis_Entry/image-20250116175638277.png)



### 1 String 的常见命令

String 的常见命令有：

- `SET`：添加或者修改已经存在的一个 String 类型的键值对
- `GET`：根据 key 获取 String 类型的 value
- `MSET`：批量添加多个 String 类型的键值对
- `MGET`：根据多个 key 获取多个 String 类型的 value
- `INCR`：让一个整形 key 自增 1
- `INCRBY`：让一个整形的 key 自增并指定步长，例如 incrby num 2 让 num 值自增 2
- `INCRBYFLOAT`：让一个浮点类型的数字自增并指定步长
- `SETNX`：添加一个 String 类型的键值对，前提是这个 key 不存在，否则不执行
- `SETEX`：添加一个 String 类型的键值对，并且指定有效期

```sh
127.0.0.1:6379[5]> set name jack
OK
127.0.0.1:6379[5]> get name
"jack"
127.0.0.1:6379[5]> mset k1 v1 k2 v2 k3 v3
OK
127.0.0.1:6379[5]> mget k1 k2 k3
1) "v1"
2) "v2"
3) "v3"
127.0.0.1:6379[5]> set age 18
OK
127.0.0.1:6379[5]> incr age
(integer) 19
127.0.0.1:6379[5]> get age
"19"
127.0.0.1:6379[5]> incrby age 2
(integer) 21
127.0.0.1:6379[5]> get age
"21"
127.0.0.1:6379[5]> incrby age 2
(integer) 23
127.0.0.1:6379[5]> get age
"23"
127.0.0.1:6379[5]> set score 82.5
OK
127.0.0.1:6379[5]> get score
"82.5"
127.0.0.1:6379[5]> incrbyfloat score 12.5
"95"
127.0.0.1:6379[5]> get score
"95"
```

```sh
# setnx 类似于 set ... nx
127.0.0.1:6379[5]> help setnx

  SETNX key value
  summary: Set the value of a key, only if the key does not exist
  since: 1.0.0
  group: string

127.0.0.1:6379[5]> keys *
1) "k2"
2) "age"
3) "k3"
4) "k1"
5) "name"
6) "score"
127.0.0.1:6379[5]> setnx name lisi
(integer) 0
127.0.0.1:6379[5]> get name
"jack"
127.0.0.1:6379[5]> setnx name2 lisi
(integer) 1
127.0.0.1:6379[5]> get name2
"lisi"
127.0.0.1:6379[5]> help set

  SET key value [expiration EX seconds|PX milliseconds] [NX|XX]
  summary: Set the string value of a key
  since: 1.0.0
  group: string

127.0.0.1:6379[5]> set name wnagwu nx
(nil)
127.0.0.1:6379[5]> get name
"jack"
```

```sh
# 将set于expire结合起来了，添加并设置有效期
127.0.0.1:6379[5]> setex name 10 jack
OK
127.0.0.1:6379[5]> ttl name
(integer) 5
127.0.0.1:6379[5]> ttl name
(integer) 4
127.0.0.1:6379[5]> ttl name
(integer) 2
127.0.0.1:6379[5]> ttl name
(integer) 1
127.0.0.1:6379[5]> ttl name
(integer) -2
```





### 2 key 结构

Redis 没有类似 MySQL 中的 Table 的概念，我们该如何区分不同类型的 key 呢？

例如，需要存储用户、商品信息到 redis ，有一个用户 id 是 1 ，有一个商品 id 恰好也是 1，此时如果使用 id 作为 key ，那就会冲突了，该怎么办呢？

我们可以通过给 key 添加前缀加以区分，不过这个前缀不是随便加的，有一定的规范：

Redis 的 key 允许有多个单词形成层级结构，多个单词之间用 `:` 隔开，格式如下：

```java
项目名:业务名:类型:id
```

这个格式并非固定，也可以根据自己的需求来删除或添加词条。这样一来，我们就可以把不同类型的数据区分开来了。从而避免了 key 的冲突问题。

例如我们的项目名称叫 heima，有 user 和 product 两种不同类型的数据，我们可以这样定义 key：

- user 相关的 key ：`heima:user:1`
- product 相关的 key：`heima:product:1`



如果 value 是一个 java 对象，例如一个 User 对象，则可以将对象序列化为 JSON 字符串后存储：

```json
| KEY             | VALUE                                      |
| :-------------- | ------------------------------------------ |
| heima:user:1    | '{"id":1,  "name": "Jack", "age": 21}'       |
| heima:product:1 | '{"id":1,  "name": "小米11", "price": 4999}' |
```

并且，在 Redis 的桌面客户端中，还会以相同前缀作为层级结构，让数据看起来层次分明，关系清晰：

![image-20250117101025972](images/2-Redis_Entry/image-20250117101025972.png)



## ④ Hash 类型

Hash 类型，也叫散列，其 value 是一个无序字典，类似于 Java 中的 HashMap 结构。

String 结构是将对象序列化为 JSON 字符串后存储，当需要修改对象某个字段时很不方便：

![image-20250117171632582](images/2-Redis_Entry/image-20250117171632582.png)

Hash 结构可以将对象中的每个字段独立存储，可以针对单个字段做 CRUD：

![image-20250117171702322](images/2-Redis_Entry/image-20250117171702322.png)

Hash 的常见命令有：

- `HSET key field value`：添加或者修改 hash 类型的 key 的 field 的值
- `HGET key field`：获取一个 hash 类型的 key 的 field 的值
- `HMSET`：批量添加多个 hash 类型 key 的 field 的值
- `HMGET`：批量获取多个 hash 类型 key 的 field 的值
- `HGETALL`：获取一个 hash 类型的 key 中的所有的 field 和 value
- `HKEYS`：获取一个 hash 类型的 key 中的所有 field
- `HVALS`：获取一个 hash 类型的 key 中的所有 value
- `HINCRBY`：让一个 hash 类型的 key 的字段值自增并指定步长
- `HSETNX`：添加一个 hash 类型的 key 的 field 值，前提是这个 field 不存在，否则不执行

```sh
127.0.0.1:6379[5]> hset heima:user:2 name jack
(integer) 1
127.0.0.1:6379[5]> hget heima:user:2 name
"jack"
127.0.0.1:6379[5]> hset heima:user:2 age 21
(integer) 1
127.0.0.1:6379[5]> hget heima:user:2 age
"21"
127.0.0.1:6379[5]> hset heima:user:2 age 17
(integer) 0
127.0.0.1:6379[5]> hget heima:user:2 age
"17"
127.0.0.1:6379[5]> hmset heima:user:3 name lisi age 20 sex man
OK
127.0.0.1:6379[5]> hmget heima:user:3 name age sex
1) "lisi"
2) "20"
3) "man"
127.0.0.1:6379[5]> hgetall heima:user:3
1) "name"
2) "lisi"
3) "age"
4) "20"
5) "sex"
6) "man"
127.0.0.1:6379[5]> hkeys heima:user:3
1) "name"
2) "age"
3) "sex"
127.0.0.1:6379[5]> hvals heima:user:3
1) "lisi"
2) "20"
3) "man"
127.0.0.1:6379[5]> hincrby heima:user:3 age 2
(integer) 22
127.0.0.1:6379[5]> hincrby heima:user:3 age 2
(integer) 24
127.0.0.1:6379[5]> hget heima:user:3 age
"24"
127.0.0.1:6379[5]> hsetnx heima:user:3 name zs
(integer) 0
127.0.0.1:6379[5]> hget heima:user:3 name
"lisi"
127.0.0.1:6379[5]> hsetnx heima:user:3 phone 17286537629
(integer) 1
127.0.0.1:6379[5]> hget heima:user:3 phone
"17286537629"
127.0.0.1:6379[5]>
```





## ⑤ List 类型

Redis 中的 List 类型与 Java 中的 LinkedList 类似，可以看作是一个双向链表。既可以支持正向检索也可以支持反向检索。

特征也与 LinkedList 类似：

- 有序
- 元素可以重复
- 插入和删除快
- 查询速度一般

常用来存储一个有序数据，例如：朋友圈点赞列表，评论列表等。



List 的常见命令有：

- `LPUSH key element ...`：向列表左侧插入一个或多个元素
- `LPOP key`：移除并返回列表左侧的第一个元素，没有则返回 null
- `RPUSH key element ...`：向列表右边插入一个或多个元素
- `RPOP key`：移除并返回列表右侧的第一个元素，没有则返回 null
- `LRANGE key start end`：返回一段角标范围内的所有元素
- `BLPOP 和 BRPOP`：与 LPOP 和 RPOP 类似，只不过在没有元素时等待指定时间，而不是直接返回 null



```sh
127.0.0.1:6379[5]> LPUSH users 1 2 3
(integer) 3
127.0.0.1:6379[5]> RPUSH users 4 5 6
(integer) 6
127.0.0.1:6379[5]> LPOP users
"3"
127.0.0.1:6379[5]> RPOP users
"6"
127.0.0.1:6379[5]> LRANGE users 1 2
1) "1"
2) "4"
127.0.0.1:6379[5]> 
```



**思考：**

1.如何利用 List 结构模拟一个栈？

- 入口和出口在同一边

2.如何利用 List 结构模拟一个队列？

- 入口和出口在不同边

3.如何利用 List 结构模拟一个阻塞队列？

- 入口和出口在不同边
- 出队时采用 BLPOP 或 BRPOP



## ⑥ Set 类型

Redis 的 set 结构与 Java 中的 HashSet 类似，可以看作是一个 value 为 null 的 HashMap。因为也是一个 hash 表，因此具备与 HashSet 类似的特征：

- 无序
- 元素不可重复
- 查找快
- 支持交集、并集、差集等功能



Set 的常见命令有：

- `SADD key member ...`：向 set 中添加一个或多个元素
- `SREM key member ...`：移除 set 中的指定元素
- `SCARD key`：返回 set 中元素的个数
- `SISMEMBER key member`：判断一个元素是否存在 set 中
- `SMEMBERS`：获取 set 中的所有元素
- `SINTER key1 key2 ...`：求 key1 和 key2 的交集
- `SDIFF key1 key2 ...`：求 key1 和 key2 的差集
- `SUNION key1 key2 ...`：求 key1 和 key2 的并集



```sh
127.0.0.1:6379[5]> sadd s1 a b c
(integer) 3
127.0.0.1:6379[5]> SMEMBERS s1
1) "c"
2) "a"
3) "b"
127.0.0.1:6379[5]> SREM s1 a
(integer) 1
127.0.0.1:6379[5]> SISMEMBER s1 a
(integer) 0
127.0.0.1:6379[5]> SISMEMBER s1 b
(integer) 1
127.0.0.1:6379[5]> SCARD s1
(integer) 2
127.0.0.1:6379[5]> 
```



例如两个集合：s1和s2:

![image-20250212104338230](images/2-Redis_Entry/image-20250212104338230.png)

求交集：SINTER s1 s2

求s1与s2的不同：SDIFF s1 s2

![image-20250212104400333](images/2-Redis_Entry/image-20250212104400333.png)

练习：

1.将下列数据用 Redis 的 Set 集合来存储：

- 张三的好友有：李四、王五、赵六
- 李四的好友有：王五、麻子、二狗

2.利用 Set 的命令实现下列功能：

- 计算张三的好友有几人
- 计算张三和李四有哪些共同好友
- 查询哪些人是张三的好友却不是李四的好友
- 查询张三和李四的好友总共有哪些人
- 判断李四是否是张三的好友
- 将李四从张三的好友列表中移除



```sh
127.0.0.1:6379[5]> SADD zs ls ww zl
(integer) 3
127.0.0.1:6379[5]> SADD ls ww mz eg
(integer) 3
127.0.0.1:6379[5]> SMEMBERS zs
1) "zl"
2) "ww"
3) "ls"
127.0.0.1:6379[5]> SMEMBERS ls
1) "eg"
2) "mz"
3) "ww"
127.0.0.1:6379[5]> SCARD zs
(integer) 3
127.0.0.1:6379[5]> SINTER zs ls
1) "ww"
127.0.0.1:6379[5]> SDIFF zs ls
1) "zl"
2) "ls"
127.0.0.1:6379[5]> SUNION zs ls
1) "ls"
2) "ww"
3) "eg"
4) "zl"
5) "mz"
127.0.0.1:6379[5]> SISMEMBER zs ls
(integer) 1
127.0.0.1:6379[5]> SISMEMBER ls zs
(integer) 0
127.0.0.1:6379[5]> SREM zs ls
(integer) 1
127.0.0.1:6379[5]> SMEMBERS zs
1) "zl"
2) "ww"
127.0.0.1:6379[5]>
```



## ⑦ SortedSet 类型

Redis 的 SortedSet 是一个可排序的 set 集合，与 Java 中的 TreeSet 有些类似，但底层数据结构却差别很大。SortedSet 中的每一个元素都带有一个 score 属性，可以基于 score 属性对元素排序，底层的实现是一个跳表 (SkipList) 加 hash 表。

SortedSet 具备下列特性：

- 可排序
- 元素不重复
- 查询速度快

因为 SortedSet 的可排序特性，经常被用来实现排行榜这样的功能。



SortedSet 的常见命令有：

- `ZADD key score member`：添加一个或多个元素到 SortedSet ，如果已经存在则更新其 score 值
- `ZREM key member`：删除 SortedSet 中的一个指定元素
- `ZSCORE key member`：获取 SortedSet 中的指定元素的 score 值
- `ZRANK key member`：获取 SortedSet 中的指定元素的排名
- `ZCARD key`：获取 SortedSet 中的元素个数
- `ZCOUNT key min max`：统计 score 值在给定范围内的所有元素的个数
- `ZINCRBY key increment member`：让 SortedSet 中的指定元素自增，步长为指定的 increment 值
- `ZRANGE key min max`：按照 score 排序后，获取指定排名范围内的元素
- `ZRANGEBYSCORE key min max`：按照 score 排序后，获取指定 score 范围内的元素
- `ZDIFF、ZINTER、ZUNION`：求差集、交集、并集

::: tip

注意：所有的排名默认都是升序，如果要降序则在命令的 Z 后面添加 REV 即可，例如：

- **升序**获取sorted set 中的指定元素的排名：ZRANK key member
- **降序**获取sorted set 中的指定元素的排名：ZREVRANK key memeber

:::



练习题：

将班级的下列学生得分存入 Redis 的 SortedSet 中：

Jack 85, Lucy 89, Rose 82, Tom 95, Jerry 78, Amy 92, Miles 76

并实现下列功能：

- 删除Tom同学
- 获取Amy同学的分数
- 获取Rose同学的排名
- 查询80分以下有几个学生
- 给Amy同学加2分
- 查出成绩前3名的同学
- 查出成绩80分以下的所有同学



```sh
127.0.0.1:6379[5]> ZADD stus 85 Jack 89 Lucy 82 Rose 95 Tom 78 Jerry 92 Amy 76 Miles
(integer) 7
127.0.0.1:6379[5]> ZREM stus Tom
(integer) 1
127.0.0.1:6379[5]> ZRANK stus Rose
(integer) 2
127.0.0.1:6379[5]> ZREVRANK stus Rose
(integer) 3
127.0.0.1:6379[5]> ZCARD stus
(integer) 6
127.0.0.1:6379[5]> ZCOUNT stus 0 80
(integer) 2
127.0.0.1:6379[5]> ZINCRBY stus 2 Amy
"94"
127.0.0.1:6379[5]> ZINCRBY stus -2 Amy
"92"
127.0.0.1:6379[5]> ZRANGE stus 0 2
1) "Miles"
2) "Jerry"
3) "Rose"
127.0.0.1:6379[5]> ZREVRANGE stus 0 2
1) "Amy"
2) "Lucy"
3) "Jack"
127.0.0.1:6379[5]> ZRANGEBYSCORE stus 0 80
1) "Miles"
2) "Jerry"
127.0.0.1:6379[5]>
```
