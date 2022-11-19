# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

0.可以按照 hardhat 官网初始化 https://hardhat.org/tutorial/setting-up-the-environment

1. yarn = npm ,但是 yarn 也= npx 所以 npx hardhat 可以用 yarn hardhat
2. 运行脚本 并且显示的设置网络 yarn hardhat run scripts/deploy.js --network hardhat ,运行默认网络 hardhat 不需要提供 rpc provider 和私钥 ，框架自带
3. 运行其他网络需要 配置一下 yarn hardhat run scripts/deploy.js --network goerli ，详情见 hardhat.config.js

4. 我们在 etherscan 上验证代码需要手动上传，但用了 hardhat 我们可以自动的来做。
   4.1 我们先在 hardhat 的插件库里找到 https://hardhat.org/hardhat-runner/docs/advanced/building-plugins etherscan
   4.1.1 然后去 etherscan 注册，并获得 APIKEY
   4.2 运行 yarn add @nomiclabs/hardhat-etherscan ，配置一系列的东西 API key 等等，然后就可以了 yarn hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
   4.3 也可以手动写 ，见代码

5.手动写一个 hardhat task ，https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts 
5.1见 task/blocknumber.js

6.与默认的hardhat进行交互我们是看不见的，那么如何看见呢就像ganache一样？ 手动yarn hardhat node 在本地运行一个区块链网络，"Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"
6.1 注意这个网络和你正常运行脚本所用的默认网络有区别 ，正常运行的默认网络，每次运行命令都会重置所有信息，但是你手动运行的这个localhost是实实在在的 你不关掉就不会重新运行的，所以你需要配置一下，就像你如何配置goerli网络一样。
6.2 见hardhat。config。js新增的localhost部分 ，然后新开一个控制台运行yarn hardhat  run scripts/deploy.js --network localhost ，在原来的服务器上就能看到了相关信息了，

7.yarn hardhat console --network goerli/localhost 可以直接打开控制台与相应的provider进行连接
7.1  await ethers.provider.getBlockNumber() ,你可以在console做类似脚本里写的内容，实时交互

8 测试 yarn hardhat test
8.1 yarn hardhat test --grep store 通过grep 来只运行有store单词的测试项 
8.2 或者加入 it.only() 来之运行一个

9. 判断gas使用费用 使用hardhat-gas-reporter ,去 npm上搜索然后使用。最后 yarn hardhat test 会输出一个表格显示gas费用

10.判断你的测试是否覆盖全面 ，去npm上搜solidity-coverage ,导入相应的包，最后使用 yarn hardhat coverage，会输出一个表格告诉你，测试的覆盖率（它会帮你跑一遍你的test

