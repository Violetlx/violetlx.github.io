---
title: 作业
date: 2025/03/06
---

![小猫 可爱的 可爱的 极简主义者 纯色背景](https://bizhi1.com/wp-content/uploads/2024/11/kitten-3840x2160-adorable-cute-minimalist-charming-26362.jpg)

::: tip

1 取消订单

2 抽取 MQ 工具

3 改造业务

:::

## 1 取消订单

在处理超时未支付订单时，如果发现订单确实超时未支付，最终需要关闭该订单。

关闭订单需要完成两件事情：

- 将订单状态修改为已关闭
- 恢复订单中已经扣除的库存

这部分功能尚未实现。

大家要在`IOrderService`接口中定义`cancelOrder`方法：

```java
void cancelOrder(Long orderId);
```

并且在`OrderServiceImpl`中实现该方法。实现过程中要注意业务幂等性判断。





## 2 抽取 MQ 工具

MQ在企业开发中的常见应用我们就学习完毕了，除了收发消息以外，消息可靠性的处理、生产者确认、消费者确认、延迟消息等等编码还是相对比较复杂的。

因此，我们需要将这些常用的操作封装为工具，方便在项目中使用。要求如下：

- 将RabbitMQ的yaml配置抽取到nacos中，作为共享配置，替换所有微服务中的自定义MQ配置
- 在`hm-commom`模块下编写发送消息的工具类`RabbitMqHelper`
- 定义一个自动配置类`MqConsumeErrorAutoConfiguration`，内容包括：
  - 声明一个交换机，名为`error.direct`，类型为`direct`
  - 声明一个队列，名为：`微服务名 + error.queue`，也就是说要动态获取
  - 将队列与交换机绑定，绑定时的`RoutingKey`就是`微服务名`
  - 声明`RepublishMessageRecoverer`，消费失败消息投递到上述交换机
  - 给配置类添加条件，当`spring.rabbitmq.listener.simple.retry.enabled`为`true`时触发

RabbitMqHelper的结构如下：

```java
public class RabbitMqHelper {

    private final RabbitTemplate rabbitTemplate;

    public void sendMessage(String exchange, String routingKey, Object msg){

    }

    public void sendDelayMessage(String exchange, String routingKey, Object msg, int delay){

    }

    public void sendMessageWithConfirm(String exchange, String routingKey, Object msg, int maxRetries){
        
    }
}
```





## 3 改造业务

利用你编写的工具，改造支付服务、购物车服务、交易服务中消息发送功能，并且添加消息确认或消费者重试机制，确保消息的可靠性。