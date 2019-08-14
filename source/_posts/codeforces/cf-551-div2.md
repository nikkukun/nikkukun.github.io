---
title: Codeforces Round 551 (Div. 2)
comment: true
mathjax: true
date: 2019-4-15 22:06:00
tags:
categories:
- 比赛
- Codeforces
---

[比赛链接](https://codeforces.com/contest/1153)

题目	|A	|B	|C	|D	|E	|F
-		|-	|-	|-	|-	|-	|-
通过	|×	|√	|√	|√	|	|
补题	|√	|	|	|	|√	|√

<!--more-->

## A. Serval and Bus

### 题解

模拟题意。可以证明答案一定不超过$2\times 10^5$，所以空间要开两倍。

### 代码

{%fold%}
```c++
#include<iostream>
using namespace std;

const int N=100+5,T=200000+5;
int s[N],d[N];
int vst[T];

int main(){
	int n,t; cin>>n>>t;
	for(int i=1;i<=n;i++){
		int s,d; cin>>s>>d;
		for(int j=0;s+j*d<T;j++)
			vst[s+j*d]=i;
	}
	for(int i=t;i<T;i++)
		if(vst[i]){
			cout<<vst[i];
			return 0;
		}

	return 0;
}
```
{%endfold%}







## B. Serval and Toy Bricks

### 题解

构造$a(i,j)=\min(row_i,col_j)$，其中$row_i,col_j$分别为题目中第二第三行的输入。

### 代码

{%fold%}
```c++
#include<cstdio>
#include<iostream>
#include<cmath>
using namespace std;

const int N=100+5;
int row[N],col[N];
int a[N][N];
int ans[N][N];
int n,m,h;

int main(){
	cin>>n>>m>>h;
	for(int i=0;i<m;i++)
		cin>>col[i];
	for(int i=0;i<n;i++)
		cin>>row[i];
	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++){
			bool f; cin>>f;
			if(f==0)continue;
			ans[i][j]=min(row[i],col[j]);
		}

	for(int i=0;i<n;i++){
		for(int j=0;j<m;j++)
			cout<<ans[i][j]<<' ';
		cout<<endl;
	}

	return 0;
}
```
{%endfold%}







## C. Serval and Parenthesis Sequence

### 题解

为了让最后的结果是合法的，必须有`s[1]='('`与`s[n]=')'`，因此只需让$s_2 s_3 \dots s_{n-1}$的每一个前缀都不是满足条件的括号序列即可。具体做法见官方editorial。

### 代码

{%fold%}
```c++
#include<cstdio>
#include<iostream>
#include<cmath>
using namespace std;

const int N=300000+5;
char s[N];
int n;

int main(){
	scanf("%d%s",&n,s);
	
	if(n&1){
		printf(":(");
		return 0;
	}
	if(s[0]==')'||s[n-1]=='('){
		printf(":(");
		return 0;
	}

	s[0]='('; s[n-1]=')';
	int cntLeft=0;
	for(int i=1;i<n-1;i++)
		if(s[i]=='(')cntLeft++;
	
	if(cntLeft>(n-2)/2){
		printf(":(");
		return 0;
	}

	int det=0;
	for(int i=1;i<n-1;i++){
		if(s[i]=='?'){
			if(cntLeft<(n-2)/2){
				s[i]='(';
				cntLeft++;
			}else s[i]=')';
		}
		
		if(s[i]=='(')det++;
		else det--;

		if(det<0){
			printf(":(");
			return 0;
		}
	}

	printf("%s",s);

	return 0;
}
```
{%endfold%}








## D. Serval and Rooted Tree 

### 题解

令$f(u)$表示向子树$u$中放入一个序列后，能选出来的值最大是第几大。考虑用贪心的方法填满一个子树，则若$u$为$\max$，有$f(u)=\min \{ f(v)\}$，$v$为儿子节点；若若$u$为$\min$，有$f(u)=\sum f(v)$。

### 代码

{%fold%}
```c++
#include<cstdio>
#include<iostream>
#include<cmath>
#include<vector>
using namespace std;

const int N=300000+5,INF=0x3f3f3f3f;
int siz[N]; bool type[N];
int f[N];
vector<int> a[N];
int n;

void DFS(int u){
	if(a[u].empty()){
		f[u]=1; siz[u]=1;
		return;
	}

	if(type[u]==1)f[u]=INF;

	for(int i=0;i<a[u].size();i++){
		int v=a[u][i]; DFS(v);
		siz[u]+=siz[v];
		if(type[u]==0)f[u]+=f[v];
		if(type[u]==1)f[u]=min(f[u],f[v]);
	}
}

int main(){
	cin>>n;
	for(int i=1;i<=n;i++)
		cin>>type[i];
	for(int i=2;i<=n;i++){
		int pa; cin>>pa;
		a[pa].push_back(i);
	}
	DFS(1);
	cout<<(siz[1]-f[1]+1);

	return 0;
}
```
{%endfold%}









## E. Serval and Snake

### 题解

头尾有两种情况：不在同一行/同一列，在同一行/同一列。对于第一种情况，先考虑通过单独询问每一行和每一列得到头尾所在的行列，最后再多询问一次确定交点。对于第二种情况，假设已经知道头尾在同一行，且分别在$y_1,y_2(y_1 < y_2)$列，则可以二分询问$(1,1,x,y_1)$代表的矩形求出$x$的值。

最大询问次数为$999+999+10=2008$次。

### 代码

{%fold%}
```c++
#include<stdio.h>
#include<math.h>
#include<iostream>
using namespace std;

const int N=5;
int x[N],y[N];
int cnt;

int Query(int x1,int y1,int x2,int y2){
	cout<<"? "<<x1<<' '<<y1<<' '<<x2<<' '<<y2<<endl;
	cout.flush();
	int tmp; cin>>tmp;
	return tmp;
}

void Answer(){
	cout<<"! "<<x[1]<<' '<<y[1]<<' '<<x[2]<<' '<<y[2]<<endl;
	cout.flush();
}

int main(){
	int n; cin>>n;
	
	for(int i=1,pre=0;i<n;i++){
		int q=(Query(1,1,i,n)&1);
		if(pre^q)x[++x[0]]=i;
		pre=q;
	}
	if(x[0]==1)x[++x[0]]=n;

	for(int i=1,pre=0;i<n;i++){
		int q=(Query(1,1,n,i)&1);
		if(pre^q)y[++y[0]]=i;
		pre=q;
	}
	if(y[0]==1)y[++y[0]]=n;

	if(x[0]==2&&y[0]==2){
		int q=Query(x[1],y[1],x[1],y[1]);
		if((q&1)==0)swap(y[1],y[2]);
	}else if(x[0]==2){
		int L=1,R=n;
		while(L<R){
			int M=(L+R)/2;
			int q=Query(1,1,x[1],M);
			if(q&1)R=M;
			else L=M+1;
		}
		y[1]=y[2]=L;
	}else{
		int L=1,R=n;
		while(L<R){
			int M=(L+R)/2;
			int q=Query(1,1,M,y[1]);
			if(q&1)R=M;
			else L=M+1;
		}
		x[1]=x[2]=L;
	}

	Answer();

	return 0;
}
```
{%endfold%}






## F. Serval and Bonus Problem

### 题解

考虑长度为$1$的情况，则原题的概率等价于：随机在$2n$个线段中丢一个点$P$，落在有$k$个以上区间的概率。由于每个点都是随机独立的，因此对于某一种确定了$2n+1$个点位置（无序）的情况，$P$落在有$k$个以上区间的概率和原概率相同。因此目标在于计算给该无序序列定序时，满足条件的方案数占这个序列总排列方式$(2n+1)!$的比例。

接下来的部分[editorial](https://codeforces.com/blog/entry/66539)讲得非常详细了，但是前面的转化过程不太好想到。

### 代码

{%fold%}
```c++
#include<iostream>
using namespace std;

typedef long long ll;
const int N=2000+5,MOD=998244353;

ll f[2*N][N][2],fac[2*N];
int n,lim,len;

ll QPow(ll bas,int t){
	ll ret=1;
	for(;t;t>>=1,bas=bas*bas%MOD)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

int main(){
	cin>>n>>lim>>len;
	
	fac[0]=1;
	for(int i=1;i<=2*n+1;i++)
		fac[i]=fac[i-1]*i%MOD;

	f[0][0][0]=1;
	for(int i=1;i<=2*n+1;i++)
		for(int j=0;j<=min(i,n);j++){
			for(int k=0;k<=1;k++){
				//left
				if(j>=1 && i+j-k<=2*n)
					f[i][j][k]=(f[i][j][k]+f[i-1][j-1][k])%MOD;
				//right
				f[i][j][k]=(f[i][j][k]+f[i-1][j+1][k]*(j+1)%MOD)%MOD;
			}
			//point
			if(j>=lim)
				f[i][j][1]=(f[i][j][1]+f[i-1][j][0])%MOD;
		}

	ll ans=f[2*n+1][0][1]*QPow(2,n)%MOD;
	ans=ans*fac[n]%MOD;
	ans=ans*QPow(fac[2*n+1],MOD-2)%MOD;
	cout<<ans*len%MOD;

	return 0;
}
```
{%endfold%}







## 总结

因为读错题意被卡了AB两道水题，想了想上次校赛决赛A题也是这样。

> 不要跳读，不要跳读，不要跳读。

F题的转化很有意思。想到自己在概率和期望上做的题目比较少，需要多接触一些相关的题目提升。
