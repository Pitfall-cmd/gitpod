const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: 0xd4a33860578de61dbabdc8bfdb98fd742fa7028e,
    },
    31337: {
        name: "localhost",
    },
}
const developmentChains = ["hardhat", "localhost"]
//这种形式就是导出多个函数或变量
module.exports = {
    networkConfig,
    developmentChains,
}
