//第一种方式
// function deployFunc (){
//     console.log("hi")
// }
// module.exports=deployFunc

//第二种方式
// module.exports= async()=>{
//    console.log("hi")
// }

//第三种针对 一个object类型 hardhat runtime env
// module.exports=async(hre)=>{
//     //提取这个object的特定字段
//     const {getNamedAccoutns, deployments} =hre
//     //等于上面的
//     hre.getNamedAccoutns
//     hre.deployments
// }
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const chainId = network.config.chainId
// const chainId= ethers.provider.getNetwork().chainId 一样的
// if chainId is X use address B  if chainId is Y use address A
const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
//第四种 js也允许的方式作为参数直接提取object
module.exports = async ({ getNamedAccoutns, deployments }) => {
    const { deploy, log } = deployments
    //下面这个是获得hardhat.config.js中的nameAccounts中的deployer字段
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        //如果部署的是本地网络
        //则调用刚刚部署的Mock的合约，js顺序是按照你的文件名顺序执行的
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //构造函数的参数
        log: true,
    })
    log(`FundMe deployed at ${fundMe.address}`)
}

//这个是当你 yarn hardhat deploy --tags mocks 时 只运行带有fundme tag的脚本，这个是tags包括all和fundme
module.exports.tags = ["all", "fundme"]
