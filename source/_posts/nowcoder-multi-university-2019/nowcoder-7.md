---
title: 2019牛客暑期多校训练营（第七场）
comment: true
mathjax: true
date: 2019-8-12 0:28:00
tags:
categories:
- 比赛
- 训练
---

比赛链接	|过题状态	|代码查看
:-:			|:-:		|:-:	
[点我跳转](https://ac.nowcoder.com/acm/contest/887#question) | [点我跳转](https://buaaacm.github.io/training.html?year=2019#id=02) | [点我跳转](https://ac.nowcoder.com/acm/contest/887#submit/{%22searchUserName%22%3A%22%E6%89%93%E4%B8%8D%E8%B5%A2%E7%94%B5%E8%84%91%22%2C%22statusTypeFilter%22%3A%225%22})

<!--more-->



## A - String

> Solved by nikkukun & prime21.

从$10$之间分开，然后考虑每一段分开的能不能和之前的合并。

比赛中猜想合并一次就可以了，结果被小民指出`0101101011`需要合并两次，因此需要多次合并。




## B - Irreducible Polynomial

> Solved by prime21.

结论1：实数上的不可约多项式只能是一次多项式和二次多项式。

结论2：实数上$n\geq 3$次多项式可以唯一地被分解成多个一次多项式和二次多项式的乘积。




## C - Governing sand

> Solved by nikkukun & prime21.





## D - Number

> Solved by Chielo.






## E - Find the mediam

> Solved by Chielo.

假设位置在$x$之前的区间左端点和右端点分别为$L_i,R_i$，则统计$a_i \leq x$的$a_i$个数为 $\sum (x-L_i+1) - \sum (x-R_i)$。因此二分答案$x$，树状数组维护上述式子即可。





## F - Energy stones

>Solved by Chielo.

对每个石头单独考虑，一个石头在一次吃掉的贡献，只和与上一次被吃掉的时间间隔相关，并且只需要维护到达能量上限前的时间间隔之和，和到达能量上限的时间间隔数量，就可以维护答案。

用线段树维护时间间隔。一个时间点只会被加入一次和删除一次，因此修改次数是$\mathcal{O}(n)$的。总时间复杂度$\mathcal{O} (n\log n)$。




## H - Pair

> Solved by Chielo.

数位DP统计个数，需要减掉$x,y$都为$0$的情况。




## I - Chessboard

> Upsolved by nikkukun.

牛客题解和[Potassium同学的Blog](https://potassiumwings.github.io/2019/08/09/2019summertraining-2/#more)都讲得很清楚了，我就懒得打式子了……

核心妙妙思想：利用整体转换，将每个格子$\geq m$的情况化成$\geq 0$的情况，便于计算。之前也有一个DP题目建立了类似$f(i,j)=[f(i,0)]^j$的关系，这样就不需要考虑特殊的情况。

核心妙妙思想2：如果多个方案是本质相同的，那么可以只统计恰好达到某个限制条件的方案。本题只统计了$\exist a_i = 0$的方案个数，而对其他类似的题目，也可以添加“某个点是最后一个关键点”的限制避免重复，如我在牛客第八场J题中的写法。



## J - A+B Problem

> Solved by Chielo.



## K - Function

> Upsolved by nikkukun.

这个题目好绕啊。大意：

$$
f(n) = \prod _{d|n}
\begin{cases}
3k+1	, & d=p^k, p=a^2+b^2 \text{and is prime}, k\geq 1	\\
1		, &\text{otherwise}
\end{cases}
$$

求该函数前缀和。

首先我们要知道前置知识**费马二平方定理**：质数$p$能被表示成$a^2+b^2$，当且仅当$p \equiv 1 \pmod 4$；质数$p$不能被表示成$a^2+b^2$，当且仅当$p \equiv 3 \pmod 4$或$p=2$；

然后$f(n)$显然是个积性函数，用min_25筛考虑这东西在质数上的贡献。但是其实我们并不好单独处理出$p \equiv 1 \pmod 4$的质数的贡献，但是如果我们能计算出其他$p \equiv i \pmod 4$的值，那么在乘质数$p_j$这个步骤时，就可以用$p \equiv i \pmod 4$的值来筛另一个$p \equiv j \pmod 4$的值，这样就实现了分别计算$f(n)$中模$4$余$1$与其他质数的贡献。

后面的部分就是很常规的min_25筛合数部分了。

在一些总结里有提到，min_25筛处理质数部分时，需要让计算函数$f'$是一个完全积性函数。本题中单独看$4$个根据模$4$剩余系分类的函数，他们都不是完全积性函数，甚至不是个积性函数。然而这四个函数加在一起时，就是一个完全积性函数了。要求完全积性函数，是为了在乘上质数$p_j$转移时可以不考虑$p_j$是否与另一个前缀和的其他数互质。只要转移过程能保证该性质，即使单个函数不是完全积性函数，也能通过相互筛出来计算。