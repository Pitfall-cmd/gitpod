const { assert, expect } = require("chai")
const { getNamedAccounts, network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
//测试网上的最终测试
developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle staging tests", function () {
          let raffle, raffleEntranceFee, deployer
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })
          describe("fulfillRandomwords", function () {
              it("works with live Chainlink Keepers and ChainLink VRF,we get a random winner", async function () {
                  const startingTime = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()
                  //set up listener 来检测是否得到随机值
                  await new Promise(async (resolve, reject) => {
                      //1.设置监听器,检测到了才会执行，注意顺序要先设置监听器，如果网络太快，监听器还没设置完，就听不到了
                      raffle.once("WinnerPicked", async () => {
                          //监听到了event
                          //检查各项值是否正确
                          console.log("WinnerPicked!")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()
                              console.log(accounts[0].address)
                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(winnerBalance.toString(),winnerStartingBalance.add(raffleEntranceFee).toString())
                              assert(endingTimeStamp>startingTime)
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                          
                      })
                      //2.打钱，之后等自动机去执行performKeeper，发起request，然后等VRF返回值，由于自动机的时间我设置的是1分钟，所以timeout时间要调整一下
                      const tx=await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(1)
                      console.log("Ok, time to wait 1 block ... or you may get wrong balance")
                      const winnerStartingBalance = await accounts[0].getBalance()
                      console.log("winner starting balance ", winnerStartingBalance.toString())
                  })
              })
          })
      })
