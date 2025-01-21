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

```java
    /**
     * 1.加减乘除
     */
    public static void test1(){
        int a = 1, b = 2;
        // 加法
        double add = NumberUtil.add(a, b);
        System.out.println("test1--add==>"+add);
        // 减法
        double sub = NumberUtil.sub(a, b);
        System.out.println("test1--sub==>"+sub);
        // 乘法
        double mul = NumberUtil.mul(a, b);
        System.out.println("test1--mul==>"+mul);
        // 除法，并提供重载方法用于规定除不尽的情况下保留小数位数和舍弃方式
        double div = NumberUtil.div(a, b);
        System.out.println("test1--div==>"+div);
        double div2 = NumberUtil.div(1, 3, 6);
        System.out.println("test1--div2==>"+div2);
        
        //结果：
        //test1--add==>3.0
        //test1--sub==>-1.0
        //test1--mul==>2.0
        //test1--div==>0.5
        //test1--div2==>0.333333
    }
```

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

```java
    /**
     * 2.保留小数
     */
    public static void test2(){
        //`NumberUtil.round` 方法主要封装 BigDecimal 中的方法来保留小数，
        //返回 BigDecimal，这个方法更加灵活，可以选择四舍五入或者全部舍弃等模式
        double te1=123456.123456;
        double te2=123456.128456;
        //结果:123456.1235
        BigDecimal round1 = round(te1, 4);
        Console.log("test2--round1==>"+round1);
        //结果:123456.1285
        BigDecimal round2 = round(te2, 4);
        Console.log("test2--round2==>"+round2);

        //NumberUtil.roundStr 方法主要封装 String.format 方法，舍弃方式采用四舍五入。
        double te3=123456.123456;
        double te4=123456.128456;
        //结果:123456.12
        String roundStr1 = roundStr(te3, 2);
        Console.log("test2--roundStr1==>"+roundStr1);
        //结果:123456.13
        String roundStr2 = roundStr(te4, 2);
        Console.log("test2--roundStr2==>"+roundStr2);

        //结果：
        //test2--round1==>123456.1235
        //test2--round2==>123456.1285
        //test2--roundStr1==>123456.12
        //test2--roundStr2==>123456.13
    }
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

```java
    /**
     * 3.decimalFormat
     */
    public static void test3(){
        //光速
        long c=299792458;
        //299,792,458
        String format = NumberUtil.decimalFormat(",###", c);
        Console.log("test3--format==>"+format);

        //0 -> 取一位整数
        //0.00 -> 取一位整数和两位小数
        //00.000 -> 取两位整数和三位小数
        //# -> 取所有整数部分
        //#.##% -> 以百分比方式计数，并取两位小数
        //#.#####E0 -> 显示为科学计数法，并取五位小数
        //,### -> 每三位以逗号进行分隔，例如：299,792,458
        //光速大小为每秒,###米 -> 将格式嵌入文本
        String format1 = NumberUtil.decimalFormat("0", c);
        Console.log("test3--format1==>"+format1);
        String format2 = NumberUtil.decimalFormat("0.00", c);
        Console.log("test3--format2==>"+format2);
        String format3 = NumberUtil.decimalFormat("00.000", c);
        Console.log("test3--format3==>"+format3);
        String format4 = NumberUtil.decimalFormat("#", c);
        Console.log("test3--format4==>"+format4);
        String format5 = NumberUtil.decimalFormat("#.##%", c);
        Console.log("test3--format5==>"+format5);
        String format6 = NumberUtil.decimalFormat("#.#####E0", c);
        Console.log("test3--format6==>"+format6);
        String format7 = NumberUtil.decimalFormat(",###", c);
        Console.log("test3--format7==>"+format7);
        String format8 = NumberUtil.decimalFormat("光速大小为每秒,###米", c);
        Console.log("test3--format8==>"+format8);
        
        //结果：
        //test3--format==>299,792,458
        //test3--format1==>299792458
        //test3--format2==>299792458.00
        //test3--format3==>299792458.000
        //test3--format4==>299792458
        //test3--format5==>29979245800%
        //test3--format6==>2.99792E8
        //test3--format7==>299,792,458
        //test3--format8==>光速大小为每秒299,792,458米
    }
```

**④ 校验数字**

- `NumberUtil.isNumber` 是否为数字
- NumberUtil.isInteger 是否为整数
- NumberUtil.isDouble 是否为浮点数
- NumberUtil.isPrimes 是否为质数

```java
    /**
     * 4.校检数字
     */
    public static void test4(){
        //判断是否为数字
        boolean isNumber = NumberUtil.isNumber("123");
        Console.log("test4--isNumber==>"+isNumber);
        //判断是否为整数
        boolean isInteger = NumberUtil.isInteger("123");
        Console.log("test4--isInteger==>"+isInteger);
        //判断是否为小数
        boolean isDouble = NumberUtil.isDouble("123.123");
        Console.log("test4--isDouble==>"+isDouble);
        //判断是否为质数
        boolean isPrimes = NumberUtil.isPrimes(123);
        Console.log("test4--isPrimes==>"+isPrimes);
        //判断是否为质数
        boolean isPrimes1 = NumberUtil.isPrimes(7);
        Console.log("test4--isPrimes1==>"+isPrimes1);

        //结果：
        //test4--isNumber==>true
        //test4--isInteger==>true
        //test4--isDouble==>true
        //test4--isPrimes==>false
        //test4--isPrimes1==>true
    }
```

**⑤ 随机数**

- NumberUtil.generateRandomNumber 生成不重复随机数，根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组。
- NumberUtil.generateBySet 生成不重复随机数，根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组。

```java
    /**
     * 5.随机数
     */
    public static void test5(){
        //generateRandomNumber: 适用于小范围、少量随机数的生成，返回 int[]。
        //generateBySet: 适用于大范围、大量随机数的生成，返回 Integer[]。
        
        //NumberUtil.generateRandomNumber 生成不重复随机数
        //根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组
        int[] ints = NumberUtil.generateRandomNumber(1, 10, 5);
        Console.log("test5--ints==>"+ Arrays.toString(ints));

        //NumberUtil.generateBySet 生成不重复随机数
        //根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组
        Integer[] ints2 = NumberUtil.generateBySet(1, 10, 5);
        Console.log("test5--ints2==>"+ Arrays.toString(ints2));
    }
```

**⑥ 整数列表**

NumberUtil.range 方法根据范围和步进，生成一个有序整数列表。NumberUtil.appendRange 将给定范围内的整数添加到已有集合中

```java
    /**
     * 6.整数列表
     */
    public static void test6(){
        //NumberUtil.range 生成整数列表
        //生成从 start 到 end 的整数列表，步长为 step 2
        int[] ints = NumberUtil.range(1, 10, 2);
        Console.log("test6--ints==>"+ Arrays.toString(ints));

        //NumberUtil.range 生成整数列表
        //生成从 start 到 end 的整数列表，步长为 step 3
        int[] ints1 = NumberUtil.range(1, 10, 3);
        Console.log("test6--ints1==>"+ Arrays.toString(ints1));

        //NumberUtil.range 生成整数列表
        //生成从 start 到 end 的整数列表，步长为 step 4
        int[] ints2 = NumberUtil.range(1, 10, 4);
        Console.log("test6--ints2==>"+ Arrays.toString(ints2));
        
        //结果：
        //test6--ints==>[1, 3, 5, 7, 9]
        //test6--ints1==>[1, 4, 7, 10]
        //test6--ints2==>[1, 5, 9]
    }
```

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

```java
    /**
     * 7.其他
     */
    public static void test7(){
        //- `NumberUtil.factorial` 阶乘
        //- `NumberUtil.sqrt` 平方根
        //- `NumberUtil.divisor` 最大公约数
        //- `NumberUtil.multiple` 最小公倍数
        //- `NumberUtil.getBinaryStr` 获得数字对应的二进制字符串
        //- `NumberUtil.binaryToInt` 二进制转int
        //- `NumberUtil.binaryToLong` 二进制转long
        //- `NumberUtil.compare` 比较两个值的大小
        //- `NumberUtil.toStr` 数字转字符串，并自动去除尾小数点儿后多余的0

        long factorial = NumberUtil.factorial(5);
        Console.log("test7--factorial==>"+factorial);
        double sqrt = NumberUtil.sqrt(9);
        Console.log("test7--sqrt==>"+sqrt);
        long divisor = NumberUtil.divisor(10, 2);
        Console.log("test7--divisor==>"+divisor);
        long multiple = NumberUtil.multiple(10, 2);
        Console.log("test7--multiple==>"+multiple);
        String binaryStr = NumberUtil.getBinaryStr(10);
        Console.log("test7--binaryStr==>"+binaryStr);
        int binaryToInt = NumberUtil.binaryToInt("1010");
        Console.log("test7--binaryToInt==>"+binaryToInt);
        long binaryToLong = NumberUtil.binaryToLong("1010");
        Console.log("test7--binaryToLong==>"+binaryToLong);
        int compare = NumberUtil.compare(10, 20);
        Console.log("test7--compare==>"+compare);
        String toStr = NumberUtil.toStr(10);
        Console.log("test7--toStr==>"+toStr);
        
        //结果：
        //test7--factorial==>120
        //test7--sqrt==>3.0
        //test7--divisor==>2
        //test7--multiple==>10
        //test7--binaryStr==>1010
        //test7--binaryToInt==>10
        //test7--binaryToLong==>10
        //test7--compare==>-1
        //test7--toStr==>10
    }
```





## ⑰ 数组工具-ArrayUtil



### 1 介绍

数组工具类主要针对原始类型数组和泛型数组相关方法进行封装。

数组工具类主要是解决对象数组（包括包装类型数组）和原始类型数组使用方法不统一的问题。



### 2 方法

**① 判空**

数组的判空类似于字符串的判空，标准是 null 或者数组长度为 0 ，ArrayUtil 中封装了针对原始类型和泛型数组的判空和判非空：

1. 判断空

   ```java
   int[] a = [];
   int[] b = null;
   ArrayUtil.isEmpty(a);
   ArrayUtil.isEmpty(b);
   ```

2. 判断非空

   ```java
   int[] a = {1,2};
   ArrayUtil.isNotEmpty(a);
   ```

```java
    /**
     * 1.判空
     */
    private static void test1(){
        //判空
        int[] a = {};
        int[] b = null;
        boolean a1 = ArrayUtil.isEmpty(a);
        boolean b1 = ArrayUtil.isEmpty(b);
        System.out.println("test1--a1==>"+a1);
        System.out.println("test1--b1==>"+b1);

        //判非空
        int[] c = {1,2,3};
        boolean c1 = ArrayUtil.isNotEmpty(c);
        System.out.println("test1--c1==>"+c1);
        
        //结果：
        //test1--a1==>true
        //test1--b1==>true
        //test1--c1==>true
    }

```

**② 新建泛型数组**

`Array.newInstance` 并不支持泛型返回值，在此封装此方法便使之支持泛型返回值。

```java
String[] newArray = ArrayUtil.newArray(String.class,3);
```

```java
    /**
     * 2.新建泛型数组
     */
    private static void test2(){
        //新建泛型数组
        String[] stringNewArray = ArrayUtil.newArray(String.class,3);
        stringNewArray[0] = "a";
        stringNewArray[1] = "b";
        stringNewArray[2] = "c";
        System.out.println("test2--newArray==>"+ Arrays.toString(stringNewArray));

        Integer[] intNewArray = ArrayUtil.newArray(Integer.class, 5);
        intNewArray[0] = 1;
        intNewArray[1] = 2;
        intNewArray[2] = 3;
        intNewArray[3] = 4;
        System.out.println("test2--objects==>"+ Arrays.toString(intNewArray));

        //结果：
        //test2--newArray==>[a, b, c]
        //test2--objects==>[1, 2, 3, 4, null]

    }
```

**③ 调整大小**

使用 `ArrayUtil.resize` 方法生成一个新的重新设置大小的数组。

```java
    /**
     * 3.调整大小
     */
    private static void test3(){
        //使用 `ArrayUtil.resize` 方法生成一个新的重新设置大小的数组
        String[] stringArray = {"a","b","c"};
        String[] stringResizeArray = ArrayUtil.resize(stringArray, 5);
        System.out.println("test3--stringResizeArray==>"+ Arrays.toString(stringResizeArray));

        Integer[] intArray = {1,2,3,4,5};
        Integer[] intResizeArray = ArrayUtil.resize(intArray, 3);
        System.out.println("test3--intResizeArray==>"+ Arrays.toString(intResizeArray));

        //结果：
        //test3--stringResizeArray==>[a, b, c, null, null]
        //test3--intResizeArray==>[1, 2, 3]
    }
```

**④ 合并数组**

`ArrayUtil.addAll` 方法采用可变参数方式，将多个泛型数组合并为一个数组。

```java
    /**
     * 4.合并数组
     */
    private static void test4(){
        //使用 `ArrayUtil.addAll` 方法合并两个数组
        String[] stringArray = {"a","b","c"};
        String[] stringArray2 = {"1","2","3"};
        String[] stringAddAllArray = ArrayUtil.addAll(stringArray, stringArray2);
        System.out.println("test4--stringAddAllArray==>"+ Arrays.toString(stringAddAllArray));

        Integer[] intArray = {1,2,3,4,5};
        Integer[] intArray2 = {6,7,8,9,10};
        Integer[] intAddAllArray = ArrayUtil.addAll(intArray, intArray2);
        System.out.println("test4--intAddAllArray==>"+ Arrays.toString(intAddAllArray));

        //结果：
        //test4--stringAddAllArray==>[a, b, c, 1, 2, 3]
        //test4--intAddAllArray==>[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
```

**⑤ 克隆**

数组本身支持 clone 方法，因此确定为某种类型数组时调用 `ArrayUtil.clone(T[])` ，不确定类型的使用 `ArrayUtil.clone(T)`，两种重载方法在实现上有所不同，但是在使用中并不能感知出差别。

1. 泛型数组调用原生克隆

   ```java
   Integer[] b = {1,2,3};
   Integer[] cloneB = ArrayUtil.clone(b);
   Assert.assertArrayEquals(b,cloneB);
   ```

2. 非泛型数组（原始类型数组）调用第二种重载方法

   ```java
   int[] a = {1,2,3};
   int[] clone = ArrayUtil.clone(a);
   Assert.assertArrayEquals(a,clone);
   ```

```java
    /**
     * 5.克隆
     */
    private static void test5(){
        //泛型数组调用原生克隆
        Integer[] b = {1,2,3};
        Integer[] cloneB = ArrayUtil.clone(b);
        //判断是否是同一个对象
        System.out.println("test5--b==>"+ (b == cloneB));
        //判断是否等值
        System.out.println("test5--b==>"+ Arrays.equals(b, cloneB));
        System.out.println("test5--cloneB==>"+ Arrays.toString(cloneB));

        //非泛型数组（原始类型数组）调用第二种重载方法
        int[] a = {1,2,3};
        int[] clone = ArrayUtil.clone(a);
        //判断是否是同一个对象
        System.out.println("test5--a==>"+ (a == clone));
        //判断是否等值
        System.out.println("test5--a==>"+ Arrays.equals(a, clone));
        System.out.println("test5--clone==>"+ Arrays.toString(clone));
        
        //结果：
        //test5--b==>false
        //test5--b==>true
        //test5--cloneB==>[1, 2, 3]
        //test5--a==>false
        //test5--a==>true
        //test5--clone==>[1, 2, 3]
    }
```

**⑥ 有序列表生成**

ArrayUtil.range 方法有三个重载，这三个重载配合可以实现支持步进的有序数组或者步进为 1 的有序数组。这种列表生成器在 Python 中做为语法糖存在。

```java
    /**
     * 6.有序列表生成
     */
    private static void test6(){
        //使用 `ArrayUtil.range` 方法生成有序列表
        //生成从 start 到 end 的整数列表，步长为 step 2
        int[] ints = ArrayUtil.range(1, 10, 2);
        System.out.println("test6--ints==>"+ Arrays.toString(ints));

        //生成从 start 到 end 的整数列表，步长为 step 3
        int[] ints1 = ArrayUtil.range(1, 10, 3);
        System.out.println("test6--ints1==>"+ Arrays.toString(ints1));
        
        //结果：
        //test6--ints==>[1, 3, 5, 7, 9]
        //test6--ints1==>[1, 4, 7]
    }
```

**⑦ 拆分数组**

`ArrayUtil.split` 方法用于拆分一个 byte 数组，将 byte 数组平均分成几等份，常用于消息拆分。

```java
    /**
     * 7.拆分数组
     */
    private static void test7(){
        //ArrayUtil.split
        byte[] byteArray = {1,2,3,4,5,6,7,8,9,10};
        byte[][] byteSplitArray = ArrayUtil.split(byteArray, 3);
        for (int i = 0; i < byteSplitArray.length; i++) {
            System.out.println("test7--byteArray"+i+"==>"+ Arrays.toString(byteSplitArray[i]));
        }

        //结果：
        //test7--byteArray0==>[1, 2, 3]
        //test7--byteArray1==>[4, 5, 6]
        //test7--byteArray2==>[7, 8, 9]
        //test7--byteArray3==>[10]
    }
```

**⑧ 过滤**

`ArrayUtil.filter` 方法用于过滤已有数组元素，只针对泛型数组操作，原始类型数组并未提供。方法中 Filter 接口用于返回 boolean 值决定是否保留。

1. 过滤数组，只保留偶数

   ```java
   Integer[] a = {1,2,3,4,5,6};
   // [2,4,6]
   Integer[] filter = ArrayUtil.filter(a, (Editor<Integer>) t -> (t % 2 == 0) ? t : null);
   ```

2. 对于已有数组编辑，获得编辑后的值

   ```java
   Integer[] a = {1, 2, 3, 4, 5, 6};
   // [1, 20, 3, 40, 5, 60]
   Integer[] filter = ArrayUtil.filter(a, (Editor<Integer>) t -> (t % 2 == 0) ? t * 10 : t);
   ```


```java
    /**
     * 8.过滤
     */
    private static void test8(){
        //使用 `ArrayUtil.filter` 方法过滤数组
        String[] stringArray = {"a","b","c","d","e","f","g","h","i","j"};
        String[] stringFilterArray = ArrayUtil.filter(stringArray,
                s -> "a".equals(s) || "b".equals(s) || "c".equals(s));
        System.out.println("test8--stringFilterArray==>"+ Arrays.toString(stringFilterArray));

        //过滤数组，只保留偶数
        Integer[] intArray = {1,2,3,4,5,6,7,8,9,10};
        Integer[] intFilterArray = ArrayUtil.filter(intArray,
                i -> i % 2 == 0);
        System.out.println("test8--intFilterArray==>"+ Arrays.toString(intFilterArray));

        //对已有数组编辑，获得编辑后的值
        Integer[] a = {1, 2, 3, 4, 5, 6};
        // [1, 20, 3, 40, 5, 60]
        Integer[] b = ArrayUtil.edit(a,
                i -> i % 2 == 0 ? i * 10 : i);
        System.out.println("test8--b==>"+ Arrays.toString(b));

        //结果：
        //test8--stringFilterArray==>[a, b, c]
        //test8--intFilterArray==>[2, 4, 6, 8, 10]
        //test8--b==>[1, 20, 3, 40, 5, 60]
    }
```

**⑨ 编辑**

修改元素对象，此方法会修改原数组。

```java
Integer[] a = {1, 2, 3, 4, 5, 6};
// [1, 20, 3, 40, 5, 60]
ArrayUtil.edit(a, t -> (t % 2 == 0) ? t * 10 : t);
```

```java
    /**
     * 9.编辑
     */
    private static void test9(){
        //对已有数组编辑，获得编辑后的值
        Integer[] a = {1, 2, 3, 4, 5, 6};
        // [1, 20, 3, 40, 5, 60]
        Integer[] b = ArrayUtil.edit(a,
                i -> i % 2 == 0 ? i * 10 : i);
        System.out.println("test9--b==>"+ Arrays.toString(b));
        
        //结果：
        //test9--b==>[1, 20, 3, 40, 5, 60]
    }
```

**⑩ zip**

`ArrayUtil.zip` 方法传入两个数组，第一个数组为 key ，第二个数组对应位置为 value ，此方法在 Python 中为 zip() 函数。

```java
String[] keys = {"a", "b", "c"};
Integer[] values = {1,2,3};
Map<String, Integer> map = ArrayUtil.zip(keys, values, true);

//{a=1, b=2, c=3}
```

```java
    /**
     * 10.zip
     */
    private static void test10(){
        //使用 `ArrayUtil.zip` 方法将两个数组合并成一个数组
        //`ArrayUtil.zip` 方法传入两个数组，第一个数组为 key
        //第二个数组对应位置为 value ，此方法在 Python 中为 zip() 函数
        String[] stringArray = {"a","b","c"};
        Integer[] intArray = {1,2,3};
        Map<String, Integer> zip = ArrayUtil.zip(stringArray, intArray);
        System.out.println("test10--zip==>"+ zip);

        //结果：
        //test10--zip==>{a=1, b=2, c=3}
    }

```

**⑪ 是否包含元素**

`ArrayUtil.contains` 方法只针对泛型数组，检测指定元素是否在数组中。

```java
    /**
     * 11.是否包含元素
     */
    private static void test11(){
        String[] stringArray = {"a","b","c"};
        boolean contains = ArrayUtil.contains(stringArray, "a");
        System.out.println("test11--contains==>"+ contains);
        contains = ArrayUtil.contains(stringArray, "d");
        System.out.println("test11--contains==>"+ contains);
        
        //结果：
        //test11--contains==>true
        //test11--contains==>false
    }
```

**⑫ 包装和拆包**

在原始类型元素和包装类型中，Java 实现了自动包装和拆包，但是相应的数组无法实现，于是便是用 ArrayUtil.wrap 和 ArrayUtil.unwrap 对原始类型数组和包装类型数组进行转换。

```java
    /**
     * 12.包装和拆包
     */
    private static void test12(){
        //使用 `ArrayUtil.wrap` 方法将数组包装为对象数组
        int[] intArray = {1,2,3};
        Integer[] integers = ArrayUtil.wrap(intArray);
        System.out.println("test12--objectArray==>"+ Arrays.toString(integers));

        //使用 `ArrayUtil.unWrap` 方法将对象数组拆包为原始数组
        Integer[] integerArray = {1,2,3};
        int[] ints = ArrayUtil.unWrap(integerArray);
        System.out.println("test12--intArray==>"+ Arrays.toString(ints));
        
        //结果：
        //test12--objectArray==>[1, 2, 3]
        //test12--intArray==>[1, 2, 3]
    }
```

**⑬ 判断对象是否为数组**

`ArrayUtil.isArray` 方法封装了 `obj.getClass().isArray()`

```java
    /**
     * 13.判断对象是否为数组
     */
    private static void test13(){
        boolean isArray = ArrayUtil.isArray(new int[]{1,2,3});
        System.out.println("test13--isArray==>"+ isArray);

        isArray = ArrayUtil.isArray(new Integer[]{1,2,3});
        System.out.println("test13--isArray==>"+ isArray);

        isArray = ArrayUtil.isArray(new String[]{"a","b","c"});
        System.out.println("test13--isArray==>"+ isArray);

        String string = "abc";
        isArray = ArrayUtil.isArray(string);
        System.out.println("test13--isArray==>"+ isArray);
        
        //结果：
        //test13--isArray==>true
        //test13--isArray==>true
        //test13--isArray==>true
        //test13--isArray==>false
    }
```

**⑭ 转为字符串**

1. ArrayUtil.toString 通常原始类型的数组输出为字符串时无法正常显示，于是封装此方法可以完美兼容原始类型数组和包装类型数组的转为字符串操作。
2. ArrayUtil.join 方法使用间隔符将一个数组转为字符串，比如 [1,2,3,4] 这个数组转为字符串，间隔符使用"-" 的话，结果为 1-2-3-4，join 方法同样支持泛型数组和原始类型数组。

```java
    /**
     * 14.转为字符串
     */
    private static void test14(){
        //ArrayUtil.toString 通常原始类型的数组输出为字符串时无法正常显示
        //于是封装此方法可以完美兼容原始类型数组和包装类型数组的转为字符串操作
        int[] intArray = {1,2,3};
        String string = ArrayUtil.toString(intArray);
        System.out.println("test14--string==>"+ string);

        //ArrayUtil.join 方法使用间隔符将一个数组转为字符串，比如 [1,2,3,4] 
        //这个数组转为字符串，间隔符使用"-" 的话，结果为 1-2-3-4
        //join 方法同样支持泛型数组和原始类型数组
        int[] intArray1 = {4,5,6};
        String join = ArrayUtil.join(intArray1, "-");
        System.out.println("test14--join==>"+ join);

        //结果：
        //test14--string==>[1, 2, 3]
        //test14--join==>4-5-6
        
    }
```

**⑮ toArray**

`ArrayUtil.toArray` 方法针对 ByteBuffer 转数组提供便利

```java
    /**
     * 15.toArray
     */
    private static void test15(){
        //`ArrayUtil.toArray` 方法针对 ByteBuffer 转数组提供便利
        ByteBuffer byteBuffer = ByteBuffer.allocate(10);
        byteBuffer.put((byte) 1);
        byteBuffer.put((byte) 2);
        byteBuffer.put((byte) 3);
        byteBuffer.flip();
        byte[] bytes = ArrayUtil.toArray(byteBuffer);
        System.out.println("test15--bytes==>"+ Arrays.toString(bytes));

        //结果：
        //test15--bytes==>[1, 2, 3]
    }
```
