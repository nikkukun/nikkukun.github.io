---
title: 2019牛客暑期多校训练营（第一场）
comment: true
mathjax: true
date: 2019-7-31 10:23:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://ac.nowcoder.com/acm/contest/881#question)

题目	|A	|B	|C	|D	|E	|F	|G	|H	|I	|J	
-		|-	|-	|-	|-	|-	|-	|-	|-	|-	|-	
通过	|√	|	|	|	|	|	|	|	|	|	
补题	|	|	|	|	|	|	|	|	|	|	

<!--more-->

## A - Equivalent Prefixes

> Solved by nikkukun.

两个序列RMQ同构等价于笛卡尔树同构，因此增量式插入即可。

## B - Intergration

> Solved by prime21.

## D - ABBA

> Upsolved by Chielo.

考虑容斥。AB序列个数为$C_{2(n+m)}^{n+m}$，那需要考虑让序列能选的AB数量小于$n$的方案数，和BA数量小于$m$的方案数。

要让BA小于$m$，相当于让AB大于$n$。最贪心的选择方法是，对每一个A，找到它后面最远的B匹配上。

因此可以用AB的前缀数量差来限定，只要有某个前缀里A比B多的数量大于$n$个，则这样子无论怎么匹配都至少有$n+1$个AB。限制前缀差相当于从左下角走到右下角时，不能经过某条直线的方案数。带限制条件的走法相当于求Catalan数列的推导，只要能把经过边界线的不合法的方案一一对应上某个其他合法方案即可。这个数量是$C_{2(n+m)}^{m-1}$。

答案为$C_{2(n+m)}^{n+m} - C_{2(n+m)}^{m-1} - C_{2(n+m)}^{n-1}$

