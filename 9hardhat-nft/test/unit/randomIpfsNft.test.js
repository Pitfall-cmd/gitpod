const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Random IPFS NFT Unit Tests", function () {
      //1.获得签名者，获得合约
      let account, randomIpfsNFT, VRFCoordinatorV2Mock, minFee

      beforeEach(async function () {
        const accounts = await ethers.getSigners()
        account = accounts[0]
        await deployments.fixture(["mocks", "randomipfs"])
        VRFCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          account.address
        )
        randomIpfsNFT = await ethers.getContract(
          "RandomIpfsNft",
          account.address
        )
        minFee = await randomIpfsNFT.getMintFee()
      })
      //测试 requestNft
      it("测试 requestNft ETH 小于mintfee时候报错", async function () {
        // await randomIpfsNFT.requestNft({value:ethers.utils.parseEther("0.01")})

        await  expect(randomIpfsNFT.requestNft()).to.be.revertedWith(
          "RandomIpfsNft__NeedMoreETHSent"
        )
      })
      it("测试 requestNft ETH 大于等于mintfee的时候正常", async function () {
        const tx = await randomIpfsNFT.requestNft({ value: minFee })
        const txReceipt = await tx.wait(1)
        // const requestId = txReceipt.events[0].args.requestId
        const requestId = txReceipt.events[1].args.requestId
        const sender = txReceipt.events[1].args.requester
        console.log("request Id is ",requestId.toString())
        assert.equal(sender, account.address)
      })

      //测试 fulfillRandomWords
      it("测试 fulfillRandomWords", async function () {
        const tx = await randomIpfsNFT.requestNft({ value: minFee })
        const txReceipt = await tx.wait(1)
        const requestId = txReceipt.events[1].args.requestId
        await VRFCoordinatorV2Mock.fulfillRandomWords(
          requestId,
          randomIpfsNFT.address
        )
        const tokenCounter = await randomIpfsNFT.getTokenCounter()
        assert(tokenCounter.toString(), "1")

        assert.equal(await randomIpfsNFT.ownerOf(0), account.address)
        const tokenURI = await randomIpfsNFT.tokenURI(0)
        console.log(tokenURI)
      })
    })
