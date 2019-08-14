---
title: 190518 Spring Training 5
comment: true
mathjax: true
date: 2019-5-21 20:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://vjudge.net/contest/298001)

题目	|A	|B	|C	|D	|E		
-		|-	|-	|-	|-	|-	
通过	|√	|	|√	|	|√		
补题	|	|√	|	|√	|	

最近好摸啊，一堆题还没补，一堆题解还没写…打完邀请赛之后又看到了和学长们的差距，要学习的知识点`++`，熟练度`++`。

这么想的同时发现烤漆将至…又要变得繁忙起来了呢。

<!--more-->







## A - 向下取整，越除越小 

给一个有边权的树，支持两种操作：

1. 对一个数$y$，不断除以$(u,v)$上的边权$w$并向下取整
2. 将某条边边权$w$改为一个更小的值$w'$

### 题解

由于向下取整中整数除法的可以内外交换性质，只需要能够动态维护两点路径的乘积即可，可以树剖+线段树维护。但是这么做就不需要满足每次修改操作都往小改啊？

注意到一个路径上$y$最多除$64$个大于$1$的$w$就能变成$0$，如果能跳过所有边权为$1$的边，那么也可以做到$O(n)$了，这个可以用并查集实现。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

#define lson (o<<1)
#define rson (o<<1|1)

typedef long long ll;
const int N=200000+5;
const ll INF=0x3f3f3f3f3f3f3f3f;

int nV,nE;
struct Edge{int u,v,w;};
Edge edg[N];

ll Mul(ll a,ll b){
	double tmp=1.0*a*b;
	if(tmp>1e18)return 0;
	else return a*b;
}

struct SegTree{
	ll t[N*4];
	void Build(int L,int R,int o,ll a[]){
		if(L==R){
			t[o]=a[L];
			return;
		}
		int M=(L+R)/2;
		Build(L,M,lson,a); Build(M+1,R,rson,a);
		t[o]=Mul(t[lson],t[rson]);
	}
	void Modify(int x,ll w,int L,int R,int o){
		if(L==R){
			t[o]=w;
			return;
		}
		int M=(L+R)/2;
		if(x<=M)Modify(x,w,L,M,lson);
		else Modify(x,w,M+1,R,rson);
		t[o]=Mul(t[lson],t[rson]);
	}
	ll Query(int L,int R,int o,int qL,int qR){
		if(qL<=L&&R<=qR)return t[o];
		int M=(L+R)/2; ll wlson=1,wrson=1;
		if(qL<=M)wlson=Query(L,M,lson,qL,qR);
		if(M+1<=qR)wrson=Query(M+1,R,rson,qL,qR);		
		return Mul(wlson,wrson);
	}
};

struct Adj{int v; ll w;};

namespace HLDcp{
	SegTree t;
	int dep[N],siz[N],pa[N],son[N],top[N],idx[N];
	vector<Adj> a[N]; ll tmpW[N];
	int nIdx=0;

	void DFS1(int u=1,int pa=0){
		dep[u]=dep[HLDcp::pa[u]=pa]+1;
		siz[u]=1;son[u]=0;
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i].v;
			if(v==pa)continue;
			DFS1(v,u);
			if(siz[v]>siz[son[u]])son[u]=v;
			siz[u]+=siz[v];
		}
	}
	void DFS2(int u=1,int pa=0,ll w=0){
		idx[u]=++nIdx; top[u]=u;
		tmpW[idx[u]]=w;
		if(son[pa]==u)top[u]=top[pa];
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i].v;
			ll w=a[u][i].w;
			if(v==son[u])DFS2(v,u,w);
		}
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i].v;
			ll w=a[u][i].w;
			if(v==pa||v==son[u])continue;
			DFS2(v,u,w);
		}
	}
	void Build(){
		nIdx=dep[0]=siz[0]=son[0]=0;
		DFS1(); DFS2();
		t.Build(1,nIdx,1,tmpW);
	}
	void Modify(int u,int v,ll w){
		if(dep[u]<dep[v])swap(u,v);
		t.Modify(idx[u],w,1,nIdx,1);		
	}
	ll Query(int u,int v,ll w){
		ll ans=1;
		while(top[u]!=top[v]){
			if(dep[top[u]]<dep[top[v]])swap(u,v);
			ll tmp=t.Query(1,nIdx,1,idx[top[u]],idx[u]);
			u=pa[top[u]];
			ans=Mul(ans,tmp);
		}
		if(u!=v){
			if(dep[u]<dep[v])swap(u,v);
			ll tmp=t.Query(1,nIdx,1,idx[v]+1,idx[u]);
			ans=Mul(ans,tmp);
		}
		return (ans==0)?0:(w/ans);
	}
};

int main(){
	int n,q; cin>>n>>q;
	for(int i=1;i<n;i++){
		int u,v; ll w;
		cin>>u>>v>>w;
		edg[i]=(Edge){u,v,w};
		HLDcp::a[u].push_back((Adj){v,w});
		HLDcp::a[v].push_back((Adj){u,w});
	}
	HLDcp::Build();
	while(q--){
		int op; cin>>op;
		if(op==1){
			int u,v; ll w;
			cin>>u>>v>>w;
			cout<<HLDcp::Query(u,v,w)<<endl;
		}else{
			int id; ll w;
			cin>>id>>w;
			HLDcp::Modify(edg[id].u,edg[id].v,w);
		}
	}

	return 0;
}
```
{%endfold%}




## B - 数颜色数，越数越多 

多次询问树上子树中颜色的出现次数大于$p_i$的种数。

### 题解

树上莫队即可。

另外一种神奇解法是树上启发式合并（DSU on tree），每次都只保留重儿子子树对答案的贡献，并暴力计算非重儿子子树的贡献合并到答案上。由于一个点的数据只会在祖先的轻边上被暴力计算，而到根的轻边不超过$\log n$级别，因此这个看似十分暴力的维护复杂度事实上是$\mathcal{O}(n\log n)$的。

### 代码

DS学多了人也傻了。

~~那么用树状数组来维护`sum`的垃圾代码有看的必要吗？~~

#### 树上莫队

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=100000+5;

struct Opr{int l,r,k,id,ans;};
Opr op[N];
int siz;

vector<int> a[N];
int c[N];

struct BITree{
	int t[N];
	BITree(){
		memset(t,0,sizeof(t));
	}
	int Lowbit(int x){
		return x&-x;
	}
	void Add(int x,int v){
		for(;x;x-=Lowbit(x))
			t[x]+=v;
	}
	int Query(int x){
		int ret=0;
		for(;x<N;x+=Lowbit(x))
			ret+=t[x];
		return ret;
	}
};

bool CmpByBlock(Opr &a,Opr &b){
	if(a.l/siz==b.l/siz)
		return a.r < b.r;
	else return a.l < b.l;
}

bool CmpByIdx(Opr &a,Opr &b){
	return a.id < b.id;
}

int cloDFS,tmsL[N],tmsR[N];
int dfs[2*N];

int DFS(int u,int pa){
	tmsL[u]=++cloDFS;
	dfs[tmsL[u]]=c[u];
	for(int i=0;i<a[u].size();i++){
		int v=a[u][i];
		if(v!=pa)DFS(v,u);
	}
	tmsR[u]=++cloDFS;
}

BITree t;

void Move(int x,int dir,int cnt){
	if(dfs[x]==0)return;
	if(cnt>0)t.Add(cnt,-1);
	if(cnt+dir>0)t.Add(cnt+dir,1);
}

void MoQueue(int n,int q){
	for(int i=1;i<=q;i++){
		int u=op[i].l;
		op[i].l=tmsL[u],op[i].r=tmsR[u];
	}

	sort(op+1,op+q+1,CmpByBlock);
	static int cnt[N];

	int l=1,r=1; cnt[dfs[1]]=1;
	t.Add(1,1);

	for(int i=1;i<=q;i++){
		int qL=op[i].l,qR=op[i].r;
		while(l<qL){
			Move(l,-1,cnt[dfs[l]]);
			cnt[dfs[l]]--; l++;
		}
		while(l>qL){
			Move(l-1,1,cnt[dfs[l-1]]);
			cnt[dfs[l-1]]++; l--;
		}
		while(r<qR){
			Move(r+1,1,cnt[dfs[r+1]]);
			cnt[dfs[r+1]]++; r++;
		}
		while(r>qR){
			Move(r,-1,cnt[dfs[r]]);
			cnt[dfs[r]]--; r--;
		}
		op[i].ans=t.Query(op[i].k);
	}
}

int main(){
	int n,q; cin>>n>>q;

	for(int i=1;i<=n;i++)
		cin>>c[i];
	for(int i=1;i<n;i++){
		int u,v; cin>>u>>v;
		a[u].push_back(v);
		a[v].push_back(u);
	}
	for(int i=1;i<=q;i++){
		cin>>op[i].l>>op[i].k;
		op[i].id=i;
	}

	DFS(1,0);
	siz=(int)pow(n,0.75)+1;
	MoQueue(n,q);

	sort(op+1,op+q+1,CmpByIdx);
	for(int i=1;i<=q;i++)
		cout<<op[i].ans<<endl;

	return 0;
}
```
{%endfold%}

#### 树上启发式合并

比树上莫队好写十倍甚至九倍，但是实际运行时间看起来竟然差不多…？

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef pair<int,int> pint;
const int N=100000+5;
int c[N];
vector<int> a[N];
vector<pint> qry[N];

int siz[N];

void DFS4Siz(int u,int pa){
	siz[u]=1;
	for(auto v:a[u])
		if(v!=pa){
			DFS4Siz(v,u);
			siz[u]+=siz[v];
		}
}

int ans[N],cnt[N],sum[N];

void Modify(int u,int pa,int op,int son){
	if(op==1)sum[++cnt[c[u]]]++;
	else sum[cnt[c[u]]--]--;
	for(auto v:a[u])
		if(v!=pa && v!=son)
			Modify(v,u,op,son);
}

void DFS(int u,int pa,bool keep){
	int son=0;
	for(auto v:a[u])
		if(v!=pa && siz[v]>siz[son])
			son=v;
	for(auto v:a[u])
		if(v!=pa && v!=son)
			DFS(v,u,0);
	if(son)DFS(son,u,1);
	Modify(u,pa,1,son);

	for(auto p:qry[u])
		ans[p.first]=sum[p.second];

	if(!keep)Modify(u,pa,-1,0);
}

int main(){
	int n,q; cin>>n>>q;
	for(int i=1;i<=n;i++)
		cin>>c[i];
	for(int i=1;i<n;i++){
		int u,v; cin>>u>>v;
		a[u].push_back(v);
		a[v].push_back(u);
	}
	for(int i=1;i<=q;i++){
		int id,k; cin>>id>>k;
		qry[id].push_back(make_pair(i,k));
	}

	DFS4Siz(1,0); DFS(1,0,0);
	for(int i=1;i<=q;i++)
		cout<<ans[i]<<endl;

	return 0;
}
```
{%endfold%}








## C - 最小生成树，边权你来改

给一个无自环重边的连通图，要求单独对每条边考虑修改权值，使得这条边一定能出现在任何生成树中，求每条边的最大权值。

### 题解

先求一个MST。对于边$(u,v)$：

* 在MST中：只要边权比所有连接$(u,v)$的非树边的最小边小$1$，就可以维持它在MST中的地位。
* 不在MST中：只要边权比MST上$(u,v)$两点间路径的最大边小$1$，就可取代掉它进入MST。

然后就可以快乐树剖。可以只用一个线段树维护最大最小值，但是写起来略长。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

#define lson (o<<1)
#define rson (o<<1|1)

const int N=200000+5,INF=0x3f3f3f3f;
int nV,nE;
struct Edge{int u,v,w,id;};
vector<Edge> edg;
bool isEdge[N];

struct SegTree{
	int maxVal[N*4],minVal[N*4];
	int lazy[N*4];

	void Build(int L,int R,int o,int a[]){
		if(L==R){
			maxVal[o]=a[L];
			return;
		}
		int M=(L+R)/2;
		Build(L,M,lson,a); Build(M+1,R,rson,a);
		maxVal[o]=max(maxVal[lson],maxVal[rson]);
	}
	void Pushdown(int o){
		if(lazy[o]==INF)return;
		lazy[lson]=min(lazy[lson],lazy[o]);
		minVal[lson]=min(minVal[lson],lazy[lson]);
		lazy[rson]=min(lazy[rson],lazy[o]);
		minVal[rson]=min(minVal[rson],lazy[rson]);
		lazy[o]=INF;
	}
	void Modify(int qL,int qR,int o,int w,int L,int R){
		if(L<R)Pushdown(o);
		if(qL<=L&&R<=qR){
			lazy[o]=w;
			minVal[o]=min(minVal[o],w);
			if(L<R){
				minVal[lson]=min(minVal[lson],w);
				minVal[rson]=min(minVal[rson],w);
			}
			return;
		}
		int M=(L+R)/2;
		if(qL<=M)Modify(qL,qR,lson,w,L,M);
		if(M+1<=qR)Modify(qL,qR,rson,w,M+1,R);
		minVal[o]=min(minVal[lson],minVal[rson]);
	}
	int QueryMin(int x,int L,int R,int o){
		if(L<R)Pushdown(o);
		if(L==R)return minVal[o];
		int M=(L+R)/2;
		if(x<=M)return QueryMin(x,L,M,lson);
		else return QueryMin(x,M+1,R,rson);
	}
	int QueryMax(int qL,int qR,int o,int L,int R){
		if(L<R)Pushdown(o);
		if(qL<=L&&R<=qR)return maxVal[o];
		int M=(L+R)/2,ret=0;
		if(qL<=M)ret=max(ret,QueryMax(qL,qR,lson,L,M));
		if(M+1<=qR)ret=max(ret,QueryMax(qL,qR,rson,M+1,R));
		return ret;
	}
};

struct Adj{int v,w;};

namespace HLDcp{
	SegTree t;
	int dep[N],siz[N],pa[N],son[N],top[N],idx[N];
	vector<Adj> a[N];
	int tmpW[N];
	int nIdx=0;

	void DFS1(int u=1,int pa=0){
		dep[u]=dep[HLDcp::pa[u]=pa]+1;
		siz[u]=1;son[u]=0;
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i].v;
			if(v==pa)continue;
			DFS1(v,u);
			if(siz[v]>siz[son[u]])son[u]=v;
			siz[u]+=siz[v];
		}
	}
	void DFS2(int u=1,int pa=0,int w=0){		//..
		idx[u]=++nIdx; tmpW[idx[u]]=w;
		top[u]=u;
		if(son[pa]==u)top[u]=top[pa];
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i].v,w=a[u][i].w;
			if(v==son[u])DFS2(v,u,w);
		}
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i].v,w=a[u][i].w;
			if(v==pa||v==son[u])continue;
			DFS2(v,u,w);
		}
	}
	void Build(){
		nIdx=dep[0]=siz[0]=son[0]=0;
		DFS1(); DFS2();
		memset(t.minVal,0x3f,sizeof(t.minVal));
		memset(t.lazy,0x3f,sizeof(t.lazy));
		t.Build(1,nIdx,1,tmpW);
	}
	int QueryMax(int u,int v){
		int ans=0;
		while(top[u]!=top[v]){
			if(dep[top[u]]<dep[top[v]])swap(u,v);
			ans=max(ans,t.QueryMax(idx[top[u]],idx[u],1,1,nIdx));
			u=pa[top[u]];
		}
		if(u==v)return ans;
		if(dep[u]>dep[v])swap(u,v);
		return max(ans,t.QueryMax(idx[u]+1,idx[v],1,1,nIdx));
	}
	void ModifyMin(int u,int v,int w){
		while(top[u]!=top[v]){
			if(dep[top[u]]<dep[top[v]])swap(u,v);
			t.Modify(idx[top[u]],idx[u],1,w,1,nIdx);
			u=pa[top[u]];
		}
		if(u==v)return;
		if(dep[u]>dep[v])swap(u,v);
		t.Modify(idx[u]+1,idx[v],1,w,1,nIdx);
	}
	int QueryMin(int u,int v){
		int o=(dep[u]>dep[v])?u:v;
		return t.QueryMin(idx[o],1,nIdx,1);
	}
};

int pa[N];

int FindPa(int x){
	return x==pa[x]?x:pa[x]=FindPa(pa[x]);
}

bool Cmp(Edge &a,Edge &b){
	return a.w<b.w;
}

void Kruskal(){
	sort(edg.begin(),edg.end(),Cmp);
	for(int i=1;i<=nV;i++)
		pa[i]=i;
	int cnt=0;
	for(int i=0;i<nE && cnt<nV-1;i++){
		Edge &e=edg[i];
		int u=FindPa(e.u),v=FindPa(e.v);
		if(u==v)continue;
		pa[u]=v; cnt++; isEdge[e.id]=1;
	}
}

void BuildTree(){
	for(int i=0;i<nE;i++){
		Edge &e=edg[i];
		if(isEdge[e.id]==0)continue;
		HLDcp::a[e.u].push_back((Adj){e.v,e.w});
		HLDcp::a[e.v].push_back((Adj){e.u,e.w});
	}
	HLDcp::Build();
}

int ans[N];	

void Solve(){
	for(int i=0;i<nE;i++){
		Edge &e=edg[i];
		if(isEdge[e.id]==0)
			HLDcp::ModifyMin(e.u,e.v,e.w);
	}

	for(int i=0;i<nE;i++){
		Edge &e=edg[i];
		if(isEdge[e.id]==0)ans[e.id]=HLDcp::QueryMax(e.u,e.v)-1;
		else{
			ans[e.id]=HLDcp::QueryMin(e.u,e.v);
			if(ans[e.id]==INF)ans[e.id]=-1;
			else ans[e.id]--;
		}
	}
}

int main(){
	scanf("%d%d",&nV,&nE);
	for(int i=1;i<=nE;i++){
		int u,v,w;
		scanf("%d%d%d",&u,&v,&w);
		edg.push_back((Edge){u,v,w,i});
	}

	if(nV==nE+1){
		for(int i=1;i<=nE;i++)
			ans[i]=-1;
	}else{
		Kruskal();
		BuildTree();
		Solve();
	}
	for(int i=1;i<=nE;i++)
		printf("%d ",ans[i]);

	return 0;
}
```
{%endfold%}






## D - 红蓝树，只能逐渐变红

给一棵树，其中节点$1$已经被染红。接下来有两种操作：

1. 查询$u$到最近红点的距离
2. 染红$u$

### 题解

如果我们知道哪些点被染红了，那么可以通过一次$\mathcal{O}(n)$的BFS计算出所有点的最近红点距离。如果再分块一下，就可以做到$\mathcal{O}(n\sqrt n)$啦。

另一种时间复杂度$\mathcal{O}(n\log n)$的做法：对序列CDQ分治，并且给每个区间建虚树保证查询的时间复杂度只与序列长度有关。~~虽然最先想到的是这个做法，但是看起来一点也不好写对吧~~

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=100000+5,C=18+2,INF=0x3f3f3f3f;
struct Opr{int op,u;};
Opr op[N];
vector<int> a[N];
int pa[N][C],dep[N];
int n,q,b;

void DFS(int u,int _pa){
	dep[u]=dep[_pa]+1; pa[u][0]=_pa;
	for(int i=0;i<a[u].size();i++){
		int v=a[u][i];
		if(v==_pa)continue;
		DFS(v,u); 
	}
}

void InitLCA(){
	DFS(1,0);
	for(int i=1;i<C;i++)
		for(int u=1;u<=n;u++)
			pa[u][i]=pa[pa[u][i-1]][i-1];
}

int LCA(int u,int v){
	if(dep[u]<dep[v])swap(u,v);
	for(int i=C-1;i>=0;i--)
		if(dep[pa[u][i]]>=dep[v])
			u=pa[u][i];
	if(u==v)return u;
	for(int i=C-1;i>=0;i--)
		if(pa[u][i]!=pa[v][i])
			u=pa[u][i],v=pa[v][i];
	return pa[u][0];
}

int dis[N];

void BFS(int r){
	queue<int> q;
	memset(dis,0x3f,sizeof(dis));
	
	q.push(1); dis[1]=0;

	for(int i=1;i<=r;i++)
		if(op[i].op==1 && dis[op[i].u]==INF){
			q.push(op[i].u);
			dis[op[i].u]=0;
		}

	while(!q.empty()){
		int u=q.front(); q.pop();
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i];
			if(dis[v]!=INF)continue;
			dis[v]=dis[u]+1;
			q.push(v);
		}
	}
}

int Dist(int u,int v){
	return dep[u]+dep[v]-2*dep[LCA(u,v)];
}

vector<int> ans;

void Solve(){
	for(int i=0;i<=q/b;i++){
		int l=max(i*b,1),r=min(i*b+b-1,q);
		BFS(l-1);
		for(int j=l;j<=r;j++){
			if(op[j].op!=2)continue;
			int tmpAns=dis[op[j].u];
			for(int k=l;k<j;k++){
				if(op[k].op!=1)continue;
				tmpAns=min(tmpAns,Dist(op[j].u,op[k].u));
			}
			ans.push_back(tmpAns);
		}
	}
}

int main(){
	cin>>n>>q;

	for(int i=1;i<n;i++){
		int u,v; cin>>u>>v;
		a[u].push_back(v);
		a[v].push_back(u);
	}
	for(int i=1;i<=q;i++)
		cin>>op[i].op>>op[i].u;

	InitLCA();
	b=(int)sqrt(q)+1;
	Solve();

	for(int i=0;i<ans.size();i++)
		cout<<ans[i]<<endl;

	return 0;
}
```
{%endfold%}







## E - xor树，会递归的xor 

给一个每个节点值为$0$或$1$的树，可以对节点$u$进行操作：把$u$的值翻转，把$u$儿子的儿子翻转，把$u$儿子的儿子的儿子的儿子翻转…求把树变成目标树的最少步数。

### 题解

贪心从顶至底翻转即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=100000+5;
vector<int> a[N];
int s[N],t[N];
vector<int> ans;

void DFS(int u,int pa,int f0,int f1){
	s[u]^=f0;
	if(s[u]!=t[u])ans.push_back(u);
	for(int i=0;i<a[u].size();i++){
		int v=a[u][i];
		if(v==pa)continue;
		DFS(v,u,f1,f0^(s[u]!=t[u]));
	}
}

int main(){
	int n; cin>>n;
	for(int i=1;i<n;i++){
		int u,v; cin>>u>>v;
		a[u].push_back(v);
		a[v].push_back(u);
	}
	for(int i=1;i<=n;i++)cin>>s[i];
	for(int i=1;i<=n;i++)cin>>t[i];
	DFS(1,0,0,0);

	cout<<ans.size()<<endl;
	for(int i=0;i<ans.size();i++)
		cout<<ans[i]<<endl;

	return 0;
}
```
{%endfold%}
