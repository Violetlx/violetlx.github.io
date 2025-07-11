---
title: 并发编程核心
date: 2025/06/20
---

![动漫女孩 长发 伞 雨天 4k壁纸](https://bizhi1.com/wp-content/uploads/2024/03/bizhi1-23-anime-small.jpg)

在前面，我们了解了多线程的底层运作机制，我们终于知道，原来多线程环境下存在着如此之多的问题。在JDK5之前，我们只能选择`synchronized`关键字来实现锁，而JDK5之后，由于`volatile`关键字得到了升级（具体功能就是上一章所描述的），所以并发框架包便出现了，相比传统的`synchronized`关键字，我们对于锁的实现，有了更多的选择。

> Doug Lea — JUC并发包的作者
>
> 如果IT的历史，是以人为主体串接起来的话，那么肯定少不了Doug Lea。这个鼻梁挂着眼镜，留着德王威廉二世的胡子，脸上永远挂着谦逊腼腆笑容，服务于纽约州立大学Oswego分校计算机科学系的老大爷。
>
> 说他是这个世界上对Java影响力最大的一个人，一点也不为过。因为两次Java历史上的大变革，他都间接或直接的扮演了举足轻重的角色。2004年所推出的Tiger。Tiger广纳了15项JSRs(Java Specification Requests)的语法及标准，其中一项便是JSR-166。JSR-166是来自于Doug编写的util.concurrent包。

那么，从这章开始，就让我们来感受一下，JUC为我们带来了什么。

***

## 锁框架

在JDK 5之后，并发包中新增了Lock接口（以及相关实现类）用来实现锁功能，Lock接口提供了与synchronized关键字类似的同步功能，但需要在使用时手动获取锁和释放锁。

### Lock和Condition接口

使用并发包中的锁和我们传统的`synchronized`锁不太一样，这里的锁我们可以认为是一把真正意义上的锁，每个锁都是一个对应的锁对象，我只需要向锁对象获取锁或是释放锁即可。我们首先来看看，此接口中定义了什么：

```java
public interface Lock {
  	//获取锁，拿不到锁会阻塞，等待其他线程释放锁，获取到锁后返回
    void lock();
  	//同上，但是等待过程中会响应中断
    void lockInterruptibly() throws InterruptedException;
  	//尝试获取锁，但是不会阻塞，如果能获取到会返回true，不能返回false
    boolean tryLock();
  	//尝试获取锁，但是可以限定超时时间，如果超出时间还没拿到锁返回false，否则返回true，可以响应中断
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
  	//释放锁
    void unlock();
  	//暂时可以理解为替代传统的Object的wait()、notify()等操作的工具
    Condition newCondition();
}
```

这里我们可以演示一下，如何使用Lock类来进行加锁和释放锁操作：

```java
public class Main {
    private static int i = 0;
    public static void main(String[] args) throws InterruptedException {
        Lock testLock = new ReentrantLock();   //可重入锁ReentrantLock类是Lock类的一个实现，我们后面会进行介绍
        Runnable action = () -> {
            for (int j = 0; j < 100000; j++) {   //还是以自增操作为例
                testLock.lock();    //加锁，加锁成功后其他线程如果也要获取锁，会阻塞，等待当前线程释放
                i++;
                testLock.unlock();  //解锁，释放锁之后其他线程就可以获取这把锁了（注意在这之前一定得加锁，不然报错）
            }
        };
        new Thread(action).start();
        new Thread(action).start();
        Thread.sleep(1000);   //等上面两个线程跑完
        System.out.println(i);
    }
}
```

可以看到，和我们之前使用`synchronized`相比，我们这里是真正在操作一个"锁"对象，当我们需要加锁时，只需要调用`lock()`方法，而需要释放锁时，只需要调用`unlock()`方法。程序运行的最终结果和使用`synchronized`锁是一样的。

那么，我们如何像传统的加锁那样，调用对象的`wait()`和`notify()`方法呢，并发包提供了Condition接口：

```java
public interface Condition {
  	//与调用锁对象的wait方法一样，会进入到等待状态，但是这里需要调用Condition的signal或signalAll方法进行唤醒（感觉就是和普通对象的wait和notify是对应的）同时，等待状态下是可以响应中断的
 		void await() throws InterruptedException;
  	//同上，但不响应中断（看名字都能猜到）
  	void awaitUninterruptibly();
  	//等待指定时间，如果在指定时间（纳秒）内被唤醒，会返回剩余时间，如果超时，会返回0或负数，可以响应中断
  	long awaitNanos(long nanosTimeout) throws InterruptedException;
  	//等待指定时间（可以指定时间单位），如果等待时间内被唤醒，返回true，否则返回false，可以响应中断
  	boolean await(long time, TimeUnit unit) throws InterruptedException;
  	//可以指定一个明确的时间点，如果在时间点之前被唤醒，返回true，否则返回false，可以响应中断
  	boolean awaitUntil(Date deadline) throws InterruptedException;
  	//唤醒一个处于等待状态的线程，注意还得获得锁才能接着运行
  	void signal();
  	//同上，但是是唤醒所有等待线程
  	void signalAll();
}
```

这里我们通过一个简单的例子来演示一下：

```java
public static void main(String[] args) throws InterruptedException {
    Lock testLock = new ReentrantLock();
    Condition condition = testLock.newCondition();
    new Thread(() -> {
        testLock.lock();   //和synchronized一样，必须持有锁的情况下才能使用await
        System.out.println("线程1进入等待状态！");
        try {
            condition.await();   //进入等待状态
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("线程1等待结束！");
        testLock.unlock();
    }).start();
    Thread.sleep(100); //防止线程2先跑
    new Thread(() -> {
        testLock.lock();
        System.out.println("线程2开始唤醒其他等待线程");
        condition.signal();   //唤醒线程1，但是此时线程1还必须要拿到锁才能继续运行
        System.out.println("线程2结束");
        testLock.unlock();   //这里释放锁之后，线程1就可以拿到锁继续运行了
    }).start();
}
```

可以发现，Condition对象使用方法和传统的对象使用差别不是很大。

**思考：** 下面这种情况跟上面有什么不同？

```java
public static void main(String[] args) throws InterruptedException {
    Lock testLock = new ReentrantLock();
    new Thread(() -> {
        testLock.lock();
        System.out.println("线程1进入等待状态！");
        try {
            testLock.newCondition().await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("线程1等待结束！");
        testLock.unlock();
    }).start();
    Thread.sleep(100);
    new Thread(() -> {
        testLock.lock();
        System.out.println("线程2开始唤醒其他等待线程");
        testLock.newCondition().signal();
        System.out.println("线程2结束");
        testLock.unlock();
    }).start();
}
```

通过分析可以得到，在调用`newCondition()`后，会生成一个新的Condition对象，并且同一把锁内是可以存在多个Condition对象的（实际上原始的锁机制等待队列只能有一个，而这里可以创建很多个Condition来实现多等待队列），而上面的例子中，实际上使用的是不同的Condition对象，只有对同一个Condition对象进行等待和唤醒操作才会有效，而不同的Condition对象是分开计算的。

最后我们再来讲解一下时间单位，这是一个枚举类，也是位于`java.util.concurrent`包下：

```java
public enum TimeUnit {
    /**
     * Time unit representing one thousandth of a microsecond
     */
    NANOSECONDS {
        public long toNanos(long d)   { return d; }
        public long toMicros(long d)  { return d/(C1/C0); }
        public long toMillis(long d)  { return d/(C2/C0); }
        public long toSeconds(long d) { return d/(C3/C0); }
        public long toMinutes(long d) { return d/(C4/C0); }
        public long toHours(long d)   { return d/(C5/C0); }
        public long toDays(long d)    { return d/(C6/C0); }
        public long convert(long d, TimeUnit u) { return u.toNanos(d); }
        int excessNanos(long d, long m) { return (int)(d - (m*C2)); }
    },
  	//....
```

可以看到时间单位有很多的，比如`DAY`、`SECONDS`、`MINUTES`等，我们可以直接将其作为时间单位，比如我们要让一个线程等待3秒钟，可以像下面这样编写：

```java
public static void main(String[] args) throws InterruptedException {
    Lock testLock = new ReentrantLock();
    new Thread(() -> {
        testLock.lock();
        try {
            System.out.println("等待是否未超时："+testLock.newCondition().await(1, TimeUnit.SECONDS));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        testLock.unlock();
    }).start();
}
```

当然，Lock类的tryLock方法也是支持使用时间单位的，各位可以自行进行测试。TimeUnit除了可以作为时间单位表示以外，还可以在不同单位之间相互转换：

```java
public static void main(String[] args) throws InterruptedException {
    System.out.println("60秒 = "+TimeUnit.SECONDS.toMinutes(60) +"分钟");
    System.out.println("365天 = "+TimeUnit.DAYS.toSeconds(365) +" 秒");
}
```

也可以更加便捷地使用对象的`wait()`方法：

```java
public static void main(String[] args) throws InterruptedException {
    synchronized (Main.class) {
        System.out.println("开始等待");
        TimeUnit.SECONDS.timedWait(Main.class, 3);   //直接等待3秒
        System.out.println("等待结束");
    }
}
```

我们也可以直接使用它来进行休眠操作：

```java
public static void main(String[] args) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);  //休眠1秒钟
}
```

### 可重入锁

前面，我们讲解了锁框架的两个核心接口，那么我们接着来看看锁接口的具体实现类，我们前面用到了ReentrantLock，它其实是锁的一种，叫做可重入锁，那么这个可重入代表的是什么意思呢？简单来说，就是同一个线程，可以反复进行加锁操作：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantLock lock = new ReentrantLock();
    lock.lock();
    lock.lock();   //连续加锁2次
    new Thread(() -> {
        System.out.println("线程2想要获取锁");
        lock.lock();
        System.out.println("线程2成功获取到锁");
    }).start();
    lock.unlock();
    System.out.println("线程1释放了一次锁");
    TimeUnit.SECONDS.sleep(1);
    lock.unlock();
    System.out.println("线程1再次释放了一次锁");  //释放两次后其他线程才能加锁
}
```

可以看到，主线程连续进行了两次加锁操作（此操作是不会被阻塞的），在当前线程持有锁的情况下继续加锁不会被阻塞，并且，加锁几次，就必须要解锁几次，否则此线程依旧持有锁。我们可以使用`getHoldCount()`方法查看当前线程的加锁次数：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantLock lock = new ReentrantLock();
    lock.lock();
    lock.lock();
    System.out.println("当前加锁次数："+lock.getHoldCount()+"，是否被锁："+lock.isLocked());
    TimeUnit.SECONDS.sleep(1);
    lock.unlock();
    System.out.println("当前加锁次数："+lock.getHoldCount()+"，是否被锁："+lock.isLocked());
    TimeUnit.SECONDS.sleep(1);
    lock.unlock();
    System.out.println("当前加锁次数："+lock.getHoldCount()+"，是否被锁："+lock.isLocked());
}
```

可以看到，当锁不再被任何线程持有时，值为`0`，并且通过`isLocked()`方法查询结果为`false`。

实际上，如果存在线程持有当前的锁，那么其他线程在获取锁时，是会暂时进入到等待队列的，我们可以通过`getQueueLength()`方法获取等待中线程数量的预估值：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantLock lock = new ReentrantLock();
    lock.lock();
    Thread t1 = new Thread(lock::lock), t2 = new Thread(lock::lock);;
    t1.start();
    t2.start();
    TimeUnit.SECONDS.sleep(1);
    System.out.println("当前等待锁释放的线程数："+lock.getQueueLength());
    System.out.println("线程1是否在等待队列中："+lock.hasQueuedThread(t1));
    System.out.println("线程2是否在等待队列中："+lock.hasQueuedThread(t2));
    System.out.println("当前线程是否在等待队列中："+lock.hasQueuedThread(Thread.currentThread()));
}
```

我们可以通过`hasQueuedThread()`方法来判断某个线程是否正在等待获取锁状态。

同样的，Condition也可以进行判断：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantLock lock = new ReentrantLock();
    Condition condition = lock.newCondition();
    new Thread(() -> {
       lock.lock();
        try {
            condition.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        lock.unlock();
    }).start();
    TimeUnit.SECONDS.sleep(1);
    lock.lock();
    System.out.println("当前Condition的等待线程数："+lock.getWaitQueueLength(condition));
    condition.signal();
    System.out.println("当前Condition的等待线程数："+lock.getWaitQueueLength(condition));
    lock.unlock();
}
```

通过使用`getWaitQueueLength()`方法能够查看同一个Condition目前有多少线程处于等待状态。

#### 公平锁与非公平锁

前面我们了解了如果线程之间争抢同一把锁，会暂时进入到等待队列中，那么多个线程获得锁的顺序是不是一定是根据线程调用`lock()`方法时间来定的呢，我们可以看到，`ReentrantLock`的构造方法中，是这样写的：

```java
public ReentrantLock() {
    sync = new NonfairSync();   //看名字貌似是非公平的
}
```

其实锁分为公平锁和非公平锁，默认我们创建出来的ReentrantLock是采用的非公平锁作为底层锁机制。那么什么是公平锁什么又是非公平锁呢？

* 公平锁：多个线程按照申请锁的顺序去获得锁，线程会直接进入队列去排队，永远都是队列的第一位才能得到锁。
* 非公平锁：多个线程去获取锁的时候，会直接去尝试获取，获取不到，再去进入等待队列，如果能获取到，就直接获取到锁。

简单来说，公平锁不让插队，都老老实实排着；非公平锁让插队，但是排队的人让不让你插队就是另一回事了。

我们可以来测试一下公平锁和非公平锁的表现情况：

```java
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

这里我们选择使用第二个构造方法，可以选择是否为公平锁实现：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantLock lock = new ReentrantLock(false);

    Runnable action = () -> {
        System.out.println("线程 "+Thread.currentThread().getName()+" 开始获取锁...");
        lock.lock();
        System.out.println("线程 "+Thread.currentThread().getName()+" 成功获取锁！");
        lock.unlock();
    };
    for (int i = 0; i < 10; i++) {   //建立10个线程
        new Thread(action, "T"+i).start();
    }
}
```

这里我们只需要对比`将在1秒后开始获取锁...`和`成功获取锁！`的顺序是否一致即可，如果是一致，那说明所有的线程都是按顺序排队获取的锁，如果不是，那说明肯定是有线程插队了。

运行结果可以发现，在公平模式下，确实是按照顺序进行的，而在非公平模式下，一般会出现这种情况：线程刚开始获取锁马上就能抢到，并且此时之前早就开始的线程还在等待状态，很明显的插队行为。

那么，接着下一个问题，公平锁在任何情况下都一定是公平的吗？有关这个问题，我们会留到队列同步器中再进行讨论。

***

### 读写锁

除了可重入锁之外，还有一种类型的锁叫做读写锁，当然它并不是专门用作读写操作的锁，它和可重入锁不同的地方在于，可重入锁是一种排他锁，当一个线程得到锁之后，另一个线程必须等待其释放锁，否则一律不允许获取到锁。而读写锁在同一时间，是可以让多个线程获取到锁的，它其实就是针对于读写场景而出现的。

读写锁维护了一个读锁和一个写锁，这两个锁的机制是不同的。

* 读锁：在没有任何线程占用写锁的情况下，同一时间可以有多个线程加读锁。
* 写锁：在没有任何线程占用读锁的情况下，同一时间只能有一个线程加写锁。

读写锁也有一个专门的接口：

```java
public interface ReadWriteLock {
    //获取读锁
    Lock readLock();

  	//获取写锁
    Lock writeLock();
}
```

此接口有一个实现类ReentrantReadWriteLock（实现的是ReadWriteLock接口，不是Lock接口，它本身并不是锁），注意我们操作ReentrantReadWriteLock时，不能直接上锁，而是需要获取读锁或是写锁，再进行锁操作：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    lock.readLock().lock();
    new Thread(lock.readLock()::lock).start();
}
```

这里我们对读锁加锁，可以看到可以多个线程同时对读锁加锁。

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    lock.readLock().lock();
    new Thread(lock.writeLock()::lock).start();
}
```

有读锁状态下无法加写锁，反之亦然：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    lock.writeLock().lock();
    new Thread(lock.readLock()::lock).start();
}
```

并且，ReentrantReadWriteLock不仅具有读写锁的功能，还保留了可重入锁和公平/非公平机制，比如同一个线程可以重复为写锁加锁，并且必须全部解锁才真正释放锁：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    lock.writeLock().lock();
    lock.writeLock().lock();
    new Thread(() -> {
        lock.writeLock().lock();
        System.out.println("成功获取到写锁！");
    }).start();
    System.out.println("释放第一层锁！");
    lock.writeLock().unlock();
    TimeUnit.SECONDS.sleep(1);
    System.out.println("释放第二层锁！");
    lock.writeLock().unlock();
}
```

通过之前的例子来验证公平和非公平：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock(true);

    Runnable action = () -> {
        System.out.println("线程 "+Thread.currentThread().getName()+" 将在1秒后开始获取锁...");
        lock.writeLock().lock();
        System.out.println("线程 "+Thread.currentThread().getName()+" 成功获取锁！");
        lock.writeLock().unlock();
    };
    for (int i = 0; i < 10; i++) {   //建立10个线程
        new Thread(action, "T"+i).start();
    }
}
```

可以看到，结果是一致的。

#### 锁降级和锁升级

锁降级指的是写锁降级为读锁。当一个线程持有写锁的情况下，虽然其他线程不能加读锁，但是线程自己是可以加读锁的：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    lock.writeLock().lock();
    lock.readLock().lock();
    System.out.println("成功加读锁！");
}
```

那么，如果我们在同时加了写锁和读锁的情况下，释放写锁，是否其他的线程就可以一起加读锁了呢？

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    lock.writeLock().lock();
    lock.readLock().lock();
    new Thread(() -> {
        System.out.println("开始加读锁！");
        lock.readLock().lock();
        System.out.println("读锁添加成功！");
    }).start();
    TimeUnit.SECONDS.sleep(1);
    lock.writeLock().unlock();    //如果释放写锁，会怎么样？
}
```

可以看到，一旦写锁被释放，那么主线程就只剩下读锁了，因为读锁可以被多个线程共享，所以这时第二个线程也添加了读锁。而这种操作，就被称之为"锁降级"（注意不是先释放写锁再加读锁，而是持有写锁的情况下申请读锁再释放写锁）

注意在仅持有读锁的情况下去申请写锁，属于"锁升级"，ReentrantReadWriteLock是不支持的：

```java
public static void main(String[] args) throws InterruptedException {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    lock.readLock().lock();
    lock.writeLock().lock();
    System.out.println("所升级成功！");
}
```

可以看到线程直接卡在加写锁的那一句了。

### 队列同步器AQS

**注意：** 难度巨大，如果对锁的使用不是很熟悉建议之后再来看！

前面我们了解了可重入锁和读写锁，那么它们的底层实现原理到底是什么样的呢？又是大家看到就想跳过的套娃解析环节。

比如我们执行了ReentrantLock的`lock()`方法，那它的内部是怎么在执行的呢？

```java
public void lock() {
    sync.lock();
}
```

可以看到，它的内部实际上啥都没做，而是交给了Sync对象在进行，并且，不只是这个方法，其他的很多方法都是依靠Sync对象在进行：

```java
public void unlock() {
    sync.release(1);
}
```

那么这个Sync对象是干什么的呢？可以看到，公平锁和非公平锁都是继承自Sync，而Sync是继承自AbstractQueuedSynchronizer，简称队列同步器：

```java
abstract static class Sync extends AbstractQueuedSynchronizer {
   //...
}

static final class NonfairSync extends Sync {}
static final class FairSync extends Sync {}
```

所以，要了解它的底层到底是如何进行操作的，还得看队列同步器，我们就先从这里下手吧！

#### 底层实现

AbstractQueuedSynchronizer（下面称为AQS）是实现锁机制的基础，它的内部封装了包括锁的获取、释放、以及等待队列。

一个锁（排他锁为例）的基本功能就是获取锁、释放锁、当锁被占用时，其他线程来争抢会进入等待队列，AQS已经将这些基本的功能封装完成了，其中等待队列是核心内容，等待队列是由双向链表数据结构实现的，每个等待状态下的线程都可以被封装进结点中并放入双向链表中，而对于双向链表是以队列的形式进行操作的，它像这样：

![image-20230306171328049](https://oss.itbaima.cn/internal/markdown/2023/03/06/KMmHZ6g7xVO5zcG.png)

AQS中有一个`head`字段和一个`tail`字段分别记录双向链表的头结点和尾结点，而之后的一系列操作都是围绕此队列来进行的。我们先来了解一下每个结点都包含了哪些内容：

```java
//每个处于等待状态的线程都可以是一个节点，并且每个节点是有很多状态的
static final class Node {
  	//每个节点都可以被分为独占模式节点或是共享模式节点，分别适用于独占锁和共享锁
    static final Node SHARED = new Node();
    static final Node EXCLUSIVE = null;

  	//等待状态，这里都定义好了
   	//唯一一个大于0的状态，表示已失效，可能是由于超时或中断，此节点被取消。
    static final int CANCELLED =  1;
  	//此节点后面的节点被挂起（进入等待状态）
    static final int SIGNAL    = -1;	
  	//在条件队列中的节点才是这个状态
    static final int CONDITION = -2;
  	//传播，一般用于共享锁
    static final int PROPAGATE = -3;

    volatile int waitStatus;    //等待状态值
    volatile Node prev;   //双向链表基操
    volatile Node next;
    volatile Thread thread;   //每一个线程都可以被封装进一个节点进入到等待队列
  
    Node nextWaiter;   //在等待队列中表示模式，条件队列中作为下一个结点的指针

    final boolean isShared() {
        return nextWaiter == SHARED;
    }

    final Node predecessor() throws NullPointerException {
        Node p = prev;
        if (p == null)
            throw new NullPointerException();
        else
            return p;
    }

    Node() {
    }

    Node(Thread thread, Node mode) {
        this.nextWaiter = mode;
        this.thread = thread;
    }

    Node(Thread thread, int waitStatus) {
        this.waitStatus = waitStatus;
        this.thread = thread;
    }
}
```

在一开始的时候，`head`和`tail`都是`null`，`state`为默认值`0`：

```java
private transient volatile Node head;

private transient volatile Node tail;

private volatile int state;
```

不用担心双向链表不会进行初始化，初始化是在实际使用时才开始的，先不管，我们接着来看其他的初始化内容：

```java
//直接使用Unsafe类进行操作
private static final Unsafe unsafe = Unsafe.getUnsafe();
//记录类中属性的在内存中的偏移地址，方便Unsafe类直接操作内存进行赋值等（直接修改对应地址的内存）
private static final long stateOffset;   //这里对应的就是AQS类中的state成员字段
private static final long headOffset;    //这里对应的就是AQS类中的head头结点成员字段
private static final long tailOffset;
private static final long waitStatusOffset;
private static final long nextOffset;

static {   //静态代码块，在类加载的时候就会自动获取偏移地址
    try {
        stateOffset = unsafe.objectFieldOffset
            (AbstractQueuedSynchronizer.class.getDeclaredField("state"));
        headOffset = unsafe.objectFieldOffset
            (AbstractQueuedSynchronizer.class.getDeclaredField("head"));
        tailOffset = unsafe.objectFieldOffset
            (AbstractQueuedSynchronizer.class.getDeclaredField("tail"));
        waitStatusOffset = unsafe.objectFieldOffset
            (Node.class.getDeclaredField("waitStatus"));
        nextOffset = unsafe.objectFieldOffset
            (Node.class.getDeclaredField("next"));

    } catch (Exception ex) { throw new Error(ex); }
}

//通过CAS操作来修改头结点
private final boolean compareAndSetHead(Node update) {
  	//调用的是Unsafe类的compareAndSwapObject方法，通过CAS算法比较对象并替换
    return unsafe.compareAndSwapObject(this, headOffset, null, update);
}

//同上，省略部分代码
private final boolean compareAndSetTail(Node expect, Node update) {

private static final boolean compareAndSetWaitStatus(Node node, int expect, int update) {

private static final boolean compareAndSetNext(Node node, Node expect, Node update) {
```

可以发现，队列同步器由于要使用到CAS算法，所以，直接使用了Unsafe工具类，Unsafe类中提供了CAS操作的方法（Java无法实现，底层由C++实现）所有对AQS类中成员字段的修改，都有对应的CAS操作封装。

现在我们大致了解了一下它的底层运作机制，我们接着来看这个类是如何进行使用的，它提供了一些可重写的方法（根据不同的锁类型和机制，可以自由定制规则，并且为独占式和非独占式锁都提供了对应的方法），以及一些已经写好的模板方法（模板方法会调用这些可重写的方法），使用此类只需要将可重写的方法进行重写，并调用提供的模板方法，从而实现锁功能（学习过设计模式会比较好理解一些）

我们首先来看可重写方法：

```java
//独占式获取同步状态，查看同步状态是否和参数一致，如果返没有问题，那么会使用CAS操作设置同步状态并返回true
protected boolean tryAcquire(int arg) {
    throw new UnsupportedOperationException();
}

//独占式释放同步状态
protected boolean tryRelease(int arg) {
    throw new UnsupportedOperationException();
}

//共享式获取同步状态，返回值大于0表示成功，否则失败
protected int tryAcquireShared(int arg) {
    throw new UnsupportedOperationException();
}

//共享式释放同步状态
protected boolean tryReleaseShared(int arg) {
    throw new UnsupportedOperationException();
}

//是否在独占模式下被当前线程占用（锁是否被当前线程持有）
protected boolean isHeldExclusively() {
    throw new UnsupportedOperationException();
}
```

可以看到，这些需要重写的方法默认是直接抛出`UnsupportedOperationException`，也就是说根据不同的锁类型，我们需要去实现对应的方法，我们可以来看一下ReentrantLock（此类是全局独占式的）中的公平锁是如何借助AQS实现的：

```java
static final class FairSync extends Sync {
    private static final long serialVersionUID = -3000897897090466540L;

  	//加锁操作调用了模板方法acquire
  	//为了防止各位绕晕，请时刻记住，lock方法一定是在某个线程下为了加锁而调用的，并且同一时间可能会有其他线程也在调用此方法
    final void lock() {
        acquire(1);
    }

    ...
}
```

我们先看看加锁操作干了什么事情，这里直接调用了AQS提供的模板方法`acquire()`，我们来看看它在AQS类中的实现细节：

```java
@ReservedStackAccess //这个是JEP 270添加的新注解，它会保护被注解的方法，通过添加一些额外的空间，防止在多线程运行的时候出现栈溢出，下同
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))   //节点为独占模式Node.EXCLUSIVE
        selfInterrupt();
}
```

首先会调用`tryAcquire()`方法（这里是由FairSync类实现的），如果尝试加独占锁失败（返回false了）说明可能这个时候有其他线程持有了此独占锁，所以当前线程得先等着，那么会调用`addWaiter()`方法将线程加入等待队列中：

```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // 先尝试使用CAS直接入队，如果这个时候其他线程也在入队（就是不止一个线程在同一时间争抢这把锁）就进入enq()
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
  	//此方法是CAS快速入队失败时调用
    enq(node);
    return node;
}

private Node enq(final Node node) {
  	//自旋形式入队，可以看到这里是一个无限循环
    for (;;) {
        Node t = tail;
        if (t == null) {  //这种情况只能说明头结点和尾结点都还没初始化
            if (compareAndSetHead(new Node()))   //初始化头结点和尾结点
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;   //只有CAS成功的情况下，才算入队成功，如果CAS失败，那说明其他线程同一时间也在入队，并且手速还比当前线程快，刚好走到CAS操作的时候，其他线程就先入队了，那么这个时候node.prev就不是我们预期的节点了，而是另一个线程新入队的节点，所以说得进下一次循环再来一次CAS，这种形式就是自旋
            }
        }
    }
}
```

在了解了`addWaiter()`方法会将节点加入等待队列之后，我们接着来看，`addWaiter()`会返回已经加入的节点，`acquireQueued()`在得到返回的节点时，也会进入自旋状态，等待唤醒（也就是开始进入到拿锁的环节了）：

```java
@ReservedStackAccess
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {   //可以看到当此节点位于队首(node.prev == head)时，会再次调用tryAcquire方法获取锁，如果获取成功，会返回此过程中是否被中断的值
                setHead(node);    //新的头结点设置为当前结点
                p.next = null; // 原有的头结点没有存在的意义了
                failed = false;   //没有失败
                return interrupted;   //直接返回等待过程中是否被中断
            }	
          	//依然没获取成功，
            if (shouldParkAfterFailedAcquire(p, node) &&   //将当前节点的前驱节点等待状态设置为SIGNAL，如果失败将直接开启下一轮循环，直到成功为止，如果成功接着往下
                parkAndCheckInterrupt())   //挂起线程进入等待状态，等待被唤醒，如果在等待状态下被中断，那么会返回true，直接将中断标志设为true，否则就是正常唤醒，继续自旋
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}

private final boolean parkAndCheckInterrupt() {
    LockSupport.park(this);   //通过unsafe类操作底层挂起线程（会直接进入阻塞状态）
    return Thread.interrupted();
}
```

```java
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
    int ws = pred.waitStatus;
    if (ws == Node.SIGNAL)
        return true;   //已经是SIGNAL，直接true
    if (ws > 0) {   //不能是已经取消的节点，必须找到一个没被取消的
        do {
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;   //直接抛弃被取消的节点
    } else {
        //不是SIGNAL，先CAS设置为SIGNAL（这里没有返回true因为CAS不一定成功，需要下一轮再判断一次）
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;   //返回false，马上开启下一轮循环
}
```

所以，`acquire()`中的if条件如果为true，那么只有一种情况，就是等待过程中被中断了，其他任何情况下都是成功获取到独占锁，所以当等待过程被中断时，会调用`selfInterrupt()`方法：

```java
static void selfInterrupt() {
    Thread.currentThread().interrupt();
}
```

这里就是直接向当前线程发送中断信号了。

上面提到了LockSupport类，它是一个工具类，我们也可以来玩一下这个`park`和`unpark`:

```java
public static void main(String[] args) throws InterruptedException {
    Thread t = Thread.currentThread();  //先拿到主线程的Thread对象
    new Thread(() -> {
        try {
            TimeUnit.SECONDS.sleep(1);
            System.out.println("主线程可以继续运行了！");
            LockSupport.unpark(t);
          	//t.interrupt();   发送中断信号也可以恢复运行
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }).start();
    System.out.println("主线程被挂起！");
    LockSupport.park();
    System.out.println("主线程继续运行！");
}
```

这里我们就把公平锁的`lock()`方法实现讲解完毕了（让我猜猜，已经晕了对吧，越是到源码越考验个人的基础知识掌握，基础不牢地动山摇）接着我们来看公平锁的`tryAcquire()`方法：

```java
static final class FairSync extends Sync {
  	//可重入独占锁的公平实现
    @ReservedStackAccess
    protected final boolean tryAcquire(int acquires) {
        final Thread current = Thread.currentThread();   //先获取当前线程的Thread对象
        int c = getState();     //获取当前AQS对象状态（独占模式下0为未占用，大于0表示已占用）
        if (c == 0) {       //如果是0，那就表示没有占用，现在我们的线程就要来尝试占用它
            if (!hasQueuedPredecessors() &&    //等待队列是否不为空且当前线程没有拿到锁，其实就是看看当前线程有没有必要进行排队，如果没必要排队，就说明可以直接获取锁
                compareAndSetState(0, acquires)) {   //CAS设置状态，如果成功则说明成功拿到了这把锁，失败则说明可能这个时候其他线程在争抢，并且还比你先抢到
                setExclusiveOwnerThread(current);    //成功拿到锁，会将独占模式所有者线程设定为当前线程（这个方法是父类AbstractOwnableSynchronizer中的，就表示当前这把锁已经是这个线程的了）
                return true;   //占用锁成功，返回true
            }
        }
        else if (current == getExclusiveOwnerThread()) {   //如果不是0，那就表示被线程占用了，这个时候看看是不是自己占用的，如果是，由于是可重入锁，可以继续加锁
            int nextc = c + acquires;    //多次加锁会将状态值进行增加，状态值就是加锁次数
            if (nextc < 0)   //加到int值溢出了？
                throw new Error("Maximum lock count exceeded");
            setState(nextc);   //设置为新的加锁次数
            return true;
        }
        return false;   //其他任何情况都是加锁失败
    }
}
```

在了解了公平锁的实现之后，是不是感觉有点恍然大悟的感觉，虽然整个过程非常复杂，但是只要理清思路，还是比较简单的。

加锁过程已经OK，我们接着来看，它的解锁过程，`unlock()`方法是在AQS中实现的：

```java
public void unlock() {
    sync.release(1);    //直接调用了AQS中的release方法，参数为1表示解锁一次state值-1
}
```

```java
@ReservedStackAccess
public final boolean release(int arg) {
    if (tryRelease(arg)) {   //和tryAcquire一样，也得子类去重写，释放锁操作
        Node h = head;    //释放锁成功后，获取新的头结点
        if (h != null && h.waitStatus != 0)   //如果新的头结点不为空并且不是刚刚建立的结点（初始状态下status为默认值0，而上面在进行了shouldParkAfterFailedAcquire之后，会被设定为SIGNAL状态，值为-1）
            unparkSuccessor(h);   //唤醒头节点下一个节点中的线程
        return true;
    }
    return false;
}
```

```java
private void unparkSuccessor(Node node) {
    // 将等待状态waitStatus设置为初始值0
    int ws = node.waitStatus;
    if (ws < 0)
        compareAndSetWaitStatus(node, ws, 0);

    //获取下一个结点
    Node s = node.next;
    if (s == null || s.waitStatus > 0) {   //如果下一个结点为空或是等待状态是已取消，那肯定是不能通知unpark的，这时就要遍历所有节点再另外找一个符合unpark要求的节点了
        s = null;
        for (Node t = tail; t != null && t != node; t = t.prev)   //这里是从队尾向前，因为enq()方法中的t.next = node是在CAS之后进行的，而 node.prev = t 是CAS之前进行的，所以从后往前一定能够保证遍历所有节点
            if (t.waitStatus <= 0)
                s = t;
    }
    if (s != null)   //要是找到了，就直接unpark，要是还是没找到，那就算了
        LockSupport.unpark(s.thread);
}
```

那么我们来看看`tryRelease()`方法是怎么实现的，具体实现在Sync中：

```java
@ReservedStackAccess
protected final boolean tryRelease(int releases) {
    int c = getState() - releases;   //先计算本次解锁之后的状态值
    if (Thread.currentThread() != getExclusiveOwnerThread())   //因为是独占锁，那肯定这把锁得是当前线程持有才行
        throw new IllegalMonitorStateException();   //否则直接抛异常
    boolean free = false;
    if (c == 0) {  //如果解锁之后的值为0，表示已经完全释放此锁
        free = true;
        setExclusiveOwnerThread(null);  //将独占锁持有线程设置为null
    }
    setState(c);   //状态值设定为c
    return free;  //如果不是0表示此锁还没完全释放，返回false，是0就返回true
}
```

综上，我们来画一个完整的流程图：

![image-20230306171428206](https://oss.itbaima.cn/internal/markdown/2023/03/06/fUmwyGTRdCKAOlM.png)

这里我们只讲解了公平锁，有关非公平锁和读写锁，还请各位观众根据我们之前的思路，自行解读。

#### 公平锁一定公平吗？

前面我们讲解了公平锁的实现原理，那么，我们尝试分析一下，在并发的情况下，公平锁一定公平吗？

我们再次来回顾一下`tryAcquire()`方法的实现：

```java
@ReservedStackAccess
protected final boolean tryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        if (!hasQueuedPredecessors() &&   //注意这里，公平锁的机制是，一开始会查看是否有节点处于等待
            compareAndSetState(0, acquires)) {   //如果前面的方法执行后发现没有等待节点，就直接进入占锁环节了
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0)
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
```

所以`hasQueuedPredecessors()`这个环节容不得半点闪失，否则会直接破坏掉公平性，假如现在出现了这样的情况：

线程1已经持有锁了，这时线程2来争抢这把锁，走到`hasQueuedPredecessors()`，判断出为 `false`，线程2继续运行，然后线程2肯定获取锁失败（因为锁这时是被线程1占有的），因此就进入到等待队列中：

```java
private Node enq(final Node node) {
    for (;;) {
        Node t = tail;
        if (t == null) { // 线程2进来之后，肯定是要先走这里的，因为head和tail都是null
            if (compareAndSetHead(new Node()))
                tail = head;   //这里就将tail直接等于head了，注意这里完了之后还没完，这里只是初始化过程
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}

private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    Node pred = tail;
    if (pred != null) {   //由于一开始head和tail都是null，所以线程2直接就进enq()了
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);   //请看上面
    return node;
}
```

而碰巧不巧，这个时候线程3也来抢锁了，按照正常流程走到了`hasQueuedPredecessors()`方法，而在此方法中：

```java
public final boolean hasQueuedPredecessors() {
    Node t = tail; // Read fields in reverse initialization order
    Node h = head;
    Node s;
  	//这里直接判断h != t，而此时线程2才刚刚执行完 tail = head，所以直接就返回false了
    return h != t &&
        ((s = h.next) == null || s.thread != Thread.currentThread());
}
```

因此，线程3这时就紧接着准备开始CAS操作了，又碰巧，这时线程1释放锁了，现在的情况就是，线程3直接开始CAS判断，而线程2还在插入节点状态，结果可想而知，居然是线程3先拿到了锁，这显然是违背了公平锁的公平机制。

一张图就是：

![image-20230814160110441](https://oss.itbaima.cn/internal/markdown/2023/08/14/5IwjDocXvHpkW8O.png)

因此公不公平全看`hasQueuedPredecessors()`，而此方法只有在等待队列中存在节点时才能保证不会出现问题。所以公平锁，只有在等待队列存在节点时，才是真正公平的。

#### Condition实现原理

通过前面的学习，我们知道Condition类实际上就是用于代替传统对象的wait/notify操作的，同样可以实现等待/通知模式，并且同一把锁下可以创建多个Condition对象。那么我们接着来看看，它又是如何实现的呢，我们先从单个Condition对象进行分析：

在AQS中，Condition有一个实现类ConditionObject，而这里也是使用了链表实现了条件队列：

```java
public class ConditionObject implements Condition, java.io.Serializable {
    private static final long serialVersionUID = 1173984872572414699L;
    /** 条件队列的头结点 */
    private transient Node firstWaiter;
    /** 条件队列的尾结点 */
    private transient Node lastWaiter;
  
  	//...
```

这里是直接使用了AQS中的Node类，但是使用的是Node类中的nextWaiter字段连接节点，并且Node的status为CONDITION：

![image-20230306171600419](https://oss.itbaima.cn/internal/markdown/2023/03/06/h7z96EeqVvpHOLQ.png)

我们知道，当一个线程调用`await()`方法时，会进入等待状态，直到其他线程调用`signal()`方法将其唤醒，而这里的条件队列，正是用于存储这些处于等待状态的线程。

我们先来看看最关键的`await()`方法是如何实现的，为了防止一会绕晕，在开始之前，我们先明确此方法的目标：

* 只有已经持有锁的线程才可以使用此方法
* 当调用此方法后，会直接释放锁，无论加了多少次锁
* 只有其他线程调用`signal()`或是被中断时才会唤醒等待中的线程
* 被唤醒后，需要等待其他线程释放锁，拿到锁之后才可以继续执行，并且会恢复到之前的状态（await之前加了几层锁唤醒后依然是几层锁）

好了，差不多可以上源码了：

```java
public final void await() throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();   //如果在调用await之前就被添加了中断标记，那么会直接抛出中断异常
    Node node = addConditionWaiter();    //为当前线程创建一个新的节点，并将其加入到条件队列中
    int savedState = fullyRelease(node);    //完全释放当前线程持有的锁，并且保存一下state值，因为唤醒之后还得恢复
    int interruptMode = 0;     //用于保存中断状态
    while (!isOnSyncQueue(node)) {   //循环判断是否位于同步队列中，如果等待状态下的线程被其他线程唤醒，那么会正常进入到AQS的等待队列中（之后我们会讲）
        LockSupport.park(this);   //如果依然处于等待状态，那么继续挂起
        if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)   //看看等待的时候是不是被中断了
            break;
    }
  	//出了循环之后，那线程肯定是已经醒了，这时就差拿到锁就可以恢复运行了
    if (acquireQueued(node, savedState) && interruptMode != THROW_IE)  //直接开始acquireQueued尝试拿锁（之前已经讲过了）从这里开始基本就和一个线程去抢锁是一样的了
        interruptMode = REINTERRUPT;
  	//已经拿到锁了，基本可以开始继续运行了，这里再进行一下后期清理工作
    if (node.nextWaiter != null) 
        unlinkCancelledWaiters();  //将等待队列中，不是Node.CONDITION状态的节点移除
    if (interruptMode != 0)   //依然是响应中断
        reportInterruptAfterWait(interruptMode);
  	//OK，接着该干嘛干嘛
}
```

实际上`await()`方法比较中规中矩，大部分操作也在我们的意料之中，那么我们接着来看`signal()`方法是如何实现的，同样的，为了防止各位绕晕，先明确signal的目标：

* 只有持有锁的线程才能唤醒锁所属的Condition等待的线程
* 优先唤醒条件队列中的第一个，如果唤醒过程中出现问题，接着找往下找，直到找到一个可以唤醒的
* 唤醒操作本质上是将条件队列中的结点直接丢进AQS等待队列中，让其参与到锁的竞争中
* 拿到锁之后，线程才能恢复运行

![image-20230306171620786](https://oss.itbaima.cn/internal/markdown/2023/03/06/UjG1Dd5xNJhIyWm.png)

好了，上源码：

```java
public final void signal() {
    if (!isHeldExclusively())    //先看看当前线程是不是持有锁的状态
        throw new IllegalMonitorStateException();   //不是？那你不配唤醒别人
    Node first = firstWaiter;    //获取条件队列的第一个结点
    if (first != null)    //如果队列不为空，获取到了，那么就可以开始唤醒操作
        doSignal(first);
}
```

```java
private void doSignal(Node first) {
    do {
        if ( (firstWaiter = first.nextWaiter) == null)   //如果当前节点在本轮循环没有后继节点了，条件队列就为空了
            lastWaiter = null;   //所以这里相当于是直接清空
        first.nextWaiter = null;   //将给定节点的下一个结点设置为null，因为当前结点马上就会离开条件队列了
    } while (!transferForSignal(first) &&   //接着往下看
             (first = firstWaiter) != null);   //能走到这里只能说明给定节点被设定为了取消状态，那就继续看下一个结点
}
```

```java
final boolean transferForSignal(Node node) {
    /*
     * 如果这里CAS失败，那有可能此节点被设定为了取消状态
     */
    if (!compareAndSetWaitStatus(node, Node.CONDITION, 0))
        return false;

    //CAS成功之后，结点的等待状态就变成了默认值0，接着通过enq方法直接将节点丢进AQS的等待队列中，相当于唤醒并且可以等待获取锁了
  	//这里enq方法返回的是加入之后等待队列队尾的前驱节点，就是原来的tail
    Node p = enq(node);
    int ws = p.waitStatus;   //保存前驱结点的等待状态
  	//如果上一个节点的状态为取消, 或者尝试设置上一个节点的状态为SIGNAL失败（可能是在ws>0判断完之后马上变成了取消状态，导致CAS失败）
    if (ws > 0 || !compareAndSetWaitStatus(p, ws, Node.SIGNAL))
        LockSupport.unpark(node.thread);  //直接唤醒线程
    return true;
}
```

其实最让人不理解的就是倒数第二行，明明上面都正常进入到AQS等待队列了，应该是可以开始走正常流程了，那么这里为什么还要提前来一次unpark呢？

这里其实是为了进行优化而编写，直接unpark会有两种情况：

- 如果插入结点前，AQS等待队列的队尾节点就已经被取消，则满足wc > 0
- 如果插入node后，AQS内部等待队列的队尾节点已经稳定，满足tail.waitStatus == 0，但在执行ws >
  0之后!compareAndSetWaitStatus(p, ws,
  Node.SIGNAL)之前被取消，则CAS也会失败，满足compareAndSetWaitStatus(p, ws,
  Node.SIGNAL) == false

如果这里被提前unpark，那么在`await()`方法中将可以被直接唤醒，并跳出while循环，直接开始争抢锁，因为前一个等待结点是被取消的状态，没有必要再等它了。

所以，大致流程下：

![image-20230306171643082](https://oss.itbaima.cn/internal/markdown/2023/03/06/w9hvtNyAM74pO8m.png)

只要把整个流程理清楚，还是很好理解的。

#### 自行实现锁类

既然前面了解了那么多AQS的功能，那么我就仿照着这些锁类来实现一个简单的锁：

* 要求：同一时间只能有一个线程持有锁，不要求可重入（反复加锁无视即可）

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        
    }

    /**
     * 自行实现一个最普通的独占锁
     * 要求：同一时间只能有一个线程持有锁，不要求可重入
     */
    private static class MyLock implements Lock {

        /**
         * 设计思路：
         * 1. 锁被占用，那么exclusiveOwnerThread应该被记录，并且state = 1
         * 2. 锁没有被占用，那么exclusiveOwnerThread为null，并且state = 0
         */
        private static class Sync extends AbstractQueuedSynchronizer {
            @Override
            protected boolean tryAcquire(int arg) {
                if(isHeldExclusively()) return true;     //无需可重入功能，如果是当前线程直接返回true
                if(compareAndSetState(0, arg)){    //CAS操作进行状态替换
                    setExclusiveOwnerThread(Thread.currentThread());    //成功后设置当前的所有者线程
                    return true;
                }
                return false;
            }

            @Override
            protected boolean tryRelease(int arg) {
                if(getState() == 0)
                    throw new IllegalMonitorStateException();   //没加锁情况下是不能直接解锁的
                if(isHeldExclusively()){     //只有持有锁的线程才能解锁
                    setExclusiveOwnerThread(null);    //设置所有者线程为null
                    setState(0);    //状态变为0
                    return true;
                }
                return false;
            }

            @Override
            protected boolean isHeldExclusively() {
                return getExclusiveOwnerThread() == Thread.currentThread();
            }

            protected Condition newCondition(){
                return new ConditionObject();    //直接用现成的
            }
        }

        private final Sync sync = new Sync();

        @Override
        public void lock() {
            sync.acquire(1);
        }

        @Override
        public void lockInterruptibly() throws InterruptedException {
            sync.acquireInterruptibly(1);
        }

        @Override
        public boolean tryLock() {
            return sync.tryAcquire(1);
        }

        @Override
        public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
            return sync.tryAcquireNanos(1, unit.toNanos(time));
        }

        @Override
        public void unlock() {
            sync.release(1);
        }

        @Override
        public Condition newCondition() {
            return sync.newCondition();
        }
    }
}
```

到这里，我们对应队列同步器AQS的讲解就先到此为止了，当然，AQS的全部机制并非仅仅只有我们讲解的内容，一些我们没有提到的内容，还请各位观众自行探索，会有满满的成就感哦~

***

## 原子类

前面我们讲解了锁框架的使用和实现原理，虽然比较复杂，但是收获还是很多的（主要是观摩大佬写的代码）这一部分我们就来讲一点轻松的。

前面我们说到，如果要保证`i++`的原子性，那么我们的唯一选择就是加锁，那么，除了加锁之外，还有没有其他更好的解决方法呢？JUC为我们提供了原子类，底层采用CAS算法，它是一种用法简单、性能高效、线程安全地更新变量的方式。

所有的原子类都位于`java.util.concurrent.atomic`包下。

### 原子类介绍

常用基本数据类，有对应的原子类封装：

* AtomicInteger：原子更新int
* AtomicLong：原子更新long
* AtomicBoolean：原子更新boolean

那么，原子类和普通的基本类在使用上有没有什么区别呢？我们先来看正常情况下使用一个基本类型：

```java
public class Main {
    public static void main(String[] args) {
        int i = 1;
        System.out.println(i++);
    }
}
```

现在我们使用int类型对应的原子类，要实现同样的代码该如何编写：

```java
public class Main {
    public static void main(String[] args) {
        AtomicInteger i = new AtomicInteger(1);
        System.out.println(i.getAndIncrement());  //如果想实现i += 2这种操作，可以使用 addAndGet() 自由设置delta 值
    }
}
```

我们可以将int数值封装到此类中（注意必须调用构造方法，它不像Integer那样有装箱机制），并且通过调用此类提供的方法来获取或是对封装的int值进行自增，乍一看，这不就是基本类型包装类嘛，有啥高级的。确实，还真有包装类那味，但是它可不仅仅是简单的包装，它的自增操作是具有原子性的：

```java
public class Main {
    private static AtomicInteger i = new AtomicInteger(0);
    public static void main(String[] args) throws InterruptedException {
        Runnable r = () -> {
            for (int j = 0; j < 100000; j++)
                i.getAndIncrement();
            System.out.println("自增完成！");
        };
        new Thread(r).start();
        new Thread(r).start();
        TimeUnit.SECONDS.sleep(1);
        System.out.println(i.get());
    }
}
```

同样是直接进行自增操作，我们发现，使用原子类是可以保证自增操作原子性的，就跟我们前面加锁一样。怎么会这么神奇？我们来看看它的底层是如何实现的，直接从构造方法点进去：

```java
private volatile int value;

public AtomicInteger(int initialValue) {
    value = initialValue;
}

public AtomicInteger() {
}
```

可以看到，它的底层是比较简单的，其实本质上就是封装了一个`volatile`类型的int值，这样能够保证可见性，在CAS操作的时候不会出现问题。

```java
private static final Unsafe unsafe = Unsafe.getUnsafe();
private static final long valueOffset;

static {
    try {
        valueOffset = unsafe.objectFieldOffset
            (AtomicInteger.class.getDeclaredField("value"));
    } catch (Exception ex) { throw new Error(ex); }
}
```

可以看到最上面是和AQS采用了类似的机制，因为要使用CAS算法更新value的值，所以得先计算出value字段在对象中的偏移地址，CAS直接修改对应位置的内存即可（可见Unsafe类的作用巨大，很多的底层操作都要靠它来完成）

接着我们来看自增操作是怎么在运行的：

```java
public final int getAndIncrement() {
    return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

可以看到这里调用了`unsafe.getAndAddInt()`，套娃时间到，我们接着看看Unsafe里面写了什么：

```java
public final int getAndAddInt(Object o, long offset, int delta) {  //delta就是变化的值，++操作就是自增1
    int v;
    do {
      	//volatile版本的getInt()
      	//能够保证可见性
        v = getIntVolatile(o, offset);
    } while (!compareAndSwapInt(o, offset, v, v + delta));  //这里是开始cas替换int的值，每次都去拿最新的值去进行替换，如果成功则离开循环，不成功说明这个时候其他线程先修改了值，就进下一次循环再获取最新的值然后再cas一次，直到成功为止
    return v;
}
```

可以看到这是一个`do-while`循环，那么这个循环在做一个什么事情呢？感觉就和我们之前讲解的AQS队列中的机制差不多，也是采用自旋形式，来不断进行CAS操作，直到成功。

![image-20230306171720896](https://oss.itbaima.cn/internal/markdown/2023/03/06/JL3ZjbmwFW67tOM.png)

可见，原子类底层也是采用了CAS算法来保证的原子性，包括`getAndSet`、`getAndAdd`等方法都是这样。原子类也直接提供了CAS操作方法，我们可以直接使用：

```java
public static void main(String[] args) throws InterruptedException {
    AtomicInteger integer = new AtomicInteger(10);
    System.out.println(integer.compareAndSet(30, 20));
    System.out.println(integer.compareAndSet(10, 20));
    System.out.println(integer);
}
```

如果想以普通变量的方式来设定值，那么可以使用`lazySet()`方法，这样就不采用`volatile`的立即可见机制了。

```java
AtomicInteger integer = new AtomicInteger(1);
integer.lazySet(2);
```

除了基本类有原子类以外，基本类型的数组类型也有原子类：

* AtomicIntegerArray：原子更新int数组
* AtomicLongArray：原子更新long数组
* AtomicReferenceArray：原子更新引用数组

其实原子数组和原子类型一样的，不过我们可以对数组内的元素进行原子操作：

```java
public static void main(String[] args) throws InterruptedException {
    AtomicIntegerArray array = new AtomicIntegerArray(new int[]{0, 4, 1, 3, 5});
    Runnable r = () -> {
        for (int i = 0; i < 100000; i++)
            array.getAndAdd(0, 1);
    };
    new Thread(r).start();
    new Thread(r).start();
    TimeUnit.SECONDS.sleep(1);
    System.out.println(array.get(0));
}
```

在JDK8之后，新增了`DoubleAdder`和`LongAdder`，在高并发情况下，`LongAdder`的性能比`AtomicLong`的性能更好，主要体现在自增上，它的大致原理如下：在低并发情况下，和`AtomicLong`是一样的，对value值进行CAS操作，但是出现高并发的情况时，`AtomicLong`会进行大量的循环操作来保证同步，而`LongAdder`会将对value值的CAS操作分散为对数组`cells`中多个元素的CAS操作（内部维护一个Cell[] as数组，每个Cell里面有一个初始值为0的long型变量，在高并发时会进行分散CAS，就是不同的线程可以对数组中不同的元素进行CAS自增，这样就避免了所有线程都对同一个值进行CAS），只需要最后再将结果加起来即可。

![image-20230306171732740](https://oss.itbaima.cn/internal/markdown/2023/03/06/KksGxhMYABe7nED.png)

使用如下：

```java
public static void main(String[] args) throws InterruptedException {
    LongAdder adder = new LongAdder();
    Runnable r = () -> {
        for (int i = 0; i < 100000; i++)
            adder.add(1);
    };
    for (int i = 0; i < 100; i++)
        new Thread(r).start();   //100个线程
    TimeUnit.SECONDS.sleep(1);
    System.out.println(adder.sum());   //最后求和即可
}
```

由于底层源码比较复杂，这里就不做讲解了。两者的性能对比（这里用到了CountDownLatch，建议学完之后再来看）：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("使用AtomicLong的时间消耗："+test2()+"ms");
        System.out.println("使用LongAdder的时间消耗："+test1()+"ms");
    }

    private static long test1() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(100);
        LongAdder adder = new LongAdder();
        long timeStart = System.currentTimeMillis();
        Runnable r = () -> {
            for (int i = 0; i < 100000; i++)
                adder.add(1);
            latch.countDown();
        };
        for (int i = 0; i < 100; i++)
            new Thread(r).start();
        latch.await();
        return System.currentTimeMillis() - timeStart;
    }

    private static long test2() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(100);
        AtomicLong atomicLong = new AtomicLong();
        long timeStart = System.currentTimeMillis();
        Runnable r = () -> {
            for (int i = 0; i < 100000; i++)
                atomicLong.incrementAndGet();
            latch.countDown();
        };
        for (int i = 0; i < 100; i++)
            new Thread(r).start();
        latch.await();
        return System.currentTimeMillis() - timeStart;
    }
}
```

除了对基本数据类型支持原子操作外，对于引用类型，也是可以实现原子操作的：

```java
public static void main(String[] args) throws InterruptedException {
    String a = "Hello";
    String b = "World";
    AtomicReference<String> reference = new AtomicReference<>(a);
    reference.compareAndSet(a, b);
    System.out.println(reference.get());
}
```

JUC还提供了字段原子更新器，可以对类中的某个指定字段进行原子操作（注意字段必须添加volatile关键字）：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Student student = new Student();
        AtomicIntegerFieldUpdater<Student> fieldUpdater =
                AtomicIntegerFieldUpdater.newUpdater(Student.class, "age");
        System.out.println(fieldUpdater.incrementAndGet(student));
    }

    public static class Student{
        volatile int age;
    }
}
```

了解了这么多原子类，是不是感觉要实现保证原子性的工作更加轻松了？

### ABA问题及解决方案

我们来想象一下这种场景：

![image-20230306171801800](https://oss.itbaima.cn/internal/markdown/2023/03/06/KQjEvX1ZxohMT3l.png)

线程1和线程2同时开始对`a`的值进行CAS修改，但是线程1的速度比较快，将a的值修改为2之后紧接着又修改回1，这时线程2才开始进行判断，发现a的值是1，所以CAS操作成功。

很明显，这里的1已经不是一开始的那个1了，而是被重新赋值的1，这也是CAS操作存在的问题（无锁虽好，但是问题多多），它只会机械地比较当前值是不是预期值，但是并不会关心当前值是否被修改过，这种问题称之为`ABA`问题。

那么如何解决这种`ABA`问题呢，JUC提供了带版本号的引用类型，只要每次操作都记录一下版本号，并且版本号不会重复，那么就可以解决ABA问题了：

```java
public static void main(String[] args) throws InterruptedException {
    String a = "Hello";
    String b = "World";
    AtomicStampedReference<String> reference = new AtomicStampedReference<>(a, 1);  //在构造时需要指定初始值和对应的版本号
    reference.attemptStamp(a, 2);   //可以中途对版本号进行修改，注意要填写当前的引用对象
    System.out.println(reference.compareAndSet(a, b, 2, 3));   //CAS操作时不仅需要提供预期值和修改值，还要提供预期版本号和新的版本号
}
```

至此，有关原子类的讲解就到这里。

***

## 并发容器

简单的讲完了，又该讲难一点的了。

**注意：** 本版块的重点在于探究并发容器是如何利用锁机制和算法实现各种丰富功能的，我们会忽略一些常规功能的实现细节（比如链表如何插入元素删除元素），而更关注并发容器应对并发场景算法上的实现（比如在多线程环境下的插入操作是按照什么规则进行的）

在单线程模式下，集合类提供的容器可以说是非常方便了，几乎我们每个项目中都能或多或少的用到它们，我们在JavaSE阶段，为各位讲解了各个集合类的实现原理，我们了解了链表、顺序表、哈希表等数据结构，那么，在多线程环境下，这些数据结构还能正常工作吗？

### 传统容器线程安全吗

我们来测试一下，100个线程同时向ArrayList中添加元素会怎么样：

```java
public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        Runnable r = () -> {
            for (int i = 0; i < 100; i++)
                list.add("lbwnb");
        };
        for (int i = 0; i < 100; i++)
            new Thread(r).start();
      	TimeUnit.SECONDS.sleep(1);
        System.out.println(list.size());
    }
}
```

不出意外的话，肯定是会报错的：

```
Exception in thread "Thread-0" java.lang.ArrayIndexOutOfBoundsException: 73
	at java.util.ArrayList.add(ArrayList.java:465)
	at com.test.Main.lambda$main$0(Main.java:13)
	at java.lang.Thread.run(Thread.java:750)
Exception in thread "Thread-19" java.lang.ArrayIndexOutOfBoundsException: 1851
	at java.util.ArrayList.add(ArrayList.java:465)
	at com.test.Main.lambda$main$0(Main.java:13)
	at java.lang.Thread.run(Thread.java:750)
9773
```

那么我们来看看报的什么错，从栈追踪信息可以看出，是add方法出现了问题：

```java
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;   //这一句出现了数组越界
    return true;
}
```

也就是说，同一时间其他线程也在疯狂向数组中添加元素，那么这个时候有可能在`ensureCapacityInternal`（确认容量足够）执行之后，`elementData[size++] = e;`执行之前，其他线程插入了元素，导致size的值超出了数组容量。这些在单线程的情况下不可能发生的问题，在多线程下就慢慢出现了。

我们再来看看比较常用的HashMap呢？

```java
public static void main(String[] args) throws InterruptedException {
    Map<Integer, String> map = new HashMap<>();
    for (int i = 0; i < 100; i++) {
        int finalI = i;
        new Thread(() -> {
            for (int j = 0; j < 100; j++)
                map.put(finalI * 1000 + j, "lbwnb");
        }).start();
    }
    TimeUnit.SECONDS.sleep(2);
    System.out.println(map.size());
}
```

经过测试发现，虽然没有报错，但是最后的结果并不是我们期望的那样，实际上它还有可能导致Entry对象出现环状数据结构，引起死循环。

所以，在多线程环境下，要安全地使用集合类，我们得找找解决方案了。

### 并发容器介绍

怎么才能解决并发情况下的容器问题呢？我们首先想到的肯定是给方法前面加个`synchronzed`关键字，这样总不会抢了吧，在之前我们可以使用Vector或是Hashtable来解决，但是它们的效率实在是太低了，完全依靠锁来解决问题，因此现在已经很少再使它们了，这里也不会再去进行讲解。

JUC提供了专用于并发场景下的容器，比如我们刚刚使用的ArrayList，在多线程环境下是没办法使用的，我们可以将其替换为JUC提供的多线程专用集合类：

```java
public static void main(String[] args) throws InterruptedException {
    List<String> list = new CopyOnWriteArrayList<>();  //这里使用CopyOnWriteArrayList来保证线程安全
    Runnable r = () -> {
        for (int i = 0; i < 100; i++)
            list.add("lbwnb");
    };
    for (int i = 0; i < 100; i++)
        new Thread(r).start();
    TimeUnit.SECONDS.sleep(1);
    System.out.println(list.size());
}
```

我们发现，使用了`CopyOnWriteArrayList`之后，再没出现过上面的问题。

那么它是如何实现的呢，我们先来看看它是如何进行`add()`操作的：

```java
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();   //直接加锁，保证同一时间只有一个线程进行添加操作
    try {
        Object[] elements = getArray();  //获取当前存储元素的数组
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1);   //直接复制一份数组
        newElements[len] = e;   //修改复制出来的数组
        setArray(newElements);   //将元素数组设定为复制出来的数组
        return true;
    } finally {
        lock.unlock();
    }
}
```

可以看到添加操作是直接上锁，并且会先拷贝一份当前存放元素的数组，然后对数组进行修改，再将此数组替换（CopyOnWrite）接着我们来看读操作：

```java
public E get(int index) {
    return get(getArray(), index);
}
```

因此，`CopyOnWriteArrayList`对于读操作不加锁，而对于写操作是加锁的，类似于我们前面讲解的读写锁机制，这样就可以保证不丢失读性能的情况下，写操作不会出现问题。

接着我们来看对于HashMap的并发容器`ConcurrentHashMap`：

```java
public static void main(String[] args) throws InterruptedException {
    Map<Integer, String> map = new ConcurrentHashMap<>();
    for (int i = 0; i < 100; i++) {
        int finalI = i;
        new Thread(() -> {
            for (int j = 0; j < 100; j++)
                map.put(finalI * 100 + j, "lbwnb");
        }).start();
    }
    TimeUnit.SECONDS.sleep(1);
    System.out.println(map.size());
}
```

可以看到这里的ConcurrentHashMap就没有出现之前HashMap的问题了。因为线程之间会争抢同一把锁，我们之前在讲解LongAdder的时候学习到了一种压力分散思想，既然每个线程都想抢锁，那我就干脆多搞几把锁，让你们每个人都能拿到，这样就不会存在等待的问题了，而JDK7之前，ConcurrentHashMap的原理也比较类似，它将所有数据分为一段一段地存储，先分很多段出来，每一段都给一把锁，当一个线程占锁访问时，只会占用其中一把锁，也就是仅仅锁了一小段数据，而其他段的数据依然可以被其他线程正常访问。

![image-20230306171955430](https://oss.itbaima.cn/internal/markdown/2023/03/06/elxSQDBkcmqWtGU.png)

这里我们重点讲解JDK8之后它是怎么实现的，它采用了CAS算法配合锁机制实现，我们先来回顾一下JDK8下的HashMap是什么样的结构：

![img](https://oss.itbaima.cn/internal/markdown/2023/08/14/bI7At2sXqRwjolF.jpg)

HashMap就是利用了哈希表，哈希表的本质其实就是一个用于存放后续节点的头结点的数组，数组里面的每一个元素都是一个头结点（也可以说就是一个链表），当要新插入一个数据时，会先计算该数据的哈希值，找到数组下标，然后创建一个新的节点，添加到对应的链表后面。当链表的长度达到8时，会自动将链表转换为红黑树，这样能使得原有的查询效率大幅度降低！当使用红黑树之后，我们就可以利用二分搜索的思想，快速地去寻找我们想要的结果，而不是像链表一样挨个去看。

又是基础不牢地动山摇环节，由于ConcurrentHashMap的源码比较复杂，所以我们先从最简单的构造方法开始下手：

![image-20230306172041623](https://oss.itbaima.cn/internal/markdown/2023/03/06/DEFR3d6gzOf7oNs.png)

我们发现，它的构造方法和HashMap的构造方法有很大的出入，但是大体的结构和HashMap是差不多的，也是维护了一个哈希表，并且哈希表中存放的是链表或是红黑树，所以我们直接来看`put()`操作是如何实现的，只要看明白这个，基本上就懂了：

```java
public V put(K key, V value) {
    return putVal(key, value, false);
}

//有点小乱，如果看着太乱，可以在IDEA中折叠一下代码块，不然有点难受
final V putVal(K key, V value, boolean onlyIfAbsent) {
    if (key == null || value == null) throw new NullPointerException(); //键值不能为空，基操
    int hash = spread(key.hashCode());    //计算键的hash值，用于确定在哈希表中的位置
    int binCount = 0;   //一会用来记录链表长度的，忽略
    for (Node<K,V>[] tab = table;;) {    //无限循环，而且还是并发包中的类，盲猜一波CAS自旋锁
        Node<K,V> f; int n, i, fh;
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();    //如果数组（哈希表）为空肯定是要进行初始化的，然后再重新进下一轮循环
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {   //如果哈希表该位置为null，直接CAS插入结点作为头结即可（注意这里会将f设置当前哈希表位置上的头结点）
            if (casTabAt(tab, i, null,
                         new Node<K,V>(hash, key, value, null)))  
                break;                   // 如果CAS成功，直接break结束put方法，失败那就继续下一轮循环
        } else if ((fh = f.hash) == MOVED)   //头结点哈希值为-1，这里只需要知道是因为正在扩容即可
            tab = helpTransfer(tab, f);   //帮助进行迁移，完事之后再来下一次循环
        else {     //特殊情况都完了，这里就该是正常情况了，
            V oldVal = null;
            synchronized (f) {   //在前面的循环中f肯定是被设定为了哈希表某个位置上的头结点，这里直接把它作为锁加锁了，防止同一时间其他线程也在操作哈希表中这个位置上的链表或是红黑树
                if (tabAt(tab, i) == f) {
                    if (fh >= 0) {    //头结点的哈希值大于等于0说明是链表，下面就是针对链表的一些列操作
                        ...实现细节略
                    } else if (f instanceof TreeBin) {   //肯定不大于0，肯定也不是-1，还判断是不是TreeBin，所以不用猜了，肯定是红黑树，下面就是针对红黑树的情况进行操作
                      	//在ConcurrentHashMap并不是直接存储的TreeNode，而是TreeBin
                        ...实现细节略
                    }
                }
            }
          	//根据链表长度决定是否要进化为红黑树
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD)
                    treeifyBin(tab, i);   //注意这里只是可能会进化为红黑树，如果当前哈希表的长度小于64，它会优先考虑对哈希表进行扩容
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    addCount(1L, binCount);
    return null;
}
```

怎么样，是不是感觉看着挺复杂，其实也还好，总结一下就是：

![image-20230306172102878](https://oss.itbaima.cn/internal/markdown/2023/03/06/qvRH4wsIi9fczVh.png)

我们接着来看看`get()`操作：

```java
public V get(Object key) {
    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
    int h = spread(key.hashCode());   //计算哈希值
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (e = tabAt(tab, (n - 1) & h)) != null) {
      	// 如果头结点就是我们要找的，那直接返回值就行了
        if ((eh = e.hash) == h) {
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                return e.val;
        }
      	//要么是正在扩容，要么就是红黑树，负数只有这两种情况
        else if (eh < 0)
            return (p = e.find(h, key)) != null ? p.val : null;
      	//确认无误，肯定在列表里，开找
        while ((e = e.next) != null) {
            if (e.hash == h &&
                ((ek = e.key) == key || (ek != null && key.equals(ek))))
                return e.val;
        }
    }
  	//没找到只能null了
    return null;
}
```

综上，ConcurrentHashMap的put操作，实际上是对哈希表上的所有头结点元素分别加锁，理论上来说哈希表的长度很大程度上决定了ConcurrentHashMap在同一时间能够处理的线程数量，这也是为什么`treeifyBin()`会优先考虑为哈希表进行扩容的原因。显然，这种加锁方式比JDK7的分段锁机制性能更好。

其实这里也只是简单地介绍了一下它的运行机制，ConcurrentHashMap真正的难点在于扩容和迁移操作，我们主要了解的是他的并发执行机制，有关它的其他实现细节，这里暂时不进行讲解。

### 阻塞队列

除了我们常用的容器类之外，JUC还提供了各种各样的阻塞队列，用于不同的工作场景。

阻塞队列本身也是队列，但是它是适用于多线程环境下的，基于ReentrantLock实现的，它的接口定义如下：

```java
public interface BlockingQueue<E> extends Queue<E> {
   	boolean add(E e);

    //入队，如果队列已满，返回false否则返回true（非阻塞）
    boolean offer(E e);

    //入队，如果队列已满，阻塞线程直到能入队为止
    void put(E e) throws InterruptedException;

    //入队，如果队列已满，阻塞线程直到能入队或超时、中断为止，入队成功返回true否则false
    boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException;

    //出队，如果队列为空，阻塞线程直到能出队为止
    E take() throws InterruptedException;

    //出队，如果队列为空，阻塞线程直到能出队超时、中断为止，出队成功正常返回，否则返回null
    E poll(long timeout, TimeUnit unit)
        throws InterruptedException;

    //返回此队列理想情况下（在没有内存或资源限制的情况下）可以不阻塞地入队的数量，如果没有限制，则返回 Integer.MAX_VALUE
    int remainingCapacity();

    boolean remove(Object o);

    public boolean contains(Object o);

  	//一次性从BlockingQueue中获取所有可用的数据对象（还可以指定获取数据的个数）
    int drainTo(Collection<? super E> c);

    int drainTo(Collection<? super E> c, int maxElements);
```

比如现在有一个容量为3的阻塞队列，这个时候一个线程`put`向其添加了三个元素，第二个线程接着`put`向其添加三个元素，那么这个时候由于容量已满，会直接被阻塞，而这时第三个线程从队列中取走2个元素，线程二停止阻塞，先丢两个进去，还有一个还是进不去，所以说继续阻塞。

![image-20230306172123711](https://oss.itbaima.cn/internal/markdown/2023/03/06/nRik6PHxY24Nlzr.png)

利用阻塞队列，我们可以轻松地实现消费者和生产者模式，还记得我们在JavaSE中的实战吗？

> 所谓的生产者消费者模型，是通过一个容器来解决生产者和消费者的强耦合问题。通俗的讲，就是生产者在不断的生产，消费者也在不断的消费，可是消费者消费的产品是生产者生产的，这就必然存在一个中间容器，我们可以把这个容器想象成是一个货架，当货架空的时候，生产者要生产产品，此时消费者在等待生产者往货架上生产产品，而当货架有货物的时候，消费者可以从货架上拿走商品，生产者此时等待货架出现空位，进而补货，这样不断的循环。

通过多线程编程，来模拟一个餐厅的2个厨师和3个顾客，假设厨师炒出一个菜的时间为3秒，顾客吃掉菜品的时间为4秒，窗口上只能放一个菜。

我们来看看，使用阻塞队列如何实现，这里我们就使用`ArrayBlockingQueue`实现类：

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<Object> queue = new ArrayBlockingQueue<>(1);
        Runnable supplier = () -> {
            while (true){
                try {
                    String name = Thread.currentThread().getName();
                    System.err.println(time()+"生产者 "+name+" 正在准备餐品...");
                    TimeUnit.SECONDS.sleep(3);
                    System.err.println(time()+"生产者 "+name+" 已出餐！");
                    queue.put(new Object());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    break;
                }
            }
        };
        Runnable consumer = () -> {
            while (true){
                try {
                    String name = Thread.currentThread().getName();
                    System.out.println(time()+"消费者 "+name+" 正在等待出餐...");
                    queue.take();
                    System.out.println(time()+"消费者 "+name+" 取到了餐品。");
                    TimeUnit.SECONDS.sleep(4);
                    System.out.println(time()+"消费者 "+name+" 已经将饭菜吃完了！");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    break;
                }
            }
        };
        for (int i = 0; i < 2; i++) new Thread(supplier, "Supplier-"+i).start();
        for (int i = 0; i < 3; i++) new Thread(consumer, "Consumer-"+i).start();
    }

    private static String time(){
        SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
        return "["+format.format(new Date()) + "] ";
    }
}
```

可以看到，阻塞队列在多线程环境下的作用是非常明显的，算上ArrayBlockingQueue，一共有三种常用的阻塞队列：

* ArrayBlockingQueue：有界带缓冲阻塞队列（就是队列是有容量限制的，装满了肯定是不能再装的，只能阻塞，数组实现）
* SynchronousQueue：无缓冲阻塞队列（相当于没有容量的ArrayBlockingQueue，因此只有阻塞的情况）
* LinkedBlockingQueue：无界带缓冲阻塞队列（没有容量限制，也可以限制容量，也会阻塞，链表实现）

这里我们以ArrayBlockingQueue为例进行源码解读，我们先来看看构造方法：

```java
final ReentrantLock lock;

private final Condition notEmpty;

private final Condition notFull;

public ArrayBlockingQueue(int capacity, boolean fair) {
    if (capacity <= 0)
        throw new IllegalArgumentException();
    this.items = new Object[capacity];
    lock = new ReentrantLock(fair);   //底层采用锁机制保证线程安全性，这里我们可以选择使用公平锁或是非公平锁
    notEmpty = lock.newCondition();   //这里创建了两个Condition（都属于lock）一会用于入队和出队的线程阻塞控制
    notFull =  lock.newCondition();
}
```

接着我们来看`put`和`offer`方法是如何实现的：

```java
public boolean offer(E e) {
    checkNotNull(e);
    final ReentrantLock lock = this.lock;    //可以看到这里也是使用了类里面的ReentrantLock进行加锁操作
    lock.lock();    //保证同一时间只有一个线程进入
    try {
        if (count == items.length)   //直接看看队列是否已满，如果没满则直接入队，如果已满则返回false
            return false;
        else {
            enqueue(e);
            return true;
        }
    } finally {
        lock.unlock();
    }
}

public void put(E e) throws InterruptedException {
    checkNotNull(e);
    final ReentrantLock lock = this.lock;    //同样的，需要进行加锁操作
    lock.lockInterruptibly();    //注意这里是可以响应中断的
    try {
        while (count == items.length)
            notFull.await();    //可以看到当队列已满时会直接挂起当前线程，在其他线程出队操作时会被唤醒
        enqueue(e);   //直到队列有空位才将线程入队
    } finally {
        lock.unlock();
    }
}
```

```java
private E dequeue() {
    // assert lock.getHoldCount() == 1;
    // assert items[takeIndex] != null;
    final Object[] items = this.items;
    @SuppressWarnings("unchecked")
    E x = (E) items[takeIndex];
    items[takeIndex] = null;
    if (++takeIndex == items.length)
        takeIndex = 0;
    count--;
    if (itrs != null)
        itrs.elementDequeued();
    notFull.signal();    //出队操作会调用notFull的signal方法唤醒被挂起处于等待状态的线程
    return x;
}
```

接着我们来看出队操作：

```java
public E poll() {
    final ReentrantLock lock = this.lock;
    lock.lock();    //出队同样进行加锁操作，保证同一时间只能有一个线程执行
    try {
        return (count == 0) ? null : dequeue();   //如果队列不为空则出队，否则返回null
    } finally {
        lock.unlock();
    }
}

public E take() throws InterruptedException {
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();    //可以响应中断进行加锁
    try {
        while (count == 0)
            notEmpty.await();    //和入队相反，也是一直等直到队列中有元素之后才可以出队，在入队时会唤醒此线程
        return dequeue();
    } finally {
        lock.unlock();
    }
}
```

```java
private void enqueue(E x) {
    // assert lock.getHoldCount() == 1;
    // assert items[putIndex] == null;
    final Object[] items = this.items;
    items[putIndex] = x;
    if (++putIndex == items.length)
        putIndex = 0;
    count++;
    notEmpty.signal();    //对notEmpty的signal唤醒操作
}
```

可见，如果各位对锁的使用非常熟悉的话，那么在阅读这些源码的时候，就会非常轻松了。

接着我们来看一个比较特殊的队列SynchronousQueue，它没有任何容量，也就是说正常情况下出队必须和入队操作成对出现，我们先来看它的内部，可以看到内部有一个抽象类Transferer，它定义了一个`transfer`方法：

```java
abstract static class Transferer<E> {
    /**
     * 可以是put也可以是take操作
     *
     * @param e 如果不是空，即作为生产者，那么表示会将传入参数元素e交给消费者
     *          如果为空，即作为消费者，那么表示会从生产者那里得到一个元素e并返回
     * @param 是否可以超时
     * @param 超时时间
     * @return 不为空就是从生产者那里返回的，为空表示要么被中断要么超时。
     */
    abstract E transfer(E e, boolean timed, long nanos);
}
```

乍一看，有点迷惑，难不成还要靠这玩意去实现put和take操作吗？实际上它是直接以生产者消费者模式进行的，由于不需要依靠任何容器结构来暂时存放数据，所以我们可以直接通过`transfer`方法来对生产者和消费者之间的数据进行传递。

比如一个线程put一个新的元素进入，这时如果没有其他线程调用take方法获取元素，那么会持续被阻塞，直到有线程取出元素，而`transfer`正是需要等生产者消费者双方都到齐了才能进行交接工作，单独只有其中一方都需要进行等待。

```java
public void put(E e) throws InterruptedException {
    if (e == null) throw new NullPointerException();  //判空
    if (transferer.transfer(e, false, 0) == null) {   //直接使用transfer方法进行数据传递
        Thread.interrupted();    //为空表示要么被中断要么超时
        throw new InterruptedException();
    }
}
```

它在公平和非公平模式下，有两个实现，这里我们来看公平模式下的SynchronousQueue是如何实现的：

```java
static final class TransferQueue<E> extends Transferer<E> {
     //头结点（头结点仅作为头结点，后续节点才是真正等待的线程节点）
     transient volatile QNode head;
     //尾结点
     transient volatile QNode tail;

    /** 节点有生产者和消费者角色之分 */
    static final class QNode {
        volatile QNode next;          // 后继节点
        volatile Object item;         // 存储的元素
        volatile Thread waiter;       // 处于等待的线程，和之前的AQS一样的思路，每个线程等待的时候都会被封装为节点
        final boolean isData;         // 是生产者节点还是消费者节点
```

公平模式下，Transferer的实现是TransferQueue，是以先进先出的规则的进行的，内部有一个QNode类来保存等待的线程。

好了，我们直接上`transfer()`方法的实现（这里再次提醒各位，多线程环境下的源码分析和单线程的分析不同，我们需要时刻关注当前代码块的加锁状态，如果没有加锁，一定要具有多线程可能会同时运行的意识，这个意识在以后你自己处理多线程问题伴随着你，才能保证你的思路在多线程环境下是正确的）：

```java
E transfer(E e, boolean timed, long nanos) {   //注意这里面没加锁，肯定会多个线程之间竞争
    QNode s = null;
    boolean isData = (e != null);   //e为空表示消费者，不为空表示生产者

    for (;;) {
        QNode t = tail;
        QNode h = head;
        if (t == null || h == null)         // 头结点尾结点任意为空（但是在构造的时候就已经不是空了）
            continue;                       // 自旋

        if (h == t || t.isData == isData) { // 头结点等于尾结点表示队列中只有一个头结点，肯定是空，或者尾结点角色和当前节点一样，这两种情况下，都需要进行入队操作
            QNode tn = t.next;
            if (t != tail)                  // 如果这段时间内t被其他线程修改了，如果是就进下一轮循环重新来
                continue;
            if (tn != null) {               // 继续校验是否为队尾，如果tn不为null，那肯定是其他线程改了队尾，可以进下一轮循环重新来了
                advanceTail(t, tn);					// CAS将新的队尾节点设置为tn，成不成功都无所谓，反正这一轮肯定没戏了
                continue;
            }
            if (timed && nanos <= 0)        // 超时返回null
                return null;
            if (s == null)
                s = new QNode(e, isData);   //构造当前结点，准备加入等待队列
            if (!t.casNext(null, s))        // CAS添加当前节点为尾结点的下一个，如果失败肯定其他线程又抢先做了，直接进下一轮循环重新来
                continue;

            advanceTail(t, s);              // 上面的操作基本OK了，那么新的队尾元素就修改为s
            Object x = awaitFulfill(s, e, timed, nanos);   //开始等待s所对应的消费者或是生产者进行交接，比如s现在是生产者，那么它就需要等到一个消费者的到来才会继续（这个方法会先进行自旋等待匹配，如果自旋一定次数后还是没有匹配成功，那么就挂起）
            if (x == s) {                   // 如果返回s本身说明等待状态下被取消
                clean(t, s);
                return null;
            }

            if (!s.isOffList()) {           // 如果s操作完成之后没有离开队列，那么这里将其手动丢弃
                advanceHead(t, s);          // 将s设定为新的首节点(注意头节点仅作为头结点，并非处于等待的线程节点)
                if (x != null)              // 删除s内的其他信息
                    s.item = s;
                s.waiter = null;
            }
            return (x != null) ? (E)x : e;   //假如当前是消费者，直接返回x即可，x就是从生产者那里拿来的元素

        } else {                            // 这种情况下就是与队列中结点类型匹配的情况了（注意队列要么为空要么只会存在一种类型的节点，因为一旦出现不同类型的节点马上会被交接掉）
            QNode m = h.next;               // 获取头结点的下一个接口，准备进行交接工作
            if (t != tail || m == null || h != head)
                continue;                   // 判断其他线程是否先修改，如果修改过那么开下一轮

            Object x = m.item;
            if (isData == (x != null) ||    // 判断节点类型，如果是相同的操作，那肯定也是有问题的
                x == m ||                   // 或是当前操作被取消
                !m.casItem(x, e)) {         // 上面都不是？那么最后再进行CAS替换m中的元素，成功表示交接成功，失败就老老实实重开吧
                advanceHead(h, m);          // dequeue and retry
                continue;
            }

            advanceHead(h, m);              // 成功交接，新的头结点可以改为m了，原有的头结点直接不要了
            LockSupport.unpark(m.waiter);   // m中的等待交接的线程可以继续了，已经交接完成
            return (x != null) ? (E)x : e;  // 同上，该返回什么就返回什么
        }
    }
}
```

所以，总结为以下流程：

![image-20230306172203832](https://oss.itbaima.cn/internal/markdown/2023/03/06/Dp7d5X28RK6xrzl.png)

对于非公平模式下的SynchronousQueue，则是采用的栈结构来存储等待节点，但是思路也是与这里的一致，需要等待并进行匹配操作，各位如果感兴趣可以继续了解一下非公平模式下的SynchronousQueue实现。

在JDK7的时候，基于SynchronousQueue产生了一个更强大的TransferQueue，它保留了SynchronousQueue的匹配交接机制，并且与等待队列进行融合。

我们知道，SynchronousQueue并没有使用锁，而是采用CAS操作保证生产者与消费者的协调，但是它没有容量，而LinkedBlockingQueue虽然是有容量且无界的，但是内部基本都是基于锁实现的，性能并不是很好，这时，我们就可以将它们各自的优点单独拿出来，揉在一起，就成了性能更高的LinkedTransferQueue

```java
public static void main(String[] args) throws InterruptedException {
    LinkedTransferQueue<String> queue = new LinkedTransferQueue<>();
    queue.put("1");  //插入时，会先检查是否有其他线程等待获取，如果是，直接进行交接，否则插入到存储队列中
   	queue.put("2");  //不会像SynchronousQueue那样必须等一个匹配的才可以
    queue.forEach(System.out::println);   //直接打印所有的元素，这在SynchronousQueue下只能是空，因为单独的入队或出队操作都会被阻塞
}
```

相比 `SynchronousQueue` ，它多了一个可以存储的队列，我们依然可以像阻塞队列那样获取队列中所有元素的值，简单来说，`LinkedTransferQueue`其实就是一个多了存储队列的`SynchronousQueue`。

接着我们来了解一些其他的队列：

* PriorityBlockingQueue - 是一个支持优先级的阻塞队列，元素的获取顺序按优先级决定。
* DelayQueue - 它能够实现延迟获取元素，同样支持优先级。

我们先来看优先级阻塞队列：

```java
public static void main(String[] args) throws InterruptedException {
    PriorityBlockingQueue<Integer> queue =
            new PriorityBlockingQueue<>(10, Integer::compare);   //可以指定初始容量（可扩容）和优先级比较规则，这里我们使用升序
    queue.add(3);
    queue.add(1);
    queue.add(2);
    System.out.println(queue);    //注意保存顺序并不会按照优先级排列，所以可以看到结果并不是排序后的结果
    System.out.println(queue.poll());   //但是出队顺序一定是按照优先级进行的
    System.out.println(queue.poll());
    System.out.println(queue.poll());
}
```

我们的重点是DelayQueue，它能实现延时出队，也就是说当一个元素插入后，如果没有超过一定时间，那么是无法让此元素出队的。

```java
public class DelayQueue<E extends Delayed> extends AbstractQueue<E>
    implements BlockingQueue<E> {
```

可以看到此类只接受Delayed的实现类作为元素：

```java
public interface Delayed extends Comparable<Delayed> {  //注意这里继承了Comparable，它支持优先级

    //获取剩余等待时间，正数表示还需要进行等待，0或负数表示等待结束
    long getDelay(TimeUnit unit);
}
```

这里我们手动实现一个：

```java
private static class Test implements Delayed {
    private final long time;   //延迟时间，这里以毫秒为单位
    private final int priority;
    private final long startTime;
    private final String data;

    private Test(long time, int priority, String data) {
        this.time = TimeUnit.SECONDS.toMillis(time);   //秒转换为毫秒
        this.priority = priority;
        this.startTime = System.currentTimeMillis();   //这里我们以毫秒为单位
        this.data = data;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        long leftTime = time - (System.currentTimeMillis() - startTime); //计算剩余时间 = 设定时间 - 已度过时间(= 当前时间 - 开始时间)
        return unit.convert(leftTime, TimeUnit.MILLISECONDS);   //注意进行单位转换，单位由队列指定（默认是纳秒单位）
    }

    @Override
    public int compareTo(Delayed o) {
        if(o instanceof Test)
            return priority - ((Test) o).priority;   //优先级越小越优先
        return 0;
    }

    @Override
    public String toString() {
        return data;
    }
}
```

接着我们在主方法中尝试使用：

```java
public static void main(String[] args) throws InterruptedException {
    DelayQueue<Test> queue = new DelayQueue<>();
    queue.add(new Test(1, 2, "2号"));   //1秒钟延时
    queue.add(new Test(3, 1, "1号"));   //1秒钟延时，优先级最高

    System.out.println(queue.take());    //注意出队顺序是依照优先级来的，即使一个元素已经可以出队了，依然需要等待优先级更高的元素到期
    System.out.println(queue.take());
}
```

我们来研究一下DelayQueue是如何实现的，首先来看`add()`方法：

```java
public boolean add(E e) {
    return offer(e);
}

public boolean offer(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        q.offer(e);   //注意这里是向内部维护的一个优先级队列添加元素，并不是DelayQueue本身存储元素
        if (q.peek() == e) {   //如果入队后队首就是当前元素，那么直接进行一次唤醒操作（因为有可能之前就有其他线程等着take了）
            leader = null;
            available.signal();
        }
        return true;
    } finally {
        lock.unlock();
    }
}

public void put(E e) {
    offer(e);
}
```

可以看到无论是哪种入队操作，都会加锁进行，属于常规操作。我们接着来看`take()`方法：

```java
public E take() throws InterruptedException {
    final ReentrantLock lock = this.lock;   //出队也要先加锁，基操
    lock.lockInterruptibly();
    try {
        for (;;) {    //无限循环，常规操作
            E first = q.peek();    //获取队首元素
            if (first == null)     //如果为空那肯定队列为空，先等着吧，等有元素进来
                available.await();
            else {
                long delay = first.getDelay(NANOSECONDS);    //获取延迟，这里传入的时间单位是纳秒
                if (delay <= 0)
                    return q.poll();     //如果获取到延迟时间已经小于0了，那说明ok，可以直接出队返回
                first = null;
                if (leader != null)   //这里用leader来减少不必要的等待时间，如果不是null那说明有线程在等待，为null说明没有线程等待
                    available.await();   //如果其他线程已经在等元素了，那么当前线程直接进永久等待状态
                else {
                    Thread thisThread = Thread.currentThread();
                    leader = thisThread;    //没有线程等待就将leader设定为当前线程
                    try {
                        available.awaitNanos(delay);     //获取到的延迟大于0，那么就需要等待延迟时间，再开始下一次获取
                    } finally {
                        if (leader == thisThread)
                            leader = null;
                    }
                }
            }
        }
    } finally {
        if (leader == null && q.peek() != null)
            available.signal();   //当前take结束之后唤醒一个其他永久等待状态下的线程
        lock.unlock();   //解锁，完事
    }
}
```

到此，有关并发容器的讲解就到这里。

下一章我们会继续讲解线程池以及并发工具类。
