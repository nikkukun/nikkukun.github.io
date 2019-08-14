---
title: 平衡树总结
date: 2017-04-14 00:00:00
comment: true
mathjax: true
tags:
- Treap
categories:
- 算法总结
---

二叉搜索树（Binary Search Tree）是一种二叉树数据结构，其维护了一个支持快速检索的集合。 BST 有很多，如 Treap，Splay，红黑树，Size-Balanced Tree，但是此处我们只讨论 Treap。

<!---more--->

# Treap

Treap的节点具有一个$val$值和$key$值，$val$值维护这个集合，$key$值维护了Treap的平衡。光看$val$值，Treap的中序遍历构成一个**递增序列**；光看$key$值，Treap是一个**堆**（方便起见，我们默认为**小根堆**）。其通过旋转来维护形态，影响其形态的因素之一是$key$。因此$key$一般用随机值，可以证明这样的Treap期望高度为$\mathrm{O}( \log n )$。

## 基本操作

Treap支持5种基本操作：

- 插入$\mathrm{O}( \log n )$
- 删除$\mathrm{O}( \log n )$
- 询问某数排名$\mathrm{O}( \log n )$
- 询问排名为k的数$\mathrm{O}( \log n )$
- 查找某数及其前驱后继$\mathrm{O}( \log n )$

为了方便基本操作，我们定义Treap节点如下：

```c++
struct Node{
		int v,r,s,n;
		Node *ch[2];

	Node(int _v,int _r=rand()){
		v=_v;r=_r;n=1;
		ch[0]=ch[1]=NULL;
	}

	inline int Cmp(int x){
		if(x==v)return -1;
		else return x>v;
	}

	inline int Size(){
		return this==NULL?0:s;
	}

	inline void Maintain(){
		s=n+ch[0]->Size()+ch[1]->Size();
	}
};
```

定义 Treap 如下：

```c++
Treap{
	Node *rt=NULL;
};
```

### 旋转

画个图就不难想象这个过程。o 节点**必须用引用而不是指针**，因为最后的过程需要把 o 指向 t 所在节点，而非单纯复制t节点的信息。

```c++
void Rotate(Node *&o,int d){
	Node *t=o->ch[d^1];
	o->ch[d^1]=t->ch[d];
	t->ch[d]=o;
	o->Maintain();t->Maintain();
	o=t;
}
```

### 插入

根据 Treap 的中序遍历性质，递归节点找到对应位置插入即可。新节点可能会破坏 Treap 的堆性质，因此**需要旋转**。如果该节点已被创建，则增加数量。注意**需要维护**！

```c++
void Insert(Node *&o,int v){
	if(o==NULL)o=new Node(v);
	else{
		int d=o->Cmp(v);
		if(d==-1)(o->n)++;
		else{
			Insert(o->ch[d],v);
			if(o->ch[d]->r < o->r)Rotate(o,d^1);
		}
	}
	o->Maintain();
}
```

### 删除

根据 Treap 的中序遍历性质，递归节点找到对应位置删除即可。同样为了维护堆性质，如果删除之后会破坏，则**把要删除的节点旋转到儿子节点**（此时两个儿子较小的一个被旋转到当前位置）再递归删除即可。如果非空则**需要维护**。

```c++
void Delete(Node *&o,int v){
	int d=o->Cmp(v);
	if(d==-1){
		if(o->n>1)(o->n)--;
		else{
			if(o->ch[0]==NULL)o=o->ch[1];
			else if(o->ch[1]==NULL)o=o->ch[0];
			else{
				int d2=o->ch[0]->r < o->ch[1]->r;
				Rotate(o,d2);
				Delete(o->ch[d2],v);
			}
		}
	}else Delete(o->ch[d],v);
	if(o!=NULL)o->Maintain();
}
```

### 询问某数排名

根据中序遍历性质，这是一个很容易思考的递归过程。

```c++
int Rank(Node *o,int v){
	if(o==NULL)return 0;
	int d=o->Cmp(v),l=o->ch[1]->Size();
	if(d==0)return Rank(o->ch[0],v);
	else if(d==-1)return l;
	else return l+o->n+Rank(o->ch[1],v);
}
```

注意上面的代码返回值是**小于某数的个数**而非该数的排名，这是为了方便查找不存在于集合的数。如果要变成集合中的数**需要对排名$+ 1$**。

### 询问排名为k的数

同样是递归过程。

```c++
int Kth(Node *o,int k){
	if(k>o->s)return -1;
	int l=o->ch[0]->Size(),n=o->n;
	if(k<=l)return Kth(o->ch[0],k);
	else if(k<=l+n)return o->v;
	else return Kth(o->ch[1],k-l-n);
}
```

### 查找

不难实现。$d = 0 $时寻找前驱，否则寻找后继。注意写的时候要特别注意寻找**前驱**时是向**大数**移动更新，寻找**后继**的时候是向**小数**移动更新。

```c++
int Find(int v,int d){
	Node *o=rt;
	int ret=d?INF:-INF;
	while(o!=NULL)
		if(d?v<o->v:v>o->v)ret=o->v,o=o->ch[d^1];
		else o=o->ch[d];
	return ret;
}
```

## 扩展操作

- 启发式合并两棵 Treap$\mathrm{O}( n  \log ( m / n ) )$

所谓启发式合并，就是把较小的 Treap 节点一个个暴力拆掉插入到较大的 Treap 中。如果较小的有$n$个节点，较大的有$m$个节点，则可以证明时间复杂度为$\mathrm{O}( n \log ( m / n ) )$。如果是相对有序，则可以用**非旋转式 Treap **维护。相对有序是指较小 Treap 的最大值小于较大 Treap 的最小值，这样只需要首尾相接。

# 非旋转式 Treap

非旋转 Treap 拥有 Treap 的中序遍历相对有序特性与堆特性，但是**不能旋转**。由于非旋转式 Treap 不需要旋转，因此**能较好地维护节点的父子关系**，也可以做到**可持久化**。

## 基本操作

- 建树$\mathrm{O}( n )$
- 合并$\mathrm{O}( \log n )$
- 分裂$\mathrm{O}( \log n )$

虽然基本操作少，但是一起用却可以做很多事情。

### 构建

Treap 与笛卡尔树是一样的，因此我们可以以笛卡尔树的线性建树方法建 Treap。

考虑一个已经**相对有序**的序列（可以是一个**递增/递减数列**，也可以是一段**固定的字符串**，Treap的中序遍历维护的正是这些），对于节点$i ( val , key ) $，有：

1. 倒序寻找第一个$j < i$使得$key_j < key_i$
2. 将$i$的左子树设为$j$，将$j - 1$的右子树设为$i$

这可以用栈维护。每个节点只会进出栈一次，因此时间复杂度是线性的。可以这么考虑：栈维护了当前的树的最右链，我们正打算插入节点$i$。但是插入节点$i$之后可能会破坏堆性质，需要手动$key$值大于$i$的$key$值的树挂在$i$的左子树来维持小根堆形态，同时又不破坏中序遍历。最后需要把摘下来的子树的父亲节点重设右子树为$i$。实际中为了方便，会添加一个 **$val$和$key$都为$\infty$的虚拟节点**来方便建树。

注意每个节点在出栈之后都不会再被修改儿子，因此我们**需要在出栈之后维护该节点**。

```c++
void Build(int n){
		stack<Node*> s;
		rt=new Node(-INF,-INF);
		s.push(rt);

		for(int i=1;i<=n;i++){
			Node *o=new Node(i);
			while(s.top()->r > o->r){
				o->ch[0]=s.top();
				s.top()->Maintain();
				s.pop();
			}
			s.top()->ch[1]=o;
			s.push(o);
		}
		while(!s.empty()){
			s.top()->Maintain();
			s.pop();
		}
		rt=rt->ch[1];
	}
```

### 合并

类似于斜堆，非旋转式 Treap 的合并是一个递归过程。合并的时候需要保证两个 Treap 已经相对有序，只需要中序遍历首尾相接。但是由于不可旋转，因此它不能像斜堆合并一样转来转去，需要特判。流程如下：

1. 两棵树有一棵为空，则当前新根为另一棵非空子树
2. 否则如果$val _a < val _b$，合并$a$的右子树和$b$，并作为$a$的新右子树，当前新根为$a$
3. 否则合并$a$和$b$的左子树，并作为$b$的新左子树，当前新根为$b$

注意合并的顺序。如步骤2不能把$b$的左子树与$a$合并，这样没有保证合并的两个 Treap 是有序的。**合并的过程仍要保持相对有序**。同时修改了儿子的节点**需要维护**。


```c++
Node* Merge(Node *a,Node *b){
	if(a==NULL)return b;
	if(b==NULL)return a;
	if(a->r < b->r){
		a->ch[1]=Merge(a->ch[1],b);
		a->Maintain();
		return a;
	}else{
		b->ch[0]=Merge(a,b->ch[0]);
		b->Maintain();
		return b;
	}
}
```

### 分裂

分裂过程仍然是递归，需要返回两个分裂的节点。具体的过程可以画图模拟加深理解。分裂过程让我们把一个区间分成两个，实现了对**序列中特定区间**的操作，则像是**区间翻转**之类的操作也可以实现了。算法步骤如下：

1. 如果该节点为空节点则返回一对空节点
2. 否则如果分裂的位置在左子树，递归分裂左子树，并将当前根节点左儿子设为分裂的第二个节点，返回这对节点
3. 否则递归分裂右子树，并将当前根节点右儿子设为分裂的第一个节点，返回这对节点

修改了儿子节点的节点**需要维护**。


```c++
pNode Split(Node *o,int k){
	pNode ret(NULL,NULL);
	if(o==NULL)return ret;

	int l=o->ch[0]->Size();
	if(k<=l){
		ret=Split(o->ch[0],k);
		o->ch[0]=ret.second;
		o->Maintain();
		ret.second=o;
	}else{
		ret=Split(o->ch[1],k-l-1);
		o->ch[1]=ret.first;
		o->Maintain();
		ret.first=o;
	}
	return ret;
}
```

## 扩展操作

- 插入 (` Split `+`Merge` )
- 删除 ( `Split` +` Split` +` Merge `)
- 查询节点 / 区间 ( `Split `+` Split `+ `Merge` )
- 查询第k大 ( `Split` +` Split `+` Merge `)
- 区间标记 ( `Split `+` Split `+` Lazy` +` Merge `)
- ……

所有的操作都可以把操作区间拆除来再做。不过我们重点考虑区间标记这个操作。

我们把 Treap 当成一个二叉搜索树，却忘记它也是一棵树，也可以进行树的操作。联想一下同为二叉树的线段树，我们也可以把 Treap 当线段树使用。不过更多的，Treap 用来维护与**区间翻转**有关的序列更多，因为线段树不支持这样的操作。另外，查询区间和、查询最大值这些信息只需要存在节点并一同维护即可，必要的时候可以用 Lazy 标记并` Pushdown`。

# 可持久化Treap

来自非旋转 Treap。其` Merge `与` Split `都是**自上而下的递归操作**，并且**父子关系不会中途改变**，因此我们可以实现可持久化。每次 Split 与 Merge 的时候，都对该节点复制一个新节点，则对这些新节点的操作不影响历史节点。

这里有一个空间优化。对于一般的先 `Split `后 `Merge `操作，`Merge` 影响到的节点是` Split `创建的新节点与将要合并的新节点。这两个节点有个特征，就是它们不会影响其历史版本，因此我们**可以直接在Merge过程覆盖掉它们**，而不需要再为新节点创造新节点。

我认为是，`Split `创造的新节点是分裂处的节点，而分裂处一定是中序遍历一段连续的位置，`Merge `操作是对结尾一段连续的位置进行修改，因此` Merge `操作的节点是` Split `新开的节点。（但是这个说法我也不能说服我自己。）

虽然不算难构造，但还是放上代码参考。对于新建的节点的时机，我的做法是决定了要处理的节点后，**立刻对其进行复制**并处理新节点，而不是等到下一层递归。这样会容易考虑和维护。

```c++
Node* Merge(Node *a,Node *b){
	if(a==NULL)return new Node(b);
	if(b==NULL)return new Node(a);
	Node *t=new Node();
	if(a->r < b->r){
		*t=*a;
		t->ch[1]=Merge(t->ch[1],b);
	}else{
		*t=*b;
		t->ch[0]=Merge(a,t->ch[0]);
	}
	t->Maintain();
	return t;
}

pNode Split(Node *o,int k){
	pNode ret(NULL,NULL);
	if(o==NULL)return ret;

	int l=o->ch[0]->Size();
	Node *t=new Node();*t=*o;
	if(k<=l){
		ret=Split(t->ch[0],k);
		t->ch[0]=ret.second;
		t->Maintain();
		ret.second=t;
	}else{
		ret=Split(t->ch[1],k-l-1);
		t->ch[1]=ret.first;
		t->Maintain();
		ret.first=t;
	}
	return ret;
}
```

# 练习

## 基础

### BZOJ3224 普通平衡树

基础平衡树操作。

### NOI2004 郁闷的出纳员

基础平衡树操作。注意一开始没有加入的员工是不计算在内的。

### HNOI2002 营业额统计

平衡树维护前驱后继。

### HNOI2004 宠物收养所

同一时刻收养所只有人和宠物表示要么人等宠物，要么宠物等人。标记表示现在收养所里是宠物还是人，维护平衡树即可。

## 进阶

### SDOI2008 郁闷的小J

一个比较直观的在线做法是线段树套平衡树，每个节点放一棵平衡树，区间统计出现次数。当然也有树状数组的离线做法，按照查询书的种类排序后按类处理。如果数据小可以莫队。

### ZJOI2007 报表统计

`MIN_GAP`就是维护相邻元素差绝对值的最小值，用一个小根堆维护值即可。注意如果添加了新元素，则与前一个元素相关的差值要删除，并添加两对新差值。`MIN_SORT_GAP`平衡树维护前驱后继。

### HNOI2012 永无乡

Treap 的启发式合并，并查集维护。

### BZOJ3223  文艺平衡树

Splay当然可以，不过非旋转式Treap也可以。

### BZOJ3196  二逼平衡树

线段树套平衡树。Kth 查询需要二分判定答案，再判定 Rank 是否满足。

### NOI2003 文本编辑器

需要区间操作的 Splay 或非旋转式 Treap。注意一次插入的文本可能会很大。

### AHOI2006 文本编辑器

同*NOI2003 文本编辑器*，但增加了` Rotate `操作。

### BSOJ4531 可持久化平衡树

就是可持久化平衡树。

## 较难

### NOI2005 维护数列

需要很多线段树的操作。注意细节。（但我还没写Orz）

# 总结

- Treap 可以维护**集合内部的排名**，但是非相对有序时**不能高效合并**。
- 非旋转 Treap 能在相对有序时**高效合并与分裂**，可以**提取区间**单独操作。
- 非旋转 Treap 每一个子树的中序遍历**维护一个相对有序的序列**，可以实现**区间旋转**，也可以像线段树一样**维护一段序列的信息**。
- 非旋转 Treap 父子形态稳定而不需要旋转，且操作自上而下，可以实现**可持久化**。
- 多区间查询 Kth 时，通常采用**二分答案**判定 Rank。
