---
title: Hutool-Core核心（一）
date: 2024/12/18
---

![科罗拉多州双湖的日出](https://bizhi1.com/wp-content/uploads/2024/10/sunrise-in-twin-lakes-colorado-ll-7680x4320-1.jpg)



## 克隆

::: tip

支持泛型的克隆接口和克隆类

:::

### 1 解决什么问题

JDK 中的 Cloneable 接口只是一个空接口，并没有定义成员，它存在的意义仅仅是指明一个类的实例化对象支持位复制（就是对象克隆），如果不实现这个类，调用对象的 clone() 方法就会抛出 `CloneNotSupportedException` 异常。而且，因为 clone() 方法在 Object 对象中，返回值也是 Object 对象，因此克隆后需要我们自己去强转下类型。



### 2 泛型克隆接口

因此，`cn.hutool.core.clone.Cloneable` 接口应运而生。此接口定义了一个返回型的成员方法，这样，实现此接口后会提示必须实现一个 public 的 clone 方法，调用父类的 clone 方法即可：

```java
/**
 * 猫猫类，使用实现 Cloneable 方式
 * @author Looly
 *
 */
private static class Cat implements Cloneable<Cat> {
    private String name = "miaomiao";
    private int age = 2;
    
    @Override
    public Cat clone() {
        try {
            return (Cat) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new CloneRuntimeException(e);
        }
    }
}
```



### 3 泛型克隆类

但是实现此接口依旧有不方便之处，就是必须自己实现一个 public 类型的 clone() 方法，还要调用父类（Object）的 clone 方法并处理异常。于是 `cn.hutool.clone.CloneSupport` 类产生，这个类帮我们实现了上面的 clone 方法，因此只要集成此类，不用写任何代码即可使用 clone() 方法：

```java
/**
 * 狗狗类，用于继承CloneSupport类
 * @author Looly
 *
 */
private static class Dog extends CloneSupport<Dog>{
	private String name = "wangwang";
	private int age = 3;
}
```

当然，使用 CloneSupport 的前提是你没有集成任何的类，谁让 Java 不支持多重继承呢（你依旧可以让父类集成这个类，如果可以的话）。如果没办法集成类，那实现 `cn.hutool.clone.Cloneable` 也是不错的主意，因此 hutool 提供了这两种方式，任选其一，在便捷和灵活上都提供了支持。



### 4 深克隆

我们知道实现 Cloneable 接口后克隆的对象是浅克隆，要想实现深克隆，请使用：

```java
ObjectUtil.cloneByStream(obj);
```

前提是对象必须实现 Serializable 接口。

ObjectUtil 同样提供一种静态方法：`clone(obj) 、cloneIfPossible(obj)` 用于简化克隆调用。



## 类型转换

::: tip

① 类型转换工具类-Convert

② 自定义类型转换-ConverterRegistry

:::

## ① 类型转换工具类-Convert

### 1 痛点

在 Java 开发中我们要面对各种各样的类型转换问题，尤其是从命令行获取的用户参数，从 HttpRequest 获取 Parameter 等等，这些参数类型多种多样，我们怎么去转换他们呢？常用的办法是先整成 String，然后调用 XXX.parseXXX 方法，还要承受转换失败的风险，不得不加一层 try catch，这个小小的过程混迹在业务代码中会显得非常难看和臃肿。



### 2 Convert 类

Convert 类可以说是一个工具方法类，里面封装了针对 Java 常见类型的转换，用于简化类型转换。Convert 类中大部分方法为 toXXX ，参数为 Object，可以实现将任意可能的类型转换为指定类型。同时支持第二个参数 defaultValue 用于在转换失败时返回一个默认值。



### 3 Java 常见类型转换

**① 转换为字符串：**

```java
int a = 1;
//aStr为"1"
String aStr = Convert.toStr(a);

long[] b = {1,2,3,4,5};
//bStr为："[1, 2, 3, 4, 5]"
String bStr = Convert.toStr(b);
```

**② 转换为指定类型数组：**

```java
String[] b = { "1", "2", "3", "4" };
//结果为Integer数组
Integer[] intArray = Convert.toIntArray(b);

long[] c = {1,2,3,4,5};
//结果为Integer数组
Integer[] intArray2 = Convert.toIntArray(c);
```

**③ 转换为日期对象：**

```java
String a = "2017-05-06";
Date value = Convert.toDate(a);
```

**④ 转换为集合：**

```java
Object[] a = {"a", "你", "好", "", 1};
List<?> list = Convert.convert(List.class, a);
//从4.1.11开始可以这么用
List<?> list = Convert.toList(a);
```





### 3 其他类型转换

**① 标准类型**

通过 `Convert.convert(Class<T>,Object)` 方法可以将任意类型转换为指定类型，Hutool 中预定义了许多类型转换，例如转换为 URI、URL、Calendar 等等，这些类型的转换都依托于 `ConverterRegistry` 类。通过这个类和 `Converter` 接口，我们可以自定义一些类型转换。

**② 泛型类型**

通过 `convert(TypeReference<T> reference,Object value)` 方法，自行 new 一个 `TypeReference` 对象可以对嵌套泛型进行类型转换。例如，我们想转换一个对象为 `List<String>` 类型，此时传入的标准 Class 就无法满足要求，此时我们可以这样：

```java
Object[] a = { "a", "你", "好", "", 1 };
List<String> list = Convert.convert(new TypeReference<List<String>>() {}, a);
```

通过 `TypeReference` 实例化后制定泛型类型，即可转换对象为我们想要的目标类型。



### 4 半角和全角转换

在很多文本的统一化中这两个方法非常有用，主要对标点符号的全角半角转换。

**① 半角转全角：**

```java
String a = "123456789";

//结果为："１２３４５６７８９"
String sbc = Convert.toSBC(a);
```

**② 全角转半角：**

```java
String a = "１２３４５６７８９";

//结果为"123456789"
String dbc = Convert.toDBC(a);
```



### 5 16进制（Hex）

在很多加密解密，以及中文字符串传输（比如表单提交）的时候，会用到 16 进制转换，就是 Hex 转换，为此 Hutool 中专门封装了 `HexUtil` 工具类，考虑到 16 进制转换也是转换的一部分，因此将其方法也放在 Convert 类中，便于理解和查找，使用同样非常简单：

**① 转为 16 进制（Hex）字符串**

```java
String a = "我是一个小小的可爱的字符串";

//结果："e68891e698afe4b880e4b8aae5b08fe5b08fe79a84e58fafe788b1e79a84e5ad97e7aca6e4b8b2"
String hex = Convert.toHex(a, CharsetUtil.CHARSET_UTF_8);
```

**② 将 16 进制（Hex）字符串转为普通字符串：**

```java
String hex = "e68891e698afe4b880e4b8aae5b08fe5b08fe79a84e58fafe788b1e79a84e5ad97e7aca6e4b8b2";

//结果为："我是一个小小的可爱的字符串"
String raw = Convert.hexStrToStr(hex, CharsetUtil.CHARSET_UTF_8);

//注意：在4.1.11之后hexStrToStr将改名为hexToStr
String raw = Convert.hexToStr(hex, CharsetUtil.CHARSET_UTF_8);
```

::: tip

因为字符串牵涉到编码问题，因此必须传入编码对象，此处使用 UTF-8 编码。toHex 方法同样支持传入 byte[] ，同样也可以使用 hexToBytes 方法将 16 进制转为 byte[]

:::



### 6 Unicode 和字符串转换

与 16 进制类似，Convert 类同样可以在字符串和 Unicode 之间轻松切换：

```java
String a = "我是一个小小的可爱的字符串";

//结果为："\\u6211\\u662f\\u4e00\\u4e2a\\u5c0f\\u5c0f\\u7684\\u53ef\\u7231\\u7684\\u5b57\\u7b26\\u4e32"	
String unicode = Convert.strToUnicode(a);

//结果为："我是一个小小的可爱的字符串"
String raw = Convert.unicodeToStr(unicode);
```

很熟悉吧？如果你在 properties 文件中写过中文，你会明白这个方法的重要性。



### 7 编码转换

在接收表单的时候，我们常常被中文乱码所困扰，其实大多数原因是使用了不正确的编码方式解码了数据。于是 `Convert.convertCharset` 方法便派上用场了，它可以把乱码转为正确的编码方式：

```java
String a = "我不是乱码";
//转换后result为乱码
String result = Convert.convertCharset(a, CharsetUtil.UTF_8, CharsetUtil.ISO_8859_1);
String raw = Convert.convertCharset(result, CharsetUtil.ISO_8859_1, "UTF-8");
Assert.equals(raw, a);
```

::: warning

注意：经过测试，UTF-8 编码后用 GBK 编码，再用 GBK 编码后用 UTF-8 解码会存在某些中文转换失败的问题。

:::



### 8 时间单位转换

`Convert.convertTime` 方法主要用于转换时长单位，比如一个很大的毫秒，我想获得这个毫秒数对应多少分：

```java
long a = 4535345;

//结果为：75
long minutes = Convert.convertTime(a, TimeUnit.MILLISECONDS, TimeUnit.MINUTES);
```



### 9 金额大小写转换

面对财务类需求，`Convert.digitToChinese` 将金钱数转换为大写形式：

```java
double a = 67556.32;

//结果为："陆万柒仟伍佰伍拾陆元叁角贰分"
String digitUppercase = Convert.digitToChinese(a);
```

::: warning

注意：转换为大写只能精确到分（小数点后两位），之后的数字会被忽略。

:::



### 10 数字转换

**① 数字转换为英文表达**

```java
// ONE HUNDRED AND CENTS TWENTY THREE ONLY
String format = Convert.numberToWord(100.23);
```

**② 数字简化**

```java
// 1.2k
String format1 = Convert.numberToSimple(1200, false);
```

**③ 数字转中文**

数字转中文方法中，只保留两位小数：

```java
// 一万零八百八十九点七二
String f1 = Convert.numberToChinese(10889.72356, false);

// 使用金额大写
// 壹万贰仟陆佰伍拾叁
String f1 = Convert.numberToChinese(12653, true);
```

**④ 数字中文表示转换为数字**

```java
// 1012
int f1 = Convert.chineseToNumber("一千零一十二");
```



### 11 原始类和包装类转换

有的时候，我们需要将包装类和原始类相互转换（比如 Integer.class 和 int.class）。这时候我们可以：

```java
//去包装
Class<?> wrapClass = Integer.class;

//结果为：int.class
Class<?> unWraped = Convert.unWrap(wrapClass);

//包装
Class<?> primitiveClass = long.class;

//结果为：Long.class
Class<?> wraped = Convert.wrap(primitiveClass);
```





## ② 自定义类型转换-ConverterRegistry



### 1 由来

Hutool 中类型转换最早只是一个工具类，叫做 Convert，对于每一种类型转换都是用一个静态方法表示，但是这种方式存在一个潜在问题，那就是扩展性不足，这导致 Hutool 只能满足部分类型转换的需求。



### 2 解决

扩展思想：

- `Converter` 类型转换接口，通过实现这个接口，重写 `Convert` 方法，以实现不同类型的对象转换
- `ConverterRegistry` 类型转换登记中心。将各种类型 `Convert` 对象放入登记中心，通过 `convert` 方法查找目标类型对应的转换器，将被转换对象转换之。在此类中，存放着**默认转换器**和**自定义转换器**。
  1. 默认转换器是 Hutool 中预定义的那些转换器
  2. 自定义转换器存放用户自定的转换器

通过这些方式，实现灵活的类型转换，使用方式如下：

```java
int a = 3423;
ConverterRegistry converterRegistry = ConverterRegistry.getInstance();
String result = converterRegistry.convert(String.class, a);
Assert.equals("3423", result);
```



### 3 自定义转换

Hutool 的默认转换有时候并不能满足我们自定义对象的一些需求，这时我们可以使用 `ConverterRegistry.getInstance().putCustom()` 方法自定义类型转换。

**① 自定义转换器**

```java
public static class CustomConverter implements Converter<String>{
	@Override
	public String convert(Object value, String defaultValue) throws IllegalArgumentException {
		return "Custom: " + value.toString();
	}
}
```

**② 注册转换器**

```java
ConverterRegistry converterRegistry = ConverterRegistry.getInstance();
//此处做为示例自定义String转换，因为Hutool中已经提供String转换，请尽量不要替换
//替换可能引发关联转换异常（例如覆盖String转换会影响全局）
converterRegistry.putCustom(String.class, CustomConverter.class);
```

**③ 执行转换**

```java
int a = 454553;
String result = converterRegistry.convert(String.class, a);
Assert.equals("Custom: 454553", result);
```

::: tip

注意： `convert(Class type, Object value, T defaultValue, boolean isCustomFirst)` 方法的最后一个参数可以选择转换时优先使用自定义转换器还是默认转换器。`convert(Class type, Object value, T defaultValue)` 和 `convert(Class type, Object value)` 两个重载方法都是使用自定义转换器优先的模式。

:::



### 4 ConverterRegistry 单例和对象模式

ConverterRegistry 提供一个静态方法 getInstance() 返回全局单例对象，这也是推荐的使用方式，当然如果想在某个限定范围内自定义转换，可以实例化 ConverterRegistry 对象。