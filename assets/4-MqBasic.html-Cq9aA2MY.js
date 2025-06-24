import{_ as e,c as n,b as a,o as i}from"./app-BDBTreNG.js";const l="/assets/image-20250624115108930-Cy8A5AUh.png",r="/assets/image-20250624115155665-B5hj-T_F.png",c={};function d(p,s){return i(),n("div",null,s[0]||(s[0]=[a('<p><img src="https://bizhi1.com/wp-content/uploads/2024/11/溯洄之境4K高清壁纸.jpg" alt="溯洄之境4K高清壁纸"></p><p>:: tip</p><p>1 配置 MQ</p><p>2 接收消息</p><p>3 发送消息</p><p>:::</p><p>案例需求：改造余额支付功能，将支付成功后基于OpenFeign的交易服务的更新订单状态接口的同步调用，改为基于RabbitMQ的异步通知。</p><p>如图：</p><p><img src="'+l+`" alt="image-20250624115108930"></p><p>说明：目前没有通知服务和积分服务，因此我们只关注交易服务，步骤如下：</p><ul><li>定义<code>direct</code>类型交换机，命名为<code>pay.direct</code></li><li>定义消息队列，命名为<code>trade.pay.success.queue</code></li><li>将<code>trade.pay.success.queue</code>与<code>pay.direct</code>绑定，<code>BindingKey</code>为<code>pay.success</code></li><li>支付成功时不再调用交易服务更新订单状态的接口，而是发送一条消息到<code>pay.direct</code>，发送消息的<code>RoutingKey</code> 为<code>pay.success</code>，消息内容是订单id</li><li>交易服务监听<code>trade.pay.success.queue</code>队列，接收到消息后更新订单状态为已支付</li></ul><h2 id="_1-配置-mq" tabindex="-1"><a class="header-anchor" href="#_1-配置-mq"><span>1 配置 MQ</span></a></h2><p>不管是生产者还是消费者，都需要配置MQ的基本信息。分为两步：</p><p>1）添加依赖：</p><div class="language-XML line-numbers-mode" data-highlighter="prismjs" data-ext="XML" data-title="XML"><pre><code><span class="line">  &lt;!--消息发送--&gt;</span>
<span class="line">  &lt;dependency&gt;</span>
<span class="line">      &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">      &lt;artifactId&gt;spring-boot-starter-amqp&lt;/artifactId&gt;</span>
<span class="line">  &lt;/dependency&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2）配置MQ地址：</p><div class="language-YAML line-numbers-mode" data-highlighter="prismjs" data-ext="YAML" data-title="YAML"><pre><code><span class="line">spring:</span>
<span class="line">  rabbitmq:</span>
<span class="line">    host: 192.168.150.101 # 你的虚拟机IP</span>
<span class="line">    port: 5672 # 端口</span>
<span class="line">    virtual-host: /hmall # 虚拟主机</span>
<span class="line">    username: hmall # 用户名</span>
<span class="line">    password: 123 # 密码</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-接收消息" tabindex="-1"><a class="header-anchor" href="#_2-接收消息"><span>2 接收消息</span></a></h2><p>在trade-service服务中定义一个消息监听类：</p><p><img src="`+r+`" alt="image-20250624115155665"></p><p>其代码如下：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">package com.hmall.trade.listener;</span>
<span class="line"></span>
<span class="line">import com.hmall.trade.service.IOrderService;</span>
<span class="line">import lombok.RequiredArgsConstructor;</span>
<span class="line">import org.springframework.amqp.core.ExchangeTypes;</span>
<span class="line">import org.springframework.amqp.rabbit.annotation.Exchange;</span>
<span class="line">import org.springframework.amqp.rabbit.annotation.Queue;</span>
<span class="line">import org.springframework.amqp.rabbit.annotation.QueueBinding;</span>
<span class="line">import org.springframework.amqp.rabbit.annotation.RabbitListener;</span>
<span class="line">import org.springframework.stereotype.Component;</span>
<span class="line"></span>
<span class="line">@Component</span>
<span class="line">@RequiredArgsConstructor</span>
<span class="line">public class PayStatusListener {</span>
<span class="line"></span>
<span class="line">    private final IOrderService orderService;</span>
<span class="line"></span>
<span class="line">    @RabbitListener(bindings = @QueueBinding(</span>
<span class="line">            value = @Queue(name = &quot;trade.pay.success.queue&quot;, durable = &quot;true&quot;),</span>
<span class="line">            exchange = @Exchange(name = &quot;pay.topic&quot;),</span>
<span class="line">            key = &quot;pay.success&quot;</span>
<span class="line">    ))</span>
<span class="line">    public void listenPaySuccess(Long orderId){</span>
<span class="line">        orderService.markOrderPaySuccess(orderId);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-发送消息" tabindex="-1"><a class="header-anchor" href="#_3-发送消息"><span>3 发送消息</span></a></h2><p>修改<code>pay-service</code>服务下的<code>com.hmall.pay.\`\`service\`\`.impl.\`\`PayOrderServiceImpl</code>类中的<code>tryPayOrderByBalance</code>方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">private final RabbitTemplate rabbitTemplate;</span>
<span class="line"></span>
<span class="line">@Override</span>
<span class="line">@Transactional</span>
<span class="line">public void tryPayOrderByBalance(PayOrderDTO payOrderDTO) {</span>
<span class="line">    // 1.查询支付单</span>
<span class="line">    PayOrder po = getById(payOrderDTO.getId());</span>
<span class="line">    // 2.判断状态</span>
<span class="line">    if(!PayStatus.WAIT_BUYER_PAY.equalsValue(po.getStatus())){</span>
<span class="line">        // 订单不是未支付，状态异常</span>
<span class="line">        throw new BizIllegalException(&quot;交易已支付或关闭！&quot;);</span>
<span class="line">    }</span>
<span class="line">    // 3.尝试扣减余额</span>
<span class="line">    userClient.deductMoney(payOrderDTO.getPw(), po.getAmount());</span>
<span class="line">    // 4.修改支付单状态</span>
<span class="line">    boolean success = markPayOrderSuccess(payOrderDTO.getId(), LocalDateTime.now());</span>
<span class="line">    if (!success) {</span>
<span class="line">        throw new BizIllegalException(&quot;交易已支付或关闭！&quot;);</span>
<span class="line">    }</span>
<span class="line">    // 5.修改订单状态</span>
<span class="line">    // tradeClient.markOrderPaySuccess(po.getBizOrderNo());</span>
<span class="line">    try {</span>
<span class="line">        rabbitTemplate.convertAndSend(&quot;pay.direct&quot;, &quot;pay.success&quot;, po.getBizOrderNo());</span>
<span class="line">    } catch (Exception e) {</span>
<span class="line">        log.error(&quot;支付成功的消息发送失败，支付单id：{}， 交易单id：{}&quot;, po.getId(), po.getBizOrderNo(), e);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25)]))}const o=e(c,[["render",d]]),v=JSON.parse('{"path":"/docs/Java/Heima/Microservices/Day06_MqBasic/4-MqBasic.html","title":"业务改造","lang":"en-US","frontmatter":{"title":"业务改造","date":"2025/03/06"},"headers":[{"level":2,"title":"1 配置 MQ","slug":"_1-配置-mq","link":"#_1-配置-mq","children":[]},{"level":2,"title":"2 接收消息","slug":"_2-接收消息","link":"#_2-接收消息","children":[]},{"level":2,"title":"3 发送消息","slug":"_3-发送消息","link":"#_3-发送消息","children":[]}],"filePathRelative":"docs/Java/Heima/Microservices/Day06_MqBasic/4-MqBasic.md","git":{"createdTime":1741251281000,"updatedTime":1750737247000,"contributors":[{"name":"lixuan","email":"2789968443@qq.com","commits":2}]}}');export{o as comp,v as data};
