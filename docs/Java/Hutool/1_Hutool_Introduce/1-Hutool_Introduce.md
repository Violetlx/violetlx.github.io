---
title: Hutool简介
date: 2024/12/18
---

![首图](https://bizhi1.com/wp-content/uploads/2024/11/Snow_Mountains_Forest_River_Sunshine_Scenery_5K-Wallpaper_5120x2880.jpg)



## 简介

Hutool 是一个小而全的 Java 工具类库，通过静态方法封装，降低相关 API 的学习成本，提高工作效率，使 Java 拥有函数式语言般的优雅。

Hutool 中的工具方法来自每个用户的精雕细琢，它涵盖了 Java 开发底层代码中的方方面面，它既是大型项目开发中解决小问题的利器，也是小型项目中的效率担当。

Hutool 使项目中 `util` 包友好的替代，他节省了开发人员对项目中公用类和公用工具方法的封装时间，使开发专注于业务，同时可以最大限度的避免封装不完善带来的 bug 。



### 1 Hutool 名称的由来

`Hutool = Hu + tool` ，是原公司项目底层代码剥离后的开源库，Hu 是公司名称的表示，tool 表示工具。Hutool 谐音 `糊涂` ，一方面简洁易懂，一方面寓意 `难得糊涂`。



### 2 Hutool 如何改变我们的 coding 方式

Hutool 的目标是使用一个工具方法代替一段复杂代码，从而最大限度的避免 `复制粘贴` 代码的问题，彻底改变我们写代码的方式。

以计算 MD5 为例：

- 【以前】打开搜索引擎 - > 搜 `Java MD5 加密` - > 打开某篇博客 - > 复制粘贴 - > 改改好用
- 【现在】引入 Hutool - > `SecureUtil.md5()`

Hutool 的存在就是为了减少代码的搜索成本，避免网络上参差不齐的代码出现导致的 bug 。





## 包含组件

一个 Java 基础工具类，对文件、流、加密解密、转码、正则、线程、XML 等 JDK 方法进行封装，组成各种 Util 工具类，同时提供以下组件：

| 模块               | 介绍                                                         |
| ------------------ | ------------------------------------------------------------ |
| hutool-aop         | JDK动态代理封装，提供非IOC下的切面支持                       |
| hutool-bloomFilter | 布隆过滤，提供一些Hash算法的布隆过滤                         |
| hutool-cache       | 简单缓存实现                                                 |
| hutool-core        | 核心，包括Bean操作、日期、各种Util等                         |
| hutool-cron        | 定时任务模块，提供类Crontab表达式的定时任务                  |
| hutool-crypto      | 加密解密模块，提供对称、非对称和摘要算法封装                 |
| hutool-db          | JDBC封装后的数据操作，基于ActiveRecord思想                   |
| hutool-dfa         | 基于DFA模型的多关键字查找                                    |
| hutool-extra       | 扩展模块，对第三方封装（模板引擎、邮件、Servlet、二维码、Emoji、FTP、分词等） |
| hutool-http        | 基于HttpURLConnection的Http客户端封装                        |
| hutool-log         | 自动识别日志实现的日志门面                                   |
| hutool-script      | 脚本执行封装，例如Javascript                                 |
| hutool-setting     | 功能更强大的Setting配置文件和Properties封装                  |
| hutool-system      | 系统参数调用封装（JVM信息等）                                |
| hutool-json        | JSON实现                                                     |
| hutool-captcha     | 图片验证码实现                                               |
| hutool-poi         | 针对POI中Excel和Word的封装                                   |
| hutool-socket      | 基于Java的NIO和AIO的Socket封装                               |
| hutool-jwt         | JSON Web Token (JWT)封装实现                                 |





## 引入

`Hutool-all` 是一个 Hutool 的集成打包产品，由于考虑到懒人用户及分不清各个模块作用的用户，无脑引入 `Hutool-all` 模块是快速开始和深入应用的最佳方式。



### 1 import 方式

如果你想像 SpringBoot 一样引入 Hutool，再由子模块决定用到哪些模块，你可以在父模块中加入：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-bom</artifactId>
            <version>${hutool.version}</version>
            <type>pom</type>
            <!-- 注意这里是import -->
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

在子模块中就可以引入自己需要的模块了：

```xml
<dependencies>
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-http</artifactId>
    </dependency>
</dependencies>
```

> 使用 import 的方式，只会引入 hutool-bom 内的 dependencyManagement 的配置，其他配置在这个引用方式下完全不起作用。



### 2 exclude 方式

如果你引入的模块比较多，但是某几个模块没用，你可以：

```xml
<dependencies>
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-bom</artifactId>
        <version>${hutool.version}</version>
        <!-- 加不加这句都能跑，区别只有是否告警  -->
        <type>pom</type>
        <exclusions>
            <exclusion>
                    <groupId>cn.hutool</groupId>
                    <artifactId>hutool-system</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>
```

> 这个配置会传递依赖 hutool-bom 内所有 denpendencies 的内容，当前 hutool-bom 内的 denpendencies 全部设置了 version，就意味着在 maven resolve 的时候 hutool-bom 内就算存在 denpendencyManagement 也不会产生任何作用。





## 安装

### 1 Maven

在项目的 pom.xml 的 denpendencies 中加入以下内容：

```xml
<denpendency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.26</version>
</denpendency>
```

### 2 Gradle

```java
implementation 'cn.hutool:hutool-all:5.8.26'
```
