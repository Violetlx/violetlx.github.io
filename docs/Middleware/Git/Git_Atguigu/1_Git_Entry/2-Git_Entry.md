---
title: 初识Git(一)
date: 2025/06/25
---

![蜘蛛侠红黑桌面壁纸](https://bizhi1.com/wp-content/uploads/2024/09/spiderman-miles-morales-red-black-desktop-wallpaper-4k-small.jpg)

::: tip

0 内容介绍

1 Git概述

2 Git安装

3 Git常用命令

4 Git分支操作

5 Git团队协作机制

6 GitHub操作

:::



## 0、内容介绍

### Git

- Git 介绍：分布式版本控制工具 VS 集中式版本控制工具
- Git 安装：基于官网发布的最新版本 2.31.1 安装讲解
- Git 命令：基于开发案例详细讲解了`git`的常用命令
- Git 分支：分支特性、分支创建、分支转换、分支合并、代码合并冲突解决
- IDEA 集成 Git

### GitHub

- 创建远程库
- 代码推送 Push
- 代码拉取 Pull
- 代码克隆 Clone
- SSH 免密登录
- IDEA 集成 GitHub

### Gitee 码云

- 创建远程库
- IDEA 集成 GitHub
- 码云连接 GitHub 进行代码的复制和迁移

### GitLab

- GitLab 服务器的搭建和部署
- IDEA 集成 GitLab



## 1、Git 概述

- 官网地址：[http://git-scm.com/](http://git-scm.com/)
- `--everything is local`：分布式特性

Git 是一个**免费**的、**开源**的 <mark>分布式版本控制系统</mark>，可以快速高效地处理从小型到大型的各种项目

Git 易于学习，占地面积小，**性能极快**。它具有廉价的本地库，方便的暂存区域和多个工作流分支等特性

其性能优于 Subversion、CVS、Perforce 和 ClearCase 等版本控制工具

### 1.1、何为版本控制？

版本控制是一种记录文件内容变化，以便将来查阅特定版本修订情况的系统

版本控制其实最重要的是可以记录文件修改**历史记录**，从而让用户能够查看历史版本，方便版本切换

![image-20210916222911720](images/2-Git_Entry/6NizZtSKQLWrjw2.png)

### 1.2、为什么需要版本控制？

个人开发过渡到团队协作

![image-20210916223038071](images/2-Git_Entry/QfoYW7w6LdKzJrc.png)

### 1.3、版本控制工具

#### 集中式版本控制工具

CVS、SVN（Subversion）、VSS.......

集中化的版本控制系统诸如 CVS、SVN 等，都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。多年以来，这已成为版本控制系统的标准做法

这种做法带来了许多好处，每个人都可以在一定程度上看到项目中的其他人正在做些什么。而管理员也可以轻松掌控每个开发者的权限，并且管理一个集中化的版本控制系统，要远比在各个客户端上维护本地数据库来得轻松容易

事分两面，有好有坏。这么做显而易见的缺点是中央服务器的单点故障。如果服务器宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作

![image-20210916223444358](images/2-Git_Entry/jJYo2bAwSIHkG4B.png)

**总结**

- **优点**：可以看到其他人正在做些什么；开发者权限控制
- **缺点**：中央服务器的单点故障，无法提交历史记录

#### 分布式版本控制工具

Git、Mercurial、Bazaar、Darcs.......

像 Git 这种分布式版本控制工具，客户端提取的不是最新版本的文件快照，而是把代码仓库完整地镜像下来（本地库）。这样任何一处协同工作用的文件发生故障，事后都可以用其他客户端的本地仓库进行恢复。因为每个客户端的每一次文件提取操作，实际上都是一次对整个文件仓库的完整备份

分布式的版本控制系统出现之后，解决了集中式版本控制系统的缺陷：

1. 服务器断网的情况下也可以进行开发（因为版本控制是在本地进行的）
2. 每个客户端保存的也都是整个完整的项目（包含历史记录，更加安全）

![image-20210916224708069](images/2-Git_Entry/6rPsyHajdgDB2TO.png)

**优点**：

- 版本控制在本地，可以断网开发
- 保存完整项目，包含历史记录，更安全

### 1.4、Git 简史

![image-20210916225109044](images/2-Git_Entry/D4uGkUECizseawt.png)

### 1.5、Git 工作机制

![image-20210916225215882](images/2-Git_Entry/EzVI3GWPdQ9wc17.png)

- **工作区**写代码，通过`git add`命令添加至**暂存区**
- **暂存区**临时存储代码，通过`git commit`提交至**本地库**
- **本地库**记录历史记录，通过`git push`推送至**远程库**

### 1.6、Git 和代码托管中心

代码托管中心是基于网络服务器的远程代码仓库，一般我们简单称为**远程库**

- 局域网
  - :ballot_box_with_check: GitLab
- 互联网
  - :ballot_box_with_check: GitHub（外网）
  - :ballot_box_with_check: Gitee码云（国内网站）



## 2、Git 安装

---

官网地址：[https://git-scm.com/](https://git-scm.com/)

查看 GNU 协议，可以直接点击下一步

![image-20210916233221530](images/2-Git_Entry/CVxgLzDO8mjXdSK.png)

选择 Git 安装位置，要求是非中文并且没有空格的目录，然后下一步

![image-20210916233242454](images/2-Git_Entry/ckTh61JGiPXD8lW.png)

Git 选项配置，推荐默认设置，然后下一步

![image-20210916233256977](images/2-Git_Entry/eBrqf6NHFyIpjOR.png)

Git 安装目录名，不用修改，直接点击下一步

![image-20210916233310729](images/2-Git_Entry/WcbXGyrYmgVM7Ih.png)

Git 的默认编辑器，建议使用默认的 Vim 编辑器，然后点击下一步

![image-20210916233417531](images/2-Git_Entry/jatAiNHho6FTzxs.png)

默认分支名设置，选择让 Git 决定，分支名默认为 master，下一步

![image-20210916233436237](images/2-Git_Entry/Sjn9kC586dvAghx.png)

修改 Git 的环境变量，选第一个，不修改环境变量，只在 Git Bash 里使用 Git

![image-20210916233458071](images/2-Git_Entry/pfDUIHwAQ1jyza7.png)

选择后台客户端连接协议，选默认值 OpenSSL，然后下一步

![image-20210916233517370](images/2-Git_Entry/wmqydKAvuelRkEf.png)

配置 Git 文件的行末换行符，Windows 使用 CRLF，Linux 使用 LF，选择第一个自动转换，然后继续下一步

![image-20210916233531902](images/2-Git_Entry/7C8hQ3PH5c4vEaD.png)

选择 Git 终端类型，选择默认的 Git Bash 终端，然后继续下一步

![image-20210916233717491](images/2-Git_Entry/dHz2iXnJt49KwjM.png)

选择 Git pull 合并的模式，选择默认，然后下一步

![image-20210916233746777](images/2-Git_Entry/WSrhmtwcQyNJdDs.png)

选择 Git 的凭据管理器，选择默认的跨平台的凭据管理器，然后下一步

![image-20210916233757028](images/2-Git_Entry/Rodj7rIZHEMU5SC.png)

 其他配置，选择默认设置，然后下一步

![image-20210916233804540](images/2-Git_Entry/FwjEBZl4SAruhxs.png)

实验室功能，技术还不成熟，有已知的 bug，不要勾选，然后点击右下角的 Install 按钮，开始安装 Git

![image-20210916233812916](images/2-Git_Entry/2zfiKg4WpwCq9YL.png)

点击 Finsh 按钮，Git 安装成功！

![image-20210916233821255](images/2-Git_Entry/KWEZ9AYD1NbcX7g.png)

右键任意位置，在右键菜单里选择 Git Bash Here 即可打开 Git Bash 命令行终端

![image-20210916233913106](images/2-Git_Entry/ad7zuHvK2McTQl5.png)

在 Git Bash 终端里输入 `git --version` 查看 git 版本，如图所示，说明 Git 安装成功

![image-20210917000255009](images/2-Git_Entry/OHZko9jdDWvRMKi.png)



## 3、Git 常用命令

| 命令                              | 作用           |
| :-------------------------------- | :------------- |
| `git config user.name 用户名`     | 设置用户签名   |
| `git config user.email 邮箱`      | 设置用户签名   |
| `git init`                        | 初始化本地库   |
| `git status`                      | 查看本地库状态 |
| `git add 文件名`                  | 添加至暂存区   |
| `git commit -m "日志信息" 文件名` | 提交至本地库   |
| `git reflog`                      | 查看历史记录   |
| `git reset --hard 版本号`         | 版本穿梭       |

### 3.1、设置用户签名

1）基本语法

```bash
git config --global user.name 用户名
git config --global user.email 邮箱
```

2）案例实操

全局范围的签名设置

![image-20210917001235229](images/2-Git_Entry/62JueaM9ByrmHdX.png)

说明： 

签名的作用是区分不同操作者身份。用户的签名信息在每一个版本的提交信息中能够看到，以此确认本次提交是谁做的

<mark>Git 首次安装必须设置一下用户签名，否则无法提交代码</mark>

:bangbang: 注意：这里设置用户签名和将来登录 GitHub（或其他代码托管中心）的账号没有任何关系

### 3.2、初始化本地库

1）基本语法

```bash
git init
```

2）案例实操

![image-20210917203400924](images/2-Git_Entry/QBPNgHCUzGOiJuy.png)

### 3.3、查看本地库状态

1）基本语法

```bash
git status
```

2）案例实操

![git status](images/2-Git_Entry/b645MnGSFxRyhaQ.gif)

新增文件前

![image-20210917204804510](images/2-Git_Entry/4xCVHGPLgjXbB1F.png)

新增文件后

![image-20210917204858689](images/2-Git_Entry/IqK6GEc92hYx7HF.png)

###  3.4、添加暂存区

1）基本语法

```bash
git add 文件名
```

2）案例实操

红色表示仍在工作区，修改尚未被追踪；绿色表示已添加至暂存区，修改被追踪

![image-20210917205319556](images/2-Git_Entry/DnfmIo3KZlt5zJ4.png)

使用命令，删除暂存区该文件（只是删除暂存区，不影响工作区）

```bash
git rm --cached hello.txt
```

![image-20210917205546165](images/2-Git_Entry/uJS8Gp3CazAKU7l.png)

### 3.5、提交至本地库

1）基本语法

```bash
# -m 表示添加一个版本日志信息，不写此参数也会打开日志信息的文件框。一般带参数
git commit -m "日志信息" 文件名
```

2）案例实操

正常操作

![image-20210917210542226](images/2-Git_Entry/KNfMvCTkE3YQxdj.png)

无`-m`参数时

![image-20210917210109185](images/2-Git_Entry/bvTfga13wtuSUhq.png)

如果强制退出

![image-20210917210156460](images/2-Git_Entry/XIx7L3lTW9FcBtP.png)

### 3.6、修改文件

案例实操

![image-20210917211143162](images/2-Git_Entry/o2p7dO4F9A5VDjJ.png)

git 里是按照行维护文件的，所以修改内容其实就是之前的行删除，修改过后的行添加进来

因此在`commit`之后提示信息`1 insertion(+), 1 deletion(-)`

### 3.7、历史版本

#### 查看历史版本

1）基本语法

```bash
# 查看精简版本信息
git reflog
# 查看详细版本信息
git log
```

2）案例实操

![image-20210917211945690](images/2-Git_Entry/p2mvTbZuEqVkYB9.png)

#### 版本穿梭

1）基本语法

```bash
git reset --hard 版本号
```

2）案例实操

![image-20210917212348218](images/2-Git_Entry/nBw6OEL9liyMe7d.png)

文件验证当前版本号

![image-20210917212941200](images/2-Git_Entry/vMYXFVyWo6PNOzf.png)

Git 切换版本，底层其实是移动的 HEAD 指针，具体原理如下图所示

![image-20210917213424162](images/2-Git_Entry/5GQRnhD8XijVZuy.png)

![image-20210917213247141](images/2-Git_Entry/CVdReJPu5YMTmHQ.png)

![image-20210917213333350](images/2-Git_Entry/oU5ORWqvghNCcTi.png)



## 4、Git 分支操作

![image-20210917213616760](images/2-Git_Entry/6jGfxUmrERZSV9h.png)

### 4.1、什么是分支

在版本控制过程中，同时推进多个任务，为每个任务，我们就可以创建每个任务的单独分支。使用分支意味着程序员可以把自己的工作从开发主线上分离开来，开发自己分支的时候，不会影响主线分支的运行。对于初学者而言，分支可以简单理解为副本，一个分支就是一个单独的副本（分支底层其实也是指针的引用）

![image-20210917213935209](images/2-Git_Entry/AVwpC1ZLzmOlEUg.png)

### 4.2、分支的好处

同时并行推进多个功能开发，**提高开发效率**

各个分支在开发过程中，如果某一个分支开发失败，**不会对其他分支有任何影响**。失败的分支删除重新开始即可

### 4.3、分支的操作

| 命令                  | 作用                       |
| :-------------------- | :------------------------- |
| `git branch 分支名`   | 创建分支                   |
| `git branch -v`       | 查看分支                   |
| `git checkout` 分支名 | 切换分支                   |
| `git merge` 分支名    | 把指定的分支合并到当前分支 |

#### 创建分支、查看分支

1）基本语法

```bash
git branch 分支名
git branch -v
```

2）案例实操

![image-20210917214653546](images/2-Git_Entry/PVOR9ZjmIqkr4cv.png)

#### 切换分支

1）基本语法

```bash
git checkout 分支名
```

2）案例实操

![image-20210917215246415](images/2-Git_Entry/AR9NuTBG2UweEnb.png)

#### 合并分支

1）基本语法

```bash
git merge 分支名
```

2）案例实操

**正常合并**

![image-20210917215908842](images/2-Git_Entry/UcwRJu78Kmvod4k.png)

**冲突合并**

冲突产生的原因：合并分支时，两个分支在同一个文件的同一个位置有两套完全不同的修改。Git无法替我们决定使用哪一个。必须人为决定新代码内容

![image-20210917220923478](images/2-Git_Entry/gcnCSJKtNqrokIQ.png)

解决冲突

![image-20210917221121233](images/2-Git_Entry/mU3Y9JodyTpV7nB.png)

![image-20210917221239011](images/2-Git_Entry/S6OrkKeFsCymWcB.png)

![image-20210917222018377](images/2-Git_Entry/iMQfWOwkSH8ujh2.png)

#### 创建分支和切换分支图解

![image-20210917221451896](images/2-Git_Entry/6WNlEc9FbaJmhkv.png)

![image-20210917221515718](images/2-Git_Entry/OKwIG2BvZC7mVjl.png)

master、hot-fix 其实都是指向具体版本记录的指针。当前所在的分支，其实是由 HEAD 决定的。所以创建分支的本质就是多创建一个指针

- HEAD 如果指向 master，那么我们现在就在 master 分支上
- HEAD 如果指向 hotfix，那么我们现在就在 hotfix 分支上

所以切换分支的本质就是移动HEAD指针



## 5、Git 团队协作机制

### 5.1、团队内协作

![image-20210917222216595](images/2-Git_Entry/HWlevFmCKdRju6V.png)

### 5.2、跨团队协作

 ![image-20210917222441407](images/2-Git_Entry/gvmsB4Rn7xYfc9A.png)



## 6、GitHub 操作

- GitHub 官网：[https://github.com/](https://github.com/)

PS：全球最大同性交友网站，技术宅男的天堂，新世界的大门，你还在等什么？

| 账号                 | 姓名       | 验证邮箱                     |
| :------------------- | :--------- | :--------------------------- |
| `atguiguyuebuqun`    | `岳不群`   | `atguiguyuebuqun@aliyun.com` |
| `atguigulinghuchong` | `令狐冲`   | `atguigulinghuchong@163.com` |
| `atguigudongfang1`   | `东方不败` | `atguigudongfang1@163.com`   |

### 6.1、创建远程仓库

![image-20210917223235275](images/2-Git_Entry/iP9EZnU81O3wGYB.png)

![](images/2-Git_Entry/gLQzrsRiN2Cj6Fe.png)

### 6.2、远程仓库操作

| 命令                               | 作用                                                     |
| :--------------------------------- | :------------------------------------------------------- |
| `git remote add 别名 远程地址`     | 起别名                                                   |
| `git remote -v`                    | 查看当前所有远程别名                                     |
| `git clone 远程地址`               | 将远程仓库的内容克隆到本地                               |
| `git pull 远程地址别名 远程分支名` | 将远程仓库对于分支最新内容拉下来后与当前本地分支直接合并 |
| `git push 别名 分支`               | 推送本地分支上的内容到远程仓库                           |

#### 创建远程仓库别名

1）基本语法

```bash
git remote -v
git remote add 别名 远程地址
```

2）案例实操

![image-20210917225451875](images/2-Git_Entry/PfZBknlC8RjHvxV.png)

#### 推送本地分支到远程仓库

1）基本语法

```bash
git push 别名 分支
```

2）案例实操

由于 GitHub 外网的特殊原因，会有网络延迟，等待时间可能较长，属于正常现象。可能要多尝试几次，需要点耐心。当然你有工具除外

```bash
git push git-demo master
```

如果本地还没有过 SSH 免密登录操作（下面内容会详细介绍），则在执行命令后会弹出一个`Connect to GitHub`的提示框

![image-20210918224448045](images/2-Git_Entry/27XoOIwArYdnhyE.png)

点击`Sign in with your browser`后会自动打开系统默认浏览器

如果你的 GitHub 尚未进行过任何 Git 相关授权，则会给出确认授权提示信息，点击`Authorize GitCredentialManager`进行授权即可

![image-20210918231341801](images/2-Git_Entry/sOguJ7GYApZUiLS.png)

接着会提示授权成功（如果在此之前已经对`Git Credential Manager`进行过授权，则直接提示此信息）

![image-20210918224627107](images/2-Git_Entry/clQsuFdDfemyxzR.png)

成功推送本地分支至远程库

![image-20210918224403240](images/2-Git_Entry/ApuMYyt5S73LF6E.png)

**凭据管理器**

在上述操作过程中，点击`Authorize GitCredentialManager`进行授权后，在 GitHub 设置页面的`Application`选项—`Authorized OAuth Apps`中可以查看到 `Git Credential Manager`的授权信息

![image-20210918231735259](images/2-Git_Entry/QgZLxhAM5fzis6n.png)

在上述过程前，本地凭据管理器中还没有任何身份凭证信息（没有 Git 和 GitHub 相关的凭据信息）

![image-20210918230512316](images/2-Git_Entry/hBtO3EZJRnmWYeC.png)

执行过上述命令等操作后，本地凭据管理器中会出现 Git 相关凭据信息

![image-20210918233953904](images/2-Git_Entry/nfe4SVwFj39JTuB.png)

#### 拉取远程仓库到本地

1）基本语法

```bash
git pull 别名 分支
```

2）案例实操

![image-20210918234422490](images/2-Git_Entry/lqVRcoryfCZnMeg.png)

#### 克隆远程仓库到本地

1）基本语法

```bash
git clone 远程库地址
```

2）案例实操

首先获取需要克隆的远程库地址

![image-20210918235159899](images/2-Git_Entry/V1s3vjWHUAiyIC2.png)

由于`workspace`下面已经存在一个同名的仓库地址，所以直接在`workspace`中键入命令会有错误提示信息

![image-20210918235519853](images/2-Git_Entry/MIc5GEnqgrZsWBe.png)

这是因为，`clone`命令默认帮我们创建的一个远程仓库名称同名的文件夹，所以这里我删除了`git-demo`目录

![image-20210918235857263](images/2-Git_Entry/LZYvpoBcJR56VlA.png)

小结：`clone` 会做如下操作

- 1、拉取代码
- 2、初始化本地仓库
- 3、创建别名（默认`origin`）

### 6.3、团队内协作

如果项目之外成员想要将自己编写的代码推送至远程库，则会提示`unable to access...403`

![image-20210919002334885](images/2-Git_Entry/URnavcD49XsEkwY.png)

要想获取推送的权限，则需要该项目管理员对该成员进行邀请，将其添加至该项目中

1）邀请合作者，输入用户名，复制地址并发送给合作者

![image-20210919001646877](images/2-Git_Entry/yHmSVrhQN5eFZow.png)

![image-20210919001732944](images/2-Git_Entry/r6yLWmFxQVogejR.png)

![image-20210919001847491](images/2-Git_Entry/p4qvjwdhcrSXM2R.png)

2）合作者访问该链接，点击接受邀请，可以在其账号上看到该远程仓库

- [https://github.com/atguiguvueyue/git-demo/invitations](https://github.com/atguiguvueyue/git-demo/invitations)

![image-20210919002022667](images/2-Git_Entry/fxEsGzic2mgAJRt.png)

![image-20210919002239871](images/2-Git_Entry/R9O3bTxLo7HfBw6.png)

接下来，就可以通过`git`命令对远程库进行克隆、拉取、提交、推送等操作了

### 6.4、跨团队协作

1）合作者视角

点击`Fork`，将其他项目“叉”到自己账号上

![image-20210919003412417](images/2-Git_Entry/TzkfoeEVc5wi67d.png)

自己账号上就有了该项目，可以清楚地看到该项目`forked from xxx`，即可对代码进行修改

![image-20210919003500235](images/2-Git_Entry/YzAaK6L4o8rx3Jw.png)

修改代码后，点击`Pull requests`—`New pull request`，发起拉取请求

![image-20210919004019396](images/2-Git_Entry/UDezhHG5E7v93r1.png)

查看修改内容，点击`Create pull request`，创建拉取请求

![image-20210919004334829](images/2-Git_Entry/rG3BDcENxJMot4R.png)

填写请求信息及评论内容，点击`Create pull request`

![image-20210919004505828](images/2-Git_Entry/J8hZK1oVE2Hi9Gm.png)

创建完成

![image-20210919004830149](images/2-Git_Entry/9kpVQfbAGz2gRL5.png)

2）项目管理员视角

可以在该项目中查看到`Pull requests`有一条新的记录，可以点击下方提交信息进行查看

![image-20210919005217558](images/2-Git_Entry/nItWOHxSi9kleV5.png)

想要看到合作者修改的具体内容，可以点击提交记录进行查看

![image-20210919005303909](images/2-Git_Entry/dOGxz6gusfM4onA.png)

![image-20210919005442954](images/2-Git_Entry/54QENAfDJj3ikSl.png)

同时，可以对拉取请求进行审查和评论

![image-20210919005558618](images/2-Git_Entry/385yrHgBX1uvPYR.png)

最后，审查通过就可以对拉取请求进行合并了，点击`Merge pull request`进行合并

![image-20210919005831430](images/2-Git_Entry/K4EfVpQ1BvhwSFL.png)

点击`Confirm merge`，确认合并

![image-20210919005854745](images/2-Git_Entry/ZYHrCAUJQvED93K.png)

合并成功之后，项目成员就可以看到修改的相关内容了

### 6.5、SSH 免密登录

1）基本语法

```bash
# -t指定加密算法，-C添加注释
ssh-keygen -t rsa -C 描述
```

2）案例实操

**本地生成 SSH 密钥**

键入命令，连敲三次回车即可

![image-20210919011352497](images/2-Git_Entry/puY46lMsi2GkbKj.png)

进入`~/.ssh`目录，复制公钥信息

![image-20210919011953686](images/2-Git_Entry/fZvNMLo1p7CGWIJ.png)

**GitHub 上添加公钥**

未添加任何公钥之前，`Code`—`SSH`会有警告提示信息，表示目前 SSH 方式是没有权限的

![image-20210919014241528](images/2-Git_Entry/Zl6xeMd7qnV5UPW.png)

在 GitHub 的`settings`—`SSH and GPG keys`中，点击`New SSH key`添加一个公钥

![image-20210919012856831](images/2-Git_Entry/pbSW2LukQAz5Cqj.png)

将`id_rsa.pub`即公钥信息粘贴至`Key`中，`Title`随意，点击`Add SSH key`进行添加

![image-20210919013103108](images/2-Git_Entry/J1FOEVfW5bI6Tyl.png)

出现下列信息，说明添加成功

![image-20210919013731928](images/2-Git_Entry/g1bZS56xRVdQIsm.png)

**验证 SSH免密登录 是否可用**

进入`git-demo`项目，点开`Code`—`SSH`，发现已经没有警告提示信息了，表示可用

![image-20210919014010529](images/2-Git_Entry/DEvC6qPBAMS32ra.png)

复制 SSH 协议地址，使用`clone`命令克隆到本地，键入`yes`即可

![image-20210919015207022](images/2-Git_Entry/Be8LsuUKFtbGf2j.png)

接下来就是修改内容、添加暂存区、提交本地库、推送远程库的操作了

这时候我们发现已经不再弹出登录授权的提示信息，就可以推送过去了

![image-20210919015907992](images/2-Git_Entry/shjpkZWQNRwH9Gg.png)

查看远程库历史版本信息，确认推送成功

![image-20210919020511037](images/2-Git_Entry/nla3Lbq2v5DWNcE.png)

至此，SSH 免密登录配置成功！

