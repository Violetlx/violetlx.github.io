---
title: Hutool-Core核心（三）
date: 2024/12/19
---

![阿尔卑斯山山谷树木自然森林5K](https://bizhi1.com/wp-content/uploads/2024/11/Alps_Mountain_Valley_Tree_Nature_Forest_5K-Wallpaper_5120x2880.jpg)

## 日期和时间

::: tip

① 概述

② 日期时间工具-DateUtil

③ 日期时间对象-DateTime

④ 农历日期-ChineseDate

⑤ LocalDateTime工具-LocalDateTimeUtil

⑥ 计时器工具-TimeInterval

:::



## ④ 农历日期-ChineseDate



### 1 介绍

农历日期，提供了生肖、天干地支、传统节日等方法。



### 2 使用

① 构建 `ChinesDate` 对象

 `ChinesDate` 表示了农历的对象构建此对象既可以使用公历的日期，也可以使用农历的日期。

```java
//通过农历构建
ChineseDate chineseDate = new ChineseDate(1992,12,14);

//通过公历构建
ChineseDate chineseDate = new ChineseDate(DateUtil.parseDate("1993-01-06"));
```

② 基本使用

```java
//通过公历构建
ChineseDate date = new ChineseDate(DateUtil.parseDate("2020-01-25"));
// 一月
date.getChineseMonth();
// 正月
date.getChineseMonthName();
// 初一
date.getChineseDay();
// 庚子
date.getCyclical();
// 生肖：鼠
date.getChineseZodiac();
// 传统节日（部分支持，逗号分隔）：春节
date.getFestivals();
// 庚子鼠年 正月初一
date.toString();
```



### 3 获取天干地支

从 `5.4.1` 开始，Hutool 支持天干地支的获取：

```java
//通过公历构建
ChineseDate chineseDate = new ChineseDate(DateUtil.parseDate("2020-08-28"));

// 庚子年甲申月癸卯日
String cyclicalYMD = chineseDate.getCyclicalYMD();
```





## ⑤ LocalDateTime工具-LocalDateTimeUtil



### 1 介绍

从 Hutool 的 5.4x 开始，Hutool 加入了针对 JDK8+ 日期 API 的封装，此工具类的功能包括 LocalDateTime 和 LocalDate 的解析、格式化、转换等操作。



### 2 使用

### Ⅰ日期转换

```java
String dateStr = "2020-01-23T12:23:56";
DateTime dt = DateUtil.parse(dateStr);

// Date对象转换为LocalDateTime
LocalDateTime of = LocalDateTimeUtil.of(dt);

// 时间戳转换为LocalDateTime
of = LocalDateTimeUtil.ofUTC(dt.getTime());
```



### Ⅱ 日期字符串解析

```java
// 解析ISO时间
LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");


// 解析自定义格式时间
localDateTime = LocalDateTimeUtil.parse("2020-01-23", DatePattern.NORM_DATE_PATTERN);
```

解析同样支持 `LocalDate`

```java
LocalDate localDate = LocalDateTimeUtil.parseDate("2020-01-23");

// 解析日期时间为LocalDate，时间部分舍弃
localDate = LocalDateTimeUtil.parseDate("2020-01-23T12:23:56", DateTimeFormatter.ISO_DATE_TIME);
```



### Ⅲ 日期格式化

```java
LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");

// "2020-01-23 12:23:56"
String format = LocalDateTimeUtil.format(localDateTime, DatePattern.NORM_DATETIME_PATTERN);
```



### Ⅳ 日期偏移

```java
final LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");

// 增加一天
// "2020-01-24T12:23:56"
LocalDateTime offset = LocalDateTimeUtil.offset(localDateTime, 1, ChronoUnit.DAYS);
```

如果是减少时间，offset 第二个参数传负数即可：

```java
// "2020-01-22T12:23:56"
offset = LocalDateTimeUtil.offset(localDateTime, -1, ChronoUnit.DAYS);
```



### Ⅴ 计算时间间隔

```java
LocalDateTime start = LocalDateTimeUtil.parse("2019-02-02T00:00:00");
LocalDateTime end = LocalDateTimeUtil.parse("2020-02-02T00:00:00");

Duration between = LocalDateTimeUtil.between(start, end);

// 365
between.toDays();
```



### Ⅵ 一天的开始和结束

```java
LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");

// "2020-01-23T00:00"
LocalDateTime beginOfDay = LocalDateTimeUtil.beginOfDay(localDateTime);

// "2020-01-23T23:59:59.999999999"
LocalDateTime endOfDay = LocalDateTimeUtil.endOfDay(localDateTime);
```





## ⑥ 计时器工具-TimeInterval



### 1 介绍

Hutool 通过封装 `TimeInterval` 实现计时器功能，即可以计算方法或过程执行的时间。

`TimeInterval` 支持分组计时，方便对比时间。



### 2 使用

```java
TimeInterval timer = DateUtil.timer();

//---------------------------------
//-------这是执行过程
//---------------------------------

timer.interval();//花费毫秒数
timer.intervalRestart();//返回花费时间，并重置开始时间
timer.intervalMinute();//花费分钟数
```

也可以实现分组计时：

```java
final TimeInterval timer = new TimeInterval();

// 分组1
timer.start("1");
ThreadUtil.sleep(800);

// 分组2
timer.start("2");
ThreadUtil.sleep(900);

Console.log("Timer 1 took {} ms", timer.intervalMs("1"));
Console.log("Timer 2 took {} ms", timer.intervalMs("2"));
```
