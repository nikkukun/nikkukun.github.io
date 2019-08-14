---
title: 190526 Spring Training 8
comment: true
mathjax: true
date: 2019-6-2 16:00:00
tags:
categories:
- 比赛
- 训练
---

[比赛链接](https://vjudge.net/contest/302803)

题目	|A	|B	|C	|D	|E	|F	
-		|-	|-	|-	|-	|-	|-
通过	|√	|	|	|	|√	|
补题	|	|	|√	|√	|	|

<!--more-->








## A - 3-idiots 

给定序列$a$且$a_i\leq 10^5$，求随机在序列中选三个下标不同的数能够成三角形三边的概率。

### 题解

考虑三条边不能组成三角形的情况，减去即可，FFT加速计算。

可以见叉姐课件。（诶，其实只是不想写）

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

const int N=(1<<18)+4;
const double PI=acos(-1.0);

struct Complex{
	double x,y;
	Complex(double _x=0,double _y=0){
		x=_x;y=_y;
	}
	Complex operator + (Complex a){
		return Complex(x+a.x,y+a.y);
	}
	Complex operator - (Complex a){
		return Complex(x-a.x,y-a.y);
	}
	Complex operator * (Complex a){
		return Complex(x*a.x-y*a.y,y*a.x+x*a.y);
	}
};

void FFT(Complex *w,int n,int op){
	static int r[N];

	for(int i=0;i<n;i++)
		r[i]=(r[i>>1]>>1)|((i&1)?n>>1:0);
	for(int i=0;i<n;i++)
		if(i<r[i])swap(w[i],w[r[i]]);
		
	for(int len=2;len<=n;len<<=1){
		int sub=len>>1;
		Complex det(cos(PI/sub),op*sin(PI/sub));
		for(int l=0;l<n;l+=len){
			Complex rot(1,0);
			for(int i=l;i<l+sub;i++){
				Complex x=w[i],y=rot*w[i+sub];
				w[i]=x+y;w[i+sub]=x-y;
				rot=rot*det;
			}
		}
	}
}

Complex b[N];
int cnt[N],sum[N];
int n,maxA;

double Solve(){
	int len=1; for(;len<=(maxA<<1);len<<=1);
	for(int i=0;i<len;i++){
		b[i].x=b[i].y=cnt[i];
	}

	FFT(b,len,1);
	for(int i=0;i<len;i++)
		b[i]=b[i]*b[i];
	FFT(b,len,-1);

	double ans=0;
	for(int i=0;i<len;i++){
		double tmp=b[i].y/len/2;
		if((i&1)==0){
			tmp-=cnt[i/2]*cnt[i/2];
			ans+=tmp*sum[i]*3;
			if(cnt[i/2]>=2)
				ans+=cnt[i/2]*(cnt[i/2]-1)*sum[i]*3;
		}else ans+=tmp*sum[i]*3;
	}

	return fabs(1-ans/n/(n-1)/(n-2));
}

int main(){
	int nCase; cin>>nCase;
	while(nCase--){
		memset(cnt,0,sizeof(cnt));
		memset(sum,0,sizeof(sum));
		maxA=0;

		cin>>n;
		for(int i=1;i<=n;i++){
			int a; cin>>a;
			cnt[a]++; maxA=max(maxA,a);
		}
		for(int i=maxA;i>0;i--)
			sum[i]=sum[i+1]+cnt[i];

		cout<<fixed<<setprecision(7)<<Solve()<<endl;
	}

	return 0;
}
```
{%endfold%}




## C - Hope

定义一个排列$P_n$的价值如下：$a_i$向右边第一个大于它的数连边，所有连通分量的大小相乘后平方。定义$f(n)$为$n$的全排列的价值之和，多次询问求$f(n)$。

### 题解

参考[HDU5322 - cdq分治FFT加速dp](https://blog.csdn.net/weixin_37517391/article/details/83218581)。

考虑把$n$放在一个$P_{n-1}$的第$i$个位置，则前$i-1$个数由于都比$n$小会连在一起，而后面的部分与前面无关，因此有$f(n)=\sum_{i=1}^n A_{n-1}^{i-1} i^2 \times f(n-i)$。展开可以获得一个卷积形式，但是每个$f(n)$都与前面的值相关，这个可以用CDQ分治先计算出$(l,m)$的$f$值，再计算$(l,m)$对$(m+1,r)$的贡献，最后递归$(m+1,r)$。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int N=((1<<17)<<1)+5,M=100000+5,G=3,MOD=998244353;
int n;

ll QPow(ll bas,int t){
	ll ret=1;
	for(;t;t>>=1,bas=bas*bas%MOD)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

ll Inv(ll x){
	return QPow(x,MOD-2);
}

void NTT(int *w,int n,int op){
	static int r[N];

	for(int i=0;i<n;i++)
		r[i]=(r[i>>1]>>1)|((i&1)?n>>1:0);
	for(int i=0;i<n;i++)
		if(i<r[i])swap(w[i],w[r[i]]);
		
	for(int len=2;len<=n;len<<=1){
		int sub=len>>1;
		ll det=QPow(G,MOD-1+op*(MOD-1)/len);
		for(int l=0;l<n;l+=len){
			ll rot=1;
			for(int i=l;i<l+sub;i++){
				ll x=w[i], y=rot*w[i+sub]%MOD;
				w[i]=(x+y)%MOD;
				w[i+sub]=(x-y)%MOD;		//maybe minus
				rot=rot*det%MOD;
			}
		}
	}
	
	if(op==1)return;
	ll inv=Inv(n);
	for(int i=0;i<n;i++)
		w[i]=inv*w[i]%MOD;
}

int g[N],dp[N];
ll fac[N],fac_i[N];

void Solve(int L,int R){
	if(L==R)return;
	int M=(L+R)/2;
	Solve(L,M);

	int len=1,n=R-L+1,m=M-L+1;
	for(;len<=(n<<1);len<<=1);

	static int a[N],b[N];
	for(int i=0;i<len;i++)a[i]=b[i]=0;
	for(int i=0;i<n;i++)
		b[i]=1LL*i*i%MOD;
	for(int i=0;i<m;i++)
		a[i]=dp[i+L]*fac_i[i+L]%MOD;
	
	NTT(a,len,1); NTT(b,len,1);
	for(int i=0;i<len;i++)
		a[i]=1LL*a[i]*b[i]%MOD;
	NTT(a,len,-1);

	for(int i=m;i<n;i++)
		dp[i+L]=(dp[i+L]+a[i]*fac[i+L-1]%MOD)%MOD;

	Solve(M+1,R);
}

int main(){
	fac[0]=1;
	for(int i=1;i<N;i++)
		fac[i]=fac[i-1]*i%MOD;
	fac_i[N-1]=Inv(fac[N-1]);
	for(int i=N-1;i>0;i--)
		fac_i[i-1]=fac_i[i]*i%MOD;

	dp[0]=1;
	Solve(0,M);		
	for(int i=1;i<N;i++)
		dp[i]=(dp[i]+MOD)%MOD;

	int x;
	while(cin>>x)cout<<dp[x]<<endl;

	return 0;
}
```
{%endfold%}








## D - Evaluation

* $x_k=b\times c^{2k}+d$
* $F(x)=a_0 x_0+a_1 x_1+a_2 x_2+\ldots+a_{n-1} x_{n-1}$

给定上述参数，计算$F(x_0), \ldots , F(x_{n-1})$。 


### 题解

推式子过程参考[Candy](https://www.cnblogs.com/candy99/p/6754278.html)的博客，下面的式子也是复制过来的orz。

比较神秘的做法是中间出现了

$$f(k) = \sum_{j=0}^n \frac{b^j c^{2kj} p_j}{j!}$$

需要利用$(k-j)^2 = k^2 + j^2 - 2kj$换出减法的形式

$$f_k = c^{k^2}\sum_{j=0}^n \frac{b^j c^{j^2}p_j}{j!c^{(k-j)^2}}$$

小结论：式子中并没有出现卷积形式时，可以通过平方公式作差把卷积形式换出来。

然后需要拆系数FFT，具体参考16年论文《再探究快速傅里叶变换》毛啸和[Orchidany'w blog](http://www.orchidany.cf/2019/02/19/FFT2/)。由于拆系数FFT的精度可能会出问题，因此预处理出每次旋转的值可以提高精度（而累乘可能产生较大误差）。

### 代码

{%fold%}
```c++
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int M=131072*2*2+5,D=(1<<15),MOD=1000003;
const double PI=acos(-1.0);

struct Complex{
	double x,y;
	Complex(double _x=0,double _y=0){
		x=_x; y=_y;
	}
	Complex operator + (Complex a){
		return Complex(x+a.x,y+a.y);
	}
	Complex operator - (Complex a){
		return Complex(x-a.x,y-a.y);
	}
	Complex operator * (Complex a){
		return Complex(x*a.x-y*a.y,y*a.x+x*a.y);
	}
};

Complex rot[M];

void FFT(Complex *w,int n,int op){
	static int r[M];
	for(int i=0;i<n;i++)
		r[i]=(r[i>>1]>>1)|((i&1)?n>>1:0);
	for(int i=0;i<n;i++)
		if(i<r[i])swap(w[i],w[r[i]]);
		
	for(int len=2;len<=n;len<<=1){
		int sub=len>>1;
		for(int l=0;l<n;l+=len){
			for(int i=l;i<l+sub;i++){
				Complex &r=rot[sub+i-l];
				Complex x=w[i];
				Complex y=(Complex){r.x,op*r.y}*w[i+sub];
				w[i]=x+y; w[i+sub]=x-y;
			}
		}
	}
}

void MTT(int f[],int g[],int len,int ans[]){
	static Complex a[M],b[M],c[M],d[M];

	memset(a,0,sizeof(a)); memset(b,0,sizeof(b));
	memset(c,0,sizeof(c)); memset(d,0,sizeof(d));

	for(int i=0;i<len;i++){
		a[i].x=f[i]/D; b[i].x=f[i]%D;
		c[i].x=g[i]/D; d[i].x=g[i]%D;
	}
	for(int i=1;i<len;i<<=1)
		for(int j=0;j<i;j++)
			rot[i+j]=Complex(cos(PI*j/i),sin(PI*j/i));

	FFT(a,len,1); FFT(b,len,1);
	FFT(c,len,1); FFT(d,len,1);

	for(int i=0;i<len;i++){
		Complex _a=a[i], _b=b[i], _c=c[i], _d=d[i];
		a[i]=_a*_c;
		b[i]=_a*_d+_b*_c;
		c[i]=_b*_d;
	}

	FFT(a,len,-1); FFT(b,len,-1); FFT(c,len,-1);

	for(int i=0;i<len;i++){
		ll w=0;
		w += (ll)round(a[i].x/len)%MOD*D%MOD*D%MOD;
		w += (ll)round(b[i].x/len)%MOD*D%MOD;
		w += (ll)round(c[i].x/len)%MOD;
		ans[i]=w%MOD;
	}
}

ll QPow(ll bas,int t){
	ll ret=1; bas%=MOD;
	for(;t;bas=bas*bas%MOD,t>>=1)
		if(t&1)ret=ret*bas%MOD;
	return ret;
}

ll fac[M],fac_i[M];

void Init(){
	fac[0]=1;
	for(int i=1;i<M;i++)
		fac[i]=fac[i-1]*i%MOD;
	fac_i[M-1]=QPow(fac[M-1],MOD-2);
	for(int i=M-1;i>0;i--)
		fac_i[i-1]=fac_i[i]*i%MOD;
}

int n,b,c,d;
int a[M];

int main(){
	ios::sync_with_stdio(0);

	Init();
	
	cin>>n>>b>>c>>d;
	for(int i=0;i<n;i++)
		cin>>a[i];
	int len=1;
	for(;len<=(n<<1);len<<=1);

	static int f[M],g[M],h[M];
	for(int i=0;i<=n;i++){
		f[i]=a[i]*fac[i]%MOD;
		g[i]=QPow(d,n-i)*fac_i[n-i]%MOD;
	}
	MTT(f,g,len,h);

	memset(f,0,sizeof(f)); memset(g,0,sizeof(g));
	for(int i=0;i<=n;i++)
		f[i]=QPow(b,i)*QPow(c,1LL*i*i%(MOD-1))%MOD*h[n+i]%MOD*fac_i[i]%MOD;
	int c_i=QPow(c,MOD-2);
	for(int i=0;i<=2*n;i++)
		g[i]=QPow(c_i,1LL*(i-n)*(i-n)%(MOD-1));
	for(;len<=(2*n<<1);len<<=1);
	memset(h,0,sizeof(h));
	MTT(f,g,len,h);
	
	for(int i=0;i<n;i++){
		int ans=QPow(c,1LL*i*i%(MOD-1))*h[i+n]%MOD;
		cout<<(ans+MOD)%MOD<<endl;
	}

	return 0;
}
```
{%endfold%}
