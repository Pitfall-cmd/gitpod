const {ethers} =require("hardhat")

async function main(){
    const boxProxyAdmin =await ethers.getContract("BoxProxyAdmin") //最后不要加空格不然G
    const transparentProxy= await ethers.getContract("Box_Proxy")
    //访问方法用的是BOX的ABI 但是地址是Proxy的地址
    const proxyBoxV1=await ethers.getContractAt("Box",transparentProxy.address)
    const version1=await proxyBoxV1.version()
    console.log(version1)

    //UPGRADE
    const boxv2= await ethers.getContract("BoxV2")
    const upgradeTx=await boxProxyAdmin.upgrade(transparentProxy.address,boxv2.address)
    await upgradeTx.wait(1)
    //访问方法用的是BOXV2的ABI 但是地址是Proxy的地址
    const proxyBoxV2=await ethers.getContractAt("BoxV2",transparentProxy.address)
    const version2=await proxyBoxV2.version()
    console.log(version2)
}
main().then(()=>process.exit(0)).catch((error)=>{
    console.error(error)
    process.exit(1)
})