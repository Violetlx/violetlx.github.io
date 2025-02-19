---
title: 优惠券秒杀
date: 2025/02/18
---

![2k可爱猫咪在草地嬉戏背景图片 - 萌猫壁纸「哲风壁纸」](https://haowallpaper.com/link/common/file/previewFileImg/16263592551566720)

::: tip

① 全局唯一 ID

② Redis 实现全局唯一 ID

③ 添加优惠券

④ 实现秒杀下单

⑤ 库存超卖问题分析

⑥ 乐观锁解决超卖问题

⑦ 集群环境下的并发问题

:::



## ① 全局唯一ID

每个商铺都可以发布优惠券：

![image-20250218094347722](images/4-Redis_Actual/image-20250218094347722.png)

当用户抢购时，就会生成订单并保存到 tb_voucher_order 这张表中，而订单如果使用数据库自增 ID 就存在一些问题：

- id 的规律性太明显
- 受单表数据量的限制

场景分析一：如果我们的 id 具有太明显的规则，用户或者说商业对手很容易猜测出来我们的一些敏感信息，比如商城在一天时间内，卖出了多少单，着明显不合适

场景分析二：随着我们商城规模越来越大，mysql 的单表容量不宜超过 500w ，数据量过大之后，我们要进行拆库拆表，但拆分表了之后，他们从逻辑上将他们是同一张表，所以他们的 id 是不能一样的，于是乎我们需要保证 id 的唯一性

**全局 ID 生成器**，是一种在分布式系统下用来生成全局唯一 ID 的工具，一般要满足下列特性：

![image-20250218094842908](images/4-Redis_Actual/image-20250218094842908.png)

为了增加 ID 的安全性，我们可以不直接使用 Redis 自增的数值，而是拼接一些其他信息：

![image-20250218161403210](images/4-Redis_Actual/image-20250218161403210.png)

ID 的组成部分：

- 符号位：1 bit 永远为0
- 时间戳：31 bit ，以秒为单位，可以使用 69 年
- 序列号：32 bit ，秒内的计数器，支持每秒产生 2^32 个不同的 ID



## ② Redis实现全局唯一ID

```java
@Component
public class RedisIdWorker {
    /**
     * 开始时间戳
     */
    private static final long BEGIN_TIMESTAMP = 1640995200L;
    /**
     * 序列号的位数
     */
    private static final int COUNT_BITS = 32;

    private StringRedisTemplate stringRedisTemplate;

    public RedisIdWorker(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public long nextId(String keyPrefix) {
        // 1.生成时间戳
        LocalDateTime now = LocalDateTime.now();
        long nowSecond = now.toEpochSecond(ZoneOffset.UTC);
        long timestamp = nowSecond - BEGIN_TIMESTAMP;

        // 2.生成序列号
        // 2.1.获取当前日期，精确到天
        String date = now.format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));
        // 2.2.自增长
        long count = stringRedisTemplate.opsForValue().increment("icr:" + keyPrefix + ":" + date);

        // 3.拼接并返回
        return timestamp << COUNT_BITS | count;
    }
}
```

**测试类**

::: info

知识小贴士：关于 countdownlatch

countdownlatch 名为信号枪：主要的作用是同步协调在多线程的等待于唤醒问题

我们如果没有 CountDownLatch ，那么由于程序是异步的，当异步程序没有执行完时，主线程就已经执行完了，然后我们期望的是分线程全部走完之后，主线程再走，所以我们此时需要使用到 CountDownLatch

:::

CountDownLatch 中有两个最重要的方法

1. countDwon
2. await

await 方法是阻塞方法，我们担心分线程没有执行完时，main 线程就先执行，所以使用 await 可以让 main 线程阻塞，那么什么时候 main 线程不在阻塞呢？当 countDownLatch 内部维护的变量变为 0 时，就不在阻塞，直接放行，那么什么时候 CountDownLatch 维护的变量变为 0  呢，我们只需要调用一次 countDown ，内部变量就减少 1 ，我们让分线程和变量绑定，执行完一个分线程就减少一个变量，当分线成全部走完，CountDwonLatch 维护的变量就是 0 ，此时 await 就不再阻塞，统计出来的时间也就是所有分线程执行完后的时间。

```java
@Test
void testIdWorker() throws InterruptedException {
    CountDownLatch latch = new CountDownLatch(300);

    Runnable task = () -> {
        for (int i = 0; i < 100; i++) {
            long id = redisIdWorker.nextId("order");
            System.out.println("id = " + id);
        }
        latch.countDown();
    };
    long begin = System.currentTimeMillis();
    for (int i = 0; i < 300; i++) {
        es.submit(task);
    }
    latch.await();
    long end = System.currentTimeMillis();
    System.out.println("time = " + (end - begin));
}
```







































































































































