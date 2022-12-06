const {ethers} =require("hardhat")
const PRICE =ethers.utils.parseEther("0.1")
async function mintAndList(){
    const nftmarketplace =await ethers.getContract("NftMarketplace")
    const basicNft =await ethers.getContract("BasicNft")
    console.log("Minting...")
    const mintTx=await basicNft.mintNft()
    const mintTxReceipt= await mintTx.wait(1)
    const tokenId= mintTxReceipt.events[0].args.tokenId;
    console.log("Approving Nft...")
    const approveTx=await basicNft.approve(nftmarketplace.address,tokenId)
    await approveTx.wait(1)
    console.log("Listing Nft...")
    const tx=await nftmarketplace.listItem(basicNft.address,tokenId,PRICE)
    await tx.wait(1)
    console.log("Listed!!")

}
mintAndList().then(()=>process.exit(0)).catch((error)=>{
    console.log(error)
    process.exit(1)
})