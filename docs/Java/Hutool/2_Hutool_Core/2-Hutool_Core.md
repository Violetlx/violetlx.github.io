---
title: Hutool-Core核心（二）
date: 2024/12/18
---

![加拿大阿西尼博因山省立公园 8k](https://bizhi1.com/wp-content/uploads/2024/10/mount-assiniboine-provincial-park-canada-8k-c4-7680x4320-1.jpg)



## 日期和时间

::: tip

① 概述

② 日期时间工具-DateUtil

③ 日期时间对象-DateTime

④ 农历日期-ChineseDate

⑤ LocalDateTime工具-LocalDateTimeUtil

⑥ 计时器工具-TimeInterval

:::



## ① 概述

### 1 介绍

日期时间包是 Hutool 的核心包之一，提供针对 JDK 中 Date 和 Calendar 对象的封装



### 2 日期时间工具

- `DateUtil` 针对日期时间操作提供一系列静态方法。
- `DateTime` 提供类似于 `Joda-Time` 中日期时间对象的封装，继承自 `Date` 类，并提供更加丰富的对象方法。
- `FastDateFormat` 提供线程安全的针对 Date 对象的格式和日期字符串解析支持。此对象在实际使用中并不需要感知，相关操作已封装在 `DateUtil` 和 `DateTime` 的相关方法中。
- `DateBetween` 计算两个时间间隔的类，除了通过构造新对象外，相关操作也封装在 `DateUtil` 和 `DateTime` 的相关方法中。
- `TimeInterval` 一个简单的计时器类，常用于计算某段代码的执行时间，提供包括毫秒、秒、分、时、天、周等各种单位的花费时长计算，对象的静态构造已封装在 `DateUtil` 中。
- `DatePattern` 提供常用的日期格式化模式，包括 `String` 类型和 `FastDateFormat` 两种类型。



### 3 日期枚举

考虑到 Calendar 类中表示时间的字段（field）都是使用 int 表示，在使用中非常不方便，因此针对这些 int 字段，封装了与之对应的 Enum 枚举类，这些枚举类在 DateUtil 和 DateTime 相关方法中作为参数使用，可以更大限度的缩小参数限定范围。

这些定义的枚举值可以通过 `getValue()` 方法获得其与 Calendar 类对应的 int 值，通过 `of(int)` 方法从 Calendar 中 int  值转为枚举对象。

与 Calendar 对应的枚举：

- `Month` 表示月份，与 Calendar 中的 int 值`一一对应`
- `Week` 表示周，与 Calendar 中的 int 值`一一对应`



### 4 月份枚举

通过月份枚举可以获得某个月的最后一天

```sql
// 31
int lastDay = Month.of(Calendar.JANUARY).getLastDay(false);
```

另外，Hutool 还定义了季度枚举。`Season.SPRING` 为第一季度，表示 1~3月。季度的概念并不等同于季节，因为季节与月份并不对应，季度常用于统计概念。



### 5 时间枚举

时间枚举 `DateUnit` 主要表示某个时间单位对应的毫秒数，常用于计算时间差。

例如：`DateUnit.MINUTE` 表示分，也表示一分钟的毫秒数，可以通过调用其 `getMillis()` 方法获得其毫秒数。





## ② 日期时间工具-DateUtil



### 1 由来

考虑到 Java 本身对日期时间的支持有限，并且 Date 和 Calendar 对象的并存导致各种方法使用混乱和复杂，故使用此工具类做了封装。这其中的封装主要是日期和字符串之间的转换，以及提供对日期的定位（一个月前等等）。

对于 Date 对象，为了便捷，使用了一个 DateTime 类来代替之，继承自 Date 对象，主要的便利在于，覆盖了 `toString()` 方法，返回 `yyyy-MM-dd HH:mm:ss` 形式的字符串，方便再输出时调用（例如日志记录等），提供了众多便捷的方法对日期的对象操作，关于 DateTime 会在相关章节介绍。



### 2 方法

### Ⅰ 转换

① Date、long、Calendar 之间的相互转换

```java
//当前时间
Date date = DateUtil.date();
//当前时间
Date date2 = DateUtil.date(Calendar.getInstance());
//当前时间
Date date3 = DateUtil.date(System.currentTimeMillis());
//当前时间字符串，格式：yyyy-MM-dd HH:mm:ss
String now = DateUtil.now();
//当前日期字符串，格式：yyyy-MM-dd
String today= DateUtil.today();
```

② 字符串转日期

`DateUtil.parse`方法会自动识别一些常用格式，包括：

::: tip

```java
- yyyy-MM-dd HH:mm:ss
- yyyy/MM/dd HH:mm:ss
- yyyy.MM.dd HH:mm:ss
- yyyy年MM月dd日 HH时mm分ss秒
- yyyy-MM-dd
- yyyy/MM/dd
- yyyy.MM.dd
- HH:mm:ss
- HH时mm分ss秒
- yyyy-MM-dd HH:mm
- yyyy-MM-dd HH:mm:ss.SSS
- yyyyMMddHHmmss
- yyyyMMddHHmmssSSS
- yyyyMMdd
- EEE, dd MMM yyyy HH:mm:ss z
- EEE MMM dd HH:mm:ss zzz yyyy
- yyyy-MM-dd'T'HH:mm:ss'Z'
- yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
- yyyy-MM-dd'T'HH:mm:ssZ
- yyyy-MM-dd'T'HH:mm:ss.SSSZ
```

:::

字符串转化日期：

```java
String dateStr = "2017-03-01";
Date date = DateUtil.parse(dateStr);
```

我们也可以使用自定义日期格式转化;

```java
String dateStr = "2017-03-01";
Date date = DateUtil.parse(dateStr, "yyyy-MM-dd");
```



### Ⅱ 格式化日期输出

```java
String dateStr = "2017-03-01";
Date date = DateUtil.parse(dateStr);

//结果 2017/03/01
String format = DateUtil.format(date, "yyyy/MM/dd");

//常用格式的格式化，结果：2017-03-01
String formatDate = DateUtil.formatDate(date);

//结果：2017-03-01 00:00:00
String formatDateTime = DateUtil.formatDateTime(date);

//结果：00:00:00
String formatTime = DateUtil.formatTime(date);
```



### Ⅲ 获取 Date 对象的某个部分

```java
Date date = DateUtil.date();
//获得年的部分
DateUtil.year(date);
//获得月份，从0开始计数
DateUtil.month(date);
//获得月份枚举
DateUtil.monthEnum(date);
//.....
```



### Ⅳ 开始和结束时间

有的时候我们需要获得每天的开始时间、结束时间，每月的开始和结束时间等等，DateUtil 也提供了相关方法：

```java
String dateStr = "2017-03-01 22:33:23";
Date date = DateUtil.parse(dateStr);

//一天的开始，结果：2017-03-01 00:00:00
Date beginOfDay = DateUtil.beginOfDay(date);

//一天的结束，结果：2017-03-01 23:59:59
Date endOfDay = DateUtil.endOfDay(date);
```



### Ⅴ 日期时间偏移

① 日期或时间的偏移指针对某个日期增加或减少分、小时、天等等，达到日期变更的目的。Hutool 也针对其做了大量封装

```java
String dateStr = "2017-03-01 22:33:23";
Date date = DateUtil.parse(dateStr);

//结果：2017-03-03 22:33:23
Date newDate = DateUtil.offset(date, DateField.DAY_OF_MONTH, 2);

//常用偏移，结果：2017-03-04 22:33:23
DateTime newDate2 = DateUtil.offsetDay(date, 3);

//常用偏移，结果：2017-03-01 19:33:23
DateTime newDate3 = DateUtil.offsetHour(date, -3);
```

② 针对当前时间，提供了简化的偏移方法（例如昨天、上周、上个月等）

```java
//昨天
DateUtil.yesterday()
//明天
DateUtil.tomorrow()
//上周
DateUtil.lastWeek()
//下周
DateUtil.nextWeek()
//上个月
DateUtil.lastMonth()
//下个月
DateUtil.nextMonth()
```



### Ⅵ 日期时间差

有时候我们需要计算两个日期之间的时间差（相差天数、相差小时数等等），Hutool 将此类方法封装为 `between()` 方法

```java
String dateStr1 = "2017-03-01 22:33:23";
Date date1 = DateUtil.parse(dateStr1);

String dateStr2 = "2017-04-01 23:33:23";
Date date2 = DateUtil.parse(dateStr2);

//相差一个月，31天
long betweenDay = DateUtil.between(date1, date2, DateUnit.DAY);
```



### Ⅶ 格式化时间差

有时候我们希望看到易读的时间差，比如xx天xx小时xx分xx秒，此时使用 `DateUtil.formatBetween` 方法

```java
String dateStr1 = "2017-03-01 22:33:23";
Date date1 = DateUtil.parse(dateStr1);

String dateStr2 = "2017-04-01 23:34:23";
Date date2 = DateUtil.parse(dateStr2);

//Level.MINUTE表示精确到分
String formatBetween = DateUtil.formatBetween(date1, date2, BetweenFormatter.Level.MINUTE);
//输出：31天1小时1分
Console.log(formatBetween);
```



### Ⅷ 星座和属相

```java
// "摩羯座"
String zodiac = DateUtil.getZodiac(Month.JANUARY.getValue(), 19);

// "狗"
String chineseZodiac = DateUtil.getChineseZodiac(1994);
```



### Ⅸ 日期范围

```java
// 创建日期范围生成器
DateTime start = DateUtil.parse("2021-01-31");
DateTime end = DateUtil.parse("2021-03-31");
DateRange range = DateUtil.range(start, end, DateField.MONTH);

// 简单使用
// 开始时间
DateRange startRange = DateUtil.range(DateUtil.parse("2017-01-01"), DateUtil.parse("2017-01-31"), DateField.DAY_OF_YEAR);
// 结束时间
DateRange endRange = DateUtil.range(DateUtil.parse("2017-01-31"), DateUtil.parse("2017-02-02"), DateField.DAY_OF_YEAR);
// 交集 返回 [2017-01-31 00:00:00]
List<DateTime> dateTimes = DateUtil.rangeContains(startRange, endRange);
// 差集 返回 [2017-02-01 00:00:00, 2017-02-02 00:00:00]
List<DateTime> dateNotTimes = DateUtil.rangeNotContains(startRange,endRange);
// 区间 返回[2017-01-01 00:00:00, 2017-01-02 00:00:00, 2017-01-03 00:00:00]
List<DateTime> rangeToList = DateUtil.rangeToList(DateUtil.parse("2017-01-01"), DateUtil.parse("2017-01-03"), DateField.DAY_OF_YEAR);
```



Ⅹ 其他

```java
//年龄
DateUtil.ageOfNow("1990-01-30");

//是否闰年
DateUtil.isLeapYear(2017);
```





## ③ 日期事件对象-DateTime



### 1 由来

考虑工具类的属性，在某些情况下使用并不简便，于是 DateTime 类诞生。`DateTime` 对象充分吸取 `Joda-Time` 库的有点，并提供更多的便捷方法，这样我们在开发时不必再单独导入 Jada-Time 库便可以享受简单快速的日期时间处理过程。



### 2 说明

DateTime 类继承于 `java.util.Date` 类，为 Date 类扩展了众多便捷方法，这些方法多是 DateUtil 静态方法的对象表现形式，使用 DateTime 对象可以完全代替开发中 Date 对象的使用。



### 3 使用

### Ⅰ 新建对象

`DateTime` 对象包含众多的构造方法，构造方法支持的参数有：

- Date
- Calendar
- String(日期字符串，第二个参数是日期格式)
- long 毫秒数

构建对象有两种方式：`DateTime.of()` 和 `new DateTime()` ：

```java
Date date = new Date();
		
//new方式创建
DateTime time = new DateTime(date);
Console.log(time);

//of方式创建
DateTime dt = DateTime.of(date);
DateTime now = DateTime.now();
```



### Ⅱ 使用对象

DateTime 的成员方法与 DateUtil 中的静态方法所对应，因为是成员方法，因此可以使用更少的参数操作日期时间。

示例：获取日期成员（年、月、日等）

```java
DateTime dateTime = new DateTime("2017-01-05 12:34:23", DatePattern.NORM_DATETIME_FORMAT);
		
//年，结果：2017
int year = dateTime.year();

//季度（非季节），结果：Season.SPRING
Season season = dateTime.seasonEnum();

//季度（非季节），结果：Q1  (5.8.25)
Quarter quarter = dateTime.quarterEnum();

//月份，结果：Month.JANUARY
Month month = dateTime.monthEnum();

//日，结果：5
int day = dateTime.dayOfMonth();
```



### Ⅲ 对象的可变性

DateTime 对象默认是可变对象（调用 `offset、setField、setTime` 方法默认变更自身），但是这种可变性有时候会引起很多问题（例如多个地方共用 DateTime 对象）。我们可以调用 `setMutable(false)` 方法使其变为不可变对象。在不可变模式下， `offset、setField、setTime`  方法返回一个新对象，`setTime` 方法抛出异常。

```java
DateTime dateTime = new DateTime("2017-01-05 12:34:23", DatePattern.NORM_DATETIME_FORMAT);

//默认情况下DateTime为可变对象，此时offset == dateTime
DateTime offset = dateTime.offset(DateField.YEAR, 0);

//设置为不可变对象后变动将返回新对象，此时offset != dateTime
dateTime.setMutable(false);
offset = dateTime.offset(DateField.YEAR, 0);
```



### Ⅳ 格式化字符串

调用 `toString()` 方法即可返回格式为 `yyyy-MM-dd HH:mm:ss` 的字符串，调用 `toString(String format)` 可以返回制定格式的字符串。

```java
DateTime dateTime = new DateTime("2017-01-05 12:34:23", DatePattern.NORM_DATETIME_FORMAT);
//结果：2017-01-05 12:34:23
String dateStr = dateTime.toString();

//结果：2017/01/05
String dateStr = dateTime.toString("yyyy/MM/dd");
```
