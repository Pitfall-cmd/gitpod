const { expect } = require("chai")
const { ethers,getNamedAccounts, network } = require("hardhat")
const {developmentChains} =require("../../helper-hardhat-config")
//如果是在本地网络运行则skip 否则继续执行
developmentChains.includes(network.name)? describe.skip:
describe("FundMe", async function () {
    //这里是假设已经部署到testnet上来了
    let fundMe
    let deployer
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
    })
    it("allows people to fund and withdraw",async ()=>{
        await fundMe.fund({value:sendValue})
        await fundMe.withdraw()
        const endbalance =await fundMe.provider.getBalance(fundMe.address)
        expect(endbalance.toString(),"0")
    })
})
