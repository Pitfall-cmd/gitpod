// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
//6 用 hardhat run 包来调用 task ,network包来查看当前部署的网络信息
const { ethers, run, network } = require("hardhat")

async function main() {
  //1 hadrhat.config.js默认使用原始网络 hardhat network，所以你不需要连接RPC-provider也不需要输入你的Private key去构建钱包
  //1.1 你可以在hardhat.config.js 里面配置你的networks 和 accounts ，显示运行的时候 也不需要在这里输入你的私钥和provider ，除非你想自己调用，否则默认是你的accounts去部署
  //2 不需要去手动输入abi和binary文件，因为导入的是hardhat包装过的ethers，会自动去你的artifact下面找
  //3 构建合约仓库 然后部署
  const cf = await ethers.getContractFactory("SimpleStorage")
  console.log("deploying contract ...")
  const ss = await cf.deploy()
  await ss.deployed()
  console.log(`deployed contract address: ${ss.address}`)

  //8 what happens when we deploy to our hardhat network?
  //8 判断通过chainId判断网络 是在测试网上就上传 源码，否则不上传
  if (network.config.chainId === 5 && process.env.ETHERSCAN_KEY) {
    console.log("Waiting for block confirmations...")
    //9 ethscan 可能没那么快就能查到你的交易，所以等6个区块之后在用verify来验证
    await ss.deployTransaction.wait(6)
    await verify(ss.address, [])
  }
  const currentvalue = await ss.retrieve()
  console.log(`currentvalue is ${currentvalue}`)

  const transactionResponse = await ss.store(7)
  await transactionResponse.wait(1)
  const updatevalue = await ss.retrieve()
  console.log(`currentvalue is ${updatevalue}`)
}
//5 手写去用 hardhat run 包来调用 task （task指的是 hardhat提供的compile等 详情见 yarn hardhat）
// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    //7 调用verify 任务，传入相关的构造函数的参数，可以在插件的介绍里看到 https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
