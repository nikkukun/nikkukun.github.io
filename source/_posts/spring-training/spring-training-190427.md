---
title: 190427 Spring Training 1
comment: true
mathjax: true
date: 2019-5-1 19:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://123.207.151.82:42443/domjudge/public/problems.php)

题目	|A	|B	|C	|D	|E	
-		|-	|-	|-	|-	|-	
通过	|√	|×	|	|√	|
补题	|	|√	|√	|	|√

<!--more-->

## A. 括号序列计分

### 题解

使用递归/栈进行模拟即可。

### 代码

{%fold%}
```c++
#include<iostream>
#include<algorithm>
using namespace std;

typedef long long ll;
const int N=100000+5;
const ll MOD=12345678910;
int n,a[N];

ll Cal(int L,int R){
	if(R-L==2)return 1;

	int M,sum=0;
	for(M=L;M<R;M++){
		sum+=a[M];
		if(sum==0)break;
	}
	if(M+1<R)return (Cal(L,M+1)+Cal(M+1,R))%MOD;
	else return Cal(L+1,R-1)*2%MOD;
}

int main(){
	scanf("%d",&n);
	for(int i=0;i<n;i++){
		cin>>a[i];
		if(a[i]==0)a[i]=-1;
		else a[i]=1;
	}
	printf("%lld",Cal(0,n));

	return 0;
}
```
{%endfold%}




## B. 冰镇矩阵

### 题解

如果数没有重复，则只需要给所有数从小到大排序来赋值，一个数的值等于所在行列中较大的值+1。如果有重复，则对于在同一行/列的同一个值最后需要赋相同的值，因此考虑并查集维护一下同一行/列中相同的值的集合，然后更新集合的parent为集合中当前赋值最大的那个数即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef pair<int,int> pInt;
const int N=1000000+5;
int n,m;

int Find(int pa[],int x){
	return x==pa[x]?x:pa[x]=Find(pa,pa[x]);
}

int idCol[N],idRow[N];
int paCol[N],paRow[N];
int f[N],b[N];
pInt a[N];

int Test(int x){
	return -x;
}

int main(){
	scanf("%d%d",&n,&m);
	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++){
			scanf("%d",&b[i*m+j+1]);
			a[i*m+j+1].first=b[i*m+j+1];
			a[i*m+j+1].second=i*m+j+1;
		}

	int p=n*m;
	for(int i=1;i<=p;i++)
		paCol[i]=paRow[i]=i;
	sort(a+1,a+p+1);

	int ans=0;
	for(int i=1;i<=p;i++){
		int v=a[i].first,id=a[i].second;
		int c=(id-1)%m,r=(id-1)/m;
		int _idCol=Find(paCol,idCol[c]);
		int _idRow=Find(paRow,idRow[r]);

		f[id]=max(f[_idCol]+(b[_idCol]!=v),f[_idRow]+(b[_idRow]!=v));
		ans=max(ans,f[id]);
		idCol[c]=idRow[r]=id;

		if(b[_idCol]==v)
			paCol[_idCol]=paRow[_idCol]=id;
		if(b[_idRow]==v)
			paCol[_idRow]=paRow[_idRow]=id;
	}
	
	printf("%d",ans);

	return 0;
}
```
{%endfold%}





## C. 斯波利特平衡术

### 题解

采用非旋Treap+lazy标记维护序列和即可。见[文艺平衡树](https://www.luogu.org/problemnew/show/P3391)。

由于奇怪的原因RE了很多次。现在也不知道为什么对于成员函数来说，`this!=nullptr`这个条件在`t=nullptr`时调用`t`的某个成员函数时会无效。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=100000+5;

struct Node{
	int v,w,siz,lazy; ll sum;
	Node *lch,*rch;

	Node(int _v=0){
		v=_v, w=rand(), siz=1;
		sum=v, lazy=0;
		lch=rch=nullptr;
	}
	void Maintain(){
		siz=1; sum=v;
		if(lch!=nullptr)
			siz+=lch->siz,sum+=lch->sum;
		if(rch!=nullptr)
			siz+=rch->siz,sum+=rch->sum;
	}
	void Pushdown(){
		if((this==nullptr)||lazy==0)return;
		if(lch!=nullptr)lch->lazy^=1;
		if(rch!=nullptr)rch->lazy^=1;
		swap(lch,rch); lazy=0;
	}
};

typedef pair<Node*,Node*> pNode;
Node mp[N];

struct Treap{
	Node *rt,*pit;

	Treap(){
		pit=mp; rt=nullptr;
	}
	Node* NewNode(int v){
		*pit=Node(v);
		return pit++;
	}
	void Insert(int v){
		Node* o=NewNode(v);
		rt=Merge(rt,o);
	}
	pNode Split(Node* o,int k){
		pNode ret(nullptr,nullptr);
		if(o==nullptr)return ret;

		o->Pushdown();
		int siz=(o->lch==nullptr)?0:o->lch->siz;
	
		if(k<=siz){
			ret=Split(o->lch,k);
			o->lch=ret.second;
			o->Maintain();
			ret.second=o;
		}else{
			ret=Split(o->rch,k-siz-1);
			o->rch=ret.first;
			o->Maintain();
			ret.first=o;
		}

		return ret;
	}
	Node* Merge(Node* a,Node* b){
		if(a==nullptr)return b;
		if(b==nullptr)return a;

		a->Pushdown(); b->Pushdown();
		if(a->w < b->w){
			a->rch=Merge(a->rch,b);
			a->Maintain();
			return a;
		}else{
			b->lch=Merge(a,b->lch);
			b->Maintain();
			return b;
		}
	}
	void Print(Node* o){
		if(o==nullptr)return;
		o->Pushdown();
		Print(o->lch);
		printf("%d ",o->v);
		Print(o->rch);
	}
	ll Inverse(int L,int R){
		pNode a=Split(rt,L-1);
		pNode b=Split(a.second,R-L+1);
		b.first->lazy^=1;		//b一定非空
		ll ret=b.first->sum;
		rt=Merge(Merge(a.first,b.first),b.second);
		return ret;
	}
};

Treap t;

int main(){
	srand(time(0));

	int n,q; scanf("%d%d",&n,&q);
	for(int i=1;i<=n;i++)
		t.Insert(i);

	while(q--){
		int l,r; scanf("%d%d",&l,&r);
		printf("%lld\n",t.Inverse(l,r));
		//t.Inverse(l,r);
	}
	t.Print(t.rt);

	return 0;
}
```
{%endfold%}






## D. 前k小和

### 题解

考虑分别两两合并序列，并维护结果的前$k$小个结果，则最后的结果只能由这$k$个和得到，而不会由比这$k$个更大的得到。为了得到这$k$个值，假设正在合并$a,b$两个序列，二分一下合并结果的第$k$小是多少，并用双指针的方式在$\mathcal{O}(k)$内判断$a_i+b_j$的和满足条件的个数，进而找出前$k$个结果。

总时间复杂度$\mathcal{O}(k^2\log{\max{\{a_i}\}})$。

### 代码

{%fold%}
```c++
#include<iostream>
#include<algorithm>
#include<cstring>
using namespace std;

const int N=1000+5,INF=0x3f3f3f3f;
int a[N],b[N];
int tmpA[N];
int n;

void Cnt(int x){
	memset(tmpA,0,sizeof(tmpA));

	int j=n;
	for(int i=1;i<=n;i++){
		while(j>0 && a[i]+b[j]>x)j--;
		for(int k=1;k<=j;k++){
			tmpA[++tmpA[0]]=a[i]+b[k];
			if(tmpA[0]>=n)return;
		}
	}
}

int BSearch(int L=0,int R=INF){
	while(L<R){
		int M=(L+R)/2; Cnt(M);
		if(tmpA[0]>=n)R=M;
		else L=M+1;
	}
	return L;
}

int main(){
	while(scanf("%d",&n)!=EOF){
		for(int i=1;i<=n;i++)
			scanf("%d",&a[i]);
		sort(a+1,a+n+1);

		for(int i=2;i<=n;i++){
			for(int j=1;j<=n;j++)
				scanf("%d",&b[j]);
			sort(b+1,b+n+1);

			int x=BSearch();
			Cnt(x-1);

			for(int j=1;j<=tmpA[0];j++)
				a[j]=tmpA[j];
			for(int j=tmpA[0]+1;j<=n;j++)
				a[j]=x;
			sort(a+1,a+n+1);
		}

		for(int i=1;i<=n;i++)
			printf("%d ",a[i]);
		printf("\n");
	}

	return 0;
}
```
{%endfold%}







## E. npm - Node.js

### 题解

见[NOI2015 软件包管理器](https://www.luogu.org/problemnew/show/P2146)。

进行树剖，则对于节点到根的操作很好实现。而注意到DFS序中一段连续的序列代表了一个子树，因此对节点与$u$，可以直接对DFS序中$[u,u+siz_u)$的部分操作维护子树。

### 代码

{%fold%}
```c++
#include<bits/extc++.h>
using namespace std;

#define lch (o<<1)
#define rch (o<<1|1)

typedef long long ll;
const int N=100000+5,C=10+5;
int n;
vector<int> a[N];

struct SegTree{
	int sum[N*4],lazy[N*4];
	SegTree(){
		memset(sum,0,sizeof(sum));
		memset(lazy,-1,sizeof(lazy));
	}
	void Pushdown(int o,int L,int R){
		if(lazy[o]==-1||L==R)return;
		
		int M=(L+R)/2;
		sum[lch]=(M-L+1)*lazy[o];
		lazy[lch]=lazy[o];
		sum[rch]=(R-M)*lazy[o]; 
		lazy[rch]=lazy[o];

		lazy[o]=-1;
	}
	void Update(int qL,int qR,int f,int o=1,int L=1,int R=n){
		Pushdown(o,L,R);
		if(qL<=L&&R<=qR){
			sum[o]=(R-L+1)*f;
			lazy[o]=f;
			return;
		}
		int M=(L+R)/2;
		if(qL<=M)Update(qL,qR,f,lch,L,M);
		if(M+1<=qR)Update(qL,qR,f,rch,M+1,R);
		sum[o]=sum[lch]+sum[rch];
	}
};

struct HLDcp{
	SegTree t;
	int dep[N],siz[N],pa[N],son[N],top[N],idx[N];
	int nIdx;

	void Build(){
		nIdx=dep[0]=siz[0]=son[0]=0;
		DFS1();DFS2();
	}
	void DFS1(int u=1,int pa=0){
		dep[u]=dep[HLDcp::pa[u]=pa]+1;
		siz[u]=1;son[u]=0;
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i];
			if(v==pa)continue;
			DFS1(v,u);
			if(siz[v]>siz[son[u]])son[u]=v;
			siz[u]+=siz[v];
		}
	}
	void DFS2(int u=1,int pa=0){
		idx[u]=++nIdx;top[u]=u;
		if(son[pa]==u)top[u]=top[pa];
		if(son[u])DFS2(son[u],u);
		for(int i=0;i<a[u].size();i++){
			int v=a[u][i];
			if(v==pa||v==son[u])continue;
			DFS2(v,u);
		}
	}
	void Add(int u){
		while(top[u]!=0){
			t.Update(idx[top[u]],idx[u],1);
			u=pa[top[u]];
		}
	}
	void Delete(int u){
		t.Update(idx[u],idx[u]+siz[u]-1,0);
	}
	int Query(){
		return t.sum[1];
	}
};

HLDcp t;

int Abs(int x){
	return x>0?x:-x;
}

int main(){
	scanf("%d",&n);
	for(int u=2,v;u<=n;u++){
		scanf("%d",&v);
		a[u].push_back(v+1);
		a[v+1].push_back(u);
	}

	t.Build();

	int pre=0;
	int q; scanf("%d",&q);
	while(q--){
		int op,id;
		scanf("%d%d",&op,&id);
		
		if(op==1)t.Add(id+1);
		else t.Delete(id+1);
		
		int now=t.Query();
		printf("%d\n",Abs(now-pre));
		pre=now;
	}

	return 0;
}
```
{%endfold%}
