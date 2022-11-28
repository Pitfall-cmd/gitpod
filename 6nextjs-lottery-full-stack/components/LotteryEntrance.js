import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants/index" //这里是因为index.js文档里面的module.exports的缘故，具体我也没弄明白为什么前端可以用require
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

//have a function to lottery
//切换网络的时候会重新渲染的
export default function LotteryEntrance() {
    const { chainId: HexchainId, isWeb3Enabled } = useMoralis() //获得16进制下的chainID
    //console.log(parseInt(HexchainId)) //手动转化一下
    const chainId = parseInt(HexchainId)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayer, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification()
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    //注意这里的函数都要await才能调用合约的函数
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString() //妈的 这里注意await 并且要括号
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
    //处理函数执行成功的函数
    const handleSuccess = async (tx) => {
        //合约执行后回返回response
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI() //更新UI
    }
    //处理notification
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            // icon: "bell",
        })
    }
    return (
        <div className="p-5">
            Hi from Lottery entrance{" "}
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                        onClick={async () => {
                            //moralis提供的合约是包装过的，还提供了一些触发器一样的东西，当你函数执行success或者error 或者 completed的时候调用什么函数
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div
                                class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                                role="status"
                            ></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    Entracce fee is {ethers.utils.formatUnits(entranceFee)} ETH
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>The current number of players is: {numPlayer}</div>
                    <div>The most previous winner was: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}

        </div>
    )
}
