---
title: 动态规划总结
date: 2017-04-14 00:00:00
comment: true
mathjax: true
tags:
- 动态规划
categories:
- 算法总结
---

主要说明优化DP的一些方法。

<!---more--->

## 四边形不等式

四边形不等式是一个神奇的二元函数的结论，利用它可以得到决策的单调性，从而加速寻找转移状态的时间。然而我对这个东西并没有研究，因此也只能谈一下结论。

对函数$w_{i,j}$，若满足

$$w_{i,j}+w_{i',j'}\leq w_{i,j'}+w_{i',j} \quad (i\leq i'\leq j\leq j')$$

则函数$w_{i,j}$满足四边形不等式。令$s_{i,j}$表示$w_{i,j}$得到最优值的转移来源，则有：

$$s_{i,j}\leq s_{i,j+1}\leq s_{i+1,j+1} \quad (i\leq j)$$

即决策具有单调性。利用这个性质可以缩小决策集合，加速决策时间。但是不等式仅仅**缩小了范围**，并不意味着当一个决策比之前的决策和后一个决策更优时，就不继续考察后面的决策。

（其实还有一个区间包含单调不等式，但是我没看出来有什么用）

##斜率优化

斜率优化是优化一类动态规划的方法，通常的实现是维护一个凸包从而达到$\mathrm{O}(\log {n})$甚至$\mathrm{O}(1)$的转移时间复杂度。维护凸包通常采用单调队列或平衡树。

###一般情况

从典型的情况着手。假设我们有一个转移方程：

$$f_i=min\{-a_i*b_j+c_j\}+d_i \quad (0\leq j<i)$$

很明显，这个方程在朴素的情况下需要对每个$i$枚举$j$，时间复杂度是$\mathrm{O}(n^2)$的。但是我们发现这个方程与$i$和$j$有关的项只有一项，而其他项要么**只与$i$有关**，要么**只与$j$有关**。令$x=b_j,y=c_j,d_i=t$，则对确定的$j$，$x$与$y$都是确定的。假设此时$j$为最优转移。代入有：

$$
\begin{aligned}
f_i&=-a_i*x+y+t \\ \Rightarrow y&=a_i*x+f_i-t
\end{aligned}
$$

由于$t$只与$i$相关，因此我们可以认为$y = a_i x+f_i$。此时我们相当于在满足$0\leq j<i$的$j$所代表的点集中，找到使得斜率$k=a_i$的直线在$y$轴上的截距最小的点。不难看出这个点只能在点集的下凸包上，否则其他点都没有该点优。因此我们需要维护一个**下凸的点集**（相邻边**斜率递增**）。

####排除不必要点

考虑在候选点集里，哪些点是不必要的。方便考虑，我们先假设$a_i$**非降**，$b_j$**严格递增**，则插入点是按横坐标顺序排列的。由于斜率非降，我们通过画图可以知道若点$j$最优化了$i$，则对$\forall i'>i$，其最优转移都不可能在$j$之前的点$k$取到（斜率非降$\Leftrightarrow$极角非降，考虑旋转卡壳的过程对蹱点的单调转移），因此**转移单调**，可以删除$j$前面的点。

再考虑插入新点$i$的情况。如果当前加入了$i$会使得下凸性质被破坏，则当前点集最后一个点必定在下凸的上方，也就不会再被选中，直接删除。这个判断如果直接比较斜率容易出现**精度误差**甚至斜率不存在，我更喜欢用**叉积**计算。

这样，我们相当于在点集开头与结尾维护了下凸性质，并动态删除多余的点。这个数据结构可以采用双端队列，队首就是最佳转移。每个点最多入队出队一次，均摊时间复杂度为$\mathrm{O}(1)$。同理，如果函数转移最大值，则需要维护上凸性质。具体维护什么还要由**点集的给出顺序**（即$x_i$的趋势，如逆序给出需要逆序维护凸包）而定。

###更一般的情况

我们以上维护凸包的讨论是建立在$a_i$（斜率）**非降**，$b_j$（横坐标）**严格递增**的情形上。假如不满足呢？

####斜率无序

斜率无序，则决策单调性不满足，我们需要**二分**找到凸包上的切点。不难看出目标函数的斜率在最佳转移两侧的斜率之间。查找的时间复杂度为$\mathrm{O}(\log n)$。

####横坐标无序

横坐标无序，则不能直接在队尾插入，需要一个能动态维护序列的数据结构——平衡树。查找到要插入的位置后，维护插入点左右的凸包性质。需要特判**点在凸包内**的情况，这样的点不会更新凸包。如果使用了叉积，就不需要考虑重点或重横坐标的情况。

当然如果斜率和横坐标都无序，那就只能考虑平衡树上的凸包维护。注意细节。

##练习

斜率优化的题目我没做很多，不过感觉都是套路（除了*诗人小G*）。

###基础

####HDU3507 打印文章

令$sumC _i = \sum _{j=1}^i c_j$，则有：

$$
\begin{aligned}
f_i&=min/max\{f_j+(sumC_i-sumC_j + M)^2\} \\
&=min/max\{-2*sumC_i*sumC_j-2*sumC_j*M+f_j+sumC_j^2\} + (sumC_i+M)^2\\
\end{aligned}
$$

同时维护两个凸包。

####HNOI2008 玩具装箱

令$sumC _i = \sum _{j=1}^i c_j$，则有

$$f_i=min\{f_j+(i-j-1+sumC_i-sumC_j - L)^2\}$$

发现$i$有两个变化量$i$与$sumC_i$，不好处理。但是我们能够合并。重新定义$sumC_i=sumC_i+i$，则：

$$f_i=min\{f_j+(sumC_i-sumC_j -L-1)^2\}$$

展开式子维护下凸包。

####ZJOI2007 仓库建设

维护下凸包。题目应该有特判：只要最后的工厂是空的，就不用都运到最后一个工厂，这样费用反而会变小。不过数据没有这种坑点，因此直接输出$f_n$也没问题。

####CEOI2004 锯木厂选址

不用随机算法就水水的。枚举第二个厂$i$与第一个厂$j$，化好式子之后发现$x$是递增的，斜率是非降的，直接队列就可以，不需要平衡树。

###进阶

####SDOI2012 任务安排

这个题明显有后效性，每次分配一段工作就对后面的完成时间增加$S$。我们发现对确定的分段$i$，其对后面的影响（假设对自己的影响已经计算了）是确定的值$S*\sum_{j=i+1}^n$，因此如果我们**提前计算**影响，就可以消除后效性。

令$sumT_i=\sum_{j=1}^i T_j,sumF_i=\sum_{j=1}^i F_j$，则：

$$f_i=min\{f_j+[sumT_i+S*(sumF_n-sumF_j)]*(sumF_i-sumF_j)\}$$

明显展开后$x=sumF_j,k_i=sumT_i$，然而坑点是有$t\leq0$的数据,$sumT_i$不一定递增。需要二分寻找最优转移。

####BSOJ1517 斜率优化

题意：给定$a,b$数组与$f_i=
\begin{cases}
0, &i=0	\\
min\{f_j-a_i*b_j\}, &0\leq j<i\leq n
\end{cases}$，$minimize\ f_n$。

坐标和斜率都不单调，上平衡树维护。可以用Splay，我用的是非旋转式Treap。比较惊讶于我的寻找是`Split`+`Merge`+`BSearch`，总时间复杂度为$\mathrm{O}(n\log ^2n)$，竟然也跑得过$n\leq 200000$，感觉奥妙重重。

###高级

没做过高级的。至少还没做完*货币交换*。

####NOI2009 诗人小G

明显跟内容无关，我们只需要每一行的长度$len_i$。令$sumLen_i=\sum_{j=1}^i len_j$，再令$sumLen_i=sumLen_i+i$，则有：

$$
f_i=min\{f_j+|(sumLen_i-sumLenj-1-L)^p|\}
$$

对于$p=2$的点就是基础的斜率优化，可以过两个数据点。然而$p\leq 10$，没办法斜率优化。打个表发现决策具有单调性，然后我们也可以（通过复杂的）证明得到这个式子满足四边形不等式$\Leftrightarrow$决策具有单调性，就可以维护啦。

具体来说，我们插入时考虑决策$i$可能是哪些状态的最优决策，用$a_i$表示$i$的最优决策的最大值，则不难看出$a_i$是非降的。因为决策单调，决策$j$如果是$i$的最优决策，则$i$后面的所有状态的可能最优决策都更新为$j$。我们可以用栈维护**每个决策能更新的状态的起始点**，一个决策一旦被覆盖就不可能再出现。步骤如下：

1. 对栈顶元素$top$的起始点$pos_{top}$考察用当前决策$i$是否会更优，是则出栈，否则重复。
2. 此时决策$i$的起始点一定在$(pos_{top},n]$之间，二分查找$pos_i$。

每次寻找最优决策时间二分$\mathrm{O}(\log n)$（如果维护队列为$\mathrm{O}(1)$），维护栈时每个元素最多出栈入栈一次，平摊$\mathrm{O}(1)$，二分$\mathrm{O}(\log n)$。所以单次数据复杂度为$\mathrm{O}(n\log n)$，完美解决。

不过严格来说，这跟斜率优化没有太大关系，重点在转移单调。

##总结

斜率优化维护一个凸包从而达到$\mathrm{O}(\log n)$甚至$\mathrm{O}(1)$的转移复杂度，从而加速转移。一般需要转移具有单调性，可以通过四边形不等式证明。具体有几个要点：

- 转移表达式只与当前状态$i$与候选状态$j$有关，而不与其他变量$k$有关；或与$k$有关，但在$k$确定时$i$只与$j$有关。这样确保了二维平面上每个候选状态点$j$的**存在**。

- 斜率优化中，表达式的$x$值为**与$i$相关的$j$的变量**，$y$值为**只与$y$相关的变量**。

- 斜率无序：二分；横坐标无序：平衡树

- 四边形不等式：$w_{i,j}+w_{i',j'}\leq w_{i,j'}+w_{i',j} \quad (i\leq i'\leq j\leq j')$
  满足四边形不等式的式子具有**转移单调性**，可以采用**栈**维护转移集合。要确定一个式子满足决策单调，除了证明通常采用**打表**观察（不一定正确）。

- 有后效性的转移可以**提前计算影响**。