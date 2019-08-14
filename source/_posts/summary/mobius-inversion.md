---
title: 莫比乌斯反演总结
date: 2017-04-14 00:00:00
comment: true
mathjax: true
tags:
- 莫比乌斯反演
categories:
- 算法总结
---

莫比乌斯反演是偏序集上的一个反演，不过在此处我们只讨论整数格上的莫比乌斯反演。

<!---more--->




# 莫比乌斯反演

## 整数格上的莫比乌斯反演

定义$\mu$函数：

$$
\mu(n)=
\begin{cases}
1,&n=1 \\
(-1)^m,&n=\prod_{i=1}^m p_i^{k_i},\prod_{i=1}^m k_i=1 \\
0,&otherwise\\
\end{cases}
$$

函数有两个性质。

- $\mu$是积性函数。
- $\sum_{i=1}^n\mu(i)=
\begin{cases}
1,&n=1 \\
0,&othewise\\
\end{cases}$

第一条性质说明$\mu$可以**线性筛**；第二条性质提供了我们一个**当且仅当**$n=1$时计数的函数，因此在遇到求$(i,j)=1$的问题中通常会用到它。

直接给出代码。

```c++
void Init(){
	mu[1]=1;
	for(int i=2;i<N;i++){
		if(!notPri[i])pri[siz++]=i,mu[i]=-1;
		for(int j=0;j<siz&&i*pri[j]<N;j++){
			int nxt=i*pri[j];notPri[nxt]=1;
			if(i%pri[j])mu[nxt]=-mu[i];
			else {mu[nxt]=0;break;}
		}
	}
}
```

当出现平方因子就退出筛法保证了每个数只会被最小的因子筛去，因此时间复杂度线性。$\mu_i=0$的情况是由最小因子筛掉的，而其他情况都是由$\mu_i=-\mu_j$得到的。

## 反演

想学习很多反演，但是太菜了只会这个.jpg

以后可能会补吧。



若函数$f(n),g(n)$为数论函数，且满足$f(n)=\sum_{i|n}g(i)$，则有：

$$g(n)=\sum_{i|n}f(n)\mu\left(\frac ni\right)=\sum_{i|n}f\left(\frac ni\right)\mu(i)$$

若函数$f(n),g(n)$为数论函数，且满足$f(i)=\sum_{d=1}^{\left\lfloor n/i \right\rfloor}g(i*d)$，则有：

$$g(i)=\sum_{d=1}^{\left\lfloor n/i \right\rfloor}f(i\times d)\mu(d)$$

[证明](https://blog.sengxian.com/algorithms/mobius-inversion-formula)略去。事实上两种方法都可以比较方便地运用，一般第一种不需要构造函数，而第二种需要构造函数。

### 常用反演

定义符号

$$[exp]=
\begin{cases}
1,&exp=true\\
0,&exp=false \\
\end{cases}
$$

定义函数$e(n)=[n==1],id(n)=n$，则有：

$$
e=\mu \times 1 \\
id=\phi \times 1
$$

乘法代表Dirichlet卷积。因此反演也可以表示为：

$$f=g \times 1 \Leftrightarrow g=f \times \mu$$

## 应用

### 二维GCD计数前缀和

求$\sum_{i=1}^n \sum_{j=1}^m [(i,j)==k]$且$n\leq m$。

#### 不使用函数变换的方法

不难发现：

$$
\begin{aligned}
\sum_{i=1}^n \sum_{j=1}^m [(i,j)==k]
=&\sum_{i=1}^n \sum_{j=1}^m \left[\left(\frac ik,\frac jk\right)==1\right]  \\
=&\sum_{i=1}^n \sum_{j=1}^m e\left(\left(\frac ik,\frac jk\right)\right)  \\
=&\sum_{i=1}^n \sum_{j=1}^m \sum_{g|(i,j)} \mu(g)  \\
=&\sum_{i=1}^n \sum_{j=1}^m \sum_{g|i\text{且}g|j} \mu(g)  \\
=& \sum_{g=1}^n\sum_{i=1}^{\left\lfloor n/g\right\rfloor} \sum_{j=1}^{\left\lfloor m/g\right\rfloor} \mu(g)  \\
=& \sum_{g=1}^n \mu(g) \sum_{i=1}^{\left\lfloor n/g \right\rfloor} \sum_{j=1}^{\left\lfloor m/g\right\rfloor}   \\
\end{aligned}
$$

而$\left\lfloor \dfrac ng\right\rfloor$只有不超过$\sqrt{n}$种取值，$\left\lfloor \dfrac ng\right\rfloor$和$\left\lfloor \dfrac mg\right\rfloor$只有不超过$\sqrt{n}+\sqrt{m}$种取值，因此可以将$[1,n]$分成$\sqrt{n}+\sqrt{m}$块，每一块的$\left\lfloor \dfrac ng\right\rfloor$和$\left\lfloor \dfrac mg\right\rfloor$取值都不变，则我们预处理$\mu$后可以对一块区间进行$\mathrm{O}(1)$的统计，总时间复杂度为$\mathrm{O}(\sqrt{n}+\sqrt{m})$。

#### 使用函数变换的方法

令$f(k)=\sum_{i=1}^n \sum_{j=1}^m [(i,j)==k]$，$g(k)=\sum_{i=1}^n \sum_{j=1}^m [k|(i,j)]$，则$f(k)$就是我们要求的答案。很明显$k|(i,j) \Leftrightarrow k|i\text{且}k|j$，因此$g(k)=\left\lfloor \dfrac nk \right\rfloor \left\lfloor \dfrac mk \right\rfloor$。

发现$g(k)=\sum_{d=1}^{\left\lfloor n/k \right\rfloor}f(d \times k)$，因此有：

$$
\begin{aligned}
f(k)=&\sum_{d=1}^{\left\lfloor n/k \right\rfloor}g(d \times k)\mu(d) \\
=&\sum_{d=1}^{\left\lfloor n/k \right\rfloor}\left\lfloor \dfrac n{dk} \right\rfloor \left\lfloor \dfrac m{dk} \right\rfloor\mu(d)
\end{aligned}
$$

令$n'=\left\lfloor \dfrac nk \right\rfloor,m'=\left\lfloor \dfrac mk \right\rfloor$，则

$$
\begin{aligned}
f(k)=&\sum_{d=1}^{\left\lfloor n/k \right\rfloor}\left\lfloor \dfrac {n'}d \right\rfloor \left\lfloor \dfrac {m'}d \right\rfloor\mu(d)
\end{aligned}
$$

类似上面可以证明$n',m'$的取值个数，因此求解也是$\mathrm{O}(\sqrt{n}+\sqrt{m})$的。

好了，那求了一个区间后，怎么寻找下一个区间？假设我们当前区间开头为$i$，并假设下一个区间为$j$，则：

$$
\begin{aligned}
\left\lfloor \dfrac {n'}i \right\rfloor &\leq \left\lfloor \dfrac {n'}j  \right\rfloor \\
\Rightarrow \left\lfloor \dfrac {n'}i  \right\rfloor &\leq \dfrac {n'}j \\
\Rightarrow j &\leq \dfrac {n'}{\left\lfloor {n'}/i \right\rfloor} \\
\Rightarrow j &\leq \left\lfloor \dfrac {n'}{\left\lfloor {n'}/i \right\rfloor}\right\rfloor\\
\end{aligned}
$$

同理可得$m$。因此$j=\min\left( \left\lfloor \dfrac {n'}{\left\lfloor {n'}/i \right\rfloor}  \right\rfloor,\left\lfloor \dfrac {m'}{\left\lfloor {m'}/i \right\rfloor}  \right\rfloor\right)$。这个技巧在很多莫比乌斯反演的题目都用得上。

### 求约数个数和

直接给出结论：

若$d(n)$为$n$的约数个数，则有：

$$
d(nm)=\sum_{i|n} \sum_{j|m} [(i,j)==1]
$$

证明不略。假设$nm=\prod_{i=1}p_i^{x_i},n=\prod_{i=1}p_i^{y_i}$，则$m=\prod_{i=1}p_i^{x_i-y_i}$。

对于$(i,j)=1$，考虑因子$p_k$，则$i$和$j$的$p_k$项指数不能都不为$0$。当$i$的$p_k$为$0$时，$j$有$x_k-y_k+1$种取值；当$j$的$p_k$为$0$时，$i$有$y_k+1$种取值；$i,j$的$p_k$项可以都取$0$。因此$i$与$j$的$p_k$项有$x_k+1$种二元组$(i,j)$的取值，总二元组方案数为$\prod_{i=1} x_i+1$，满足约数个数公式。

然后还有个推广的神奇大结论：

$$\sum_{x_1}^{y_1} \sum_{x_2}^{y_2} \cdots \sum_{x_k}^{y_k} d(x_1 x_2 \cdots x_k) = \sum_{x_1}^{y_1} \sum_{x_2}^{y_2} \cdots \sum_{x_k}^{y_k} \prod_{i=1}^{k} \left\lfloor \dfrac{y_i}{x_i} \right\rfloor \prod_{i < j }  [(x_i, x_j)=1]$$

太神奇，[证明](http://www.cnblogs.com/iwtwiioi/p/4986325.html)需要二重数学归纳，略过。

# 杜教筛

高端，不会。

# min-25筛

高端，不会。

# 练习

莫比乌斯的题目通常能转化为$(i,j)=1$的计数问题，而转化为计数问题我们就容易通过分块求解了。

## 基础

### POI2007 Zap

二维GCD计数前缀和。

### HAOI2011 Problem b

*POI2007 Zap*的加强版，容斥原理加加减减就好了。

### BZOJ2820 YY的GCD

仍然是二维GCD计数前缀和，不过需要$(i,j)$为质数。只要预处理质数的$\mu$前缀和就好了。

### SDOI2008 仪仗队

不被挡住即行列$(i,j)=1$（从$0$标号），因此答案为$(\sum_{i=1}^n \sum_{i=1}^n [(i,j)==1])+2$（$2$个是$(0,1),(1,0)$）。最终化为$(\sum_{g=1}^n \mu(g)\left\lfloor \dfrac ng\right\rfloor ^2)+2$，分块求解。

## 进阶

### SDOI2015 约数个数和

是道好题，然而需要结论。

令$n'=\dfrac ng,m'=\dfrac mg$，则

$$
\begin{aligned}
\sum_{i=1}^n \sum_{j=1}^m d(ij)
=&\sum_{i=1}^n \sum_{j=1}^m [(i,j)==1] \\
=&\sum_{i=1}^n \sum_{j=1}^m {\left\lfloor \dfrac ni\right\rfloor}{\left\lfloor \dfrac mj\right\rfloor} \sum_{g|(i,j)}\mu(g) \\
=&\sum_{g=1}^n\mu(g)\sum_{i=1}^{\left\lfloor n/g\right\rfloor} \sum_{j=1}^{\left\lfloor m/g\right\rfloor} \dfrac n{ig} \dfrac m{jg} \\
=&\sum_{g=1}^n\mu(g)\sum_{i=1}^{n'} \sum_{j=1}^{m'} \dfrac {n'}i \dfrac{m'}j \\
=&\sum_{g=1}^n\mu(g)\sum_{i=1}^{n'} \dfrac {n'}i\sum_{j=1}^{m'}  \dfrac{m'}j \\
\end{aligned}
$$

然后就可以预处理$f(n)=\sum_{i=1}^n \dfrac ni​$的值，每次询问就可以分块解决。之所以要预处理$f(n)​$，是因为在倒数第二步时如果采用直接计算$\sum_{i=1}^{n'} \sum_{j=1}^{m'} \dfrac {n'}i \dfrac{m'}j​$开销是很大的。但如果我们能预处理，就能做到$\mathrm{O}(1)​$计算。

预处理时间复杂度$\mathrm{O}(n\sqrt{n})$，单次询问时间复杂度$\mathrm{O}(\sqrt{n})$。

### HNMTC2015#5 Lucas的数论

发现是*SDOI2015 约数个数和*的单询问加强版本，上面对$\mu$前缀和的$\mathrm{O}(n)$时间复杂度已经不能满足我们了。

式子最终可以推成这样：

$$\sum_{g=1}^n\mu(g) d(n')^2 $$

单次$f(n')$可以分块求。假设我们预处理好了μ的前缀和，时间复杂度就是$\mathrm{O}(\sqrt{n})$的。这里就有个求$μ$的前缀和$sum$的奇技淫巧了：

$$sum(n)=1-\sum_{i=2}^n sum(\left\lfloor \dfrac ni \right\rfloor)$$

递归求解。注意这也是能分块的，因此一层的时间为$\mathrm{O}(\sqrt{n})$，据说没有记忆化搜索时计算一次的时间复杂度为$\mathrm{O}(n^{\frac 23})$。不过事实上我们可以记忆化搜索，或者线筛预处理出$n\leq 5000000$（测试得到这个效率比较高）的$\mu$前缀和减少计算。

总时间复杂度未知，不过测试极限数据还是挺极限的。

## 高级

没做过什么高级的。

# 总结

莫比乌斯反演基本上离不开GCD和两个累和符号，而且重点往往是把式子化成统计GCD=1个数的形式，并反演求解。求解一般通过**分块**和预处理$\mu$前缀和的方式$\mathrm{O}(\sqrt{n})$求和。

- $e=\mu \times 1,id=\phi \times 1$

- $\mu$函数的性质：
	- $\mu$是积性函数。
	- $\sum_{i=1}^n\mu(i)=
	\begin{cases}
	1,&n=1 \\
	0,&othewise\\
	\end{cases}
	$
- $\mu$的神奇前缀和计算：$sum(n)=1-\sum_{i=2}^n sum(\left\lfloor \frac ni \right\rfloor)$

- 当待分块函数（如$\mu$）可以单独提出**预处理**时，可以通过此降低时间复杂度。

- 若多次询问中，分块区域下含有GCD的枚举值$g$和$i$或$j$之一，可以通过枚举$ig$或$jg$，再枚举$g$加速。（说法很意识流，详见[莫比乌斯反演简要笔记 - GCD的幂](https://blog.sengxian.com/algorithms/mobius-inversion-formula)）

- 积性函数有时不好证明，可以打表观察。重点观察幂和质数的值。
