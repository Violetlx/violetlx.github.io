---
title: 快速入门
date: 2025/03/05
---

![奇妙世界中的动漫女孩](https://bizhi1.com/wp-content/uploads/2024/10/anime-girl-in-a-world-of-wonder-pu-3840x2160-1.jpg)

::: tip

1 环境准备

2 快速开始

3 常见注解

4 常见配置

:::

## 1 环境准备

为了方便测试，我们先创建一个新的项目，并准备一些基础数据。

### 1.1 环境准备

复制课前资料提供好的一个项目到你的工作空间（不要包含空格和特殊字符）：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=YTA0NGM5NzBjNDgzYWQ3MTEzZjkxYWVlODgzYWNjZWRfTjlzd3pQbzNZbW54cGc1ZGVqd0UxYmtJRGxZVktuVjJfVG9rZW46TmU0M2JNbkFVbzZIekl4Z1RrYmNEYmFsblJiXzE3NDExNDcwMjI6MTc0MTE1MDYyMl9WNA)

然后用你的IDEA工具打开，项目结构如下：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=NjMxNTUyZGNhN2FlMzFkYTRlMjUxYTMyZWVlMjQ1ZTFfeEwzZFZBdTNNTW1zZFJEMHdyVk5vdHVtbFhiNXJDcFRfVG9rZW46WjhOSmJOMUp5bzFqeEt4R2xvTmN3R1JHbk5mXzE3NDExNDcwMjI6MTc0MTE1MDYyMl9WNA)

注意配置一下项目的JDK版本为JDK11。首先点击项目结构设置：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2IzZGY1NGJjNzhmOGM2ZjZlM2JjNzVmZGRiOTA0MzZfalVRc3ZXUzJQbDIwb28zc3J4eTMybVREMlZVVmZhMGVfVG9rZW46TXV2ZmJKQlJwb1pCbHl4Zkt3eGNLdDRrbkpoXzE3NDExNDcwMjI6MTc0MTE1MDYyMl9WNA)

在弹窗中配置JDK：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=NDM0NTVjMjc1ODI3NmNkZWM4MDZhM2IyY2MwNjdhM2FfSFR3MGhlNTBSSXVmV0xySElOR0VZTzFYRjQxQ09waFpfVG9rZW46TEVRbWJ0UVR4b0s0eld4SDRyRWNFd1dIbnFoXzE3NDExNDcwMjI6MTc0MTE1MDYyMl9WNA)

接下来，要导入两张表，在课前资料中已经提供了SQL文件：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=N2I1Njg4MzAxZjAwNTg1OTA4OTI0NjY5NTkxYzU2M2ZfcGxNSHZ6RTlCbGJPQXFmQjNiSGZZZGg3MXRiN1RqdUpfVG9rZW46WTNvN2JQZ0c4b0ZNQmt4MlVuVmNlZm9lblNkXzE3NDExNDcwMjI6MTc0MTE1MDYyMl9WNA)

对应的数据库表结构如下：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=NjNkOTg1MDY2NmM0Yjc4YzQxNWU5MTBhZTQ1NGNkYTBfU0p1WjdROEVSNExFMnN4UmI3ejd4c2hZTWpMa09ITU9fVG9rZW46Qm5uU2JHQm12b0s0eTB4SENyYWM0alFjbnpkXzE3NDExNDcwMjI6MTc0MTE1MDYyMl9WNA)

最后，在`application.yaml`中修改jdbc参数为你自己的数据库参数：

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/mp?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: MySQL123
logging:
  level:
    com.itheima: debug
  pattern:
    dateformat: HH:mm:ss
```





## 2 快速开始

比如我们要实现User表的CRUD，只需要下面几步：

- 引入MybatisPlus依赖
- 定义Mapper



### 2.1 引入依赖

MybatisPlus提供了starter，实现了自动Mybatis以及MybatisPlus的自动装配功能，坐标如下：

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version>
</dependency>
```

由于这个starter包含对mybatis的自动装配，因此完全可以替换掉Mybatis的starter。 最终，项目的依赖如下：

```xml
<dependencies>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.5.3.1</version>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```



### 2.2 定义Mapper

为了简化单表CRUD，MybatisPlus提供了一个基础的`BaseMapper`接口，其中已经实现了单表的CRUD：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=OWZhZTI1N2EwYTQ3MTY0Y2FiNmE0Y2ZkYmI4YjUyOWZfSWE1OUVWQmNabWdUWTBwdGdadjR1dFhTbU9wY0dzZmZfVG9rZW46S0ZZdmJYdzdmb1BmM0x4dzVDamNkbTdvbnRiXzE3NDExNDcyNjM6MTc0MTE1MDg2M19WNA)

因此我们自定义的Mapper只要实现了这个`BaseMapper`，就无需自己实现单表CRUD了。 修改mp-demo中的`com.itheima.mp.mapper`包下的`UserMapper`接口，让其继承`BaseMapper`：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=YjVmMzI2ZmZmM2U4YmQ0ZDY1Y2I2NmUyNTE4ODZiOGRfSFd6SDZEY0kwOFVTSlZWd29GOXRTUVZ1SkJoUHlHaWJfVG9rZW46QzJDNGJOQ29yb25tMVB4aUQwS2NGNjdNbmxjXzE3NDExNDcyNjM6MTc0MTE1MDg2M19WNA)

代码如下：

```java
package com.itheima.mp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.itheima.mp.domain.po.User;

public interface UserMapper extends BaseMapper<User> {
}
```



### 2.3 测试

新建一个测试类，编写几个单元测试，测试基本的CRUD功能：

```java
package com.itheima.mp.mapper;

import com.itheima.mp.domain.po.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void testInsert() {
        User user = new User();
        user.setId(5L);
        user.setUsername("Lucy");
        user.setPassword("123");
        user.setPhone("18688990011");
        user.setBalance(200);
        user.setInfo("{\"age\": 24, \"intro\": \"英文老师\", \"gender\": \"female\"}");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        userMapper.insert(user);
    }

    @Test
    void testSelectById() {
        User user = userMapper.selectById(5L);
        System.out.println("user = " + user);
    }

    @Test
    void testSelectByIds() {
        List<User> users = userMapper.selectBatchIds(List.of(1L, 2L, 3L, 4L, 5L));
        users.forEach(System.out::println);
    }

    @Test
    void testUpdateById() {
        User user = new User();
        user.setId(5L);
        user.setBalance(20000);
        userMapper.updateById(user);
    }

    @Test
    void testDelete() {
        userMapper.deleteById(5L);
    }
}
```

可以看到，在运行过程中打印出的SQL日志，非常标准：

```sql
11:05:01  INFO 15524 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
11:05:02  INFO 15524 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
11:05:02 DEBUG 15524 --- [           main] c.i.mp.mapper.UserMapper.selectById      : ==>  Preparing: SELECT id,username,password,phone,info,status,balance,create_time,update_time FROM user WHERE id=?
11:05:02 DEBUG 15524 --- [           main] c.i.mp.mapper.UserMapper.selectById      : ==> Parameters: 5(Long)
11:05:02 DEBUG 15524 --- [           main] c.i.mp.mapper.UserMapper.selectById      : <==      Total: 1
user = User(id=5, username=Lucy, password=123, phone=18688990011, info={"age": 21}, status=1, balance=20000, createTime=Fri Jun 30 11:02:30 CST 2023, updateTime=Fri Jun 30 11:02:30 CST 2023)
```

只需要继承BaseMapper就能省去所有的单表CRUD，是不是非常简单！





## 3 常见注解

在刚刚的入门案例中，我们仅仅引入了依赖，继承了BaseMapper就能使用MybatisPlus，非常简单。但是问题来了： MybatisPlus如何知道我们要查询的是哪张表？表中有哪些字段呢？

大家回忆一下，UserMapper在继承BaseMapper的时候指定了一个泛型：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=YWNhNzJiOGMzNmFlNTc4NzU2ZWM0OTA0M2RiYWUyNDNfY3RmdE9rYjE5Z0lHMkRkOHhnSHRrbFIzN0NkaXRZQmtfVG9rZW46U1N6b2JzS1cxbzUySnh4WlRaamMyZU45bmhlXzE3NDExNDc1MjY6MTc0MTE1MTEyNl9WNA)

泛型中的User就是与数据库对应的PO.

MybatisPlus就是根据PO实体的信息来推断出表的信息，从而生成SQL的。默认情况下：

- MybatisPlus会把PO实体的类名驼峰转下划线作为表名
- MybatisPlus会把PO实体的所有变量名驼峰转下划线作为表的字段名，并根据变量类型推断字段类型
- MybatisPlus会把名为id的字段作为主键

但很多情况下，默认的实现与实际场景不符，因此MybatisPlus提供了一些注解便于我们声明表信息。



### 3.1 @TableName

说明：

- 描述：表名注解，标识实体类对应的表
- 使用位置：实体类

示例：

```java
@TableName("user")
public class User {
    private Long id;
    private String name;
}
```

TableName注解除了指定表名以外，还可以指定很多其它属性：

| **属性**         | **类型** | **必须指定** | **默认值** | **描述**                                                     |
| ---------------- | -------- | ------------ | ---------- | ------------------------------------------------------------ |
| value            | String   | 否           | ""         | 表名                                                         |
| schema           | String   | 否           | ""         | schema                                                       |
| keepGlobalPrefix | boolean  | 否           | false      | 是否保持使用全局的 tablePrefix 的值（当全局 tablePrefix 生效时） |
| resultMap        | String   | 否           | ""         | xml 中 resultMap 的 id（用于满足特定类型的实体类对象绑定）   |
| autoResultMap    | boolean  | 否           | false      | 是否自动构建 resultMap 并使用（如果设置 resultMap 则不会进行 resultMap 的自动构建与注入） |
| excludeProperty  | String[] | 否           | {}         | 需要排除的属性名 @since 3.3.1                                |



### 3.2 @TableId

说明：

- 描述：主键注解，标识实体类中的主键字段
- 使用位置：实体类的主键字段

示例：

```java
@TableName("user")
public class User {
    @TableId
    private Long id;
    private String name;
}
```

`TableId`注解支持两个属性：

| **属性** | **类型** | **必须指定** | **默认值**  | **描述**     |
| :------- | :------- | :----------- | :---------- | :----------- |
| value    | String   | 否           | ""          | 表名         |
| type     | Enum     | 否           | IdType.NONE | 指定主键类型 |

`IdType`支持的类型有：

| **值**        | **描述**                                                     |
| :------------ | :----------------------------------------------------------- |
| AUTO          | 数据库 ID 自增                                               |
| NONE          | 无状态，该类型为未设置主键类型（注解里等于跟随全局，全局里约等于 INPUT） |
| INPUT         | insert 前自行 set 主键值                                     |
| ASSIGN_ID     | 分配 ID(主键类型为 Number(Long 和 Integer)或 String)(since 3.3.0),使用接口IdentifierGenerator的方法nextId(默认实现类为DefaultIdentifierGenerator雪花算法) |
| ASSIGN_UUID   | 分配 UUID,主键类型为 String(since 3.3.0),使用接口IdentifierGenerator的方法nextUUID(默认 default 方法) |
| ID_WORKER     | 分布式全局唯一 ID 长整型类型(please use ASSIGN_ID)           |
| UUID          | 32 位 UUID 字符串(please use ASSIGN_UUID)                    |
| ID_WORKER_STR | 分布式全局唯一 ID 字符串类型(please use ASSIGN_ID)           |

这里比较常见的有三种：

- `AUTO`：利用数据库的id自增长
- `INPUT`：手动生成id
- `ASSIGN_ID`：雪花算法生成`Long`类型的全局唯一id，这是默认的ID策略



### 3.3 @TableField

说明：

> 描述：普通字段注解

示例：

```java
@TableName("user")
public class User {
    @TableId
    private Long id;
    private String name;
    private Integer age;
    @TableField(is_married")
    private Boolean isMarried;
    @TableField("`concat`")
    private String concat;
}
```

一般情况下我们并不需要给字段添加`@TableField`注解，一些特殊情况除外：

- 成员变量名与数据库字段名不一致
- 成员变量是以`isXXX`命名，按照`JavaBean`的规范，`MybatisPlus`识别字段时会把`is`去除，这就导致与数据库不符。
- 成员变量名与数据库一致，但是与数据库的关键字冲突。使用`@TableField`注解给字段名添加转义字符：````

支持的其它属性如下：

| **属性**         | **类型**   | **必填** | **默认值**            | **描述**                                                     |
| ---------------- | ---------- | -------- | --------------------- | ------------------------------------------------------------ |
| value            | String     | 否       | ""                    | 数据库字段名                                                 |
| exist            | boolean    | 否       | true                  | 是否为数据库表字段                                           |
| condition        | String     | 否       | ""                    | 字段 where 实体查询比较条件，有值设置则按设置的值为准，没有则为默认全局的 %s=#{%s}，[参考(opens new window)](https://github.com/baomidou/mybatis-plus/blob/3.0/mybatis-plus-annotation/src/main/java/com/baomidou/mybatisplus/annotation/SqlCondition.java) |
| update           | String     | 否       | ""                    | 字段 update set 部分注入，例如：当在version字段上注解update="%s+1" 表示更新时会 set version=version+1 （该属性优先级高于 el 属性） |
| insertStrategy   | Enum       | 否       | FieldStrategy.DEFAULT | 举例：NOT_NULL insert into table_a(<if test="columnProperty != null">column</if>) values (<if test="columnProperty != null">#{columnProperty}</if>) |
| updateStrategy   | Enum       | 否       | FieldStrategy.DEFAULT | 举例：IGNORED update table_a set column=#{columnProperty}    |
| whereStrategy    | Enum       | 否       | FieldStrategy.DEFAULT | 举例：NOT_EMPTY where <if test="columnProperty != null and columnProperty!=''">column=#{columnProperty}</if> |
| fill             | Enum       | 否       | FieldFill.DEFAULT     | 字段自动填充策略                                             |
| select           | boolean    | 否       | true                  | 是否进行 select 查询                                         |
| keepGlobalFormat | boolean    | 否       | false                 | 是否保持使用全局的 format 进行处理                           |
| jdbcType         | JdbcType   | 否       | JdbcType.UNDEFINED    | JDBC 类型 (该默认值不代表会按照该值生效)                     |
| typeHandler      | TypeHander | 否       |                       | 类型处理器 (该默认值不代表会按照该值生效)                    |
| numericScale     | String     | 否       | ""                    | 指定小数点后保留的位数                                       |





## 4 常见配置

MybatisPlus也支持基于yaml文件的自定义配置，详见官方文档：

https://baomidou.com/reference/

大多数的配置都有默认值，因此我们都无需配置。但还有一些是没有默认值的，例如:

- 实体类的别名扫描包
- 全局id类型

```yaml
mybatis-plus:
  type-aliases-package: com.itheima.mp.domain.po
  global-config:
    db-config:
      id-type: auto # 全局id类型为自增长
```

需要注意的是，MyBatisPlus也支持手写SQL的，而mapper文件的读取地址可以自己配置：

```yaml
mybatis-plus:
  mapper-locations: "classpath*:/mapper/**/*.xml" # Mapper.xml文件地址，当前这个是默认值。
```

可以看到默认值是`classpath*:/mapper/**/*.xml`，也就是说我们只要把mapper.xml文件放置这个目录下就一定会被加载。

例如，我们新建一个`UserMapper.xml`文件：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjhhMDI5NjBlOWUxMTQ2NDA4ZTYzMGE2Y2EwY2M1MzZfaVM3RnlZQmFYYWl2ME43cGY1Y09laVNCbThyclFOYnJfVG9rZW46RnhoNGJBQVZLb3Rpcmd4a24xNWNVMUhXbkRoXzE3NDExNTUxNTQ6MTc0MTE1ODc1NF9WNA)

然后在其中定义一个方法：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.itheima.mp.mapper.UserMapper">

    <select id="queryById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

然后在测试类`UserMapperTest`中测试该方法：

```java
@Test
void testQuery() {
    User user = userMapper.queryById(1L);
    System.out.println("user = " + user);
}
```