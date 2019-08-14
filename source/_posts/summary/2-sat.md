---
title: 2-SAT总结
date: 2017-04-14 00:00:00
comment: true
mathjax: true
tags:
- 2-SAT
categories:
- 算法总结
---

2-SAT（2-satisfiability）即给定一些布尔变量的**或**关系，判断是否有满足所有关系的变量取值。SAT问题是NPC问题，2-SAT问题是P问题。

<!--more-->

###构造2-SAT

考虑一个条件$x\ \rm{or}\ y$，则$x=0 \Rightarrow y=1,y=0 \Rightarrow x=1$。这两个推导都是单向而唯一的，因此我们可以把一个变量拆成两个点，并根据上述推导关系连边。具体而言，有向边$(u,v)$的含义为：如果对$u$染色，则$v$也一定要被染色。

对这张关系图沿着边染色，则一组不同时染色一个变量的两种取值的图就是一个2-SAT解。下面给出DFS解2-SAT的代码，注意mark数组要开**两倍**。

```c++
struct TwoSat{
	vector<int> a[N];

	void AddClause(int x,bool valX,int y,bool valY){		//x==valX||y==valY
		x=x*2+valX,y=y*2+valY;
		a[x^1].push_back(y);
		a[y^1].push_back(x);
	}

	stack<int> s;bool mark[N];
	bool DFS(int u){
		if(mark[u^1])return 0;
		if(mark[u])return 1;
		s.push(u);mark[u]=1;
		for(int i=0;i<a[u].size();i++)
			if(!DFS(a[u][i]))return 0;
		return 1;
	}

	bool Solve(int n){
		memset(mark,0,sizeof(mark));
		for(int i=0;i<n;i++)
			if(!mark[i]&&!mark[i^1])
				if(!DFS(i)){
					while(s.top()!=i)mark[s.top()]=0,s.pop();
					mark[i]=0,s.pop();
					if(!DFS(i^1))return 0;
				}
		return 1;
	}
};
```

当一个变量两个取值都不能满足时，可以证明整个2-SAT问题无解，因此算法没有回溯，时间复杂度$\mathrm{O}(n)$。流程描述：

1. 添加约束条件并加边；
2. 对没有赋值的变量尝试赋为$0$：
	- 成功。继续考察没有赋值的变量；
	- 失败。**退栈**并**取消标记**，尝试赋为$1$：
		- 成功。继续考察没有赋值的变量；
		- 失败。该2-SAT问题无解。

注意到若$x=0 \Leftrightarrow x=1$，即一个变量的两个取值可以互相到达时无解，因此也可以通过Tarjan计算强联通分量$\mathrm{O}(n)$解决，但编程复杂度较高。

2-SAT少有独立出现，往往伴随着需要判定性的算法（如二分）。因此类似网络流，2-SAT的要点在于建图。

###变量关系的构建

假设函数`AddClause(valX,valY)`构造了$x=valX\ \mathrm{or}\ y=valY$的语句，则：

- $x=y$：`AddClause(0,1)`，`AddClause(1,0)`
- $x\not=y$：`AddClause(0,0)`，`AddClause(1,1)`
- $x=y=1$：`AddClause(0,1)`，`AddClause(1,0)`，`AddClause(1,1)`
- $x=y=0$：`AddClause(0,1)`，`AddClause(1,0)`，`AddClause(0,0)`

还是很好理解的。后面两句的最后一个约束保证了它们的取值。有的时候某些变量的取值已经给定，这个时候事先染色就好了。

###与二分图染色的区别

Refer from [Sengxian's Blog](https://blog.sengxian.com/algorithms/2-sat)。

二分图染色是双向推导，而2-SAT染色是单向推导。且二分图染色出现矛盾时会立刻跳出，而2-SAT会更换取值继续尝试。因此一般二分图染色不能解决2-SAT。

但有一种情况，是可以用二分图染色处理的，当且仅当**所有**条件是$x=k\ \mathrm{or }\ y=k$的形式。这个条件也可以写成$\mathrm{not}(x\not=k\ \mathrm{and}\ y\not=k)$，即$x\not=k$和$y\not=k$不能同时被选中，然后就可以在它们间连边进行二分图染色了。

##练习

###基础

####JSOI2010 满汉全席

裸的2-SAT。需要一个hash表或map。

####POJ3678 Katu Puzzle

根据要求对变量建图就好了。

####POJ3207 Ikki's Story IV - Panda's Trick

题意：给一个圆和一些点，并在点之间连线。保证一个点最多被连一次，问所有线是否可能不相交。

两条连线的端点$(a,b),(c,d)$如果有$(c-a)(b-c)(d-b)(a-d)<0$（即线段的端点各自在另一条线段分出的两个区间），则它们可能会相交。画个图发现当且仅当两条线的端点一内一外才不会相交。然后就可以建图了。

####POJ3905 Perfect Election

题意：给定一些民众期待的选举人（$2$名）通过局面，问是否存在一种通过局面使得结果满足所有民众的期待。

题目条件只有或，直接上2-SAT。

####POJ3683 Priest John's Busiest Day

题意：有一些新人要举行婚礼，每一对新人$i$的举行时间要么是$[st_i,st_i+d_i]$，要么是$[ed_i-d,ed_i]$。问能不能全部举行并给出方案。

不能一起举行的添加条件，接着跑2-SAT。

##进阶

####POJ2749 Building Roads

题意：有两个中转站，相互喜爱的牛的牛棚必须在同一个中转站，相互厌恶的牛的牛棚必须在不同中转站。最小化最远牛棚对距离。

二分答案，考察任意两对牛棚在两个中转站的$4$种情况是否在最大距离内并添加条件。对于有约束关系的牛棚也是如此。

####UVA1391 Astronaut

训练指南练习题。然而我还没写，可以参考[这里](https://blog.sengxian.com/algorithms/2-sat)。

####POJ3648 Wedding

题意：婚礼有$n$对新人要坐在一张长桌子上。同一对新人不能坐在同侧，有不可描述的关系（不限性别）的人不能同时坐在$0$号新娘对面。求坐在$0$号新娘一侧的人的一种可能性，或根本无解。

给每个人坐某一侧当作变量，新娘$0$所在侧为$0$，则同一对新人取值不等，有不可描述的人取值不能同时为$1$（至少有一个为$0$）。

####高级

<del>感觉2-SAT就没什么特别难的（暴言）</del>

##总结

2-SAT可以求解一类抽象成变量取值的判定性问题，因此可以与二分之类的算法结合着用。往往题目提到分配成两份或有两个选择，基本上就跑不开2-SAT了。

- 2-SAT的DFS算法没有回溯过程；

- 2-SAT的条件添加：
	- $x=y$：`AddClause(0,1)`，`AddClause(1,0)`
	- $x\not=y$：`AddClause(0,0)`，`AddClause(1,1)`
	- $x=y=1$：`AddClause(0,1)`，`AddClause(1,0)`，`AddClause(1,1)`
	- $x=y=0$：`AddClause(0,1)`，`AddClause(1,0)`，`AddClause(0,0)`

<del>好像真的没什么可以瞎扯的了</del>
