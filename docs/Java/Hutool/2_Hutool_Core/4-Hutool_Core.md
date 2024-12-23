---
title: Hutool-Core核心（四）
date: 2024/12/20
---

![山雪纯净蓝天风景 5K](https://bizhi1.com/wp-content/uploads/2024/11/Mountains_Snow_Pure_Blue_sky_Landscape_5K-Wallpaper_5120x2880.jpg)



## IO 流相关

::: tip

① 概述

② IO工具类-IoUtil

③ 文件工具类-FileUtil

④ 文件监听-WatchMonitor

⑤ 文件类型判断-FileTypeUtil

⑥ 文件

⑦ 资源

:::



## ① 概述



### 1 由来

IO 的操作包括读和写，应用场景包括网络操作和文件操作。IO 操作在 Java 中是一个较为复杂的过程，我们在面对不同的场景时，要选择不同的 `InputStream` 和 `OutputStream` 实现来完成这些操作。而如果想读写字符流，还需要 `Reader` 和 `Writer` 的各种实现类。这些繁杂的实现类，一方面给我们提供了更多的灵活性，另一方面也增加了复杂性。



### 2 封装

io 包的封装主要针对流、文件的读写封装，主要以工具类为主，提供常用功能的封装，这包括：

- `IoUtil` 流操作工具类
- `FileUtil` 文件读写和操作的工具类
- `FileTypeUtil` 文件类型判断工具类
- `WatchMonitor` 目录、文件监听，封装了 JDK1.7 中的 WatchService
- `ClassPathResource` 针对 ClassPath 中资源的访问封装
- `FileReader` 封装文件读取
- `FileWriter` 封装文件写入



### 3 流扩展

除了针对 JDK 的读写封装外，还针对特定环境和文件扩展了流实现。

包括：

- `BOMInputStream` 针对含有 `BOM` 头的流读取
- `FastByteArrayOutputStream` 基于快速缓冲 `FastByteBuffer` 的 `OutputStream`，随着数据的增长自动扩充缓冲区（`from blade`）
- `FastByteBuffer` 快速缓冲，将数据存放在缓冲集中，取代以往的单一数组（`from blade`）





## ② IO工具类-IoUtil



### 1 由来

IO 工具类的存在主要针对 InputStream、OutputStream、Reader、Writer 封装简化，并对 NIO 相关操作做封装简化。总体来说，Hutool 对 IO 的封装，主要是工具层面，努力做到在便捷、性能和灵活之间找到最好的平衡点。



### 2 方法

### Ⅰ拷贝

流的读写可以总结为从输入流读取，从输出流写出，这个过程我们定义为**拷贝**。这是一个基本过程，也是文件、流操作的基础。

以文件流拷贝为例：

```java
BufferedInputStream in = FileUtil.getInputStream("d:/test.txt");
BufferedOutputStream out = FileUtil.getOutputStream("d:/test2.txt");
long copySize = IoUtil.copy(in, out, IoUtil.DEFAULT_BUFFER_SIZE);
```

copy 方法同样针对 `Reader、Writer、Channel` 等对象有一些重载方法，并提供可选的缓存大小。默认的，缓存大小为 1024 个字节，如果拷贝大文件或流数据较大，可以适当调整这个参数。

针对 NIO，提供了 copyByNIO 方法，以便和 BIO 有所区别。

[使用NIO对文件流操作的提升](https://www.cnblogs.com/gaopeng527/p/4896783.html)



### Ⅱ Stream 转 Reader、Writer

- `IoUtil.getReader`：将 InputStream 转为 BufferedReader 用于读取字符流，它是部分 readXXX 方法的基础
- `IoUtil.getWriter`：将 OutputStream 转为 OutputStreamWriter 用于写入字符流，它是部分 writeXXX 的基础

本质上这两个方法只是简单 new 一个新的 Reader 或者 Writer 对象，但是封装为工具方法配合 IDE 的自动提示可以大大减少查阅次数。



### Ⅲ 读取流中的内容

读取流中的内容总结下来，可以分为 read 方法和 readXXX 方法。

1.`read` 方法有诸多的重载方法，根据参数不同，可以读取不同对象中的内容，这包括：

- `InputStream`
- `Reader`
- `FileChannel`

这三个重载大部分返回 String 字符串，为字符流读取提供极大便利。

2.`readXXX` 方法主要针对返回值做了一些处理，例如：

- `readBytes` 返回 byte 数组（读取图片等）
- `readHex` 读取 16 进制字符串
- `readObj` 读取序列化对象（反序列化）
- `readLines` 按行读取

3.toStream 方法则是将某些对象转换为流对象，便于在某些情况下操作：

- `String` 转换为 `ByteArrayInputStream`
- `File` 转换为 `FileInputStream`



### Ⅳ 写入到流

- `IoUtil.write` 方法有两个重载方法，一个直接调用 OutputStream.write 方法，另一个用于将对象转换为字符串（调用 toString 方法），然后写入到流中。
- IoUtil.writeObjects 用于将可序列化对象序列化后写入到流中。

`write` 方法并没有提供 writeXXX，需要自己抓换为 String 或 byte[]



### Ⅴ 关闭

对于 IO 操作来说，使用频率最高（也最容器被遗忘）的就是 `close` 操作，好在 Java 规范使用了优雅的 Closeable 接口，这样我们只需简单封装调用此接口的方法即可。

关闭操作会面临两个问题：

1. 被关闭对象为空
2. 对象关闭失败（或对象已关闭）

`IoUtil.close` 方法很好的解决了这两个问题

在 JDK1.7 中，提供了 AutoCloseable 接口，在 IoUtil 中同样提供相应的重载方法，在使用中并不会感觉到有哪些不同。





## ③ 文件工具类-FileUtil



### 1 简介

在 IO 操作中，文件的操作相对来说是比较复杂的，但也是使用频率最高的部分，我们几乎所有的项目中都躺着一个叫做 FileUtil 或者 FileUtils 的工具类。

总体来说，FileUtil 类包含以下几类操作工具：

1. 文件操作：包括文件目录的新建、删除、复制、移动、改名等
2. 文件判断：判断文件或目录是否非空，是否为目录，是否为文件等等
3. 绝对路径：针对 ClassPath 中的文件转换为绝对路径文件
4. 文件名：主文件名，扩展名的获取
5. 读操作：包括类似 IoUtil 中的 getReader、readXXX 操作
6. 写操作：包括 getWrite 和 writeXXX 操作

在 FileUtil 中，努力让方法名与 Linux 相一致，例如创建文件的方法并不是 createFile，而是 touch，这种统一对于熟悉 Linux 的人来说，大大提高了上手速度。当然，如果你不熟悉 Linux ，那 FileUtil 工具类的使用则是在帮助你学习 Linux 命令。

这些类 Linux 命令的方法包括：

- `ls` 列出目录和文件
- `touch` 创建文件，如果父目录不存在也自动创建
- `mkdir` 创建目录，会递归创建每层目录
- `del` 删除文件或目录（递归删除，不判断是否为空），这个方法相当于 Linux 的 delete 命令
- `copy` 拷贝文件或目录

这些方法提供了人性化的操作，例如 touch 方法，在创建文件的情况下会自动创建上层目录（对于使用者来说这也是大部分情况下的需求），同样 mkdir 也会创建父目录。

> 需要注意的是，del 方法会删除目录而不判断是否为空，这一方面方便了使用，另一方面也可能造成一些预想不到的后果（比如拼写错路径而删除不应该删除的目录），所以请谨慎使用此方法。

关于 FileUtil 中更多工具方法。请查阅 API 文档。





## ④ 文件监听-WatchMonitor



### 1 由来

很多时候我们需要监听一个文件的变化或者目录的变动，包括文件的创建、修改、删除以及目录下文件的创建、修改和删除，在 JDK7 前我们只能靠轮询方式遍历目录或者定时检查文件的修改事件，这样效率非常低，性能也很差。因此在 JDK7 中引入了 `watchService` 。不过考虑到其 API 并不友好，于是 Hutool 便针对其做了简化封装，使监听更简单，也提供了更好的功能，这包括：

- 支持多级目录的监听（WatchService只支持一级目录），可自定义监听目录深度
- 延迟合并触发支持（文件变动时可能触发多次 modify，支持在某个时间范围内的多次修改事件合并为一个修改事件）
- 简单易懂的 API 方法，一个方法即可搞定监听，无需理解复杂的监听注册机制
- 多观察着实现，可以根据业务实现多个 watcher 来响应同一个事件（通过 WatcherChain）



### Ⅰ WatchMonitor

在 Hutool 中，WatchMonitor 主要针对 JDK7 中 WatchService 做了封装，针对文件和目录的变动（创建、更新、删除）做一个钩子，在 Watcher 中定义相应的逻辑来应对这些文件的变化。



### Ⅱ 内部应用

在 Hutool-setting 模块，使用 WatchMonitor 监测配置文件变化，然后自动 load 到内存中。WatchMonitor 的使用可以避免轮询，以事件响应的方式应对文件变化。



### 2 使用

`WatchMonitro` 提供的事件有：

- `ENTRY_MODIFY` 文件或目录的修改事件
- `ENTRY_CREATE` 文件或目录的创建事件
- `ENTRY_DELETE` 文件或目录的删除事件
- `OVERFLOW` 丢失的事件

这些事件对应`StandardWatchEventKinds`中的事件。



### Ⅰ监听制定事件

```java
File file = FileUtil.file("example.properties");
//这里只监听文件或目录的修改事件
WatchMonitor watchMonitor = WatchMonitor.create(file, WatchMonitor.ENTRY_MODIFY);
watchMonitor.setWatcher(new Watcher(){
	@Override
	public void onCreate(WatchEvent<?> event, Path currentPath) {
		Object obj = event.context();
		Console.log("创建：{}-> {}", currentPath, obj);
	}

	@Override
	public void onModify(WatchEvent<?> event, Path currentPath) {
		Object obj = event.context();
		Console.log("修改：{}-> {}", currentPath, obj);
	}

	@Override
	public void onDelete(WatchEvent<?> event, Path currentPath) {
		Object obj = event.context();
		Console.log("删除：{}-> {}", currentPath, obj);
	}

	@Override
	public void onOverflow(WatchEvent<?> event, Path currentPath) {
		Object obj = event.context();
		Console.log("Overflow：{}-> {}", currentPath, obj);
	}
});

//设置监听目录的最大深入，目录层级大于制定层级的变更将不被监听，默认只监听当前层级目录
watchMonitor.setMaxDepth(3);
//启动监听
watchMonitor.start();
```



### Ⅱ 监听全部事件

其实我们不必实现 `Watcher` 所有的接口方法，Hutool 同时提供了 `SimpleWatcher` 类，只需要重写对应方法即可。

同样，如果我们想监听所有事件，可以：

```java
WatchMonitor.createAll(file, new SimpleWatcher(){
	@Override
	public void onModify(WatchEvent<?> event, Path currentPath) {
		Console.log("EVENT modify");
	}
}).start();
```

`createAll` 方法会创建一个监听所有事件的 WatchMonitor，同时在第二个参数中定义 Watcher 来负责处理这些变动。



### Ⅲ 延迟处理监听事件

在监听目录或文件时，如果这个文件有修改操作，JDK 会多次触发 modify 方法，为了解决这个问题，我们定义了 `DelayWatcher`，此类通过维护一个 Set 将短时间内相同文件多次 modify 的事件合并处理触发，从而避免以上问题。

```java
WatchMonitor monitor = WatchMonitor.createAll("d:/", new DelayWatcher(watcher, 500));
monitor.start();
```