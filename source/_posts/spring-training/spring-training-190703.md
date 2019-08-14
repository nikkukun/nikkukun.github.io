---
title: 190703 Spring Training 14 (Group 2)
comment: true
mathjax: true
date: 2019-7-9 22:08:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://cn.vjudge.net/contest/308151)

题目	|A	|B	|C	|D	|E	|F	|G	|H	|I	|J	|K
-		|-	|-	|-	|-	|-	|-	|-	|-	|-	|-	|-
通过	|√	|	|√	|	|√	|	|√	|	|√	|√	|√
补题	|	|	|	|√	|	|	|	|	|	|	|

雀魂三人南一缺二中。

<!--more-->





## D - Scotland Yard's fail

有$n(\leq 10^5)$个人与$m(\leq 10^5)$对相互认识的关系，其中有一个人是杀手。在$t(\leq n-1)$中，杀手每天杀掉一个认识的人$person_i$，而这个人认识的所有人会来参加葬礼（包括凶手），葬礼过后参加者全部都两两互相认识了。

求第几天可以锁定凶手。

### 题解

假设第$i$天死掉的人朋友集合是$S_i$，则到第$i$天为止，潜在杀手集合$S = \bigcap S_i$。

现在考虑新死了一个人$i+1$。如果这个人之前没参加过葬礼，则他原有的朋友集合构成了$S_{i+1}$。如果这个人之前参加过葬礼，则肯定有一些集合$S_j$包含$i+1$，这些人构成了他通过葬礼认识的新朋友集合。注意到$S \subseteq S_j$，因此$S\cap S_j = S$，也就是不对潜在杀手集合产生影响。

这样，只要维护潜在杀手集合$S= \bigcap S_i$与参加过葬礼的人$T= \bigcup S_i$即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=200000+5;
vector<int> a[N];
int n,m,t;

set<int> s;
bool isFriend[N],isDead[N];

int main(){
	cin>>n>>m;
	for(int i=1;i<=m;i++){
		int u,v; cin>>u>>v;
		a[u].push_back(v);
		a[v].push_back(u);
	}

	for(int i=1;i<=n;i++)
		s.insert(i);

	cin>>t;
	for(int i=1;i<=t;i++){
		int u; cin>>u; isDead[u]=1;
		for(auto v:a[u])
			isFriend[v]=1;
		if(!isFriend[u]){
			set<int> _s;
			for(auto v:a[u])
				if(!isDead[v] && s.count(v))
					_s.insert(v);
			s=_s;	
		}else s.erase(u);
		if(s.size()==1){
			cout<<i<<' '<<(*s.begin());
			return 0;
		}
	}

	cout<<-1;

	return 0;
}
```
{%endfold%}





## E - Test variants 

给定$n,k$，构造一个序列$\{a_n\}$使得

* $a_i \neq a_{i+1}$
* $a_i \neq a_j$，对$i \equiv j \pmod k$

### 题解

非常神秘的一个构造题目。

假设只需要$[1,v]$就可以构造出序列，因此只要构造出$a_1, \ldots, a_k$，然后让$a_{i+k} = (a_{i} \bmod v) +1$即可。其中$v = \mathrm{max} (k,\lceil n/k \rceil )$。

可以注意到只要让前$k$个为$\{1,3,1,3,\ldots\}$的形式即可满足大部分要求，然后特判只用$\{1\}$和只用$\{1,2\}$就能完成的两种情况。

具体见代码。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<int,int> pint;
const int N=100000+5;
int n,k;
int a[N];

int main(){
	cin>>n>>k;
	int v=(n+k-1)/k;

	if(n==1)cout<<1;
	else if( v==1 || (v==2 && (k&1)) ){
		for(int i=1;i<=n;i++)
			cout<<(i%2+1)<<' ';
	}else{
		v=max(v,3);
		a[1]=1;
		for(int i=2;i<=k;i++)
			a[i]=(i&1)?1:3;
		for(int i=k+1;i<=n;i++)
			a[i]=(a[i-k]+1-1)%v+1;
		for(int i=1;i<=n;i++)
			cout<<a[i]<<' ';
	}

	return 0;
}
```
{%endfold%}
