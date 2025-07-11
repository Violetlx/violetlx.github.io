---
title: 并发编程进阶
date: 2025/06/20
---

![七海深奈实4K壁纸](https://bizhi1.com/wp-content/uploads/2024/03/bizhi1-09-anime-small.jpg)

欢迎来到JUC学习的最后一章，王炸当然是放在最后了。

## 线程池

在我们的程序中，多多少少都会用到多线程技术，而我们以往都是使用Thread类来创建一个新的线程：

```java
public static void main(String[] args) {
    Thread t = new Thread(() -> System.out.println("Hello World!"));
    t.start();
}
```

利用多线程，我们的程序可以更加合理地使用CPU多核心资源，在同一时间完成更多的工作。但是，如果我们的程序频繁地创建线程，由于线程的创建和销毁也需要占用系统资源，因此这样会降低我们整个程序的性能，那么怎么做，才能更高效地使用多线程呢？

我们其实可以将已创建的线程复用，利用池化技术，就像数据库连接池一样，我们也可以创建很多个线程，然后反复地使用这些线程，而不对它们进行销毁。

虽然听起来这个想法比较新颖，但是实际上线程池早已利用到各个地方，比如我们的Tomcat服务器，要在同一时间接受和处理大量的请求，那么就必须要在短时间内创建大量的线程，结束后又进行销毁，这显然会导致很大的开销，因此这种情况下使用线程池显然是更好的解决方案。

由于线程池可以反复利用已有线程执行多线程操作，所以它一般是有容量限制的，当所有的线程都处于工作状态时，那么新的多线程请求会被阻塞，直到有一个线程空闲出来为止，实际上这里就会用到我们之前讲解的阻塞队列。

所以我们可以暂时得到下面一个样子：

![image-20230306172249412](https://oss.itbaima.cn/internal/markdown/2023/03/06/ogcqAkahnWYByE2.png)

当然，JUC提供的线程池肯定没有这么简单，接下来就让我们深入进行了解。

### 线程池的使用

我们可以直接创建一个新的线程池对象，它已经提前帮助我们实现好了线程的调度机制，我们先来看它的构造方法：

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.acc = System.getSecurityManager() == null ?
            null :
            AccessController.getContext();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

参数稍微有一点多，这里我们依次进行讲解：

* corePoolSize：**核心线程池大小**，我们每向线程池提交一个多线程任务时，都会创建一个新的`核心线程`，无论是否存在其他空闲线程，直到到达核心线程池大小为止，之后会尝试复用线程资源。当然也可以在一开始就全部初始化好，调用` prestartAllCoreThreads()`即可。
* maximumPoolSize：**最大线程池大小**，当目前线程池中所有的线程都处于运行状态，并且等待队列已满，那么就会直接尝试继续创建新的`非核心线程`运行，但是不能超过最大线程池大小。
* keepAliveTime：**线程最大空闲时间**，当一个`非核心线程`空闲超过一定时间，会自动销毁。
* unit：**线程最大空闲时间的时间单位**
* workQueue：**线程等待队列**，当线程池中核心线程数已满时，就会将任务暂时存到等待队列中，直到有线程资源可用为止，这里可以使用我们上一章学到的阻塞队列。
* threadFactory：**线程创建工厂**，我们可以干涉线程池中线程的创建过程，进行自定义。
* handler：**拒绝策略**，当等待队列和线程池都没有空间了，真的不能再来新的任务时，来了个新的多线程任务，那么只能拒绝了，这时就会根据当前设定的拒绝策略进行处理。

最为重要的就是线程池大小的限定了，这个也是很有学问的，合理地分配大小会使得线程池的执行效率事半功倍：

* 首先我们可以分析一下，线程池执行任务的特性，是CPU 密集型还是 IO 密集型
  * **CPU密集型：** 主要是执行计算任务，响应时间很快，CPU一直在运行，这种任务CPU的利用率很高，那么线程数应该是根据 CPU 核心数来决定，CPU 核心数 = 最大同时执行线程数，以 i5-9400F 处理器为例，CPU 核心数为 6，那么最多就能同时执行 6 个线程。
  * **IO密集型：** 主要是进行 IO 操作，因为执行 IO 操作的时间比较较长，比如从硬盘读取数据之类的，CPU就得等着IO操作，很容易出现空闲状态，导致 CPU 的利用率不高，这种情况下可以适当增加线程池的大小，让更多的线程可以一起进行IO操作，一般可以配置为CPU核心数的2倍。

这里我们手动创建一个新的线程池看看效果：

```java
public static void main(String[] args) throws InterruptedException {
    ThreadPoolExecutor executor =
            new ThreadPoolExecutor(2, 4,   //2个核心线程，最大线程数为4个
                    3, TimeUnit.SECONDS,        //最大空闲时间为3秒钟
                    new ArrayBlockingQueue<>(2));     //这里使用容量为2的ArrayBlockingQueue队列

    for (int i = 0; i < 6; i++) {   //开始6个任务
        int finalI = i;
        executor.execute(() -> {
            try {
                System.out.println(Thread.currentThread().getName()+" 开始执行！（"+ finalI);
                TimeUnit.SECONDS.sleep(1);
                System.out.println(Thread.currentThread().getName()+" 已结束！（"+finalI);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
    }

    TimeUnit.SECONDS.sleep(1);    //看看当前线程池中的线程数量
    System.out.println("线程池中线程数量："+executor.getPoolSize());
    TimeUnit.SECONDS.sleep(5);     //等到超过空闲时间
    System.out.println("线程池中线程数量："+executor.getPoolSize());

    executor.shutdownNow();    //使用完线程池记得关闭，不然程序不会结束，它会取消所有等待中的任务以及试图中断正在执行的任务，关闭后，无法再提交任务，一律拒绝
  	//executor.shutdown();     同样可以关闭，但是会执行完等待队列中的任务再关闭
}
```

这里我们创建了一个核心容量为2，最大容量为4，等待队列长度为2，空闲时间为3秒的线程池，现在我们向其中执行6个任务，每个任务都会进行1秒钟休眠，那么当线程池中2个核心线程都被占用时，还有4个线程就只能进入到等待队列中了，但是等待队列中只有2个容量，这时紧接着的2个任务，线程池将直接尝试创建线程，由于不大于最大容量，因此可以成功创建。最后所有线程完成之后，在等待5秒后，超过了线程池的最大空闲时间，`非核心线程`被回收了，所以线程池中只有2个线程存在。

那么要是等待队列设定为没有容量的SynchronousQueue呢，这个时候会发生什么？

```java
pool-1-thread-1 开始执行！（0
pool-1-thread-4 开始执行！（3
pool-1-thread-3 开始执行！（2
pool-1-thread-2 开始执行！（1
Exception in thread "main" java.util.concurrent.RejectedExecutionException: Task com.test.Main$$Lambda$1/1283928880@682a0b20 rejected from java.util.concurrent.ThreadPoolExecutor@3d075dc0[Running, pool size = 4, active threads = 4, queued tasks = 0, completed tasks = 0]
	at java.util.concurrent.ThreadPoolExecutor$AbortPolicy.rejectedExecution(ThreadPoolExecutor.java:2063)
	at java.util.concurrent.ThreadPoolExecutor.reject(ThreadPoolExecutor.java:830)
	at java.util.concurrent.ThreadPoolExecutor.execute(ThreadPoolExecutor.java:1379)
	at com.test.Main.main(Main.java:15)
```

可以看到，前4个任务都可以正常执行，但是到第五个任务时，直接抛出了异常，这其实就是因为等待队列的容量为0，相当于没有容量，那么这个时候，就只能拒绝任务了，拒绝的操作会根据拒绝策略决定。

线程池的拒绝策略默认有以下几个：

* AbortPolicy(默认)：像上面一样，直接抛异常。
* CallerRunsPolicy：直接让提交任务的线程运行这个任务，比如在主线程向线程池提交了任务，那么就直接由主线程执行。
* DiscardOldestPolicy：丢弃队列中最近的一个任务，替换为当前任务。
* DiscardPolicy：什么也不用做。

这里我们进行一下测试：

```java
public static void main(String[] args) throws InterruptedException {
    ThreadPoolExecutor executor =
            new ThreadPoolExecutor(2, 4,
                    3, TimeUnit.SECONDS,
                    new SynchronousQueue<>(),
                    new ThreadPoolExecutor.CallerRunsPolicy());   //使用另一个构造方法，最后一个参数传入策略，比如这里我们使用了CallerRunsPolicy策略
```

CallerRunsPolicy策略是谁提交的谁自己执行，所以：

```java
pool-1-thread-1 开始执行！（0
pool-1-thread-2 开始执行！（1
main 开始执行！（4
pool-1-thread-4 开始执行！（3
pool-1-thread-3 开始执行！（2
pool-1-thread-3 已结束！（2
pool-1-thread-2 已结束！（1
pool-1-thread-1 已结束！（0
main 已结束！（4
pool-1-thread-4 已结束！（3
pool-1-thread-1 开始执行！（5
pool-1-thread-1 已结束！（5
线程池中线程数量：4
线程池中线程数量：2
```

可以看到，当队列塞不下时，直接在主线程运行任务，运行完之后再继续向下执行。

我们吧策略修改为DiscardOldestPolicy试试看：

```java
public static void main(String[] args) throws InterruptedException {
    ThreadPoolExecutor executor =
            new ThreadPoolExecutor(2, 4,
                    3, TimeUnit.SECONDS,
                    new ArrayBlockingQueue<>(1),    //这里设置为ArrayBlockingQueue，长度为1
                    new ThreadPoolExecutor.DiscardOldestPolicy());   
```

它会移除等待队列中的最近的一个任务，所以可以看到有一个任务实际上是被抛弃了的：

```
pool-1-thread-1 开始执行！（0
pool-1-thread-4 开始执行！（4
pool-1-thread-3 开始执行！（3
pool-1-thread-2 开始执行！（1
pool-1-thread-1 已结束！（0
pool-1-thread-4 已结束！（4
pool-1-thread-1 开始执行！（5
线程池中线程数量：4
pool-1-thread-3 已结束！（3
pool-1-thread-2 已结束！（1
pool-1-thread-1 已结束！（5
线程池中线程数量：2
```

比较有意思的是，如果选择没有容量的SynchronousQueue作为等待队列会爆栈：

```java
pool-1-thread-1 开始执行！（0
pool-1-thread-3 开始执行！（2
pool-1-thread-2 开始执行！（1
pool-1-thread-4 开始执行！（3
Exception in thread "main" java.lang.StackOverflowError
	at java.util.concurrent.SynchronousQueue.offer(SynchronousQueue.java:912)
	at java.util.concurrent.ThreadPoolExecutor.execute(ThreadPoolExecutor.java:1371)	
	...
pool-1-thread-1 已结束！（0
pool-1-thread-2 已结束！（1
pool-1-thread-4 已结束！（3
pool-1-thread-3 已结束！（2
```

这是为什么呢？我们来看看这个拒绝策略的源码：

```java
public static class DiscardOldestPolicy implements RejectedExecutionHandler {
    public DiscardOldestPolicy() { }

    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            e.getQueue().poll();   //会先执行一次出队操作，但是这对于SynchronousQueue来说毫无意义
            e.execute(r);     //这里会再次调用execute方法
        }
    }
}
```

可以看到，它会先对等待队列进行出队操作，但是由于SynchronousQueue压根没容量，所有这个操作毫无意义，然后就会递归执行`execute`方法，而进入之后，又发现没有容量不能插入，于是又重复上面的操作，这样就会无限的递归下去，最后就爆栈了。

当然，除了使用官方提供的4种策略之外，我们还可以使用自定义的策略：

```java
public static void main(String[] args) throws InterruptedException {
    ThreadPoolExecutor executor =
            new ThreadPoolExecutor(2, 4,
                    3, TimeUnit.SECONDS,
                    new SynchronousQueue<>(),
                    (r, executor1) -> {   //比如这里我们也来实现一个就在当前线程执行的策略
                        System.out.println("哎呀，线程池和等待队列都满了，你自己耗子尾汁吧");
                        r.run();   //直接运行
                    });
```

接着我们来看线程创建工厂，我们可以自己决定如何创建新的线程：

```java
public static void main(String[] args) throws InterruptedException {
    ThreadPoolExecutor executor =
            new ThreadPoolExecutor(2, 4,
                    3, TimeUnit.SECONDS,
                    new SynchronousQueue<>(),
                    new ThreadFactory() {
                        int counter = 0;
                        @Override
                        public Thread newThread(Runnable r) {
                            return new Thread(r, "我的自定义线程-"+counter++);
                        }
                    });

    for (int i = 0; i < 4; i++) {
        executor.execute(() -> System.out.println(Thread.currentThread().getName()+" 开始执行！"));
    }
}
```

这里传入的Runnable对象就是我们提交的任务，可以看到需要我们返回一个Thread对象，其实就是线程池创建线程的过程，而如何创建这个对象，以及它的一些属性，就都由我们来决定。

各位有没有想过这样一个情况，如果我们的任务在运行过程中出现异常了，那么是不是会导致线程池中的线程被销毁呢？

```java
public static void main(String[] args) throws InterruptedException {
    ThreadPoolExecutor executor = new ThreadPoolExecutor(1, 1,   //最大容量和核心容量锁定为1
            0, TimeUnit.MILLISECONDS, new LinkedBlockingDeque<>());
    executor.execute(() -> {
        System.out.println(Thread.currentThread().getName());
        throw new RuntimeException("我是异常！");
    });
    TimeUnit.SECONDS.sleep(1);
    executor.execute(() -> {
        System.out.println(Thread.currentThread().getName());
    });
}
```

可以看到，出现异常之后，再次提交新的任务，执行的线程是一个新的线程了。

除了我们自己创建线程池之外，官方也提供了很多的线程池定义，我们可以使用`Executors`工具类来快速创建线程池：

```java
public static void main(String[] args) throws InterruptedException {
    ExecutorService executor = Executors.newFixedThreadPool(2);   //直接创建一个固定容量的线程池
}
```

可以看到它的内部实现为：

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```

这里直接将最大线程和核心线程数量设定为一样的，并且等待时间为0，因为压根不需要，并且采用的是一个无界的LinkedBlockingQueue作为等待队列。

使用newSingleThreadExecutor来创建只有一个线程的线程池：

```java
public static void main(String[] args) throws InterruptedException {
    ExecutorService executor = Executors.newSingleThreadExecutor();
    //创建一个只有一个线程的线程池
}
```

原理如下：

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

可以看到这里并不是直接创建的一个ThreadPoolExecutor对象，而是套了一层FinalizableDelegatedExecutorService，那么这个又是什么东西呢？

```java
static class FinalizableDelegatedExecutorService
    extends DelegatedExecutorService {
    FinalizableDelegatedExecutorService(ExecutorService executor) {
        super(executor);
    }
    protected void finalize() {    //在GC时，会执行finalize方法，此方法中会关闭掉线程池，释放资源
        super.shutdown();
    }
}
```

```java
static class DelegatedExecutorService extends AbstractExecutorService {
    private final ExecutorService e;    //被委派对象
    DelegatedExecutorService(ExecutorService executor) { e = executor; }   //实际上所以的操作都是让委派对象执行的，有点像代理
    public void execute(Runnable command) { e.execute(command); }
    public void shutdown() { e.shutdown(); }
    public List<Runnable> shutdownNow() { return e.shutdownNow(); }
```

所以，下面两种写法的区别在于：

```java
public static void main(String[] args) throws InterruptedException {
    ExecutorService executor1 = Executors.newSingleThreadExecutor();
    ExecutorService executor2 = Executors.newFixedThreadPool(1);
}
```

前者实际上是被代理了，我们没办法直接修改前者的相关属性，显然使用前者创建只有一个线程的线程池更加专业和安全（可以防止属性被修改）一些。

最后我们来看`newCachedThreadPool`方法：

```java
public static void main(String[] args) throws InterruptedException {
    ExecutorService executor = Executors.newCachedThreadPool();
    //它是一个会根据需要无限制创建新线程的线程池
}
```

我们来看看它的实现：

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

可以看到，核心线程数为0，那么也就是说所有的线程都是`非核心线程`，也就是说线程空闲时间超过1秒钟，一律销毁。但是它的最大容量是`Integer.MAX_VALUE`，也就是说，它可以无限制地增长下去，所以这玩意一定要慎用。

### 执行带返回值的任务

一个多线程任务不仅仅可以是void无返回值任务，比如我们现在需要执行一个任务，但是我们需要在任务执行之后得到一个结果，这个时候怎么办呢？

这里我们就可以使用到Future了，它可以返回任务的计算结果，我们可以通过它来获取任务的结果以及任务当前是否完成：

```java
public static void main(String[] args) throws InterruptedException, ExecutionException {
    ExecutorService executor = Executors.newSingleThreadExecutor();   //直接用Executors创建，方便就完事了
    Future<String> future = executor.submit(() -> "我是字符串!");     //使用submit提交任务，会返回一个Future对象，注意提交的对象可以是Runable也可以是Callable，这里使用的是Callable能够自定义返回值
    System.out.println(future.get());    //如果任务未完成，get会被阻塞，任务完成返回Callable执行结果返回值
    executor.shutdown();
}
```

当然结果也可以一开始就定义好，然后等待Runnable执行完之后再返回：

```java
public static void main(String[] args) throws InterruptedException, ExecutionException {
    ExecutorService executor = Executors.newSingleThreadExecutor();
    Future<String> future = executor.submit(() -> {
        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }, "我是字符串！");
    System.out.println(future.get());
    executor.shutdown();
}
```

还可以通过传入FutureTask对象的方式：

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    ExecutorService service = Executors.newSingleThreadExecutor();
    FutureTask<String> task = new FutureTask<>(() -> "我是字符串！");
    service.submit(task);
    System.out.println(task.get());
    executor.shutdown();
}
```

我们可以还通过Future对象获取当前任务的一些状态：

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    ExecutorService executor = Executors.newSingleThreadExecutor();
    Future<String> future = executor.submit(() -> "都看到这里了，不赏UP主一个一键三连吗？");
    System.out.println(future.get());
    System.out.println("任务是否执行完成："+future.isDone());
    System.out.println("任务是否被取消："+future.isCancelled());
    executor.shutdown();
}
```

我们来试试看在任务执行途中取消任务：

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    ExecutorService executor = Executors.newSingleThreadExecutor();
    Future<String> future = executor.submit(() -> {
        TimeUnit.SECONDS.sleep(10);
        return "这次一定！";
    });
    System.out.println(future.cancel(true));
    System.out.println(future.isCancelled());
    executor.shutdown();
}
```

### 执行定时任务

既然线程池怎么强大，那么线程池能不能执行定时任务呢？我们之前如果需要执行一个定时任务，那么肯定会用到Timer和TimerTask，但是它只会创建一个线程处理我们的定时任务，无法实现多线程调度，并且它无法处理异常情况一旦抛出未捕获异常那么会直接终止，显然我们需要一个更加强大的定时器。

JDK5之后，我们可以使用ScheduledThreadPoolExecutor来提交定时任务，它继承自ThreadPoolExecutor，并且所有的构造方法都必须要求最大线程池容量为Integer.MAX_VALUE，并且都是采用的DelayedWorkQueue作为等待队列。

```java
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue());
}

public ScheduledThreadPoolExecutor(int corePoolSize,
                                   ThreadFactory threadFactory) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue(), threadFactory);
}

public ScheduledThreadPoolExecutor(int corePoolSize,
                                   RejectedExecutionHandler handler) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue(), handler);
}

public ScheduledThreadPoolExecutor(int corePoolSize,
                                   ThreadFactory threadFactory,
                                   RejectedExecutionHandler handler) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue(), threadFactory, handler);
}
```

我们来测试一下它的方法，这个方法可以提交一个延时任务，只有到达指定时间之后才会开始：

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
  	//直接设定核心线程数为1
    ScheduledThreadPoolExecutor executor = new ScheduledThreadPoolExecutor(1);
    //这里我们计划在3秒后执行
    executor.schedule(() -> System.out.println("HelloWorld!"), 3, TimeUnit.SECONDS);

    executor.shutdown();
}
```

我们也可以像之前一样，传入一个Callable对象，用于接收返回值：

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    ScheduledThreadPoolExecutor executor = new ScheduledThreadPoolExecutor(2);
  	//这里使用ScheduledFuture
    ScheduledFuture<String> future = executor.schedule(() -> "????", 3, TimeUnit.SECONDS);
    System.out.println("任务剩余等待时间："+future.getDelay(TimeUnit.MILLISECONDS) / 1000.0 + "s");
    System.out.println("任务执行结果："+future.get());
    executor.shutdown();
}
```

可以看到`schedule`方法返回了一个ScheduledFuture对象，和Future一样，它也支持返回值的获取、包括对任务的取消同时还支持获取剩余等待时间。

那么如果我们希望按照一定的频率不断执行任务呢？

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    ScheduledThreadPoolExecutor executor = new ScheduledThreadPoolExecutor(2);
    executor.scheduleAtFixedRate(() -> System.out.println("Hello World!"),
            3, 1, TimeUnit.SECONDS);
  	//三秒钟延迟开始，之后每隔一秒钟执行一次
}
```

Executors也为我们预置了newScheduledThreadPool方法用于创建线程池：

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    ScheduledExecutorService service = Executors.newScheduledThreadPool(1);
    service.schedule(() -> System.out.println("Hello World!"), 1, TimeUnit.SECONDS);
}
```

### 线程池实现原理

前面我们了解了线程池的使用，那么接着我们来看看它的详细实现过程，结构稍微有点复杂，坐稳，发车了。

这里需要首先介绍一下ctl变量：

```java
//这个变量比较关键，用到了原子AtomicInteger，用于同时保存线程池运行状态和线程数量（使用原子类是为了保证原子性）
//它是通过拆分32个bit位来保存数据的，前3位保存状态，后29位保存工作线程数量（那要是工作线程数量29位装不下不就GG？）
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
private static final int COUNT_BITS = Integer.SIZE - 3;    //29位，线程数量位
private static final int CAPACITY   = (1 << COUNT_BITS) - 1;   //计算得出最大容量（1左移29位，最大容量为2的29次方-1）

// 所有的运行状态，注意都是只占用前3位，不会占用后29位
// 接收新任务，并等待执行队列中的任务
private static final int RUNNING    = -1 << COUNT_BITS;   //111 | 0000... (后29数量位，下同)
// 不接收新任务，但是依然等待执行队列中的任务
private static final int SHUTDOWN   =  0 << COUNT_BITS;   //000 | 数量位
// 不接收新任务，也不执行队列中的任务，并且还要中断正在执行中的任务
private static final int STOP       =  1 << COUNT_BITS;   //001 | 数量位
// 所有的任务都已结束，线程数量为0，即将完全关闭
private static final int TIDYING    =  2 << COUNT_BITS;   //010 | 数量位
// 完全关闭
private static final int TERMINATED =  3 << COUNT_BITS;   //011 | 数量位

// 封装和解析ctl变量的一些方法
private static int runStateOf(int c)     { return c & ~CAPACITY; }   //对CAPACITY取反就是后29位全部为0，前三位全部为1，接着与c进行与运算，这样就可以只得到前三位的结果了，所以这里是取运行状态
private static int workerCountOf(int c)  { return c & CAPACITY; }
//同上，这里是为了得到后29位的结果，所以这里是取线程数量
private static int ctlOf(int rs, int wc) { return rs | wc; }   
// 比如上面的RUNNING, 0，进行与运算之后：
// 111 | 0000000000000000000000000
```

![image-20230306172347411](https://oss.itbaima.cn/internal/markdown/2023/03/06/yoFvxQJq84G6dcH.png)

我们先从最简单的入手，看看在调用`execute`方法之后，线程池会做些什么：

```java
//这个就是我们指定的阻塞队列
private final BlockingQueue<Runnable> workQueue;

//再次提醒，这里没加锁！！该有什么意识不用我说了吧，所以说ctl才会使用原子类。
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();     //如果任务为null，那执行个寂寞，所以说直接空指针
    int c = ctl.get();      //获取ctl的值，一会要读取信息的
    if (workerCountOf(c) < corePoolSize) {   //判断工作线程数量是否小于核心线程数
        if (addWorker(command, true))    //如果是，那不管三七二十一，直接加新的线程执行，然后返回即可
            return;
        c = ctl.get();    //如果线程添加失败（有可能其他线程也在对线程池进行操作），那就更新一下c的值
    }
    if (isRunning(c) && workQueue.offer(command)) {   //继续判断，如果当前线程池是运行状态，那就尝试向阻塞队列中添加一个新的等待任务
        int recheck = ctl.get();   //再次获取ctl的值
        if (! isRunning(recheck) && remove(command))   //这里是再次确认当前线程池是否关闭，如果添加等待任务后线程池关闭了，那就把刚刚加进去任务的又拿出来
            reject(command);   //然后直接拒绝当前任务的提交（会根据我们的拒绝策略决定如何进行拒绝操作）
        else if (workerCountOf(recheck) == 0)   //如果这个时候线程池依然在运行状态，那么就检查一下当前工作线程数是否为0，如果是那就直接添加新线程执行
            addWorker(null, false);   //添加一个新的非核心线程，但是注意没添加任务
      	//其他情况就啥也不用做了
    }
    else if (!addWorker(command, false))   //这种情况要么就是线程池没有运行，要么就是队列满了，按照我们之前的规则，核心线程数已满且队列已满，那么会直接添加新的非核心线程，但是如果已经添加到最大数量，这里肯定是会失败的
        reject(command);   //确实装不下了，只能拒绝
}
```

是不是感觉思路还挺清晰的，我们接着来看`addWorker`是怎么创建和执行任务的，又是一大堆代码：

```java
private boolean addWorker(Runnable firstTask, boolean core) {
  	//这里给最外层循环打了个标签，方便一会的跳转操作
    retry:
    for (;;) {    //无限循环，老套路了，注意这里全程没加锁
        int c = ctl.get();     //获取ctl值
        int rs = runStateOf(c);    //解析当前的运行状态

        // Check if queue empty only if necessary.
        if (rs >= SHUTDOWN &&   //判断线程池是否不是处于运行状态
            ! (rs == SHUTDOWN &&   //如果不是运行状态，判断线程是SHUTDOWN状态并、任务不为null、等待队列不为空，只要有其中一者不满足，直接返回false，添加失败
               firstTask == null &&   
               ! workQueue.isEmpty()))
            return false;

        for (;;) {   //内层又一轮无限循环，这个循环是为了将线程计数增加，然后才可以真正地添加一个新的线程
            int wc = workerCountOf(c);    //解析当前的工作线程数量
            if (wc >= CAPACITY ||
                wc >= (core ? corePoolSize : maximumPoolSize))    //判断一下还装得下不，如果装得下，看看是核心线程还是非核心线程，如果是核心线程，不能大于核心线程数的限制，如果是非核心线程，不能大于最大线程数限制
                return false;
            if (compareAndIncrementWorkerCount(c))    //CAS自增线程计数，如果增加成功，任务完成，直接跳出继续
                break retry;    //注意这里要直接跳出最外层循环，所以用到了标签（类似于goto语句）
            c = ctl.get();  // 如果CAS失败，更新一下c的值
            if (runStateOf(c) != rs)    //如果CAS失败的原因是因为线程池状态和一开始的不一样了，那么就重新从外层循环再来一次
                continue retry;    //注意这里要直接从最外层循环继续，所以用到了标签（类似于goto语句）
            // 如果是其他原因导致的CAS失败，那只可能是其他线程同时在自增，所以重新再来一次内层循环
        }
    }

  	//好了，线程计数自增也完了，接着就是添加新的工作线程了
    boolean workerStarted = false;   //工作线程是否已启动
    boolean workerAdded = false;    //工作线程是否已添加
    Worker w = null;     //暂时理解为工作线程，别急，我们之后会解读Worker类
    try {
        w = new Worker(firstTask);     //创建新的工作线程，传入我们提交的任务
        final Thread t = w.thread;    //拿到工作线程中封装的Thread对象
        if (t != null) {      //如果线程不为null，那就可以安排干活了
            final ReentrantLock mainLock = this.mainLock;      //又是ReentrantLock加锁环节，这里开始就是只有一个线程能进入了
            mainLock.lock();
            try {
                // Recheck while holding lock.
                // Back out on ThreadFactory failure or if
                // shut down before lock acquired.
                int rs = runStateOf(ctl.get());    //获取当前线程的运行状态

                if (rs < SHUTDOWN ||
                    (rs == SHUTDOWN && firstTask == null)) {    //只有当前线程池是正在运行状态，或是SHUTDOWN状态且firstTask为空，那么就继续
                    if (t.isAlive()) // 检查一下线程是否正在运行状态
                        throw new IllegalThreadStateException();   //如果是那肯定是不能运行我们的任务的
                    workers.add(w);    //直接将新创建的Work丢进 workers 集合中
                    int s = workers.size();   //看看当前workers的大小
                    if (s > largestPoolSize)   //这里是记录线程池运行以来，历史上的最多线程数
                        largestPoolSize = s;
                    workerAdded = true;   //工作线程已添加
                }
            } finally {
                mainLock.unlock();   //解锁
            }
            if (workerAdded) {
                t.start();   //启动线程
                workerStarted = true;  //工作线程已启动
            }
        }
    } finally {
        if (! workerStarted)    //如果线程在上面的启动过程中失败了
            addWorkerFailed(w);    //将w移出workers并将计数器-1，最后如果线程池是终止状态，会尝试加速终止线程池
    }
    return workerStarted;   //返回是否成功
}
```

接着我们来看Worker类是如何实现的，它继承自AbstractQueuedSynchronizer，时隔两章，居然再次遇到AQS，那也就是说，它本身就是一把锁：

```java
private final class Worker
    extends AbstractQueuedSynchronizer
    implements Runnable {
    //用来干活的线程
    final Thread thread;
    //要执行的第一个任务，构造时就确定了的
    Runnable firstTask;
    //干活数量计数器，也就是这个线程完成了多少个任务
    volatile long completedTasks;

    Worker(Runnable firstTask) {
        setState(-1); // 执行Task之前不让中断，将AQS的state设定为-1
        this.firstTask = firstTask;
        this.thread = getThreadFactory().newThread(this);   //通过预定义或是我们自定义的线程工厂创建线程
    }
  
    public void run() {
        runWorker(this);   //真正开始干活，包括当前活干完了又要等新的活来，就从这里开始，一会详细介绍
    }

   	//0就是没加锁，1就是已加锁
    protected boolean isHeldExclusively() {
        return getState() != 0;
    }

    ...
}
```

最后我们来看看一个Worker到底是怎么在进行任务的：

```java
final void runWorker(Worker w) {
    Thread wt = Thread.currentThread();   //获取当前线程
    Runnable task = w.firstTask;    //取出要执行的任务
    w.firstTask = null;   //然后把Worker中的任务设定为null
    w.unlock(); // 因为一开始为-1，这里是通过unlock操作将其修改回0，只有state大于等于0才能响应中断
    boolean completedAbruptly = true;
    try {
      	//只要任务不为null，或是任务为空但是可以从等待队列中取出任务不为空，那么就开始执行这个任务，注意这里是无限循环，也就是说如果当前没有任务了，那么会在getTask方法中卡住，因为要从阻塞队列中等着取任务
        while (task != null || (task = getTask()) != null) {
            w.lock();    //对当前Worker加锁，这里其实并不是防其他线程，而是在shutdown时保护此任务的运行
            
          //由于线程池在STOP状态及以上会禁止新线程加入并且中断正在进行的线程
            if ((runStateAtLeast(ctl.get(), STOP) ||   //只要线程池是STOP及以上的状态，那肯定是不能开始新任务的
                 (Thread.interrupted() &&    					 //线程是否已经被打上中断标记并且线程一定是STOP及以上
                  runStateAtLeast(ctl.get(), STOP))) &&
                !wt.isInterrupted())   //再次确保线程被没有打上中断标记
                wt.interrupt();     //打中断标记
            try {
                beforeExecute(wt, task);  //开始之前的准备工作，这里暂时没有实现
                Throwable thrown = null;
                try {
                    task.run();    //OK，开始执行任务
                } catch (RuntimeException x) {
                    thrown = x; throw x;
                } catch (Error x) {
                    thrown = x; throw x;
                } catch (Throwable x) {
                    thrown = x; throw new Error(x);
                } finally {
                    afterExecute(task, thrown);    //执行之后的工作，也没实现
                }
            } finally {
                task = null;    //任务已完成，不需要了
                w.completedTasks++;   //任务完成数++
                w.unlock();    //解锁
            }
        }
        completedAbruptly = false;
    } finally {
      	//如果能走到这一步，那说明上面的循环肯定是跳出了，也就是说这个Worker可以丢弃了
      	//所以这里会直接将 Worker 从 workers 里删除掉
        processWorkerExit(w, completedAbruptly);
    }
}
```

那么它是怎么从阻塞队列里面获取任务的呢：

```java
private Runnable getTask() {
    boolean timedOut = false; // Did the last poll() time out?

    for (;;) {    //无限循环获取
        int c = ctl.get();   //获取ctl 
        int rs = runStateOf(c);      //解析线程池运行状态

        // Check if queue empty only if necessary.
        if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) {      //判断是不是没有必要再执行等待队列中的任务了，也就是处于关闭线程池的状态了
            decrementWorkerCount();     //直接减少一个工作线程数量
            return null;    //返回null，这样上面的runWorker就直接结束了，下同
        }

        int wc = workerCountOf(c);   //如果线程池运行正常，那就获取当前的工作线程数量

        // Are workers subject to culling?
        boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;   //如果线程数大于核心线程数或是允许核心线程等待超时，那么就标记为可超时的

      	//超时或maximumPoolSize在运行期间被修改了，并且线程数大于1或等待队列为空，那也是不能获取到任务的
        if ((wc > maximumPoolSize || (timed && timedOut))
            && (wc > 1 || workQueue.isEmpty())) {
            if (compareAndDecrementWorkerCount(c))   //如果CAS减少工作线程成功
                return null;    //返回null
            continue;   //否则开下一轮循环
        }

        try {
            Runnable r = timed ?
                workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :   //如果可超时，那么最多等到超时时间
                workQueue.take();    //如果不可超时，那就一直等着拿任务
            if (r != null)    //如果成功拿到任务，ok，返回
                return r;
            timedOut = true;   //否则就是超时了，下一轮循环将直接返回null
        } catch (InterruptedException retry) {
            timedOut = false;
        }
      	//开下一轮循环吧
    }
}
```

虽然我们的源码解读越来越深，但是只要各位的思路不断，依然是可以继续往下看的。到此，有关`execute()`方法的源码解读，就先到这里。

接着我们来看当线程池关闭时会做什么事情：

```java
//普通的shutdown会继续将等待队列中的线程执行完成后再关闭线程池
public void shutdown() {
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
      	//判断是否有权限终止
        checkShutdownAccess();
      	//CAS将线程池运行状态改为SHUTDOWN状态，还算比较温柔，详细过程看下面
        advanceRunState(SHUTDOWN);
       	//让闲着的线程（比如正在等新的任务）中断，但是并不会影响正在运行的线程，详细过程请看下面
        interruptIdleWorkers();
        onShutdown(); //给ScheduledThreadPoolExecutor提供的钩子方法，就是等ScheduledThreadPoolExecutor去实现的，当前类没有实现
    } finally {
        mainLock.unlock();
    }
    tryTerminate();   //最后尝试终止线程池
}
```

```java
private void advanceRunState(int targetState) {
    for (;;) {
        int c = ctl.get();    //获取ctl
        if (runStateAtLeast(c, targetState) ||    //是否大于等于指定的状态
            ctl.compareAndSet(c, ctlOf(targetState, workerCountOf(c))))   //CAS设置ctl的值
            break;   //任意一个条件OK就可以结束了
    }
}
```

```java
private void interruptIdleWorkers(boolean onlyOne) {
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        for (Worker w : workers) {
            Thread t = w.thread;    //拿到Worker中的线程
            if (!t.isInterrupted() && w.tryLock()) {   //先判断一下线程是不是没有被中断然后尝试加锁，但是通过前面的runWorker()源代码我们得知，开始之后是让Worker加了锁的，所以如果线程还在执行任务，那么这里肯定会false
                try {
                    t.interrupt();    //如果走到这里，那么说明线程肯定是一个闲着的线程，直接给中断吧
                } catch (SecurityException ignore) {
                } finally {
                    w.unlock();    //解锁
                }
            }
            if (onlyOne)   //如果只针对一个Worker，那么就结束循环
                break;
        }
    } finally {
        mainLock.unlock();
    }
}
```

而`shutdownNow()`方法也差不多，但是这里会更直接一些：

```java
//shutdownNow开始后，不仅不允许新的任务到来，也不会再执行等待队列的线程，而且会终止正在执行的线程
public List<Runnable> shutdownNow() {
    List<Runnable> tasks;
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        checkShutdownAccess();
      	//这里就是直接设定为STOP状态了，不再像shutdown那么温柔
        advanceRunState(STOP);
      	//直接中断所有工作线程，详细过程看下面
        interruptWorkers();
      	//取出仍处于阻塞队列中的线程
        tasks = drainQueue();
    } finally {
        mainLock.unlock();
    }
    tryTerminate();
    return tasks;   //最后返回还没开始的任务
}
```

```java
private void interruptWorkers() {
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        for (Worker w : workers)   //遍历所有Worker
            w.interruptIfStarted();   //无差别对待，一律加中断标记
    } finally {
        mainLock.unlock();
    }
}
```

最后的最后，我们再来看看`tryTerminate()`是怎么完完全全终止掉一个线程池的：

```java
final void tryTerminate() {
    for (;;) {     //无限循环
        int c = ctl.get();    //上来先获取一下ctl值
      	//只要是正在运行 或是 线程池基本上关闭了 或是 处于SHUTDOWN状态且工作队列不为空，那么这时还不能关闭线程池，返回
        if (isRunning(c) ||
            runStateAtLeast(c, TIDYING) ||
            (runStateOf(c) == SHUTDOWN && ! workQueue.isEmpty()))
            return;
      
      	//走到这里，要么处于SHUTDOWN状态且等待队列为空或是STOP状态
        if (workerCountOf(c) != 0) { // 如果工作线程数不是0，这里也会中断空闲状态下的线程
            interruptIdleWorkers(ONLY_ONE);   //这里最多只中断一个空闲线程，然后返回
            return;
        }

      	//走到这里，工作线程也为空了，可以终止线程池了
        final ReentrantLock mainLock = this.mainLock;
        mainLock.lock();
        try {
            if (ctl.compareAndSet(c, ctlOf(TIDYING, 0))) {   //先CAS将状态设定为TIDYING表示基本终止，正在做最后的操作
                try {
                    terminated();   //终止，暂时没有实现
                } finally {
                    ctl.set(ctlOf(TERMINATED, 0));   //最后将状态设定为TERMINATED，线程池结束了它年轻的生命
                    termination.signalAll();    //如果有线程调用了awaitTermination方法，会等待当前线程池终止，到这里差不多就可以唤醒了
                }
                return;   //结束
            }
          	//注意如果CAS失败会直接进下一轮循环重新判断
        } finally {
            mainLock.unlock();
        }
        // else retry on failed CAS
    }
}
```

OK，有关线程池的实现原理，我们就暂时先介绍到这里，关于更高级的定时任务线程池，这里就不做讲解了。

***

## 并发工具类

### 计数器锁 CountDownLatch

多任务同步神器。它允许一个或多个线程，等待其他线程完成工作，比如现在我们有这样的一个需求：

* 有20个计算任务，我们需要先将这些任务的结果全部计算出来，每个任务的执行时间未知
* 当所有任务结束之后，立即整合统计最终结果

要实现这个需求，那么有一个很麻烦的地方，我们不知道任务到底什么时候执行完毕，那么可否将最终统计延迟一定时间进行呢？但是最终统计无论延迟多久进行，要么不能保证所有任务都完成，要么可能所有任务都完成了而这里还在等。

所以说，我们需要一个能够实现子任务同步的工具。

```java
public static void main(String[] args) throws InterruptedException {
    CountDownLatch latch = new CountDownLatch(20);  //创建一个初始值为10的计数器锁
    for (int i = 0; i < 20; i++) {
        int finalI = i;
        new Thread(() -> {
            try {
                Thread.sleep((long) (2000 * new Random().nextDouble()));
                System.out.println("子任务"+ finalI +"执行完成！");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            latch.countDown();   //每执行一次计数器都会-1
        }).start();
    }

    //开始等待所有的线程完成，当计数器为0时，恢复运行
    latch.await();   //这个操作可以同时被多个线程执行，一起等待，这里只演示了一个
    System.out.println("所有子任务都完成！任务完成！！！");
  
  	//注意这个计数器只能使用一次，用完只能重新创一个，没有重置的说法
}
```

我们在调用`await()`方法之后，实际上就是一个等待计数器衰减为0的过程，而进行自减操作则由各个子线程来完成，当子线程完成工作后，那么就将计数器-1，所有的子线程完成之后，计数器为0，结束等待。

那么它是如何实现的呢？实现 原理非常简单：

```java
public class CountDownLatch {
   	//同样是通过内部类实现AbstractQueuedSynchronizer
    private static final class Sync extends AbstractQueuedSynchronizer {
        
        Sync(int count) {   //这里直接使用AQS的state作为计数器（可见state能被玩出各种花样），也就是说一开始就加了count把共享锁，当线程调用countdown时，就解一层锁
            setState(count);
        }

        int getCount() {
            return getState();
        }

      	//采用共享锁机制，因为可以被不同的线程countdown，所以实现的tryAcquireShared和tryReleaseShared
      	//获取这把共享锁其实就是去等待state被其他线程减到0
        protected int tryAcquireShared(int acquires) {
            return (getState() == 0) ? 1 : -1;
        }

        protected boolean tryReleaseShared(int releases) {
            // 每次执行都会将state值-1，直到为0
            for (;;) {
                int c = getState();
                if (c == 0)
                    return false;   //如果已经是0了，那就false
                int nextc = c-1;
                if (compareAndSetState(c, nextc))   //CAS设置state值，失败直接下一轮循环
                    return nextc == 0;    //返回c-1之后，是不是0，如果是那就true，否则false，也就是说只有刚好减到0的时候才会返回true
            }
        }
    }

    private final Sync sync;

    public CountDownLatch(int count) {
        if (count < 0) throw new IllegalArgumentException("count < 0");  //count那肯定不能小于0啊
        this.sync = new Sync(count);   //构造Sync对象，将count作为state初始值
    }

   	//通过acquireSharedInterruptibly方法获取共享锁，但是如果state不为0，那么会被持续阻塞，详细原理下面讲
    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }

    //同上，但是会超时
    public boolean await(long timeout, TimeUnit unit)
        throws InterruptedException {
        return sync.tryAcquireSharedNanos(1, unit.toNanos(timeout));
    }

   	//countDown其实就是解锁一次
    public void countDown() {
        sync.releaseShared(1);
    }

    //获取当前的计数，也就是AQS中state的值
    public long getCount() {
        return sync.getCount();
    }

    //这个就不说了
    public String toString() {
        return super.toString() + "[Count = " + sync.getCount() + "]";
    }
}
```

在深入讲解之前，我们先大致了解一下CountDownLatch的基本实现思路：

* 利用共享锁实现
* 在一开始的时候就是已经上了count层锁的状态，也就是`state = count`
* `await()`就是加共享锁，但是必须`state`为`0`才能加锁成功，否则按照AQS的机制，会进入等待队列阻塞，加锁成功后结束阻塞
* `countDown()`就是解`1`层锁，也就是靠这个方法一点一点把`state`的值减到`0`

由于我们前面只对独占锁进行了讲解，没有对共享锁进行讲解，这里还是稍微提一下它：

```java
public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) < 0)   //上来就调用tryAcquireShared尝试以共享模式获取锁，小于0则失败，上面判断的是state==0返回1，否则-1，也就是说如果计数器不为0，那么这里会判断成功
        doAcquireShared(arg);   //计数器不为0的时候，按照它的机制，那么会阻塞，所以我们来看看doAcquireShared中是怎么进行阻塞的
}
```

```java
private void doAcquireShared(int arg) {
    final Node node = addWaiter(Node.SHARED);   //向等待队列中添加一个新的共享模式结点
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {    //无限循环
            final Node p = node.predecessor();   //获取当前节点的前驱的结点
            if (p == head) {    //如果p就是头结点，那么说明当前结点就是第一个等待节点
                int r = tryAcquireShared(arg);    //会再次尝试获取共享锁
                if (r >= 0) {      //要是获取成功
                    setHeadAndPropagate(node, r);   //那么就将当前节点设定为新的头结点，并且会继续唤醒后继节点
                    p.next = null; // help GC
                    if (interrupted)
                        selfInterrupt();
                    failed = false;
                    return;
                }
            }
            if (shouldParkAfterFailedAcquire(p, node) &&   //和独占模式下一样的操作，这里不多说了
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);   //如果最后都还是没获取到，那么就cancel
    }
}
//其实感觉大体上和独占模式的获取有点像，但是它多了个传播机制，会继续唤醒后续节点
```

```java
private void setHeadAndPropagate(Node node, int propagate) {
    Node h = head; // 取出头结点并将当前节点设定为新的头结点
    setHead(node);
    
  	//因为一个线程成功获取到共享锁之后，有可能剩下的等待中的节点也有机会拿到共享锁
    if (propagate > 0 || h == null || h.waitStatus < 0 ||
        (h = head) == null || h.waitStatus < 0) {   //如果propagate大于0（表示共享锁还能继续获取）或是h.waitStatus < 0，这是由于在其他线程释放共享锁时，doReleaseShared会将状态设定为PROPAGATE表示可以传播唤醒，后面会讲
        Node s = node.next;
        if (s == null || s.isShared())
            doReleaseShared();   //继续唤醒下一个等待节点
    }
}
```

我们接着来看，它的countdown过程：

```java
public final boolean releaseShared(int arg) {
    if (tryReleaseShared(arg)) {   //直接尝试释放锁，如果成功返回true（在CountDownLatch中只有state减到0的那一次，会返回true）
        doReleaseShared();    //这里也会调用doReleaseShared继续唤醒后面的结点
        return true;
    }
    return false;   //其他情况false
  									//不过这里countdown并没有用到这些返回值
}
```

```java
private void doReleaseShared() {
    for (;;) {   //无限循环
        Node h = head;    //获取头结点
        if (h != null && h != tail) {    //如果头结点不为空且头结点不是尾结点，那么说明等待队列中存在节点
            int ws = h.waitStatus;    //取一下头结点的等待状态
            if (ws == Node.SIGNAL) {    //如果是SIGNAL，那么就CAS将头结点的状态设定为初始值
                if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                    continue;            //失败就开下一轮循环重来
                unparkSuccessor(h);    //和独占模式一样，当锁被释放，都会唤醒头结点的后继节点，doAcquireShared循环继续，如果成功，那么根据setHeadAndPropagate，又会继续调用当前方法，不断地传播下去，让后面的线程一个一个地获取到共享锁，直到不能再继续获取为止
            }
            else if (ws == 0 &&
                     !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))   //如果等待状态是默认值0，那么说明后继节点已经被唤醒，直接将状态设定为PROPAGATE，它代表在后续获取资源的时候，够向后面传播
                continue;                //失败就开下一轮循环重来
        }
        if (h == head)                   // 如果头结点发生了变化，不会break，而是继续循环，否则直接break退出
            break;
    }
}
```

可能看完之后还是有点乱，我们再来理一下：

* 共享锁是线程共享的，同一时刻能有多个线程拥有共享锁。
* 如果一个线程刚获取了共享锁，那么在其之后等待的线程也很有可能能够获取到锁，所以得传播下去继续尝试唤醒后面的结点，不像独占锁，独占的压根不需要考虑这些。
* 如果一个线程刚释放了锁，不管是独占锁还是共享锁，都需要唤醒后续等待结点的线程。

回到CountDownLatch，再结合整个AQS共享锁的实现机制，进行一次完整的推导，看明白还是比较简单的。

### 循环屏障 CyclicBarrier

好比一场游戏，我们必须等待房间内人数足够之后才能开始，并且游戏开始之后玩家需要同时进入游戏以保证公平性。

假如现在游戏房间内一共5人，但是游戏开始需要10人，所以我们必须等待剩下5人到来之后才能开始游戏，并且保证游戏开始时所有玩家都是同时进入，那么怎么实现这个功能呢？我们可以使用CyclicBarrier，翻译过来就是循环屏障，那么这个屏障正式为了解决这个问题而出现的。

```java
public static void main(String[] args) {
    CyclicBarrier barrier = new CyclicBarrier(10,   //创建一个初始值为10的循环屏障
                () -> System.out.println("飞机马上就要起飞了，各位特种兵请准备！"));   //人等够之后执行的任务
    for (int i = 0; i < 10; i++) {
        int finalI = i;
        new Thread(() -> {
            try {
                Thread.sleep((long) (2000 * new Random().nextDouble()));
                System.out.println("玩家 "+ finalI +" 进入房间进行等待... ("+barrier.getNumberWaiting()+"/10)");

                barrier.await();    //调用await方法进行等待，直到等待的线程足够多为止

                //开始游戏，所有玩家一起进入游戏
                System.out.println("玩家 "+ finalI +" 进入游戏！");
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

可以看到，循环屏障会不断阻挡线程，直到被阻挡的线程足够多时，才能一起冲破屏障，并且在冲破屏障时，我们也可以做一些其他的任务。这和人多力量大的道理是差不多的，当人足够多时方能冲破阻碍，到达美好的明天。当然，屏障由于是可循环的，所以它在被冲破后，会重新开始计数，继续阻挡后续的线程：

```java
public static void main(String[] args) {
    CyclicBarrier barrier = new CyclicBarrier(5);  //创建一个初始值为5的循环屏障

    for (int i = 0; i < 10; i++) {   //创建5个线程
        int finalI = i;
        new Thread(() -> {
            try {
                Thread.sleep((long) (2000 * new Random().nextDouble()));
                System.out.println("玩家 "+ finalI +" 进入房间进行等待... ("+barrier.getNumberWaiting()+"/5)");

                barrier.await();    //调用await方法进行等待，直到等待线程到达5才会一起继续执行

                //人数到齐之后，可以开始游戏了
                System.out.println("玩家 "+ finalI +" 进入游戏！");
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

可以看到，通过使用循环屏障，我们可以对线程进行一波一波地放行，每一波都放行5个线程，当然除了自动重置之外，我们也可以调用`reset()`方法来手动进行重置操作，同样会重新计数：

```java
public static void main(String[] args) throws InterruptedException {
    CyclicBarrier barrier = new CyclicBarrier(5);  //创建一个初始值为10的计数器锁

    for (int i = 0; i < 3; i++)
        new Thread(() -> {
            try {
                barrier.await();
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        }).start();

    Thread.sleep(500);   //等一下上面的线程开始运行
    System.out.println("当前屏障前的等待线程数："+barrier.getNumberWaiting());

    barrier.reset();
    System.out.println("重置后屏障前的等待线程数："+barrier.getNumberWaiting());
}
```

可以看到，在调用`reset()`之后，处于等待状态下的线程，全部被中断并且抛出BrokenBarrierException异常，循环屏障等待线程数归零。那么要是处于等待状态下的线程被中断了呢？屏障的线程等待数量会不会自动减少？

```java
public static void main(String[] args) throws InterruptedException {
    CyclicBarrier barrier = new CyclicBarrier(10);
    Runnable r = () -> {
        try {
            barrier.await();
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }
    };
    Thread t = new Thread(r);
    t.start();
    t.interrupt();
    new Thread(r).start();
}
```

可以看到，当`await()`状态下的线程被中断，那么屏障会直接变成损坏状态，一旦屏障损坏，那么这一轮就无法再做任何等待操作了。也就是说，本来大家计划一起合力冲破屏障，结果有一个人摆烂中途退出了，那么所有人的努力都前功尽弃，这一轮的屏障也不可能再被冲破了（所以CyclicBarrier告诉我们，不要做那个害群之马，要相信你的团队，不然没有好果汁吃），只能进行`reset()`重置操作进行重置才能恢复正常。

乍一看，怎么感觉和之前讲的CountDownLatch有点像，好了，这里就得区分一下了，千万别搞混：

* CountDownLatch：
  1. 它只能使用一次，是一个一次性的工具
  2. 它是一个或多个线程用于等待其他线程完成的同步工具
* CyclicBarrier
  1. 它可以反复使用，允许自动或手动重置计数
  2. 它是让一定数量的线程在同一时间开始运行的同步工具

我们接着来看循环屏障的实现细节：

```java
public class CyclicBarrier {
    //内部类，存放broken标记，表示屏障是否损坏，损坏的屏障是无法正常工作的
    private static class Generation {
        boolean broken = false;
    }

    /** 内部维护一个可重入锁 */
    private final ReentrantLock lock = new ReentrantLock();
    /** 再维护一个Condition */
    private final Condition trip = lock.newCondition();
    /** 这个就是屏障的最大阻挡容量，就是构造方法传入的初始值 */
    private final int parties;
    /* 在屏障破裂时做的事情 */
    private final Runnable barrierCommand;
    /** 当前这一轮的Generation对象，每一轮都有一个新的，用于保存broken标记 */
    private Generation generation = new Generation();

    //默认为最大阻挡容量，每来一个线程-1，和CountDownLatch挺像，当屏障破裂或是被重置时，都会将其重置为最大阻挡容量
    private int count;

  	//构造方法
  	public CyclicBarrier(int parties, Runnable barrierAction) {
        if (parties <= 0) throw new IllegalArgumentException();
        this.parties = parties;
        this.count = parties;
        this.barrierCommand = barrierAction;
    }
  
    public CyclicBarrier(int parties) {
        this(parties, null);
    }
  
    //开启下一轮屏障，一般屏障被冲破之后，就自动重置了，进入到下一轮
    private void nextGeneration() {
        // 唤醒所有等待状态的线程
        trip.signalAll();
        // 重置count的值
        count = parties;
      	//创建新的Generation对象
        generation = new Generation();
    }

    //破坏当前屏障，变为损坏状态，之后就不能再使用了，除非重置
    private void breakBarrier() {
        generation.broken = true;
        count = parties;
        trip.signalAll();
    }
  
  	//开始等待
  	public int await() throws InterruptedException, BrokenBarrierException {
        try {
            return dowait(false, 0L);
        } catch (TimeoutException toe) {
            throw new Error(toe); // 因为这里没有使用定时机制，不可能发生异常，如果发生怕是出了错误
        }
    }
    
  	//可超时的等待
    public int await(long timeout, TimeUnit unit)
        throws InterruptedException,
               BrokenBarrierException,
               TimeoutException {
        return dowait(true, unit.toNanos(timeout));
    }

    //这里就是真正的等待流程了，让我们细细道来
    private int dowait(boolean timed, long nanos)
        throws InterruptedException, BrokenBarrierException,
               TimeoutException {
        final ReentrantLock lock = this.lock;
        lock.lock();   //加锁，注意，因为多个线程都会调用await方法，因此只有一个线程能进，其他都被卡着了
        try {
            final Generation g = generation;   //获取当前这一轮屏障的Generation对象

            if (g.broken)
                throw new BrokenBarrierException();   //如果这一轮屏障已经损坏，那就没办法使用了

            if (Thread.interrupted()) {   //如果当前等待状态的线程被中断，那么会直接破坏掉屏障，并抛出中断异常（破坏屏障的第1种情况）
                breakBarrier();
                throw new InterruptedException();
            }

            int index = --count;     //如果上面都没有出现不正常，那么就走正常流程，首先count自减并赋值给index，index表示当前是等待的第几个线程
            if (index == 0) {  // 如果自减之后就是0了，那么说明来的线程已经足够，可以冲破屏障了
                boolean ranAction = false;
                try {
                    final Runnable command = barrierCommand;
                    if (command != null)
                        command.run();   //执行冲破屏障后的任务，如果这里抛异常了，那么会进finally
                    ranAction = true;
                    nextGeneration();   //一切正常，开启下一轮屏障（方法进入之后会唤醒所有等待的线程，这样所有的线程都可以同时继续运行了）然后返回0，注意最下面finally中会解锁，不然其他线程唤醒了也拿不到锁啊
                    return 0;
                } finally {
                    if (!ranAction)   //如果是上面出现异常进来的，那么也会直接破坏屏障（破坏屏障的第2种情况）
                        breakBarrier();
                }
            }

            // 能走到这里，那么说明当前等待的线程数还不够多，不足以冲破屏障
            for (;;) {   //无限循环，一直等，等到能冲破屏障或是出现异常为止
                try {
                    if (!timed)
                        trip.await();    //如果不是定时的，那么就直接永久等待
                    else if (nanos > 0L)
                        nanos = trip.awaitNanos(nanos);   //否则最多等一段时间
                } catch (InterruptedException ie) {    //等的时候会判断是否被中断（依然是破坏屏障的第1种情况）
                    if (g == generation && ! g.broken) {
                        breakBarrier();
                        throw ie;
                    } else {
                        Thread.currentThread().interrupt();
                    }
                }

                if (g.broken)
                    throw new BrokenBarrierException();   //如果线程被唤醒之后发现屏障已经被破坏，那么直接抛异常

                if (g != generation)   //成功冲破屏障开启下一轮，那么直接返回当前是第几个等待的线程。
                    return index;

                if (timed && nanos <= 0L) {   //线程等待超时，也会破坏屏障（破坏屏障的第3种情况）然后抛异常
                    breakBarrier();
                    throw new TimeoutException();
                }
            }
        } finally {
            lock.unlock();    //最后别忘了解锁，不然其他线程拿不到锁
        }
    }

  	//不多说了
    public int getParties() {
        return parties;
    }

  	//判断是否被破坏，也是加锁访问，因为有可能这时有其他线程正在执行dowait
    public boolean isBroken() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return generation.broken;
        } finally {
            lock.unlock();
        }
    }

  	//重置操作，也要加锁
    public void reset() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            breakBarrier();   // 先破坏这一轮的线程，注意这个方法会先破坏再唤醒所有等待的线程，那么所有等待的线程会直接抛BrokenBarrierException异常（详情请看上方dowait倒数第13行）
            nextGeneration(); // 开启下一轮
        } finally {
            lock.unlock();
        }
    }
	
  	//获取等待线程数量，也要加锁
    public int getNumberWaiting() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return parties - count;   //最大容量 - 当前剩余容量 = 正在等待线程数
        } finally {
            lock.unlock();
        }
    }
}
```

看完了CyclicBarrier的源码之后，是不是感觉比CountDownLatch更简单一些？

### 信号量 Semaphore

还记得我们在《操作系统》中学习的信号量机制吗？它在解决进程之间的同步问题中起着非常大的作用。

> 信号量(Semaphore)，有时被称为信号灯，是在多线程环境下使用的一种设施，是可以用来保证两个或多个关键代码段不被并发调用。在进入一个关键代码段之前，线程必须获取一个信号量；一旦该关键代码段完成了，那么该线程必须释放信号量。其它想进入该关键代码段的线程必须等待直到第一个线程释放信号量。

通过使用信号量，我们可以决定某个资源同一时间能够被访问的最大线程数，它相当于对某个资源的访问进行了流量控制。简单来说，它就是一个可以被N个线程占用的排它锁（因此也支持公平和非公平模式），我们可以在最开始设定Semaphore的许可证数量，每个线程都可以获得1个或n个许可证，当许可证耗尽或不足以供其他线程获取时，其他线程将被阻塞。

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    //每一个Semaphore都会在一开始获得指定的许可证数数量，也就是许可证配额
    Semaphore semaphore = new Semaphore(2);   //许可证配额设定为2

    for (int i = 0; i < 3; i++) {
        new Thread(() -> {
            try {
                semaphore.acquire();   //申请一个许可证
                System.out.println("许可证申请成功！");
                semaphore.release();   //归还一个许可证
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    //每一个Semaphore都会在一开始获得指定的许可证数数量，也就是许可证配额
    Semaphore semaphore = new Semaphore(3);   //许可证配额设定为3

    for (int i = 0; i < 2; i++)
        new Thread(() -> {
            try {
                semaphore.acquire(2);    //一次性申请两个许可证
                System.out.println("许可证申请成功！");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    
}
```

我们也可以通过Semaphore获取一些常规信息：

```java
public static void main(String[] args) throws InterruptedException {
    Semaphore semaphore = new Semaphore(3);   //只配置一个许可证，5个线程进行争抢，不内卷还想要许可证？
    for (int i = 0; i < 5; i++)
        new Thread(semaphore::acquireUninterruptibly).start();   //可以以不响应中断（主要是能简写一行，方便）
    Thread.sleep(500);
    System.out.println("剩余许可证数量："+semaphore.availablePermits());
    System.out.println("是否存在线程等待许可证："+(semaphore.hasQueuedThreads() ? "是" : "否"));
    System.out.println("等待许可证线程数量："+semaphore.getQueueLength());
}
```

我们可以手动回收掉所有的许可证：

```java
public static void main(String[] args) throws InterruptedException {
    Semaphore semaphore = new Semaphore(3);
    new Thread(semaphore::acquireUninterruptibly).start();
    Thread.sleep(500);
    System.out.println("收回剩余许可数量："+semaphore.drainPermits());   //直接回收掉剩余的许可证
}
```

这里我们模拟一下，比如现在有10个线程同时进行任务，任务要求是执行某个方法，但是这个方法最多同时只能由5个线程执行，这里我们使用信号量就非常合适。

### 数据交换 Exchanger

线程之间的数据传递也可以这么简单。

使用Exchanger，它能够实现线程之间的数据交换：

```java
public static void main(String[] args) throws InterruptedException {
    Exchanger<String> exchanger = new Exchanger<>();
    new Thread(() -> {
        try {
            System.out.println("收到主线程传递的交换数据："+exchanger.exchange("AAAA"));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }).start();
    System.out.println("收到子线程传递的交换数据："+exchanger.exchange("BBBB"));
}
```

在调用`exchange`方法后，当前线程会等待其他线程调用同一个exchanger对象的`exchange`方法，当另一个线程也调用之后，方法会返回对方线程传入的参数。

可见功能还是比较简单的。

### Fork/Join框架

在JDK7时，出现了一个新的框架用于并行执行任务，它的目的是为了把大型任务拆分为多个小任务，最后汇总多个小任务的结果，得到整大任务的结果，并且这些小任务都是同时在进行，大大提高运算效率。Fork就是拆分，Join就是合并。

我们来演示一下实际的情况，比如一个算式：18x7+36x8+9x77+8x53，可以拆分为四个小任务：18x7、36x8、9x77、8x53，最后我们只需要将这四个任务的结果加起来，就是我们原本算式的结果了，有点归并排序的味道。

![image-20230306172442485](https://oss.itbaima.cn/internal/markdown/2023/03/06/l6iXQ4N2TfnZDMJ.png)

它不仅仅只是拆分任务并使用多线程，而且还可以利用工作窃取算法，提高线程的利用率。

> **工作窃取算法：** 是指某个线程从其他队列里窃取任务来执行。一个大任务分割为若干个互不依赖的子任务，为了减少线程间的竞争，把这些子任务分别放到不同的队列里，并为每个队列创建一个单独的线程来执行队列里的任务，线程和队列一一对应。但是有的线程会先把自己队列里的任务干完，而其他线程对应的队列里还有任务待处理。干完活的线程与其等着，不如帮其他线程干活，于是它就去其他线程的队列里窃取一个任务来执行。

![image-20230306172457006](https://oss.itbaima.cn/internal/markdown/2023/03/06/DP7yj6pBZFGLoQb.png)

现在我们来看看如何使用它，这里以计算1-1000的和为例，我们可以将其拆分为8个小段的数相加，比如1-125、126-250... ，最后再汇总即可，它也是依靠线程池来实现的：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ForkJoinPool pool = new ForkJoinPool();
        System.out.println(pool.submit(new SubTask(1, 1000)).get());
    }


  	//继承RecursiveTask，这样才可以作为一个任务，泛型就是计算结果类型
    private static class SubTask extends RecursiveTask<Integer> {
        private final int start;   //比如我们要计算一个范围内所有数的和，那么就需要限定一下范围，这里用了两个int存放
        private final int end;

        public SubTask(int start, int end) {
            this.start = start;
            this.end = end;
        }

        @Override
        protected Integer compute() {
            if(end - start > 125) {    //每个任务最多计算125个数的和，如果大于继续拆分，小于就可以开始算了
                SubTask subTask1 = new SubTask(start, (end + start) / 2);
                subTask1.fork();    //会继续划分子任务执行
                SubTask subTask2 = new SubTask((end + start) / 2 + 1, end);
                subTask2.fork();   //会继续划分子任务执行
                return subTask1.join() + subTask2.join();   //越玩越有递归那味了
            } else {
                System.out.println(Thread.currentThread().getName()+" 开始计算 "+start+"-"+end+" 的值!");
                int res = 0;
                for (int i = start; i <= end; i++) {
                    res += i;
                }
                return res;   //返回的结果会作为join的结果
            }
        }
    }
}
```

```
ForkJoinPool-1-worker-2 开始计算 1-125 的值!
ForkJoinPool-1-worker-2 开始计算 126-250 的值!
ForkJoinPool-1-worker-0 开始计算 376-500 的值!
ForkJoinPool-1-worker-6 开始计算 751-875 的值!
ForkJoinPool-1-worker-3 开始计算 626-750 的值!
ForkJoinPool-1-worker-5 开始计算 501-625 的值!
ForkJoinPool-1-worker-4 开始计算 251-375 的值!
ForkJoinPool-1-worker-7 开始计算 876-1000 的值!
500500
```

可以看到，结果非常正确，但是整个计算任务实际上是拆分为了8个子任务同时完成的，结合多线程，原本的单线程任务，在多线程的加持下速度成倍提升。

包括Arrays工具类提供的并行排序也是利用了ForkJoinPool来实现：

```java
public static void parallelSort(byte[] a) {
    int n = a.length, p, g;
    if (n <= MIN_ARRAY_SORT_GRAN ||
        (p = ForkJoinPool.getCommonPoolParallelism()) == 1)
        DualPivotQuicksort.sort(a, 0, n - 1);
    else
        new ArraysParallelSortHelpers.FJByte.Sorter
            (null, a, new byte[n], 0, n, 0,
             ((g = n / (p << 2)) <= MIN_ARRAY_SORT_GRAN) ?
             MIN_ARRAY_SORT_GRAN : g).invoke();
}
```

并行排序的性能在多核心CPU环境下，肯定是优于普通排序的，并且排序规模越大优势越显著。

至此，并发编程篇完结。
