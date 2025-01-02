---
title: Hutool-Core核心（七）
date: 2024/12/25
---

![星空桌面壁纸](https://bizhi1.com/wp-content/uploads/2024/08/silhouette-starry-sky-desktop-wallpaper-small.jpg)

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



## ⑦ XML工具-XmlUtil



### 1 由来

在日常编码中，我们接触的最多的除了 JSON 外，就是 XML 格式了，一般而言，我们首先想到的是引入 `Dom4j` 包，却不知 JDK 已经封装有 XML 解析和构建工具：w3c dom 。但是由于这个 API 操作比较比较繁琐，因此 Hutool 中提供了 XmlUtil 简化 XML 的创建、读和写的过程。



### 2 使用

**① 读取 XML**

读取 XML 分为两个方法：

- `XmlUtil.readXML` 读取 XML 文件
- `XmlUtil.parseXml` 解析 XML 字符串为 Document 对象

**② 写 XML**

- `XmlUtil.toStr` 将 XML 文档换为 String
- `XmlUtil.toFile` 将 XML 文档写入到文件

**③ 创建 XML**

- XmlUtil.createXml 创建 XML 文档，创建的 XML 默认是 utf8 编码，修改编码的过程是在 toStr 和 toFile 方法里，即 XML 在转为文本的时候才定义编码。

**④ XML 操作**

通过以下工具方法，可以完成基本的结点读取操作。

- `XmlUtil.cleanInvalid` 去除XML文本中的无效字符
- `XmlUtil.getElements` 根据节点名获得子节点列表
- `XmlUtil.getElement` 根据节点名获得第一个子节点
- `XmlUtil.elementText` 根据节点名获得第一个子节点的文本值
- `XmlUtil.transElements` 将NodeList转换为Element列表

**⑤ XML 与对象转换**

- `writeObjectAsXml` 将可序列化的对象转换为 XML 写入文件，已经存在的文件将被覆盖。
- `readObjectFromXml` 从 XML 中读取对象。

> 注意，这两个方法严重依赖 JDK 的 `XMLEncoder` 和 `XMLDecoder` ，生成和解析必须成对存在（遵循固定格式），普通的 XML 转 Bean 会报错。

**⑥ Xpath 操作**

Xpath 的更多介绍请看文章：https://www.ibm.com/developerworks/cn/xml/x-javaxpathapi.html

- `createXPath` 创建Xpath
- getByXPath 通过XPath 方式读取 XML 结点等信息

例子：

```xml
<?xml version="1.0" encoding="utf-8"?>

<returnsms> 
  <returnstatus>Success（成功）</returnstatus>  
  <message>ok</message>  
  <remainpoint>1490</remainpoint>  
  <taskID>885</taskID>  
  <successCounts>1</successCounts> 
</returnsms>
```

```java
Document docResult=XmlUtil.readXML(xmlFile);
//结果为“ok”
Object value = XmlUtil.getByXPath("//returnsms/message", docResult, XPathConstants.STRING);
```



### 3 总结

XmlUtil 只是 w3c dom 的简单工具化封装，减少操作 dom 的难度，如果项目对 XML 依赖比较大，依旧推荐 Dom4j 框架。





## ⑧ 对象工具-ObjectUtil



### 1 由来

在我们的日常使用中，有些方法是针对 Object 通用的，这些方法不区分何种对象，针对这些方法，Hutool 封装为 `ObjectUtil` 。



### 2 方法

**① 默认值**

借助于 Lambda 表达式，ObjectUtil 可以完成判断给定的值是否为 null ，不为 null 执行特定逻辑的功能。

```java
final String dateStr = null;

// 此处判断如果dateStr为null，则调用`Instant.now()`，不为null则执行`DateUtil.parse`
Instant result1 = ObjectUtil.defaultIfNull(dateStr,
		() -> DateUtil.parse(dateStr, DatePattern.NORM_DATETIME_PATTERN).toInstant(), Instant.now());
```

```java
    /**
     * 1 默认值
     */
    private static void test1() {
        final String dateStr = null;
        // 此处判断如果dateStr为null，则调用`Instant.now()`，不为null则执行`DateUtil.parse`
        Instant result1 = ObjectUtil.defaultIfNull(dateStr,
                () -> DateUtil.parse(dateStr, DatePattern.NORM_DATETIME_PATTERN).toInstant(), Instant.now());
        System.out.println("test1--result1==>"+result1);
        
        //结果：
        //test1--result1==>2024-12-28T08:53:35.248301200Z
    }
```

**② ObjectUtil.eaqual**

比较两个对象是否相等，相等需满足以下条件之一：

1. `obj1 == null && obj2 == null`
2. `obj1.equals(obj2)`

```java
Object a = null;
Object b = null;

// true
ObjectUtil.equals(a,b);
```

```java
    /**
     * 2 ObjectUtil.eaqual
     */
    private static void test2() {
        final String str1 = "str1";
        final String str2 = "str2";
        final String str3 = "str1";
        // 比较两个对象是否相等，如果两个对象为null，则返回true
        boolean result1 = ObjectUtil.equal(str1, str2);
        System.out.println("test2--result1==>"+result1);
        // 比较两个对象是否相等，如果两个对象为null，则返回false
        boolean result2 = ObjectUtil.equal(str1, str3);
        System.out.println("test2--result2==>"+result2);
        
        //结果：
        //test2--result1==>false
        //test2--result2==>true
    }
```

**③ ObjectUtil.length**

计算对象长度，如果是字符串调用其 length 方法，集合类调用其 size 方法，数组调用其 length 属性，其他可遍历对象遍历计算长度。

支持的类型包括：

- `CharSequence`
- `Collection`
- `Map`
- `Iterator`
- `Enumeration`
- `Array`

```java
int[] array = new int[]{1,2,3,4,5};

// 5
int length = ObjectUtil.length(array);

Map<String, String> map = new HashMap<>();
map.put("a", "a1");
map.put("b", "b1");
map.put("c", "c1");

// 3
length = ObjectUtil.length(map);
```

```java
    /**
     * 3 ObjectUtil.length
     */
    private static void test3() {
        int[] array = new int[]{1,2,3,4,5};

        // 5
        int length = ObjectUtil.length(array);
        System.out.println("test3--length==>"+length);

        Map<String, String> map = new HashMap<>();
        map.put("a", "a1");
        map.put("b", "b1");
        map.put("c", "c1");

        // 3
        length = ObjectUtil.length(map);
        System.out.println("test3--length==>"+length);
        
        //结果：
        //test3--length==>5
        //test3--length==>3
    }
```

**④ ObjectUtil.contains**

对象中是否包含元素

支持的对象类型包括：

- `String`
- `Collection`
- `Map`
- `Iterator`
- `Enumeration`
- `Array`

```java
int[] array = new int[]{1,2,3,4,5};

// true
final boolean contains = ObjectUtil.contains(array,1);
```

```java
    /**
     * 4 ObjectUtil.contains
     */
    private static void test4() {
        int[] array = new int[]{1,2,3,4,5};
        // true
        boolean contains = ObjectUtil.contains(array,1);
        System.out.println("test4--contains==>"+contains);

        boolean contains1 = ObjectUtil.contains(array, 6);
        System.out.println("test4--contains1==>"+contains1);
        
        //结果：
        //test4--contains==>true
        //test4--contains1==>false
    }
```

**⑤ 判断是否为 null**

- `ObjectUtil.isNull`
- `ObjectUtil.isNotNull`

> 注意：此方法不能判断对象中字段为空的情况，如果需要检查 Bean 对象中字段是否全空，请使用 `BeanUtil.isEmpty` 。
>

```java
    /**
     * 5 判断是否为 null
     */
    private static void test5() {
        final String str1 = null;
        final String str2 = "str2";
        // true
        boolean result1 = ObjectUtil.isNull(str1);
        System.out.println("test5--result1==>"+result1);
        // false
        boolean result2 = ObjectUtil.isNull(str2);
        System.out.println("test5--result2==>"+result2);

        boolean notEmpty = ObjectUtil.isNotEmpty(str1);
        System.out.println("test5--notEmpty==>"+notEmpty);

        boolean notEmpty1 = ObjectUtil.isNotEmpty(str2);
        System.out.println("test5--notEmpty1==>"+notEmpty1);
        
        //结果：
        //test5--result1==>true
        //test5--result2==>false
        //test5--notEmpty==>false
        //test5--notEmpty1==>true
    }
```

**⑥ 克隆**

- `ObjectUtil.clone` 克隆对象，如果对象实现 Cloneable 接口，调用其 clone 方法，如果实现 Serializable 接口，执行深度克隆，否则返回 null 。

```java
Class Obj extends CloneSupport<Obj> {
    public String doSomeThing() {
        return "OK";
    }
}
```

```java
Obj obj = new Obj();
Obj obj2 = ObjctUtil.clone(obj);

// OK
obj2.doSomeThing();
```

- `ObjectUtil.cloneIfPossible` 返回克隆后的对象，如果克隆失败，返回原对象
- `ObjectUtil.cloneByStream` 序列化后拷贝流的方式克隆，对象必须实现 Serializable 接口

```java
    /**
     * 6 克隆
     */
    private static void test6() {
        Student student = new Student("张三", 18);
        System.out.println("test6--student==>"+student);
        Student clone = ObjectUtil.clone(student);
        System.out.println("test6--clone==>"+clone);

        // OK
        clone.doSomeThing();

        // 返回克隆后的对象，如果克隆失败，返回原对象
        Student cloneIfPossible = ObjectUtil.cloneIfPossible(student);
        System.out.println("test6--cloneIfPossible==>"+cloneIfPossible);

        // 序列化后拷贝流的方式克隆，对象必须实现Serializable接口
        Student cloneByStream = ObjectUtil.cloneByStream(student);
        System.out.println("test6--cloneByStream==>"+cloneByStream);
        
        //结果：
        //test6--student==>Student(name=张三, age=18)
        //test6--clone==>Student(name=张三, age=18)
        //张三在学习！
        //test6--cloneIfPossible==>Student(name=张三, age=18)
        //test6--cloneByStream==>Student(name=张三, age=18)
    }
```

**⑦ 序列化和反序列化**

- `serialize` 序列化，调用 JDK 序列化
- `deserialize` 反序列化，调用 JDK

```java
    /**
     * 7 序列化和反序列化
     */
    private static void test7() {
        Student student = new Student("张三", 18);
        System.out.println("test7--student==>"+student);
        // 序列化
        byte[] bytes = ObjectUtil.serialize(student);
        System.out.println("test7--bytes==>"+bytes);
        // 反序列化
        Student deserialize = ObjectUtil.deserialize(bytes);
        System.out.println("test7--deserialize==>"+deserialize);
        
        //结果：
        //test7--student==>Student(name=张三, age=18)
        //test7--bytes==>[B@61a52fbd
        //test7--deserialize==>Student(name=张三, age=18)
    }
```

**⑧ 判断基本类型**

`ObjectUtil.isBasicType` 判断是否为基本类型，包括包装类型和原始类型。

包括类型：

- `Boolean`
- `Byte`
- `Character`
- `Double`
- `Float`
- `Integer`
- `Long`
- `Short`

原始类型：

- `boolean`
- `byte`
- `char`
- `double`
- `float`
- `int`
- `long`
- `short`

```java
int a = 1;

// true
final boolean basicType = ObjectUtil.isBasicType(a);
```

```java
    /**
     * 8 判断基本类型
     */
    private static void test8() {
        int a = 1;

        // true
        final boolean basicType = ObjectUtil.isBasicType(a);
        System.out.println("test1--basicType==>"+basicType);

        String b = "2";
        // false
        boolean basicType1 = ObjectUtil.isBasicType(b);
        System.out.println("test1--basicType1==>"+basicType1);
        
        //结果：
        //test1--basicType==>true
        //test1--basicType1==>false
    }
```



## ⑨ 反射工具-ReflectUtil



### 1 介绍

Java 的反射机制，可以让语言变得更加灵活，对对象的操作也更加`动态`，因此在某些情况下，反射可以做到事半功倍的效果。Hutool 针对 Java 的反射机制做了工具化封装，封装包括：

1. 获取构造方法
2. 获取字段
3. 获取字段值
4. 获取方法
5. 执行方法（对象方法和静态方法）



### 2 使用

**① 获取某个类的所有方法**

```java
Method[] methods = ReflectUtil.getMethods(ExamInfoDict.class);
```

```java
    /**
     * 1 获取某个类的所有方法
     */
    private static void test1() {
        Method[] methods = ReflectUtil.getMethods(TestClass.class);
        for (Method method : methods) {
            System.out.println("test1--method==>"+method.getName());
        }
        
        //结果：
        //test1--method==>setA
        //test1--method==>getA
        //test1--method==>finalize
        //test1--method==>wait
        //test1--method==>wait
        //test1--method==>wait
        //test1--method==>equals
        //test1--method==>toString
        //test1--method==>hashCode
        //test1--method==>getClass
        //test1--method==>clone
        //test1--method==>notify
        //test1--method==>notifyAll
    }
```

**② 获取某个类的指定方法**

```java
Method method = ReflectUtil.getMethod(ExamInfoDict.class, "getId");
```

```java
    /**
     * 2 获取某个类的指定方法
     */
    private static void test2() {
        Method method = ReflectUtil.getMethod(TestClass.class, "setA", int.class);
        System.out.println("test2--method==>"+method.getName());
        
        //结果：
        //test2--method==>setA
    }
```

**③ 构造对象**

```java
ReflectUtil.newInstance(ExamInfoDict.class);
```

```java
    /**
     * 3 构造对象
     */
    private static void test3() {
        TestClass testClass = ReflectUtil.newInstance(TestClass.class);
        testClass.setA(10);
        System.out.println("test3--testClass.getA()==>"+testClass.getA());
        
        //结果：
        //test3--testClass.getA()==>10
    }
```

**④ 执行方法**

```java
class TestClass {
	private int a;

	public int getA() {
		return a;
	}

	public void setA(int a) {
		this.a = a;
	}
}
```

```java
TestClass testClass = new TestClass();
ReflectUtil.invoke(testClass, "setA", 10);
```

```java
    /**
     * 4 反射工具
     */
    private static void test4() {
        TestClass testClass = new TestClass();
        ReflectUtil.invoke(testClass, "setA", 10);
        int a = testClass.getA();
        System.out.println("test1--a==>"+ a);
        
        //结果：
        //test1--a==>10
    }
```





## ⑩ 泛型类型工具-TypeUtil



### 1 介绍

针对 `java.lang.reflect.Type` 的工具类封装，最主要功能包括：

1. 获取方法的参数和反沪指类型（包括 Type 和 Class）
2. 获取泛型参数类型（包括对象的泛型参数或集合元素的泛型类型）



### 2 方法

首先我们定义一个类：

```java
public class TestClass {
	public List<String> getList(){
		return new ArrayList<>();
	}
	
	public Integer intTest(Integer integer) {
		return 1;
	}
}
```

**① getClass**

获得 Type 对应的原始类

```java
    /**
     * 1 getClass
     */
    private static void test1(){
        // 获取type对应的原始类
        Class<?> clazz = TypeUtil.getClass(TestClass.class);
        System.out.println("test1--clazz==>"+clazz);
        
        //结果：
        //test1--clazz==>class com.hutool.core.tool.TestClass
    }
```

**② getParamType**

```java
Method method = ReflectUtil.getMethod(TestClass.class, "intTest", Integer.class);
Type type = TypeUtil.getParamType(method, 0);
// 结果：Integer.class
```

获取方法参数的泛型类型

```java
    /**
     * 2 getParamType
     */
    private static void test2(){
        // 获取方法参数类型
        Method method = ReflectUtil.getMethod(TestClass.class, "intTest", Integer.class);
        Type type = TypeUtil.getParamType(method, 0);
        System.out.println("test2--type==>"+type);
        
        //结果：
        //test2--type==>class java.lang.Integer
    }
```

**③ getReturnType**

获取方法的返回值类型

```java
Method method = ReflectUtil.getMethod(TestClass.class, "getList");
Type type = TypeUtil.getReturnType(method);
// 结果：java.util.List<java.lang.String>
```

```java
    /**
     * 3 getReturnType
     */
    private static void test3(){
        // 获取方法返回类型
        Method method = ReflectUtil.getMethod(TestClass.class, "intTest", Integer.class);
        Type type = TypeUtil.getReturnType(method);
        System.out.println("test3--type==>"+type);

        //结果：
        //test3--type==>class java.lang.Integer
    }
```

**④ getTypeArgument**

获取泛型类子类中泛型的填充类型

```java
Method method = ReflectUtil.getMethod(TestClass.class, "getList");
Type type = TypeUtil.getReturnType(method);

Type type2 = TypeUtil.getTypeArgument(type);
// 结果：String.class
```

```java
    /**
     * 4 getTypeArgument
     */
    private static void test4(){
        //获取泛型类子类中泛型的填充类型

        // 获取泛型类型
        Method method = ReflectUtil.getMethod(TestClass.class, "getList");
        Type type = TypeUtil.getReturnType(method);

        Type type2 = TypeUtil.getTypeArgument(type);
        // 结果：String.class
        System.out.println("test4--type==>"+type2);

        //结果：
        //test4--type==>class java.lang.String
    }

```





## ⑪ 分页工具-PageUtil



### 1 由来

分页工具类并不是数据库分页的封装，而是分页方式的转换。在我们手动分页的时候，常常用页码+每页个数的方式，但是有些数据库需要使用开始位置和结束位置来表示。很多时候这种转换容易出错（边界问题），于是封装了 PageUtil 工具类。



### 2 兼容性

1. 版本 < 5.2.5 初始页码为 1
2. 版本 >= 5.2.5 初始页码为 0



### 3 使用

**① transToStartEnd**

将页数和每页条数目转换为开始位置和结束位置。此方法用于包括结束位置的分页方法。

例如：

- 页码：0，每页10->[0,10]
- 页码：1，每页10->[10,20]

```java
int[] startEnd1 = PageUtil.transToStartEnd(0, 10);//[0, 10]
int[] startEnd2 = PageUtil.transToStartEnd(1, 10);//[10, 20]
```

> 方法中，页码从 0 开始，位置从 0 开始

```java
    /**
     * 1 transToStartEnd
     */
    private static void test1() {
        //将页数和每页条数目转换为开始位置和结束位置。此方法用于包括结束位置的分页方法。
        
        //[0, 10]
        int[] startEnd1 = PageUtil.transToStartEnd(0, 10);
        System.out.println("test1--startEnd1==>"+ Arrays.toString(startEnd1));

        //[10, 20]
        int[] startEnd2 = PageUtil.transToStartEnd(1, 10);
        System.out.println("test1--startEnd2==>"+ Arrays.toString(startEnd2));
        
        //结果：
        //test1--startEnd1==>[0, 10]
        //test1--startEnd2==>[10, 20]
    }
```

**② totalPage**

根据总数和每页个数计算总页数

```java
int totalPage = PageUtil.totalPage(20, 3);//7
```

```java
    /**
     * 2 totalPage
     */
    private static void test2() {
        //计算总页数
        int totalPage = PageUtil.totalPage(100, 10);
        System.out.println("test2--totalPage==>"+totalPage);

        //结果：
        //test2--totalPage==>10
    }
```

**③ 分页彩虹算法**

在页面上显示下一页，常常需要显示到 N 页和后 N 页，`PageUtil.rainbow` 作用于此。

例如我们当前页面为第5页，共有20页，只显示6个页码，显示的分页列表为：

```java
上一页 3 4 [5] 6 7 8 下一页
```

```java
//参数意义分别为：当前页、总页数、每屏展示的页数
int[] rainbow = PageUtil.rainbow(5, 20, 6);
//结果：[3, 4, 5, 6, 7, 8]
```

```java
    /**
     * 3 分页彩虹算法
     */
    private static void test3(){
        //分页彩虹算法
        int[] rainbow = PageUtil.rainbow(5, 20, 6);
        System.out.println("test3--rainbow==>"+Arrays.toString(rainbow));

        //结果：
        //test3--rainbow==>[3, 4, 5, 6, 7, 8]
    }
```





## ⑫ 剪贴板工具-ClipboardUtil



### 1 介绍

Hutool 在3.2.0+ 中新增了 `ClipboardUtil` 这个类用于简化操作剪贴板（当然使用场景被局限）。



### 2 使用

`ClipboardUtil` 封装了几个常用的静态方法

**① 通用方法**

- `getClipboard` 获取系统剪贴板
- `set` 设置内容到剪贴板
- `get` 获取剪贴板内容

**② 针对文本**

- `setStr` 设置文本到剪贴板
- `getStr` 从剪贴板获取文本

```java
    /**
     * 针对文本
     */
    public static void test2(){
        // 先右键复制内容到剪贴板再测试

        //获取剪贴板内容
        String str = ClipboardUtil.getStr();
        System.out.println("test2--str==>"+str);

        //设置剪贴板内容
        ClipboardUtil.setStr("hello world");

        //获取剪贴板内容
        String str1 = ClipboardUtil.getStr();
        System.out.println("test2--str1==>"+str1);

        //结果：
        //test2--str==>hello world
        //test2--str1==>hello world
    }
```

③ 针对 Image 对象（图片）

- `setImage` 设置图片到剪贴板
- `getImage` 从剪贴板获取图片
