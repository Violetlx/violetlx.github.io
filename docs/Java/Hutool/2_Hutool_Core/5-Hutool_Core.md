---
title: Hutool-Core核心（五）
date: 2024/12/20
---

![内蒙古，冬季，草，树，雪，5K](https://bizhi1.com/wp-content/uploads/2024/05/Inner_Mongolia_Winter_Grass_Tree_Snow_5K-Wallpaper_5120x2880-small.jpg)

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



## ⑤ 文件类型判断-FileTypeUtil



### 1 由来

在文件上传时，有时候我们需要判断文件类型。但是又不能简单的通过扩展名来判断（防止恶意脚本等上传到服务器上），于是我们需要在服务端通过读取文件首部几个字节值来判断常用的文件类型。



### 2 使用

这个工具类使用非常方便，通过调用 `FileTypeUtil.getType` 即可判断，这个方法同时提供众多重载方法，用于读取不同的文件和流。

```java
File file = FileUtil.file("d:/test.jpg");
String type = FileTypeUtil.getType(file);
//输出 jpg则说明确实为jpg文件
Console.log(type);
```



### 3 原理和局限性

这个类是通过读取文件流前 N 个 byte 值来判断文件类型，在类中我们通过 Map 形式将常用的文件类型做了映射，这些映射都是网络上搜集而来。也就是说，我们只能识别有限的几种文件类型。但是这些类型已经涵盖了常用的图片、音频、视频、office 文档类型，可以应对大部分的使用场景。

> 对于某些文本格式的文件我们并不能通过首部 byte 判断其类型，比如 JSON ，这类文件本质上是文本文件，我们应该读取其文本内容，通过其语法判断类型。



### 4 自定义类型

为了提高 `FileTypeUtil` 的扩展性，我们通过 `putFileType` 方法可以自定义文件类型。

```java
FileTypeUtil.putFileType("ffd8ffe000104a464946", "new_jpg");
```

第一个参数是文件流前 N 个 byte 的 16 进制表示，我们可以读取自定义文件查看，选取一定长度即可（长度越长越精确），第二个参数就是文件类型，然后使用 `FileTypeUtil.getType` 即可。

> 注意 xlsx、docx 本质上是各种 XML 打包为 zip 的结果，因此会被识别为 zip 格式。





## ⑥ 文件



### 1 文件读取-FileReader

### Ⅰ由来

在 `FileUtil` 中本来已经针对文件的读操作做了大量的静态封装，但是根据职责分离原则，我觉得有必要针对文件读取单独封装一个类，这样项目更加清晰。当然，使用 `FileUtil` 操作文件是最方便的。



### Ⅱ 使用

在 JDK 中，同样有一个 FileReader 类，但是并不如想象的那样好用，于是 Hutool 便提供了更加便捷的 FileReader 类。

```java
//默认UTF-8编码，可以在构造中传入第二个参数做为编码
FileReader fileReader = new FileReader("test.properties");
String result = fileReader.readString();
```

FileReader 提供了以下方法快速读取文件内容：

- `readBytes`
- `readString`
- `readLines`

同时，此类还提供了以下方法用于转换为流或者 `BufferedReader`：

- `getReader`
- `getInputStream`





### 2 文件写入-FileWriter

相应的，文件读取有了，自然有文件写入类，使用方式与 `FileReader` 也类似：

```java
FileWriter writer = new FileWriter("test.properties");
writer.write("test");
```

写入文件分为追加模式和覆盖模式两类，追加模式可以用 `append` 方法，覆盖模式可以用 `write` 方法，同时也提供了一个 `write` 方法，第二个参数是可选覆盖模式。

同样，此类提供了：

- `getOutputStream`
- `getWrite`
- `getPrintWriter`

这些方法用于转换为相应的类，提供更加灵活的写入操作。



### 3 文件追加-FileAppender

### Ⅰ 由来

顾名思义，`FileAppender` 类表示文件追加器。此对象持有一个文件，在内存中积累一定量的数据后统一追加到文件，此类只有在写入文件时打开文件，并在写入结束后关闭之。因此此类不需要关闭。

在调用 append 方法后会缓存与内存，只有超过容量最后才会一次性写入文件，因此内存中随时有剩余未写入文件的内容，在最后必须调用 flush 方法将剩余内容刷入文件。

也就是说，这是一个支持缓存的文件内容追加器。此类主要用于类似于日志写出这类需求。



### Ⅱ 使用

```java
FileAppender appender = new FileAppender(file, 16, true);
appender.append("123");
appender.append("abc");
appender.append("xyz");

appender.flush();
appender.toString();
```



### 4 文件跟随-Tailer

### Ⅰ由来

有时候我们要启动一个线程实时监控文件的变化，比如有新内容写到文件时，我们可以及时打印出来，这个功能非常类似于 Linux 下的 tail -f 命令。



### Ⅱ 使用

```java
Tailer tailer = new Tailer(FileUtil.file("f:/test/test.log"), Tailer.CONSOLE_HANDLER, 2);
tailer.start();
```

其中 `Tailer.CONSOLE_HANDLER` 表示文件新增内容默认输出到控制台。

```java
/**
 * 命令行打印的行处理器
 * 
 * @author looly
 * @since 4.5.2
 */
public static class ConsoleLineHandler implements LineHandler {
	@Override
	public void handle(String line) {
		Console.log(line);
	}
}
```

我们也可以实现自己的 LineHandler 来处理每一行数据。

> 注意 此方法会阻塞当前线程
>



### 5 文件名工具-FileNameUtil

### Ⅰ 由来

文件名操作工具类，主要针对文件名获取主文件名、扩展名等操作，同时针对 Windows 平台，清理无效字符。

此工具类在 `5.4.1` 之前是 `FileUtil` 的一部分，后单独剥离为 `FileNameUtil` 工具。



### Ⅱ 使用

① 获取文件名

```java
File file = FileUtil.file("/opt/test.txt");

// test.txt
String name = FileNameUtil.getName(file);
```

② 获取主文件名和扩展名

```java
File file = FileUtil.file("/opt/test.txt");

// "test"
String name = FileNameUtil.mainName(file);

// "txt"
String name = FileNameUtil.extName(file);
```

> 注意，此处获取的扩展名不带 `.` 。`FileNameUtil.mainName` 和 `FileNameUtil.getPrefix` 等价，同理 `FileNameUtil.extName` 和 `FileNameUtil.getSuffix` 等价，保留两个方法用于适应不同用户的习惯。
>





## ⑦ 资源

### 1 概述

### Ⅰ 由来

资源（Resource）在 Hutool 中是一个广泛的概念，凡是存储数据的地方都可以归类到资源，那为何要提供一个如此抽象的接口呢？

在实际编码当中，我们需要读取一些数据，比如配置文件、文本内容、图片甚至是任何二进制流，为此我们要加入很多的重载方法，比如：

```java
read(File file){...}

read(InputStream in){...}

read(byte[] bytes){...}

read(URL url){...}
```

等等如此，这样会造成整个代码变得非常冗余，查找 API 也很费尽。其实无论数据来自哪里，最终目的是，我们想从这些地方督导 byte[] 或者 String。那么，我们就可以抽象一个 Resource 接口，让代码变得简单：

```java
read(Resource resource){...}
```

用户只需传入 Resource 的实现即可。



### Ⅱ 定义

常见的，我们需要从资源中获取流（getStream），获取 Reader 来读取文本（getReader），直接读取文本（readStr），于是定义如下：

```java
public interface Resource {
    String getName();
    URL getUrl();
    InputStream getStream();
    BufferedReader getReader(Charset charset);
    String readStr(Charset charset);
}
```

> 关于 Resource 的详细定义见：[Resource.java](https://gitee.com/dromara/hutool/blob/v5-master/hutool-core/src/main/java/cn/hutool/core/io/resource/Resource.java)
>

定义了 Resource ，我们就可以预定一一些特别的资源：

- `BytesResource` 从 byte[] 中读取资源
- `InputStreamResource` 从流中读取资源
- `UrlResource` 从 URL 中读取资源
- `FileResource` 从文件中读取资源
- `ClassPathResource` 从 classpath（src/resources 下）中读取资源
- `WebAppResource` 从 web root 中读取资源
- `MultiResource` 从多种资源中混合读取资源
- `MultiFileResource` 从多个文件中混合读取资源

当然，我们还可以根据业务需要自己实现 Resource 接口，，完成自定义的资源读取。

> 为了便于资源的查找，可以使用 `ResourceUtil` 快捷工具来获得我们需要的资源。





### 2 资源工具-ResourceUtil

### Ⅰ 介绍

`ResourceUtil` 提供了资源快捷读取封装。



### Ⅱ 使用

ResourceUtil 中最核心的方法是 getResourceObj ，此方法可以根据传入路径是否为绝对路径而返回不同的实现。比如路径是：file:/opt/test，或者 /opt/test

都会被当做绝对路径，此时调用 FileResource 来读取数据。如果不满足以上条件，默认用 `ClassPathResource` 读取 classpath 中的资源或者文件。

同样，此工具类还封装了 readBytes 和 readStr 用于快捷读取 bytes 和字符串。

举个例子，假设我们在 `classpath` 下放了一个 `test.xml` ，读取就变得非常简单：

```java
String str = ResourceUtil.readUtf8Str("test.xml");
```

假设我们的文件存放 `src/resources/config` 目录下，则读取改为：

```java
String str = ResourceUtil.readUtf8Str("config/test.xml");
```

> 注意 在 IDEA 中，新加入文件到 `src/resources` 目录下，需要重新 import 项目，以便在编译时顺利把资源文件拷贝到 target 目录下。如果找不到文件，请去 target 目录下确认文件是否存在。
>





### ③ ClassPath资源访问-ClassPathResource

### Ⅰ 什么时 ClassPath

简单来说 ClassPath 就是查找 class 文件的路径，在 Tomcat 等容器下，ClassPath 一般是 `WEB-INF/classes` ，在普通 java 程序中，我们可以通过定义 -cp 或者 -classpath 参数来定义查找 class 文件的路径，这些路径就是 ClassPath 。

为了项目方便，我们定义的配置文件肯定不能用绝对路径，所以需要使用相对路径，这时候最好的办法就是把配置文件和 class 文件放在一起，便于查找。



### Ⅱ 由来

在 Java 编码过程中，我们常常希望读取项目内的配置文件，按照 Maven 的习惯，这些文件一般放在项目的 src/main/resources 下，读取的时候使用：

```java
String path = "config.properties";
InputStream in = this.class.getResource(path).openStream();
```

使用当前类来获取资源其实就是使用当前类的类加载器获取资源，最后 openStream() 方法获取输入流来读取文件流。



### Ⅲ 封装

面对这种复杂的读取操作，我们封装了 `ClassPathResource` 类简化这种资源的读取：

```java
ClassPathResource resource = new ClassPathResource("test.properties");
Properties properties = new Properties();
properties.load(resource.getStream());

Console.log("Properties: {}",properties);
```

这就大大简化了 ClassPath 中资源的获取。

> Hutool 提供针对 properties 的封装类 Props ，同时提供更加强大的配置文件 Setting 类，这两个类已经针对 ClassPath 做过相应封装，可以以更加便捷的方式读取配置文件。
