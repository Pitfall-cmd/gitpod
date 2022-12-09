1. Home Page:
    1.展示listed的NFT
        1.如果你拥有NFT 你可以更新这个NFT
        2.如果不是 你可以买这个NFT
2. Sell Page：
    1.你可以出售list你的nft


1. yarn add web3uikit moralis react-moralis react react-dom moralis-v1  //直接用web3uikit来做connectbuton
2.为了使用 web3uikit 需要先使用 MoralisProvider (待定？是为了用moralis组件吧) https://github.com/MoralisWeb3/react-moralis
3.<nav> 里面页面的跳转 在nextjs的框架下面可以用 next的link  https://nextjs.org/docs/api-reference/next/link
4. 使用tailwindcss来做 美化 ，搜索 taliwindcss with nextjs ，然后按步骤来添加和 init
5.一直提示  Command failed with exit code 137. 当你写完 header的时候 ，搜了一下是内存耗尽在容器中
6.//如何检测到你的listed上去的nft？第一种是修改合约 再写一个array 来遍历获得，但是这耗费更多的gas 不可取
// 第二种就是 通过event来检测
//我们会监听这些event，然后把这些event存到数据库里面，当需要的时候在读取
//这里有两种第一种是Moralis 提供中心化的数据库，还有一种是theGraph提供去中心化的

7.nextjs前端框架获得env的方法，直接调用就行了 https://nextjs.org/docs/basic-features/environment-variables

8.连接到Moralis的服务器之后（现在已经不行了
    1.让服务器连接到我们指定的区块链
    2.告诉服务器是哪个合约，哪个evnet，然后监听到怎么做

9.展示uri 
```js
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
```
10. 然后使用nextjs 框架提供的image 来获得图像，用了loader之后就不是静态的了，会用的远程的服务器，此外，Moralis这节部分也用了 服务器，所以不能编译部署成静态文件
```html
                                  <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
```
11. 然后使用web3uikit中的 Card标签来美化

12.使用the graph来index event  ，the graph文档https://thegraph.com/docs/en/ ，the graph需要使用一个单独的文件夹作为仓库
    1.创建好之后 按照文档来 sudo yarn global add @graphprotocol/graph-cli          graph init --studio nft-marketplace
    2.然后会生成一些列文件，由于我们已经verify在etherscan上面，所以graph帮我们生产了abi，否走要手动去添加到abis里面，具体的各个文件的意思与内容见视频 https://youtu.be/gyMwXuJrbJQ
    3.然后下载插件来写graphQL   ,什么是graphQL https://graphql.org/  也是一种查询的语句吧具体还不是很懂
    4.先写schema.graphql里面的内容，写entity，相当于我们要查询的表，里面已经有部分内容根据etherscan上面的内容创建。 这个文件就是告诉thegraph去监听这些events
    5.然后修改有关graphql的内容之后 运行 graph  codegen 去生成generated里面的文件
    6.然后写src下面的文件，这个文件就是告诉thegraph监听到events之后如何存储，如何做映射
    7.你可以在subgraph.yaml里面看到event触发之后调用什么函数
    8.在subgraph。yaml的 dataSources:下面的source下面加一个字段叫做：startBlock，表示开始索引index event的开始区块，否则就会从区块0头到尾去监听所有event，会很慢
    9.然后就可一会thegraph里面的文档，继续按照步骤 graph auth --studio 50c9b80e4d41cb32ba9f874d458922a2 ；graph codegen && graph build  ；graph deploy --studio nft-marketplace
    10.上面auth是认证，相当于是你把你的本地这个graph的代码推送到网站上面的认证，然后第二步时本地build好，第三步是部署到网站上来监听. 此时当你触发event的时候在他的dashborad上的playground可以查询一下
    11.用graphql来来请求graph上的内容 需要 yarn add @apollo/client  ， yarn add graphql
    