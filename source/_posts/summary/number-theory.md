---
title: 数论总结
date: 2017-04-14 00:00:00
comment: true
mathjax: true
tags:
categories:
- 算法总结
---

东西很分散，知识比较乱，因此就放在一起写了。

<!---more--->




# 素性判断

## Rabin-Miller

单次时间复杂度为$\mathrm{O}(\log n)$的判素方法。当底数枚举范围为$(1,p]$时，正确概率为$1-\left(1/4\right)^p$。OI中一般测试4~5次就足够了。原理是利用了费马小定理，具体的探究见Matrix67的[*素数与素性测试*](http://www.matrix67.com/blog/archives/234)。

1. 将待测试数$x$化为$x-1=a*2^p$的形式；
2. 选择一个$[2.n)$间的底数$bas$，对每个底数$bas$考察：
    1. 计算$x'=bas^{a*2^p}\bmod{x}$；
    2. 分类讨论：
        - $x'=1$。令$p'=\frac p2$，继续考察$bas^{a*2^{p'}}\pmod{x}$；
        - $x'=x-1$。则$x$为$bas$下的伪素数，考察下一个底数;
        - 否则$x$为合数，退出算法。

附上代码。

```c++
bool RabinMiller(ll n){
	if(n==2)return 1;
	if(n<=1||!(n&1))return 0;

	int p=0;ll a;
	while((n-1)%(1<<(p+1))==0)p++;
	a=(n-1)/(1<<p);

	for(int i=1;i<=UPP;i++){       //UPP为测试次数
		int bas=rand()%(n-2)+2;
		for(int j=p;j>=0;j--){
			ll tmp=QPow(bas,a*((ll)1<<j),n);
			if(tmp==1)continue;
			else if(tmp==n-1)break;
			else return 0;
		}
	}

	return 1;
}
```

实际运用中还是很快的。

## Eratosthenes筛法

NOIP知识点。直接放代码。

```c++
void Eratosthenes(){
	int upp=sqrt(N);
	for(int i=2;i<=upp;++i)        //大于sqrt(N)的数已经被筛过了
		if(!notPri[i])
			for(int j=i*i;j<N;j+=i)      //小于i^2的数已经被筛过了
                notPri[j]=1;
}
```

值得注意的是我不止一次没注意筛法的上下界，使得复杂度变大。（其实也没有多慢）

## 线筛






# 欧拉函数

欧拉函数$\Phi$是积性函数，因此可以线性筛。

代码：

```c++
void Phi(){
	for(int i=1;i<N;++i)phi[i]=i;
	for(int i=2;i<N;++i)
		if(phi[i]==i)
			for(int j=i;j<N;j+=i)
				phi[j]-=phi[j]/i;
}
```

单个$\Phi$值只需要利用$\Phi(n)=\Pi_{i=1}(1- \frac 1{p_i})$即可。注意需要特判大于$\sqrt{n}$的因子。

```c++
int Phi(int x){
	int ret=x，upp=int(sqrt(x)+1);
	for(int i=2;i<=upp;++i)
		if(x%i==0){
			ret-=ret/i;
			while(x%i==0)x/=i;
		}
	if(x>1)ret-=ret/x;
	return ret;
}
```

## 欧拉函数的一些性质

由辗转相除法可以得：

$$(a,b)=(a,a+b)=(b,a+b)$$

$\varphi (n)$求的是$[1,n]$中$(i,n)=1$的个数，若$(i,n)=1$，则$(n-i,i)=1$，即互质的数是成对存在的。因此$[1,n] (n>1)$中与$2n$互质的数有$\varphi (n)/2$个。

由上述结论容易得到：

$$ \sum _{i=1,\ (i,n)=1}^n = \frac {n\times \varphi(i)}2 \quad (n>1)$$

一些内容可以参考[关于欧拉函数及其一些性质的美妙证明（2）](https://zhuanlan.zhihu.com/p/37067555)。






## 指数循环节

考虑这么个式子：$a^x\equiv c\pmod{p}$。如果$x$很大就不能直接求了。

明显$p$为质数时，根据费马小定理有：

$$
a^x \bmod{p} = a^{x \bmod \phi(p)} \bmod{p}
$$

然而$p$是合数也有结论：

$$
a^x \bmod{p} = a^{x \bmod \phi(p)+\phi(p)} \bmod{p}\quad (x\geq\phi(p))
$$

注意有条件，不能直接用（虽然通常可以）。

## 原根

待补

## 欧拉定理

待补

## 扩展欧拉定理

待补，但是其实上面给出式子了。








# 离散变换

和模运算有关。模运算除了除法外，四则运算都可以先模再运算最后模。除法需要找逆元。

## 逆元

$x$在$p$下存在逆元的充分必要条件是$(x,p)=1$。

逆元的求法：

- 扩展欧几里得（求解$a*inv+p*y=1$）
- 费马小定理（$a^{\Phi (p)}\equiv 1\pmod{p} \Rightarrow inv=a^{p-2}\ \text{（p为素数）}$）
- 线性递推逆元表（$inv_i=\left(p-\lfloor \frac pi \rfloor \right)* inv_{p\bmod{i}}\bmod{p}$）

第三个很玄学就是了。简单证明帮助理解：

令$p=nt+k$，则：

$$
\begin{aligned}
nt+k&\equiv 0\pmod{p} \\
\Rightarrow k&\equiv -nt\pmod{p} \\
\Rightarrow n^{-1}&\equiv -tk^{-1}\pmod{p} \\
\Rightarrow n^{-1}&\equiv -\lfloor{\frac pn}\rfloor *(p\bmod{n})^{-1}\pmod{p}
\end{aligned}
$$

即$inv_i=\left(p-\lfloor \frac pi \rfloor \right)* inv_{p\bmod{i}}\bmod{p}$。

但是这个东西有点难背。我们是不是可以$\mathcal{O}(n)$求阶乘，可以$\mathcal{O}(\log n)$求$(n!)^{-1}$，可以$\mathcal{O}(1)$求$n^{-1} = (n-1)!/n!$呢？

好了，现在我们找到一个$\mathcal{O}(n + \log n)$求$[1,n]$逆元的方法了。

## 离散对数

其实就是求解$a^x\equiv b \pmod{p}$。根据费马小定理，对于$p$为质数的情况，$i$取$[0,p)$时恰好使得$a^i\bmod{p}$取到$[0,p)$的值各一次。因此此方程若有解，则一定在$[0,p)$内有且仅有一解。

### Baby-step Giant-step

求解这个方程的大步小步算法（Baby-step Giant-step）可以参考*训练指南*。这里只描述框架。

1. 令$m=\sqrt{p}$，用哈希表或map记录取得$a^i\bmod{p}\ (0\leq i<m)$时$i$的最小值；
2. 对$a^{j \times m}\ (1\leq j\leq m)$查找表中是否存在$b*a^{-m}\bmod{p}$对应的$i$值：
    - 存在。则最小解为$x=j*m+i$；
    - 不存在。考察下一个j。

时间复杂度为$\mathrm{O}(\sqrt{n})$。然而使用BSGS的前提条件是$(a,p)=1$，当$p$不是质数的时候不一定能使用（但是$p$为质数时必须有$a<p$，否则也不保证$a$不为$p$的倍数）。好在我们可以使用扩展BSGS来解决$p$不是质数的情况。

```c++
int BSGS(ll a,ll b,ll p){
	map<ll,int> s;
	int m=(int)ceil(sqrt(p));
	ll tmp=1;
	for(int i=0;i<m;i++,tmp=tmp*a%p)
		if(!s.count(tmp))s[tmp]=i;
	ll inv=Invert(tmp,p);tmp=b;
	for(int i=0;i<m;i++,tmp=tmp*inv%p)
		if(s.count(tmp))return i*m+s[tmp]+1;
	return -1;
}
```

### 扩展Baby-step Giant-step

我们不能求解的原因是费马定理不一定再适用，但可以通过不断对$a$和$p$提取GCD的方法使得$(a,p)=1$，再应用BSGS。

明确这么一件事：令$g=(a,p)$，则$a^x\equiv b\ \pmod{p} \Leftrightarrow \frac ag \times a^{x-1}\equiv \frac bg \pmod{\frac pg}$，具体理由可以展开为不定方程后同除$g$即可。这样就可以通过不断除$(a,p)$使得$(a,p)=1$。流程：

1. 当$g=(a,p)\not =1$，化方程为$(\frac ag) \times a^{x-1}\equiv \frac bg\ \pmod{\frac pg} \Rightarrow a^{x-1}\equiv \frac bg \times (\frac ag)^{-1}\ \pmod{\frac pg}$；
    - 若$b$已经为$1$，则$x$为除以$g$的次数（特判）；
    - 否则操作直到$(a,p)=1$；
2. 使用BSGS。

注意特判是需要的，因为当$(a,p)\not =1$时也有可能存在解$x$，而继续操作会使得$x$增大。






## 同余方程

即求解$ax+by=c$，也可以转化为$ax\equiv c\ \pmod{b}$。

### 扩展欧几里得

求解方法是扩展欧几里得，有解的充分必要条件是$(a,b)|c$，求解的结果$x_0,y_0$是最小化$|x|+|y|$的一组解。由于比较模板，就直接放上代码了。

```c++
void ExtendGCD(int a,int b,int &x,int &y,int &g)       //x和y都是传引用
{
	if(!b)x=1,y=0,g=a;
	else ExtendGCD(b,a%b,y,x,g),y-=x*(a/b);      //x和y要交换，a/b必须要向下取整
}
```

时间复杂度和欧几里得一样，可以近似看作$\mathrm{O}(\log{n})$。

求解的是$ax+by=(a,b)$的解。以下我们对变量带上$'$符号时表示该值为原值除以$g$，则明显原问题的解为$x=x_0 \times c',y=y_0 \times c'$。

要求出其他的解，则只需要迭代$x=x_0+b',y=y_0-a'$即可。这个结论可以通过假设一组其他解$x,y$和$x_0,y_0$联立解得。我们往往要求$x$的最小非负解，根据这个结论我们可以得到$x_+=(x_0\bmod{b'}+b')\bmod{b'c'}$。

### 欧几里得

由辗转相除法可以得：

$$(a,b)=(a,a+b)=(b,a+b)$$

这个结论我也不知道有什么用，但是看起来可以化简一类**累和GCD**的问题。如*SDOI2008 沙拉公主的困惑* 处理了$(M! , i) = (M! + i , i) \ (1<i \leq M!)$，使得一个大数$N!\ (N>M)$可以被分解成多段长度为$M!$的段，从而降低了求$N!$与$M!$中互质的二元组数的困难。

另一个例子见[这场比赛的I题](/spring-training/spring-training-190705)。

### 类欧几里得

震惊了，还有这种算法。等省选结束学习一发。

## 中国剩余定理

对于单组同余方程$ax\equiv c\pmod{p}$求解，我们可以使用扩展欧几里得。但对于多组同余方程$x\equiv c_i\pmod{p_i}$，我们需要中国剩余定理（Chinese Remainder Theorem）。

假设有$n$个方程组，且$M=\prod p_i,m_i=\frac M{p_i}$。我们考虑其中的一个方程$x\equiv c_i\pmod{p_i}$。由于$(m_i,p_i)=1$，因此方程$m_ix+p_iy=1$有解。我们对这个方程两边同模$p_i$，并且令$e_i=m_ix$，则有$e_i\equiv 1\pmod{p_i}$。

根据一些神奇的方法构造出一个解$x=\sum_{i=1}^n c_ie_i$。观察这个式子，我们给两边同除$p_i$，则只剩下$x\equiv c_ie_i \equiv c_i\pmod{p_i}$，即原模方程组。然后就可以通过扩展欧几里得得到$x$的一个解了。

### 扩展中国剩余定理

用于解决不互质的情况。

假设任意两个方程组$x\equiv c_1\pmod{p_1},x\equiv c_2\pmod{p_2}$，化为方程组：

$$
\begin{cases}
x=c_1+k_1p_1 \\
x=c_2+k_2p_2 \\
\end{cases}
$$

联立得$c_1+k_1p_1=c_2+k_2p_2$，可以解不定方程得到$k_1,k_2$的一组解$k_1',k_2'$，因此$k_1=k_1'\frac{a_2-a_1}g+T\frac {p_2}g$，$T$为任意整数。回代入任意一个$x$的方程得：

$$
\begin{aligned}
x=&c_1+p_1k_1 \\
=&c_1+p_1(k_1'\frac{a_2-a_1}g+T\frac {p_2}g) \\
=&c_1+p_1k_1'(\frac{a_2-a_1}g+T\frac {p_1p_2}g)
\end{aligned}
$$

即$x\equiv c_1+p_1k_1'\frac{a_2-a_1}g \pmod{[p_1,p_2]} $，两个方程组合并为一个方程组。需要合并最多$n-1$个方程组，时间复杂度$\mathrm{O}(n)$。注意$x$可能会很大，一般化为最小非负解再计算。

用这个方法也可以推出非扩展情况，然而非扩展情况的形式推不出扩展情况。

```c++
ll ExtendCRT(){
	ll a0,p0,a1,p1;bool flag=1;
	cin>>p0>>a0;
	for(int i=2;i<=n;i++){
		ll x,y,g,c;
		cin>>p1>>a1;
		if(flag){
			ExtendGCD(p0,p1,x,y,g);
			c=a1-a0;
			if(c%g){flag=0;continue;}
			x=x*(c/g)%(p1/g);
			a0+=x*p0;p0=p0*p1/g;
			a0%=p0;		//防止溢出
		}
	}
	if(flag)return (a0%p0+p0)%p0;
	else return -1;
}
```

这个代码可能是有问题的，在POJ过了，在BSOJ没过。<del>然后我小叮当今天就要打爆你CRT的头</del>







# 神奇小技巧

## 快速幂

NOIP内容。时间复杂度$\mathrm{O}(\log{n})$。

```c++
ll QPow(ll bas,ll t){
	ll ret=1;
    for(;t;t>>=1,bas=QMul(bas,bas))
		if(t&1)ret=QMul(ret,bas);
	return ret;
}
```

## 快速乘

这个就比较少见了。当两个数的乘法（取模）可能连long long都爆时，就可以用这个方法。其思想是将十进制乘法变为二进制乘法，并按位计算。由于乘数$b$每次只会翻倍，因此不会超出long long。时间复杂度$\mathrm{O}(\log{n})$。

	ll QMul(ll a,ll b){
		if(a>b)swap(a,b);
		ll ret=0;
		for(;b;b>>=1,(a<<=1)%=p)
			if(b&1)(ret+=a)%=p;
		return ret;
	}

# 练习

数论题目真是多而难写。很绝望。有些基础题真的水水的，就不放了。

## Baby-step Giant-step

### SDOI2011 计算器

操作1为快速幂，操作2为同余方程，操作3为离散对数。

### SDOI2013 随机数生成器

通过对递推式进行迭代可以得到离散对数的方程，需要扩展BSGS。但是题目需要多个分类讨论，比较复杂。

## 同余方程

### NOI2002 荒岛野人

假设$M$个洞穴两个野人$t$天相遇，则有$pos_i+t \times det_i=pos_j+t \times det_j \pmod{M}$，可以解不定方程。如果不相遇，则$t$应该大于两个野人寿命最小的那个，或者根本无解。

从小到大枚举$M$，对每个$M$对任意两个野人判定是否可行即可。时间复杂度$\mathrm{O}(MN^2)$，事实上到不了上界。

## 欧拉函数

### SDOI2008 沙拉公主的困惑

由于辗转相除法$(a+b,b)=(a,b)$，因此$(M!,i)=(M!+i,i)$，即对于$[1,N!]$的每一段$M!$，与$M!$互质的个数都是一样的。我们知道与$M!$互质的个数为$\phi(M!)$，因此答案$ans={N!*\phi(M!) \over M!}$。

展开欧拉函数得：

$$ans=N!*\Pi_{i=1} (1-\frac1{p_i}) \quad (p_i|M!\text{且}p_i\text{为质数})$$

不难发现$p_i$其实就是$[1,m]$的所有质数，因此我们可以预处理出小于$n$的质数的$(i-1)\over i$的积和$n!$，就可以$\mathrm{O}(1)$回答询问了。

总时间复杂度$\mathrm{O}(max(n,m))$。

## 快速乘/快速幂

### BZOJ4766 文艺计算姬

根据矩阵树定理可以推得答案为$n^{m-1}*m^{n-1}$，需要快速乘和快速幂。

也可以用prufer序列得到。

# 总结

数论是很神奇的东西，数论题是奥妙重重的题目。入手点一般在于将题目抽象为目标式、将目标式化简为高效可求式的过程。为此必须熟练掌握初等数论的内容<del>特别是结论</del>，以应对其中的数学变换。

当然猜测不出规律的时候可以打表观测<del>说不定就猜对了</del>。

（然后没有具体的总结，毕竟数论变化太多，需要结合题目看）
