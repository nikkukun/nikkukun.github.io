---
title: 190519 Spring Training 6
comment: true
mathjax: true
date: 2019-6-2 14:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://vjudge.net/contest/302803)

题目	|A	|B	|C	|D	|E		
-		|-	|-	|-	|-	|-	
补题	|	|√	|√	|√	|√	

<!--more-->







## B - 满意度期望

令$\mathrm{RMQ}(l,r)$为$[l,r]$中最大数最左边的位置。给一个序列$a$，求一个$b_n\in [0,1]$的随机序列的所有$\mathrm{RMQ}(l,r)$与$a$相同的概率对$998244353$取模的结果。

### 题解

考虑维护一个东西：每个节点向左右第一个比它小的数连边，则当一个树的形态确定之后，每次查询RMQ的结果也是相同的，这个树就是笛卡尔树。和Treap建树类似，可以线性时间内建树。

考虑将一个随机的、互不相同（随机下认为出现相同数的概率是0）的序列填入一个节点对应的子树中，显然要满足所有放的方案中根节点是最大的，这个概率是$\dfrac 1{siz}$的。因此把所有节点都满足要求的概率相乘即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=3000000+5,MOD=1000000007,INF=0x3f3f3f3f;
ll inv[N];
int lch[N],rch[N];

ll QPow(ll bas,int t){
	ll ret=1; bas%=MOD;
	for(;t;t>>=1,bas=bas*bas%MOD)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

ll Inv(ll x){
	return QPow(x,MOD-2);
}

void InitInv(){
	static ll fac[N],fac_i[N];
	fac[0]=1;
	for(int i=1;i<N;i++)
		fac[i]=fac[i-1]*i%MOD;
	fac_i[N-1]=Inv(fac[N-1]);
	for(int i=N-1;i>0;i--)
		fac_i[i-1]=fac_i[i]*i%MOD;
	for(int i=1;i<N;i++)
		inv[i]=fac[i-1]*fac_i[i]%MOD;
}

void Build(int n){
	static int a[N];
	a[0]=INF;
	for(int i=0;i<=n;i++)
		lch[i]=rch[i]=-1;
	stack<int> q; q.push(0);

	for(int i=1;i<=n;i++){
		scanf("%d",&a[i]);
		while(a[q.top()]<a[i])q.pop();
		lch[i]=rch[q.top()];
		rch[q.top()]=i;
		q.push(i);
	}
}

ll ans;

int DFS(int u){
	if(u==-1)return 0;
	int siz=1+DFS(lch[u])+DFS(rch[u]);
	ans=ans*inv[siz]%MOD;
	return siz;
}

int main(){
	InitInv();

	int nCase; scanf("%d",&nCase);
	while(nCase--){
		int n; scanf("%d",&n);
		Build(n);
		ans=1LL*n*inv[2]%MOD;
		DFS(rch[0]);
		printf("%lld\n",ans);
	}

	return 0;
}
```
{%endfold%}







## D - 最大实力和 

一个图中，每个节点$u$都会向且只向一个$v$连有向边。选中节点$i$有$w_i$的价值，求一个价值最大的点集，使得没有任意两个点有连边。

### 题解

一个性质：如果一个图中，每个节点$u$都会向且只向一个$v$连有向边，那么这个东西会形成一个基环树（或森林）。

基环树还有一些妙妙的性质：

* 如果图中存在一个环，那么连在环上的树都是指向根节点的有向树。
* 断掉环上的一条边$u\rightarrow v$，将会形成一颗以$v$为根节点的有向树，这个性质得以让我们把基环树转换为树形DP。
* 随便沿着基环树上的一个节点沿着有向边走，最后总能走到环上，这个性质得以让我们找到环上的一条边。

考虑一个环上边$(u,v)$，在断掉边后分别以$u,v$为根做DP找出**不选**$u$或**不选**$v$时，原式的最大值$f_u,f_v$，两者取最大值即可。这是因为以$u$为根并选中时，不能保证$v$一定选中，因此可以强制令$u$不被选中。

注意图可能是基环树森林，要注意联通情况。

### 代码

~~都9102年了怎么还有不资瓷`std=c++11`的OJ~~

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=1000000+5;
int w[N],pa[N];
int n;
vector<int> a[N];

bool vst[N];
ll f[N][2];

void DP(int u,int rt){
	vst[u]=1;
	f[u][1]=w[u]; f[u][0]=0;
	for(auto v:a[u]){
		if(v==rt)continue;
		DP(v,rt);
		f[u][0]+=max(f[v][0],f[v][1]);
		f[u][1]+=f[v][0];
	}
}

ll Cycle(int u){
	vst[u]=1;
	while(!vst[pa[u]]){
		u=pa[u]; vst[u]=1;
	}
	ll ans1,ans2;
	DP(u,u); ans1=f[u][0];
	u=pa[u];
	DP(u,u); ans2=f[u][0];
	
	return max(ans1,ans2);
}

int main(){
	scanf("%d",&n);
	for(int v=1,u;v<=n;v++){
		scanf("%d%d",&w[v],&u);
		a[u].push_back(v);
		pa[v]=u;
	}

	ll ans=0;
	for(int i=1;i<=n;i++)
		if(!vst[i])
			ans+=Cycle(i);
	printf("%lld",ans);

	return 0;
}
```
{%endfold%}







## E - 最小生成树 

给一个图和$d(\leq 4)$个不相同的点对，要求选择一个权值最小的边集，使得每个点对的两个点联通（但是不要求不同点对之间可以联通）。

### 题解

神秘斯坦纳树模板题，可以参考09年论文《SPFA算法的优化及应用》姜碧野。

考虑用$f(u,t)$表示以节点$u$为根节点的树，并且这棵树中目标点的存在状态为$t$。初始状态是单独选中每个关键点时代价为$0$，那么有两种可能的转移：

1. 通过将$t$拆成两个互为补集的状态$t_1,t_2$，用$f(u,t_1)+f(u,t_2)$更新$f(u,t)$。

2. 通过一条边$(u,v)$，让$f(v,t)+w(u,v)$更新$f(u,t)$。

转移1是有明显的枚举顺序，而转移2的松弛操作可能多次更新一个值。发现这个形式就是最短路的松弛，因此用SPFA就可以实现更新。

第一个操作看上去好像会在合并时加入了相同的边，使得答案增大，但是事实上这样一定不是最优的，此时最优的答案会通过松弛得到。

注意操作1如果是对点权进行操作时，合并需要减去一个$w(u)$避免重复。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int V=10000+5,S=(1<<8)+5,INF=0x3f3f3f3f;
int nV,nE,lim;
struct Adj{int v,w;};
vector<Adj> a[V];
int f[V][S],g[S];

queue<int> q; bool inQ[V];

void SPFA(int s){
	while(!q.empty()){
		int u=q.front(); q.pop(); inQ[u]=0;
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i].v, w=a[u][i].w;
			if(f[v][s]>f[u][s]+w){
				f[v][s]=f[u][s]+w;
				if(!inQ[v])q.push(v),inQ[v]=1;
			}
		}
	}
}

bool Judge(int x){
	return (x&((1<<lim)-1))==(x>>lim);
}

int main(){
	cin>>nV>>nE>>lim;
	for(int i=1;i<=nE;i++){
		int u,v,w; cin>>u>>v>>w;
		a[u].push_back((Adj){v,w});
		a[v].push_back((Adj){u,w});
	}

	memset(f,0x3f,sizeof(f));
	memset(g,0x3f,sizeof(g));
	for(int i=1;i<=lim;i++){
		f[i][1<<(i-1)]=0;
		f[nV-i+1][1<<(lim+i-1)]=0;
	}

	for(int s=0;s<(1<<(lim*2));s++){
		for(int i=1;i<=nV;i++){
			for(int t=(s-1)&s;t;t=(t-1)&s)
				f[i][s]=min(f[i][s],f[i][t]+f[i][s-t]);
			if(f[i][s]!=INF)q.push(i),inQ[i]=1;
		}
		SPFA(s);
		for(int i=1;i<=nV;i++)
			g[s]=min(g[s],f[i][s]);
	}

	for(int s=0;s<(1<<(lim*2));s++)
		for(int t=(s-1)&s;t;t=(t-1)&s)
			if(Judge(s)&&Judge(t))
				g[s]=min(g[s],g[t]+g[s-t]);

	int ans=g[(1<<(lim*2))-1];
	cout<<(ans==INF?-1:ans);

	return 0;
}
```
{%endfold%}
