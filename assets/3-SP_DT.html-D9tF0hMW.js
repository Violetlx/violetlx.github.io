import{_ as s,c as a,b as l,o as e}from"./app-B0LQx5G-.js";const i={};function t(o,n){return e(),a("div",null,n[0]||(n[0]=[l(`<p><img src="https://bizhi1.com/wp-content/uploads/2024/11/高清美女图片黄玉瑶-4K壁纸-3840x2400-1.jpg" alt="高清美女图片黄玉瑶 4K壁纸"></p><div class="custom-container tip"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01"></path><path d="M11 12h1v4h1"></path></g></svg><p class="custom-container-title">TIP</p><p>1 编写降级逻辑</p><p>2 解决分布式事务</p></div><h2 id="_1-编写降级逻辑" tabindex="-1"><a class="header-anchor" href="#_1-编写降级逻辑"><span>1 编写降级逻辑</span></a></h2><h2 id="_2-解决分布式事务" tabindex="-1"><a class="header-anchor" href="#_2-解决分布式事务"><span>2 解决分布式事务</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">// 存数据</span>
<span class="line">// name：命名 data：数据</span>
<span class="line">function saveData(name, data) {</span>
<span class="line">    localStorage.setItem(name, JSON.stringify({ &#39;time&#39;: Date.now(), &#39;data&#39;: data }))</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 取数据</span>
<span class="line">// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据</span>
<span class="line">function loadData(name, time) {</span>
<span class="line">    let d = JSON.parse(localStorage.getItem(name));</span>
<span class="line">    // 过期或有错误返回 0 否则返回数据</span>
<span class="line">    if (d) {</span>
<span class="line">        let t = Date.now() - d.time</span>
<span class="line">        if (t &lt; (time * 60 * 1000) &amp;&amp; t &gt; -1) return d.data;</span>
<span class="line">    }</span>
<span class="line">    return 0;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用</span>
<span class="line"></span>
<span class="line">// 读取背景</span>
<span class="line">try {</span>
<span class="line">    let data = loadData(&#39;blogbg&#39;, 1440)</span>
<span class="line">    if (data) changeBg(data, 1)</span>
<span class="line">    else localStorage.removeItem(&#39;blogbg&#39;);</span>
<span class="line">} catch (error) { localStorage.removeItem(&#39;blogbg&#39;); }</span>
<span class="line"></span>
<span class="line">// 切换背景函数</span>
<span class="line">// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定</span>
<span class="line">// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.</span>
<span class="line">function changeBg(s, flag) {</span>
<span class="line">    let bg = document.getElementById(&#39;web_bg&#39;)</span>
<span class="line">    if (s.charAt(0) === &#39;#&#39;) {</span>
<span class="line">        bg.style.backgroundColor = s</span>
<span class="line">        bg.style.backgroundImage = &#39;none&#39;</span>
<span class="line">    } else bg.style.backgroundImage = s</span>
<span class="line">    if (!flag) { saveData(&#39;blogbg&#39;, s) }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 以下为2.0新增内容</span>
<span class="line"></span>
<span class="line">// 创建窗口</span>
<span class="line">var winbox = &#39;&#39;</span>
<span class="line"></span>
<span class="line">function createWinbox() {</span>
<span class="line">    //创建一个外壳</span>
<span class="line">    let changeBox = document.createElement(&#39;div&#39;)</span>
<span class="line">    document.body.appendChild(changeBox)</span>
<span class="line">    changeBox.id = &#39;changeBox&#39;</span>
<span class="line">    changeBox.style.width = &#39;300px&#39;</span>
<span class="line">    changeBox.style.height = &#39;60%&#39;</span>
<span class="line">    changeBox.style.backgroundColor = &#39;black&#39;</span>
<span class="line">    changeBox.style.borderRadius = &#39;20px&#39;</span>
<span class="line">    changeBox.style.position = &#39;relative&#39;</span>
<span class="line"></span>
<span class="line">    let div = document.createElement(&#39;div&#39;)</span>
<span class="line">    document.body.appendChild(div)</span>
<span class="line">    winbox = WinBox({</span>
<span class="line">        id: &#39;changeBgBox&#39;,</span>
<span class="line">        index: 999,</span>
<span class="line">        x: &quot;center&quot;,</span>
<span class="line">        y: &quot;center&quot;,</span>
<span class="line">        minwidth: &#39;98%&#39;,</span>
<span class="line">        height: &quot;98%&quot;,</span>
<span class="line">        backgroundColor: &#39;rgb(255,196,196)&#39;,</span>
<span class="line">        background: &#39;linear-gradient(167deg, rgba(255,196,196,1) 10%, rgba(45,138,253,1) 20%, rgba(34,193,195,1) 48%, rgba(211,216,255,1) 69%, rgba(0,164,24,1) 88%)&#39;,</span>
<span class="line">        borderRadius: &#39;20px&#39;,</span>
<span class="line">        position: &#39;absolute&#39;,</span>
<span class="line">        top: &#39;4px&#39;,</span>
<span class="line">        bottom: &#39;2px&#39;,</span>
<span class="line">        right: &#39;2px&#39;,</span>
<span class="line">        left: &#39;2px&#39;,</span>
<span class="line">        boxSizing: &#39;border-box&#39;,</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    //将winbox加入到外壳中</span>
<span class="line">    winbox.body.appendChild(changeBox)</span>
<span class="line"></span>
<span class="line">    winResize();</span>
<span class="line">    window.addEventListener(&#39;resize&#39;, winResize)</span>
<span class="line"></span>
<span class="line">    // 每一类我放了一个演示，直接往下复制粘贴 a标签 就可以，需要注意的是 函数里面的链接 冒号前面需要添加反斜杠\\进行转义</span>
<span class="line">    winbox.body.innerHTML = \`</span>
<span class="line">    &lt;div id=&quot;article-container&quot; style=&quot;padding:10px;&quot;&gt;</span>
<span class="line">    </span>
<span class="line">    &lt;p&gt;&lt;button onclick=&quot;localStorage.removeItem(&#39;blogbg&#39;);location.reload();&quot; style=&quot;background:#5fcdff;display:block;width:100%;padding: 15px 0;border-radius:6px;color:white;&quot;&gt;&lt;i class=&quot;fa-solid fa-arrows-rotate&quot;&gt;&lt;/i&gt; 点我恢复默认背景&lt;/button&gt;&lt;/p&gt;</span>
<span class="line">    &lt;h2 id=&quot;图片（手机）&quot;&gt;&lt;a href=&quot;#图片（手机）&quot; class=&quot;headerlink&quot; title=&quot;图片（手机）&quot;&gt;&lt;/a&gt;图片（手机）&lt;/h2&gt;</span>
<span class="line">    &lt;div class=&quot;bgbox&quot;&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; style=&quot;background-image:url(https://img.keaitupian.cn/newupload/05/1684224278742569.jpg)&quot; class=&quot;pimgbox&quot; onclick=&quot;changeBg(&#39;url(https://img.keaitupian.cn/newupload/05/1684224278742569.jpg)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;/div&gt;</span>
<span class="line">    </span>
<span class="line">    &lt;h2 id=&quot;图片（电脑）&quot;&gt;&lt;a href=&quot;#图片（电脑）&quot; class=&quot;headerlink&quot; title=&quot;图片（电脑）&quot;&gt;&lt;/a&gt;图片（电脑）&lt;/h2&gt;</span>
<span class="line">    &lt;div class=&quot;bgbox&quot;&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; style=&quot;background-image:url(https://wallpaperm.cmcm.com/a4308759ccd43ba80e9cd70d01224ab4.jpg)&quot; class=&quot;imgbox&quot; onclick=&quot;changeBg(&#39;url(https://wallpaperm.cmcm.com/a4308759ccd43ba80e9cd70d01224ab4.jpg)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; style=&quot;background-image:url(https://img-baofun.zhhainiao.com/fs/41a423f2c61f1166352491ddcb2135f7.jpg)&quot; class=&quot;imgbox&quot; onclick=&quot;changeBg(&#39;url(https://img-baofun.zhhainiao.com/fs/41a423f2c61f1166352491ddcb2135f7.jpg)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; style=&quot;background-image:url(https://img-baofun.zhhainiao.com/fs/90d7cc13fc8a2ad62bad653b1b2018fb.jpg)&quot; class=&quot;imgbox&quot; onclick=&quot;changeBg(&#39;url(https://img-baofun.zhhainiao.com/fs/90d7cc13fc8a2ad62bad653b1b2018fb.jpg)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; style=&quot;background-image:url(https://wallpaperm.cmcm.com/9cc01ff1758b776d7f5c2b91295b982b.jpg)&quot; class=&quot;imgbox&quot; onclick=&quot;changeBg(&#39;url(https://wallpaperm.cmcm.com/9cc01ff1758b776d7f5c2b91295b982b.jpg)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;/div&gt;</span>
<span class="line">    </span>
<span class="line">    </span>
<span class="line">    </span>
<span class="line">    &lt;h2 id=&quot;渐变色&quot;&gt;&lt;a href=&quot;#渐变色&quot; class=&quot;headerlink&quot; title=&quot;渐变色&quot;&gt;&lt;/a&gt;渐变色&lt;/h2&gt;</span>
<span class="line">    &lt;div class=&quot;bgbox&quot;&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: linear-gradient(to right, #eecda3, #ef629f)&quot; onclick=&quot;changeBg(&#39;linear-gradient(to right, #eecda3, #ef629f)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: linear-gradient(to right, #a8edea, #fed6e3)&quot; onclick=&quot;changeBg(&#39;linear-gradient(to right, #a8edea, #fed6e3)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: linear-gradient(to right, #f0abeb, #456cb5)&quot; onclick=&quot;changeBg(&#39;linear-gradient(to right, #f0abeb, #456cb5)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: linear-gradient(to right, #ffecd2, #fcb69f)&quot; onclick=&quot;changeBg(&#39;linear-gradient(to right, #ffecd2, #fcb69f)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: linear-gradient(to right, #ff9a9e, #fad0c4)&quot; onclick=&quot;changeBg(&#39;linear-gradient(to right, #ff9a9e, #fad0c4)&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;/div&gt;</span>
<span class="line">    </span>
<span class="line">    &lt;h2 id=&quot;纯色&quot;&gt;&lt;a href=&quot;#纯色&quot; class=&quot;headerlink&quot; title=&quot;纯色&quot;&gt;&lt;/a&gt;纯色&lt;/h2&gt;</span>
<span class="line">    &lt;div class=&quot;bgbox&quot;&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #7D9D9C&quot; onclick=&quot;changeBg(&#39;#7D9D9C&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #C4C4C4&quot; onclick=&quot;changeBg(&#39;#C4C4C4&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #FF6B6B&quot; onclick=&quot;changeBg(&#39;#FF6B6B&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #FFD166&quot; onclick=&quot;changeBg(&#39;#FFD166&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #06D6A0&quot; onclick=&quot;changeBg(&#39;#06D6A0&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #0585ff&quot; onclick=&quot;changeBg(&#39;#0585ff&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #7e5be8&quot; onclick=&quot;changeBg(&#39;#7e5be8&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #f705ff&quot; onclick=&quot;changeBg(&#39;#f705ff&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #7bb4ec&quot; onclick=&quot;changeBg(&#39;#7bb4ec&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #ffffff&quot; onclick=&quot;changeBg(&#39;#ffffff&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;a href=&quot;javascript:;&quot; rel=&quot;noopener external nofollow&quot; class=&quot;box&quot; style=&quot;background: #030e18&quot; onclick=&quot;changeBg(&#39;#030e18&#39;)&quot;&gt;&lt;/a&gt;</span>
<span class="line">    &lt;/div&gt;</span>
<span class="line">\`;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 适应窗口大小</span>
<span class="line">function winResize() {</span>
<span class="line">    let box = document.querySelector(&#39;#changeBox&#39;)</span>
<span class="line">    if (!box || box.classList.contains(&#39;min&#39;) || box.classList.contains(&#39;max&#39;)) return // 2023-02-10更新</span>
<span class="line">    var offsetWid = document.documentElement.clientWidth;</span>
<span class="line">    if (offsetWid &lt;= 768) {</span>
<span class="line">        winbox.resize(offsetWid * 0.95 + &quot;px&quot;, &quot;90%&quot;).move(&quot;center&quot;, &quot;center&quot;);</span>
<span class="line">    } else {</span>
<span class="line">        winbox.resize(offsetWid * 0.6 + &quot;px&quot;, &quot;70%&quot;).move(&quot;center&quot;, &quot;center&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口</span>
<span class="line">function toggleWinbox() {</span>
<span class="line">    if (document.querySelector(&#39;#changeBox&#39;)) winbox.toggleClass(&#39;hide&#39;);</span>
<span class="line">    else createWinbox();</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)]))}const u=s(i,[["render",t]]),d=JSON.parse('{"path":"/docs/Java/Heima/Microservices/Day05_SP_DT/3-SP_DT.html","title":"练习","lang":"en-US","frontmatter":{"title":"练习","date":"2025/03/06"},"headers":[{"level":2,"title":"1 编写降级逻辑","slug":"_1-编写降级逻辑","link":"#_1-编写降级逻辑","children":[]},{"level":2,"title":"2 解决分布式事务","slug":"_2-解决分布式事务","link":"#_2-解决分布式事务","children":[]}],"filePathRelative":"docs/Java/Heima/Microservices/Day05_SP_DT/3-SP_DT.md","git":{"createdTime":1741251281000,"updatedTime":1750319780000,"contributors":[{"name":"lixuan","email":"2789968443@qq.com","commits":2}]}}');export{u as comp,d as data};
