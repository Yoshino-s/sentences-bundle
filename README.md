# 句子包

Yoshino-s 自行搭建的hitokoto的语料库

## 如何快速添加语料

首先fork这个repo，然后clone到本地，确保你的环境中必须有nodejs

然后运行如下命令

```bash
npm install
# or 
# yarn
```

然后运行，按照提示输入。（只有hitokoto是必须的 (这种方法不是很推荐，因为可能会有id冲突

```bash
npm run add:sentence
# or
# yarn run add:sentence
```

或者按照`data/data.example.json`在`data/data.json`中写入数据，直接交pr

添加完后提交，并发pr，我看到了就会合并。

其他功能之后会添加滴。（咕咕咕
