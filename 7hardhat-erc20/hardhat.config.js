/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
// require("hardhat-contract-sizer")
require("dotenv").config()
const GOERLI_URL = process.env.GOERLI_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY
const COINMARKET_KEY = process.env.COINMARKET_KEY
module.exports = {
  defaultNetword: "hardhat",
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 3, //通过network.config.blockConfirmations可以调用到
    },
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // 这里默认将第一个账户作为部署者
    },
    player: {
      default: 1, // 这里默认将第二个帐户作为 （所以在测试中这将是一个与部署者不同的账户）
    },
  },
  gasReporter: {
    //是否开启
    enabled: false,
    //用什么货币形式
    currency: "USD",
    //gas转成货币所调用的数据的coinmarket的api
    coinmarketcap: COINMARKET_KEY,
    //你可以选择你想部署的网络 ，详情见npm上该包的官网，你还可以选择如 ploygon的MATIC,然后会显示相应的费用
    token: "ETH", //token:"MATIC"
  },
  mocha: {
    timeout: 200000, //200second 取决于测试网的速度，如果很慢你就要提升
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_KEY,
    },
  },
}
