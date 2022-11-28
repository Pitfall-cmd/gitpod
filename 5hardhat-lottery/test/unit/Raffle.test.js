const { assert, expect } = require("chai")
const { getNamedAccounts, network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle unit tests", function () {
          let raffle,
              raffleContract,
              vrfCoordinatorV2Mock,
              raffleEntranceFee,
              interval,
              player,
              deployer
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              // accounts = await ethers.getSigners() // could also do with getNamedAccounts
              player = (await getNamedAccounts()).player
              await deployments.fixture("all")
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer) // Returns a new connection to the VRFCoordinatorV2Mock contract
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })
          describe("constructor", function () {
              it("initializes the raffle correctly", async () => {
                  // Ideally, we'd separate these out so that only 1 assert per "it" block
                  // And ideally, we'd make this check everything
                  const raffleState = (await raffle.getRaffleState()).toString()

                  // Comparisons for Raffle initialization:
                  assert.equal(raffleState, "0")
                  assert.equal(
                      interval.toString(),
                      networkConfig[network.config.chainId]["keepersUpdateInterval"]
                  )
              })
          })
          describe("enterRaffle", async function () {
              it("reverets when you don't pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughETHEntered"
                  )
              })
              it("records players when they enter", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer)
              })
              it("emits event on enter", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee }))
                      .to.emit(raffle, "RaffleEnter")
                      .withArgs(deployer)
              })
              it("doesn't allow entrance when raffle is calculating", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  //需要经过interval秒之后才能调用performCheckup 所以手动调用evm_increase
                  // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  //强迫挖矿一下
                  await network.provider.request({ method: "evm_mine", params: [] })
                  //bytes类型其实是个数组
                  await raffle.performUpkeep([])
                  expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      "Raffle__RaffleNotOpen"
                  )
              })
          })
          describe("checkUpKeeper", async function () {
              it("returns false if  people don't have sent any eth", async function () {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  //   const { upkeepNeeded } = await raffle.checkUpkeep([])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert.equal(upkeepNeeded, false)
              })
              it("returns false if raffle isn't open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  await raffle.performUpkeep([]) // changes the state to calculating
                  //这里我们获得随机数之后应该会变回open，但是本地网络还没添加fund给keeper，所以得不到随机数，从而改不了
                  const raffleState = await raffle.getRaffleState() // stores the new state
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                  assert.equal(raffleState.toString() == "1", upkeepNeeded == false)
              })
              it("returns false if enough time hasn't passed", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 5]) // use a higher number here if this test fails
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                  assert(!upkeepNeeded)
              })
              it("returns true if enough time has passed, has players, eth, and is open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                  assert(upkeepNeeded)
              })
          })
          describe("performUpkeep", function () {
              it("it can only run if checkupkeep is true", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const tx2 = await raffle.checkUpkeep("0x") //返回值 [ true, '0x', upkeepNeeded: true ]
                  const tx = await raffle.performUpkeep([]) // 返回的是交易信息一大串
                  //console.log(tx)
                  assert(tx)
              })
              it("reverts if checkup is false", async () => {
                  await expect(raffle.performUpkeep("0x")).to.be.revertedWith(
                      "Raffle__UpkeepNotNeeded"
                  )
              })
              it("updates the raffle state and emits a requestId", async () => {
                  // Too many asserts in this test!
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const txResponse = await raffle.performUpkeep("0x") // emits requestId
                  const txReceipt = await txResponse.wait(1) // waits 1 block
                  const raffleState = await raffle.getRaffleState() // updates state
                  const requestId = txReceipt.events[1].args.requestId //这里为1是因为，函数出发了两个event，一个在requestRandomWords内部，所以这个排第二个
                  assert(requestId.toNumber() > 0)
                  assert(raffleState == 1) // 0 = open, 1 = calculating 这里还是1没有自动变为open，说明不是同一个区块内就完成，只是这个区块请求words，下个区块再把words给你
              })
          })
          describe("fulfillRandomwords", function () {
              beforeEach(async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
              })
              //没有perform意味着没有发起requestRandom，意味着协调者没有得到requestId和消费合约的地址
              it("can only be called after performupkeep", async () => {
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address) // reverts if not fulfilled
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address) // reverts if not fulfilled
                  ).to.be.revertedWith("nonexistent request")
              })
              it("picks a winner, resets, and sends money", async () => {
                  const additionEntrants = 3
                  const startAccountIndex = 1 //deployer 0
                  const accounts = await ethers.getSigners()
                  for (let i = startAccountIndex; i < startAccountIndex + additionEntrants; i++) {
                      const accountConnectedRaffle = raffle.connect(accounts[i])
                      await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee })
                  }
                  const startingTime = await raffle.getLastTimeStamp()
                  //1执行 performUpkeep （是由mock 的自动keeper来触发）
                  //2执行1操作之后会发起调用随机数的请求 ，于是VRF mock执行fulfillrandomwords的操作 （由mock的vrf操作）
                  //3.等待fulfillrandomwords 操作执行完毕
                  await new Promise(async (resolve, reject) => {
                      //4.设置一个监听fullfillrandomwords是否完成，监听他的event,200s内如果监听不到就报错。注意监听器要先设置
                      raffle.once(" WinnerPicked", async () => {
                          console.log("Fund the event!")
                          //监听到内容！之后执行下面操作判断是否正确
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                            //   console.log(recentWinner)
                            //   console.log(accounts[0].address)
                            //   console.log(accounts[1].address)
                            //   console.log(accounts[2].address)
                            //   console.log(accounts[3].address)

                              const raffleState = await raffle.getRaffleState()
                              const winnerBalance = await accounts[1].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()
                              //抽奖完之后 已经没有player了初始化了
                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[1].address)
                              assert.equal(raffleState, 0)
                              assert.equal(winnerBalance.toString(),winnerStartingBalance.add(raffleEntranceFee.mul(additionEntrants+1)).toString())
                          } catch (e) {
                              reject(e)
                          }
                          resolve()
                      })
                      const tx = await raffle.performUpkeep([])
                      const txReceipt = await tx.wait(1)
                      const winnerStartingBalance= await accounts[1].getBalance()
                     ///console.log(txReceipt)
                      //这里是手动去调用得到随机数，现实里应该是你发起request之后，合约自动去调用，或者说是外部操作使得合约自动去调用
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt.events[1].args.requestId,
                          raffle.address
                      )
                  })
              })
          })
      })
