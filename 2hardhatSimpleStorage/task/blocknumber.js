const { task } = require("hardhat/config")
//编写任务的脚本 ，由于hardhat runtime environment 的存在，task ，ethers这些直接可以使用不需要导入的
task("block-number", "get current blocknumber").setAction(async (taskArgs) => {
  const blocknumber = await ethers.provider.getBlockNumber()
  console.log("current blocknumber is ", blocknumber)
})
//这个不能少，否则配置文件无法自动使用上述的函数
module.exports = {}
