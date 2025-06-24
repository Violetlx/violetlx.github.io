---
title: 作业
date: 2025/03/06
---

![小猫 可爱的 极简主义者 迷人 可爱的](https://bizhi1.com/wp-content/uploads/2024/11/kitten-3840x2160-adorable-minimalist-charming-cute.jpg)

::: tip

1 服务拆分

2 商品查询接口

3 数据同步

:::

## 1 服务拆分

搜索业务并发压力可能会比较高，目前与商品服务在一起，不方便后期优化。

**需求**：创建一个新的微服务，命名为`search-service`，将搜索相关功能抽取到这个微服务中





## 2 商品查询接口

在`item-service`服务中提供一个根据id查询商品的功能，并编写对应的FeignClient





## 3 数据同步

每当商品服务对商品实现增删改时，索引库的数据也需要同步更新。

**提示**：可以考虑采用MQ异步通知实现。