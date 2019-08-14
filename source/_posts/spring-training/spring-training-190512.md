---
title: 190512 Spring Training 4
comment: true
mathjax: true
date: 2019-5-19 20:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://vjudge.net/contest/300319)

题目	|A	|B	|C	|D	|E	|F	
-		|-	|-	|-	|-	|-	|-	
通过	|×	|√	|√	|	|	|		
补题	|	|	|	|	|	|√	

<!--more-->







## A - 皮格和回文 

一个$n\times m$的每个格子中有一个字母，求左上角以最短路走向右下角中，路径上的字符串是回文串的方案数。

### 题解

以$x+y$作为转移的一维，从回文串的中间向串的两侧DP转移即可。时间复杂度$\mathcal{O}(n^3)$。

### 代码

{%fold%}
```c++
代码写得太丑，并且没有过
```
{%endfold%}




## B - 打印文章

一个非负数列$a_i$，可以将它划分为多段，每一段$[l,r]$的代价为$(\sum_{i=l}^r a_i)^2 + M$，求最小化代价。

### 题解

斜率优化模板题，具体可以参考之前写的[一篇总结](/summary/dynamic-programming)。

### 代码

{%fold%}
```c++
#include<iostream>
#include<algorithm>
#include<cstring>
using namespace std;

typedef long long ll;
const int N=500000+5;
const double INF=1e100;
ll f[N],s[N],g[N];
int n,m;

double Slope(int i,int j){
	if(s[i]==s[j])return INF;
	else return double(g[i]-g[j])/(s[i]-s[j]);
}

int BSearch(int L,int R,double x,int q[]){
	while(L<R){
		int M=(L+R)/2;
		if(Slope(q[M],q[M+1])<x)L=M+1;
		else R=M;
	}
	return L;
}

ll DP(){
	static int q[N];
	int p=0; q[++p]=0;
	
	for(int i=1;i<=n;i++){
		int j=q[BSearch(1,p,2*s[i],q)];
		f[i]=f[j]+(s[i]-s[j])*(s[i]-s[j])+m;
		g[i]=f[i]+s[i]*s[i];
		while(p>=2&&Slope(q[p-1],q[p])>=Slope(q[p],i))p--;
		q[++p]=i;
	}

	return f[n];
}

int main(){
	while(cin>>n>>m){
		for(int i=1;i<=n;i++){
			cin>>s[i];
			s[i]+=s[i-1];
		}
		cout<<DP()<<endl;
	}

	return 0;
}
```
{%endfold%}





## C - 玉米地 

一块$n\times m$的土地中有一些地方能种，一些地方不能种。两块相邻的土地不能都种，求合法的方案数。

### 题解

水水的状压DP。

### 代码

{%fold%}
```c++
#include<iostream>
#include<cstring>
using namespace std;

const int N=12+2,M=(1<<12)+5,MOD=100000000;
int f[N][M];
int msk[N];
int n,m;

int DP(){
	f[0][0]=1;
	for(int i=1;i<=n;i++)
		for(int j=0;j<(1<<m);j++){
			if(j&(j<<1))continue;
			if((j|msk[i-1])!=msk[i-1])continue;
			for(int k=0;k<(1<<m);k++){
				if(k&(k<<1))continue;
				if((k|msk[i])!=msk[i])continue;
				if(j&k)continue;
				f[i][k]=(f[i][k]+f[i-1][j])%MOD;	
			}
		}
	
	int ans=0;
	for(int j=0;j<(1<<m);j++)
		ans=(ans+f[n][j])%MOD;
	return ans;
}

int main(){
	cin>>n>>m;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++){
			int c; cin>>c;
			msk[i]=(msk[i]<<1)|(c==1);
		}
	cout<<DP();

	return 0;
}
```
{%endfold%}






## D - 只是一些排列 

很神秘的题，并没有搞懂。

### 题解

### 代码

{%fold%}
```c++
```
{%endfold%}







## E - 另一个最小化问题 



### 题解

很神秘的题，听说可以用带权二分写，有空补上。

### 代码

{%fold%}
```c++
```
{%endfold%}






## F - 树上染色 

给一个$n(\leq 2000)$个节点的树的$k$个节点染黑，$n-k$个节点染白。一种染色方案的价值为所有同色点对之间的边权和，求最大价值。

### 题解

只要用$f(u,i)$记录一下在点$u$的子树中染色$i$个黑点的最大价值，然后使用树上背包增加每次多选择的点对答案的贡献即可。但是枚举点、枚举当前子树的染色点数、枚举待合并子树的染色点数，看起来是$\mathcal{O}(n^3)$的啊？

考虑每次枚举的两棵子树中的点，它们不重不漏地枚举了以当前节点$u$为LCA的两个子树中的点，因此这样的时间复杂度是$\mathcal{O}(n^2)$的。

得到一个结论：枚举bound是两棵子树的size的操作，其时间复杂度一般都是$\mathcal{O}(n^2)$的。

### 代码

{%fold%}
```c++
#include<iostream>
#include<vector>
using namespace std;

typedef long long ll;
const int N=2000+5;
int n,nWhite,nBlack;
struct Adj{int v; ll w;};
vector<Adj> a[N];

ll f[N][N]; int siz[N];

void DFS(int u,int pa){
	siz[u]=1;
	for(int i=0;i<a[u].size();i++){
		int v=a[u][i].v; ll w=a[u][i].w;
		if(v==pa)continue;
		DFS(v,u);
		
		siz[u]+=siz[v];
		for(int i=min(siz[u],nWhite);i>=max(0,siz[u]-nBlack);i--)
			for(int j=max(0,i-siz[u]+siz[v]);j<=min(siz[v],i);j++){
				ll tmp=w*(1LL*j*(nWhite-j)+1LL*(siz[v]-j)*(nBlack-siz[v]+j));
				f[u][i]=max(f[u][i],f[u][i-j]+f[v][j]+tmp);
			}
	}
}

int main(){
	cin>>n>>nWhite;
	nBlack=n-nWhite;
	for(int i=1;i<n;i++){
		int u,v; ll w;
		cin>>u>>v>>w;
		a[u].push_back((Adj){v,w});
		a[v].push_back((Adj){u,w});
	}

	DFS(1,0);
	cout<<f[1][nWhite];

	return 0;
}
```
{%endfold%}
