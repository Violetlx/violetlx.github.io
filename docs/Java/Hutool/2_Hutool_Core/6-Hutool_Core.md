---
title: Hutool-Core核心（六）
date: 2024/12/25
---

![黎明静谧中的船和鸭子](https://bizhi1.com/wp-content/uploads/2024/10/boat-and-duck-in-the-calm-of-dawn-us-3840x2160-1.jpg)

## 工具类

::: tip

① 概述

② 字符串工具-StrUtil

③ 16进制工具-HexUtil

④ Escape工具-EscapeUtil

⑤ Hash算法-HashUtil

⑥ URL工具-URLUtil

⑦ XML工具-XmlUtil

⑧对象工具-ObjectUtil

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



## ① 概述

### 1 包含内容

此内容的工具类为未经过分类的一些工具类，提供一些常用的工具方法。

此包中根据用途归类为 XXXUtil，提供大量的工具方法。在工具类中，主要以类方法（static方法为主），且各个类无法实例化为对象，一个方法是一个独立功能，无相互影响。





## ② 字符串工具-StrUtil



### 1 由来

这个工具的用处类似于 [Apache Commons Lang](http://commons.apache.org/) 中的 `StringUtil` 是因为前者更短，而且 `Str` 这个简写已经深入人心了，大家都知道是字符串的意思。常用的方法例如 `isBlank、isNotBlank、isEmpty、isNotEmpty` 这些就不做介绍了，判断字符串是否为空，下面介绍几个比较好用的功能。

 

### 2 方法

**① hasBlank、hasEmpty 方法**

就是给定一些字符串，如果一旦有空就返回 true，常用于判断好多字段是否有空的，（例如 web 表单数据）。

这两个方法的区别是 hasEmpty 只判断是否为 null 或者空字符串（""），hasBlank 则会把不可见字符也算作空。isEmpty 和 isBlank 同理。

```java
    /**
     * 1 hasBlank、hasEmpty方法
     */
    public static void test1(){
        //这两个方法的区别是hasEmpty只判断是否为null或者空字符串（""），hasBlank则会把不可见字符也算做空，isEmpty和isBlank同理。
        String str1 = "  ";
        String str2 = "  ";
        boolean hasBlank = StrUtil.hasBlank(str1);
        boolean hasEmpty = StrUtil.hasEmpty(str2);
        System.out.println("test1--hasBlank==>"+hasBlank);
        System.out.println("test1--hasEmpty==>"+hasEmpty);

        //结果：
        //test1--hasBlank==>true
        //test1--hasEmpty==>false
    }
```

**② removePrefix、removeSuffix 方法**

这两个是去掉字符串的前缀后缀的，例如娶个文件名的扩展名。

```java
String fileName = StrUtil.removeSuffix("pretty_girl.jpg",".jpg"); //fileName -> pretty_girl
```

还有忽略大小写的 `removePreffixIgnoreCase` 和 `removeSuffixIgnoreCase` 都比较实用。

```java
    /**
     * 2 removePrefix、removeSuffix 方法
     */
    private static void test2(){
        //fileName -> pretty_girl
        String fileName = StrUtil.removeSuffix("pretty_girl.jpg",".jpg");
        System.out.println("test2--fileName==>"+fileName);
        //pretty_girl -> pretty_girl
        String fileName2 = StrUtil.removePrefix("pretty_girl.jpg","pretty_");
        System.out.println("test2--fileName2==>"+fileName2);
        // 忽略大小写
        // pretty_girl -> pretty_girl
        String fileName3 = StrUtil.removePrefixIgnoreCase("Pretty_girl.jpg","PrETTY_");
        System.out.println("test2--fileName3==>"+fileName3);
        // pretty_girl -> pretty_girl
        String fileName4 = StrUtil.removeSuffixIgnoreCase("pretty_girl.jpg",".JPG");
        System.out.println("test2--fileName4==>"+fileName4);
        
        //结果：
        //test2--fileName==>pretty_girl
        //test2--fileName2==>girl.jpg
        //test2--fileName3==>girl.jpg
        //test2--fileName4==>pretty_girl
    }
```

**③ sub 方法**

不得不提一下这个方法，有人说 String 有了 subString 你还写它干啥，我想说 subString 方法越界啥的都会报异常，你还得自己判断，难受死了，Hutool 把各种情况判断都加进来了，而且 index 的位置还支持负数，-1 表示最后一个字符前（这个思想来自 [Python](https://www.python.org/)），还有就是如果不小心把第一个位置和第二个位置搞反了，也会自动修正（例如想截取第4个和第2个字符之间的部分也是可以的），举个例子：

```java
String str = "abcdefgh";
String strSub1 = StrUtil.sub(str, 2, 3); //strSub1 -> c
String strSub2 = StrUtil.sub(str, 2, -3); //strSub2 -> cde
String strSub3 = StrUtil.sub(str, 3, 2); //strSub2 -> c
```

需要注意的是，-1 表示最后一个字符，但是因为 sub 方法的结束 index 是不包含的，因此传 -1 最后一个字符是取不到的

```java
String str = "abcdefgh";
String strSub1 = StrUtil.sub(str, 2, -1); // cdefg
```

如果想截取后半段，可以使用 `StrUtil.subSuf` 方法。

```java
    /**
     * 3 sub方法
     */
    private static void test3(){
        String str = "abcdefgh";
        //strSub1 -> c
        String strSub1 = StrUtil.sub(str, 2, 3);
        System.out.println("test3--strSub1==>"+strSub1);
        //strSub2 -> cde
        String strSub2 = StrUtil.sub(str, 2, -3);
        System.out.println("test3--strSub2==>"+strSub2);
        //strSub2 -> c
        String strSub3 = StrUtil.sub(str, 3, 2);
        System.out.println("test3--strSub3==>"+strSub3);

        //需要注意的是，-1表示最后一个字符，但是因为sub方法的结束index是不包含的，因此传-1最后一个字符是取不到的：
        String strSub4 = StrUtil.sub(str, 2, -1);
        System.out.println("test3--strSub4==>"+strSub4);

        //如果想截取后半段，可以使用StrUtil.subSuf方法。
        // StrUtil.subSuf
        String strSub5 = StrUtil.subSuf(str, 2);
        System.out.println("test3--strSub5==>"+strSub5);

        // 截取某字符之后的字符串
        String subAfter = StrUtil.subAfter(str, "b", true);
        System.out.println("test3--subAfter==>"+subAfter);

        // 截取某字符之前的字符串
        String subBefore = StrUtil.subBefore(str, "b", true);
        System.out.println("test3--subBefore==>"+subBefore);

        //如果设置为 true，表示将从 第一个匹配到的字符 之后开始截取子字符串，并且不包括匹配的字符本身。
        //如果设置为 false，表示将从 最后一个匹配到的字符 之后开始截取子字符串，并且不包括匹配的字符本身。
        
        //结果：
        //test3--strSub1==>c
        //test3--strSub2==>cde
        //test3--strSub3==>c
        //test3--strSub4==>cdefg
        //test3--strSub5==>cdefgh
        //test3--subAfter==>cdefgh
        //test3--subBefore==>a

    }
```

**④ str、bytes 方法**

Hutool 把 `String.getByte(String charsetName)` 方法封装在这里了，原生的 `String.getByte()` 这个方法太坑了，使用系统编码，经常会有人跳进来导致乱码问题，所以 Hutool 就加了这两个方法强制指定字符集了，包了个 try 抛出一个运行时异常，省的在业务代码里处理那个恶心的 `UnsupportedEncodingException` 。

```java
    /**
     * 4 str、bytes 方法
     */
    private static void test4(){
        String str = "abcdefgh张三";
        String str1 = StrUtil.str(str.getBytes(), "gbk");
        System.out.println("test4--str1==>"+str1);

        String str2 = StrUtil.str(str.getBytes(), "UTF-8");
        System.out.println("test4--str2==>"+str2);

        byte[] bytes = StrUtil.bytes(str);
        System.out.println("test4--bytes==>"+ Arrays.toString(bytes));

        String str3 = StrUtil.str(bytes, "UTF-8");
        System.out.println("test4--str3==>"+str3);
        
        //结果：
        //test4--str1==>abcdefgh寮犱笁
        //test4--str2==>abcdefgh张三
        //test4--bytes==>[97, 98, 99, 100, 101, 102, 103, 104, -27, -68, -96, -28, -72, -119]
        //test4--str3==>abcdefgh张三
    }
```

**⑤ format 方法**

灵感来自 `sl4j`，可以使用字符串模板代替字符串的拼接，Hutool 也实现了一个，而且变量的标识符都一样，无瑕兼容，上例子：

```java
String template = "{}爱{}，就像老鼠爱大米";
String str = StrUtil.format(template, "我", "你"); //str -> 我爱你，就像老鼠爱大米
```

参数 Hutool 定义成了 Object 类型，如果传的别的类型也可以，会自动调用 toString() 方法的。

```java
    /**
     * 5 format 方法
     */
    private static void test5(){
        String template = "{}爱{}，就像老鼠爱大米";
        //str -> 我爱你，就像老鼠爱大米
        String str = StrUtil.format(template, "我", "你");
        System.out.println("test5--str==>"+str);
        
        //结果：
        //test5--str==>我爱你，就像老鼠爱大米
    }
```

**⑥ 定义的一些常量**

为了方便，Hutool 定义了一些比较常见的字符串常量在里面，像点、空串、换行符等等，还有 HTML 中的一些转义字符。

更多方法请参阅 API 文档。

```java
public interface StrPool {
    char C_SPACE = ' ';
    char C_TAB = '\t';
    char C_DOT = '.';
    char C_SLASH = '/';
    char C_BACKSLASH = '\\';
    char C_CR = '\r';
    char C_LF = '\n';
    char C_UNDERLINE = '_';
    char C_COMMA = ',';
    char C_DELIM_START = '{';
    char C_DELIM_END = '}';
    char C_BRACKET_START = '[';
    char C_BRACKET_END = ']';
    char C_COLON = ':';
    char C_AT = '@';
    String TAB = "\t";
    String DOT = ".";
    String DOUBLE_DOT = "..";
    String SLASH = "/";
    String BACKSLASH = "\\";
    String CR = "\r";
    String LF = "\n";
    String CRLF = "\r\n";
    String UNDERLINE = "_";
    String DASHED = "-";
    String COMMA = ",";
    String DELIM_START = "{";
    String DELIM_END = "}";
    String BRACKET_START = "[";
    String BRACKET_END = "]";
    String COLON = ":";
    String AT = "@";
    String HTML_NBSP = "&nbsp;";
    String HTML_AMP = "&amp;";
    String HTML_QUOTE = "&quot;";
    String HTML_APOS = "&apos;";
    String HTML_LT = "&lt;";
    String HTML_GT = "&gt;";
    String EMPTY_JSON = "{}";
}
```





## ③ 16进制工具-HexUtil



### 1 介绍

十六进制（简写为 hex 或 下标 16）在数学中是一种逢 16 进 1 的进制位，一般用数字 0 到 9 和字母 A 到 F 表示（其中：A~F 即 10~15）。例如十进制 57 ，在二进制写作 111001 ，在 16 进制写作 39。

像 java ，c 这样的语言为了区分十六进制和十进制数值，会在十六进制数的前面加上 0x，比如 0x20 是十进制的32，而不是十进制的 20 。`HexUtil` 就是字符串或 byte 数组与 16 进制表示转换的工具类。



### 2 用于

16 进制一般针对无法显示的一些二进制显示，常用于：

1. 图片的字符串表现形式
2. 加密解密
3. 编码转换



### 3 使用

HexUtil 主要以 `encodeHex` 和 `decodeHex` 两个方法位核心，提供一些针对字符串的重载方法。

```java
String str = "我是一个字符串";

String hex = HexUtil.encodeHexStr(str, CharsetUtil.CHARSET_UTF_8);

//hex是：
//e68891e698afe4b880e4b8aae5ad97e7aca6e4b8b2

String decodedStr = HexUtil.decodeHexStr(hex);

//解码后与str相同
```

```java
    /**
     * 16进制工具-HexUti
     */
    private static void test1() {
        String str = "我是一个字符串";

        String hex = HexUtil.encodeHexStr(str, CharsetUtil.CHARSET_UTF_8);
        System.out.println("test1--hex==>"+hex);

        //hex是：
        //e68891e698afe4b880e4b8aae5ad97e7aca6e4b8b2

        String decodedStr = HexUtil.decodeHexStr(hex);
        System.out.println("test1--decodedStr==>"+decodedStr);

        //解码后与str相同

        //结果：
        //test1--hex==>e68891e698afe4b880e4b8aae5ad97e7aca6e4b8b2
        //test1--decodedStr==>我是一个字符串

    }
```





## ④ Escape工具-EscapeUtil



### 1 介绍

转义和反转义工具类 Escape / Unescape 。escape 采用 ISO Latin 字符集对指定的字符串进行编码。所有的空格符、标点符号、特殊字符以及其他非 ASCII 字符都将被转化成 %xx 格式的字符编码（xx等于该字符在字符集里面的编码的 16 进制数字）。

此类中的方法对应 JavaScript 中的 `escape()` 函数和 `unescape()` 函数。



### 2 方法

- `EscapeUtil.escape` Escape 编码（Unicode），该方法不会对 ASCII 字母和数字进行编码，也不会对下面这些 ASCII 标点符号进行编码：`*@-_+./` 。其他所有的字符都会被转义序列替换。
- `EscapeUtil.unescape` Escape 解码
- `EscapeUtil.safeUnescape` 安全的 unescape 文本，当文本不是被 esacpe 的时候，返回原文。

```java
    /**
     * Escape工具-EscapeUtil
     */
    private static void test1() {
        String str = "我是一个字符串 * @ - _ + . /";

        String escape = EscapeUtil.escape(str);
        System.out.println("test1--escape==>"+escape);

        //escape是：
        //%u6211%u662f%u4e00%u4e2a%u5b57%u7b26%u4e32%20*%20@%20-%20_%20+%20.%20/

        String unescape = EscapeUtil.unescape(escape);
        System.out.println("test1--unescape==>"+unescape);

        String safeUnescape = EscapeUtil.safeUnescape(str);
        System.out.println("test1--safeUnescape==>"+safeUnescape);
        
        //结果：
        //test1--escape==>%u6211%u662f%u4e00%u4e2a%u5b57%u7b26%u4e32%20*%20@%20-%20_%20+%20.%20/
        //test1--unescape==>我是一个字符串 * @ - _ + . /
        //test1--safeUnescape==>我是一个字符串 * @ - _ + . /
    }
```





## ⑤ Hash算法-HashUtil



### 1 介绍

`HashUtil` 其实是一个 hash 算法的集合，此工具类中融合了各种 hash 算法。



### 2 方法

1. `additiveHash` 加法 hash
2. `rotatingHash` 旋转 hash
3. `oneByOneHash` 一次一个 hash
4. `bernstein` Bernstein's hash
5. `universal` Universal Hashing
6. `zobrist` Zobrist Hashing
7. `fnvHash` 改进的 32 位 FNV 算法
8. `intHash` Thomas Wang 的算法，整数 hash
9. `rsHash` RS 算法 hash
10. `jsHash` JS 算法 hash
11. `pjwHash` PJW 算法
12. `elfHash` ELF 算法
13. `bkdrHash` BKDR 算法
14. `sdbmHash` SDBM 算法
15. `djbHash` DJB 算法
16. `dekHash` DEK 算法
17. `apHash` AP 算法
18. `tianlHash` TianL Hash 算法
19. `javaDefaultHash` JAVA 自带的算法
20. `mixHash` 混合 hash 算法，输出 64 位的值

```java
    private static void test1() {
        // a 97 b 98 c 99
        // additiveHash 加法 hash
        int additiveHash = HashUtil.additiveHash("abc", 100);
        System.out.println("test1--additiveHash==>"+additiveHash);

        // rotatingHash 旋转 hash
        int rotatingHash = HashUtil.rotatingHash("abc", 100);
        System.out.println("test1--rotatingHash==>"+rotatingHash);

        // oneByOneHash 一次一个 hash
        int oneByOneHash = HashUtil.oneByOneHash("abc");
        System.out.println("test1--oneByOneHash==>"+oneByOneHash);

        // bernstein Bernstein's hash
        int bernstein = HashUtil.bernstein("abc");
        System.out.println("test1--bernstein==>"+bernstein);

        // fnvHash 改进的 32 位 FNV 算法
        int fnvHash = HashUtil.fnvHash("abc");
        System.out.println("test1--fnvHash==>"+fnvHash);

        // intHash Thomas Wang 的算法，整数 hash
        int intHash = HashUtil.intHash(123);
        System.out.println("test1--intHash==>"+intHash);

        // rsHash RS 算法 hash
        int rsHash = HashUtil.rsHash("abc");
        System.out.println("test1--rsHash==>"+rsHash);

        // jsHash JS 算法 hash
        int jsHash = HashUtil.jsHash("abc");
        System.out.println("test1--jsHash==>"+jsHash);

        // pjwHash PJW 算法
        int pjwHash = HashUtil.pjwHash("abc");
        System.out.println("test1--pjwHash==>"+pjwHash);

        // elfHash ELF 算法
        int elfHash = HashUtil.elfHash("abc");
        System.out.println("test1--elfHash==>"+elfHash);

        // bkdrHash BKDR 算法
        int bkdrHash = HashUtil.bkdrHash("abc");
        System.out.println("test1--bkdrHash==>"+bkdrHash);

        // sdbmHash SDBM 算法
        int sdbmHash = HashUtil.sdbmHash("abc");
        System.out.println("test1--sdbmHash==>"+sdbmHash);

        // djbHash DJB 算法
        int djbHash = HashUtil.djbHash("abc");
        System.out.println("test1--djbHash==>"+djbHash);

        // dekHash DEK 算法
        int dekHash = HashUtil.dekHash("abc");
        System.out.println("test1--dekHash==>"+dekHash);

        // apHash AP 算法
        int apHash = HashUtil.apHash("abc");
        System.out.println("test1--apHash==>"+apHash);

        // tianlHash TianL Hash 算法
        long tianlHash = HashUtil.tianlHash("abc");
        System.out.println("test1--tianlHash==>"+tianlHash);

        // javaDefaultHash JAVA 自带的算法
        int javaDefaultHash = HashUtil.javaDefaultHash("abc");
        System.out.println("test1--javaDefaultHash==>"+javaDefaultHash);

        // mixHash 混合 hash 算法，输出 64 位的值
        long mixHash = HashUtil.mixHash("abc");
        System.out.println("test1--mixHash==>"+mixHash);
        
        //结果：
        //test1--additiveHash==>97
        //test1--rotatingHash==>39
        //test1--oneByOneHash==>-317513893
        //test1--bernstein==>108966
        //test1--fnvHash==>34757373
        //test1--intHash==>1098118400
        //test1--rsHash==>822160044
        //test1--jsHash==>895805535
        //test1--pjwHash==>26499
        //test1--elfHash==>26499
        //test1--bkdrHash==>1677554
        //test1--sdbmHash==>807794786
        //test1--djbHash==>193485963
        //test1--dekHash==>2083
        //test1--apHash==>-25651485
        //test1--tianlHash==>33734718
        //test1--javaDefaultHash==>96354
        //test1--mixHash==>413837313596157
    }
```





## ⑥ URL工具-URLUtil



### 1 介绍

URL（Uniform Resource Locator）中文名为统一资源定位符，有时也被俗称为网页地址。表示互联网上的资源，如网页或者 FTP 地址。在 Java 中，也可以使用 URL 表示 Classpath 中的资源 (Resource) 地址。



### 2 方法

**① 获取 URL 对象**

- `URLUtil.url` 通过一个字符串形式的 URL 地址创建对象
- `URLUtil.getURL` 主要获得 Classpath 下资源的 URL，方便读取 Classpath 下的配制文件等信息

```java
    /**
     * 1 获取 URL 对象
     */
    private static void test1() {
        String str = "https://picx.zhimg.com/v2-62a937b540a6c8156c5798805d799c4d_1440w.jpg";
        URL url = URLUtil.url(str);
        System.out.println("test1--url==>"+url);

        URI uri = URLUtil.getHost(url);
        System.out.println("test1--uri==>"+uri);

        URL getUrl = URLUtil.getURL(FileUtil.file("E:\\Study\\JavaSkill\\Hutool\\src\\main\\java\\com\\hutool\\core\\tool\\Main5.java"));
        System.out.println("test1--getUrl==>"+getUrl);
        
        //结果：
        //test1--url==>https://picx.zhimg.com/v2-62a937b540a6c8156c5798805d799c4d_1440w.jpg
        //test1--uri==>https://picx.zhimg.com
        //test1--getUrl==>file:/E:/Study/JavaSkill/Hutool/src/main/java/com/hutool/core/tool/Main5.java
    }
```

**② 其他**

- URLUtil.normalize 标准化 URL 链接。对于不带 http:// 头的地址做简单补全。

  ```java
  String url = "http://www.hutool.cn//aaa/bbb";
  // 结果为：http://www.hutool.cn/aaa/bbb
  String normalize = URLUtil.normalize(url);
  
  url = "http://www.hutool.cn//aaa/\\bbb?a=1&b=2";
  // 结果为：http://www.hutool.cn/aaa/bbb?a=1&b=2
  normalize = URLUtil.normalize(url);
  ```

- URLUtil.encode 封装 URLEncoder.encode ，将需要转换的内容（ASCII 码等形式之外的内容），用十六进制表示转换出来，并在之前加上 % 开头。

  ```java
  String body = "366466 - 副本.jpg";
  // 结果为：366466%20-%20%E5%89%AF%E6%9C%AC.jpg
  String encode = URLUtil.encode(body);
  ```

- `URLUtil.decode` 封装 `URLDecoder.decode` ，将 % 开头的 16 进制表示的内容解码。

- `URLUtil.getPath` 获得 path 部分 URI - > http://www.aaa.bbb/search?scope=ccc&q=ddd PATH -> /search

- `URLUtil.toURI` 转 URL 或 URL 字符串为 URI

```java
    /**
     * 2 其他
     */
    private static void test2() {
        //该方法用于标准化URL链接，代码如下：
        String url1 = "https://images5.alphacoders.com\\854\\thumb-1920-854436.png";
        String normalize = URLUtil.normalize(url1);
        System.out.println("test2--normalize==>"+normalize);

        //该方法用于获取URL链接中的path部分字符串，比如：
        String url2 = "https://images5.alphacoders.com/854/thumb-1920-854436.png?name=violet";
        String pathStr = URLUtil.getPath(url2);
        System.out.println("test2--pathStr==>"+pathStr);

        //URLUtil.encode 封装URLEncoder.encode，将需要转换的内容（ASCII码形式之外的内容）
        //用十六进制表示法转换出来，并在之前加上%开头。
        String body = "366466 - 副本.jpg";
        // 结果为：366466%20-%20%E5%89%AF%E6%9C%AC.jpg
        String encode = URLUtil.encode(body);
        System.out.println("test2--encode==>"+encode);

        //URLUtil.decode 封装URLDecoder.decode，将%开头的16进制表示的内容解码。
        String decode = URLUtil.decode(encode);
        System.out.println("test2--decode==>"+decode);

        //转URL或URL字符串为URI。
        String urlStr = "https://images5.alphacoders.com/854/thumb-1920-854436.png";
        URI toURI = URLUtil.toURI(urlStr);
        System.out.println("test2--toURI==>"+toURI);
        
        //结果：
        //test2--normalize==>https://images5.alphacoders.com/854/thumb-1920-854436.png
        //test2--pathStr==>/854/thumb-1920-854436.png
        //test2--encode==>366466%20-%20%E5%89%AF%E6%9C%AC.jpg
        //test2--decode==>366466 - 副本.jpg
        //test2--toURI==>https://images5.alphacoders.com/854/thumb-1920-854436.png
    }
```
