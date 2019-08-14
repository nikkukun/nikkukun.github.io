---
title: Codechef November Lunchtime 2018
comment: true
mathjax: true
date: 2018-11-26 19:31:00
tags:
categories:
- 比赛
- Codechef
---

[比赛链接](https://www.codechef.com/LTIME66B)

<!--more-->

# Event

## 题解

水题，直接判断是否在模7意义下存在一个数$t$，使得$t_{st}\leq t\leq t_{ed}$。

## 代码

```c++
#include<iostream>
#include<map>
#include<cstring>
using namespace std;

const int N=100+5;
map<string,int> idx;
int v[N];

int main(){
	ios::sync_with_stdio(0);

	idx["monday"]=1;
	idx["tuesday"]=2;
	idx["wednesday"]=3;
	idx["thursday"]=4;
	idx["friday"]=5;
	idx["saturday"]=6;
	idx["sunday"]=7;

	int t;cin>>t;
	while(t--){
		string a,b;cin>>a>>b;
		int l,r;cin>>l>>r;
		int det=(idx[b]-idx[a]+7)%7+1;

		memset(v,0,sizeof(v));
		for(int i=det;i<N;i+=7)v[i]=1;
		int cnt=0;
		for(int i=l;i<=r;i++)
			if(v[i])cnt++;

		if(cnt==0)cout<<"impossible\n";
		else if(cnt>1)cout<<"many\n";
		else for(int i=l;i<=r;i++)
			if(v[i])cout<<i<<endl;
	}

	return 0;
}
```

# Beats and Pieces

## 题解

暴力模拟即可。

`next_permutation()`和`reverse()`真好用（逃）

## 代码

```c++
#include<iostream>
#include<algorithm>
using namespace std;

const int N=10+5;
int a[N],b[N],c[N],l[N],r[N];
int per[N];
int n,m;

int Factor(int x){
	return x?x*Factor(x-1):1;
}

int GCD(int a,int b){
	return b?GCD(b,a%b):a;
}

int main(){
	ios::sync_with_stdio(0);

	int nCase;cin>>nCase;
	while(nCase--){
		cin>>n>>m;
		for(int i=1;i<=n;i++){
			cin>>a[i];
			b[i]=a[i];
		}
		for(int i=1;i<=m;i++)cin>>l[i]>>r[i];
		for(int i=1;i<=m;i++)
			reverse(b+l[i],b+r[i]+1);

		for(int i=1;i<=n;i++)per[i]=i;
		int fac=Factor(n);

		int ans=0;
		for(int i=1;i<=fac;i++){
			for(int j=1;j<=n;j++)c[j]=a[j];

			for(int j=1;j<=m;j++)
				reverse(c+l[per[j]],c+r[per[j]]+1);
			bool flag=1;
			for(int j=1;j<=n;j++)
				if(b[j]!=c[j])flag=0;

			ans+=flag;
			next_permutation(per+1,per+n+1);
		}

		int g=GCD(ans,fac);
		cout<<ans/g<<'/'<<fac/g<<endl;
	}

	return 0;
}
```

# Useful Number

## 题解

不妨设一个有用的数列的质数集合$S=\{p_i|p_i是质数\}$，那么对满足$S$的$A_S$中，所有$a_i\in A_S$都有因子$p=\prod_{p_i \in S} p_i$。

于是可以直接统计每个数的所有因子及其质因子个数，最后对所有出现的因子统计一下它的质因子个数$\times$含有这个数作为因子的$a_i$个数。

注意到每个数的因子个数不会超过$\mathrm{O}(\log n)$级别（这个是不是可以证明一下？），所以总时间复杂度是$\mathrm{O}(n\log n)$的。

## 代码

```c++
#include<iostream>
#include<vector>
#include<cstring>
using namespace std;

typedef long long ll;
const int N=100000+5;
bool notPri[N];int pri[N];

void Euler(){
	for(int i=2;i<N;i++){
		if(!notPri[i])pri[++pri[0]]=i;
		for(int j=1;j<=pri[0]&&i*pri[j]<N;j++){
			notPri[i*pri[j]]=1;
			if(i%pri[j]==0)break;
		}
	}
}

int fac[N],nfac[N];
int cnt[N];

void DFS(int v,int dep,int _nfac){
	if(dep>fac[0]){
		if(v>1)cnt[v]++,nfac[v]=_nfac;
		return;
	}
	DFS(v,dep+1,_nfac);
	DFS(v*fac[dep],dep+1,_nfac+1);
}

int main(){
	ios::sync_with_stdio(0);

	Euler();
	int nCase;cin>>nCase;
	while(nCase--){
		memset(cnt,0,sizeof(cnt));

		int n;cin>>n;
		for(int i=1,a;i<=n;i++){
			cin>>a;fac[0]=0;

			for(int j=1;j<=pri[0]&&pri[j]*pri[j]<=a;j++)
				if(a%pri[j]==0){
					fac[++fac[0]]=pri[j];
					while(a%pri[j]==0)a/=pri[j];				
				}
			if(a>1)fac[++fac[0]]=a;

			DFS(1,1,0);
		}

		ll ans=0;
		for(int i=1;i<N;i++)
			ans=max(ans,1LL*nfac[i]*cnt[i]);
		cout<<ans<<endl;
	}


	return 0;
}
```

# Probability

## 题解

[ZJOI2004 沼泽鳄鱼](https://www.luogu.org/problemnew/show/P2579)的进阶版本。此时循环节为$\mathrm{GCD}(2,4,6,8)=24$。

比赛时狂打1h，然后最后2分钟提交后发现T了。最后发现是G开大了……

（比赛后又对了一波拍，但是疯狂WA。~~假装A了~~）

## 代码

```c++
#include<iostream>
#include<cstring>
using namespace std;

typedef long long ll;
const int N=100+5,MOD=1000000007,G=24;

struct Matrix{
	ll m[N][N];
	Matrix(){
		memset(m,0,sizeof(m));
	}
	void Diag(){
		for(int i=0;i<N;i++)m[i][i]=1;
	}
	Matrix operator*(const Matrix &b)const{
		Matrix ret;
		for(int i=0;i<N;i++)
			for(int j=0;j<N;j++)
				for(int k=0;k<N;k++)
					ret.m[i][j]=(ret.m[i][j]+m[i][k]*b.m[k][j])%MOD;
		return ret;
	}
	Matrix operator^(const int &t)const{
		Matrix bas=*this,ret;
		ret.Diag();
		for(int i=t;i;i>>=1,bas=bas*bas)
			if(i&1)ret=ret*bas;
		return ret;
	}
};

ll QPow(ll bas,ll t){
	ll ret=1;bas%=MOD;
	for(;t;t>>=1,bas=bas*bas%MOD)
		if(t&1LL)ret=ret*bas%MOD;
	return ret;
}

int Inv(ll x){
	return QPow(x,MOD-2);
}

int m,n,r[2],nMon,t;
bool mon[G][N][N];
Matrix mat[G][2],gcd[2];

inline int Id(int r,int c){
	return r*m+c;
}

inline ll Abs(int x){
	return x>0?x:-x;
}

inline int Dis(int x1,int y1,int x2,int y2){
	return Abs(x1-x2)+Abs(y1-y2);
}

int main(){
	ios::sync_with_stdio(0);

	cin>>n>>m>>r[0]>>r[1]>>nMon>>t;
	for(int i=1,x1,x2,y1,y2;i<=nMon;i++){
		cin>>x1>>y1>>x2>>y2;
		if(x1==x2){
			int dir=1,y=y1;
			for(int j=0;j<G;j++){
				mon[j][x1][y]=1;
				int _y=y+dir;
				if(_y>max(y1,y2)||_y<min(y1,y2))dir*=-1;
				if(y1!=y2)y=y+dir;
			}
		}else{
			int dir=1,x=x1;
			for(int j=0;j<G;j++){
				mon[j][x][y1]=1;
				int _x=x+dir;
				if(_x>max(x1,x2)||_x<min(x1,x2))dir*=-1;
				if(x1!=x2)x=x+dir;
			}
		}
	}

	for(int d=0;d<=1;d++){
		gcd[d].Diag();

		for(int i=0;i<G;i++){
			for(int j=0;j<n;j++)
				for(int k=0;k<m;k++){
					if(mon[i][j][k])continue;

					int cnt=0;
					for(int p=0;p<n;p++)
						for(int q=0;q<m;q++){
							if(mon[(i+1)%G][p][q])continue;
							if(Dis(j,k,p,q)<=r[d])cnt++;
						}

					int inv=Inv(cnt);
					for(int p=0;p<n;p++)
						for(int q=0;q<m;q++){
							if(mon[(i+1)%G][p][q])continue;
							if(Dis(j,k,p,q)<=r[d])
								mat[i%G][d].m[Id(j,k)][Id(p,q)]=inv;
						}
				}

			gcd[d]=gcd[d]*mat[i][d];		
		}
	}

	Matrix vec[2];
	vec[0].m[0][0]=1;vec[1].m[0][Id(n-1,m-1)]=1;

	for(int i=0;i<=1;i++){
		vec[i]=vec[i]*(gcd[i]^(t/G));
		for(int j=0;j<(t%G);j++)
			vec[i]=vec[i]*mat[j][i];
	}

	ll ans=0;
	for(int i=0;i<n*m;i++)
		ans=(ans+vec[0].m[0][i]*vec[1].m[0][i]%MOD)%MOD;

	cout<<ans;

	return 0;
}
```

# 总结

感觉没什么人打Codechef？（或者说这一场的Div.2没什么人打？）

水题设置得还行，最后出个原题感觉就有点没意思了。

第一次知道时区还有+5.5的地区。
