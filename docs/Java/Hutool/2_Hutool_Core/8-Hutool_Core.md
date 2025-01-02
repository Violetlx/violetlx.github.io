---
title: Hutool-Core核心（八）
date: 2024/12/29
---

![山日出孤独桌面壁纸](https://bizhi1.com/wp-content/uploads/2024/06/mountain-sunrise-solitude-desktop-wallpaper-small.jpg)

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



## ⑬ 类工具-ClassUtil



### 1 介绍

这个工具主要是封装了一些反射的方法，使调用更加方便。而这个类中最有用的方法是 `scanPackage` 方法，这个方法会扫描 classpath 下所有类，这个再 Spring 中是特性之一，主要为 [Hulu](https://github.com/looly/hulu) 框架中类扫描的一个基础。下面介绍这个类中的方法。



### 2 使用

**① getShortClassName**

获取完整类名的段格式如：`cn.hutool.core.util.StrUtil` -> `c.h.c.u.StrUtil`

```java
    /**
     * 1 getShortClassName
     */
    public static void test1(){
        //获取完整类名的短格式如：cn.hutool.core.util.StrUtil -> c.h.c.u.StrUtil
        
        String className = "com.hutool.core.tool.Main12";
        String shortClassName = ClassUtil.getShortClassName(className);
        System.out.println("test1--shortClassName==>"+shortClassName);

        String name = Main12.class.getName();
        String shortName = ClassUtil.getShortClassName(name);
        System.out.println("test1--shortName==>"+shortName);
        
        //结果：
        //test1--shortClassName==>c.h.c.t.Main12 
        //test1--shortName==>c.h.c.t.Main12
    }
```

**② isAllAssignableFrom**

比较判断 types1 和 types2 两组类，如果 types1 中所有的类都与 types2 对应位置的类相同，或者是其父类或接口，则返回 true

```java
    /**
     * 2 isAllAssignableFrom
     */
    public static void test2(){
        //判断是否所有元素都是指定类型的父类或接口

        Class<?>[] classes = new Class[]{String.class, Integer.class};
        Class<?>[] classes1 = new Class[]{String.class};
        Class<?>[] classes2 = new Class[]{String.class, Integer.class};

        boolean isAllAssignableFrom = ClassUtil.isAllAssignableFrom(classes1, classes);
        System.out.println("test2--isAllAssignableFrom==>"+isAllAssignableFrom);


        boolean isAllAssignableFrom1 = ClassUtil.isAllAssignableFrom(classes2, classes);
        System.out.println("test2--isAllAssignableFrom1==>"+isAllAssignableFrom1);

        //结果：
        //test2--isAllAssignableFrom==>false
        //test2--isAllAssignableFrom1==>true
    }
```

**③ isPrimitiveWrapper**

是否为包装类型

```java
    /**
     * 3 isPrimitiveWrapper
     */
    public static void test3(){
        //判断是否为原始类型或原始类型包装类

        boolean isPrimitiveWrapper = ClassUtil.isPrimitiveWrapper(String.class);
        System.out.println("test3--isPrimitiveWrapper==>"+isPrimitiveWrapper);

        boolean isPrimitiveWrapper1 = ClassUtil.isPrimitiveWrapper(Integer.class);
        System.out.println("test3--isPrimitiveWrapper1==>"+isPrimitiveWrapper1);

        //结果：
        //test3--isPrimitiveWrapper==>false
        //test3--isPrimitiveWrapper1==>true
    }
```

**④ isBasicType**

是否为基本类型（包括包装类和原始类）

```java
    /**
     * 4 isBasicType
     */
    public static void test4(){
        //判断是否为原始类型或原始类型包装类

        boolean basicType = ClassUtil.isBasicType(String.class);
        System.out.println("test4--basicType==>"+basicType);

        boolean basicType1 = ClassUtil.isBasicType(Integer.class);
        System.out.println("test4--basicType1==>"+basicType1);

        boolean basicType2 = ClassUtil.isBasicType(int.class);
        System.out.println("test4--basicType2==>"+basicType2);

        //结果：
        //test4--basicType==>true
        //test4--basicType1==>true
        //test4--basicType2==>true
    }
```

**⑤ getPackage**

获得给定类所在包的名称，例如： `cn.hutool.util.ClassUtil` -> `cn.hutool.util`

```java
    /**
     * 5 getPackage
     */
    public static void test5(){
        //获取包名

        String aPackage = ClassUtil.getPackage(String.class);
        System.out.println("test5--aPackage==>"+aPackage);

        String bPackage = ClassUtil.getPackage(Integer.class);
        System.out.println("test5--bPackage==>"+bPackage);

        //结果：
        //test5--aPackage==>java.lang
        //test5--bPackage==>java.lang
    }
```

**⑥ scanPackage 方法**

此方法唯一的参数是包的名称，返回结果为此包及以下子包下所有的类。方法使用很简单，但是过程复杂一些，包扫描首先会调用 getClassPaths 方法获得 ClassPath，然后扫描 ClassPath ，如果是目录，扫描目录下的类文件，或者 jar 文件。如果是 jar 包，则直接从 jar 包中获取类名。这个方法的作用显而易见，就是要找出所有的类，在 Spring 中用于依赖注入，Hutool 在 [Hulu](https://github.com/looly/hulu) 中则用于找到Action类。当然，你也可以传一个`ClassFilter`对象，用于过滤不需要的类。

```java
    /**
     * 6 scanPackage
     */
    public static void test6(){
        //扫描指定包下的所有类

        Set<Class<?>> classes = ClassUtil.scanPackage("cn.hutool.core.util");
        for (Class<?> aClass : classes) {
            System.out.println("test6--aClass==>"+aClass);
        }

        //结果：
        //test6--aClass==>class cn.hutool.core.util.EnumUtil
        //test6--aClass==>class cn.hutool.core.util.CreditCodeUtil
        //test6--aClass==>class cn.hutool.core.util.ModifierUtil$ModifierType
        //...
    }

```

**⑦ getClassPaths 方法**

此方法是获得当前线程的 ClassPath ，核心是 `Thread.currentThread().getContextClassLoader().getResources` 的调用。

```java
    /**
     * 7 getClassPaths
     */
    public static void test7(){
        //获取类路径

        Set<String> classPaths = ClassUtil.getClassPaths("cn.hutool.core.util");
        for (String classPath : classPaths) {
            System.out.println("test7--classPath==>"+classPath);
        }
        //结果：
        //test7--classPath==>file:/E:/maven/repository/repository/cn/hutool/hutool-all/5.8.25/hutool-all-5.8.25.jar!/cn/hutool/core/util
    }
```

**⑧ getJavaClassPaths 方法**

此方法用于获得 Java 的系统变量定义的 ClassPath。     

​     

```java
    /**
     * 8 getJavaClassPaths
     */
    public static void test8(){
        //获取Java类路径

        String[] javaClassPaths = ClassUtil.getJavaClassPaths();
        for (String javaClassPath : javaClassPaths) {
            System.out.println("test8--javaClassPath==>"+javaClassPath);
        }
        //结果：
        //test8--javaClassPath==>E:\Study\JavaSkill\Hutool\target\classes
        //test8--javaClassPath==>E:\maven\repository\repository\org\springframework\boot\spring-boot-starter\3.3.1\spring-boot-starter-3.3.1.jar
        //test8--javaClassPath==>E:\maven\repository\repository\org\springframework\boot\spring-boot\3.3.1\spring-boot-3.3.1.jar
        //...
    }
```

​                                               

**⑨ getClassLoader 和 getContextClassLoader 方法**

后者只是获得当前线程的 ClassLoader ，前者在获取失败的时候获取 ClassUtil 这个类的 ClassLoader 。

```java
    /**
     * 9  getClassLoader 和 getContextClassLoader 方法
     */
    public static void test9(){
        ClassLoader classLoader = ClassUtil.getClassLoader();
        System.out.println("test9--classLoader==>"+classLoader);
        ClassLoader contextClassLoader = ClassUtil.getContextClassLoader();
        System.out.println("test9--contextClassLoader==>"+contextClassLoader);
        
        //结果：
        //test9--classLoader==>jdk.internal.loader.ClassLoaders$AppClassLoader@2b193f2d
        //test9--contextClassLoader==>jdk.internal.loader.ClassLoaders$AppClassLoader@2b193f2d
    }
```

**⑩ getDefaultValue**

获取指定类型的默认值，默认值规则为：

1. 如果为原始类型，返回 0 （boolean 类型返回 false）
2. 非原始类型返回 null

```java
    /**
     * 10 getDefaultValue
     */
    public static void test10(){
        //获取默认值

        Object defaultValue = ClassUtil.getDefaultValue(String.class);
        System.out.println("test10--defaultValue==>"+defaultValue);

        Object defaultValue1 = ClassUtil.getDefaultValue(Integer.class);
        System.out.println("test10--defaultValue1==>"+defaultValue1);

        Object defaultValue2 = ClassUtil.getDefaultValue(int.class);
        System.out.println("test10--defaultValue2==>"+defaultValue2);

        Object defaultValue3 = ClassUtil.getDefaultValue(boolean.class);
        System.out.println("test10--defaultValue3==>"+defaultValue3);

        Object defaultValue4 = ClassUtil.getDefaultValue(Boolean.class);
        System.out.println("test10--defaultValue4==>"+defaultValue3);

        //结果：
        //test10--defaultValue==>null
        //test10--defaultValue1==>null
        //test10--defaultValue2==>0
        //test10--defaultValue3==>false
        //test10--defaultValue4==>false
    }
```

**⑪ 其他**

更多详细的方法描述见：

https://apidoc.gitee.com/loolly/hutool/cn/hutool/core/util/ClassUtil.html





## ⑭ 枚举工具-EnumUtil



### 1 介绍

枚举（enum）算一种 语法糖，是指一个经过排序的、被打包成一个单一实体的项列表。一个枚举的实例可以使用枚举项列表中任意单一项的值。枚举在各个语言当中都有广泛的应用，通常用来表示诸如颜色、方式、类别、状态等等数目有限、形式离散、表达又极为明确的量。Java 从 JDK5 开始，引入了对枚举的支持。

`EnumUtil` 用于对未知枚举类型进行操作。



### 2 方法

首先我们定义一个枚举对象：

```java
//定义枚举
public enum TestEnum {
	TEST1("type1"), TEST2("type2"), TEST3("type3");
	
	private TestEnum(String type) {
		this.type = type;
	}
	
	private String type;
	
	public String getType() {
		return this.type;
	}
}
```

**① getNames**

获取枚举类中所有枚举对象的 name 列表。例子：

```java
List<String> names = EnumUtil.getNames(TestEnum.class);
//结果：[TEST1, TEST2, TEST3]
```

```java
    /**
     * 1 getNames
     */
    public static void test1(){
        //获取枚举的所有名称，返回数组
        List<String> names = EnumUtil.getNames(TestEnum.class);
        System.out.println("test1--names==>"+names);

        //结果：
        //test1--names==>[TEST1, TEST2, TEST3]
    }
```

**② getFieldValues**

 获的枚举类中个枚举对象下指定字段的值，例子：

```java
List<Object> types = EnumUtil.getFieldValues(TestEnum.class,"type");
//结果：[type1,type2,type3]
```

```java
    /**
     * 2 getFieldValues
     */
    public static void test2(){
        //获取枚举的所有字段值，返回数组
        List<Object> type = EnumUtil.getFieldValues(TestEnum.class, "type");
        System.out.println("test2--type==>"+type);

        //结果：
        //test2--fieldValues==>[type1, type2, type3]
    }
```

**③ getBy**

根据传入 Lambda 和值 获得对应枚举。例子：

```java
TestEnum testEnum = EnumUtil.getBy(TestEnum::ordinal,1);
//结果：TEST2
```

```java
    /**
     * 3 getBy
     */
    public static void test3(){
        //根据字段值获取枚举 根据传入 Lambda 和值 获得对应枚举。
        TestEnum testEnum = EnumUtil.getBy(TestEnum::ordinal,1);
        System.out.println("test3--testEnum==>"+testEnum);

        //结果：
        //test3--testEnum==>TEST1
    }

```

**④ getFieldBy**

```java
String type = EnumUtil.getFieldBy(TestEnum::getType,Enum::ordinal,1);
//结果："type2"
```

```java
    /**
     * 4 getFieldBy
     */
    public static void test4(){
        //根据字段值获取枚举 根据传入 Lambda 和值 获得对应枚举。
        TestEnum testEnum = EnumUtil.getBy(TestEnum::getType,"type1");
        System.out.println("test4--testEnum==>"+testEnum);

        //结果：
        //test4--testEnum==>TEST1
    }
```

**⑤ getEnumMap**

获取枚举字符串值和枚举对象的 Map 对应，使用 LinkedHashMap 保证有序，结果中间为枚举名，值为枚举对象。例子：

```java
Map<String,TestEnum> enumMap = EnumUtil.getEnumMap(TestEnum.class);
enumMap.get("TEST1");
//结果：TestEnum.TEST1
```

```java
    /**
     * 5 getEnumMap
     */
    public static void test5(){
        //获取枚举的所有枚举对象，返回Map
        LinkedHashMap<String, TestEnum> enumMap = EnumUtil.getEnumMap(TestEnum.class);
        System.out.println("test5--enumMap==>"+enumMap);

        //结果：
        //test5--enumMap==>{TEST1=TEST1, TEST2=TEST2, TEST3=TEST3}
    }
```

**⑥ getNameFieldMap**

获得枚举名对应指定字段的 Map，键为枚举名，值为字段值。例子：

```java
Map<String,Object> enumMap = EnumUtil.getNameFieldMap(TestEnum.class,"type");
enumMap.get("TEST1");
//结果：type1
```

```java
    /**
     * 6 getNameFieldMap
     */
    public static void test6(){
        //获取枚举的所有名称和字段值，返回Map
        Map<String, Object> type = EnumUtil.getNameFieldMap(TestEnum.class, "type");
        System.out.println("test6--type==>"+type);

        //结果：
        //test6--type==>{TEST1=type1, TEST2=type2, TEST3=type3}
    }
```







## ⑮ 命令行工具-RuntimeUtil



### 1 介绍

在 Java 世界中，如果想与其他语言打交道，处理调用接口，或者 JNI，就是通过本地命令方式调用了。Hutool 封装了 JDK 的 Process 类，用于执行命令行命令（在 Windows 下是 cmd，在 Linux 下是 Shell 命令）。



### 2 方法

**① 基础方法**

- exec 执行命令行命令，返回 Process 对象，Process 可以读取执行命令后的返回内容的流

**② 快捷方法**

- execForStr 执行系统命令，返回字符串
- execForLines 执行系统命令，返回行列表



### 3 使用

```java
String str = RuntimeUtil.execForStr("ipconfig");
```

执行这个命令后，在 Windows 下可以获取网卡信息。

```java
    /**
     * 命令行工具-RuntimeUtil
     */
    private static void test1() {
        String command = "cmd /c dir";
        String result = RuntimeUtil.execForStr(command);
        System.out.println("test1--result==>"+result);

        List<String> stringList = RuntimeUtil.execForLines(command);
        System.out.println("test1--stringList==>"+stringList);

        String str = RuntimeUtil.execForStr("ipconfig");
        System.out.println("test1--str==>"+str);
    }
```





## ⑯ 数字工具-NumberUtil



### 1 由来

数学工具针对数学运算做工具性封装



### 2 使用

**① 加减乘除**

- `NumberUtil.add` 针对数字类型做加法
- `NumberUtil.sub` 针对数字类型做减法
- `NumberUtil.mul` 针对数字类型做乘法
- `NumberUtil.div` 针对数字类型做除法，并提供重载方法用于规定除不尽的情况下保留小数位数和舍弃方式。

以上四种运算都会将 double 转为 BigDecimal 后计算，解决float和double类型无法进行精确计算的问题。这些方法常用于商业计算。

**② 保留小数**

保留小数的方法主要有两种：

- `NumberUtil.round` 方法主要封装 BigDecimal 中的方法来保留小数，返回 BigDecimal，这个方法更加灵活，可以选择四舍五入或者全部舍弃等模式。

  ```java
  double te1=123456.123456;
  double te2=123456.128456;
  Console.log(round(te1,4));//结果:123456.1235
  Console.log(round(te2,4));//结果:123456.1285
  ```

- NumberUtil.roundStr 方法主要封装 String.format 方法，舍弃方式采用四舍五入。

  ```java
  double te1=123456.123456;
  double te2=123456.128456;
  Console.log(roundStr(te1,2));//结果:123456.12
  Console.log(roundStr(te2,2));//结果:123456.13                                                                             
  ```

**③ decimalFormat**

针对 `DecimalFormat.format` 进行简单封装。按照固定格式对 double 或 long 类型的数字做格式化操作。

```java
long c=299792458;//光速
String format = NumberUtil.decimalFormat(",###", c);//299,792,458
```

格式中主要以 # 和 0 两种占位符号来指定数字长度。0 表示如果位数不足则以 0 填充，# 表示只要有可能就把数字拉上这个位置。

- 0 -> 取一位整数
- 0.00 -> 取一位整数和两位小数
- 00.000 -> 取两位整数和三位小数
- \# -> 取所有整数部分
- \#.##% -> 以百分比方式计数，并取两位小数
- \#.#####E0 -> 显示为科学计数法，并取五位小数
- ,### -> 每三位以逗号进行分隔，例如：299,792,458
- 光速大小为每秒,###米 -> 将格式嵌入文本

关于格式的更多说明，请参阅：[Java DecimalFormat的主要功能及使用方法](https://blog.csdn.net/evangel_z/article/details/7624503)

**④ 校验数字**

- `NumberUtil.isNumber` 是否为数字
- NumberUtil.isInteger 是否为整数
- NumberUtil.isDouble 是否为浮点数
- NumberUtil.isPrimes 是否为质数

**⑤ 随机数**

- NumberUtil.generateRandomNumber 生成不重复随机数，根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组。
- NumberUtil.generateBySet 生成不重复随机数，根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组。

**⑥ 整数列表**

NumberUtil.range 方法根据范围和步进，生成一个有序整数列表。NumberUtil.appendRange 将给定范围内的整数添加到已有集合中

**⑦ 其它**

- `NumberUtil.factorial` 阶乘
- `NumberUtil.sqrt` 平方根
- `NumberUtil.divisor` 最大公约数
- `NumberUtil.multiple` 最小公倍数
- `NumberUtil.getBinaryStr` 获得数字对应的二进制字符串
- `NumberUtil.binaryToInt` 二进制转int
- `NumberUtil.binaryToLong` 二进制转long
- `NumberUtil.compare` 比较两个值的大小
- `NumberUtil.toStr` 数字转字符串，并自动去除尾小数点儿后多余的0























































































































































































































































































































































































