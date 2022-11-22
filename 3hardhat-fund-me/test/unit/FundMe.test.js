const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const {developmentChains} =require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          //注意describe 是必须不是async类型的(好像是async也行)
          let fundMe
          let deployer
          let mockV3Aggregator
          //const sendValue="1000000000000000000"
          //https://docs.ethers.io/v5/api/utils/display-logic/#utils-parseUnits
          const sendValue = ethers.utils.parseEther("1") //等同于上面的1 ETH
          beforeEach(async function () {
              // const accounts = await ethers.getSigners()
              // deployer = accounts[0]
              //it 和 before Each都必须是async类型的
              deployer = (await getNamedAccounts()).deployer
              //这个函数会把deploy中含tags all的执行一边
              await deployments.fixture(["all"])
              //获得你刚刚的合约
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", function () {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })
          describe("fund", function () {
              it("Fails if you don't send enough ETH", async () => {
                  // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#revert
                  // 希望报错用 waffle 来处理
                  //注意这里string 的内容要与你solidity中报错的内容是一致的
                  const tmpa = 12
                  await expect(fundMe.fund(tmpa)).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("Updates the amount funded data structure", async () => {
                  //发送以太币的方式就是需要加入,{value:xx}
                  const tmpa = 12
                  await fundMe.fund(tmpa, { value: sendValue })
                  //
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of funders", async () => {
                  const tmpa = 12
                  await fundMe.fund(tmpa, { value: sendValue })
                  const response = await fundMe.getFunder(0)
                  assert.equal(response, deployer)
              })
          })
          describe("withdraw", function () {
              beforeEach(async () => {
                  await fundMe.fund(12, { value: sendValue })
              })
              it("withdraws ETH from a single funder", async () => {
                  // Arrange 获得初始的钱余额
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait()
                  //https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt 获得两个参数
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  //bigNumber类型有mul方法，计算得到gascost
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  //获取调用方法之后的余额
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Assert
                  // Maybe clean up to understand the testing
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  //这里选择2账户是因为 hardhat config里面选择hardhat网络的时候 用的deployer账户是1
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[2]
                  )
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner") //自定义error的处理
              })
          })
      })
