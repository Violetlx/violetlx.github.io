---
title: 核心功能
date: 2025/03/05
---

![赫萝 妖精之狼 麦田 落日桌面壁纸](https://bizhi1.com/wp-content/uploads/2024/09/holo-spice-and-wolf-wheat-field-sunset-desktop-wallpaper-4k-small.jpg)

::: tip

1 条件构造器

2 自定义SQL

3 Service接口

:::

刚才的案例中都是以id为条件的简单CRUD，一些复杂条件的SQL语句就要用到一些更高级的功能了。



## 1 条件构造器

除了新增以外，修改、删除、查询的SQL语句都需要指定where条件。因此BaseMapper中提供的相关方法除了以`id`作为`where`条件以外，还支持更加复杂的`where`条件。

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=NTRlMWE5YjA0YTEyMjJlYTBiMTg0OGYwODI1MzM4NGVfOUhYd3Z2b2ltNWl5U1QzcHMzb09USklvNXhrMXNHOTNfVG9rZW46QXlTUGJCVVVTb25wa3p4Y0x6SGNLTlhwblVjXzE3NDExNTU4MjQ6MTc0MTE1OTQyNF9WNA)

参数中的`Wrapper`就是条件构造的抽象类，其下有很多默认实现，继承关系如图：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=NDc3ZWQ3MmZiZjhjMzljZWMwMTE3MmQyOWYzOTliYmVfdFN3bnF4eTIzZ2o5eGltRm0yUGtQZko2VnQ2RG5PYlFfVG9rZW46WjFUU2JGUk1ubzZWaWp4Q1BDbmN6MmdEbjNlXzE3NDExNTU4MjQ6MTc0MTE1OTQyNF9WNA)

`Wrapper`的子类`AbstractWrapper`提供了where中包含的所有条件构造方法：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=Yjc0M2E1MjA1YWIyMjA1ZGYxMjEzNDYxZjg5ZjEyMjlfWjlqN2hlZThxVUVlN2tIenpRMm1xQjlTdXYxa2p4ZW1fVG9rZW46RXlZeWJzZnBBb0FaVnF4V2p5YmNXSzNlbmFmXzE3NDExNTU4MjQ6MTc0MTE1OTQyNF9WNA)

而QueryWrapper在AbstractWrapper的基础上拓展了一个select方法，允许指定查询字段：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=Mjc4YmMwNjkwZDcyYTgzYTliOGNlZmJkNTY1OTY1MjFfclNVZ1hUU1Q4bXZSTGlnTnZKNGdXYmtsTllLUU9uMnlfVG9rZW46RVVzUmJwaERQbzJNNTN4WjBrSGNCMWhFbmpoXzE3NDExNTU4MjQ6MTc0MTE1OTQyNF9WNA)

而UpdateWrapper在AbstractWrapper的基础上拓展了一个set方法，允许指定SQL中的SET部分：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=NjE0N2Y4YjY5MDYzOWNiM2QzYWIxMjY4ZDJhYTZiOTFfTlIxcXN1ZDRKZ2RqMUFtQmlwM3JJYTNacWtIZ283ckFfVG9rZW46TDZVRWJEZ1V5b0R4blZ4UW92SWNpYmEzbmRiXzE3NDExNTU4MjQ6MTc0MTE1OTQyNF9WNA)

接下来，我们就来看看如何利用`Wrapper`实现复杂查询。



### 1.1 QueryWrapper

无论是修改、删除、查询，都可以使用QueryWrapper来构建查询条件。接下来看一些例子： **查询**：查询出名字中带`o`的，存款大于等于1000元的人。代码如下：

```java
@Test
void testQueryWrapper() {
    // 1.构建查询条件 where name like "%o%" AND balance >= 1000
    QueryWrapper<User> wrapper = new QueryWrapper<User>()
            .select("id", "username", "info", "balance")
            .like("username", "o")
            .ge("balance", 1000);
    // 2.查询数据
    List<User> users = userMapper.selectList(wrapper);
    users.forEach(System.out::println);
}
```

**更新**：更新用户名为jack的用户的余额为2000，代码如下：

```java
@Test
void testUpdateByQueryWrapper() {
    // 1.构建查询条件 where name = "Jack"
    QueryWrapper<User> wrapper = new QueryWrapper<User>().eq("username", "Jack");
    // 2.更新数据，user中非null字段都会作为set语句
    User user = new User();
    user.setBalance(2000);
    userMapper.update(user, wrapper);
}
```



### 1.2 UpdateWrapper

基于BaseMapper中的update方法更新时只能直接赋值，对于一些复杂的需求就难以实现。 例如：更新id为`1,2,4`的用户的余额，扣200，对应的SQL应该是：

```java
UPDATE user SET balance = balance - 200 WHERE id in (1, 2, 4)
```

SET的赋值结果是基于字段现有值的，这个时候就要利用UpdateWrapper中的setSql功能了：

```java
@Test
void testUpdateWrapper() {
    List<Long> ids = List.of(1L, 2L, 4L);
    // 1.生成SQL
    UpdateWrapper<User> wrapper = new UpdateWrapper<User>()
            .setSql("balance = balance - 200") // SET balance = balance - 200
            .in("id", ids); // WHERE id in (1, 2, 4)
        // 2.更新，注意第一个参数可以给null，也就是不填更新字段和数据，
    // 而是基于UpdateWrapper中的setSQL来更新
    userMapper.update(null, wrapper);
}
```

### 1.3 LambdaQueryWrapper

无论是QueryWrapper还是UpdateWrapper在构造条件的时候都需要写死字段名称，会出现字符串`魔法值`。这在编程规范中显然是不推荐的。 那怎么样才能不写字段名，又能知道字段名呢？

其中一种办法是基于变量的`gettter`方法结合反射技术。因此我们只要将条件对应的字段的`getter`方法传递给MybatisPlus，它就能计算出对应的变量名了。而传递方法可以使用JDK8中的`方法引用`和`Lambda`表达式。 因此MybatisPlus又提供了一套基于Lambda的Wrapper，包含两个：

- LambdaQueryWrapper
- LambdaUpdateWrapper

分别对应QueryWrapper和UpdateWrapper

其使用方式如下：

```java
@Test
void testLambdaQueryWrapper() {
    // 1.构建条件 WHERE username LIKE "%o%" AND balance >= 1000
    QueryWrapper<User> wrapper = new QueryWrapper<>();
    wrapper.lambda()
            .select(User::getId, User::getUsername, User::getInfo, User::getBalance)
            .like(User::getUsername, "o")
            .ge(User::getBalance, 1000);
    // 2.查询
    List<User> users = userMapper.selectList(wrapper);
    users.forEach(System.out::println);
}
```





## 2 自定义SQL

在演示UpdateWrapper的案例中，我们在代码中编写了更新的SQL语句：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=MWU0ZGM1MmI3NzRhMGMwMGYzNTNkNzY1MDQ5ZmM3NzRfZ3prRFhNU2JVM2Q3M2tIang2WXVaQkZZSGc4QXQzSjBfVG9rZW46WUR5cGJEalh3b3JXRmV4eEVHWGNtelZvbkNlXzE3NDExNTYyMjI6MTc0MTE1OTgyMl9WNA)

这种写法在某些企业也是不允许的，因为SQL语句最好都维护在持久层，而不是业务层。就当前案例来说，由于条件是in语句，只能将SQL写在Mapper.xml文件，利用foreach来生成动态SQL。 这实在是太麻烦了。假如查询条件更复杂，动态SQL的编写也会更加复杂。

所以，MybatisPlus提供了自定义SQL功能，可以让我们利用Wrapper生成查询条件，再结合Mapper.xml编写SQL



### 2.1 基本用法

以当前案例来说，我们可以这样写：

```java
@Test
void testCustomWrapper() {
    // 1.准备自定义查询条件
    List<Long> ids = List.of(1L, 2L, 4L);
    QueryWrapper<User> wrapper = new QueryWrapper<User>().in("id", ids);

    // 2.调用mapper的自定义方法，直接传递Wrapper
    userMapper.deductBalanceByIds(200, wrapper);
}
```

然后在UserMapper中自定义SQL：

```java
package com.itheima.mp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.itheima.mp.domain.po.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Param;

public interface UserMapper extends BaseMapper<User> {
    @Select("UPDATE user SET balance = balance - #{money} ${ew.customSqlSegment}")
    void deductBalanceByIds(@Param("money") int money, @Param("ew") QueryWrapper<User> wrapper);
}
```

这样就省去了编写复杂查询条件的烦恼了。



### 2.2 多表关联

理论上来讲MyBatisPlus是不支持多表查询的，不过我们可以利用Wrapper中自定义条件结合自定义SQL来实现多表查询的效果。 例如，我们要查询出所有收货地址在北京的并且用户id在1、2、4之中的用户 要是自己基于mybatis实现SQL，大概是这样的：

```xml
<select id="queryUserByIdAndAddr" resultType="com.itheima.mp.domain.po.User">
      SELECT *
      FROM user u
      INNER JOIN address a ON u.id = a.user_id
      WHERE u.id
      <foreach collection="ids" separator="," item="id" open="IN (" close=")">
          #{id}
      </foreach>
      AND a.city = #{city}
  </select>
```

可以看出其中最复杂的就是WHERE条件的编写，如果业务复杂一些，这里的SQL会更变态。

但是基于自定义SQL结合Wrapper的玩法，我们就可以利用Wrapper来构建查询条件，然后手写SELECT及FROM部分，实现多表查询。

查询条件这样来构建：

```java
@Test
void testCustomJoinWrapper() {
    // 1.准备自定义查询条件
    QueryWrapper<User> wrapper = new QueryWrapper<User>()
            .in("u.id", List.of(1L, 2L, 4L))
            .eq("a.city", "北京");

    // 2.调用mapper的自定义方法
    List<User> users = userMapper.queryUserByWrapper(wrapper);

    users.forEach(System.out::println);
}
```

然后在UserMapper中自定义方法：

```java
@Select("SELECT u.* FROM user u INNER JOIN address a ON u.id = a.user_id ${ew.customSqlSegment}")
List<User> queryUserByWrapper(@Param("ew")QueryWrapper<User> wrapper);
```

当然，也可以在`UserMapper.xml`中写SQL：

```xml
<select id="queryUserByIdAndAddr" resultType="com.itheima.mp.domain.po.User">
    SELECT * FROM user u INNER JOIN address a ON u.id = a.user_id ${ew.customSqlSegment}
</select>
```





## 3 Service接口

MybatisPlus不仅提供了BaseMapper，还提供了通用的Service接口及默认实现，封装了一些常用的service模板方法。 通用接口为`IService`，默认实现为`ServiceImpl`，其中封装的方法可以分为以下几类：

- `save`：新增
- `remove`：删除
- `update`：更新
- `get`：查询单个结果
- `list`：查询集合结果
- `count`：计数
- `page`：分页查询



### 3.1 CRUD

我们先俩看下基本的CRUD接口。 **新增**：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=OWU5ZTQxNzUyM2Y0NDEwOWMyMWY0Nzc2ZDE2YzJhMzRfdmNud2NrQ2ZqVUNLZHRybElQQ3FEbzd4OTJLZXRxSlJfVG9rZW46WGJpS2JCZ0Ixb1k2aER4V3ZCVmNwWDlsbkZoXzE3NDExNTY3OTM6MTc0MTE2MDM5M19WNA)

- `save`是新增单个元素
- `saveBatch`是批量新增
- `saveOrUpdate`是根据id判断，如果数据存在就更新，不存在则新增
- `saveOrUpdateBatch`是批量的新增或修改

**删除：**

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjZmODcxNjI5Y2U4MmFhYTdkNTE0MDY1NWEzYzQ5OWZfRjJST2lCVkFFT2M2STg3VkNtdkZEWnd1VXFQYkdiY1VfVG9rZW46T2dBcGJNVGJGbzA3OTJ4Q0hjQmNJa3libmZkXzE3NDExNTY3OTM6MTc0MTE2MDM5M19WNA)

- `removeById`：根据id删除
- `removeByIds`：根据id批量删除
- `removeByMap`：根据Map中的键值对为条件删除
- `remove(Wrapper<T>)`：根据Wrapper条件删除
- `~~removeBatchByIds~~`：暂不支持

**修改：**

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=OTc5YWEzNzhlNzg3MTU1YWE4ZTI2YTk0MWFjNjM1NmVfQ3ZqdjZEUUxwaHRCWUlPWllQbmFZQ2hWaUlYUEZMSVZfVG9rZW46RnpNTWJEdFNRb0NFeVN4ZVd0MWM4VGNYbkdkXzE3NDExNTY3OTM6MTc0MTE2MDM5M19WNA)

- `updateById`：根据id修改
- `update(Wrapper<T>)`：根据`UpdateWrapper`修改，`Wrapper`中包含`set`和`where`部分
- `update(T，Wrapper<T>)`：按照`T`内的数据修改与`Wrapper`匹配到的数据
- `updateBatchById`：根据id批量修改

**Get：**

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=YmI0OTE3ZWMzMWNiOTNmZTBhNWRlZGYxYmNjNzZjMzFfcVI2OVFHR2dxVkM4a29XSzBDM1RaTjdBZTVwNDhCeUhfVG9rZW46UXN6ZGJjNTB6b0xwdUl4NEI4dWNHbnp0bjdmXzE3NDExNTY3OTM6MTc0MTE2MDM5M19WNA)

- `getById`：根据id查询1条数据
- `getOne(Wrapper<T>)`：根据`Wrapper`查询1条数据
- `getBaseMapper`：获取`Service`内的`BaseMapper`实现，某些时候需要直接调用`Mapper`内的自定义`SQL`时可以用这个方法获取到`Mapper`

**List：**

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=OGMxZTgyZjExNjgyODE0NzE4ODBiYTI5ZjBkMWU5ZGFfWVJ5elh0OGxpcklYbWpDR1BqTTExMFNva0F5T0FDMlFfVG9rZW46UWhVNmI3TFdZb0tlR0N4NGFOVmNObklCblZkXzE3NDExNTY3OTM6MTc0MTE2MDM5M19WNA)

- `listByIds`：根据id批量查询
- `list(Wrapper<T>)`：根据Wrapper条件查询多条数据
- `list()`：查询所有

**Count**：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=OGVlYTA0YTU2MzU1MzJlMTg3OWExYjBmNzI5NGU5ZmRfcThGWlRSVVBRTVJmYjFQQ09IbTZpY2pXMGo0Y21MaVJfVG9rZW46UndyZ2JaUFQwb2VoekJ4cE1VMmN0NlhLbmlmXzE3NDExNTY3OTM6MTc0MTE2MDM5M19WNA)

- `count()`：统计所有数量
- `count(Wrapper<T>)`：统计符合`Wrapper`条件的数据数量

**getBaseMapper**： 当我们在service中要调用Mapper中自定义SQL时，就必须获取service对应的Mapper，就可以通过这个方法：

![img](https://b11et3un53m.feishu.cn/space/api/box/stream/download/asynccode/?code=MGM1ZWU2YTI1MDg4NDQyYWU2MTdiODBmOTAyZmEyN2RfZ0F1SENNdXE4bUFtUFduRUJONko4UHJGVUo1RzNxT29fVG9rZW46TFdqc2JTMVUzb1JCdXh4MWhDMGMxMzdBbmpoXzE3NDExNTY3OTM6MTc0MTE2MDM5M19WNA)



### 3.2 基本用法

由于`Service`中经常需要定义与业务有关的自定义方法，因此我们不能直接使用`IService`，而是自定义`Service`接口，然后继承`IService`以拓展方法。同时，让自定义的`Service实现类`继承`ServiceImpl`，这样就不用自己实现`IService`中的接口了。

首先，定义`IUserService`，继承`IService`：

```java
package com.itheima.mp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.itheima.mp.domain.po.User;

public interface IUserService extends IService<User> {
    // 拓展自定义方法
}
```

然后，编写`UserServiceImpl`类，继承`ServiceImpl`，实现`UserService`：

```java
package com.itheima.mp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.itheima.mp.domain.po.User;
import com.itheima.mp.domain.po.service.IUserService;
import com.itheima.mp.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {
}
```

### 3.3 Lambda

### 3.4 批量新增