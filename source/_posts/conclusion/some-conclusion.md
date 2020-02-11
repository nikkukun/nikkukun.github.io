---
title: 常用小结论与技巧总结
date: 2019-07-10 12:43:00
comment: true
mathjax: true
tags:
categories:
- 小结论
---

记录一些零散的小结论与技巧。

<!--more-->

## 结论

1. $\sum_{i=1}^n \lfloor n/i \rfloor$是$\mathcal{O}(n\log n)$级别的：
	$$\int _1^n \frac xn \mathrm{d}x = n\ln n$$

2. 基环树性质：
	* 如果图中存在一个环，那么连在环上的树都是指向根节点的有向树。
	* 断掉环上的一条边$u\rightarrow v$，将会形成一颗以$v$为根节点的有向树，这个性质得以让我们把基环树转换为树形DP。
	* 随便沿着基环树上的一个节点沿着有向边走，最后总能走到环上，这个性质得以让我们找到环上的一条边。

3. $[1,n]$的线段树只有$2n-1$个节点，但是需要开$4$倍空间。

4. 如果两种运算$A,B$像加法和乘法一样满足：
	1. $A$交换律，$A$结合律
	2. $B$交换律，$B$结合律，$B$对$A$的分配律

	那么就可以用这两种运算做矩阵乘法。容易看出$\mathrm{max}$和$+$操作满足前四个条件，且$c+\mathrm{max}(a,b) = \mathrm{max}(c+a,c+b)$，故可以用矩阵乘法优化某些DP。




## 技巧

1. 跟操作顺序有关的 DFS 一般都可以改成 `next_permutation()` 然后 `Check()` 一下，小常数且好写，比如手机锁屏密码个数统计问题。

2. $|a|=\max (a,-a)$，因此求 $|a-b|$ 可以维护 $\pm a,\  \mp b$。

3. $(-1)^{n-i}=(-1)^{n-i}(-1)^{2i}=(-1)^{n+i}$，可以用于 FFT 过程的变形。

4. `<bitset>` 的使用：[胡小兔的OI博客](https://www.cnblogs.com/RabbitHu/p/bitset.html)
	* `bitset<N> b`，其中 $N$ 为位数，从 $0$ 开始编号
	* `b.count()`：返回 $1$ 的个数
	* `b.flip(i)`：取反第 $i$ 位 
	* `b.flip(i)`：取反第 $i$ 位
	* `b.set()`：全部置 $1$
	* `b.reset()`：全部置 $0$
	* `b.any()`：查询是否存在 $1$
	* `_Find_first()`：从低到高找第一个 $1$ 的位置
	* `_Find_next(i)`：找第i位后下一个 $1$ 的位置
    	* 注意如果没有下一位，则会返回 `b.size()`
    	* 用 `_Find_next()` 遍历 bitset 的复杂度和 $1$ 的个数无关

5. 位运算built-in函数：
	* `__builtin_popcount(x)`：x 中 $1$ 的个数。采用的是查表法，很高效。
	* `__builtin_parity(x)`：x 中 $1$ 个数的奇偶性
	
	引用 `<iostream>` 就可以使用，但是具体在哪不知道。x 需要是 32 位的类型， `long long` 貌似只会返回后 32 位。

6. `__gcd(x,y)`：求 GCD。
	* `int` 和 `long long ` 都可以，但是要保证类型相同。
	* 跑了 $10^7$ 组数据，`__gcd()` 为 2569ms，手写 `GCD()` 为 2670ms，效率似乎很接近。

	在头文件 `<algorithm>` 中。

7. `__lg(x)`：求满足 $2^n\leq x$ 的最大 $n$。
	* 可以用于快速求 ST 表的值
	* `__lg(0)` 会返回 $0$

8. 快速枚举子集与超集：

	* 枚举 $S$ 的子集 $i$：

	```c++
	for(int i=s; i>=0; i=(i-1)&s)
	```
	
	该过程 `i` 递减，也就是一个子集的所有超集会在它之前被枚举到。


	* 枚举 $S$ 的超集 $i$：

	```c++
	for(int i=s; i<(1<<n); i=(i+1)|s)
	```

	该过程 `i` 递增，也就是一个超集的所有子集会在它之前被枚举到。

9. 若树的连边为 $(i, 2i),\ (i, 2i+1)$，则因为 LCA 深度是 $\log$ 级别的，可以直接暴力爬树。

	```c++
	int LCA(int u, int v){
		while(u!=v){
			if(u<v) swap(u,v);
			u >>= 1;
		}
		return u;
	}
	```





---

这部分是还没有整理过的。

* 仙人掌边数$n-1 \leq m \leq 2n-2$
* 特征多项式 Cayley-Hamiton
* uoj.ac/problem/200
* 两段查表快速幂
* 扩展欧拉定理中可以直接用$\mod\varphi(n)$试乘的条件不成立：$n=6$






## TO-DO List

1. ~~min-max容斥~~
2. ~~反演~~
	1. ~~二项式反演~~
	2. ~~Stirling反演~~
3. ~~Stirling数~~
4. ~~树上启发式合并~~
5. ~~分治FFT~~
6. ~~珂朵莉树~~
7. ~~CDQ分治~~
8. 广义后缀自动机
9. ~~带权二分~~
10. zkw线段树
11. LCT
12. ~~Pollard-Rho~~

炫酷反演魔术 - VFleaKing
http://vfleaking.blog.uoj.ac/blog/87

再探快速傅里叶变换 - 毛啸
国家集训队论文2016