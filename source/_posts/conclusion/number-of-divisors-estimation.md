---
title: 约数个数和的上界
comment: true
mathjax: true
date: 2019-7-10 12:20:00
tags:
- 约数
categories:
- 小结论
---

在算法竞赛中偶尔会遇到复杂度与约数个数和相关的问题。

令$d(n)$表示$n$的约数个数，一个约数个数和的显然上界是$2\sqrt n$，但实际的$d(n)$往往远小于$2\sqrt n$，并不是一个合理的估计范围。

<!--more-->

[OEIS - A066150](http://oeis.org/search?q=1344+maximal+divisors)上给出了长度为$n$的数的最大$d(n)$。可以看到，`int`范围内$d(n)\leq 1344$，而`long long`范围内$d(n)\leq 103680$。

[这两](https://forthright48.com/upper-bound-for-number-of-divisors_14/)篇[文章](https://codeforces.com/blog/entry/14463)指出，可以用$\mathcal{O} (n^{1/3})$估计$d(n)$，这个结论在$n\leq 10^{18}$内都是被验证过了的。

貌似可以用$d(n) \leq 2 \times n^{1/3}$为一个上界，但是我并没有验证过这个结论。等有空了可以验证一下。
