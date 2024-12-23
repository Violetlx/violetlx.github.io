import{_ as t,c as p,b as a,a as s,d as l,e as o,o as i,r as c}from"./app-h7fVMzR_.js";const u={},r={href:"https://www.cnblogs.com/gaopeng527/p/4896783.html",target:"_blank",rel:"noopener noreferrer"};function d(k,n){const e=c("ExternalLinkIcon");return i(),p("div",null,[n[1]||(n[1]=a(`<p><img src="https://bizhi1.com/wp-content/uploads/2024/11/Mountains_Snow_Pure_Blue_sky_Landscape_5K-Wallpaper_5120x2880.jpg" alt="山雪纯净蓝天风景 5K"></p><h2 id="io-流相关" tabindex="-1"><a class="header-anchor" href="#io-流相关"><span>IO 流相关</span></a></h2><div class="custom-container tip"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01"></path><path d="M11 12h1v4h1"></path></g></svg><p class="custom-container-title">TIP</p><p>① 概述</p><p>② IO工具类-IoUtil</p><p>③ 文件工具类-FileUtil</p><p>④ 文件监听-WatchMonitor</p><p>⑤ 文件类型判断-FileTypeUtil</p><p>⑥ 文件</p><p>⑦ 资源</p></div><h2 id="_1-概述" tabindex="-1"><a class="header-anchor" href="#_1-概述"><span>① 概述</span></a></h2><h3 id="_1-由来" tabindex="-1"><a class="header-anchor" href="#_1-由来"><span>1 由来</span></a></h3><p>IO 的操作包括读和写，应用场景包括网络操作和文件操作。IO 操作在 Java 中是一个较为复杂的过程，我们在面对不同的场景时，要选择不同的 <code>InputStream</code> 和 <code>OutputStream</code> 实现来完成这些操作。而如果想读写字符流，还需要 <code>Reader</code> 和 <code>Writer</code> 的各种实现类。这些繁杂的实现类，一方面给我们提供了更多的灵活性，另一方面也增加了复杂性。</p><h3 id="_2-封装" tabindex="-1"><a class="header-anchor" href="#_2-封装"><span>2 封装</span></a></h3><p>io 包的封装主要针对流、文件的读写封装，主要以工具类为主，提供常用功能的封装，这包括：</p><ul><li><code>IoUtil</code> 流操作工具类</li><li><code>FileUtil</code> 文件读写和操作的工具类</li><li><code>FileTypeUtil</code> 文件类型判断工具类</li><li><code>WatchMonitor</code> 目录、文件监听，封装了 JDK1.7 中的 WatchService</li><li><code>ClassPathResource</code> 针对 ClassPath 中资源的访问封装</li><li><code>FileReader</code> 封装文件读取</li><li><code>FileWriter</code> 封装文件写入</li></ul><h3 id="_3-流扩展" tabindex="-1"><a class="header-anchor" href="#_3-流扩展"><span>3 流扩展</span></a></h3><p>除了针对 JDK 的读写封装外，还针对特定环境和文件扩展了流实现。</p><p>包括：</p><ul><li><code>BOMInputStream</code> 针对含有 <code>BOM</code> 头的流读取</li><li><code>FastByteArrayOutputStream</code> 基于快速缓冲 <code>FastByteBuffer</code> 的 <code>OutputStream</code>，随着数据的增长自动扩充缓冲区（<code>from blade</code>）</li><li><code>FastByteBuffer</code> 快速缓冲，将数据存放在缓冲集中，取代以往的单一数组（<code>from blade</code>）</li></ul><h2 id="_2-io工具类-ioutil" tabindex="-1"><a class="header-anchor" href="#_2-io工具类-ioutil"><span>② IO工具类-IoUtil</span></a></h2><h3 id="_1-由来-1" tabindex="-1"><a class="header-anchor" href="#_1-由来-1"><span>1 由来</span></a></h3><p>IO 工具类的存在主要针对 InputStream、OutputStream、Reader、Writer 封装简化，并对 NIO 相关操作做封装简化。总体来说，Hutool 对 IO 的封装，主要是工具层面，努力做到在便捷、性能和灵活之间找到最好的平衡点。</p><h3 id="_2-方法" tabindex="-1"><a class="header-anchor" href="#_2-方法"><span>2 方法</span></a></h3><h3 id="i拷贝" tabindex="-1"><a class="header-anchor" href="#i拷贝"><span>Ⅰ拷贝</span></a></h3><p>流的读写可以总结为从输入流读取，从输出流写出，这个过程我们定义为<strong>拷贝</strong>。这是一个基本过程，也是文件、流操作的基础。</p><p>以文件流拷贝为例：</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token class-name">BufferedInputStream</span> in <span class="token operator">=</span> <span class="token class-name">FileUtil</span><span class="token punctuation">.</span><span class="token function">getInputStream</span><span class="token punctuation">(</span><span class="token string">&quot;d:/test.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">BufferedOutputStream</span> out <span class="token operator">=</span> <span class="token class-name">FileUtil</span><span class="token punctuation">.</span><span class="token function">getOutputStream</span><span class="token punctuation">(</span><span class="token string">&quot;d:/test2.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">long</span> copySize <span class="token operator">=</span> <span class="token class-name">IoUtil</span><span class="token punctuation">.</span><span class="token function">copy</span><span class="token punctuation">(</span>in<span class="token punctuation">,</span> out<span class="token punctuation">,</span> <span class="token class-name">IoUtil</span><span class="token punctuation">.</span><span class="token constant">DEFAULT_BUFFER_SIZE</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>copy 方法同样针对 <code>Reader、Writer、Channel</code> 等对象有一些重载方法，并提供可选的缓存大小。默认的，缓存大小为 1024 个字节，如果拷贝大文件或流数据较大，可以适当调整这个参数。</p><p>针对 NIO，提供了 copyByNIO 方法，以便和 BIO 有所区别。</p>`,23)),s("p",null,[s("a",r,[n[0]||(n[0]=l("使用NIO对文件流操作的提升")),o(e)])]),n[2]||(n[2]=a(`<h3 id="ii-stream-转-reader、writer" tabindex="-1"><a class="header-anchor" href="#ii-stream-转-reader、writer"><span>Ⅱ Stream 转 Reader、Writer</span></a></h3><ul><li><code>IoUtil.getReader</code>：将 InputStream 转为 BufferedReader 用于读取字符流，它是部分 readXXX 方法的基础</li><li><code>IoUtil.getWriter</code>：将 OutputStream 转为 OutputStreamWriter 用于写入字符流，它是部分 writeXXX 的基础</li></ul><p>本质上这两个方法只是简单 new 一个新的 Reader 或者 Writer 对象，但是封装为工具方法配合 IDE 的自动提示可以大大减少查阅次数。</p><h3 id="iii-读取流中的内容" tabindex="-1"><a class="header-anchor" href="#iii-读取流中的内容"><span>Ⅲ 读取流中的内容</span></a></h3><p>读取流中的内容总结下来，可以分为 read 方法和 readXXX 方法。</p><p>1.<code>read</code> 方法有诸多的重载方法，根据参数不同，可以读取不同对象中的内容，这包括：</p><ul><li><code>InputStream</code></li><li><code>Reader</code></li><li><code>FileChannel</code></li></ul><p>这三个重载大部分返回 String 字符串，为字符流读取提供极大便利。</p><p>2.<code>readXXX</code> 方法主要针对返回值做了一些处理，例如：</p><ul><li><code>readBytes</code> 返回 byte 数组（读取图片等）</li><li><code>readHex</code> 读取 16 进制字符串</li><li><code>readObj</code> 读取序列化对象（反序列化）</li><li><code>readLines</code> 按行读取</li></ul><p>3.toStream 方法则是将某些对象转换为流对象，便于在某些情况下操作：</p><ul><li><code>String</code> 转换为 <code>ByteArrayInputStream</code></li><li><code>File</code> 转换为 <code>FileInputStream</code></li></ul><h3 id="iv-写入到流" tabindex="-1"><a class="header-anchor" href="#iv-写入到流"><span>Ⅳ 写入到流</span></a></h3><ul><li><code>IoUtil.write</code> 方法有两个重载方法，一个直接调用 OutputStream.write 方法，另一个用于将对象转换为字符串（调用 toString 方法），然后写入到流中。</li><li>IoUtil.writeObjects 用于将可序列化对象序列化后写入到流中。</li></ul><p><code>write</code> 方法并没有提供 writeXXX，需要自己抓换为 String 或 byte[]</p><h3 id="v-关闭" tabindex="-1"><a class="header-anchor" href="#v-关闭"><span>Ⅴ 关闭</span></a></h3><p>对于 IO 操作来说，使用频率最高（也最容器被遗忘）的就是 <code>close</code> 操作，好在 Java 规范使用了优雅的 Closeable 接口，这样我们只需简单封装调用此接口的方法即可。</p><p>关闭操作会面临两个问题：</p><ol><li>被关闭对象为空</li><li>对象关闭失败（或对象已关闭）</li></ol><p><code>IoUtil.close</code> 方法很好的解决了这两个问题</p><p>在 JDK1.7 中，提供了 AutoCloseable 接口，在 IoUtil 中同样提供相应的重载方法，在使用中并不会感觉到有哪些不同。</p><h2 id="_3-文件工具类-fileutil" tabindex="-1"><a class="header-anchor" href="#_3-文件工具类-fileutil"><span>③ 文件工具类-FileUtil</span></a></h2><h3 id="_1-简介" tabindex="-1"><a class="header-anchor" href="#_1-简介"><span>1 简介</span></a></h3><p>在 IO 操作中，文件的操作相对来说是比较复杂的，但也是使用频率最高的部分，我们几乎所有的项目中都躺着一个叫做 FileUtil 或者 FileUtils 的工具类。</p><p>总体来说，FileUtil 类包含以下几类操作工具：</p><ol><li>文件操作：包括文件目录的新建、删除、复制、移动、改名等</li><li>文件判断：判断文件或目录是否非空，是否为目录，是否为文件等等</li><li>绝对路径：针对 ClassPath 中的文件转换为绝对路径文件</li><li>文件名：主文件名，扩展名的获取</li><li>读操作：包括类似 IoUtil 中的 getReader、readXXX 操作</li><li>写操作：包括 getWrite 和 writeXXX 操作</li></ol><p>在 FileUtil 中，努力让方法名与 Linux 相一致，例如创建文件的方法并不是 createFile，而是 touch，这种统一对于熟悉 Linux 的人来说，大大提高了上手速度。当然，如果你不熟悉 Linux ，那 FileUtil 工具类的使用则是在帮助你学习 Linux 命令。</p><p>这些类 Linux 命令的方法包括：</p><ul><li><code>ls</code> 列出目录和文件</li><li><code>touch</code> 创建文件，如果父目录不存在也自动创建</li><li><code>mkdir</code> 创建目录，会递归创建每层目录</li><li><code>del</code> 删除文件或目录（递归删除，不判断是否为空），这个方法相当于 Linux 的 delete 命令</li><li><code>copy</code> 拷贝文件或目录</li></ul><p>这些方法提供了人性化的操作，例如 touch 方法，在创建文件的情况下会自动创建上层目录（对于使用者来说这也是大部分情况下的需求），同样 mkdir 也会创建父目录。</p><blockquote><p>需要注意的是，del 方法会删除目录而不判断是否为空，这一方面方便了使用，另一方面也可能造成一些预想不到的后果（比如拼写错路径而删除不应该删除的目录），所以请谨慎使用此方法。</p></blockquote><p>关于 FileUtil 中更多工具方法。请查阅 API 文档。</p><h2 id="_4-文件监听-watchmonitor" tabindex="-1"><a class="header-anchor" href="#_4-文件监听-watchmonitor"><span>④ 文件监听-WatchMonitor</span></a></h2><h3 id="_1-由来-2" tabindex="-1"><a class="header-anchor" href="#_1-由来-2"><span>1 由来</span></a></h3><p>很多时候我们需要监听一个文件的变化或者目录的变动，包括文件的创建、修改、删除以及目录下文件的创建、修改和删除，在 JDK7 前我们只能靠轮询方式遍历目录或者定时检查文件的修改事件，这样效率非常低，性能也很差。因此在 JDK7 中引入了 <code>watchService</code> 。不过考虑到其 API 并不友好，于是 Hutool 便针对其做了简化封装，使监听更简单，也提供了更好的功能，这包括：</p><ul><li>支持多级目录的监听（WatchService只支持一级目录），可自定义监听目录深度</li><li>延迟合并触发支持（文件变动时可能触发多次 modify，支持在某个时间范围内的多次修改事件合并为一个修改事件）</li><li>简单易懂的 API 方法，一个方法即可搞定监听，无需理解复杂的监听注册机制</li><li>多观察着实现，可以根据业务实现多个 watcher 来响应同一个事件（通过 WatcherChain）</li></ul><h3 id="i-watchmonitor" tabindex="-1"><a class="header-anchor" href="#i-watchmonitor"><span>Ⅰ WatchMonitor</span></a></h3><p>在 Hutool 中，WatchMonitor 主要针对 JDK7 中 WatchService 做了封装，针对文件和目录的变动（创建、更新、删除）做一个钩子，在 Watcher 中定义相应的逻辑来应对这些文件的变化。</p><h3 id="ii-内部应用" tabindex="-1"><a class="header-anchor" href="#ii-内部应用"><span>Ⅱ 内部应用</span></a></h3><p>在 Hutool-setting 模块，使用 WatchMonitor 监测配置文件变化，然后自动 load 到内存中。WatchMonitor 的使用可以避免轮询，以事件响应的方式应对文件变化。</p><h3 id="_2-使用" tabindex="-1"><a class="header-anchor" href="#_2-使用"><span>2 使用</span></a></h3><p><code>WatchMonitro</code> 提供的事件有：</p><ul><li><code>ENTRY_MODIFY</code> 文件或目录的修改事件</li><li><code>ENTRY_CREATE</code> 文件或目录的创建事件</li><li><code>ENTRY_DELETE</code> 文件或目录的删除事件</li><li><code>OVERFLOW</code> 丢失的事件</li></ul><p>这些事件对应<code>StandardWatchEventKinds</code>中的事件。</p><h3 id="i监听制定事件" tabindex="-1"><a class="header-anchor" href="#i监听制定事件"><span>Ⅰ监听制定事件</span></a></h3><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token class-name">File</span> file <span class="token operator">=</span> <span class="token class-name">FileUtil</span><span class="token punctuation">.</span><span class="token function">file</span><span class="token punctuation">(</span><span class="token string">&quot;example.properties&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//这里只监听文件或目录的修改事件</span></span>
<span class="line"><span class="token class-name">WatchMonitor</span> watchMonitor <span class="token operator">=</span> <span class="token class-name">WatchMonitor</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token class-name">WatchMonitor</span><span class="token punctuation">.</span><span class="token constant">ENTRY_MODIFY</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">watchMonitor<span class="token punctuation">.</span><span class="token function">setWatcher</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Watcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onCreate</span><span class="token punctuation">(</span><span class="token class-name">WatchEvent</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> event<span class="token punctuation">,</span> <span class="token class-name">Path</span> currentPath<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">Object</span> obj <span class="token operator">=</span> event<span class="token punctuation">.</span><span class="token function">context</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">Console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;创建：{}-&gt; {}&quot;</span><span class="token punctuation">,</span> currentPath<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onModify</span><span class="token punctuation">(</span><span class="token class-name">WatchEvent</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> event<span class="token punctuation">,</span> <span class="token class-name">Path</span> currentPath<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">Object</span> obj <span class="token operator">=</span> event<span class="token punctuation">.</span><span class="token function">context</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">Console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;修改：{}-&gt; {}&quot;</span><span class="token punctuation">,</span> currentPath<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onDelete</span><span class="token punctuation">(</span><span class="token class-name">WatchEvent</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> event<span class="token punctuation">,</span> <span class="token class-name">Path</span> currentPath<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">Object</span> obj <span class="token operator">=</span> event<span class="token punctuation">.</span><span class="token function">context</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">Console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;删除：{}-&gt; {}&quot;</span><span class="token punctuation">,</span> currentPath<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onOverflow</span><span class="token punctuation">(</span><span class="token class-name">WatchEvent</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> event<span class="token punctuation">,</span> <span class="token class-name">Path</span> currentPath<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">Object</span> obj <span class="token operator">=</span> event<span class="token punctuation">.</span><span class="token function">context</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">Console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;Overflow：{}-&gt; {}&quot;</span><span class="token punctuation">,</span> currentPath<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//设置监听目录的最大深入，目录层级大于制定层级的变更将不被监听，默认只监听当前层级目录</span></span>
<span class="line">watchMonitor<span class="token punctuation">.</span><span class="token function">setMaxDepth</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//启动监听</span></span>
<span class="line">watchMonitor<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ii-监听全部事件" tabindex="-1"><a class="header-anchor" href="#ii-监听全部事件"><span>Ⅱ 监听全部事件</span></a></h3><p>其实我们不必实现 <code>Watcher</code> 所有的接口方法，Hutool 同时提供了 <code>SimpleWatcher</code> 类，只需要重写对应方法即可。</p><p>同样，如果我们想监听所有事件，可以：</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token class-name">WatchMonitor</span><span class="token punctuation">.</span><span class="token function">createAll</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">SimpleWatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onModify</span><span class="token punctuation">(</span><span class="token class-name">WatchEvent</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> event<span class="token punctuation">,</span> <span class="token class-name">Path</span> currentPath<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">Console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;EVENT modify&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>createAll</code> 方法会创建一个监听所有事件的 WatchMonitor，同时在第二个参数中定义 Watcher 来负责处理这些变动。</p><h3 id="iii-延迟处理监听事件" tabindex="-1"><a class="header-anchor" href="#iii-延迟处理监听事件"><span>Ⅲ 延迟处理监听事件</span></a></h3><p>在监听目录或文件时，如果这个文件有修改操作，JDK 会多次触发 modify 方法，为了解决这个问题，我们定义了 <code>DelayWatcher</code>，此类通过维护一个 Set 将短时间内相同文件多次 modify 的事件合并处理触发，从而避免以上问题。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token class-name">WatchMonitor</span> monitor <span class="token operator">=</span> <span class="token class-name">WatchMonitor</span><span class="token punctuation">.</span><span class="token function">createAll</span><span class="token punctuation">(</span><span class="token string">&quot;d:/&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">DelayWatcher</span><span class="token punctuation">(</span>watcher<span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">monitor<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div>`,54))])}const v=t(u,[["render",d],["__file","4-Hutool_Core.html.vue"]]),m=JSON.parse('{"path":"/docs/Java/Hutool/2_Hutool_Core/4-Hutool_Core.html","title":"Hutool-Core核心（四）","lang":"en-US","frontmatter":{"title":"Hutool-Core核心（四）","date":"2024/12/20"},"headers":[{"level":2,"title":"IO 流相关","slug":"io-流相关","link":"#io-流相关","children":[]},{"level":2,"title":"① 概述","slug":"_1-概述","link":"#_1-概述","children":[{"level":3,"title":"1 由来","slug":"_1-由来","link":"#_1-由来","children":[]},{"level":3,"title":"2 封装","slug":"_2-封装","link":"#_2-封装","children":[]},{"level":3,"title":"3 流扩展","slug":"_3-流扩展","link":"#_3-流扩展","children":[]}]},{"level":2,"title":"② IO工具类-IoUtil","slug":"_2-io工具类-ioutil","link":"#_2-io工具类-ioutil","children":[{"level":3,"title":"1 由来","slug":"_1-由来-1","link":"#_1-由来-1","children":[]},{"level":3,"title":"2 方法","slug":"_2-方法","link":"#_2-方法","children":[]},{"level":3,"title":"Ⅰ拷贝","slug":"i拷贝","link":"#i拷贝","children":[]},{"level":3,"title":"Ⅱ Stream 转 Reader、Writer","slug":"ii-stream-转-reader、writer","link":"#ii-stream-转-reader、writer","children":[]},{"level":3,"title":"Ⅲ 读取流中的内容","slug":"iii-读取流中的内容","link":"#iii-读取流中的内容","children":[]},{"level":3,"title":"Ⅳ 写入到流","slug":"iv-写入到流","link":"#iv-写入到流","children":[]},{"level":3,"title":"Ⅴ 关闭","slug":"v-关闭","link":"#v-关闭","children":[]}]},{"level":2,"title":"③ 文件工具类-FileUtil","slug":"_3-文件工具类-fileutil","link":"#_3-文件工具类-fileutil","children":[{"level":3,"title":"1 简介","slug":"_1-简介","link":"#_1-简介","children":[]}]},{"level":2,"title":"④ 文件监听-WatchMonitor","slug":"_4-文件监听-watchmonitor","link":"#_4-文件监听-watchmonitor","children":[{"level":3,"title":"1 由来","slug":"_1-由来-2","link":"#_1-由来-2","children":[]},{"level":3,"title":"Ⅰ WatchMonitor","slug":"i-watchmonitor","link":"#i-watchmonitor","children":[]},{"level":3,"title":"Ⅱ 内部应用","slug":"ii-内部应用","link":"#ii-内部应用","children":[]},{"level":3,"title":"2 使用","slug":"_2-使用","link":"#_2-使用","children":[]},{"level":3,"title":"Ⅰ监听制定事件","slug":"i监听制定事件","link":"#i监听制定事件","children":[]},{"level":3,"title":"Ⅱ 监听全部事件","slug":"ii-监听全部事件","link":"#ii-监听全部事件","children":[]},{"level":3,"title":"Ⅲ 延迟处理监听事件","slug":"iii-延迟处理监听事件","link":"#iii-延迟处理监听事件","children":[]}]}],"filePathRelative":"docs/Java/Hutool/2_Hutool_Core/4-Hutool_Core.md","git":{"createdTime":1734915055000,"updatedTime":1734915055000,"contributors":[{"name":"lixuan","username":"lixuan","email":"2789968443@qq.com","commits":1,"url":"https://github.com/lixuan"}]}}');export{v as comp,m as data};