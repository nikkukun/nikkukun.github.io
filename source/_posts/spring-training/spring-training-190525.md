---
title: 190525 Spring Training 7
comment: true
mathjax: true
date: 2019-6-2 15:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://vjudge.net/contest/302803)

题目	|A	|B	|C	|D	|E	|F	|G
-		|-	|-	|-	|-	|-	|-	|-
通过	|√	|×	|	|√	|√	|√	|
补题	|	|√	|	|	|	|	|√

<!--more-->








## F - Budget

给一个非负矩阵，并提供各行各列的元素和，和$m$个形如子矩阵$A_m$中的和大于/等于/小于$w_m$的条件，判断是否存在满足条件的矩阵，并输出。

### 题解

套路式地以行列建二分图，然后跑上下界网络流。不过利用分层图的性质，也可以不用上下界网络流。具体做法是：

* 对于小于条件，修改$S\rightarrow T$的边上的流量上限
* 对于大于条件，记录大于的值$w$，并给$S\rightarrow T$的边上的流量上限减去$w$，最后输出时再加上
* 对于等于条件，可以转化为上述两种条件。

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=200*20+5,M=200+5,INF=0x3f3f3f3f;

struct Dinic{
	const static int V=N*2;
	struct Edge{int v,res;};
	vector<Edge> edg;
	vector<int> a[V];
	int st,ed;

	void Init(){
		edg.clear();
		for(int i=0;i<V;i++)
			a[i].clear();
	}

	void AddEdge(int u,int v,int cap){
		edg.push_back((Edge){v,cap});
		edg.push_back((Edge){u,0});
		int siz=edg.size();
		a[u].push_back(siz-2);
		a[v].push_back(siz-1);
	}

	int dep[V];
	bool BFS(){
		memset(dep,-1,sizeof(dep));
		dep[st]=0; 
		queue<int> q; q.push(st);

		while(!q.empty()){
			int u=q.front(); q.pop();
			for(int i=0;i<a[u].size();i++){
				Edge& e=edg[a[u][i]];
				if(dep[e.v]==-1&&e.res>0){
					q.push(e.v),dep[e.v]=dep[u]+1;
				}
			}
		}

		return dep[ed]!=-1;
	}

	int cur[V];
	int DFS(int u,int minF){
		if(u==ed||minF==0)return minF;

		int tmpF,sumF=0;
		for(int& i=cur[u];i<a[u].size();i++){
			Edge& e=edg[a[u][i]];
			if( dep[e.v]==dep[u]+1 && (tmpF=DFS(e.v,min(e.res,minF)))>0 ){
				e.res-=tmpF; edg[a[u][i]^1].res+=tmpF;
				sumF+=tmpF; minF-=tmpF;
			}
			if(minF==0)break;
		}

		return sumF;
	}

	int MaxFlow(){
		int ret=0;
		while(BFS()){
			memset(cur,0,sizeof(cur));
			ret+=DFS(st,INF);
		}
		return ret;
	}
};

int upp[N],low[N];
int sumRow[N],sumCol[N];
int n,m;

void Read(){
	cin>>n>>m;
	for(int i=0;i<n;i++)
		cin>>sumRow[i];
	for(int i=0;i<m;i++)
		cin>>sumCol[i];

	int q; cin>>q;
	while(q--){
		int x,y,w; char c;
		cin>>x>>y>>c>>w;
		int x1 = x?x-1:0, x2 = x?x:n;
		int y1 = y?y-1:0, y2 = y?y:m;

		for(int i=x1;i<x2;i++)
			for(int j=y1;j<y2;j++){
				int o=i*m+j;
				if(c=='>')low[o]=max(low[o],w+1);
				else if(c=='<')upp[o]=min(upp[o],w-1);
				else{
					low[o]=max(low[o],w);
					upp[o]=min(upp[o],w);
				}
			}
	}
}

Dinic sol;

bool Build(){
	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++){
			int o=i*m+j;
			sumRow[i]-=low[o];
			sumCol[j]-=low[o];
			if(upp[o]-low[o]<0)return 1;
			sol.AddEdge(i,n+j,upp[o]-low[o]);
		}
	sol.st=n+m, sol.ed=n+m+1;
	for(int i=0;i<n;i++)
		sol.AddEdge(sol.st,i,sumRow[i]);
	for(int i=0;i<m;i++)
		sol.AddEdge(n+i,sol.ed,sumCol[i]);
	return 0;
}

bool Solve(){
	sol.MaxFlow();
	for(auto i:sol.a[sol.st]){
		auto e=sol.edg[i];
		if(e.res!=0)return 1;
	}
	
	sol.MaxFlow();
	for(auto i:sol.a[sol.ed]){
		auto e=sol.edg[i^1];
		if(e.res!=0)return 1;
	}

	for(int i=0;i<n;i++){
		for(int j=0;j<m;j++){
			int o=i*m+j;
			cout<<sol.edg[o<<1|1].res+low[o]<<' ';
		}
		cout<<endl;
	}

	return 0;
}

void Init(){
	memset(upp,0x3f,sizeof(upp));
	memset(low,0,sizeof(low));
	sol.Init();
}

int main(){
	int nCase; cin>>nCase;
	while(nCase--){
		Init();
		Read();
		bool flag=Build();
		if(flag||Solve())cout<<"IMPOSSIBLE\n";
	}
	return 0;
}
```
{%endfold%}




## G - Antenna Placemen

给一个网格图，上面有一定关键点，每次可以用一个基站覆盖相邻的两个位置，求最少的基站数。

### 题解

把基站分为独立的$n$个和相邻位置有东西的$m$个，那么前者需要$n$个基站，后者需要$最小边覆盖=m-最大匹配$，合起来即可。

### 代码

{%fold%}
```c++
#include<iostream>
#include<cstring>
#include<vector>
#include<queue>
#include<deque>
using namespace std;

const int N=40*10+5;
int g[N][N];

namespace Hungary{
	bool vst[N]; int lnk[N];
	int n;
	bool DFS(int u){
		for(int v=1;v<=n;v++)
			if(g[u][v]&&!vst[v]){
				vst[v]=1;
				if(!lnk[v]||DFS(lnk[v])){
					lnk[v]=u; return 1;
				}
			}
		return 0;
	}
	int MaxMatch(){
		memset(lnk,0,sizeof(lnk));
		int ret=0;
		for(int i=1;i<=n;i++){
			memset(vst,0,sizeof(vst));
			if(DFS(i))ret++;
		}
		return ret;
	}
};

int n,m;
char s[N][N];

bool isLegal(int x,int y){
	if(x<0||x>=n)return 0;
	if(y<0||y>=m)return 0;
	return 1;
}

void Read(){
	cin>>n>>m;
	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++){
			char c; cin>>c;
			if(c=='*')s[i][j]=1;
			else s[i][j]=0;
		}
}

int dx[]={1,0,-1,0};
int dy[]={0,1,0,-1};

int Solve(){
	int cnt=0;

	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++){
			if(!s[i][j])continue;
			int o1=i*m+j+1; cnt++;
			for(int k=0;k<4;k++){
				int x=i+dx[k], y=j+dy[k];
				if(!isLegal(x,y)||!s[x][y])continue;
				int o2=x*m+y+1;
				if((i+j)&1)g[o1][o2]=1;
				else g[o2][o1]=1;
			}
		}
	
	Hungary::n=n*m;
	return cnt-Hungary::MaxMatch();
}

int main(){
	int nCase; cin>>nCase;
	while(nCase--){
		memset(g,0,sizeof(g));

		Read();
		cout<<Solve()<<endl;
	}

	return 0;
}
```
{%endfold%}
