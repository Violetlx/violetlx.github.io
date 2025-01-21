---
title: Hutool-Core核心（九）
date: 2024/01/09
---

![翡翠湖烟雾缭绕的日落](https://bizhi1.com/wp-content/uploads/2024/10/smoky-sunset-at-emerald-lake-te-5120x2880-1.jpg)

## 工具类

::: tip

① 概述

② 字符串工具-StrUtil

③ 16进制工具-HexUtil

④ Escape工具-EscapeUtil

⑤ Hash算法-HashUtil

⑥ URL工具-URLUtil

⑦ XML工具-XmlUtil

⑧ 对象工具-ObjectUtil

⑨ 反射工具-ReflectUtil

⑩ 泛型类型工具-TypeUtil

⑪ 分页工具-PageUtil

⑫ 剪贴板工具-ClipboardUtil

⑬ 类工具-ClassUtil

⑭ 枚举工具-EnumUtil

⑮ 命令行工具-RuntimeUtil

⑯ 数字工具-NumberUtil

⑰ 数组工具-ArrayUtil

⑱ 随机工具-RandomUtil

⑲ 唯一ID工具-IdUtil

⑳ 压缩工具-ZipUtil

㉑ 引用工具-ReferenceUtil

㉒ 正则工具-ReUtil

㉓ 身份证工具-IdcardUtil

㉔ 信息脱敏工具-DesensitizedUtil

㉕ 社会信用代码工具-CreditCodeUtil

㉖ SPI加载工具-ServiceLoaderUtil

㉗ 字符编码工具-CharseUtil

㉘ 类加载工具-ClassLoaderUtil

:::



## ⑱ 随机工具-RandomUtil



### 1 说明

`RandomUtil` 主要针对 JDK 中 `Random` 对象做封装，严格来说，Java 产生的随机数都是伪随机数，因此 Hutool 封装后产生的随机结果也是伪随机结果，不过这种随即结果对于大多数情况已经够用。



### 2 使用

- `RandomUtil.randomInt` 获得指定范围内的随机数

  例如我们想生成一个 [10,100] 的随机数，则：

  ```java
  int c = RandomUtil.randomInt(10,100);
  ```

- `RandomUtil.randomBytes` 随机 bytes，一般用于密码或者 salt 生成

  ```java
  byte[] c = RandomUtil.randomBytes(10);
  ```

- `RandomUtil.randomEle` 随机获得列表中的元素

- `RandomUtil.randomEleSet` 随机获得列表中的一定量的不重复元素，返回 LinkedHashSet

  ```java
  Set<Integer> set = RandomUtil.randomEleSet(CollUtil.newArrayList(1,2,3,4,5,6),2);
  ```

- `RandomUtil.randomString` 获得一个随机的字符串（只包含数字和字符）

- `RandomUtil.randomNumbers` 获得一个只包含数字的字符串

- `RandomUtil.weightRandom` 权重随机生成器，传入带权重的对象，然后根据权重随机获取对象

```java
    /**
     * RandomUtil使用
     */
    public static void test1() {
        //RandomUtil.randomInt
        int randomInt = RandomUtil.randomInt();
        System.out.println("test1--randomInt==>"+randomInt);
        //最大
        int randomInt1 = RandomUtil.randomInt(100);
        System.out.println("test1--randomInt1==>"+randomInt1);
        //最大最小
        int randomInt2 = RandomUtil.randomInt(10, 100);
        System.out.println("test1--randomInt2==>"+randomInt2);

        //RandomUtil.randomInts 随机排列[0,10)
        int[] ints = RandomUtil.randomInts(10);
        System.out.println("test1--ints==>"+Arrays.toString(ints));

        //RandomUtil.randomBytes 随机 bytes，一般用于密码或者 salt 生成
        byte[] bytes = RandomUtil.randomBytes(10);
        System.out.println("test1--bytes==>"+Arrays.toString(bytes));

        //RandomUtil.randomEle 随机获得列表中的元素
        String randomEle = RandomUtil.randomEle(new String[]{"a", "b", "c"});
        System.out.println("test1--randomEle==>"+randomEle);

        //RandomUtil.randomEleSet 随机获得列表中的一定量的不重复元素，返回 LinkedHashSet
        Set<Integer> set = RandomUtil.randomEleSet(
                CollUtil.newArrayList(1,1,2,2,3,3,4,4,5,5,6,6,6,6,6,6,6),2);
        System.out.println("test1--set==>"+set);

        //RandomUtil.randomNumbers 获得一个只包含数字的字符串
        String randomNumbers = RandomUtil.randomNumbers(10);
        System.out.println("test1--randomNumbers==>"+randomNumbers);

        //RandomUtil.weightRandom 权重随机生成器，传入带权重的对象，
        //然后根据权重随机获取对象(权重只是概率比较大，不是百分百)
        WeightRandom.WeightObj<String>[] weightObjs = new WeightRandom.WeightObj[3];
        weightObjs[0] = new WeightRandom.WeightObj<>("A", 10);
        weightObjs[1] = new WeightRandom.WeightObj<>("B", 30);
        weightObjs[2] = new WeightRandom.WeightObj<>("C", 60);
        // 根据权重随机获取一个对象
        WeightRandom<String> stringWeightRandom = RandomUtil.weightRandom(weightObjs);

        // 输出结果
        System.out.println("随机获取的对象是: " + stringWeightRandom.next());
    }
```





## ⑲ 唯一ID工具-IdUtil



### 1 介绍

在分布式环境中，唯一 ID 生成应用十分广泛，生成方法也多种多样，Hutool 针对一些常用生成策略做了简单封装。

唯一 ID 生成器的工具类，涵盖了：

- UUID
- ObjectId（MongoDB）
- Snowflake（Twitter）



### 2 使用

**① UUID**

UUID 全称通用唯一识别码（`universally unique identifier`），JDK 通过 java.util.UUID 提供了 Leach-Salz 变体的封装。在 Hutool 中，生成一个 UUID 字符串方法如下：

```java
//生成的UUID是带-的字符串，类似于：a5c8a5e8-df2b-4706-bea4-08d0939410e3
String uuid = IdUtil.randomUUID();

//生成的是不带-的字符串，类似于：b17f24ff026d40949c85a24f4f375d42
String simpleUUID = IdUtil.simpleUUID();
```

> 说明 Hutool 重写 `java.util.UUID` 的逻辑，对应类为 `cn.hutool.core.lang.UUID` ，使生成不带 - 的 UUID 字符串不再需要做字符替换，性能提升一倍左右。

```java
    /**
     * 1.UUID
     */
    public static void test1() {
        //生成的UUID是带-的字符串，类似于：a5c8a5e8-df2b-4706-bea4-08d0939410e3
        String uuid = IdUtil.randomUUID();
        System.out.println("test1--uuid==>"+uuid);

        //生成的是不带-的字符串，类似于：b17f24ff026d40949c85a24f4f375d42
        String simpleUUID = IdUtil.simpleUUID();
        System.out.println("test1--simpleUUID==>"+simpleUUID);

        String fastSimpleUUID = IdUtil.fastSimpleUUID();
        System.out.println("test1--fastSimpleUUID==>"+fastSimpleUUID);
        String fastUUID = IdUtil.fastUUID();
        System.out.println("test1--fastUUID==>"+fastUUID);

        //结果：
        //test1--uuid==>4873489f-e80c-4a44-8c21-c5fc34c264f2
        //test1--simpleUUID==>876ed5dc11d044aebb0547a3321ed298
        //test1--fastSimpleUUID==>caea9cc54e914790b7b438c505cd7b78
        //test1--fastUUID==>7864d747-3579-44e4-a4b9-53cf85afcbb9
    }
```

**② ObjectId**

ObjectId 是 MongoDB 数据库的一种唯一 ID 生成策略，是 UUID version1 的变种，详细介绍可见：[服务化框架－分布式Unique ID的生成方法一览](http://calvin1978.blogcn.com/articles/uuid.html)

Hutool 针对此封装了 cn..hutool.core.lang.ObjectId，快捷创建方法为：

```java
//生成类似：5b9e306a4df4f8c54a39fb0c
String id = ObjectId.next();

//方法2：从Hutool-4.1.14开始提供
String id2 = IdUtil.objectId();
```

```java
    /**
     * 2.ObjectId
     */
    public static void test2() {
        String objectId = IdUtil.objectId();
        System.out.println("test2--objectId==>"+objectId);

        //生成类似：5b9e306a4df4f8c54a39fb0c
        String id = ObjectId.next();
        System.out.println("test2--id==>"+id);

        //方法2：从Hutool-4.1.14开始提供
        String id2 = IdUtil.objectId();
        System.out.println("test2--id2==>"+id2);

        //结果：
        //test2--objectId==>677f468a502e7e99744a5a9c
        //test2--id==>677f468a502e7e99744a5a9d
        //test2--id2==>677f468a502e7e99744a5a9e
    }
```

**③ Snowflake**

分布式系统中，有一些需要使用全局唯一 ID 的场景，有些时候我们希望能使用一种简单一些的 ID，并且希望 ID 能够按照时间有序生成。Twitter 的 Snowflake 算法就是这种生成器。

使用方法如下：

```java
//参数1为终端ID
//参数2为数据中心ID
Snowflake snowflake = IdUtil.getSnowflake(1, 1);
long id = snowflake.nextId();

//简单使用
long id = IdUtil.getSnowflakeNextId();
String id = IdUtil.getSnowflakeNextIdStr();
```

> 注意 `IdUtil.createSnowflake` 每次调用会创建一个新的 Snowflake 对象，不同的 Snowflake 对象创建的 ID 可能会有重复，因此请自行维护对象为单例，或者使用 `IdUtil.getSnowflake` 使用全局单例对象。

```java
    /**
     * 3.Snowflake
     */
    public static void test3() {
        //参数1为终端ID
        //参数2为数据中心ID
        Snowflake snowflake = IdUtil.getSnowflake(1, 1);
        long id = snowflake.nextId();
        System.out.println("test3--id==>"+id);

        //简单使用
        long id1 = IdUtil.getSnowflakeNextId();
        String id2 = IdUtil.getSnowflakeNextIdStr();
        System.out.println("test3--id1==>"+id1);
        System.out.println("test3--id2==>"+id2);

        //结果：
        //test3--id==>1877200198204264448
        //test3--id1==>1877200198425829376
        //test3--id2==>1877200198425829377
    }

```





## ⑳ 压缩工具-ZipUtil



### 1 由来

在 Java 中，对文件、文件夹打包，压缩是一件比较繁琐的事情，我们常常引入 [Zip4j](https://github.com/srikanth-lingala/zip4j) 进行此类操作。但是很多时候，JDK 中的 zip 报就可满足我们大部分需求。ZipUtil 就是针对 java.util.zip 做工具化封装，是压缩解压操作可以一个方法搞定，并且自动处理文件和目录的问题，不需要用户判断，压缩后的文件也会自动创建文件，自动创建父目录，大大简化的压缩解压的复杂度。



### 2 方法

**① Zip**

1. 压缩

   ZipUtil.zip 方法提供一系列的重载方法，满足不同需求的压缩需求，这包括：

   - 打包到当前目录（可用打包文件，也可以打包文件夹，根据路径自动判断）

     ```java
     //将aaa目录下的所有文件目录打包到d:/aaa.zip
     ZipUtil.zip("d:/aaa");
     ```

   - 指定打包后保存的目的地，自动判断目标是文件还是文件夹

     ```java
     //将aaa目录下的所有文件目录打包到d:/bbb/目录下的aaa.zip文件中
     //此处第二个参数必须为文件，不能为目录
     ZipUtil.zip("d:/aaa","d:/bbb/aaa.zip");
     
     //将aaa目录下的所有文件目录打包到d:/bbb/目录下的ccc.zip文件中
     ZipUtil.zip("d:/aaa","d:/bbb/ccc.zip");
     ```

   - 可选是否包含被打包的目录。比如我们打包一个照片的目录，打开这个压缩包有可能是带目录的，也有可能是打开压缩包直接看到的是文件。zip 方法增加一个 boolean 参数可选这两种模式。以应对众多需求。

     ```java
     //将aaa目录以及其目录下的所有文件目录打包到d:/bbb/目录下的ccc.zip文件中
     ZipUtil.zip("d:/aaa","d:/bbb/ccc.zip",true);
     ```

   - 多文件或目录压缩。可以选择多个文件或目录一起打成 zip 包。

     ```java
     ZipUtil.zip(FileUtil.file("d:/bbb/ccc.zip"), false, 
         FileUtil.file("d:/test1/file1.txt"),
         FileUtil.file("d:/test1/file2.txt"),
         FileUtil.file("d:/test2/file1.txt"),
         FileUtil.file("d:/test2/file2.txt")
     );
     ```

2. 解压

   `ZipUtil.unzip` 解压。同样提供几个重载，满足不同需求。

   ```java
   //将test.zip解压到e:\\aaa目录下，返回解压到的目录
   file unzip = ZipUtil.unzip("E:\\aaa\\test.zip","e:\\aaa");
   ```



**② Gzip**

Gzip 是网页传输中广泛使用的压缩方式，Hutool 同样提供其工具方法简化其过程。

`ZipUtil.gzip` 压缩，可压缩字符串，也可压缩文件 `ZipUtil.unGzip` 解压Gzip文件



**③ Zlib**

ZipUtil.zlib 压缩，可压缩字符串，也可压缩文件 `ZipUtil.unZlib` 解压 zlib 文件

> 注意 ZipUtil 默认情况下使用系统编码，也就是说：
>
> 1. 如果你在命令下运行，则调用系统编码（一般Windows下为GBK、Linux下为UTF-8）
> 2. 如果你在IDE（如Eclipse）下运行代码，则读取的是当前项目的编码（详细请查阅 IDE 设置，我们项目默认都是 UTF-8 编码，因此解压和压缩都是用这个编码）



**④ 常见问题**

1. 解压时报 `java.lang.IllegalArgumentException:MALFORMED` 错误

   基本是因为编码问题，Hutool 默认使用 UTF-8 编码，自定义为其他编码即可（一般为 GBK）。

   ```java
   //将test.zip解压到e:\\aaa目录下，返回解压到的目录
   File unzip = ZipUtil.unzip("E:\\aaa\\test.zip","e:\\aaa",CharsetUtil.CHARSET_GBK);
   ```

2. 压缩并添加密码

   Hutool 或 JDK 的 zip 工具并不支持添加密码，可以考虑使用 [Zip4j (opens new window)](https://github.com/srikanth-lingala/zip4j)完成，以下代码来自Zip4j官网。

   ```java
   ZipParameters zipParameters = new ZipParameters();
   zipParameters.setEncryptFiles(true);
   zipParameters.setEncryptionMethod(EncryptionMethod.AES);
   // Below line is optional. AES 256 is used by default. You can override it to use AES 128. AES 192 is supported only for extracting.
   zipParameters.setAesKeyStrength(AesKeyStrength.KEY_STRENGTH_256); 
   
   List<File> filesToAdd = Arrays.asList(
       new File("somefile"), 
       new File("someotherfile")
   );
   
   ZipFile zipFile = new ZipFile("filename.zip", "password".toCharArray());
   zipFile.addFiles(filesToAdd, zipParameters);
   
   ```

   



## ㉑ 引用工具-ReferenceUtil



### 1 介绍

引用工具类，主要针对 Reference 工具化封装

主要封装包括：

1. `SoftReference` 软引用，在GC报告内存不足时会被GC回收
2. `WeakReference` 弱引用，在GC时发现弱引用会回收其对象
3. `PhantomReference` 虚引用，在GC时发现虚引用对象，会将`PhantomReference`插入`ReferenceQueue`。此时对象未被真正回收，要等到`ReferenceQueue`被真正处理后才会被回收。



### 2 方法

**① create**

根据类型枚举创建引用

```java
    /**
     * 1.创建不同类型的引用对象
     */
    private static void test1() {
        String strongReference = new String("Strong Reference");

        // 创建软引用
        Reference<String> softReference = ReferenceUtil.create(ReferenceUtil.ReferenceType.SOFT, strongReference);
        System.out.println("软引用内容: " + softReference.get());

        // 创建弱引用
        Reference<String> weakReference = ReferenceUtil.create(ReferenceUtil.ReferenceType.WEAK, strongReference);
        System.out.println("弱引用内容: " + weakReference.get());

        // 创建虚引用
        ReferenceQueue<String> queue = new ReferenceQueue<>();
        Reference<String> phantomReference = ReferenceUtil.create(ReferenceUtil.ReferenceType.PHANTOM, strongReference, queue);
        System.out.println("虚引用内容: " + phantomReference.get());
        
        //结果：
        //软引用内容: Strong Reference
        //弱引用内容: Strong Reference
        //虚引用内容: null
    }

```

- `create(ReferenceType type, T referent)`：根据指定的引用类型和被引用对象创建引用对象。`ReferenceType` 是枚举类型，表示引用类型。
  - `type`：引用类型枚举，包括 `SOFT`（软引用）、`WEAK`（弱引用）、`PHANTOM`（虚引用）。
  - `referent`：被引用的对象。
- `create(ReferenceType type, T referent, ReferenceQueue<? super T> queue)`：创建带有引用队列的引用对象，适用于 `PHANTOM` 类型。

**作用：** 该方法可以根据需求创建不同类型的引用对象，用于内存敏感的场景。

**实际开发场景：** 在缓存机制中，使用软引用和弱引用可以避免内存泄漏，同时也能在内存不足时自动释放对象。





























































































































































































































































































































































































































































































































































































