require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("hardhat-gas-reporter")
require("./task/blocknumber")
require('solidity-coverage')
const GOERLI_URL = process.env.GOERLI_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY
const COINMARKET_KEY = process.env.COINMARKET_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.8",
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts: 不需要 因为自带了~
      chainId: 31337,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_KEY,
  },
  gasReporter: {
    //是否开启
    enabled: true,
    //用什么货币形式
    currency: "USD",
    //gas转成货币所调用的数据的coinmarket的api
    coinmarketcap: COINMARKET_KEY,
    //你可以选择你想部署的网络 ，详情见npm上该包的官网，你还可以选择如 ploygon的MATIC,然后会显示相应的费用
    token: "ETH", //token:"MATIC"
    outputFile: "./gas-reporter.txt",
    noColors: true, //输出文件的时候要设置不要颜色 否则很难看
  },
}
