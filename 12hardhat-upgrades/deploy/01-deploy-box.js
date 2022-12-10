const { network, ethers } = require("hardhat")
const {developmentChains} =require("../helper-hardhat-config")
const {verify}=require("../utils/verify")
module.exports=async({getNamedAccounts,deployments})=>{
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const box= await deploy("Box",{
        from:deployer,
        args:[],
        log:true,
        waitConfirmations:waitBlockConfirmations,
        proxy:{
            proxyContract:"OpenZeppelinTransparentProxy", //OpenZeppelinTransparentProxy 内置的 不需要你写
            viaAdminContract:{
                name:"BoxProxyAdmin",
                artifact:"BoxProxyAdmin",
            }
        }
    })
    console.log("Box address ",box.address) //这个Box地址和BoxProxy的地址是一样的
    const BoxProxyAdmin=await  ethers.getContract("BoxProxyAdmin")
    console.log(BoxProxyAdmin.address)
    if(!developmentChains.includes(network.name)&&process.env.ETHERSCAN_KEY ){
        log("verifying...")
        await verify(box.address,[])
    }
} 

// deploying "BoxProxyAdmin" (tx: 0x316dd50f94cbca0d0f3cf80d16ca50f2e2edbe49237de00ec35ec80dab17724f)...: deployed at 0xc6B407503dE64956Ad3cF5Ab112cA4f56AA13517 with 787473 gas
// 1.Box 合约自动改名为Implementation
// deploying "Box_Implementation" (tx: 0x2cc781b852d0b2791c3997eae34a035cb8a6caa0d4834cf6ea3d9527d8281eb9)...: deployed at 0x3a622DB2db50f463dF562Dc5F341545A64C580fc with 148423 gas
// 2.OpenZeppelinTransparentProxy
// deploying "Box_Proxy" (tx: 0x1f17e2a739c0b323d854c9ce8f0934309c996e33f3ce8731156daccbe9402d22)...: deployed at 0x6A47346e722937B60Df7a1149168c0E76DD6520f with 720430 gas