const { network } = require("hardhat")
const {
  developmentChains,
  INITIAL_SUPPLY,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const GLDToken = await deploy("GLDToken", {
    from: deployer,
    args: [INITIAL_SUPPLY],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log(`ourToken deployed at ${GLDToken.address}`)
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_KEY) {
    await verify(
      GLDToken.address,
      [INITIAL_SUPPLY],
      "contracts/OurToken.sol:GLDToken" //这一步是试错之后的出来了
    )
  }
}

module.exports.tags = ["all", "token"]
