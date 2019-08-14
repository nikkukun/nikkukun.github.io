---
title: 矩阵总结
date: 2017-04-14 00:00:00
comment: true
mathjax: true
tags:
- 矩阵
- 行列式
categories:
- 算法总结
---

矩阵是个很神奇的东西，可惜我涉猎较少，只能浅谈矩阵的应用。

<!--more-->

我们先定义几个符号：

- $A$：矩阵$A​$
- $A_i$：矩阵$A$第$i$行
- $A_{i,j}$：矩阵$A$第$i$行第$j$列的元素
- $M_{i,j}$：矩阵$A$去掉第$i$行和第$j$列的矩阵（余子式）
- $A^T$：矩阵$A$的转置
- $A^n$：矩阵$A$的$n$次幂
- $\det(A)$：矩阵$A$的行列式

## 矩阵乘法

定义矩阵乘法$A\times B=C,C_{i,j}=\Sigma_{k=1}^m A_{i,k}B_{k,j}$，其中$A$是$n
$行$m$列、$B$是$m$行$p$列的矩阵。矩阵乘法不满足交换率，但满足**结合率**和**分配率**。

在这种定义下，矩阵乘法满足交换率的情况：

- 两矩阵相等
- 两矩阵至少有一个为数量矩阵（主对角线为相同的数，其他为$0$）
- 两矩阵的乘积等于两矩阵的和（了解）

## 矩阵的幂

根据矩阵乘法的定义，只有$n$行$n$列的矩阵（方阵）才有幂。

矩阵满足结合率，因此可以使用快速幂加速，计算大小为$n$的矩阵$A^k$时间复杂度$\mathrm{O}(n^3\log{k})$。如果加速矩阵乘法，可以降低复杂度，但在OI中这个复杂度就足够了。

利用矩阵的幂可以求线性递推式（如Fibonacci）。

## 邻接矩阵性质

假设$A$为$n$个节点的图$G$的邻接矩阵，则考虑一个矩阵乘法的过程：

$$G_{i,j}^2=\Sigma_{k=1}^n G_{i,k}G_{k,j}$$

相当于枚举经过的$k$点，计算从$i$到$j$经过$2$条边的方案数。这个过程其实就是在模拟Floyd。因此我们猜测：$G_{i,j}^k$表示经过$k$条边$(k\geq 0)$，从$i$到达$j$的方案数。事实上这是正确的。

如果我们重新定义矩阵乘法$A\times B=C,C_{i,j}=min_{1\leq k\leq n}\{A_{i,k}+B_{k,j}\}$，则我们发现$G^2$就是Floyd，$G^k$是一张经过$k$条边的最短路邻接矩阵。

这提示我们可以根据需要重新定义矩阵乘法，但是仍要保证新的定义满足**结合率**（不用考虑交换率是因为乘数相同已经满足了交换率）。

## 高斯消元

其实是求解一个线性增广矩阵。

假定有列数为$n$的矩阵$A$和大小为$n$的向量$B$，高斯消元可以解得满足$A\times X=B$的向量$X$。更一般地说，高斯消元可解$A_i\times X_i=B_i$的解向量$X$。

高斯消元的理论在很多资料和*训练指南*上都有，因此此处重点分析代码。


```c++
void GausElim(){
	for(int i=0;i<n;i++){
		int cur=i;
		for(int j=i+1;j<n;j++)
			if(fabs(a[j][i])>fabs(a[cur][i]))cur=j;
		for(int j=0;j<=n;j++)swap(a[i][j],a[cur][j]);

		for(int j=i+1;j<n;j++)
			for(int k=n;k>=i;k--)
				a[j][k]-=a[i][k]*a[j][i]/a[i][i];
	}
	for(int i=n-1;i>=0;i--){
		for(int j=i+1;j<n;j++)
			a[i][n]-=a[j][n]*a[i][j];
		a[i][n]/=a[i][i];
	}
}
```

增广矩阵$A$的最后一列即为解向量。流程如下：

1. 对项$i$找到系数绝对值最大的一行并交换（减小精度误差）
2. 对$i$行之后的每一行$j$的每个元素$A_{j,k}$都减去$A_{j,k} \times \frac {A_{j,i}}{A_{i,i}}$。为了不破坏$A_{j,i}$，需要**逆序**进行；
3. 对每一行都操作完毕后，**逆序**将已有的解代入当前方程组求解。

注意上面的求法是只有唯一解时的求法。如果枚举到某行的某一项$i$发现后面所有项$i$的系数都为$0$，则$i$为**自由元**（取值任意），并在该行考察下一项$i+1$。如果解完后$i$行的系数全为$0$而$A_{i,n}\not=0$，则原方程组**无解**。

### 模意义下的高斯消元

边做边模即可。注意因为取模，有可能会出现多解的情况。但是此时若有多解，解的个数是可数的，因此我们往往需要求解的个数。

给出结论：在模$p$意义下解方程组若有$n$个自由元，则方程组的解个数为$p^n$。

因此像上述一样统计自由元就好了。但是我们很担心$p$不是质数，否则我们做除法的时候**逆元不一定存在**。这里就有个神奇小技巧了。

### 辗转相除法求逆

假设我们要求$A_i\leftarrow A_i-A_j*\frac {A_{i,i}}{A_{j,i}}$。方便描述，我们令$a=A_{i,i},b=A_{j,i}$，然后：

1. 令$c=\lfloor \frac ab\rfloor$，$A_i\leftarrow A_i-c\cdot A_j$；
2. 令$a\leftarrow a\bmod b$，交换$a,b$，交换$A_i,A_j$；
3. 当$b$不为$0$时重复1。

原理未知。但看起来过程是扩展欧几里得（上面的过程极有可能是**错**的）。

### 异或方程组

模$2$意义下的高斯消元，相当于采用异或运算。

### 矩阵求逆

不会。

## 行列式

定义函数$sign(p)$为全排列$p$中的逆序对数。对于方阵$A$，其行列式$\det{A}$定义：

$$\det(A)=\Sigma_{p\in permutation} [(-1)^{sign(p)}\Pi_{i=1}^n A_{i,p_i}]$$

看起来就不好求。但是我们有性质：

1. $\det(A)=\det(A^T)$
2. $\det(A)=-\det(A_{\text{swap(i,j)}})$
3. $k\det(a)=\det{A_{A_i=kA_i}}$
4. 若$A_i=kA_j$，则$\det(A)=0$
5. 若$A=B+C$，则$\det(A)=\det(B)+\det(C)$
6. $\det(A)=\det(A_{A_i=A_i+kA_j})$

具体的证明和文字说明见[这里](http://www.cnblogs.com/GerynOhenz/p/4450417.html)。利用性质六，我们就可以进行高斯消元了。

具体步骤和高斯消元一样。根据**性质二**，交换两行需要乘$-1$。根据**性质六**，我们消元时应该用第$j$行减去第$i$行作为第$j$行的答案，而不能用第$i$行减去第$j$行。

消元完毕后，答案即为主对角线的乘积。因为不选主对角线上的数必定会选中$0$，对答案没有贡献。而主对角线的排列$p$逆序对数为$0$。这样我们就在$\mathrm{O}(n^3)$的时间内求出矩阵的行列式。

## 矩阵树定理

求**无向图**$G$的生成树个数。根据矩阵树定理（Matrix-Tree Theorem/Kirchhoff's Theorem），若$G$的Kirchhoff矩阵为$K$，则其生成树个数$ST(G)$为：

$$ST(G)=\det{K_{i,i}}$$

$i$的值无所谓。具体证明和推导见[这里](http://vfleaking.blog.163.com/blog/static/1748076342013112523651955/)。

然而什么是Kirchhoff矩阵？令图$G$的度数矩阵为$D$，邻接矩阵为$A$，则$K=D-A$。更一般地，有：

$$
K_{i,j}=
\begin{cases}
\deg(i),&i=j\\
-1,&(i,j)\in E\\
0,&otherwise
\end{cases}
$$

但是这样高斯消元容易有精度误差，解决方法未知，可以考虑分数类。不过一般都是在模意义下的高斯消元，然后就可以采用辗转相除的黑科技保证精度。

可以扩展到有向图上，求出来的是有向树。

## 特征值及特征多项式

哈？

## 练习

### 矩阵乘法

#### BZOJ3444 ⑨的故事

题意：求$A^9\Sigma_{i=1}^n A^i$。

由于矩阵乘法满足分配率，因此当$n$为偶数时有$\Sigma_{i=1}^n A^i=(1+A^{n/2})\Sigma_{i=1}^{n/2} A^i$，奇数的情况相同考虑。然后就可以分治了。

时间复杂度$\mathrm{O}(n^3\log{n})$。

### 矩阵快速幂

#### HNOI2002 公交车路线

我们能得到递推方程

$$
f_{i,j}=
\begin{cases}
0,&j=4\text{且}i\not=n	\\
f_{i-1,j-1}+f_{i-1,j+1},&otherwise
\end{cases}
$$

其中$f_{i,j}$表示坐$i$次车到达$j$站的方案数。

这个式子线性递推且大小只有$8$，矩阵快速幂。

#### USACO2007NovGold Cow Relays

经过$k$条边的最短路径。注意到边数$nE$不大且每个点度数$\geq 2$，因此只需要最多$2nE$个点即可，离散化。

#### ZJOI2004 鳄鱼沼泽

仍然是求经过$k$条边的路径方案数，不过路径会变。然而变化周期为$2,3,4$，因此大周期为$(2,3,4)=12$就能出现循环。假设第$i$个局面的前缀积矩阵为$G_i$，则大循环矩阵为$G_{12}$，答案矩阵为$G_{12}^{\lfloor \frac n{12}\rfloor}G_{n \bmod 12}$。

注意修改矩阵的时候，若$u$不能通过，应该将前一个图到达$u$的点和该图从$u$出发的点置$0$才对。

#### BSOJ3792 做梦

令$f_i$为$i$时间后在家中的方案数，$g_i$为$i$时间内从家出发走$i$步不经过家且最后在家的方案数。则$f_i=\Sigma_{j=2}^m f_{i-j}g_j$。发现这个形式线性相关（$g_j$可以看作常数），构造矩阵：
$$
\begin{bmatrix}
g_2 &g_4 &\cdots &g_{m-2} &g_m\\
1 &0 &\cdots &0 &0\\
0 &1 &\cdots &0 &0\\
\vdots &\vdots &\ddots &\vdots &\vdots\\
0 &0 &\cdots &1 &0\\
\end{bmatrix}
\begin{bmatrix}
f_{i-2}\\
f_{i-4}\\
f_{i-6}\\
\vdots\\
f_{i-m}\\
\end{bmatrix}=
\begin{bmatrix}
f_i\\
f_{i-2}\\
f_{i-4}\\
\vdots\\
f_{i-m+2}\\
\end{bmatrix}
$$
前面的方阵可以快速幂。手推（打表）一下$g$就发现是Catalan数。

#### Codeforces719E Sasha and Array

题意：要求支持两种操作：区间Fibonacci和，区间加法。

好题。明显线段树，然而线段树怎么维护值呢。考虑到Fibonacci可以用矩阵快速幂计算，因此我们可以给线段树每个节点都丢一个Fibonacci变换矩阵$G$。

不难发现对Fibonacci数列$f(n)$有：
$$
\begin{aligned}
f(n+\Delta)=&G^{n+\Delta} \\
=&G^nG^{\Delta} \\
=&f(n)G^{\Delta}
\end{aligned}
$$
因此修改值等价于乘变换矩阵的$\Delta$次方。又矩阵乘法满足分配率：

$$\Sigma_i (f(n_i)G^{\Delta})=G^{\Delta}\Sigma_i f(n_i)$$

因此对一个区间乘上$G^{\Delta}$等于对区间和乘上$G^{\Delta}$。然后就可以用线段树愉快地维护lazy啦。要注意传$\Delta$的时候最好计算好矩阵再传引用，否则时间开销很大。

### 高斯消元

#### JSOI2008 球形空间产生器

假设球心坐标，通过球心到$n+1$个点的距离相同可以得到$n+1$个方程，且方程右边的数相同。

相邻两个方程分别相减得到$n$个$n$元一次方程（虽然可以得到更多方程，但是是多余的），用高斯消元即可。

#### BSOJ4544 开关问题

不难发现一个开关要么被开，要么不被开（开两次即以上相当于模$2$下的操作），且状态与开关顺序无关。因此我们假设每个开关是否被开，则对灯$i$有一个线性方程组，方程组左边为影响$i$的开关，方程组右边为灯的末状态和初状态的差值。解异或方程组求自由元个数即可。

### 矩阵树定理

#### SPOJ104 Highways

直接运用定理和高斯消元即可。

#### HEOI2015 小Z的房间

建图求生成树。然而要模$10^9$，只能用辗转相除的高斯消元。

#### 文艺计算姬

题意：求二分图$(n,m)$的生成树个数。

矩阵长这样。

$$
\begin{bmatrix}
m&0&\cdots&0&-1&-1&\cdots&-1\\
0&m&\cdots&0&-1&-1&\cdots&-1\\
\vdots&\vdots&\ddots&\vdots&\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&m&-1&-1&\cdots&-1\\
-1&-1&\cdots&-1&n&0&\cdots&0\\
-1&-1&\cdots&-1&0&n&\cdots&0\\
\vdots&\vdots&\ddots&\vdots&\vdots&\vdots&\ddots&\vdots\\
-1&-1&\cdots&-1&0&0&\cdots&n\\
\end{bmatrix}
$$

我们只要$M_{n+m,n+m}$，然后消前$n$行。
$$
D=
\begin{vmatrix}
m&0&\cdots&0&-1&-1&\cdots&-1\\
0&m&\cdots&0&-1&-1&\cdots&-1\\
\vdots&\vdots&\ddots&\vdots&\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&m&-1&-1&\cdots&-1\\
0&0&\cdots&0&n-\frac nm&-\frac nm&\cdots&-\frac nm\\
0&0&\cdots&0&-\frac nm&n-\frac nm&\cdots&-\frac nm\\
\vdots&\vdots&\ddots&\vdots&\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&0&-\frac nm&-\frac nm&\cdots&n-\frac nm\\
\end{vmatrix}
$$
令$D_1$和$D_2$有：
$$
D_1=
\begin{vmatrix}
m&0&\cdots&0\\
0&m&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&m\\
\end{vmatrix}
,D_2=
\begin{vmatrix}
n-\frac nm&-\frac nm&\cdots&-\frac nm\\
-\frac nm&n-\frac nm&\cdots&-\frac nm\\
\vdots&\vdots&\ddots&\vdots\\
-\frac nm&-\frac nm&\cdots&n-\frac nm\\
\end{vmatrix}
$$
由于左下角都为$0$，因此它们对行列式没有贡献，有贡献的只有左上角和右下角，即$D=D_1D_2$。显然$D_1=m^n$。我们观察$D_2$。

把除了第一行的行都加到第一行上。
$$
D_2=
\begin{vmatrix}
\frac nm&\frac nm&\cdots&\frac nm\\
-\frac nm&n-\frac nm&\cdots&-\frac nm\\
\vdots&\vdots&\ddots&\vdots\\
-\frac nm&-\frac nm&\cdots&n-\frac nm\\
\end{vmatrix}
$$
提出第一行的常数：
$$
D_2=\frac nm
\begin{vmatrix}
1&1&\cdots&1\\
-\frac nm&n-\frac nm&\cdots&-\frac nm\\
\vdots&\vdots&\ddots&\vdots\\
-\frac nm&-\frac nm&\cdots&n-\frac nm\\
\end{vmatrix}
$$
把第一行乘$\frac nm$加到下面：
$$
D_2=\frac nm
\begin{vmatrix}
1&1&\cdots&1\\
0&n&\cdots&0 \\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&n\\
\end{vmatrix}
$$

显然$D_2=\frac nm*n^{m-2}=n^{m-1}m^{-1}$。因此$D=D_1D_2=n^{m-1}m^{n-1}$。

另外这道题也可以用prufer序列得到式子：

//有空再写

需要快速乘和快速幂。

## 总结

矩阵是线性代数的基础之一，其拥有很多性质，如快速幂给我们一种计算线性递推式的方法，行列式可以进行生成树计数。（虽然还有很多性质没有学习）

- $n$项的线性递推式可以构造一个$n\times n$的变换矩阵进行快速幂。如果项中有不能**直接**从上一次的元素中得到的项（如$k$次幂），需要将该项的递推式项也加入矩阵，否则可以直接在变换矩阵里写一个常数转移。

- 邻接矩阵的$k$次幂是一个经过$k$条边的方案数矩阵。如果有必要，可以重新定义乘法；

- 高斯消元有多解时，若某项及之后的式子该项系数全为$0$，则需要**保持在该行**并考察下一项。

- 行列式求值时，交换两行需要乘$-1$。且消元时应该用第$j$行减去第$i$行作为第$j$行的答案。

- 行列式的六个性质：
	1. $\det(A)=\det(A^T)$
	2. $\det(A)=-\det(A_{\text{swap(i,j)}})$
	3. $k\det(a)=\det{A_{A_i=kA_i}}$
	4. 若$A_i=kA_j$，则$\det(A)=0$
	5. 若$A=B+C$，则$\det(A)=\det(B)+\det(C)$
	6. $\det(A)=\det(A_{A_i=A_i+kA_j})$

- 进行行列式化简时，若每一行都刚好有一个元素相同且互不同列，而其他元素也相同，则可以把所有行都加在一行上得到一行相同的数，提出常数得到$1$，再依次消元。
