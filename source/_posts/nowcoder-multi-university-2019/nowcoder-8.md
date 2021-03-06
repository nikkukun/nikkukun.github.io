---
title: 2019牛客暑期多校训练营（第八场）
comment: true
mathjax: true
date: 2019-8-12 11:43:00
tags:
categories:
- 比赛
- 训练
---

比赛链接	|过题状态	|代码查看
:-:			|:-:		|:-:	
[点我跳转](https://ac.nowcoder.com/acm/contest/888#question) | [点我跳转](https://buaaacm.github.io/training.html?year=2019#id=03) | [点我跳转](https://ac.nowcoder.com/acm/contest/888#submit/{%22statusTypeFilter%22%3A%225%22%2C%22searchUserName%22%3A%22%E6%89%93%E4%B8%8D%E8%B5%A2%E7%94%B5%E8%84%91%22})

<!--more-->



## A - All-one Matrices

> Solved by Chielo.

统计极大子矩阵个数就好了。




## B - Beauty Values

> Solved by Chielo.

考虑每个点对答案的贡献，并且规定它能贡献的区间中，它是这个数出现最早的位置，这样就能不重不漏地统计了。





## C - CDMA

> Solved by prime21 & nikkukun.

假设我们已经知道某个合法矩阵$A$，则只需要递归构造
$
\begin{bmatrix}
	A	&A	\\
	A	&-A	\\
\end{bmatrix}
$
就好啦。





## D - Distance

> Upsolved by nikkukun.

有一个很naive的想法是将绝对值拆成取$\mathrm{max}$的形式，最后再取$\mathrm{min}$，但是这个做法并不能很好地维护，因为取最大最小的顺序是不能交换的（反之，如果这题是维护最远点对，则这个方法可行）。

考虑如何去掉绝对值：只要保证两个坐标每一维的差都不小于$0$就好啦！所以有一个非常暴力的方法：维护$8$个卦限的坐标正负情况，每次加入和查询时维护$8$个卦限里的极值，实现去掉绝对值的目的。

三维树状数组常数非常小。





## G - Gemstones

> Solved by Chielo.

我队：暴力

正解：栈维护

那 我 没 了





## I - Inner World

> Upsolved by nikkukun.

有意思的题目。如果能够注意到子树是DFS上一段连续的序列，那么添加一个节点就相当于在一个二维矩阵中，在DFS序对应行的$[L,R]$区间整体$+1$，而查询一个节点就相当于查询一个二维矩阵和。

因此把所有操作都建到一棵树上，处理出DFS序，用线段树维护二维矩阵和即可。注意统计二维矩阵和的套路，用扫描线法进行降维（类似树状数组统计逆序对的方法）。




## J - Just Jump

> Solved by nikkukun.

题目可以转化成：计算在$[0,L]$插一些板子，且第$t_i$块板不能插在$p_i$处，两块板距离$\geq d$的方案数。

先考虑没有限制的情况，这相当于给一个长度$L$的东西插板，然后每块板距离大于等于$d$，先假设这个插法是$F(L)$，可以DP预处理。然后不合法的方案就是，第$t_i$块板不能插在$p_i$处。那就可以考虑一个东西$G(j)$，表示插完了前$j$个板子，且板子$j$恰好插在$p_j$的位置，**后面部分**合法的方案数（前面合法不合法无所谓）。假设有一个第$0$块板子在位置$0$，则答案就是$G(0)$

用容斥，考虑位置$p_j$之后的不合法情况，那么能插入的板子要满足板子编号$t_i$和插入位置$p_i$都比$j$的要大。枚举这样的$i$，并且规定$[p_j,p_i]$之间的板子随便插，但是从$p_i$之后就得是合法的插法，也就是$i$是**最后一个不满足要求**的板子，这样能不重不漏地枚举所有不满足条件的情况。

于是$G(j) = p_j \text{以后没有限制的放法总数} - ( [p_j,p_i]\text{随便放的方案数} \times G(i) )$。

上式中：

* $p_j$以后没有限制的放法总数 $= F(L-p_j+1)$；

* $[p_j,p_i]$随便放的方案数 $=$ 某个神秘组合数；

* 某个神秘组合数 $=$ 在 $[p_j,p_i]$ 之间插 $t_i-t_j+1$ 个板子（端点各有一个板子），且满足任意两板距离$\geq d$的方案数；

然后就可以记忆化搜索了。时间复杂度$\mathcal{O} (m^2+n)$






---

## 总结

* 有一些构造题是递归构造，如本次的C题和[构造补图和原图相同的图](http://www.matrix67.com/blog/archives/6221)，都是利用已经有的结果进行扩展，这个时候就要观察小规模结果是否具有良好的推广性。

* 和一段连续消除相关的东西可以看做是出栈入栈。

* 把序列看成不断增量插入，有时候会有很简便的解法。如本次G题和[CF1200E](https://codeforces.com/contest/1200/problem/E)，后者可以看做增量更新Hash值。