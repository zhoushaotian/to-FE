# somethings to do created at 2017.11.7
## 了解js引擎的实现以及代码的编译运行过程
---
## AMD,CMD,CommonJS,es6的模块实现做个demo
---
## 做个canvas的demo  
### 知乎首页的粒子效果 created at 2017.11.7 
### 基本完成demo finished at 2017.11.8
---
## 熟悉node的其他模块和API(看完node文档)
### finish **Module** at 2017.11.7
### finish **Events** at 2017.11.8
---
## html5API
---
## 学习mocha前端自动化测试 created at 2017.11.9
---
## deep in React && server-side render
---
## es6 created at 2017.11.15 
- class语法的继承实现
- Generator函数  
- async函数
- arrayBuffer
---
## 深入学习handlebars created at 2017.11.15
---
## 修改choice-cli 实现多模式共用一个模板文件 created at 2017.11.15
- react模式
- vue模式
- node模式
- simple模式(无其他框架结构)  
finished at 2017.11.16
---
## 复习计算机组织与结构 && 操作系统 created at 2017.11.17
### 计算机组织与结构
#### 指令系统
- 指令字长  
指一条机器指令的长度。通常指令字长等于机器字长的指令称为单字长指令。即只需要从存储器取一次指令。通常为了扩大寻址范围会有双字长指令，这样的指令需要从存储器取两次。  
一条指令由操作码、地址码组成，有的指令会有多个地址码。  
#### 存储器
- 字长  
计算机一次可以处理的二进制信息的位数，一般是8的倍数。计算机的字长等于计算数据总线的宽度或者内部寄存器的宽度。
- 存储空间  
计算机可以直接寻址的空间大小，由计算机的地址总线长度和寻址的单元长度(即一个字长也叫一个存储单元)决定。
> 一般地址总线送来的地址码被地址译码器翻译成对应存储单元的驱动信号，例如一个20位的数据总线,所支持的最大存储单元数为: 2^20  

### 操作系统
- 进程与线程  
进程是一个正在运行程序的实例，也就是说，通常一个程序会有一个进程实例，这个进程实例分配了资源和地址空间，不同进程的地址空间是不一样的，在单CPU的多道程序系统中，某个时刻只会有一个进程在工作，系统通过在不同进程之间快速切换造成了一种多个进程同时运行的假象。  
守护进程与前台进程: 前台进程通常是用户创建的交互进程。而后台进程是具有某种功能，且大部分时间都在休眠。举个例子，有一个接受邮件的后台进程，当没有新邮件到达的时候这个进程是休眠的，如果新邮件到达，那么会唤醒这个进程，并进行一些处理。这些停留在后台的进程称为**守护进程**  
进程存在三种状态: 阻塞、就绪、运行。 三种状态之间会发生转换。   
进程表：为了实现这种进程结构，在系统中会维护一张表结构，即进程表。进程表的每一个表项记录了一个进程实例的状态，包括程序计数器、堆栈指针、内存分配情况等。  
线程是CPU调度的单位(与进程不同，进程是资源调度单位)。在一个进程中可能会存在多个线程，这些线程共享同一个地址空间，资源等。相当于一个线程就像是一个轻量级的进程。为什么会在有进程的情况下增加线程这个概念？用node线程池来理解的话，就是为了让单进程实现多任务处理，在一个IO到来之后，主线程会把这个IO任务交由线程池中的某个线程处理，这样主线程不会因为IO阻塞。从而可以处理接下来的其他请求，当这个IO请求完成之后，通知主线程，主线程再做IO完成之后的操作。这样的情况在网络IO中最常见，当存在大量网络请求的时候，线程池可以同时处理多个请求而不会发生阻塞。倘若进程只有一个线程，那么当IO操作的时候会发生阻塞，程序会失去响应(在等待操作完成)。这里疑惑的是，既然是为了实现多任务处理，那么为什么不直接使用许多进程来完成这些操作。注意，进程是资源调度的基本单元，每一个进程由自己的地址空间，倘若使用进程来完成操作，在多个进程之间切换的开销是很大的，但是线程就不同，一个进程下的多个线程是共享地址空间和资源的，这样切换线程的开销会比切换进程的开销小的多。而且资源的共享使得一个线程打开一个文件之后另外的线程也可以读取这个文件，线程之间的通信更加容易。  
经典线程模型: 在线程中存在程序计数器和堆栈，就像JavaScript的执行一样，存在一个调用堆栈，这个堆栈记录了已调用但是还未返回的过程(函数)  
总之，进程是资源调度的单位，而线程是CPU调度的单位。进程拥有一个执行的线程。进程用于把资源集中到一起，而线程则是在CPU上被调度执行的实体。
- 死锁
- 存储管理  
虚拟内存: 通常计算机的物理内存大小小于实际程序所需要的内存大小，这个时候一般有两种解决方案: 1. 不断从磁盘中换入或者换出内存片段，即将暂时不需要的内存块存储到磁盘上,等到需要的时候再从磁盘中写入到内存中。这种方法易于实现，但是性能较低。磁盘的读写速度远远小于内存的速度。2.将程序分段，程序装载的时候按段装载，若空间不足则等待有足够空间之后在进行装载。这种方法加大了编程的难度，很难正确判断程序该如何分段。为此，引入虚拟内存的概念。虚拟内存将第二种方法是实现交由计算机去判断。由系统去管理内存的换入和换出。  
页表与页框: 在虚拟内存中，页表和页框的单元大小通常是相同的。页表的每一个单元为一个虚拟页面，可能会对应物理内存的一段空间，对应的那一段物理空间称为页框。程序访问的地址称为虚拟地址，所有页表构成的空间称为虚拟空间。在使用虚拟内存的情况下，虚拟地址不会直接送到内存总线上，而是先交由内存管理单元(MMU)将虚拟地址映射为物理内存地址。  
MMU位于CPU包中，作为CPU芯片的一部分(可能也是单独的芯片)。  
缺页中断: 在页表项中有一位记录了该页是否被装载到内存中。如果一个程序试图访问未被装载到内存中的页面，则会引发缺页中断，这个时候系统会通过某种算法来找到一个页框，将这个页框写回到磁盘中，随后修改页表的映射关系，并把需要访问的页面装载到内存中。然后从新执行引起中断的指令。  
虚拟地址的结构: 一种简单的实现是 虚拟地址由 页表索引和偏移地址组成,MMU收到虚拟地址后找到对应的页表项，读出页表项所映射的实际内存起始地址,将该地址与偏移地址组合即得到了实际内存地址。  

---
## 自己写一个React组件库练手(思考如何提升CSS能力) created at 2017.11.23  
---
## SVG created at 2017.11.24
## 写一个你画我猜的游戏  created at 2018.1.14
