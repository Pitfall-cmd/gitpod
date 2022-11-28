//nodejs的js 里面用require
//前端里面的js用 import
//手动去网址复制
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!")
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        })
        const account = accounts[0]
        console.log("MetaMask is connected!")
        document.getElementById("connectButton").innerHTML = account
    } else {
        console.log("No metamask")
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
    const provider = new ethers.providers.Web3Provider(window.ethereum) //获得metamask中的provider
    const signer = provider.getSigner() //获得相应的发起人
    // ABI address
    const contract = new ethers.Contract(contractAddress, abi, signer) //创建目标合约的实例
    //发送eth，内部会通过metamask来操作发送
    try {
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
        await listenforTransactionMine(transactionResponse, provider)
        //上述函数不加promise之前，会发现Done出现在确认之前，这是因为provider.once只是把他加入事件队列里面，然后就不管了，直到事件触发
        //如果要等事件触发才 Done，那么就要丢到Promise里面
        console.log("Done")
    } catch (error) {
        console.log(error)
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)
            console.log(balance)
            //让balance可读
            console.log(ethers.utils.formatEther(balance))
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = "Please install MetaMask"
    }
}
async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        //await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            // await transactionResponse.wait(1)
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}
function listenforTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    //promise 里面的参数 resolve和reject是两个函数，只有当触发了这两个函数中的一个，才会await结束。
    //resolve是表明你的函数正常运行，reject则是相反
    return new Promise((resolve, reject) => {
        //等被挖掘之后就会触发event，详情见once的方法
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
