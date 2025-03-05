---
title: 短信登录
date: 2025/02/12
---

![八重美子原神冲击花朵桌面壁纸4K](https://bizhi1.com/wp-content/uploads/2025/02/yae-miko-genshin-impact-blossoms-desktop-wallpaper-4k.jpg)

::: tip

① 导入黑马点评项目

② 基于 Session 实现登录流程

③ 实现发送短信验证码功能

④ 实现登录拦截功能

⑤ 隐藏用户敏感信息

⑥ Session 共享问题

⑦ Redis 代替 session 的业务流程

⑧ 基于 Redis 实现短信登录

⑨ 解决状态登录刷新问题

:::



## ① 导入黑马点评项目



### 1 导入SQL

![image-20250213093429126](images/2-Redis_Actual/image-20250213093429126.png)



### 2 有关当前模型

手机或者 app 端发起请求，请求我们 nginx 服务器，nginx 基于七层模型走的是 HTTP 协议，可以实现基于 Lua 直接绕开 tomcat 访问 redis ，也可以作为静态资源服务器，轻松抗下上万并发，负载均衡到下游 tomcat 服务器，打散流量，我们都知道一台 4 核 8G 的 tomcat，在优化和处理简单业务的加持下，大不了就处理 1000 左右的并发，经过 nginx 的负载均衡后，利用集群支撑起整个项目，同时 nginx 是整个项目中重要的一环。

在 tomcat 支撑起并发流量后，我们如果让 tomcat 直接去访问 Mysql ，根据经验 Mysql 企业级服务器只要上点并发，一般是 16 或 32 核心 cpu，32 或 64 内存，像企业级 mysql 加上固态硬盘能够支撑的并发，大概就是 4000~7000 左右，上万并发，瞬间就会让 Mysql 服务器的 cpu ，硬盘全部打满，容易崩溃，所有我们在高并发场景下，会选择使用 mysql 集群，同时为了进一步降低 mysql 的压力，同时增加访问的性能，我们也会加入 redis ，同时使用 Redis 集群使得 Redis 对外提供更好的服务。

![image-20250213094427957](images/2-Redis_Actual/image-20250213094427957.png)



### 3 导入后端项目

![image-20250213094458135](images/2-Redis_Actual/image-20250213094458135.png)



### 4 导入前端项目

![image-20250213101042719](images/2-Redis_Actual/image-20250213101042719.png)



### 5 运行前端项目

![image-20250213101611251](images/2-Redis_Actual/image-20250213101611251.png)





## ② 基于Session实现登录流程

**发送验证码：**

用户在提交手机后，会校验手机号是否合法，如果不合法，则要求用户重新输入手机号

如果手机号合法，后台此时生成对应的验证码，同时将验证码进行保存，然后再通过短信的方式将验证码发送给用户

**短信验证码登陆和注册：**

用户将验证码和手机号进行输入，后台从 session 中拿到当前验证码，然后和用户输入的验证码进行校验，如果不一致，则无法通过校验，如果一致，则后台根据手机号查询用户，如果用户不存在，则为用户创建账号信息，无论是否存在，都会将用户信息保存到 session 中，方便后续获得当前登录信息

**校验登录状态：**

用户在请求时候，会从 cookie 中携带者 JsessionId 到后台，后台通过 Jession 中拿到用户信息，如果没有 session 信息，则进行拦截，如果由用户信息，则会将用户信息保存到 threadLocal 中，并且放行

![image-20250213102802532](images/2-Redis_Actual/image-20250213102802532.png)





## ③ 实现发送短信验证码功能

**页面流程**

![image-20250213121017074](images/2-Redis_Actual/image-20250213121017074.png)

**具体代码如下**

**贴心小提示：**

具体逻辑上文已经分析，我们仅仅只需按照提示的逻辑写出代码即可。

- 发送验证码


```java
    @Override
    public Result sendCode(String phone, HttpSession session) {
        // 1.校验手机号
        if (RegexUtils.isPhoneInvalid(phone)) {
            // 2.如果不符合，返回错误信息
            return Result.fail("手机号格式错误！");
        }
        // 3.符合，生成验证码
        String code = RandomUtil.randomNumbers(6);

        // 4.保存验证码到 session
        session.setAttribute("code",code);
        // 5.发送验证码
        log.debug("发送短信验证码成功，验证码：{}", code);
        // 返回ok
        return Result.ok();
    }
```

- 登录

```java
    @Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        // 1.校验手机号
        String phone = loginForm.getPhone();
        if (RegexUtils.isPhoneInvalid(phone)) {
            // 2.如果不符合，返回错误信息
            return Result.fail("手机号格式错误！");
        }
        // 3.校验验证码
        Object cacheCode = session.getAttribute("code");
        String code = loginForm.getCode();
        if(cacheCode == null || !cacheCode.toString().equals(code)){
             //3.不一致，报错
            return Result.fail("验证码错误");
        }
        //4.一致，根据手机号查询用户
        User user = query().eq("phone", phone).one();

        //5.判断用户是否存在
        if(user == null){
            //6.不存在，则创建
            user =  createUserWithPhone(phone);
        }
        //7.保存用户信息到session中
        session.setAttribute("user",user);

        return Result.ok();
    }

    /**
     * 创建用户
     */
    private User createUserWithPhone(String phone) {
        // 1.创建用户
        User user = new User();
        user.setPhone(phone);
        user.setNickName(USER_NICK_NAME_PREFIX + RandomUtil.randomString(10));
        // 2.保存用户
        save(user);
        return user;
    }
```



## ④ 实现登录拦截功能

**温馨小贴士：tomcat的运行原理**

![image-20250213144853599](images/2-Redis_Actual/image-20250213144853599.png)

当用户发起请求时，会访问我们像 tomcat 注册的端口，任何程序想要运行，都需要有一个线程对当前端口号进行监听，tomcat 也不例外，当监听线程知道用户想要和 tomcat 建立连接时，那会由监听线程创建 socket 连接，socket 都是成对出现的，用户通过 socket 互相传递数据，当 tomcat 端的 socket 接收到数据后，此时监听线程会从 tomcat 的线程池中取出一个线程执行用户请求，在我们的服务部署到 tomcat 后，线程会找到用户想要访问的工程，然后用这个线程转发到工程中的 controller、service、dao 中，并且访问对应的 DB ，在用户执行完请求后，再统一返回，再找到 tomcat 端的 socket ，再将数据写回到用户端的 socket，完成请求和响应。

通过以上讲解，我们可以得知，每个用户其实对应都是去找 tomcat 线程池中的一个线程来完成工作，使用完成后再进行回收，既然每个请求都是独立的，所以在每个用户去访问我们的工程时，我们可以使用 threadLoacl 来做到线程隔离，每个线程操作自己的一份数据。

**温馨小贴士：关于 threadLocal**

如果小伙伴们看过 threadLocal 的源码，你会发现在 threadLocal 中，无论是他的 put 方法和他的 get 方法，都是先从获得当前用户的线程，然后从线程中取出线程的成员变量 map，只要线程不一样，map 就不一样，所以可以通过这种方式来做到线程隔离。





![image-20250213151739501](images/2-Redis_Actual/image-20250213151739501.png)

**拦截器代码**

```java
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
       //1.获取session
        HttpSession session = request.getSession();
        //2.获取session中的用户
        Object user = session.getAttribute("user");
        //3.判断用户是否存在
        if(user == null){
              //4.不存在，拦截，返回401状态码
              response.setStatus(401);
              return false;
        }
        //5.存在，保存用户信息到Threadlocal
        UserHolder.saveUser((User)user);
        //6.放行
        return true;
    }
}
```

**让拦截器生效**

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 登录拦截器
        registry.addInterceptor(new LoginInterceptor())
                .excludePathPatterns(
                        "/shop/**",
                        "/voucher/**",
                        "/shop-type/**",
                        "/upload/**",
                        "/blog/hot",
                        "/user/code",
                        "/user/login"
                ).order(1);
        // token刷新的拦截器
        registry.addInterceptor(new RefreshTokenInterceptor(stringRedisTemplate)).addPathPatterns("/**").order(0);
    }
}
```





## ⑤ 隐藏用户敏感信息

我们通过浏览器观察到此时用户的全部信息都在，这样极为不靠谱，所以我们应当在返回用户信息之前，将用户的敏感信息进行隐藏，采用的核心思路就是书写一个 UserDto 对象，这个 UserDto 对象就没有敏感信息了，我们在返回前，将有用户敏感信息的 User 对象转化成没有敏感信息的 UserDto 对象，那么就能够避免这个尴尬的问题了

**UserDTO**

```java
package com.redis.domain.dto;

import lombok.Data;

/**
 * @author 1045754
 */
@Data
public class UserDTO {
    private Long id;
    private String nickName;
    private String icon;
}
```

**在登录方法出修改**

```java
//7.保存用户信息到session中
session.setAttribute("user", BeanUtils.copyProperties(user,UserDTO.class));
```

**在拦截器处：**

```java
//5.存在，保存用户信息到Threadlocal
UserHolder.saveUser((UserDTO) user);
```

**在 UserHolder 处：将 User 对象转换成 UserDTO**

```java
public class UserHolder {
    private static final ThreadLocal<UserDTO> tl = new ThreadLocal<>();

    public static void saveUser(UserDTO user){
        tl.set(user);
    }

    public static UserDTO getUser(){
        return tl.get();
    }

    public static void removeUser(){
        tl.remove();
    }
}
```



## ⑥ Session共享问题

**核心思路分析：**

每个 tomcat 中都有一份属于自己的 session ，假设用户第一次访问第一台 tomcat ，并且把自己的信息存放到第一台服务器的 session 中，但是第二次这个用户访问到了第二台 tomcat，那么在第二台服务器上，肯定没有第一台服务器存放的 session，所以此时整个登录拦截功能就会出现问题，我们如何解决这个问题呢？早期的方案是 session 拷贝，就是说每个 tomcat 上都有不同的 session，但是每当任意一台服务器的 session 修改时，都会同步给其他的 tomcat 服务器的 session，这样的话，就可以实现 session 共享了

但是这种方案具有两个大问题

1.  每台服务器中都有完整的一份 session 数据，服务器压力过大
2. session 拷贝数据时，可能会出现延迟

所以咱们后面采用的方案都是基于 redis 来完成，我们把 session 换成 redis，redis 数据本身就是共享的，就可以避免 session 共享的问题了

![image-20250213170037629](images/2-Redis_Actual/image-20250213170037629.png)



## ⑦ Redis代替session的业务流程

### 1 设计key的结构

首先我们要思考一下利用 redis 来存储数据，那么到底使用哪种结构呢？由于存入的数据比较简单，我们可以考虑使用 String，或者是使用哈希，如下图，如果使用 String，同学们注意他的 value，会多占用一点空间，如果使用哈希，则他的 value 中只会存储他数据本身，如果不是特别在意内存，其实是用 String 就可以了。

![image-20250213170724279](images/2-Redis_Actual/image-20250213170724279.png)



### 2 设计key的具体细节

所以我们可以使用 String 结构，就是一个简单的 key、value 键值对的方式，但是关于 key 的处理，sessuib 他是每个用户都有自己的 session，但是 redis 的 key 是共享的，咱们就不能使用 code 了。

在设计这个 key 的时候，我们之前讲过需要满足两点：

1. key 要具有唯一性
2. key 要方便携带

如果我们采用 phone：手机号这个数据来存储当然是可以的，但是如果把这样的敏感数据存储到 redis 中并且从页面带过来毕竟不太合适，所以我们在后台生成一个随机 token，然后让前端带来这个 token 就能完成我们的整体逻辑了

![image-20250213172332663](images/2-Redis_Actual/image-20250213172332663.png)



### 3 整体访问流程

当注册完成后，用户去登录会去校验用户提交的手机号和验证码，是否一致，如果一致，则根据手机号查询用户信息，不存在则新建，最后将用户数据保存到 redis，并且生成 token 作为 redis 的 key ，当我们校验用户是否登录时，会去携带着 token 进行访问，从 redis 中取出 token 对应的 value，判断是否存在这个数据，如果没有则拦截，如果存在则将其保存到 threadLocal 中，并且放行。



## ⑧ 基于Redis实现短信登录

**发送验证码**

```java
    /**
     * 发送验证码
     * @param phone String
     * @param session HttpSession
     * @return Result
     */
    @Override
    public Result sendCode(String phone, HttpSession session) {
        // 1.校验手机号
        if (RegexUtils.isPhoneInvalid(phone)) {
            // 2.如果不符合，返回错误信息
            return Result.fail("手机号格式错误！");
        }
        // 3.符合，生成验证码
        String code = RandomUtil.randomNumbers(6);

        // 4.保存验证码到 session

        session.setAttribute("sessionCode", code);
        //放到Redis里面  1、加一个业务前缀以示区分 2、给key设置有效期(验证码有效期)
        stringRedisTemplate.opsForValue().set(LOGIN_CODE_KEY + phone, code, LOGIN_CODE_TTL, TimeUnit.MINUTES);

        // 5.发送验证码
        log.debug("发送短信验证码成功，验证码：{} "+ code);
        // 返回ok
        return Result.ok();
    }
```

**登录功能**

```java
    /**
     * 登录功能
     * @param loginForm 登录参数，包含手机号、验证码
     * @return 登录结果
     */
    @Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        //独立的校验,可能出现发送验证码的时候,是一个手机号,登录的时候又是一个手机号

        // 1.校验手机号
        String phone = loginForm.getPhone();
        if (RegexUtils.isPhoneInvalid(phone)) {
            // 2.如果不符合，返回错误信息
            return Result.fail("手机号格式错误！");
        }
        // 3.从redis获取验证码并校验
        //session
        Object cacheSessionCode = session.getAttribute("sessionCode");
        System.out.println("sessionCode ===> " + cacheSessionCode);

        String cacheCode = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + phone);
        String code = loginForm.getCode();
        if (cacheCode == null || !cacheCode.equals(code)) {
            // 不一致，报错
            return Result.fail("验证码错误");
        }

        //反向校验可以避免if嵌套越来越深

        // 4.一致，根据手机号查询用户 select * from tb_user where phone = ?
//        User user = query().eq("phone", phone).one();
        //手机号是唯一的
        User user = this.getOne(Wrappers.lambdaQuery(User.class)
                .eq(User::getPhone, phone));

        // 5.判断用户是否存在
        if (user == null) {
            // 6.不存在，创建新用户并保存
            user = createUserWithPhone(phone);
        }

        //保存到session
        session.setAttribute("user", user);
        Object sessionUser = session.getAttribute("user");
        System.out.println("sessionUser:" + sessionUser);

        // 7.保存用户信息到 redis中
        // 7.1.随机生成token，作为登录令牌
        String token = UUID.randomUUID().toString(true);
        // 7.2.将User对象转为HashMap存储
        UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);
        Map<String, Object> userMap = BeanUtil.beanToMap(userDTO, new HashMap<>(),
                CopyOptions.create()
                        .setIgnoreNullValue(true)
                        .setFieldValueEditor((fieldName, fieldValue) -> fieldValue.toString()));

        System.out.println("userMap ===> " + userMap);

        // 7.3.存储
        String tokenKey = LOGIN_USER_KEY + token;
        stringRedisTemplate.opsForHash().putAll(tokenKey, userMap);
        // 7.4.设置token有效期
        stringRedisTemplate.expire(tokenKey, LOGIN_USER_TTL, TimeUnit.MINUTES);

        // 8.返回token
        return Result.ok(token);
    }
```

**总结：**

Redis 代替 session 需要考虑的问题：

- 选择合适的数据结构
- 选择合适的 key
- 选择合适的存储粒度





## ⑨ 解决状态登录刷新问题

### 1 初始方案思路总结

在这个方案中，他确实可以使用对应路径的拦截，同时刷新登录 token 令牌的存活时间，但是现在这个拦截器他只是拦截需要拦截的路径，假设当前用户访问了一些不需要拦截的路径，那么这个拦截器就不会生效，所以此时令牌刷新的动作就不会执行，所以这个方案它是存在问题的

![image-20250214094734754](images/2-Redis_Actual/image-20250214094734754.png)



### 2 优化方案

既然之前的拦截器无法对不需要拦截的路径生效，那么我们可以添加一个拦截器，在第一个拦截器中拦截所有路径，把第二个拦截器做的事情放入到第一个拦截器中，同时刷新令牌，因为第一个拦截器有了 threadLocal 的数据，所以此时第二个拦截器只需要判断拦截器中的 User 对象是否存在即可，完成整体刷新功能

![image-20250214095005978](images/2-Redis_Actual/image-20250214095005978.png)



### 3 代码

**RefreshTokenInterceptor**

```java
public class RefreshTokenInterceptor implements HandlerInterceptor {

    private StringRedisTemplate stringRedisTemplate;

    public RefreshTokenInterceptor(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1.获取请求头中的token
        String token = request.getHeader("authorization");
        if (StrUtil.isBlank(token)) {
            return true;
        }
        // 2.基于TOKEN获取redis中的用户
        String key  = LOGIN_USER_KEY + token;
        Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(key);
        // 3.判断用户是否存在
        if (userMap.isEmpty()) {
            return true;
        }
        // 5.将查询到的hash数据转为UserDTO
        UserDTO userDTO = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);
        // 6.存在，保存用户信息到 ThreadLocal
        UserHolder.saveUser(userDTO);
        // 7.刷新token有效期
        stringRedisTemplate.expire(key, LOGIN_USER_TTL, TimeUnit.MINUTES);
        // 8.放行
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 移除用户
        UserHolder.removeUser();
    }
}
```



**LoginInterceptor**

```java
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1.判断是否需要拦截（ThreadLocal中是否有用户）
        if (UserHolder.getUser() == null) {
            // 没有，需要拦截，设置状态码
            response.setStatus(401);
            // 拦截
            return false;
        }
        // 有用户，则放行
        return true;
    }
}
```























































































































