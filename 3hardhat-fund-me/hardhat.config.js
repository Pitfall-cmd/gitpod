require("dotenv").config()

require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

const GOERLI_URL = process.env.GOERLI_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY
const COINMARKET_KEY = process.env.COINMARKET_KEY
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        compilers: [{ version: "0.8.7" }, { version: "0.6.6" }],
    },
    networks: {
        goerli: {
            url: GOERLI_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations:6 //通过network.config.blockConfirmations可以调用到
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
    },
    namedAccounts: {
        //自定义的内容，hre可以得到这个通过 const{deployer,user}=await getNamedAccounts()
        deployer: {
            default: 0, //表示默认就用下标为0的账户
            31337: 1, //表示chainid为31337用下标为1 的账户
        },
        user: {
            default: 0,
        },
    },
}
