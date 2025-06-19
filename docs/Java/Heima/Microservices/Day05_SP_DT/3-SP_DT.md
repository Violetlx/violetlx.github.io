---
title: 练习
date: 2025/03/06
---

![高清美女图片黄玉瑶 4K壁纸](https://bizhi1.com/wp-content/uploads/2024/11/%E9%AB%98%E6%B8%85%E7%BE%8E%E5%A5%B3%E5%9B%BE%E7%89%87%E9%BB%84%E7%8E%89%E7%91%B6-4K%E5%A3%81%E7%BA%B8-3840x2400-1.jpg)

::: tip

1 编写降级逻辑

2 解决分布式事务

:::

## 1 编写降级逻辑

## 2 解决分布式事务

```
// 存数据
// name：命名 data：数据
function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data }))
}

// 取数据
// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (t < (time * 60 * 1000) && t > -1) return d.data;
    }
    return 0;
}

// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用

// 读取背景
try {
    let data = loadData('blogbg', 1440)
    if (data) changeBg(data, 1)
    else localStorage.removeItem('blogbg');
} catch (error) { localStorage.removeItem('blogbg'); }

// 切换背景函数
// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定
// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.
function changeBg(s, flag) {
    let bg = document.getElementById('web_bg')
    if (s.charAt(0) === '#') {
        bg.style.backgroundColor = s
        bg.style.backgroundImage = 'none'
    } else bg.style.backgroundImage = s
    if (!flag) { saveData('blogbg', s) }
}

// 以下为2.0新增内容

// 创建窗口
var winbox = ''

function createWinbox() {
    //创建一个外壳
    let changeBox = document.createElement('div')
    document.body.appendChild(changeBox)
    changeBox.id = 'changeBox'
    changeBox.style.width = '300px'
    changeBox.style.height = '60%'
    changeBox.style.backgroundColor = 'black'
    changeBox.style.borderRadius = '20px'
    changeBox.style.position = 'relative'

    let div = document.createElement('div')
    document.body.appendChild(div)
    winbox = WinBox({
        id: 'changeBgBox',
        index: 999,
        x: "center",
        y: "center",
        minwidth: '98%',
        height: "98%",
        backgroundColor: 'rgb(255,196,196)',
        background: 'linear-gradient(167deg, rgba(255,196,196,1) 10%, rgba(45,138,253,1) 20%, rgba(34,193,195,1) 48%, rgba(211,216,255,1) 69%, rgba(0,164,24,1) 88%)',
        borderRadius: '20px',
        position: 'absolute',
        top: '4px',
        bottom: '2px',
        right: '2px',
        left: '2px',
        boxSizing: 'border-box',
    });

    //将winbox加入到外壳中
    winbox.body.appendChild(changeBox)

    winResize();
    window.addEventListener('resize', winResize)

    // 每一类我放了一个演示，直接往下复制粘贴 a标签 就可以，需要注意的是 函数里面的链接 冒号前面需要添加反斜杠\进行转义
    winbox.body.innerHTML = `
    <div id="article-container" style="padding:10px;">
    
    <p><button onclick="localStorage.removeItem('blogbg');location.reload();" style="background:#5fcdff;display:block;width:100%;padding: 15px 0;border-radius:6px;color:white;"><i class="fa-solid fa-arrows-rotate"></i> 点我恢复默认背景</button></p>
    <h2 id="图片（手机）"><a href="#图片（手机）" class="headerlink" title="图片（手机）"></a>图片（手机）</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://img.keaitupian.cn/newupload/05/1684224278742569.jpg)" class="pimgbox" onclick="changeBg('url(https://img.keaitupian.cn/newupload/05/1684224278742569.jpg)')"></a>
    </div>
    
    <h2 id="图片（电脑）"><a href="#图片（电脑）" class="headerlink" title="图片（电脑）"></a>图片（电脑）</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wallpaperm.cmcm.com/a4308759ccd43ba80e9cd70d01224ab4.jpg)" class="imgbox" onclick="changeBg('url(https://wallpaperm.cmcm.com/a4308759ccd43ba80e9cd70d01224ab4.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://img-baofun.zhhainiao.com/fs/41a423f2c61f1166352491ddcb2135f7.jpg)" class="imgbox" onclick="changeBg('url(https://img-baofun.zhhainiao.com/fs/41a423f2c61f1166352491ddcb2135f7.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://img-baofun.zhhainiao.com/fs/90d7cc13fc8a2ad62bad653b1b2018fb.jpg)" class="imgbox" onclick="changeBg('url(https://img-baofun.zhhainiao.com/fs/90d7cc13fc8a2ad62bad653b1b2018fb.jpg)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wallpaperm.cmcm.com/9cc01ff1758b776d7f5c2b91295b982b.jpg)" class="imgbox" onclick="changeBg('url(https://wallpaperm.cmcm.com/9cc01ff1758b776d7f5c2b91295b982b.jpg)')"></a>
    </div>
    
    
    
    <h2 id="渐变色"><a href="#渐变色" class="headerlink" title="渐变色"></a>渐变色</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #eecda3, #ef629f)" onclick="changeBg('linear-gradient(to right, #eecda3, #ef629f)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #a8edea, #fed6e3)" onclick="changeBg('linear-gradient(to right, #a8edea, #fed6e3)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #f0abeb, #456cb5)" onclick="changeBg('linear-gradient(to right, #f0abeb, #456cb5)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #ffecd2, #fcb69f)" onclick="changeBg('linear-gradient(to right, #ffecd2, #fcb69f)')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #ff9a9e, #fad0c4)" onclick="changeBg('linear-gradient(to right, #ff9a9e, #fad0c4)')"></a>
    </div>
    
    <h2 id="纯色"><a href="#纯色" class="headerlink" title="纯色"></a>纯色</h2>
    <div class="bgbox">
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #7D9D9C" onclick="changeBg('#7D9D9C')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #C4C4C4" onclick="changeBg('#C4C4C4')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #FF6B6B" onclick="changeBg('#FF6B6B')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #FFD166" onclick="changeBg('#FFD166')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #06D6A0" onclick="changeBg('#06D6A0')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #0585ff" onclick="changeBg('#0585ff')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #7e5be8" onclick="changeBg('#7e5be8')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #f705ff" onclick="changeBg('#f705ff')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #7bb4ec" onclick="changeBg('#7bb4ec')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #ffffff" onclick="changeBg('#ffffff')"></a>
    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #030e18" onclick="changeBg('#030e18')"></a>
    </div>
`;
}

// 适应窗口大小
function winResize() {
    let box = document.querySelector('#changeBox')
    if (!box || box.classList.contains('min') || box.classList.contains('max')) return // 2023-02-10更新
    var offsetWid = document.documentElement.clientWidth;
    if (offsetWid <= 768) {
        winbox.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
    } else {
        winbox.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
    }
}

// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口
function toggleWinbox() {
    if (document.querySelector('#changeBox')) winbox.toggleClass('hide');
    else createWinbox();
}
```

