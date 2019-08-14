---
title: 190702 Spring Training 13 (Group 1)
comment: true
mathjax: true
date: 2019-7-9 21:38:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://cn.vjudge.net/contest/308151)

题目	|A	|B	|C	|D	|E	|F	|G	|H	|I	|J
-		|-	|-	|-	|-	|-	|-	|-	|-	|-	|-	
通过	|√	|√	|	|√	|√	|	|√	|√	|√	|
补题	|	|	|	|	|	|	|	|	|	|

雀魂三人南一缺二中。

<!--more-->





## D - 爱死机摩人

给一个上下左右序列，可以往里面加一个操作或删掉一个操作，序列中不合法操作会被忽略，问让机器人走到终点最少操作次数。

序列长度、区域边长$\leq 50$。

### 题解

让一个状态$(x,y,d)$表示在$(x,y)$且执行完前$d$个指令后，最少操作步数。

有三种转移：做下一个操作、删掉下一个操作、在下一个操作之前添加一个操作。由于最后一种操作是$(x,y,d)\to (nx,ny,d)$，对任意$(x,y)$都成立，因此对于一个点$(x,y)$，我们只需要考虑移动到周围四个格子的状态即可。

通过这些操作可以转移到不超过$6$种状态，而所有状态数也是$\mathcal{O}(n^3)$的，因此用SPFA跑最短路即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef pair<int,int> pint;
const int N=50+5,M=N*N*N+5,INF=0x3f3f3f3f;
const int dx[]={-1,0,1,0},dy[]={0,1,0,-1};		//U,R,D,L
char g[N][N];
pint st,ed;
int n,m,len;

int Idx(int a,int b,int c){
	return (a*m+b)*(len+1)+c;
}

struct Adj{int v,w;};
vector<Adj> a[M];

int SPFA(){
	static int dis[M];
	static bool inQ[M];
	
	int h=Idx(st.first,st.second,0);
	memset(dis,0x3f,sizeof(dis));
	dis[h]=0;
	deque<int> q; q.push_back(h);
	
	while(!q.empty()){
		int u=q.front(); q.pop_front();
		for(auto e:a[u]){
			if(dis[e.v]>dis[u]+e.w){
				dis[e.v]=dis[u]+e.w;
				if(!inQ[e.v]){
					if(!q.empty() && dis[q.front()]>dis[e.v])
						q.push_front(e.v);
					else q.push_back(e.v);
					inQ[e.v]=1;
				}
			}
		}
		inQ[u]=0;
	}

	int ans=INF;
	for(int i=0;i<=len;i++)
		ans=min(ans,dis[Idx(ed.first,ed.second,i)]);

	return ans;
}

bool isLegal(int x,int y){
	if(x<0||x>=n)return 0;
	if(y<0||y>=m)return 0;
	if(g[x][y]=='#')return 0;
	return 1;
}

int op[N];
void AddEdge(){
	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++)
			for(int k=0;k<=len;k++){
				if(!isLegal(i,j))continue;

				//exe
				if(k<len){
					int nx=i+dx[op[k+1]];
					int ny=j+dy[op[k+1]];
					if(isLegal(nx,ny)){
						int u=Idx(i,j,k);
						int v=Idx(nx,ny,k+1);
						a[u].push_back(Adj{v,0});
					}else{
						int u=Idx(i,j,k);
						int v=Idx(i,j,k+1);
						a[u].push_back(Adj{v,0});
					}
				}

				//del
				if(k<len){
					int u=Idx(i,j,k);
					int v=Idx(i,j,k+1);	
					a[u].push_back(Adj{v,1});
				}

				//add
				for(int l=0;l<4;l++){
					int nx=i+dx[l];
					int ny=j+dy[l];
					if(isLegal(nx,ny)){
						int u=Idx(i,j,k);
						int v=Idx(nx,ny,k);
						a[u].push_back(Adj{v,1});
					}
				}
			}
}

int main(){
	cin>>n>>m;
	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++){
			cin>>g[i][j];
			if(g[i][j]=='S')st=make_pair(i,j);
			if(g[i][j]=='G')ed=make_pair(i,j);
		}

	string s; cin>>s;
	len=s.length();
	for(int i=0;i<len;i++){
		if(s[i]=='U')op[i+1]=0;
		else if(s[i]=='R')op[i+1]=1;
		else if(s[i]=='D')op[i+1]=2;
		else if(s[i]=='L')op[i+1]=3;
	}

	AddEdge();
	cout<<SPFA();
	
	return 0;
}
```
{%endfold%}





## J - 多风的小路

给定平面上$n(\leq 50)$个不同且无三点共线的点，给定一个长度为$n-2$的转向序列（只为“左转”或“右转”），构造一个不相交的连线顺序使得连线过程的转向满足转向序列。

### 题解

非常神秘的一个构造题目。其实从哪个点开始都可以构造出这样的路径，因此我们随便选定一个点。

对于一个点，如果要求在下一个点的位置左转，那么下一个点只需要选与该点连线最靠右的点即可，因为这样无论下下个点选什么，在下个点处都必定是左转。反之亦然。

这里可能有个问题：有没有可能相交？事实上并不会。如果连接到一个新的点会和原来的某个线段相交，那么那个线段中的点一定不是选中了最靠左或最靠右的点，与构造方式矛盾。因此并不会相交。

### 代码

没有代码。






## 总结

* 跟操作顺序有关的DFS一般都可以改成`next_permutation()`然后Check一下，小常数且好写，比如
	* 手机锁屏密码个数统计问题
	* 本次的E题
