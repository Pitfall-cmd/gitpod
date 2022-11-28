const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//https://www.npmjs.com/package/hardhat-deploy?activeTab=readme
//hardhat deploy的详情可见上面
//部署mock的用于初始化的参数
const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

module.exports = async function ({ getNamedAccounts, deployments, getChainId }) {
    const { deploy, log } = deployments
    const { deployer, player } = await getNamedAccounts()
    const chainId = await getChainId() //只希望mock部署在本地的网络上
    //const chainId= network.config.chainId
    //如果在本地的网络上
    if (developmentChains.includes(network.name)) {
        log("Local network detected!Deploying mocks..")
        //部署mock合约
        const raffle = await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true,
        })
        log("Mocks Deployed!")
        log("----------------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
