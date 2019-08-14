---
title: CUGB Campus Programming Contest 2018
date: 2018-12-09 00:00:00
comment: true
mathjax: true
tags:
categories:
-  比赛
---

入学以来参加的第一次线下比赛竟然是在其他学校参加的~~而我校校赛的鸽子们能不能出成题都是个问题~~。

一点钟到达地大。迎接的志愿者小姐姐很可爱！问的问题也都回答得很详细！她说我们可能是来得最早的学校，其他学校都是一点半才来的。不过这样我们就有了很多时间可以调机子。

初步调了配置，一开始问题是挺多的，比如没有Linux，比如Dev的调试功能不能使用。这个问题很大，需要慌。不过最后总算搞好gdb和VSCode了，坐在屏幕前等比赛开始。

<!--more-->

# A

一个字符串中的字母可以大写也可以小写，求给定字符串的写法的方案数。

## 题解

签到题，答案是$2^{字母个数}$。

# B

判断一个字符串数组的每一个串是否含有特定子串。

## 题解

`substr`一下就好了。注意参数是`substr(begin,length)`。

# C

给定两个长度为$n(\leq 10^6)$的数组$a_i,b_i(\leq 10^6)$，问能否找到$a_i+b_j=m(\leq 10^6)$的两个数。

## 题解

先预处理$a_i$，再判断是否有$a_j=m-b_i$即可。

# D

给定四个长度为$n(\leq 1000)$的数组$a_i,b_i,c_i,d_i(\leq 10^9)$，问找到$a_i+b_j+c_k+d_l=m(\leq 10^9)$的概率（最简分数）。

## 题解

像C一样用`map`预处理$a_i+b_j$，然后判断是否有$c_k+d_l=m-a_i+b_j$即可。

如果答案是0或1，需要直接输出0和1。~~数论只会GCD~~

（我觉得这波操作很正确，但是不知为何WA了）

# E

让你根据格式输出一个沙漏。

## 题解

签到题+题意题。

# F

$n(\leq 10)$个城市的完全图中，求从起点1出发，随机走$m(\leq 10)$步回到起点1的方案。

## 题解

看这个范围可以爆搜？

其实就是求一个相邻元素不同的环的个数。可以容斥一下：$f(m)=(n-1)^{m-1}-f(m-1)$。

# G

给一个图（$n\times n(n\leq 50)$，有障碍），36次询问是否能$k_i(\leq 200)$步从起点走到终点（可以重复走）。

## 题解

std是用最短路奇偶性判断，因为多出来的路可以在最短路上来回走动增加偶数次。

不过其实也可以搞$O(\max{k_i}\times n^2)$的dp（BFS？）。

# H

你需要过一个长度为$T(\leq 10)$的马路，其中有8种亲亲操作，每做一种操作可以前进$k_i$步，然而做了某些操作就会产生后效性。

求过马路的方案数。

## 题解

这题太沙雕了吧……这个操作太多了，完全不会DP啊。（一起参赛的同学：这不是手推就可以打表了吗？）

然后又写了一遍DFS，还是不会。

结果std写的就是DFS。看来得找一点大爆搜题目练练了。

# I

有$n(\leq 5000)$个物品，其中第$i$个物品有$a_i$种，求选出$m(\leq 500)$个不同物品的方案数。

空间限制65536KB。

## 题解

显然有方程$f_{i,j}=f_{i-1,j}+f_{i-1,j-1}*a_i$，答案是$f_{n,m}$。

需要滚动数组。

# J

在线多次区间XOR，求最后的序列。

## 题解

显然只要前缀XOR即可。

但是为什么考场时我写了个树状数组？？（没有反应过来只查询了一次）

学DS学傻系列。

# K

给一个$n(\leq 100)$个节点的图，$q(\leq 10^5)$次询问从$i$能否$k$步走到$j$。

## 题解

有个很显然的做法是矩阵快速幂，时间复杂度$O(n^3\log k+q)$。

但是在这个数据范围下还有一个也很显然的做法，就是G题的dp做法，时间复杂度$O(kn^2+q)$。

# L

给一个无自环无重边的、有$n(\leq m)$个节点$m(\leq 10^5)$条边的无向图和一个点集$S(|S|\leq n)$，求每个$a_i\in S$最近的、在$S$中的点的距离（不包括$a_i$）。

## 题解

据说这是一道防AK题（事实上确实达到了这个效果），感觉比去年的Polya裸题难处理一些。

有点意思的题目，需要魔改最短路算法。

首先建立个超级源点，以$S$里的所有点当做源点跑Dijkstra，并且记录每个新的点是由哪个源点更新的。如果一由源点$u$扩展的点第一次到达了由源点$v$扩展的点$w$，那么显然$dis_{u,w}+dis_{w,v}$就是$(u,v)$的答案（因为在此之后$(u,v)$最短路的其他交点$dis_{u,w‘}$和$dis_{w,v’}$都不会比原来小），故$u$可以不用继续在$w$之后的点扩展了。

由于每个点只会在Dijkstra过程被最多一个源点“占据”，且其他源点不会经过被“占据”的点，所以整个过程访问的点数是$O(n)$的，故总时间复杂度为$O((n+m)\log n)$。

---

# 总结

最后还是被北理和北师大的同学打压了……题目还行，但是题目本质重复率略高，并且数据范围都开得很迷。

虽然最后也没有得多少气球，但是果然还是打比赛最让人振奋啊。

~~所以我们学校的校赛呢？？？~~