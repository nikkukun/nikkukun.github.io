---
title: 190601 Spring Training 9
comment: true
mathjax: true
date: 2019-6-3 21:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://vjudge.net/contest/302803)

题目	|A	|B	|C	|D	|E	
-		|-	|-	|-	|-	|-	
通过	|√	|√	|×	|√	|	
补题	|	|	|√	|	|√	

<!--more-->








## C - 俄罗斯方块

二维坐标$(x,y)$上的一个方块是稳定的，当且仅当$(x-1,y-1),(x,y-1),(x+1,y-1)$中存在至少一个方块，或是$x=0$。一开始有标号$0,1,\ldots,m-1$的$m$的方块，两人在上面轮流取方块，分别想最大化与最小化取出的字典序。要求每次取出后整体稳定，求序列在$m$进制下的值。

### 题解

一个方块不能被拿走，当且仅当所有它支撑的方块只被它支撑。如果在支撑关系间连边（$y$大的连向小的），则每次拿走一个方块，都可能让它的儿子、它所有父亲的儿子的状态更新，进而加入取出后仍然稳定的集合。每次从集合贪心取极值即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<int,int> pint;
const int N=100000+5+1,MOD=1000000009;
vector<int> a[N],b[N];
int n;

static int deg[N];

bool isLegal(int u){
	for(auto v:b[u])
		if(deg[v]==1)return 0;
	return 1;
}

ll Toposort(){
	for(int u=1;u<=n;u++)
		deg[u]=a[u].size();

	static int inQ[N];
	priority_queue<int,vector<int>,less<int> > qMax;
	priority_queue<int,vector<int>,greater<int> > qMin;

	for(int u=1;u<=n;u++)
		if(isLegal(u)){
			qMin.push(u); qMax.push(u); inQ[u]=1;
		}

	ll ans=0;
	for(int i=0;i<n;i++){
		while(1){
			int u=qMax.top();
			if(inQ[u]!=1)qMax.pop();
			else if(inQ[u]==1&&isLegal(u)==0){
				inQ[u]=0, qMax.pop();
			}else break;
		}
		while(1){
			int u=qMin.top();
			if(inQ[u]!=1)qMin.pop();
			else if(inQ[u]==1&&isLegal(u)==0){
				inQ[u]=0, qMin.pop();
			}else break;
		}
		
		int u;
		if(i&1)u=qMin.top(), qMin.pop();
		else u=qMax.top(), qMax.pop();
		inQ[u]=-1; ans=(ans*n+u-1)%MOD;
		deg[u]=0;

		//son
		for(auto v:a[u])
			if(inQ[v]==0&&isLegal(v)){
				qMin.push(v); qMax.push(v); inQ[v]=1;
			}
		
		//pa
		for(auto v:b[u])
			if(inQ[v]!=-1)deg[v]--;
		for(auto v:b[u])
			for(auto w:a[v])
				if(inQ[w]==0&&isLegal(w)){
					qMin.push(w); qMax.push(w); inQ[w]=1;
				}
	}
	
	return (ans+MOD)%MOD;
}

map<pint,int> idx;
pint p[N];

int main(){
	cin>>n;
	for(int i=1;i<=n;i++){
		cin>>p[i].first>>p[i].second;
		idx[p[i]]=i;
	}

	for(int i=1;i<=n;i++){
		for(int dx=-1;dx<=1;dx++){
			auto q=make_pair(p[i].first+dx,p[i].second-1);
			int j=idx[q];
			if(j!=0){
				a[i].push_back(j);
				b[j].push_back(i);
			}
		}
	}

	cout<<Toposort();

	return 0;
}
```
{%endfold%}







## D - 加号

一个数字序列，往其中合法地插入$k$个加号，求所有可能的方案中得到的表达式的值之和。

### 题解

考虑第$i$位置，则可以计算出这一位对答案的贡献为$a_i\times 10^p$时的方案数，进而计算贡献。公式手推一下就好啦。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=100000+5,MOD=1000000007;
int n,k;

ll QPow(ll bas,int t){
	ll ret=1; bas%=MOD; 
	for(;t;bas=bas*bas%MOD,t>>=1)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

ll Inv(ll x){
	return QPow(x,MOD-2);
}

ll fac[N],fac_i[N],pow10[N];

void Init(){
	fac[0]=1;
	for(int i=1;i<N;i++)
		fac[i]=fac[i-1]*i%MOD;
	fac_i[N-1]=Inv(fac[N-1]);
	for(int i=N-1;i>0;i--)
		fac_i[i-1]=fac_i[i]*i%MOD;
	
	pow10[0]=1;
	for(int i=1;i<N;i++)
		pow10[i]=pow10[i-1]*10%MOD;
}

int a[N];

ll Solve(){
	ll ans1=0,ans2=0;

	static ll f[N];
	for(int i=0;i<n;i++){
		if(n-2-i-k+1<0)continue;
		f[i]=fac[n-2-i]*fac_i[n-2-i-k+1]%MOD*pow10[i]%MOD;
	}
	for(int i=1;i<n;i++){
		f[i]=(f[i]+f[i-1])%MOD;
		ans1=(ans1+a[i]*f[i-1])%MOD;
	}
	ans1=ans1*fac_i[k-1]%MOD;

	for(int i=0;i<n;i++){
		if(n-i-1-k<0)continue;
		ans2=(ans2+a[i]*pow10[i]%MOD*fac[n-i-1]%MOD*fac_i[n-i-1-k])%MOD;
	}
	ans2=ans2*fac_i[k]%MOD;

	return (ans1+ans2)%MOD;
}

int main(){
	Init();

	ll ans=0;
	cin>>n>>k;
	for(int i=n-1;i>=0;i--){
		char c; cin>>c;
		a[i]=c-'0';
	}
	if(k==0){
		for(int i=n-1;i>=0;i--)
			ans=(ans*10+a[i])%MOD;
	}else ans=(Solve()+MOD)%MOD;
	cout<<ans;

	return 0;
}
```
{%endfold%}









## E - 技能升级

一个序列${a_1,a_2,\ldots,a_n}$，有$m$个操作：

1. 给$a_i$赋值
2. 给$a_i$加一个正数
3. 给$a_i$乘一个正数

最多可以执行其中的$k$个操作，求最大化$\prod a_i$。

### 题解

神题……

如果只有乘法，那只需要贪心选择就好了。现在考虑把前面几个操作改为乘法。

操作1可以看做是给$a_i$加一个数的操作，因此变成了操作2。现在考虑操作2，加一个数$p$可以看做原序列乘$\dfrac {a_i+p}{a_i}$，显然我们应当从大到小贪心地加，也就是说，如果对下标$i$的操作有$p_i$个，则排序后做第$j$个操作的前提是$[1,j-1]$的操作全部做完了。

有了上面的性质，我们就可以愉快地把操作全变成乘法，贪心选择一下前$k$个（注意有效的操作数量可能比$k$个少），最后输出时按操作1-操作2-操作3顺序输出即可。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef pair<int,int> pint;
typedef pair<double,int> pdint;
const int N=100000+5;
int type[N],a[N],b[N],id[N];
int n,m,lim;
int maxId[N];

int main(){
	cin>>n>>m>>lim;
	for(int i=1;i<=n;i++)cin>>a[i];

	static vector<pint> c[N];
	static vector<pdint> q;
	
	for(int i=1;i<=m;i++){
		cin>>type[i]>>id[i]>>b[i];
		if(type[i]==1 && b[maxId[id[i]]]<b[i])maxId[id[i]]=i;
		if(type[i]==2)c[id[i]].push_back(make_pair(b[i],i));
		if(type[i]==3)q.push_back(make_pair(b[i],i));
	}

	for(int i=1;i<=n;i++){
		if(maxId[i]!=0){
			int id=maxId[i];
			if(b[id]-a[i]<=0)continue;
			c[i].push_back(make_pair(b[id]-a[i],id));
		}
		sort(c[i].begin(),c[i].end(),greater<pint>());
	}
	
	for(int i=1;i<=n;i++){
		double sum=a[i];
		for(auto _id:c[i]){
			int v=_id.first, id=_id.second;
			q.push_back(make_pair(v/sum+1,id));
			sum+=b[id];
		}
	}

	sort(q.begin(),q.end(),greater<pdint>());

	lim=min(lim,(int)q.size());
	cout<<lim<<endl;
	for(int i=0;i<lim;i++){
		int id=q[i].second;
		if(type[id]==1)cout<<id<<' ';
	}
	for(int i=0;i<lim;i++){
		int id=q[i].second;
		if(type[id]==2)cout<<id<<' ';
	}
	for(int i=0;i<lim;i++){
		int id=q[i].second;
		if(type[id]==3)cout<<id<<' ';
	}

	return 0;
}
```
{%endfold%}
