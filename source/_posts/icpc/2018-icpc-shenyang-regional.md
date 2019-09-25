---
title: The 2018 ICPC Asia Shenyang Regional Contest
comment: true
mathjax: true
date: 2019-9-6 16:47:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://cn.vjudge.net/contest/324261)

题目	|A	|B	|C	|D	|E	|F	|G	|H	|I	|J	|K	|L	|M	
-		|-	|-	|-	|-	|-	|-	|-	|-	|-	|-	|-	|-	|-	
通过	| 	|	|√	|	|	|	|	|	|	|	|	|	|√
补题	| 	|	|	|	|√	|	|	|	|	|	|	|	|

<!--more-->

## E - The Kouga Ninja Scrolls

### 题解

将 $(x, y)$ 转换为 $(x+y, x-y)$，

### 代码

{%fold%}
```c++
#include<iostream>
#include<cstdio>
#include<vector>
using namespace std;

typedef long long ll;
const int N=300000+5,LEN=20,MOD=1000000007;

int pa[N][LEN],dep[N];
vector<int> a[N];
int n,m,lim;

ll QPow(ll bas,int t){
	ll ret=1; bas%=MOD;
	for(;t;t>>=1,bas=bas*bas%MOD)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

ll Inv(ll x){
	return QPow(x,MOD-2);
}

void DFS4LCA(int u,int _pa=0){
	pa[u][0]=_pa;
	dep[u]=dep[_pa]+1;

	for(int i=1;i<LEN;i++)
		pa[u][i]=pa[pa[u][i-1]][i-1];
	for(int i=0;i<a[u].size();i++)
		if(a[u][i]!=_pa)
			DFS4LCA(a[u][i],u);
}

int LCA(int u,int v){
	if(dep[u]<=dep[v])swap(u,v);

	for(int i=LEN-1;i>=0;i--)
		if(dep[pa[u][i]]>=dep[v])
			u=pa[u][i];

	if(u==v)return u;

	for(int i=LEN-1;i>=0;i--)
		if(pa[u][i]!=pa[v][i])
			u=pa[u][i],v=pa[v][i];

	return pa[u][0];
}

int cnt[N],lca[N],lcas[N];		//cnt of LCA;
int l[N],r[N];
ll ans;

ll fac[N],inv[N];

ll C(int a,int b){		//C(a,b)	(a>=b)
	if(a<b)return 0;
	else return fac[a]*inv[b]%MOD*inv[a-b]%MOD;
}

void DFS(int u,int _pa=0){
	for(int i=0;i<a[u].size();i++)
		if(a[u][i]!=_pa){
			DFS(a[u][i],u);
			cnt[u]+=cnt[a[u][i]];
		}
}

void Init(){
	for(int i=1;i<=n;i++){
		a[i].clear();
		cnt[i]=lcas[i]=0;
	}
	ans=0;
}

int main(){
	fac[0]=inv[0]=1;
	for(int i=1;i<N;i++){
		fac[i]=fac[i-1]*i%MOD;
		inv[i]=Inv(fac[i]);
	}

	int nCase; scanf("%d",&nCase);
	while(nCase--){
		scanf("%d%d%d",&n,&m,&lim);
		Init();

		for(int i=1;i<n;i++){
			int u,v; scanf("%d%d",&u,&v);
			a[u].push_back(v);
			a[v].push_back(u);
		}

		for(int i=1;i<=m;i++)
			scanf("%d%d",&l[i],&r[i]);

		DFS4LCA(1);
		for(int i=1;i<=m;i++){
			lca[i]=LCA(l[i],r[i]);
			lcas[lca[i]]++;
			cnt[l[i]]++;cnt[r[i]]++;
			cnt[lca[i]]--;cnt[pa[lca[i]][0]]--;
		}
		DFS(1);

		for(int i=1;i<=n;i++){
			ans=(ans+C(cnt[i],lim))%MOD;
			ans=(ans-C(cnt[i]-lcas[i],lim))%MOD;
		}

		printf("%lld\n",(ans+MOD)%MOD);
	}

	return 0;
}
```
{%endfold%}
