This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

1.  yarn create next-app . 创建一个nextjs项目,然后 yarn dev 或者 yarn run dev
2. 回顾一下react ,export 组件，如何使用组件
3. 使用raect-moralis一个包更快速开发web3项目,最主要的就是与metamask的交互还有智能合约的交互  https://www.npmjs.com/package/react-moralis
4. 在package.js里面 有dependencies 和devdependencies，前者是项目真正需要的，后者是一个辅助开发的，比如prettier这种 可以在add的时候添加--dev
5. 设计好看的web3Ui ，使用 yarn add web3uikit ， https://github.com/web3ui/web3uikit
5.1 web3Uikit 的connectButton有了基本上所有的方法，如mannualHeader里面所写！！！
6. 获得abi ，可以通过 合约.interface.format(ethers.utils.FormatTypes.json) 获得string类型 ，https://docs.ethers.io/v5/api/utils/abi/interface/
7.然后用 moralis获取智能合约 交互，合约调用注意使用 await
8.然后是 web3UIkit 的通知组件，需要先在app那个js文件加入要给provider
9.moralis的合约调用 可以写入一些触发函数 如 onSuccess等操作，详细见js文件的按钮那部分，但是onSuccess只是确保发给metamask是成功的，不能确保是否上了区块，所以我们要等待区块完成。手动写wait

10. 美化使用tailwindCss https://tailwindcss.com/docs/guides/nextjs  ,按照步骤一步一步来 
10.1 其中第四步 粘贴@tailwind base; @tailwind components; @tailwind utilities; 这个的时候，vscode回出黄线，提示你unknown rule ，你去插件市场下载 PostCSS Language Support
10.2 然后你就可以通过一些列的className来修改，你只需要去tailwindCss上搜索你想要的效果 比如border ,记得下载tailwind的插件在vscode上面

11. 部署你的代码到IPFS上面，IPFS不是所有节点都拷贝一份，是节点选择性的拷贝copy，当查找一个IPFS文件的时候，会互相去问IPFS节点直到找到该文件。如果此时有节点觉得你的文件很不错，他也会复制一份，所以这个IPFS只是偏向与去中心化，但是还是有中心化的感觉，比如只有你一个节点拥有
12.IPFS companion是当你浏览器输入ipfs://xxx的时候自动启动到你的ipfs节点的本地网关localhost:8080来查询，如果你本身没有ipfs节点，那么输入https://ipfs.io/ipfs/xxx到公共的网关去
查询，Pinta也作为一个公共的网关，也作为一个很大IPFS节点，允许你存储数据，查找的更快，本地自己的节点上传一个IPFS，别的节点不一定看得到，如果你的IPFS关掉别人也找不到。

13.yarn build 生成静态文件，因为ipfs不能运行动态的有server内容的东西
然后 yarn next export 导出一个out文件夹，这里面是纯静态的文件，我们可以用到IPFS里面。

14.另外一种简单的办法就是使用fleek.co，来帮助我们部署到IPFS上，它会自动帮我们实现上述的步骤
我们登录，通过github登录，选add new site，选择你的仓库，选择Hosting Service为IPFS，然后命令那里注意cd 6nextjs-lottery-full-stack &&yarn install && yarn  build && yarn next export