---
title: Codeforces Round 553 (Div. 2)
comment: true
mathjax: true
date: 2019-4-21 22:44:00
tags:
categories:
- 比赛
- Codeforces
---

[比赛链接](https://codeforces.com/contest/1151)

题目	|A	|B	|C	|D	|E	|F
-		|-	|-	|-	|-	|-	|-
通过	|√	|×	|√	|√	|	|
补题	|	|√	|	|	|√	|√

<!--more-->





## A. Maxim and Biology

### 题解

暴力对长度为4的子串计算到`ACTG`的距离就好了。




## B. Dima and a Bad XOR

### 题解

一开始每行随便选一个，如果xor出来非0，则找到了一种答案；否则考虑把选择的数换成同一行里的另一个不同的数，就能找到一种非0的方案。无解的情况是每行的值都一样。

一开始按位考虑写了个$\mathcal{O}(n^2\log {a_i})$的写法（而且没有被卡），但是这个想法显然太复杂了。最近总出现学傻了然后用复杂方法解决简单问题的情况。

### 代码

{%fold%}
```c++
#include<iostream>
#include<cmath>
#include<cstring>
using namespace std;

const int N=500+5;
int f[N][2];
int a[N][N];
int n,m;

int main(){
	cin>>n>>m;
	int ans=0;
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++)
			cin>>a[i][j];
		ans^=a[i][1];
	}
	if(ans){
		cout<<"TAK\n";
		for(int i=1;i<=n;i++)
			cout<<1<<' ';
		return 0;
	}else{
		bool flag=0; int ret[N];

		for(int i=1;i<=n;i++){
			ret[i]=1;
			for(int j=1;j<=m;j++)
				if(flag==0&&a[i][j]!=a[i][1]){
					ret[i]=j; flag=1;
					break;
				}
		}

		if(flag){
			cout<<"TAK\n";
			for(int i=1;i<=n;i++)
				cout<<ret[i]<<' ';
			return 0;
		}else cout<<"NIE";
	}

	return 0;
}
```
{%endfold%}




## C. Problem for Nazar

### 题解

找规律题。手推一下奇数和偶数数列的前缀和公式即可。




## D. Stas and the Queue at the Buffet

### 题解

分解一下要求的式子，发现最后结果和$\sum_j (a_i-b_i) \times j$有关，用排序不等式最小化一下即可。





## E. Number of Components

### 题解

分别考虑每一位$a_i$作为一个存留下来的区间的左端点时能做的贡献，显然这个时候只要不选中$a_{i-1}$，$a_i$就能成为左端点，这个数目等于使得$a_i \in [l,r]$但是$a_{i-1} \notin [l,r]$的区间数目。最后把所有贡献加起来即可。

### 代码

{%fold%}
```c++
#include<iostream>
#include<cmath>
#include<cstring>
#include<algorithm>
using namespace std;

typedef long long ll;
const int N=100000+5;
ll a[N];

int main(){
	int n; cin>>n;
	ll ans=0;
	for(int i=1;i<=n;i++){
		cin>>a[i];
		if(i==1)ans+=a[i]*(n-a[i]+1);
		else{
			if(a[i-1]>a[i])ans+=a[i]*(a[i-1]-a[i]);
			else ans+=(a[i]-a[i-1])*(n-a[i]+1);
		}
	}
	
	cout<<ans;

	return 0;
}
```
{%endfold%}




## F. Sonya and Informatics

### 题解

假设原序列有$p$个0，用$f_{i,j}$表示交换$i$次后，序列前$p$个中有$j$个0的方案数，则答案为$\dfrac{f_{k,p}}{\sum_{i=0}^n f_{k,i}}$。

中间的转移比较好想，但是要考虑一下枚举$j$时的范围应当是$[\max{2p-n,0},p]$。

转移采用快速幂可以达到$\mathcal{O}(n^3\log{k})$。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=100+5,MOD=1000000007;

struct Matrix{
	ll m[N][N];
	Matrix(){
		memset(m,0,sizeof(m));
	}
	void Diag(){
		for(int i=0;i<N;i++)
			m[i][i]=1;
	}
	Matrix operator*(const Matrix& b){
		Matrix ret;
		for(int i=0;i<N;i++)
			for(int j=0;j<N;j++)
				for(int k=0;k<N;k++)
					ret.m[i][j]=(ret.m[i][j]+m[i][k]*b.m[k][j])%MOD;
		return ret;
	}
	Matrix operator^(int t){
		Matrix ret; ret.Diag();
		Matrix bas=*this;
		for(;t;t>>=1,bas=bas*bas)
			if(t&1)ret=ret*bas;
		return ret;
	}
};

ll QPow(ll bas,int t){
	ll ret=1; bas%=MOD;
	for(;t;t>>=1,bas=bas*bas%MOD)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

ll Inv(ll x){
	return QPow(x,MOD-2);
}

int a[N];
int cnt0,cnt0pre;

int main(){
	int n,t; cin>>n>>t;
	for(int i=1;i<=n;i++){
		cin>>a[i];
		if(a[i]==0)cnt0++;
	}
	for(int i=1;i<=cnt0;i++)
		if(a[i]==0)cnt0pre++;

	Matrix trans,vec;
	vec.m[cnt0pre][1]=1;

	for(int i=max(2*cnt0-n,0);i<=cnt0;i++){
		trans.m[i][i]+=1LL*n*(n-1)/2;
		if(i-1>=max(2*cnt0-n,0)){
			trans.m[i][i-1]=1LL*(cnt0-i+1)*(cnt0-i+1)%MOD;
			trans.m[i-1][i-1]-=trans.m[i][i-1];
		}
		if(i+1<=cnt0){
			trans.m[i][i+1]=1LL*(i+1)*(n-2*cnt0+i+1)%MOD;
			trans.m[i+1][i+1]-=trans.m[i][i+1];
		}
	}

	Matrix ans=(trans^t)*vec;
	ll sum=0;
	for(int i=0;i<=cnt0;i++)
		sum=(sum+ans.m[i][1])%MOD;
	ll inv=Inv(sum);
	cout<<(ans.m[cnt0][1]*inv%MOD+MOD)%MOD;

	return 0;
}
```
{%endfold%}
