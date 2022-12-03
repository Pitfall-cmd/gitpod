const { assert } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
describe("BasicNFT test", function () {
  //1.获得签名者
  let deployer, basicNft
  //2.获得合约
  const { fixture } = deployments

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer
    await fixture("basicnft")
    basicNft = await ethers.getContract("BasicNFT", deployer)
  })
  it("token count shoud be 1 after mint", async function () {
    const startcount = await basicNft.getTokenCounter()
    assert.equal("0", startcount.toString())
    const tx = await basicNft.mintNft()
    tx.wait(1)
    const endcount = await basicNft.getTokenCounter()
    assert.equal("1", endcount.toString())
  })
  it("token url should be corrected", async function () {
    const tokenUrl =
      "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
    const getUrl = await basicNft.tokenURI(0)
    assert.equal(tokenUrl, getUrl)
  })

  it("Show the correct balance and owner of an NFT", async function () {
    const deployerAddress = deployer
    const tx = await basicNft.mintNft()
    tx.wait(1)
    const deployerBalance = await basicNft.balanceOf(deployerAddress)
    const owner = await basicNft.ownerOf("1")

    assert.equal(deployerBalance.toString(), "1")
    assert.equal(owner, deployerAddress)
  })
})
