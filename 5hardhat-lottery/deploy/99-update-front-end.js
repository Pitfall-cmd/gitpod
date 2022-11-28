const { ethers, network } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESSES_FILE = "../6nextjs-lottery-full-stack/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../6nextjs-lottery-full-stack/constants/abi.json"
module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        updateContractAddresses()
        updateAbi()
    }
}
async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const currentAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8"))
    const chainId = network.config.chainId.toString()
    // in操作符的右边是一个对象，用于判断左边的时候在对象里面作为一个key
    if (chainId in currentAddress) {
        if (!currentAddress[chainId].includes(raffle.address)) {
            currentAddress[chainId].push(raffle.address)
        }
    } else {
        currentAddress[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddress))
}
async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]
