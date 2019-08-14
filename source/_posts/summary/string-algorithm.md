---
title: 字符串算法总结
date: 2017-04-14 00:00:00
comment: true
mathjax: true
tags:
categories:
- 算法总结
---

竞赛中的字符串算法并不算少，可惜我在字符串上也拿不出手来。因此本篇只是简单总结，将来（咕）还会渐渐完善内容。

字符串算法通常是对一个或多个字符串进行匹配。然而这些算法不但不容易记忆且容易出错，因此尽可能保证**一次写对**是很重要的。

<!---more--->

# KMP

KMP是多个文本串匹配一个模板串的算法。它通过预处理模板串构造失配边，使得匹配失败的移动代价减小。失配边作用即是，从失配的一位顺着失配边走，则在失配边所在节点之前跟文本串都是匹配的。

初始化模板串的过程就是自己匹配自己的过程。具体流程如下：

1. 从第$i$位开始匹配；
2. 不断沿着失配边走，直到其等于第$i$位（此过程中前$i-1$位**保证匹配**）；
3. 如果当前位置结尾的串与第$i$位结尾的串匹配，将此失配边赋给$i+1$；
4. 否则当前位置是第$0$位，将$0$赋给$i+1$。

给出代码。

```c++
int Init(int f[],string s){
	   f[0]=f[1]=0;
	   for(int i=1;i<s.length();i++) {
	      int j=f[i];
	      while(j&&s[i]!=s[j])j=f[j];
	      f[i+1]=s[i]==s[j]?j+1:0;
	   }
	}
```


注意的点：

- 执行失配的是第$i$位，但正在计算的是**第$i+1$位**的失配
- 如果结尾不匹配，则失配边**连向开头**

明白了初始化，查询的代码也不难写。

```c++
int KMP(string s,string t,int f[]){
   int cnt=0,j=0;
   for(int i=0;i<s.length();i++){
      while(j&&s[i]!=t[j])j=f[j];
      if(s[i]==t[j])j++;
      if(j==t.length())cnt++;
   }
   return cnt;
}
```

- 需要用变量$j$记录当前文本串的匹配长度。
- $i$的值表示当前正在匹配第$i$位
- 是查询t在s上出现的位置（和上文的s不一样）

KMP的预处理复杂度和匹配复杂度都是线性的。（具体的证明我忘了，蓝书上有。）我们观察这个$f$数组（也叫fail数组），它也有很多不错的性质。

- $f_{i+1}$同时表示前缀$i$的**首尾相同部分子串最大长度**（Border）。我们发现，如果$f_{n+1}=j$，则$n+1-j$是长度为$n$的串的最小循环节（不一定完整）。这个性质可以证明，也可以画图理解。因此利用KMP可以求一个串的**最小循环节**。不断顺着失配边走，可以得到串从小到大的**周期**。
- 所有的失配边构成了一棵树，且标号严格递增，是小根堆。由于一个节点表示了一个原串的Border，所以可以通过在失配树上爬得到所有的Border。
- KMP树不断失配得到的序列，能被分为不超过$\log n$个等差数列。（没有看懂）

需要更多[补充](http://blog.csdn.net/qq_20669971/article/details/50973128)。WC2017的讲义里应该是有的。

## 扩展KMP

没有学习，很绝望。等待填坑。

## Border Tree

没有学习，很绝望。等待填坑。

##AC自动机

适用于多模板匹配。想到KMP是字符串+失配边，则多模板的AC自动机是Trie+失配边。其建树过程和KMP基本相同。

```c++
struct AhoCorasick{
	int ch[SIZ][CHAR],f[SIZ],suf[SIZ];
	bool isEnd[SIZ];
};
```

其中$f$是失配边，$ch$是Trie，$isEnd$表示节点$i$是否为单词结尾，而$suf$为上一个单词节点。不加解释地给出初始化代码：

```c++
void GetFail(){
	queue<int> q;
	for(int i=0;i<CHAR;i++)
		if(ch[0][i])q.push(ch[0][i]);

	while(!q.empty()){
		int h=q.front();q.pop();
		for(int i=0;i<CHAR;i++){
			int &u=ch[h][i],j=f[h];
			if(!u){u=ch[j][i];continue;}
			q.push(u);
			while(j&&!ch[j][i])j=f[j];
			f[u]=ch[j][i];
			suf[u]=isEnd[f[u]]?f[u]:suf[f[u]];
		}
	}
}
```

这个代码直接将不匹配的边改为失配边，这样查询时就可以直接在树上爬而不考虑失配数组啦。其中$suf$的作用是输出该节点结尾的全部单词，因为一个单词节点可能有多个单词。

//此处应该有查询的代码，等待补全

AC自动机的构建与查询都是线性的，一点证明可以看[这里](http://blog.jason-yu.net/post/5)。但是AC自动机似乎没有什么良好的性质可以使用，因此往往结合着考吧。（什么？可持久化Trie？）

# 后缀数组

后缀数组似乎不需要对构造的过程有太多理解，因为写了第一次之后基本就复制粘贴了。后缀数组的重点在记录排名为$k$的$sa$数组，记录后缀$k$的排名$rnk$数组和记录$LCP_{sa_{i-1},sa_i}$的$hei$数组。

可以参考09年论文：*《后缀数组——处理字符串的有力工具》罗穗骞*。下面就直接丢代码了。

```c++
struct SuffixArray{
	int sa[N],hei[N],rnk[N];

	void Init(int *a,int n){
		InitSa(a,n);
		InitHeight(a,n);
		for(int i=0;i<n;i++){
			sa[i]=sa[i+1];
			hei[i]=hei[i+1];
			rnk[i]--;
       	}
	}

	inline bool Cmp(int *a,int x,int y,int l){
		return a[x]==a[y]&&a[x+l]==a[y+l];
	}

	void InitSa(int *a,int n){
		int m=26;
		static int tmpX[N],tmpY[N],s[N];
		int *x=tmpX,*y=tmpY;

		a[n]=0;
		for(int i=0;i<m;i++)s[i]=0;
		for(int i=0;i<=n;i++)s[x[i]=a[i]]++;
		for(int i=1;i<m;i++)s[i]+=s[i-1];
		for(int i=n;i>=0;i--)sa[--s[x[i]]]=i;

		for(int i=1,p=1;p<=n;i<<=1,m=p){
			p=0;
			for(int j=n-i+1;j<=n;j++)y[p++]=j;
			for(int j=0;j<=n;j++)if(sa[j]>=i)y[p++]=sa[j]-i;
			for(int j=0;j<m;j++)s[j]=0;
			for(int j=0;j<=n;j++)s[x[y[j]]]++;
			for(int j=1;j<m;j++)s[j]+=s[j-1];
			for(int j=n;j>=0;j--)sa[--s[x[y[j]]]]=y[j];
			swap(x,y);
			p=1,x[sa[0]]=0;
			for(int j=1;j<=n;j++)x[sa[j]]=Cmp(y,sa[j-1],sa[j],i)?p-1:p++;
		}
	}

    void InitHeight(int *a,int n){
		for(int i=1;i<=n;i++)rnk[sa[i]]=i;
		for(int i=0,j,k=0;i<n;hei[rnk[i++]]=k)
			for(k?k--:0,j=sa[rnk[i]-1];a[i+k]==a[j+k];k++);
	}
};
```

注意上面代码的$a$数组范围为$[0,n)$，初始化时要把$a_n$赋一个**比其他字符都小**的字符。$m$为字符集最大值$+1$，即$1\leq a_i< m$。由于一些特殊原因，最后的数组是包含$a_n$的，显然$a_0=n$，我们需要把数组调整位置。具体流程：

1. 利用$a$进行基数排序，此时$x$为$rnk$数组。（如果$m$很大，使用快排离散化）；
2. 倍增长度，用$sa$数组计算的对第二关键字排序的$y$数组来计算$sa$数组；
3. 交换$x,y$，计算$x$数组。若当前二元组数$\leq n$，跳至第二步。

$hei$的求法是利用了$hei_{rnk_i}\geq hei_{rnk_i-1}-1$（具体解释见*训练指南*）。

## 利用后缀数组求LCP

不难证明两个后缀$i,j(rnk_i<rnk_j)$有：

$$LCP_{i,j}=min\{hei_k\}\quad rnk_i< k\leq rnk_j$$

这是个RMQ问题，因此我们可以$\mathrm{O}(nlogn)$预处理ST表$\mathrm{O}(1)$回答。

LCP可以解决多字符串的匹配问题，如询问多串字符串中长度最大且出现了至少$k$次的子串。这只需要二分长度$len$，每一次按$sa$顺序考察是否有长度为$len$且$LCP\geq k$的序列（使用单调队列）。

# 后缀自动机

几个参考资料：

* 陈立杰WC2015讲义
* 2015年国家集训队论文《后缀自动机及其应用》张天扬

```c++
namespace SAM{
    int ch[N][C],pa[N],len[N],siz[N];
    int idx=1,pre=1;

    void Insert(int x){
        int p=pre,np=++idx;pre=np;
        siz[np]=1;len[np]=len[p]+1;
        for(;p&&ch[p][x]==0;p=pa[p])ch[p][x]=np;

        if(p==0)pa[np]=1;
        else{
            int q=ch[p][x];
            if(len[q]==len[p]+1)pa[np]=q;
            else{
                int nq=++idx;len[nq]=len[p]+1;
                memcpy(ch[nq],ch[q],sizeof(ch[q]));
                pa[nq]=pa[q];pa[q]=pa[np]=nq;
                for(;p&&ch[p][x]==q;p=pa[p])ch[p][x]=nq;
            }
        }
    }

    int tmp[N],topo[N];
    void Build(){			//用拓扑关系\mathrm{O}(n)求得每个节点的siz
    	for(int i=1;i<=idx;i++)tmp[len[i]]++;
    	for(int i=1;i<=idx;i++)tmp[i]+=tmp[i-1];
    	for(int i=1;i<=idx;i++)topo[tmp[len[i]]--]=i;
        for(int i=idx;i>1;i--){
            int v=topo[i];int u=pa[v];
            siz[u]+=siz[v];
        }
```

每次插入的np都代表了原串的一个前缀，故其right设为1，最后再用拓扑统计一下siz即可。

## 广义后缀自动机

还是没有看懂。待补。

# 回文串

## Manacher

Manacher算法就是用已得到的回文串条件来简化一些不必要的判断。假如$A，B$串是回文串，且$B$串在$A$串回文中心左侧，则$B$串关于$A$的回文中心对称串$B'$也是回文串。

用$f_i$表示从$i$开始还能向两周扩展多少字符。记录$i$之前的$i+f_i$最大值$cur$（也就是当前最远的回文串右端点）与编号$idx$，则若$i$在$cur$内，长度有可能为$i$关于$idx$对称的位置的$f$值（$i+f_i$完全在$idx$的回文串内），也有可能为$cur-i$（$i+f_i$超出$cur$部分的不能保证长度一定等于$i$关于$idx$对称的$f$值）。接着就暴力向右匹配，尝试增加$f_i$。因为每一次的暴力匹配只会从$cur$向右的位置开始匹配（在$cur$内匹配一次就会失配），而$cur$会不断向右移动，最终$cur=n$。因此Manacher的时间复杂度是$\mathrm{O}(n)$的。

具体流程：

1. 初始化$f_0=0,cur=0,idx=0$；
2. 对每一个i：
    1. $f_i=min(f_{2*idx-i},cur-i)$；
    2. 尝试扩展$f_i$；
3. 更新$cur$。

给出实现。

```c++
int Manacher(){
	int len=strlen(tmp);
	for(int i=0;i<len;i++)str[i*2+1]='#',str[i*2+2]=tmp[i];
	str[len=len*2+1]='#';str[0]='*',str[len+1]='$';

	int cur=f[0]=0,idx=0,ans=1;		//cur为最远能到达的字符
	for(int i=1;i<=len;i++)
	{
		int& j=f[i];j=0;
		if(cur-i>=0&&2*idx-i>=0)j=min(f[2*idx-i],cur-i);
		while(str[i-j-1]==str[i+j+1])j++;
		if(i+j>cur)cur=i+j,idx=i;
		ans=max(ans,(j*2+1)/2);
	}
	return ans;
}
```

容易发现Manacher的回文是以字符为回文中心的，如果要求字符间为中心需要在所有字符间加一个相同的字符。为了方便匹配，我们设置第一个字符与最后一个字符为两个从未出现的、不同的字符，以此避免一些特判。

### 一些性质

Manacher得到的其实是本质不同的回文串（并且数量上是$\mathrm{O}(n)$级别的）。一个例题：[万径人踪灭](https://www.luogu.org/problemnew/show/P4199)。

## 回文自动机

几个参考资料：

* 2017年国家集训队论文《回文树及其应用》翁文涛

```c++
namespace PAM{
    int ch[N][C],pa[N]={1},len[N]={0,-1},siz[N];
    int idx=1,pre=0;

    void Insert(char *s,int pos){
        int p=pre,x=s[pos]-'a';
        for(;s[pos-len[p]-1]!=s[pos];)p=pa[p];
        if(ch[p][x]==0){
            int q=pa[p],np=++idx;
            len[np]=len[p]+2;
            for(;s[pos-len[q]-1]!=s[pos];)q=pa[q];
            pa[np]=ch[q][x];ch[p][x]=np;
        }
        pre=ch[p][x];siz[pre]++;
    }

    ll Build(){
        ll ans=0;
        for(int i=idx;i>1;i--){
            siz[pa[i]]+=siz[i];
            ans=max(ans,1LL*siz[i]*len[i]);
        }
        return ans;
    }
};

char s[N];

int main(){
    scanf("%s",s+1);s[0]='#';
    int n=strlen(s)-1;
    for(int i=1;i<=n;i++)
        PAM::Insert(s,i);
    printf("%lld",PAM::Build());
```

注意第二次找$fail$边时如果指向odd，则需要指向even，这也解释了为什么需要把even放在节点0（odd节点不存在转移时可以直接转移到0）。

### 一些性质

回文自动机除了odd和even节点的数目是原串中本质不同的回文串数目，其代表了一个从根节点到该节点的回文子串。

# 练习

## KMP

### POJ1961 Period

题意：求前缀串的循环节。

根据fail数组的性质，只要处理出$fail$数组找Border即可。

### HNOI2008 GT考试

用$dp_{i,j}$表示匹配完$i$位没出现不吉利数字，且末尾最长能匹配不吉利号码的前$j$位，则有：

$$dp_{i,j}=\sum(dp_{i-1,k})\quad\text{(去除当前最后一个字符最长能匹配不吉利号码的前k位)}$$

发现这个关系就是KMP的失配边关系，因此预处理出fail数组即可。但是$n$很大，同时$m$很小，且转移为线性，因此可以利用矩阵快速幂解决，时间复杂度$\mathrm{O}(n\log^3{m})$

### NOI2014 动物园

貌似是倍增。但是不会写。

## 扩展KMP

哈？

## AC自动机

### JSOI2007 文本生成器

题意：求长度为$M$的串中包含至少一个$N$单词字典的单词方案数。

"至少一个"不容易计算，考虑计算"一个都不生成"，理由是串的总方案数是已知的：$26^M$。因此我们只需要求在fail树上走$M$步不经过单词节点的方案数。规模较小，可以采用动态规划。

### POJ2778 DNA Sequence

题意：求长度为$M$的串中不包含$N$单词字典的单词方案数。

和上题一样，但是$M$可以很大$(2\times 10^9)$。字典单词数和单词长度都较小，因此可以构造矩阵判断是否能转移，矩阵快速幂即可。

### TJOI2013 单词

如果直接建树并在文章串上扫一遍极有可能会空间爆炸，因此换个角度思考。

一个串如果包含另一个串，则它们在树上是可以沿着失配边到达的。因此可以在构造fail树的时候记录哪些节点fail会到达自己，并加上这些节点被到达的次数即可。更具体化，令$cnt_u$为$u$节点（单词）的包含次数，则：

$$cnt_u=\sum cnt_v\quad(u\in fail_v)$$

初始化没有被包含的单词出现次数为$1$，时间复杂度为$\mathrm{O}(n)$。

## 后缀数组

### POJ1743 Musical Theme

题意：寻找长度大于$5$的、长度最长且不重叠的子串，且子串的差分数组相同。

因此直接在差分数组上匹配LCP就好了。二分答案$ans$，每次将$hei$分成LCP不大于$ans$的许多组，并判定是否存在一组的最前出现位置与最后出现位置间隔大于$ans$。由于是在差分数组上处理，有些细节需要注意（如只需要匹配$4$个）。

### USACO2006DecGold Milk Patterns

二分答案$ans$，每次将$hei$分成LCP不大于$ans$的许多组，判定是否存在个数大于$k$的组。

### POJ3294 Life Forms

题意：求至少在一半的字符串中出现的所有最长子串并输出。

和多字符串与LCP有关的题目往往需要把所有字符串接起来，中间用不同且未出现过的分隔符隔开。然后就比较套路了：二分长度$ans$，每次将$hei$分成LCP不大于$ans$的许多组，判定是否存在DNA来源数至少有一半的组。这个只需要用一个时间戳记录当前所在组编号和各DNA串最近一次出现的时间戳，这样就能动态维护当前有几个来源不同的DNA串了，顺便记录输出的位置。

### POJ3415 Common Substrings

题意：给出$A,B$串和限制$lim$，求满足$A_{i,i+k-1}=B_{j,j+k-1}$的方案数的三元组$(i,j,k)\ (k\geq lim)$的数量。

好题，但是写起来一点也不优美（我写得太丑了）。不难看出一对LCP不小于$lim$的位置$i,j$的贡献是$LCP_{i,j}-lim+1$，然而我们没办法枚举全部的$i$和$j$，这种时候一般可以维护每次向后移动，前面的字符对答案的贡献。

由于$hei$的单调性，在扫$sa$序列的过程中可以用个单调栈维护当前字符到前面所有非自己所在串（即当前字符是A串就保存B串）的LCP和个数，并维护当前总贡献数。每次向后移动时修改，每次是自己串就统计答案。要对两个串分别做一次，记得long long。

字符串题目中常常出现这种二维匹配计数，此时往往不能直接枚举计数。一般可以枚举$LCP_{i,j}$再统计对数，或者只枚举一个，另一个通过维护总贡献实现。这个想法在莫比乌斯反演的变换也有体现。

### AHOI2013 差异

可以分成两部分$\sum_{1\leq i<j\leq n} len_i+len_j$和$\sum_{1\leq i<j\leq n} len_{LCP_{i,j}}$来求。

手推一下可以得到前半部分的答案是$\frac {(n-1)n(n+1)}2$，后半部分和上一题类似，维护一个$hei$的单调栈就可以动态计数了。

### JSOI2008 火星人

住口，你根本不是后缀数组！

## 后缀自动机

### TJOI2015 弦论

在SAM上统计后续状态数量，进行一次DFS即可。

### AHOI2013 差异

这个题用SAM做就很舒服了。

两个后缀的$\mathrm{LCP}(i,j)$为$i,j$代表的后缀在树上的$\mathrm{LCA}(i,j)$的$len$，故在$fail$树上标记一下原串中的后缀，并且对每个节点都统计一下子树中有多少对节点的$\mathrm{LCA}$为它即可。

### NOI2015 品酒大会

本质上是求$\mathrm{LCP}(i,j) = p$的数目，就和上一题一样了。

在统计每个节点的时候，顺便合并一下子树里的最大次大、最小次小值（有可能负负得正）。

## 回文自动机

### APIO2014 回文串

PAM模板题。

# 总结

字符串算法固然重要，但是理解更为重要（除了后缀数组）。搞清楚fail数组的性质会对一些题目有所帮助，尤其是Trie树上的fail可以是某种动态规划的转移来源。

- 沿着KMP的失配边走可以得到字符递增的循环节，因此可以求周期。

- 当单词数不多时，如果有需要可以构造矩阵进行转移。

- 通常和后缀数组有关的题目出现多字符串，需要将其连在一起并用不同且没出现过的字符隔开。

- 字符串题目中常常出现这种二维匹配计数，此时往往不能直接枚举计数。一般可以枚举$LCP_{i,j}$再统计对数，或者只枚举一个，另一个通过维护总贡献实现。这个想法在莫比乌斯反演的变换也有体现。
