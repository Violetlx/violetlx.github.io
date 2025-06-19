---
title: Redis分片集群
date: 2025/06/19
---

![MITSURI KANROJI 鬼灭之刃 快乐 桌面壁纸](https://bizhi1.com/wp-content/uploads/2024/08/mitsuri-kanroji-demon-slayer-happy-desktop-wallpaper-4k-small.jpg)

::: tip

① 搭建分片集群

② 散列插槽

③ 集群伸缩

④ 故障转移

⑤ RedisTemplate访问分片集群

:::

## ① 搭建分片集群

主从和哨兵可以解决高可用、高并发读的问题。但是依然有两个问题没有解决：

- 海量数据存储问题

- 高并发写的问题

使用分片集群可以解决上述问题，如图:

![image-20210725155747294](images/5-Redis_Advanced_Distributed/image-20210725155747294.png)



分片集群特征：

- 集群中有多个master，每个master保存不同数据

- 每个master都可以有多个slave节点

- master之间通过ping监测彼此健康状态

- 客户端请求可以访问集群任意节点，最终都会被转发到正确节点



具体搭建流程参考课前资料《Redis集群.md》：

![image-20210725155806288](images/5-Redis_Advanced_Distributed/image-20210725155806288.png) 



## ② 散列插槽

### 2.1.插槽原理

Redis会把每一个master节点映射到0~16383共16384个插槽（hash slot）上，查看集群信息时就能看到：

![image-20210725155820320](images/5-Redis_Advanced_Distributed/image-20210725155820320.png)



数据key不是与节点绑定，而是与插槽绑定。redis会根据key的有效部分计算插槽值，分两种情况：

- key中包含"{}"，且“{}”中至少包含1个字符，“{}”中的部分是有效部分
- key中不包含“{}”，整个key都是有效部分





例如：key是num，那么就根据num计算，如果是{itcast}num，则根据itcast计算。计算方式是利用CRC16算法得到一个hash值，然后对16384取余，得到的结果就是slot值。

![image-20210725155850200](images/5-Redis_Advanced_Distributed/image-20210725155850200.png) 

如图，在7001这个节点执行set a 1时，对a做hash运算，对16384取余，得到的结果是15495，因此要存储到103节点。

到了7003后，执行`get num`时，对num做hash运算，对16384取余，得到的结果是2765，因此需要切换到7001节点



### 2.2.小结

Redis如何判断某个key应该在哪个实例？

- 将16384个插槽分配到不同的实例
- 根据key的有效部分计算哈希值，对16384取余
- 余数作为插槽，寻找插槽所在实例即可

如何将同一类数据固定的保存在同一个Redis实例？

- 这一类数据使用相同的有效部分，例如key都以{typeId}为前缀



## ③ 集群伸缩

redis-cli --cluster提供了很多操作集群的命令，可以通过下面方式查看：

![image-20210725160138290](images/5-Redis_Advanced_Distributed/image-20210725160138290.png)

比如，添加节点的命令：

![image-20210725160448139](images/5-Redis_Advanced_Distributed/image-20210725160448139.png)



### 3.1.需求分析

需求：向集群中添加一个新的master节点，并向其中存储 num = 10

- 启动一个新的redis实例，端口为7004
- 添加7004到之前的集群，并作为一个master节点
- 给7004节点分配插槽，使得num这个key可以存储到7004实例



这里需要两个新的功能：

- 添加一个节点到集群中
- 将部分插槽分配到新插槽



### 3.2.创建新的redis实例

创建一个文件夹：

```sh
mkdir 7004
```

拷贝配置文件：

```sh
cp redis.conf /7004
```

修改配置文件：

```sh
sed /s/6379/7004/g 7004/redis.conf
```

启动

```sh
redis-server 7004/redis.conf
```



### 3.3.添加新节点到redis

添加节点的语法如下：

![image-20210725160448139](images/5-Redis_Advanced_Distributed/image-20210725160448139.png)



执行命令：

```sh
redis-cli --cluster add-node  192.168.150.101:7004 192.168.150.101:7001
```



通过命令查看集群状态：

```sh
redis-cli -p 7001 cluster nodes
```



如图，7004加入了集群，并且默认是一个master节点：

![image-20210725161007099](images/5-Redis_Advanced_Distributed/image-20210725161007099.png)

但是，可以看到7004节点的插槽数量为0，因此没有任何数据可以存储到7004上



### 3.4.转移插槽

我们要将num存储到7004节点，因此需要先看看num的插槽是多少：

![image-20210725161241793](images/5-Redis_Advanced_Distributed/image-20210725161241793.png)

如上图所示，num的插槽为2765.



我们可以将0~3000的插槽从7001转移到7004，命令格式如下：

![image-20210725161401925](images/5-Redis_Advanced_Distributed/image-20210725161401925.png)



具体命令如下：

建立连接：

![image-20210725161506241](images/5-Redis_Advanced_Distributed/image-20210725161506241.png)

得到下面的反馈：

![image-20210725161540841](images/5-Redis_Advanced_Distributed/image-20210725161540841.png)



询问要移动多少个插槽，我们计划是3000个：

新的问题来了：

![image-20210725161637152](images/5-Redis_Advanced_Distributed/image-20210725161637152.png)

那个node来接收这些插槽？？

显然是7004，那么7004节点的id是多少呢？

![image-20210725161731738](images/5-Redis_Advanced_Distributed/image-20210725161731738.png)

复制这个id，然后拷贝到刚才的控制台后：

![image-20210725161817642](images/5-Redis_Advanced_Distributed/image-20210725161817642.png)

这里询问，你的插槽是从哪里移动过来的？

- all：代表全部，也就是三个节点各转移一部分
- 具体的id：目标节点的id
- done：没有了



这里我们要从7001获取，因此填写7001的id：

![image-20210725162030478](images/5-Redis_Advanced_Distributed/image-20210725162030478.png)

填完后，点击done，这样插槽转移就准备好了：

![image-20210725162101228](images/5-Redis_Advanced_Distributed/image-20210725162101228.png)

确认要转移吗？输入yes：

然后，通过命令查看结果：

![image-20210725162145497](images/5-Redis_Advanced_Distributed/image-20210725162145497.png) 

可以看到： 

![image-20210725162224058](images/5-Redis_Advanced_Distributed/image-20210725162224058.png)

目的达成。



## ④ 故障转移

集群初识状态是这样的：

![image-20210727161152065](images/5-Redis_Advanced_Distributed/image-20210727161152065.png)

其中7001、7002、7003都是master，我们计划让7002宕机。



### 4.1.自动故障转移

当集群中有一个master宕机会发生什么呢？

直接停止一个redis实例，例如7002：

```sh
redis-cli -p 7002 shutdown
```



1）首先是该实例与其它实例失去连接

2）然后是疑似宕机：

![image-20210725162319490](images/5-Redis_Advanced_Distributed/image-20210725162319490.png)

3）最后是确定下线，自动提升一个slave为新的master：

![image-20210725162408979](images/5-Redis_Advanced_Distributed/image-20210725162408979.png)

4）当7002再次启动，就会变为一个slave节点了：

![image-20210727160803386](images/5-Redis_Advanced_Distributed/image-20210727160803386.png)



### 4.2.手动故障转移

利用cluster failover命令可以手动让集群中的某个master宕机，切换到执行cluster failover命令的这个slave节点，实现无感知的数据迁移。其流程如下：

![image-20210725162441407](images/5-Redis_Advanced_Distributed/image-20210725162441407.png)



这种failover命令可以指定三种模式：

- 缺省：默认的流程，如图1~6歩
- force：省略了对offset的一致性校验
- takeover：直接执行第5歩，忽略数据一致性、忽略master状态和其它master的意见



**案例需求**：在7002这个slave节点执行手动故障转移，重新夺回master地位

步骤如下：

1）利用redis-cli连接7002这个节点

2）执行cluster failover命令

如图：

![image-20210727160037766](images/5-Redis_Advanced_Distributed/image-20210727160037766.png)



效果：

![image-20210727161152065](images/5-Redis_Advanced_Distributed/image-20210727161152065.png)





## ⑤ RedisTemplate访问分片集群

RedisTemplate底层同样基于lettuce实现了分片集群的支持，而使用的步骤与哨兵模式基本一致：

1）引入redis的starter依赖

2）配置分片集群地址

3）配置读写分离

与哨兵模式相比，其中只有分片集群的配置方式略有差异，如下：

```yaml
spring:
  redis:
    cluster:
      nodes:
        - 192.168.150.101:7001
        - 192.168.150.101:7002
        - 192.168.150.101:7003
        - 192.168.150.101:8001
        - 192.168.150.101:8002
        - 192.168.150.101:8003
```
