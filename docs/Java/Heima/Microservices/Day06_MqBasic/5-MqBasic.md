---
title: 练习
date: 2025/03/06
---

![下雨天 小女孩 小黑猫 伞 4K动漫壁纸](https://bizhi1.com/wp-content/uploads/2024/11/%E4%B8%8B%E9%9B%A8%E5%A4%A9-%E5%B0%8F%E5%A5%B3%E5%AD%A9-%E5%B0%8F%E9%BB%91%E7%8C%AB-%C9%A1-4K%E5%8A%A8%E6%BC%AB%E5%A3%81%E7%BA%B83840x2160.jpg)

::: tip

1 抽取共享的 MQ 配置

2 改造下单功能

3 登录信息传递优化

4 改造项目一

:::

## 1 抽取共享的 MQ 配置

将MQ配置抽取到Nacos中管理，微服务中直接使用共享配置。





## 2 改造下单功能

改造下单功能，将基于OpenFeign的清理购物车同步调用，改为基于RabbitMQ的异步通知：

- 定义topic类型交换机，命名为`trade.topic`
- 定义消息队列，命名为`cart.clear.queue`
- 将`cart.clear.queue`与`trade.topic`绑定，`BindingKey`为`order.create`
- 下单成功时不再调用清理购物车接口，而是发送一条消息到`trade.topic`，发送消息的`RoutingKey`  为`order.create`，消息内容是下单的具体商品、当前登录用户信息
- 购物车服务监听`cart.clear.queue`队列，接收到消息后清理指定用户的购物车中的指定商品





## 3 登录信息传递优化

某些业务中，需要根据登录用户信息处理业务，而基于MQ的异步调用并不会传递登录用户信息。前面我们的做法比较麻烦，至少要做两件事：

- 消息发送者在消息体中传递登录用户
- 消费者获取消息体中的登录用户，处理业务

这样做不仅麻烦，而且编程体验也不统一，毕竟我们之前都是使用UserContext来获取用户。

大家思考一下：有没有更优雅的办法传输登录用户信息，让使用MQ的人无感知，依然采用UserContext来随时获取用户。

参考资料：

https://docs.spring.io/spring-amqp/docs/2.4.14/reference/html/#post-processing





## 4 改造项目一

思考一下，项目一中的哪些业务可以由同步方式改为异步方式调用？试着改造一下。

举例：短信发送