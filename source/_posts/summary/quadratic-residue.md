---
title: 二次剩余学习笔记
date: 2019-8-19 11:14:00
comment: true
mathjax: true
tags:
- 二次剩余
categories:
- 算法总结
---

给定 $a,p$，若存在 $x$ 满足 $x^2 \equiv a \pmod p$，则说 $a$ 是模 $p$ 的二次剩余。求解二次剩余问题就是进行模意义下的平方根操作。

<!--more-->

## 基本概念

定义Legendre符号：

$$
\left(\frac{a}{p}\right)=
\begin{cases}
1,&a	\text{在模 $p$ 意义下是二次剩余}\\
-1,&a	\text{在模 $p$ 意义下是非二次剩余}\\
0,&a \equiv 0 \pmod p
\end{cases}
$$

在模奇质数 $p$ 下，$x^2 \equiv a \pmod p$ 有解，当且仅当 $\left(\frac{a}{p}\right) = 1$。

下面给出两个性质。

> 性质1：$x^2 \equiv a \pmod p$ 在 $x \in [0,p)$ 中恰有 $\frac {p-1}2$ 个解。

具体证明见 [a_crazy_czy - 二次剩余Cipolla算法学习小记](https://blog.csdn.net/a_crazy_czy/article/details/51959546。).

一个抽象理解：$x^2 \equiv (-x)^2 \pmod p$，即解总是成对存在的。

> 性质2：$\left(\frac{a}{p}\right) \equiv a^{(p-1)/2} \pmod p$

利用上述性质，可以求解模$p$下的二次剩余了。




## 求解二次剩余

先明确我们需要求解的是 $x^2 \equiv n \pmod p$ 中的 $x$。

具体操作：

1. 随机一个数 $a$，并记 $w = a^2 - n$，且使得 $w$ 不是模 $p$ 下的二次剩余，即 $w$ 不能在原数域 $\mathbb F_{p}$ 上开根。（暂时忽略为什么是这样）

2. 类似虚数，定义数域 $\mathbb F_{p^2}$：$\{ x + y \sqrt w | x, y \in \mathbb F_{p} \}$。

3. 在数域 $\mathbb F_{p^2}$ 上有 $x \equiv (a + \sqrt w)^{\frac {p+1}2} \pmod p$，这些解同时也是 $\mathbb F_{p}$ 上的解。注意是 ${\frac {p+1}2}$ 不是 ${\frac {p-1}2}$。

关于随机次数，因为 $p$ 个数中只有 $\frac {p-1}2$ 个数不是二次剩余，因此期望随机得到它的次数大约是 $2$ 次。这样就能找到这个 $x$ 的值了。

上述操作非常神秘，通过类似虚数一样定义了 $\sqrt w = \sqrt {-1}$ 的东西扩展了数域 $\mathbb F_{p^2}$，并在 $\mathbb F_{p^2}$ 上解该二次剩余，得到的根恰好落在原数域 $\mathbb F_{p}$ 上。对于为什么这样是正确的，请移步上文的博客。

---

证明过程中利用到了一个式子：

$$
(a+b)^n \equiv a^n + b^n \pmod n
$$

这个式子意外地有个名字叫[Freshman's Dream](https://en.wikipedia.org/wiki/Freshman%27s_dream)。这个很好理解，把左侧进行二项式展开之后，除了首尾两项的组合数中都因为含有 $n$ 而被消掉，只剩下两项不含 $n$ 的项。

这个式子可以用于在剩余系下进行二项式展开化简。




## 代码实现

```c++
typedef long long ll;
const int MOD = 1e9+7;
ll _w;

struct Complex{
	ll x, y;
	Complex(ll _x = 0, ll _y = 0){
		x = _x, y = _y;
	}
	Complex operator * (Complex &b){
		ll _x = (x*b.x + y*b.y % MOD *_w) % MOD;
		ll _y = (x*b.y + y*b.x) % MOD;
		return Complex(_x, _y);
	}
	Complex operator ^ (int t){
		auto ret = Complex(1, 0);
		auto bas = (*this);
		for(; t; t>>=1, bas = bas*bas)
			if(t&1) ret = ret*bas;
		return ret;
	}
};

ll QPow(ll bas, int t);
ll Inv(ll x);

ll Legendre(ll x){
	return QPow(x, (MOD-1)/2);
}

ll QuaRes(ll n){
	if(Legendre(n) == 0) return 0;

	mt19937 rng(time(0));
	uniform_int_distribution<> dis(0, MOD-1);
	while(1){
		ll a = dis(rng);
		_w = ((a*a - n) % MOD + MOD) % MOD;
		if(Legendre(_w) != MOD-1) continue;
		return (Complex(a, 1)^(MOD+1)/2).x;
	}
}

void Solve(ll d){
	// 无解
	if(Legendre(d) == MOD-1) return;
	// 解有两个，可能存在 x1 = x2 = 0 的情况
	ll x1 = QuaRes(d);
	ll x2 = MOD - x1;
}
```