const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("./getWeth")
async function main() {
  //1.存入一些抵押品 weth到池子里面去 ，所以需要先获得一些weth
  await getWeth()
  const { deployer } = await getNamedAccounts()
  //abi contractAddress
  //lending Pool address provider :0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
  const lendingPool = await getLendingPool(deployer)
  console.log(`LendingPool address ${lendingPool.address}`)
  //approve 池子需要把我们的token从我们的账户转到池子里面，所以需要我们approve，他们才能转账
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
  console.log("Depositing....")
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
  console.log("Desposited!")

  //2.borrow借出一些其他代币
  //有多少我们已经借出来了？有多少我们抵押了？有多少我们还可以借出来？
  let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
    lendingPool,
    deployer
  )
  //我们还可以借的eth转化为dai是多少？？
  const daiPrice = await getDaiPrice()
  const amountDaiToBorrow = availableBorrowsETH * 0.95 * (1 / daiPrice) //0.95的意思是我们只借95%
  console.log(`You can Borrow ${amountDaiToBorrow} DAI`)
  const amountDaiToBorrowWei = ethers.utils.parseEther(
    amountDaiToBorrow.toString()
  ) //这里要转化为进制一样的 否则会报underflow
  //借Dai
  const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer)
  await getBorrowUserData(lendingPool, deployer)
  //3.repay我们的借出来的DAI代币
  //由于代币在我们的钱包了，所以repay DAI的时候也要approve
  await getBorrowUserData(lendingPool, deployer)
  await repay(
    amountDaiToBorrowWei,
    daiTokenAddress,
    lendingPool,
    deployer
  )
  await getBorrowUserData(lendingPool, deployer)//发现借出来的钱还回去还有一点剩下来没有还？这是因为我们要还利息，实际上我们是已经把本金还了，但池子还要收利息
  //接下来你可以区uniswap换一些dai，然后还回去
}
//偿还借出来的token
async function repay(amount, daiAddress, lendingPool, account) {
  //由于token在我们的钱包 所以需要先approve，允许池子来把这个token转过去
  await approveErc20(daiAddress, lendingPool.address, amount, account)
  const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
  await repayTx.wait(1)
  console.log("Repaid!")
}
async function getLendingPool(account) {
  const lendingPoolAddressProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  )
  const lendingPollAddress = await lendingPoolAddressProvider.getLendingPool() //获得lending pool的地址
  const lendPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPollAddress,
    account
  )
  return lendPool
}
async function approveErc20(erc20Address, spenderAddress, amount, signer) {
  const erc20 = await ethers.getContractAt("IERC20", erc20Address, signer)
  const txResponse = await erc20.approve(spenderAddress, amount)
  await txResponse.wait(1)
  console.log("Approved!")
}
async function getBorrowUserData(lendingPool, account) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account)
  console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
  console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
  console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
  return { availableBorrowsETH, totalDebtETH }
}
//一个dai可以换多少eth
async function getDaiPrice() {
  //DAI / ETH
  const priceFeedContract = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  )
  const { answer } = await priceFeedContract.latestRoundData()
  console.log(`The DAI/ETH price is ${answer.toString()}`)
  return answer
}
//借dai 调用pool的borrow方法
async function borrowDai(daiAddress, lendingPool, amountDaiToBorrow, account) {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDaiToBorrow,
    1,
    0,
    account
  )
  await borrowTx.wait(1)
  console.log("You've borrowed!")
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
  })
