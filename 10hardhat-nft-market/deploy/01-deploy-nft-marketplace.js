const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const args = []
    await deploy("NftMarketplace", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: waitBlockConfirmations,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_KEY) {
        log("Verifying...")
        await verify(nftMarketplace.address, args)
    }
    log("----------------------------------------------------")
}
module.exports.tags = ["all", "nftmarketplace"]
