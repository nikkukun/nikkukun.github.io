---
title: 190602 Spring Training 10
comment: true
mathjax: true
date: 2019-6-3 22:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://vjudge.net/contest/302803)

题目	|A	|B	|C	|D	|E
-		|-	|-	|-	|-	|-	
通过	|	|	|	|	|×
补题	|√	|√	|√	|√	|√	

菜就是菜，菜是原罪。

做过的东西完全没有掌握，不会的知识还有许多要学。

<!--more-->





## A - Furukawa Nagisa's Tree

给一棵有点权的树和一个以序列为自变量的函数$G(A)=\sum_{i=0} a_ik^i\pmod{y}$，树上两点间的有向路径$u\to v$被认为是好的，当且仅当$u\to v$按顺序经过的点权序列$W(u,v)$满足$G(W(u,v))=x$，否则就是坏的。一个三元组被认为是好的，当且仅当$u\to v,v\to w,u\to w$要么都是好的，要么都是坏的。

求树上有多少个三元组$(x,y,z)$是好的。保证$y$是质数。

### 题解

非常神的一道题目……然而即使算上Tutorial也只找到了3篇题解。

主要部分的题解请参考[洛谷 - CF434E Furukawa Nagisa's Tree 题解 - Styx 的题解](https://www.luogu.org/problemnew/solution/CF434E)，下文主要进行补充说明。

首先是，通过点对来反向统计三元组的想法妙妙，但是为什么得到的式子是$\mathrm{in} _0\times \mathrm{in} _1\times 2+\mathrm{out} _0\times \mathrm{out} _1\times 2+\mathrm{in} _0\times \mathrm{out} _1+\mathrm{in} _1\times \mathrm{out} _0$呢？考虑一个点$u$，只要$u$的$\mathrm{in}_*$和$\mathrm{out}_*$的一个组合出现了，它就必定能构成**题解的图**中含有这个组合的几个坏三元组，并且由于一个环上有两个点，因此一个点中出现一次这种组合就相当于贡献了$\dfrac 12$个坏三元组。

然后考虑上述计算出的答案为何还要除$2$。并没有搞懂，希望有人能够告诉我orz

以及还有一个妙妙的处理，假设正在处理$u$，已经知道$v\to u$和$u\to w$的$G_1,G_2$了，统计$G_1 + G_2\times k^{\mathrm{dep}(v)} \equiv x \pmod y$是不是成立，但是这个$\mathrm{dep}(v)$看起来异常碍事。通过像斜率优化、某些FFT式子一样把相关的变量放在同一侧，可以得到$G_2 \equiv (x-G_1)\times (k^{-1})^{\mathrm{dep}(v)} \pmod y$，这样右边的式子就可以边DFS边统计了。

使用“两点的贡献-两点在同一子树的贡献”做点分治即可，时间复杂度$\mathcal{O}(n\log^2{n})$。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef pair<int,int> pint;
typedef long long ll;
const int N=100000+5;
int w[N];
vector<int> a[N];
int n,MOD,k,x;

ll QPow(ll bas,int t){
	ll ret=1;
	for(;t;bas=bas*bas%MOD,t>>=1)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

bool vst[N];
int rt;
int siz[N],maxSiz[N]; 

void DFS4Rt(int u,int pa,int sum){
	siz[u]=1;
	for(auto v:a[u])
		if(v!=pa && !vst[v]){
			DFS4Rt(v,u,sum);
			siz[u]+=siz[v];
		}
	maxSiz[u]=max(siz[u],sum-siz[u]);
	if(maxSiz[u]>maxSiz[rt])rt=u;
}

ll powk[N],invk[N];
vector<pint> in,out,_in,_out;

void DFS(int u,int pa,int dep,ll w1,ll w2){
	w1=(w1*k+w[u])%MOD;
	w2=(w2+w[u]*powk[dep])%MOD;
	ll _w1=(x-w1+MOD)*invk[dep]%MOD;
	_in.push_back(make_pair(_w1,u));
	_out.push_back(make_pair(w2,u));

	for(auto v:a[u])
		if(v!=pa && !vst[v])
			DFS(v,u,dep+1,w1,w2);
}

int in0[N],in1[N],out0[N],out1[N];

void Modify(vector<pint> &a,vector<pint> &b,int op){
	sort(a.begin(),a.end());
	sort(b.begin(),b.end());

	for(auto p:a){
		int w=p.first, id=p.second;
		auto x=make_pair(w,0);
		auto y=make_pair(w+1,0);
		out0[id]+=op*(lower_bound(b.begin(),b.end(),y)-b.begin());
		out0[id]-=op*(lower_bound(b.begin(),b.end(),x)-b.begin());
	}

	for(auto p:b){
		int w=p.first, id=p.second;
		auto x=make_pair(w,0);
		auto y=make_pair(w+1,0);
		in0[id]+=op*(lower_bound(a.begin(),a.end(),y)-a.begin());
		in0[id]-=op*(lower_bound(a.begin(),a.end(),x)-a.begin());
	}
}

void Cal(int u){
	in.clear(); out.clear();
	in.push_back(make_pair((x-w[u]+MOD)%MOD,u));
	out.push_back(make_pair(0,u));

	for(auto v:a[u]){
		if(vst[v])continue;
		DFS(v,u,1,w[u],0);		//remove w[u] in path w2
		Modify(_in,_out,-1);

		for(auto i:_in)in.push_back(i);
		for(auto i:_out)out.push_back(i);
		_in.clear(); _out.clear();
	}

	Modify(in,out,1);
}

void Solve(int u){
	vst[u]=1; Cal(u);
	for(auto v:a[u]){
		if(vst[v])continue;
		DFS4Rt(v,rt=0,siz[v]);		//init rt=0
		Solve(v);
	}
}

void Init(){
	powk[0]=invk[0]=1;
	int inv=QPow(k,MOD-2);
	for(int i=1;i<N;i++){
		powk[i]=powk[i-1]*k%MOD;
		invk[i]=invk[i-1]*inv%MOD;
	}
}

int main(){
	cin>>n>>MOD>>k>>x;
	for(int i=1;i<=n;i++)
		cin>>w[i];
	for(int i=1;i<n;i++){
		int u,v; cin>>u>>v;
		a[u].push_back(v);
		a[v].push_back(u);	
	}

	Init();
	DFS4Rt(1,rt=0,n);
	Solve(rt);

	ll ans=0;
	for(int i=1;i<=n;i++){
		in1[i]=n-in0[i];
		out1[i]=n-out0[i];
		ans += 1LL*in0[i]*in1[i]*2 + 1LL*out0[i]*out1[i]*2;
		ans += 1LL*in0[i]*out1[i] + 1LL*in1[i]*out0[i];
	}
	cout<<1LL*n*n*n-ans/2;

	return 0;
}
```
{%endfold%}






## B - New Roads 

构造一棵$n$节点的树，使得除了$1$号根节点外，深度为$i$的点有$a_i$个，且恰好有$k$个叶子节点。判断能否构造，并给出方案。

### 题解

比赛完一想马上就发现是个神秘贪心了，但是为啥比赛的时候就是想复杂了呢……

让叶节点最大，只要每层都连到上层的同一个；让叶节点最少，只要每层都尽可能连不同的节点。见`Fig. 1`和`Fig. 2`：

![](spring-training-190602\pic.jpg)

构造时，只要根据$k$来判断应该有几个节点尽可能不连同一个节点即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=200000+5;
int p,n,m;
vector<int> t[N];
int pa[N];

int main(){
	int cnt=1;
	t[0].push_back(1);

	cin>>n>>m>>p;
	int minP=0,maxP=n-m;
	for(int i=1;i<=m;i++){
		int a; cin>>a;
		while(a--)
			t[i].push_back(++cnt);
		minP+=max(int(t[i-1].size()-t[i].size()),0);
	}
	minP+=t[m].size();

	if(p<minP||p>maxP){
		cout<<-1;return 0;
	}

	for(int i=1;i<=m;i++){
		for(int j=0;j<t[i].size();j++){
			if(j>0 && t[i-1].size()>j && maxP>p){
				pa[t[i][j]]=t[i-1][j];
				maxP--;
			}else pa[t[i][j]]=t[i-1][0];
		}
	}

	cout<<n<<endl;
	for(int i=2;i<=n;i++)
		cout<<i<<' '<<pa[i]<<endl;

	return 0;
}
```
{%endfold%}





## C - Four Divisors 

求$[1,n]$间有多少个数$i$满足它只有四个约数。

$n\leq 10^{11}$。

### 题解

答案应该是形如$p^3$和$pq$的数的个数（$p,q$是质数），对后者只要枚举质数$p$，统计$(p,n]$中质数个数。

这么大的质数怎么求呢…？先考虑一个另外的问题：给定$n$，如何求$[1,n]$质数的和？这里有一个我觉得讲得很透彻的回答：[知乎 - 求十亿内所有质数的和，怎么做最快? - 菜鱼ftfish 的回答](https://www.zhihu.com/question/29580448/answer/45218281)。

有了上面的式子，要将“质数的和”改为“质数的个数”就是顺水推舟的事情了。虽然上面的式子是正确的，但是直接计算的时间复杂度很大，需要优化：

1. 记忆化搜索。
2. 先预处理出$n\leq 10^6,S(n,*)$的值，再计算$S(n,\lfloor \sqrt{n} \rfloor)$。
3. 更准确地来说，$S(n,p)$的转移应该从小于质数$p$的最大质数$q$得到，即$S(n,q)$，这样可以减少很多无用的转移，然后$S(n,*)$的$*$就可以代表“当前筛的是第几个素数”了。
4. $S(n,p)$中的$p$应当取$\lfloor \sqrt{n} \rfloor$才有意义。

据说预处理取$n = 10^6$可以达到$\mathcal(n^{2/3})$级别的复杂度，很迷。~~O(跑得过)就Vans嗷~~。关于复杂度具体的一些证明可以见[Editorial](https://codeforces.com/blog/entry/44466)。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=500000+5;

bool notPri[N];
int pre[N],pri[N];

void Init(){
	notPri[1]=1;
	for(int i=2;i*i<N;i++)
		if(!notPri[i])
			for(int j=i*2;j<N;j+=i)
				notPri[j]=1;

	for(int i=2;i<N;i++){
		if(!notPri[i])pri[++pri[0]]=i;
		pre[i]=pri[0];
	}
}

const int P=100000+5,Q=100+5;
int f[P][Q];

int Sqrt(ll x){
	return floor(sqrt(x));
}

ll F(ll n,int p){
	if(n<P && p<Q && f[n][p])return f[n][p];

	ll ans=0;
	if(p<=0)ans=n-1;
	else{
		int sqr=pre[Sqrt(n/pri[p])];
		ans=F(n,p-1)-(F(n/pri[p],min(p-1,sqr))-p+1);
	}
	
	if(n<P && p<Q)f[n][p]=ans;
	return ans;
}

int main(){
	Init();
	for(int i=1;i<P;i++)
		F(i,pre[Sqrt(i)]);

	ll n,cnt=0; cin>>n;
	for(int i=2;1LL*i*i*i<=n;i++)
		if(!notPri[i])cnt++;
	for(int i=1;i<=pri[0];i++){
		int j=pri[i];
		if(1LL*j*j>=n)break;
		cnt+=F(n/j,pre[Sqrt(n/j)])-i;
	}
	cout<<cnt;

	return 0;
}
```
{%endfold%}




## D - Nim or not Nim?

$n$堆石子，每次可以选择一堆拿走一颗，或分成两堆更小的。给定状态，判断先后手是否必胜。

### 题解

SG函数题目一般需要大力打表找规律。打表了之后发现有

$$
SG(n)=
\begin{cases}
n-1	&,n\equiv 0 \pmod{4}	\\
n	&,n\equiv 1 \pmod{4}	\\
n	&,n\equiv 2 \pmod{4}	\\
n+1	&,n\equiv 3 \pmod{4}	\\
\end{cases}
$$

XOR一下就Vans。

### 代码

`Test()`是打表函数。

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=100+5;

void Test(){
	static int sg[N];
	static bool vst[N];
	for(int u=1;u<N;u++){
		memset(vst,0,sizeof(vst));
		for(int i=0;i<u;i++)
			vst[sg[i]]=1;
		for(int i=1;i<u;i++)
			vst[sg[i]^sg[u-i]]=1;
		while(vst[sg[u]])sg[u]++;
		cout<<u<<' '<<sg[u]<<endl;
	}
}

int SG(int x){
	if(x%4==0)return x-1;
	if(x%4==3)return x+1;
	return x;
}

int main(){
	int nCase; cin>>nCase;
	while(nCase--){
		int n,p=0,a; cin>>n;
		while(n--){
			cin>>a; p^=SG(a);
		}
		cout<<(p?"Alice\n":"Bob\n");
	}

	return 0;
}
```
{%endfold%}








## E - 诸神眷顾的幻想乡 

一棵树的每个节点有一个颜色$c$，且这棵树的叶子结点不超过20个，求这棵树两点路径形成的本质不同的序列个数。

### 题解

广义SAM，然后两两枚举叶子节点加入SAM中。

注意本质不同的字符串应该是$\mathrm{len}(u)-\mathrm{len}(u_{pa})$，统计即可。

翻了下记录，发现去年11月写过这个题目，然而当时写的时候并没有理解题解和广义SAM。字符串专题还需要学习一发。

### 代码

{%fold%}
```c++
#include<iostream>
#include<cstdio>
#include<vector>
#include<cstring>
using namespace std;

typedef long long ll;
const int N=100000+5,M=N*20*2+5,C=10+2;

namespace SAM{
	int ch[M][C],pa[M],len[M];
	int idx=1;

	int Insert(int x,int p){
		int np=++idx; len[np]=len[p]+1;
		for(;p&&ch[p][x]==0;p=pa[p])ch[p][x]=np;

		if(p==0)pa[np]=1;
		else{
			int q=ch[p][x];
			if(len[q]==len[p]+1)pa[np]=q;
			else{
				int nq=++idx; len[nq]=len[p]+1;
				memcpy(ch[nq],ch[q],sizeof(ch[q]));
				pa[nq]=pa[q]; pa[q]=pa[np]=nq;
				for(;p&&ch[p][x]==q;p=pa[p])ch[p][x]=nq;
			}
		}
		
		return np;
	}

	ll Build(){
		ll ans=0;
		for(int i=idx;i>1;i--)
			ans+=len[i]-len[pa[i]];
		return ans;
	}
};

vector<int> a[N];
int c[N];

void DFS(int u,int pa){
	static int pre[N]={1};
	pre[u]=SAM::Insert(c[u],pre[pa]);	
	for(int i=0;i<a[u].size();i++){
		int v=a[u][i];
		if(v!=pa)DFS(v,u);
	}
}

int n,m;

int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++)
		scanf("%d",&c[i]);
	if(n==1)cout<<1<<endl;
	else{
		for(int i=1;i<n;i++){
			int u,v; scanf("%d%d",&u,&v);
			a[u].push_back(v);
			a[v].push_back(u);
		}
		for(int i=1;i<=n;i++)
			if(a[i].size()==1)
				DFS(i,0);
		printf("%lld",SAM::Build());
	}

	return 0;
}
```
{%endfold%}
