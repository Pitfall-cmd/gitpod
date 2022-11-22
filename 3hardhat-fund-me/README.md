# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

1.在特定的版本里面 使用高级 advanced projects;yarn add --dev hardhat@2.9.3

2. solhint 用来判断 solidity 代码是否有错误 和 eslint 判断 js 代码是否有错误
   2.1 yarn solhint contracts/\*.sol 来执行文件判断

3.存在一些 npm 包被 solidity 文件所引用，编译的时候报错 需要我们手动去下载 yarn add --dev @chainlink/contracts

4.编译完之后就要部署，就像之前那样手写完这么多内容很麻烦，于是下载一个包 yarn add --dev hardhat-deploy https://www.npmjs.com/package/hardhat-deploy  
4.1 然后再 hardhat.config。js 文件上加上 require('hardhat-deploy')
4.2 此时运行 yarn hardhat 我们会发现多了一堆 task ，其中最重要的就是 deploy 这个 task，我们把原先的 deploy.js 删掉
4.3 创建一个 delpoy 的文件夹，(调用 deploy 的时候会自动找这个文件夹下面的 js)
4.4 我们还要安装一下 package 根据刚刚的网址上的步骤 yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
4.5 然后在 deploy 文件夹下面写脚本，注意要 module.exports.default 导出

5.创建一个 helper-hardhat-config.js 确保对应不同的链 chainId,使用不同的参数作为构造函数的输入（此处是一个合约地址用于初始化 6.创建 contrat/test/Mockv3Aggrator.sol 文件用于 mock，由于不想自己写，就在文件内 import 已经存在的。
7.mock 的编译器版本不同 ，需要配置一下 https://hardhat.org/hardhat-runner/docs/config#solidity-configuration

8.然后我们写 00-delpoy-mock 的脚本，用于部署我们的 mock 合约 9.最后 yarn hardhat deploy 来自动判断网络来部署,由于 hardhat-deploy 这个包 delpoy 的时候是按照文件名的顺序执行的，所以 mock 的文件最好编号 00 开始。

10. yarn hardhat node 时，由于 hardhat-deploy 的存在，会自动帮我们把文件部署到新开的网络上去。

11.这里有个问题，我做好verify的各项操作之后，出错Error in plugin @nomiclabs/hardhat-etherscan: The contract verification failed. Reason: Fail - Unable to verify 暂且没有解决

12.breakpoint 打好之后，在VSCODE里面选座左边数下来第四个Run and debuger（ctrl shit D），点击之后选择，JavaScrit debug terminal，就会弹出一个新的terminal，在这里面运行程序遇到断点可以调试,然后你可以选择看左边，也可以选择在DEBUG CONSOLE里面输入你想看的变量

13.获得gas，gasPrice，获得账户的余额，通过合约获得提供商provider，发送以太币，bigNumber的add mul的方法，希望处理revert等都可以在FundMe.test.js里面看到

14.在solidity中使用console.log（），导入import "hardhat/console.sol"; 然后就可以用了https://hardhat.org/tutorial/debugging-with-hardhat-network

15.使用新的账户来连接合约 contract.connect(signer)

16.查看 evm opcode的gas 消耗 https://github.com/crytic/evm-opcodes
