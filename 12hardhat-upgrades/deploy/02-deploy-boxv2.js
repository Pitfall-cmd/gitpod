const { network } = require("hardhat")
const {developmentChains} =require("../helper-hardhat-config")
const {verify}=require("../utils/verify")
module.exports=async({getNamedAccounts,deployments})=>{
    const {deploy,log}=deployments
    const {deployer}=await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS
    log("----------------------------------------------------")
    const boxv2= await deploy("BoxV2",{
        from:deployer,
        args:[],
        log:true,
        waitConfirmations:waitBlockConfirmations,
        // proxy:{
        //     proxyContract:"OpenZeppelinTransparentProxy", //OpenZeppelinTransparentProxy 内置的 不需要你写
        //     viaAdminContract:{
        //         name:"BoxProxyAdmin",
        //         artifact:"BoxProxyAdmin",
        //     }
        // }
    })
    console.log(boxv2.address)
    if(!developmentChains.includes(network.name)&&process.env.ETHERSCAN_KEY ){
        log("verifying...")
        await verify(boxv2.address,[])
    }
} 
module.exports.tags = ["all", "boxv2"]
