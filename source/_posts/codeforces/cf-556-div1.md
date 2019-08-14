---
title: Codeforces Round 556 (Div. 1)
comment: true
mathjax: true
date: 2019-5-10 12:44:00
tags:
categories:
- 比赛
- Codeforces
---

[比赛链接](https://codeforces.com/contest/1149)

题目	|A	|B	|C	|D	|E
-		|-	|-	|-	|-	|-
通过	|√	|	|	|	|
补题	|	|√	|√	|	|

不应该随便打Div. 1的…打了半个小时之后决定开始快乐补题。

<!--more-->






## A. Prefix Sum Primes

一个数列$a_i\in\{1,2\}$，令$S(n)=\sum_{i=1}^n a_i$，输出一个方案最大化$\sum_{p=1}^n [S(p)\text{ is a prime}]$。

### 题解

如果只有一种数，那就只有一种放法。考虑存在$1,2$的情况，只要前缀和满足$\{2,3,\dots\}$，接着的位置只需要贪心地先放完$2$，再往后面补充$1$即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

int cnt[5];

int main(){
	int n; cin>>n;
	for(int i=1;i<=n;i++){
		int a; cin>>a;
		cnt[a]++;
	}
	if(cnt[2]>=1&&cnt[1]>=1){
		cout<<"2 1 ";
		cnt[1]--; cnt[2]--;
	}
	while(cnt[2]>0){
		cout<<"2 ";
		cnt[2]--;
	}
	while(cnt[1]>0){
		cout<<"1 ";
		cnt[1]--;
	}

	return 0;
}
```
{%endfold%}








## B. Three Religions

三个串$a,b,c$和模板串$s$，每次操作可以向某个串后面添加一个字符或删掉一个字符，求经过$q$次操作之后，$s$中是否有$a,b,c$的不相交子串。保证任意时刻$|a|,|b|,|c|\leq 250$。

### 题解

首先有个东西叫做序列自动机，可以查询从第$i$个字符开始，字符$c$第一次出现的位置。（看起来很高端其实很简单）

考虑$f(i,j,k)$为匹配完$a,b,c$串的第$i,j,k$个字符后，最短匹配到了$s$的什么位置，则$f(i,j,k)$在$|s|$内说明答案存在。（DP的具体转移方程见[Editorial](https://codeforces.com/blog/entry/66783)）这个过程用序列自动机加速可以$\mathcal{O}(|a|^3)$处理完毕。

考虑修改，假设往$a$串加了一位，则每次需要新计算$f(i+1,j,k)$，这需要$\mathcal{O}(|a|^2)$的时间；考虑往$a$删除一位，则$f(i-1,j,k)$是已经计算好的，不需要重新计算。

注意DP过程可能会越界。总时间复杂度$\mathcal{O}(q|a|^2)$。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=100000+5,C=26+5,M=250+5,INF=0x3f3f3f3f;
int nxt[N][C],f[M][M][M];
char s[N],t[3][M];
int len[3];
int n,q; 

void Init(){
	memset(nxt,-1,sizeof(nxt));

	for(int i=1;i<=n;i++)
		nxt[i][s[i]-'a']=i;
	
	for(int c=0;c<26;c++){
		nxt[n+1][c]=INF;
		for(int i=n;i>=0;i--)
			if(nxt[i][c]==-1)
				nxt[i][c]=nxt[i+1][c];
	}
}

void DP(int id){
	if(id==0){
		int i=len[0];

		for(int j=0;j<=len[1];j++)
			for(int k=0;k<=len[2];k++)
				f[i][j][k]=INF;

		for(int j=0;j<=len[1];j++)
			for(int k=0;k<=len[2];k++){
				if(i>0 && f[i-1][j][k]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i-1][j][k]+1][t[0][i]-'a']);
				if(j>0 && f[i][j-1][k]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i][j-1][k]+1][t[1][j]-'a']);
				if(k>0 && f[i][j][k-1]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i][j][k-1]+1][t[2][k]-'a']);
			}
	}else if(id==1){
		int j=len[1];

		for(int i=0;i<=len[0];i++)
			for(int k=0;k<=len[2];k++)
				f[i][j][k]=INF;

		for(int i=0;i<=len[0];i++)
			for(int k=0;k<=len[2];k++){
				if(i>0 && f[i-1][j][k]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i-1][j][k]+1][t[0][i]-'a']);
				if(j>0 && f[i][j-1][k]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i][j-1][k]+1][t[1][j]-'a']);
				if(k>0 && f[i][j][k-1]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i][j][k-1]+1][t[2][k]-'a']);
			}
	}else{
		int k=len[2];

		for(int i=0;i<=len[0];i++)
			for(int j=0;j<=len[1];j++)
				f[i][j][k]=INF;

		for(int i=0;i<=len[0];i++)
			for(int j=0;j<=len[1];j++){
				if(i>0 && f[i-1][j][k]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i-1][j][k]+1][t[0][i]-'a']);
				if(j>0 && f[i][j-1][k]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i][j-1][k]+1][t[1][j]-'a']);
				if(k>0 && f[i][j][k-1]<=n)
					f[i][j][k]=min(f[i][j][k],nxt[f[i][j][k-1]+1][t[2][k]-'a']);
			}
	}
}

int main(){
	cin>>n>>q;
	for(int i=1;i<=n;i++)
		cin>>s[i];
	Init();

	f[0][0][0]=0;
	while(q--){
		char op; int id;
		cin>>op>>id; id--;
		if(op=='+'){
			cin>>t[id][++len[id]];
			DP(id);
		}else len[id]--;
	
		if(f[len[0]][len[1]][len[2]]>n)cout<<"NO\n";
		else cout<<"YES\n";
	}
	
	return 0;
}
```
{%endfold%}








## C. Tree Generator™

一个代表树的括号序列$s$，多次交换$s_i,s_j$（保证交换之后是合法的序列），求每次操作后的直径。

### 题解

这道题有点神…

对于两个点，有$\mathrm{dist}(u,v)=\mathrm{dep}(u) + \mathrm{dep}(v)-2\times \mathrm{dep}(\mathrm{LCA}(u,v))$。而括号序列代表的是一个树的DFS序，假设序列中$u\leq v$，则有$u \leq \mathrm{LCA}(u,v) \leq v$，即$\mathrm{dist}(u,v)=\mathrm{dep}(u) + \mathrm{dep}(v)-2\times \min_{u\leq i\leq v} \mathrm{dep}(i)$。

因此只需要维护满足$a\leq b\leq c$的三元组$(a,b,c)$在上式值的最大值即可。然后要维护这个值，需要维护各种奇奇怪怪的组合…总之都是为了能够实现区间加法（进而线段树维护）而进行的。

小小总结一下：

* 括号序列是一个DFS出入序列。
* $\mathrm{dist}(u,v)=\mathrm{dep}(u) + \mathrm{dep}(v)-2\times \mathrm{dep}(\mathrm{LCA}(u,v))$。这个思路说明，可以通过维护DFS序上的极值，实现不知道LCA的情况下的树上两点距离计算。
* 括号序列的一个子串，在去掉匹配括号后留下来的序列代表了一条连续路径（右括号：向上到达该节点，左括号：向下走到该节点）

### 代码

{%fold%}
```c++
#include<iostream>
using namespace std;

#define lch (o<<1)
#define rch (o<<1|1)

const int N=100000*2+5;

struct SegTree{
	struct Node{
		int det,a,b,ab,bc,abc;
		Node(){
			det=0; a=0, b=0;
			ab=0, bc=0, abc=0;
		}
		void Left(){
			det=1; a=1, b=-2;
			ab=-1, bc=-1, abc=0;
		}
		void Right(){
			det=-1; a=-1, b=2;
			ab=1, bc=1, abc=0;
		}
	};
	Node t[N*4];

	void Maintain(int o){
		int det=t[lch].det;

		t[o].det=t[lch].det+t[rch].det;
		t[o].a=max(t[lch].a,t[rch].a+det);
		t[o].b=max(t[lch].b,t[rch].b-2*det);

		t[o].ab=max(t[lch].ab,t[rch].ab-det);
		t[o].ab=max(t[o].ab,t[lch].a+t[rch].b-2*det);

		t[o].bc=max(t[lch].bc,t[rch].bc-det);
		t[o].bc=max(t[o].bc,t[lch].b+t[rch].a+det);

		t[o].abc=max(t[lch].abc,t[rch].abc);
		t[o].abc=max(t[o].abc,t[lch].ab+t[rch].a+det);
		t[o].abc=max(t[o].abc,t[lch].a+t[rch].bc-det);
	}

	void Build(int o,char a[],int L,int R){
		if(L==R){
			if(a[L]=='(')t[o].Left();
			else t[o].Right();
			return;
		}
		int M=(L+R)/2;
		Build(lch,a,L,M); Build(rch,a,M+1,R);
		Maintain(o);
	}

	void Modify(int o,int pos,int v,int L,int R){
		if(L==R){
			if(v==1)t[o].Left();
			else t[o].Right();
			return;
		}
		int M=(L+R)/2;
		if(pos<=M)Modify(lch,pos,v,L,M);
		else Modify(rch,pos,v,M+1,R);
		Maintain(o);
	}
};
SegTree t;

char s[N];

int main(){
	int n,q; cin>>n>>q;
	for(int i=1;i<=n*2-2;i++)
		cin>>s[i];
	n=n*2-2;
	t.Build(1,s,1,n);
	cout<<t.t[1].abc<<endl;

	while(q--){
		int l,r; cin>>l>>r;
		if(s[l]=='(')t.Modify(1,l,-1,1,n);
		else t.Modify(1,l,1,1,n);
		if(s[r]=='(')t.Modify(1,r,-1,1,n);
		else t.Modify(1,r,1,1,n);
		swap(s[l],s[r]);
		cout<<t.t[1].abc<<endl;
	}

	return 0;
}
```
{%endfold%}
