const { network, ethers } = require("hardhat")
//https://www.npmjs.com/package/hardhat-deploy?activeTab=readme
//hardhat deploy的详情可见上面
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const FUND_AMOUNT = ethers.utils.parseEther("1") // 1 Ether, or 1e18 (10^18) Wei
module.exports = async function ({ getNamedAccounts, deployments, getChainId }) {
    const { deploy, log } = deployments
    const { deployer, player } = await getNamedAccounts()
    const chainId = await getChainId()
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
    //如果部署在本地网络上，就要获得刚刚部署的合约的地址
    if (developmentChains.includes(network.name)) {
        // vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock") //使用这个能调用合约的函数，上面的则不行
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        log(`Mock VRFV2 address ${vrfCoordinatorV2Address}`)
        //在本地网络上获得subscriptionId，实际上就是调用了 一个函数，然后通过event获得Id
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId //获得event的方式
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        //如果部署到其他的网络
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    const arguments = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["keepersUpdateInterval"],
        networkConfig[chainId]["raffleEntranceFee"],
        networkConfig[chainId]["callbackGasLimit"],
    ]
    const raffle = await deploy("Raffle", {
        from: deployer,
        gasLimit: 4000000,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    // 把刚部署的raffle合约加入消费者,如果在本地网络的画，测试网要去网站添加
    if (developmentChains.includes(network.name)) {
        // const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address)
    }
    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_KEY) {
        log("Verifying...")
        await verify(raffle.address, arguments)
    }
}
module.exports.tags = ["all", "raffle"]
