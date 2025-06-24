import{_ as i,c as l,b as n,a as e,d as p,e as c,r as d,o as r}from"./app-BDBTreNG.js";const t="/assets/image-20250624111601054-0qpkU-sj.png",u="/assets/image-20250624111616570-BlMEY27t.png",o="/assets/image-20250624111743643-nsdye_gv.png",v="/assets/-17507350391012-R6HO5zja.png",m="/assets/-17507350391011-DSwRG3tX.png",g="/assets/-17507352514385-BpyTO4me.png",b="/assets/-17507352738857-D0X2Zf6x.png",h="/assets/image-20250624112144490-Cgo7gYRx.png",_="/assets/-17507352916129-B_isnsdY.png",q="/assets/image-20250624113033617-DqJxpWnB.png",x="/assets/-175073585103211-DL5oiaVk.png",f="/assets/-175073585103312-D-5aWRZk.png",k="/assets/image-20250624113632152-DTZjBK6j.png",y="/assets/image-20250624113641028-DVFevMB5.png",Q="/assets/image-20250624113700092-CkL5Bfcs.png",S="/assets/image-20250624113716690--r-w-t3f.png",w="/assets/image-20250624113732072-DK4ivzZK.png",J="/assets/image-20250624113826263-D5F0zf33.png",M="/assets/image-20250624113842152-DsN7u1g0.png",B="/assets/image-20250624113916949-C8MZ-TrD.png",j="/assets/image-20250624113928565-Cb1VBxnE.png",T="/assets/image-20250624113943780-DO64BkVY.png",E="/assets/image-20250624114001488-DsZjmAIU.png",D="/assets/image-20250624114015597-OXGj2izd.png",R="/assets/image-20250624114104554-aAz704zI.png",A="/assets/image-20250624114119781-B_1jL0hN.png",I="/assets/image-20250624114204947-DODtym58.png",L="/assets/image-20250624114217880-C4CzbpPv.png",C="/assets/image-20250624114320938-CoeZWOCM.png",P="/assets/image-20250624114339906-Dni7Lzui.png",F="/assets/image-20250624114353556-T_JMiWrr.png",K="/assets/image-20250624114428765-DtbvWEiA.png",N="/assets/image-20250624114541413-CeXDHR2v.png",O="/assets/image-20250624114806314-D6X3M6ZF.png",W="/assets/image-20250624114629748-Byhs-yl7.png",Y="/assets/image-20250624114940169-DPN5UJyG.png",X="/assets/image-20250624115030071-CeSsDiXf.png",V={},z={href:"https://spring.io/projects/spring-amqp",target:"_blank",rel:"noopener noreferrer"};function Z(H,s){const a=d("ExternalLinkIcon");return r(),l("div",null,[s[1]||(s[1]=n('<p><img src="https://bizhi1.com/wp-content/uploads/2024/11/甘雨-休闲-房间-电脑-音箱-4K壁纸-3840x2160-1.jpg" alt="甘雨 休闲 房间 电脑 音箱 4K壁纸"></p><div class="custom-container tip"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01"></path><path d="M11 12h1v4h1"></path></g></svg><p class="custom-container-title">TIP</p><p>1 导入 Demo 工程</p><p>2 快速入门</p><p>3 WorkQueues 模型</p><p>4 交换机类型</p><p>5 Fanout 交换机</p><p>6 Direct 交换机</p><p>7 Topic 交换机</p><p>8 声明队列和交换机</p><p>9 消息转换器</p></div><p>将来我们开发业务功能的时候，肯定不会在控制台收发消息，而是应该基于编程的方式。由于<code>RabbitMQ</code>采用了AMQP协议，因此它具备跨语言的特性。任何语言只要遵循AMQP协议收发消息，都可以与<code>RabbitMQ</code>交互。并且<code>RabbitMQ</code>官方也提供了各种不同语言的客户端。</p><p>但是，RabbitMQ官方提供的Java客户端编码相对复杂，一般生产环境下我们更多会结合Spring来使用。而Spring的官方刚好基于RabbitMQ提供了这样一套消息收发的模板工具：SpringAMQP。并且还基于SpringBoot对其实现了自动装配，使用起来非常方便。</p><p>SpringAmqp的官方地址：</p>',5)),e("p",null,[e("a",z,[s[0]||(s[0]=p("https://spring.io/projects/spring-amqp")),c(a)])]),s[2]||(s[2]=n('<p>SpringAMQP提供了三个功能：</p><ul><li>自动声明队列、交换机及其绑定关系</li><li>基于注解的监听器模式，异步接收消息</li><li>封装了RabbitTemplate工具，用于发送消息</li></ul><p>这一章我们就一起学习一下，如何利用SpringAMQP实现对RabbitMQ的消息收发。</p><h2 id="_1-导入-demo-工程" tabindex="-1"><a class="header-anchor" href="#_1-导入-demo-工程"><span>1 导入 Demo 工程</span></a></h2><p>在课前资料给大家提供了一个Demo工程，方便我们学习SpringAMQP的使用：</p><p><img src="'+t+'" alt="image-20250624111601054"></p><p>将其复制到你的工作空间，然后用Idea打开，项目结构如图：</p><p><img src="'+u+`" alt="image-20250624111616570"></p><p>包括三部分：</p><ul><li>mq-demo：父工程，管理项目依赖</li><li>publisher：消息的发送者</li><li>consumer：消息的消费者</li></ul><p>在mq-demo这个父工程中，已经配置好了SpringAMQP相关的依赖：</p><div class="language-XML line-numbers-mode" data-highlighter="prismjs" data-ext="XML" data-title="XML"><pre><code><span class="line">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span>
<span class="line">&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span>
<span class="line">         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span>
<span class="line">         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;</span>
<span class="line">    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;</span>
<span class="line"></span>
<span class="line">    &lt;groupId&gt;cn.itcast.demo&lt;/groupId&gt;</span>
<span class="line">    &lt;artifactId&gt;mq-demo&lt;/artifactId&gt;</span>
<span class="line">    &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;</span>
<span class="line">    &lt;modules&gt;</span>
<span class="line">        &lt;module&gt;publisher&lt;/module&gt;</span>
<span class="line">        &lt;module&gt;consumer&lt;/module&gt;</span>
<span class="line">    &lt;/modules&gt;</span>
<span class="line">    &lt;packaging&gt;pom&lt;/packaging&gt;</span>
<span class="line"></span>
<span class="line">    &lt;parent&gt;</span>
<span class="line">        &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">        &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;</span>
<span class="line">        &lt;version&gt;2.7.12&lt;/version&gt;</span>
<span class="line">        &lt;relativePath/&gt;</span>
<span class="line">    &lt;/parent&gt;</span>
<span class="line"></span>
<span class="line">    &lt;properties&gt;</span>
<span class="line">        &lt;maven.compiler.source&gt;8&lt;/maven.compiler.source&gt;</span>
<span class="line">        &lt;maven.compiler.target&gt;8&lt;/maven.compiler.target&gt;</span>
<span class="line">    &lt;/properties&gt;</span>
<span class="line"></span>
<span class="line">    &lt;dependencies&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;lombok&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;!--AMQP依赖，包含RabbitMQ--&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-amqp&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;!--单元测试--&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">    &lt;/dependencies&gt;</span>
<span class="line">&lt;/project&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此，子工程中就可以直接使用SpringAMQP了。</p><h2 id="_2-快速入门" tabindex="-1"><a class="header-anchor" href="#_2-快速入门"><span>2 快速入门</span></a></h2><p>在之前的案例中，我们都是经过交换机发送消息到队列，不过有时候为了测试方便，我们也可以直接向队列发送消息，跳过交换机。</p><p>在入门案例中，我们就演示这样的简单模型，如图：</p><p><img src="`+o+'" alt="image-20250624111743643"></p><p>也就是：</p><ul><li>publisher直接发送消息到队列</li><li>消费者监听并处理队列中的消息</li></ul><p><strong>注意</strong>：这种模式一般测试使用，很少在生产中使用。</p><p>为了方便测试，我们现在控制台新建一个队列：simple.queue</p><p><img src="'+v+'" alt="img"></p><p>添加成功：</p><p><img src="'+m+`" alt="img"></p><p>接下来，我们就可以利用Java代码收发消息了。</p><h3 id="_2-1-消息发送" tabindex="-1"><a class="header-anchor" href="#_2-1-消息发送"><span>2.1 消息发送</span></a></h3><p>首先配置MQ地址，在<code>publisher</code>服务的<code>application.yml</code>中添加配置：</p><div class="language-YAML line-numbers-mode" data-highlighter="prismjs" data-ext="YAML" data-title="YAML"><pre><code><span class="line">spring:</span>
<span class="line">  rabbitmq:</span>
<span class="line">    host: 192.168.150.101 # 你的虚拟机IP</span>
<span class="line">    port: 5672 # 端口</span>
<span class="line">    virtual-host: /hmall # 虚拟主机</span>
<span class="line">    username: hmall # 用户名</span>
<span class="line">    password: 123 # 密码</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在<code>publisher</code>服务中编写测试类<code>SpringAmqpTest</code>，并利用<code>RabbitTemplate</code>实现消息发送：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">package com.itheima.publisher.amqp;</span>
<span class="line"></span>
<span class="line">import org.junit.jupiter.api.Test;</span>
<span class="line">import org.springframework.amqp.rabbit.core.RabbitTemplate;</span>
<span class="line">import org.springframework.beans.factory.annotation.Autowired;</span>
<span class="line">import org.springframework.boot.test.context.SpringBootTest;</span>
<span class="line"></span>
<span class="line">@SpringBootTest</span>
<span class="line">public class SpringAmqpTest {</span>
<span class="line"></span>
<span class="line">    @Autowired</span>
<span class="line">    private RabbitTemplate rabbitTemplate;</span>
<span class="line"></span>
<span class="line">    @Test</span>
<span class="line">    public void testSimpleQueue() {</span>
<span class="line">        // 队列名称</span>
<span class="line">        String queueName = &quot;simple.queue&quot;;</span>
<span class="line">        // 消息</span>
<span class="line">        String message = &quot;hello, spring amqp!&quot;;</span>
<span class="line">        // 发送消息</span>
<span class="line">        rabbitTemplate.convertAndSend(queueName, message);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打开控制台，可以看到消息已经发送到队列中：</p><p><img src="`+g+`" alt="img"></p><p>接下来，我们再来实现消息接收。</p><h3 id="_2-2-消息接收" tabindex="-1"><a class="header-anchor" href="#_2-2-消息接收"><span>2.2 消息接收</span></a></h3><p>首先配置MQ地址，在<code>consumer</code>服务的<code>application.yml</code>中添加配置：</p><div class="language-YAML line-numbers-mode" data-highlighter="prismjs" data-ext="YAML" data-title="YAML"><pre><code><span class="line">spring:</span>
<span class="line">  rabbitmq:</span>
<span class="line">    host: 192.168.150.101 # 你的虚拟机IP</span>
<span class="line">    port: 5672 # 端口</span>
<span class="line">    virtual-host: /hmall # 虚拟主机</span>
<span class="line">    username: hmall # 用户名</span>
<span class="line">    password: 123 # 密码</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在<code>consumer</code>服务的<code>com.itheima.consumer.listener</code>包中新建一个类<code>SpringRabbitListener</code>，代码如下：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">package com.itheima.consumer.listener;</span>
<span class="line"></span>
<span class="line">import org.springframework.amqp.rabbit.annotation.RabbitListener;</span>
<span class="line">import org.springframework.stereotype.Component;</span>
<span class="line"></span>
<span class="line">@Component</span>
<span class="line">public class SpringRabbitListener {</span>
<span class="line">        // 利用RabbitListener来声明要监听的队列信息</span>
<span class="line">    // 将来一旦监听的队列中有了消息，就会推送给当前服务，调用当前方法，处理消息。</span>
<span class="line">    // 可以看到方法体中接收的就是消息体的内容</span>
<span class="line">    @RabbitListener(queues = &quot;simple.queue&quot;)</span>
<span class="line">    public void listenSimpleQueueMessage(String msg) throws InterruptedException {</span>
<span class="line">        System.out.println(&quot;spring 消费者接收到消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-测试" tabindex="-1"><a class="header-anchor" href="#_2-3-测试"><span>2.3 测试</span></a></h3><p>启动consumer服务，然后在publisher服务中运行测试代码，发送MQ消息。最终consumer收到消息：</p><p><img src="`+b+'" alt="img"></p><h2 id="_3-workqueues-模型" tabindex="-1"><a class="header-anchor" href="#_3-workqueues-模型"><span>3 WorkQueues 模型</span></a></h2><p>Work queues，任务模型。简单来说就是<strong>让<strong><strong>多个消费者</strong></strong>绑定到一个队列，共同消费队列中的消息</strong>。</p><p><img src="'+h+'" alt="image-20250624112144490"></p><p>当消息处理比较耗时的时候，可能生产消息的速度会远远大于消息的消费速度。长此以往，消息就会堆积越来越多，无法及时处理。</p><p>此时就可以使用work 模型，<strong>多个消费者共同处理消息处理，消息处理的速度就能大大提高</strong>了。</p><p>接下来，我们就来模拟这样的场景。</p><p>首先，我们在控制台创建一个新的队列，命名为<code>work.queue</code>：</p><p><img src="'+_+`" alt="img"></p><h3 id="_3-1-消息发送" tabindex="-1"><a class="header-anchor" href="#_3-1-消息发送"><span>3.1 消息发送</span></a></h3><p>这次我们循环发送，模拟大量消息堆积现象。</p><p>在publisher服务中的SpringAmqpTest类中添加一个测试方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">/**</span>
<span class="line">     * workQueue</span>
<span class="line">     * 向队列中不停发送消息，模拟消息堆积。</span>
<span class="line">     */</span>
<span class="line">@Test</span>
<span class="line">public void testWorkQueue() throws InterruptedException {</span>
<span class="line">    // 队列名称</span>
<span class="line">    String queueName = &quot;simple.queue&quot;;</span>
<span class="line">    // 消息</span>
<span class="line">    String message = &quot;hello, message_&quot;;</span>
<span class="line">    for (int i = 0; i &lt; 50; i++) {</span>
<span class="line">        // 发送消息，每20毫秒发送一次，相当于每秒发送50条消息</span>
<span class="line">        rabbitTemplate.convertAndSend(queueName, message + i);</span>
<span class="line">        Thread.sleep(20);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-消息接收" tabindex="-1"><a class="header-anchor" href="#_3-2-消息接收"><span>3.2 消息接收</span></a></h3><p>要模拟多个消费者绑定同一个队列，我们在consumer服务的SpringRabbitListener中添加2个新的方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@RabbitListener(queues = &quot;work.queue&quot;)</span>
<span class="line">public void listenWorkQueue1(String msg) throws InterruptedException {</span>
<span class="line">    System.out.println(&quot;消费者1接收到消息：【&quot; + msg + &quot;】&quot; + LocalTime.now());</span>
<span class="line">    Thread.sleep(20);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">@RabbitListener(queues = &quot;work.queue&quot;)</span>
<span class="line">public void listenWorkQueue2(String msg) throws InterruptedException {</span>
<span class="line">    System.err.println(&quot;消费者2........接收到消息：【&quot; + msg + &quot;】&quot; + LocalTime.now());</span>
<span class="line">    Thread.sleep(200);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意到这两消费者，都设置了<code>Thead.sleep</code>，模拟任务耗时：</p><ul><li>消费者1 sleep了20毫秒，相当于每秒钟处理50个消息</li><li>消费者2 sleep了200毫秒，相当于每秒处理5个消息</li></ul><h3 id="_3-3-测试" tabindex="-1"><a class="header-anchor" href="#_3-3-测试"><span>3.3 测试</span></a></h3><p>启动ConsumerApplication后，在执行publisher服务中刚刚编写的发送测试方法testWorkQueue。</p><p>最终结果如下：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">消费者1接收到消息：【hello, message_0】21:06:00.869555300</span>
<span class="line">消费者2........接收到消息：【hello, message_1】21:06:00.884518</span>
<span class="line">消费者1接收到消息：【hello, message_2】21:06:00.907454400</span>
<span class="line">消费者1接收到消息：【hello, message_4】21:06:00.953332100</span>
<span class="line">消费者1接收到消息：【hello, message_6】21:06:00.997867300</span>
<span class="line">消费者1接收到消息：【hello, message_8】21:06:01.042178700</span>
<span class="line">消费者2........接收到消息：【hello, message_3】21:06:01.086478800</span>
<span class="line">消费者1接收到消息：【hello, message_10】21:06:01.087476600</span>
<span class="line">消费者1接收到消息：【hello, message_12】21:06:01.132578300</span>
<span class="line">消费者1接收到消息：【hello, message_14】21:06:01.175851200</span>
<span class="line">消费者1接收到消息：【hello, message_16】21:06:01.218533400</span>
<span class="line">消费者1接收到消息：【hello, message_18】21:06:01.261322900</span>
<span class="line">消费者2........接收到消息：【hello, message_5】21:06:01.287003700</span>
<span class="line">消费者1接收到消息：【hello, message_20】21:06:01.304412400</span>
<span class="line">消费者1接收到消息：【hello, message_22】21:06:01.349950100</span>
<span class="line">消费者1接收到消息：【hello, message_24】21:06:01.394533900</span>
<span class="line">消费者1接收到消息：【hello, message_26】21:06:01.439876500</span>
<span class="line">消费者1接收到消息：【hello, message_28】21:06:01.482937800</span>
<span class="line">消费者2........接收到消息：【hello, message_7】21:06:01.488977100</span>
<span class="line">消费者1接收到消息：【hello, message_30】21:06:01.526409300</span>
<span class="line">消费者1接收到消息：【hello, message_32】21:06:01.572148</span>
<span class="line">消费者1接收到消息：【hello, message_34】21:06:01.618264800</span>
<span class="line">消费者1接收到消息：【hello, message_36】21:06:01.660780600</span>
<span class="line">消费者2........接收到消息：【hello, message_9】21:06:01.689189300</span>
<span class="line">消费者1接收到消息：【hello, message_38】21:06:01.705261</span>
<span class="line">消费者1接收到消息：【hello, message_40】21:06:01.746927300</span>
<span class="line">消费者1接收到消息：【hello, message_42】21:06:01.789835</span>
<span class="line">消费者1接收到消息：【hello, message_44】21:06:01.834393100</span>
<span class="line">消费者1接收到消息：【hello, message_46】21:06:01.875312100</span>
<span class="line">消费者2........接收到消息：【hello, message_11】21:06:01.889969500</span>
<span class="line">消费者1接收到消息：【hello, message_48】21:06:01.920702500</span>
<span class="line">消费者2........接收到消息：【hello, message_13】21:06:02.090725900</span>
<span class="line">消费者2........接收到消息：【hello, message_15】21:06:02.293060600</span>
<span class="line">消费者2........接收到消息：【hello, message_17】21:06:02.493748</span>
<span class="line">消费者2........接收到消息：【hello, message_19】21:06:02.696635100</span>
<span class="line">消费者2........接收到消息：【hello, message_21】21:06:02.896809700</span>
<span class="line">消费者2........接收到消息：【hello, message_23】21:06:03.099533400</span>
<span class="line">消费者2........接收到消息：【hello, message_25】21:06:03.301446400</span>
<span class="line">消费者2........接收到消息：【hello, message_27】21:06:03.504999100</span>
<span class="line">消费者2........接收到消息：【hello, message_29】21:06:03.705702500</span>
<span class="line">消费者2........接收到消息：【hello, message_31】21:06:03.906601200</span>
<span class="line">消费者2........接收到消息：【hello, message_33】21:06:04.108118500</span>
<span class="line">消费者2........接收到消息：【hello, message_35】21:06:04.308945400</span>
<span class="line">消费者2........接收到消息：【hello, message_37】21:06:04.511547700</span>
<span class="line">消费者2........接收到消息：【hello, message_39】21:06:04.714038400</span>
<span class="line">消费者2........接收到消息：【hello, message_41】21:06:04.916192700</span>
<span class="line">消费者2........接收到消息：【hello, message_43】21:06:05.116286400</span>
<span class="line">消费者2........接收到消息：【hello, message_45】21:06:05.318055100</span>
<span class="line">消费者2........接收到消息：【hello, message_47】21:06:05.520656400</span>
<span class="line">消费者2........接收到消息：【hello, message_49】21:06:05.723106700</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到消费者1和消费者2竟然每人消费了25条消息：</p><ul><li>消费者1很快完成了自己的25条消息</li><li>消费者2却在缓慢的处理自己的25条消息。</li></ul><p>也就是说消息是平均分配给每个消费者，并没有考虑到消费者的处理能力。导致1个消费者空闲，另一个消费者忙的不可开交。没有充分利用每一个消费者的能力，最终消息处理的耗时远远超过了1秒。这样显然是有问题的。</p><h3 id="_3-4-能者多劳" tabindex="-1"><a class="header-anchor" href="#_3-4-能者多劳"><span>3.4 能者多劳</span></a></h3><p>在spring中有一个简单的配置，可以解决这个问题。我们修改consumer服务的application.yml文件，添加配置：</p><div class="language-YAML line-numbers-mode" data-highlighter="prismjs" data-ext="YAML" data-title="YAML"><pre><code><span class="line">spring:</span>
<span class="line">  rabbitmq:</span>
<span class="line">    listener:</span>
<span class="line">      simple:</span>
<span class="line">        prefetch: 1 # 每次只能获取一条消息，处理完成才能获取下一个消息</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再次测试，发现结果如下：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">消费者1接收到消息：【hello, message_0】21:12:51.659664200</span>
<span class="line">消费者2........接收到消息：【hello, message_1】21:12:51.680610</span>
<span class="line">消费者1接收到消息：【hello, message_2】21:12:51.703625</span>
<span class="line">消费者1接收到消息：【hello, message_3】21:12:51.724330100</span>
<span class="line">消费者1接收到消息：【hello, message_4】21:12:51.746651100</span>
<span class="line">消费者1接收到消息：【hello, message_5】21:12:51.768401400</span>
<span class="line">消费者1接收到消息：【hello, message_6】21:12:51.790511400</span>
<span class="line">消费者1接收到消息：【hello, message_7】21:12:51.812559800</span>
<span class="line">消费者1接收到消息：【hello, message_8】21:12:51.834500600</span>
<span class="line">消费者1接收到消息：【hello, message_9】21:12:51.857438800</span>
<span class="line">消费者1接收到消息：【hello, message_10】21:12:51.880379600</span>
<span class="line">消费者2........接收到消息：【hello, message_11】21:12:51.899327100</span>
<span class="line">消费者1接收到消息：【hello, message_12】21:12:51.922828400</span>
<span class="line">消费者1接收到消息：【hello, message_13】21:12:51.945617400</span>
<span class="line">消费者1接收到消息：【hello, message_14】21:12:51.968942500</span>
<span class="line">消费者1接收到消息：【hello, message_15】21:12:51.992215400</span>
<span class="line">消费者1接收到消息：【hello, message_16】21:12:52.013325600</span>
<span class="line">消费者1接收到消息：【hello, message_17】21:12:52.035687100</span>
<span class="line">消费者1接收到消息：【hello, message_18】21:12:52.058188</span>
<span class="line">消费者1接收到消息：【hello, message_19】21:12:52.081208400</span>
<span class="line">消费者2........接收到消息：【hello, message_20】21:12:52.103406200</span>
<span class="line">消费者1接收到消息：【hello, message_21】21:12:52.123827300</span>
<span class="line">消费者1接收到消息：【hello, message_22】21:12:52.146165100</span>
<span class="line">消费者1接收到消息：【hello, message_23】21:12:52.168828300</span>
<span class="line">消费者1接收到消息：【hello, message_24】21:12:52.191769500</span>
<span class="line">消费者1接收到消息：【hello, message_25】21:12:52.214839100</span>
<span class="line">消费者1接收到消息：【hello, message_26】21:12:52.238998700</span>
<span class="line">消费者1接收到消息：【hello, message_27】21:12:52.259772600</span>
<span class="line">消费者1接收到消息：【hello, message_28】21:12:52.284131800</span>
<span class="line">消费者2........接收到消息：【hello, message_29】21:12:52.306190600</span>
<span class="line">消费者1接收到消息：【hello, message_30】21:12:52.325315800</span>
<span class="line">消费者1接收到消息：【hello, message_31】21:12:52.347012500</span>
<span class="line">消费者1接收到消息：【hello, message_32】21:12:52.368508600</span>
<span class="line">消费者1接收到消息：【hello, message_33】21:12:52.391785100</span>
<span class="line">消费者1接收到消息：【hello, message_34】21:12:52.416383800</span>
<span class="line">消费者1接收到消息：【hello, message_35】21:12:52.439019</span>
<span class="line">消费者1接收到消息：【hello, message_36】21:12:52.461733900</span>
<span class="line">消费者1接收到消息：【hello, message_37】21:12:52.485990</span>
<span class="line">消费者1接收到消息：【hello, message_38】21:12:52.509219900</span>
<span class="line">消费者2........接收到消息：【hello, message_39】21:12:52.523683400</span>
<span class="line">消费者1接收到消息：【hello, message_40】21:12:52.547412100</span>
<span class="line">消费者1接收到消息：【hello, message_41】21:12:52.571191800</span>
<span class="line">消费者1接收到消息：【hello, message_42】21:12:52.593024600</span>
<span class="line">消费者1接收到消息：【hello, message_43】21:12:52.616731800</span>
<span class="line">消费者1接收到消息：【hello, message_44】21:12:52.640317</span>
<span class="line">消费者1接收到消息：【hello, message_45】21:12:52.663111100</span>
<span class="line">消费者1接收到消息：【hello, message_46】21:12:52.686727</span>
<span class="line">消费者1接收到消息：【hello, message_47】21:12:52.709266500</span>
<span class="line">消费者2........接收到消息：【hello, message_48】21:12:52.725884900</span>
<span class="line">消费者1接收到消息：【hello, message_49】21:12:52.746299900</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以发现，由于消费者1处理速度较快，所以处理了更多的消息；消费者2处理速度较慢，只处理了6条消息。而最终总的执行耗时也在1秒左右，大大提升。</p><p>正所谓能者多劳，这样充分利用了每一个消费者的处理能力，可以有效避免消息积压问题。</p><h3 id="_3-5-总结" tabindex="-1"><a class="header-anchor" href="#_3-5-总结"><span>3.5 总结</span></a></h3><p>Work模型的使用：</p><ul><li>多个消费者绑定到一个队列，同一条消息只会被一个消费者处理</li><li>通过设置prefetch来控制消费者预取的消息数量</li></ul><h2 id="_4-交换机类型" tabindex="-1"><a class="header-anchor" href="#_4-交换机类型"><span>4 交换机类型</span></a></h2><p>在之前的两个测试案例中，都没有交换机，生产者直接发送消息到队列。而一旦引入交换机，消息发送的模式会有很大变化：</p><p><img src="`+q+'" alt="image-20250624113033617"></p><p>可以看到，在订阅模型中，多了一个exchange角色，而且过程略有变化：</p><ul><li><strong>Publisher</strong>：生产者，不再发送消息到队列中，而是发给交换机</li><li><strong>Exchange</strong>：交换机，一方面，接收生产者发送的消息。另一方面，知道如何处理消息，例如递交给某个特别队列、递交给所有队列、或是将消息丢弃。到底如何操作，取决于Exchange的类型。</li><li><strong>Queue</strong>：消息队列也与以前一样，接收消息、缓存消息。不过队列一定要与交换机绑定。</li><li><strong>Consumer</strong>：消费者，与以前一样，订阅队列，没有变化</li></ul><p>**Exchange（交换机）<strong>只负责转发消息，不具备存储消息的能力</strong>，因此如果没有任何队列与Exchange绑定，或者没有符合路由规则的队列，那么消息会丢失！</p><p>交换机的类型有四种：</p><ul><li><strong>Fanout</strong>：广播，将消息交给所有绑定到交换机的队列。我们最早在控制台使用的正是Fanout交换机</li><li><strong>Direct</strong>：订阅，基于RoutingKey（路由key）发送给订阅了消息的队列</li><li><strong>Topic</strong>：通配符订阅，与Direct类似，只不过RoutingKey可以使用通配符</li><li><strong>Headers</strong>：头匹配，基于MQ的消息头匹配，用的较少。</li></ul><p>课堂中，我们讲解前面的三种交换机模式。</p><h2 id="_5-fanout-交换机" tabindex="-1"><a class="header-anchor" href="#_5-fanout-交换机"><span>5 Fanout 交换机</span></a></h2><p>Fanout，英文翻译是扇出，我觉得在MQ中叫广播更合适。</p><p>在广播模式下，消息发送流程是这样的：</p><p><img src="'+x+'" alt="img"></p><ul><li>1） 可以有多个队列</li><li>2） 每个队列都要绑定到Exchange（交换机）</li><li>3） 生产者发送的消息，只能发送到交换机</li><li>4） 交换机把消息发送给绑定过的所有队列</li><li>5） 订阅队列的消费者都能拿到消息</li></ul><p>我们的计划是这样的：</p><p><img src="'+f+'" alt="img"></p><ul><li>创建一个名为<code> hmall.fanout</code>的交换机，类型是<code>Fanout</code></li><li>创建两个队列<code>fanout.queue1</code>和<code>fanout.queue2</code>，绑定到交换机<code>hmall.fanout</code></li></ul><h3 id="_5-1-声明队列和交换机" tabindex="-1"><a class="header-anchor" href="#_5-1-声明队列和交换机"><span>5.1 声明队列和交换机</span></a></h3><p>在控制台创建队列<code>fanout.queue1</code>:</p><p><img src="'+k+'" alt="image-20250624113632152"></p><p>在创建一个队列<code>fanout.queue2</code>：</p><p><img src="'+y+'" alt="image-20250624113641028"></p><p>然后再创建一个交换机：</p><p><img src="'+Q+'" alt="image-20250624113700092"></p><p>然后绑定两个队列到交换机：</p><p><img src="'+S+'" alt="image-20250624113716690"></p><p><img src="'+w+`" alt="image-20250624113732072"></p><h3 id="_5-2-消息发送" tabindex="-1"><a class="header-anchor" href="#_5-2-消息发送"><span>5.2 消息发送</span></a></h3><p>在publisher服务的SpringAmqpTest类中添加测试方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@Test</span>
<span class="line">public void testFanoutExchange() {</span>
<span class="line">    // 交换机名称</span>
<span class="line">    String exchangeName = &quot;hmall.fanout&quot;;</span>
<span class="line">    // 消息</span>
<span class="line">    String message = &quot;hello, everyone!&quot;;</span>
<span class="line">    rabbitTemplate.convertAndSend(exchangeName, &quot;&quot;, message);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-消息接收" tabindex="-1"><a class="header-anchor" href="#_5-3-消息接收"><span>5.3 消息接收</span></a></h3><p>在consumer服务的SpringRabbitListener中添加两个方法，作为消费者：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@RabbitListener(queues = &quot;fanout.queue1&quot;)</span>
<span class="line">public void listenFanoutQueue1(String msg) {</span>
<span class="line">    System.out.println(&quot;消费者1接收到Fanout消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">@RabbitListener(queues = &quot;fanout.queue2&quot;)</span>
<span class="line">public void listenFanoutQueue2(String msg) {</span>
<span class="line">    System.out.println(&quot;消费者2接收到Fanout消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-总结" tabindex="-1"><a class="header-anchor" href="#_5-4-总结"><span>5.4 总结</span></a></h3><p>交换机的作用是什么？</p><ul><li>接收publisher发送的消息</li><li>将消息按照规则路由到与之绑定的队列</li><li>不能缓存消息，路由失败，消息丢失</li><li>FanoutExchange的会将消息路由到每个绑定的队列</li></ul><h2 id="_6-direct-交换机" tabindex="-1"><a class="header-anchor" href="#_6-direct-交换机"><span>6 Direct 交换机</span></a></h2><p>在Fanout模式中，一条消息，会被所有订阅的队列都消费。但是，在某些场景下，我们希望不同的消息被不同的队列消费。这时就要用到Direct类型的Exchange。</p><p><img src="`+J+'" alt="image-20250624113826263"></p><p>在Direct模型下：</p><ul><li>队列与交换机的绑定，不能是任意绑定了，而是要指定一个<code>RoutingKey</code>（路由key）</li><li>消息的发送方在 向 Exchange发送消息时，也必须指定消息的 <code>RoutingKey</code>。</li><li>Exchange不再把消息交给每一个绑定的队列，而是根据消息的<code>Routing Key</code>进行判断，只有队列的<code>Routingkey</code>与消息的 <code>Routing key</code>完全一致，才会接收到消息</li></ul><p><strong>案例需求如图</strong>：</p><p><img src="'+M+'" alt="image-20250624113842152"></p><ol><li>声明一个名为<code>hmall.direct</code>的交换机</li><li>声明队列<code>direct.queue1</code>，绑定<code>hmall.direct</code>，<code>bindingKey</code>为<code>blud</code>和<code>red</code></li><li>声明队列<code>direct.queue2</code>，绑定<code>hmall.direct</code>，<code>bindingKey</code>为<code>yellow</code>和<code>red</code></li><li>在<code>consumer</code>服务中，编写两个消费者方法，分别监听direct.queue1和direct.queue2</li><li>在publisher中编写测试方法，向<code>hmall.direct</code>发送消息</li></ol><h3 id="_6-1-声明队列和交换机" tabindex="-1"><a class="header-anchor" href="#_6-1-声明队列和交换机"><span>6.1 声明队列和交换机</span></a></h3><p>首先在控制台声明两个队列<code>direct.queue1</code>和<code>direct.queue2</code>，这里不再展示过程：</p><p><img src="'+B+'" alt="image-20250624113916949"></p><p>然后声明一个direct类型的交换机，命名为<code>hmall.direct</code>:</p><p><img src="'+j+'" alt="image-20250624113928565"></p><p>然后使用<code>red</code>和<code>blue</code>作为key，绑定<code>direct.queue1</code>到<code>hmall.direct</code>：</p><p><img src="'+T+'" alt="image-20250624113943780"></p><p><img src="'+E+'" alt="image-20250624114001488"></p><p>同理，使用<code>red</code>和<code>yellow</code>作为key，绑定<code>direct.queue2</code>到<code>hmall.direct</code>，步骤略，最终结果：</p><p><img src="'+D+`" alt="image-20250624114015597"></p><h3 id="_6-2-消息接收" tabindex="-1"><a class="header-anchor" href="#_6-2-消息接收"><span>6.2 消息接收</span></a></h3><p>在consumer服务的SpringRabbitListener中添加方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@RabbitListener(queues = &quot;direct.queue1&quot;)</span>
<span class="line">public void listenDirectQueue1(String msg) {</span>
<span class="line">    System.out.println(&quot;消费者1接收到direct.queue1的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">@RabbitListener(queues = &quot;direct.queue2&quot;)</span>
<span class="line">public void listenDirectQueue2(String msg) {</span>
<span class="line">    System.out.println(&quot;消费者2接收到direct.queue2的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-消息发送" tabindex="-1"><a class="header-anchor" href="#_6-3-消息发送"><span>6.3 消息发送</span></a></h3><p>在publisher服务的SpringAmqpTest类中添加测试方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@Test</span>
<span class="line">public void testSendDirectExchange() {</span>
<span class="line">    // 交换机名称</span>
<span class="line">    String exchangeName = &quot;hmall.direct&quot;;</span>
<span class="line">    // 消息</span>
<span class="line">    String message = &quot;红色警报！日本乱排核废水，导致海洋生物变异，惊现哥斯拉！&quot;;</span>
<span class="line">    // 发送消息</span>
<span class="line">    rabbitTemplate.convertAndSend(exchangeName, &quot;red&quot;, message);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于使用的red这个key，所以两个消费者都收到了消息：</p><p><img src="`+R+`" alt="image-20250624114104554"></p><p>我们再切换为blue这个key：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@Test</span>
<span class="line">public void testSendDirectExchange() {</span>
<span class="line">    // 交换机名称</span>
<span class="line">    String exchangeName = &quot;hmall.direct&quot;;</span>
<span class="line">    // 消息</span>
<span class="line">    String message = &quot;最新报道，哥斯拉是居民自治巨型气球，虚惊一场！&quot;;</span>
<span class="line">    // 发送消息</span>
<span class="line">    rabbitTemplate.convertAndSend(exchangeName, &quot;blue&quot;, message);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你会发现，只有消费者1收到了消息：</p><p><img src="`+A+'" alt="image-20250624114119781"></p><h3 id="_6-4-总结" tabindex="-1"><a class="header-anchor" href="#_6-4-总结"><span>6.4 总结</span></a></h3><p>描述下Direct交换机与Fanout交换机的差异？</p><ul><li>Fanout交换机将消息路由给每一个与之绑定的队列</li><li>Direct交换机根据RoutingKey判断路由给哪个队列</li><li>如果多个队列具有相同的RoutingKey，则与Fanout功能类似</li></ul><h2 id="_7-topic-交换机" tabindex="-1"><a class="header-anchor" href="#_7-topic-交换机"><span>7 Topic 交换机</span></a></h2><h3 id="_7-1-说明" tabindex="-1"><a class="header-anchor" href="#_7-1-说明"><span>7.1 说明</span></a></h3><p><code>Topic</code>类型的<code>Exchange</code>与<code>Direct</code>相比，都是可以根据<code>RoutingKey</code>把消息路由到不同的队列。</p><p>只不过<code>Topic</code>类型<code>Exchange</code>可以让队列在绑定<code>BindingKey</code> 的时候使用通配符！</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">BindingKey` 一般都是有一个或多个单词组成，多个单词之间以`.`分割，例如： `item.insert</span>\n<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>通配符规则：</p><ul><li><code>#</code>：匹配一个或多个词</li><li><code>*</code>：匹配不多不少恰好1个词</li></ul><p>举例：</p><ul><li><code>item.#</code>：能够匹配<code>item.spu.insert</code> 或者 <code>item.spu</code></li><li><code>item.*</code>：只能匹配<code>item.spu</code></li></ul><p>图示：</p><p><img src="'+I+'" alt="image-20250624114204947"></p><p>假如此时publisher发送的消息使用的<code>RoutingKey</code>共有四种：</p><ul><li><code>china.news </code>代表有中国的新闻消息；</li><li><code>china.weather</code> 代表中国的天气消息；</li><li><code>japan.news</code> 则代表日本新闻</li><li><code>japan.weather</code> 代表日本的天气消息；</li></ul><p>解释：</p><ul><li><code>topic.queue1</code>：绑定的是<code>china.#</code> ，凡是以 <code>china.</code>开头的<code>routing key</code> 都会被匹配到，包括： <ul><li><code>china.news</code></li><li><code>china.weather</code></li></ul></li><li><code>topic.queue2</code>：绑定的是<code>#.news</code> ，凡是以 <code>.news</code>结尾的 <code>routing key</code> 都会被匹配。包括: <ul><li><code>china.news</code></li><li><code>japan.news</code></li></ul></li></ul><p>接下来，我们就按照上图所示，来演示一下Topic交换机的用法。</p><p>首先，在控制台按照图示例子创建队列、交换机，并利用通配符绑定队列和交换机。此处步骤略。最终结果如下：</p><p><img src="'+L+`" alt="image-20250624114217880"></p><h3 id="_7-2-消息发送" tabindex="-1"><a class="header-anchor" href="#_7-2-消息发送"><span>7.2 消息发送</span></a></h3><p>在publisher服务的SpringAmqpTest类中添加测试方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">/**</span>
<span class="line"> * topicExchange</span>
<span class="line"> */</span>
<span class="line">@Test</span>
<span class="line">public void testSendTopicExchange() {</span>
<span class="line">    // 交换机名称</span>
<span class="line">    String exchangeName = &quot;hmall.topic&quot;;</span>
<span class="line">    // 消息</span>
<span class="line">    String message = &quot;喜报！孙悟空大战哥斯拉，胜!&quot;;</span>
<span class="line">    // 发送消息</span>
<span class="line">    rabbitTemplate.convertAndSend(exchangeName, &quot;china.news&quot;, message);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-消息接收" tabindex="-1"><a class="header-anchor" href="#_7-3-消息接收"><span>7.3 消息接收</span></a></h3><p>在consumer服务的SpringRabbitListener中添加方法：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@RabbitListener(queues = &quot;topic.queue1&quot;)</span>
<span class="line">public void listenTopicQueue1(String msg){</span>
<span class="line">    System.out.println(&quot;消费者1接收到topic.queue1的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">@RabbitListener(queues = &quot;topic.queue2&quot;)</span>
<span class="line">public void listenTopicQueue2(String msg){</span>
<span class="line">    System.out.println(&quot;消费者2接收到topic.queue2的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-总结" tabindex="-1"><a class="header-anchor" href="#_7-4-总结"><span>7.4 总结</span></a></h3><p>描述下Direct交换机与Topic交换机的差异？</p><ul><li>Topic交换机接收的消息RoutingKey必须是多个单词，以 <strong><code>.</code></strong> 分割</li><li>Topic交换机与队列绑定时的bindingKey可以指定通配符</li><li><code>#</code>：代表0个或多个词</li><li><code>*</code>：代表1个词</li></ul><h2 id="_8-声明队列和交换机" tabindex="-1"><a class="header-anchor" href="#_8-声明队列和交换机"><span>8 声明队列和交换机</span></a></h2><p>在之前我们都是基于RabbitMQ控制台来创建队列、交换机。但是在实际开发时，队列和交换机是程序员定义的，将来项目上线，又要交给运维去创建。那么程序员就需要把程序中运行的所有队列和交换机都写下来，交给运维。在这个过程中是很容易出现错误的。</p><p>因此推荐的做法是由程序启动时检查队列和交换机是否存在，如果不存在自动创建。</p><h3 id="_8-1-基本-api" tabindex="-1"><a class="header-anchor" href="#_8-1-基本-api"><span>8.1 基本 API</span></a></h3><p>SpringAMQP提供了一个Queue类，用来创建队列：</p><p><img src="`+C+'" alt="image-20250624114320938"></p><p>SpringAMQP还提供了一个Exchange接口，来表示所有不同类型的交换机：</p><p><img src="'+P+'" alt="image-20250624114339906"></p><p>我们可以自己创建队列和交换机，不过SpringAMQP还提供了ExchangeBuilder来简化这个过程：</p><p><img src="'+F+'" alt="image-20250624114353556"></p><p>而在绑定队列和交换机时，则需要使用BindingBuilder来创建Binding对象：</p><p><img src="'+K+`" alt="image-20250624114428765"></p><h3 id="_8-2-fanout-示例" tabindex="-1"><a class="header-anchor" href="#_8-2-fanout-示例"><span>8.2 fanout 示例</span></a></h3><p>在consumer中创建一个类，声明队列和交换机：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">package com.itheima.consumer.config;</span>
<span class="line"></span>
<span class="line">import org.springframework.amqp.core.Binding;</span>
<span class="line">import org.springframework.amqp.core.BindingBuilder;</span>
<span class="line">import org.springframework.amqp.core.FanoutExchange;</span>
<span class="line">import org.springframework.amqp.core.Queue;</span>
<span class="line">import org.springframework.context.annotation.Bean;</span>
<span class="line">import org.springframework.context.annotation.Configuration;</span>
<span class="line"></span>
<span class="line">@Configuration</span>
<span class="line">public class FanoutConfig {</span>
<span class="line">    /**</span>
<span class="line">     * 声明交换机</span>
<span class="line">     * @return Fanout类型交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public FanoutExchange fanoutExchange(){</span>
<span class="line">        return new FanoutExchange(&quot;hmall.fanout&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 第1个队列</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Queue fanoutQueue1(){</span>
<span class="line">        return new Queue(&quot;fanout.queue1&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 绑定队列和交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Binding bindingQueue1(Queue fanoutQueue1, FanoutExchange fanoutExchange){</span>
<span class="line">        return BindingBuilder.bind(fanoutQueue1).to(fanoutExchange);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 第2个队列</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Queue fanoutQueue2(){</span>
<span class="line">        return new Queue(&quot;fanout.queue2&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 绑定队列和交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Binding bindingQueue2(Queue fanoutQueue2, FanoutExchange fanoutExchange){</span>
<span class="line">        return BindingBuilder.bind(fanoutQueue2).to(fanoutExchange);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-direct-示例" tabindex="-1"><a class="header-anchor" href="#_8-3-direct-示例"><span>8.3 direct 示例</span></a></h3><p>direct模式由于要绑定多个KEY，会非常麻烦，每一个Key都要编写一个binding：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">package com.itheima.consumer.config;</span>
<span class="line"></span>
<span class="line">import org.springframework.amqp.core.*;</span>
<span class="line">import org.springframework.context.annotation.Bean;</span>
<span class="line">import org.springframework.context.annotation.Configuration;</span>
<span class="line"></span>
<span class="line">@Configuration</span>
<span class="line">public class DirectConfig {</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 声明交换机</span>
<span class="line">     * @return Direct类型交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public DirectExchange directExchange(){</span>
<span class="line">        return ExchangeBuilder.directExchange(&quot;hmall.direct&quot;).build();</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 第1个队列</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Queue directQueue1(){</span>
<span class="line">        return new Queue(&quot;direct.queue1&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 绑定队列和交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Binding bindingQueue1WithRed(Queue directQueue1, DirectExchange directExchange){</span>
<span class="line">        return BindingBuilder.bind(directQueue1).to(directExchange).with(&quot;red&quot;);</span>
<span class="line">    }</span>
<span class="line">    /**</span>
<span class="line">     * 绑定队列和交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Binding bindingQueue1WithBlue(Queue directQueue1, DirectExchange directExchange){</span>
<span class="line">        return BindingBuilder.bind(directQueue1).to(directExchange).with(&quot;blue&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 第2个队列</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Queue directQueue2(){</span>
<span class="line">        return new Queue(&quot;direct.queue2&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    /**</span>
<span class="line">     * 绑定队列和交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Binding bindingQueue2WithRed(Queue directQueue2, DirectExchange directExchange){</span>
<span class="line">        return BindingBuilder.bind(directQueue2).to(directExchange).with(&quot;red&quot;);</span>
<span class="line">    }</span>
<span class="line">    /**</span>
<span class="line">     * 绑定队列和交换机</span>
<span class="line">     */</span>
<span class="line">    @Bean</span>
<span class="line">    public Binding bindingQueue2WithYellow(Queue directQueue2, DirectExchange directExchange){</span>
<span class="line">        return BindingBuilder.bind(directQueue2).to(directExchange).with(&quot;yellow&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-基于注解声明" tabindex="-1"><a class="header-anchor" href="#_8-4-基于注解声明"><span>8.4 基于注解声明</span></a></h3><p>基于@Bean的方式声明队列和交换机比较麻烦，Spring还提供了基于注解方式来声明。</p><p>例如，我们同样声明Direct模式的交换机和队列：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@RabbitListener(bindings = @QueueBinding(</span>
<span class="line">    value = @Queue(name = &quot;direct.queue1&quot;),</span>
<span class="line">    exchange = @Exchange(name = &quot;hmall.direct&quot;, type = ExchangeTypes.DIRECT),</span>
<span class="line">    key = {&quot;red&quot;, &quot;blue&quot;}</span>
<span class="line">))</span>
<span class="line">public void listenDirectQueue1(String msg){</span>
<span class="line">    System.out.println(&quot;消费者1接收到direct.queue1的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">@RabbitListener(bindings = @QueueBinding(</span>
<span class="line">    value = @Queue(name = &quot;direct.queue2&quot;),</span>
<span class="line">    exchange = @Exchange(name = &quot;hmall.direct&quot;, type = ExchangeTypes.DIRECT),</span>
<span class="line">    key = {&quot;red&quot;, &quot;yellow&quot;}</span>
<span class="line">))</span>
<span class="line">public void listenDirectQueue2(String msg){</span>
<span class="line">    System.out.println(&quot;消费者2接收到direct.queue2的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>是不是简单多了。</p><p>再试试Topic模式：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@RabbitListener(bindings = @QueueBinding(</span>
<span class="line">    value = @Queue(name = &quot;topic.queue1&quot;),</span>
<span class="line">    exchange = @Exchange(name = &quot;hmall.topic&quot;, type = ExchangeTypes.TOPIC),</span>
<span class="line">    key = &quot;china.#&quot;</span>
<span class="line">))</span>
<span class="line">public void listenTopicQueue1(String msg){</span>
<span class="line">    System.out.println(&quot;消费者1接收到topic.queue1的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">@RabbitListener(bindings = @QueueBinding(</span>
<span class="line">    value = @Queue(name = &quot;topic.queue2&quot;),</span>
<span class="line">    exchange = @Exchange(name = &quot;hmall.topic&quot;, type = ExchangeTypes.TOPIC),</span>
<span class="line">    key = &quot;#.news&quot;</span>
<span class="line">))</span>
<span class="line">public void listenTopicQueue2(String msg){</span>
<span class="line">    System.out.println(&quot;消费者2接收到topic.queue2的消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-消息转换器" tabindex="-1"><a class="header-anchor" href="#_9-消息转换器"><span>9 消息转换器</span></a></h2><p>Spring的消息发送代码接收的消息体是一个Object：</p><p><img src="`+N+'" alt="image-20250624114541413"></p><p>而在数据传输时，它会把你发送的消息序列化为字节发送给MQ，接收消息的时候，还会把字节反序列化为Java对象。</p><p>只不过，默认情况下Spring采用的序列化方式是JDK序列化。众所周知，JDK序列化存在下列问题：</p><ul><li>数据体积过大</li><li>有安全漏洞</li><li>可读性差</li></ul><p>我们来测试一下。</p><h3 id="_9-1-测试默认转换器" tabindex="-1"><a class="header-anchor" href="#_9-1-测试默认转换器"><span>9.1 测试默认转换器</span></a></h3><p>1）创建测试队列</p><p>首先，我们在consumer服务中声明一个新的配置类：</p><p><img src="'+O+`" alt="image-20250624114806314"></p><p>利用@Bean的方式创建一个队列，</p><p>具体代码：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">package com.itheima.consumer.config;</span>
<span class="line"></span>
<span class="line">import org.springframework.amqp.core.Queue;</span>
<span class="line">import org.springframework.context.annotation.Bean;</span>
<span class="line">import org.springframework.context.annotation.Configuration;</span>
<span class="line"></span>
<span class="line">@Configuration</span>
<span class="line">public class MessageConfig {</span>
<span class="line"></span>
<span class="line">    @Bean</span>
<span class="line">    public Queue objectQueue() {</span>
<span class="line">        return new Queue(&quot;object.queue&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，这里我们先不要给这个队列添加消费者，我们要查看消息体的格式。</p><p>重启consumer服务以后，该队列就会被自动创建出来了：</p><p><img src="`+W+`" alt="image-20250624114629748.png"></p><p>2）发送消息</p><p>我们在publisher模块的SpringAmqpTest中新增一个消息发送的代码，发送一个Map对象：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@Test</span>
<span class="line">public void testSendMap() throws InterruptedException {</span>
<span class="line">    // 准备消息</span>
<span class="line">    Map&lt;String,Object&gt; msg = new HashMap&lt;&gt;();</span>
<span class="line">    msg.put(&quot;name&quot;, &quot;柳岩&quot;);</span>
<span class="line">    msg.put(&quot;age&quot;, 21);</span>
<span class="line">    // 发送消息</span>
<span class="line">    rabbitTemplate.convertAndSend(&quot;object.queue&quot;, msg);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发送消息后查看控制台：</p><p><img src="`+Y+`" alt="image-20250624114940169"></p><p>可以看到消息格式非常不友好。</p><h3 id="_9-2-配置-json-转换器" tabindex="-1"><a class="header-anchor" href="#_9-2-配置-json-转换器"><span>9.2 配置 JSON 转换器</span></a></h3><p>显然，JDK序列化方式并不合适。我们希望消息体的体积更小、可读性更高，因此可以使用JSON方式来做序列化和反序列化。</p><p>在<code>publisher</code>和<code>consumer</code>两个服务中都引入依赖：</p><div class="language-XML line-numbers-mode" data-highlighter="prismjs" data-ext="XML" data-title="XML"><pre><code><span class="line">&lt;dependency&gt;</span>
<span class="line">    &lt;groupId&gt;com.fasterxml.jackson.dataformat&lt;/groupId&gt;</span>
<span class="line">    &lt;artifactId&gt;jackson-dataformat-xml&lt;/artifactId&gt;</span>
<span class="line">    &lt;version&gt;2.9.10&lt;/version&gt;</span>
<span class="line">&lt;/dependency&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，如果项目中引入了<code>spring-boot-starter-\`\`web</code>依赖，则无需再次引入<code>Jackson</code>依赖。</p><p>配置消息转换器，在<code>publisher</code>和<code>consumer</code>两个服务的启动类中添加一个Bean即可：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@Bean</span>
<span class="line">public MessageConverter messageConverter(){</span>
<span class="line">    // 1.定义消息转换器</span>
<span class="line">    Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter();</span>
<span class="line">    // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息</span>
<span class="line">    jackson2JsonMessageConverter.setCreateMessageIds(true);</span>
<span class="line">    return jackson2JsonMessageConverter;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>消息转换器中添加的messageId可以便于我们将来做幂等性判断。</p><p>此时，我们到MQ控制台<strong>删除</strong><code>object.queue</code>中的旧的消息。然后再次执行刚才的消息发送的代码，到MQ的控制台查看消息结构：</p><p><img src="`+X+`" alt="image-20250624115030071"></p><h3 id="_9-3-消费者接收-object" tabindex="-1"><a class="header-anchor" href="#_9-3-消费者接收-object"><span>9.3 消费者接收 Object</span></a></h3><p>我们在consumer服务中定义一个新的消费者，publisher是用Map发送，那么消费者也一定要用Map接收，格式如下：</p><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@RabbitListener(queues = &quot;object.queue&quot;)</span>
<span class="line">public void listenSimpleQueueMessage(Map&lt;String, Object&gt; msg) throws InterruptedException {</span>
<span class="line">    System.out.println(&quot;消费者接收到object.queue消息：【&quot; + msg + &quot;】&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,232))])}const G=i(V,[["render",Z]]),$=JSON.parse('{"path":"/docs/Java/Heima/Microservices/Day06_MqBasic/3-MqBasic.html","title":"SpringAMQP","lang":"en-US","frontmatter":{"title":"SpringAMQP","date":"2025/03/06"},"headers":[{"level":2,"title":"1 导入 Demo 工程","slug":"_1-导入-demo-工程","link":"#_1-导入-demo-工程","children":[]},{"level":2,"title":"2 快速入门","slug":"_2-快速入门","link":"#_2-快速入门","children":[{"level":3,"title":"2.1 消息发送","slug":"_2-1-消息发送","link":"#_2-1-消息发送","children":[]},{"level":3,"title":"2.2 消息接收","slug":"_2-2-消息接收","link":"#_2-2-消息接收","children":[]},{"level":3,"title":"2.3 测试","slug":"_2-3-测试","link":"#_2-3-测试","children":[]}]},{"level":2,"title":"3 WorkQueues 模型","slug":"_3-workqueues-模型","link":"#_3-workqueues-模型","children":[{"level":3,"title":"3.1 消息发送","slug":"_3-1-消息发送","link":"#_3-1-消息发送","children":[]},{"level":3,"title":"3.2 消息接收","slug":"_3-2-消息接收","link":"#_3-2-消息接收","children":[]},{"level":3,"title":"3.3 测试","slug":"_3-3-测试","link":"#_3-3-测试","children":[]},{"level":3,"title":"3.4 能者多劳","slug":"_3-4-能者多劳","link":"#_3-4-能者多劳","children":[]},{"level":3,"title":"3.5 总结","slug":"_3-5-总结","link":"#_3-5-总结","children":[]}]},{"level":2,"title":"4 交换机类型","slug":"_4-交换机类型","link":"#_4-交换机类型","children":[]},{"level":2,"title":"5 Fanout 交换机","slug":"_5-fanout-交换机","link":"#_5-fanout-交换机","children":[{"level":3,"title":"5.1 声明队列和交换机","slug":"_5-1-声明队列和交换机","link":"#_5-1-声明队列和交换机","children":[]},{"level":3,"title":"5.2 消息发送","slug":"_5-2-消息发送","link":"#_5-2-消息发送","children":[]},{"level":3,"title":"5.3 消息接收","slug":"_5-3-消息接收","link":"#_5-3-消息接收","children":[]},{"level":3,"title":"5.4 总结","slug":"_5-4-总结","link":"#_5-4-总结","children":[]}]},{"level":2,"title":"6 Direct 交换机","slug":"_6-direct-交换机","link":"#_6-direct-交换机","children":[{"level":3,"title":"6.1 声明队列和交换机","slug":"_6-1-声明队列和交换机","link":"#_6-1-声明队列和交换机","children":[]},{"level":3,"title":"6.2 消息接收","slug":"_6-2-消息接收","link":"#_6-2-消息接收","children":[]},{"level":3,"title":"6.3 消息发送","slug":"_6-3-消息发送","link":"#_6-3-消息发送","children":[]},{"level":3,"title":"6.4 总结","slug":"_6-4-总结","link":"#_6-4-总结","children":[]}]},{"level":2,"title":"7 Topic 交换机","slug":"_7-topic-交换机","link":"#_7-topic-交换机","children":[{"level":3,"title":"7.1 说明","slug":"_7-1-说明","link":"#_7-1-说明","children":[]},{"level":3,"title":"7.2 消息发送","slug":"_7-2-消息发送","link":"#_7-2-消息发送","children":[]},{"level":3,"title":"7.3 消息接收","slug":"_7-3-消息接收","link":"#_7-3-消息接收","children":[]},{"level":3,"title":"7.4 总结","slug":"_7-4-总结","link":"#_7-4-总结","children":[]}]},{"level":2,"title":"8 声明队列和交换机","slug":"_8-声明队列和交换机","link":"#_8-声明队列和交换机","children":[{"level":3,"title":"8.1 基本 API","slug":"_8-1-基本-api","link":"#_8-1-基本-api","children":[]},{"level":3,"title":"8.2 fanout 示例","slug":"_8-2-fanout-示例","link":"#_8-2-fanout-示例","children":[]},{"level":3,"title":"8.3 direct 示例","slug":"_8-3-direct-示例","link":"#_8-3-direct-示例","children":[]},{"level":3,"title":"8.4 基于注解声明","slug":"_8-4-基于注解声明","link":"#_8-4-基于注解声明","children":[]}]},{"level":2,"title":"9 消息转换器","slug":"_9-消息转换器","link":"#_9-消息转换器","children":[{"level":3,"title":"9.1 测试默认转换器","slug":"_9-1-测试默认转换器","link":"#_9-1-测试默认转换器","children":[]},{"level":3,"title":"9.2 配置 JSON 转换器","slug":"_9-2-配置-json-转换器","link":"#_9-2-配置-json-转换器","children":[]},{"level":3,"title":"9.3 消费者接收 Object","slug":"_9-3-消费者接收-object","link":"#_9-3-消费者接收-object","children":[]}]}],"filePathRelative":"docs/Java/Heima/Microservices/Day06_MqBasic/3-MqBasic.md","git":{"createdTime":1741251281000,"updatedTime":1750737247000,"contributors":[{"name":"lixuan","email":"2789968443@qq.com","commits":2}]}}');export{G as comp,$ as data};
