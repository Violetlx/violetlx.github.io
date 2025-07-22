import{_ as e,c as n,b as a,o as i}from"./app-B_5tQx1u.js";const l={};function d(t,s){return i(),n("div",null,s[0]||(s[0]=[a(`<p><img src="https://bizhi1.com/wp-content/uploads/2024/06/one-piece-law-sword-yellow-desktop-wallpaper-small.jpg" alt="海贼王 法则之剑 黄色 桌面壁纸"></p><div class="custom-container tip"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01"></path><path d="M11 12h1v4h1"></path></g></svg><p class="custom-container-title">TIP</p><p>【概论&amp;&amp;数据表示，寻址方式，指令系统】</p><p>【存储，中断，总线与IO系统】</p><p>【标量，向量，多处理，归纳机】</p></div><h2 id="【概论-数据表示-寻址方式-指令系统】" tabindex="-1"><a class="header-anchor" href="#【概论-数据表示-寻址方式-指令系统】"><span><strong>【概论&amp;&amp;数据表示，寻址方式，指令系统】</strong></span></a></h2><ol><li><p>计算机多成次结构包含哪些</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token number">1.</span>应用语言</span>
<span class="line"><span class="token number">2.</span>高级语言</span>
<span class="line"><span class="token number">3.</span>汇编</span>
<span class="line"><span class="token number">4.</span>操作系统</span>
<span class="line"><span class="token number">5.</span>传统机器</span>
<span class="line"><span class="token number">6.</span>微程序机器</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>简述计算机系统的定量设计原理（计算机系统设计原理）</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1、哈夫曼压缩：尽可能加速处理高概率的事件远比处理低概率事件对性能提高更显著</span>
<span class="line">2、Amdahl定律：对性能瓶颈部件采取高速度后系统性能改进程度</span>
<span class="line">3、程序访问局部性定律</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>程序的局部性原理</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">程序在执行时候所访问地址和指令的分布不是随机的，相对在聚集。程序局部性包括空间局部性和时间局部性</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>标量处理机全局相关处理方法有哪些</p><div class="language-C++ line-numbers-mode" data-highlighter="prismjs" data-ext="C++" data-title="C++"><pre><code><span class="line">1.猜测法</span>
<span class="line">2.加快和提前生成条件码</span>
<span class="line">3.延迟转移</span>
<span class="line">4.加快短循环程序处理</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>从计算机执行程序处理角度/处理数据角度看，并行等级从低到高分为几个等级</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">程序角度</span>
<span class="line">- 指令内部（微操作并行） </span>
<span class="line">- 指令间并行</span>
<span class="line">- 任务或进程</span>
<span class="line">- 作业或程序</span>
<span class="line">处理数据角度</span>
<span class="line">- WSBS 位串字串（单字节一位处理）</span>
<span class="line">- WSBP 位并字串（单字节处理）</span>
<span class="line">- WPSB 位片串字并（多字节中同位处理）</span>
<span class="line">- WPBP 全并行（多字节处理）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>计算机系统分类（佛林-Flynn）</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">- SISD（单指令流单数据）单处理计算机</span>
<span class="line">- SIMD（单指令多流数据）多操作部件处理机</span>
<span class="line">- MISD（多指令单流数据）指令级多道程序单处理机</span>
<span class="line">- MIMD（多指令多流数据）多处理机系统</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>CISC与RISC优缺点</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">CISC：复杂指令系统计算机，设置更为复杂的新指令代替程序实现其功能，软件功能硬件化（面向程序，高级语言，操作系统）。</span>
<span class="line">缺点：</span>
<span class="line"> 1.指令系统庞大，功能复杂，系统可靠性低</span>
<span class="line"> 2.指令操作复杂，执行速度低</span>
<span class="line"> 3.不利于编译器编译优化</span>
<span class="line"> 4.指令使用频率低</span>
<span class="line"></span>
<span class="line">RISC：减少指令种类和简化指令功能来降低硬件设计的复杂度，提高指令的执行速度</span>
<span class="line">1. 简化指令系统设计</span>
<span class="line">2. 提高计算机执行速度和效率</span>
<span class="line">3. 降低设计成本</span>
<span class="line">4. 加重汇编语言程序，编译程序设计</span>
<span class="line">5. 对虚拟机和特殊计算支持有限</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>RISC设计基本原则</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1. 选择高频指令进行优化</span>
<span class="line">2. 减少指令系统寻址方式</span>
<span class="line">3. 让所有指令在同一个机器周期完成</span>
<span class="line">4. 扩大通用寄存器数，尽量减少主存访问</span>
<span class="line">5. 大多数指令由硬件完成，少数指令使用微程序完成</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>浮点数尾数下溢处理方法</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1. 截断法(将尾数超出计算字长的部分截取，误差大，无法调节)</span>
<span class="line">2. 舍入法(增加附加位，存放溢出部分最高位，当尾数下溢处理时将附加位加1，误差小，处理速度慢)</span>
<span class="line">3. 恒加1法(将规定字长最低位设置为1，误差最大,实现简单)</span>
<span class="line">4. 查表舍入法(误差小,速度快,需要硬件支持)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="【存储-中断-总线与io系统】" tabindex="-1"><a class="header-anchor" href="#【存储-中断-总线与io系统】"><span><strong>【存储，中断，总线与IO系统】</strong></span></a></h2><ol><li><p>中断及中断系统定义</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">中断：CPU中止当前执行的任务，转去处理其他请求任务，待任务处理完成后，在恢复执行之前被打断的任务。</span>
<span class="line">中断系统：响应和处理软，硬件发起的中断</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>总线控制和通讯方式</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">控制方式：</span>
<span class="line"> 1.串行连接（控制线少，扩充简单，不灵活，部件异常后影响其他部件）</span>
<span class="line"> 2.定时查询</span>
<span class="line"> 3.独立请求</span>
<span class="line"></span>
<span class="line">通讯方式：</span>
<span class="line"> 1.同步（采用统一时钟频率，适用于总线长度较短及部件存取时间接近系统的部件，传输速度快，逻辑控制简单）</span>
<span class="line"> 2.异步（采用应答方式通讯，适用于存取周期差异大的部件进行通讯，速度比同步慢）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>IO处理机（通道处理机）</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">总线：用于连接CPU，存储器，IO设备及外围设备，远程通讯设备通路集合</span>
<span class="line">通道：由操作系统，高级应用程序，I/O总线，设备控制器，设备硬件组成的系统</span>
<span class="line">IO处理机数据传输方式：</span>
<span class="line">  1.字节多路（用于连接大量的字符类低速设备）</span>
<span class="line">  2.数组多路（连接磁盘等块类设备）</span>
<span class="line">  3.选择通道</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Cache存储器地址映像方式</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1.直接映像（主存块与Cache块对应关系固定，主存地址中的主存区号与Cache中的主存区号相同，地址装换简单，不需要额外硬件，块冲突较高）</span>
<span class="line"></span>
<span class="line">2.全相联映像（主存和Cache存储器均分为容量相同块，允许主存中任意块载入Cache中）</span>
<span class="line"></span>
<span class="line">3.组相联映像（将主存与Cache分组再分块，主存与Cache的组之间采用直接映像连接，块之间采用全相联映像）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>虚拟存储器</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">虚拟存储器：以存储器访问的局部性为基础，建立在主存与辅助之间联系。从逻辑上为用户提供一个比物理存储容量大的存储空间。</span>
<span class="line">虚拟存储区的容量与物理主存大小无关，受限于计算机地址结构和可用磁盘容量</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>三级存储体系</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1.物理地址Cache（CPU使用虚拟地址访存，经过MMU部件转为主存物理地址去访问Cache，若Cache未命中，由主存与Cache块交换后读入CPU</span>
<span class="line">2.虚地址Cache（CPU使用虚拟地址访存，若未命中Cache，将经过MMU部件转为主存物理地址去访问主存，由主存与Cache块交换后读入CPU</span>
<span class="line">3.全Cache</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>页式替换算法</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1. 随机算法 （效率及命中率最低）</span>
<span class="line">2. FIFO（先进先出，每次旋转最早进入内存的页面进行替换）</span>
<span class="line">3. LRU（最近最少使用，记录上次访问的时间和次数，在一个时间周期中选出最少访问次数的页进行替换）</span>
<span class="line">4. OPT(选择最长时间内不在访问的页面，无法实现，命中率最高)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="【标量-向量-多处理-归纳机】" tabindex="-1"><a class="header-anchor" href="#【标量-向量-多处理-归纳机】"><span><strong>【标量，向量，多处理，归纳机】</strong></span></a></h2><ol><li><p>紧耦处理机与松耦处理机</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">紧耦处理机：通过互连网络共享主存的机器，共享IO系统，反之松耦处理机</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>流水处理机主要指标</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">吞吐率：流水线单位时间里能流出任务数或结果数 </span>
<span class="line">加速比：相对于非流水线速度提高的比值</span>
<span class="line">效率：流水线实际使用时间与整个运行时间之比</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>并行算法的定义与算法</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">并行算法就是用多台处理机 联合求解问题的方法和步骤，其执行过程是将给定的问题首先分解成若干个尽量相互独立的子问题，</span>
<span class="line">然后使用多台计算机同时求解它，从而最终求得原问题的解。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>多处理机的连接方式</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1. 总线</span>
<span class="line">2. 环形互连</span>
<span class="line">3. 交叉开关形式</span>
<span class="line">4. 多端口存储器</span>
<span class="line">5. 蠕虫穿洞寻径网络</span>
<span class="line">6. 开关枢纽结构形式</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>SIMD互连网络设计原则</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">1.结构简单，降低成本</span>
<span class="line">2.互连灵活，满足各种算法和应用需要</span>
<span class="line">3.处理单元传递的路径尽量减少</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol>`,8)]))}const p=e(l,[["render",d]]),c=JSON.parse('{"path":"/docs/Computer/Computer/3_Architecture/8-Architecture.html","title":"简答题","lang":"en-US","frontmatter":{"title":"简答题","date":"2025/07/04"},"headers":[{"level":2,"title":"【概论&&数据表示，寻址方式，指令系统】","slug":"【概论-数据表示-寻址方式-指令系统】","link":"#【概论-数据表示-寻址方式-指令系统】","children":[]},{"level":2,"title":"【存储，中断，总线与IO系统】","slug":"【存储-中断-总线与io系统】","link":"#【存储-中断-总线与io系统】","children":[]},{"level":2,"title":"【标量，向量，多处理，归纳机】","slug":"【标量-向量-多处理-归纳机】","link":"#【标量-向量-多处理-归纳机】","children":[]}],"filePathRelative":"docs/Computer/Computer/3_Architecture/8-Architecture.md","git":{"createdTime":1751621258000,"updatedTime":1751621258000,"contributors":[{"name":"lixuan","email":"2789968443@qq.com","commits":1}]}}');export{p as comp,c as data};
