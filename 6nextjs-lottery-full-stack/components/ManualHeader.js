// import {useMoralis} from "react-moralis"
// import { useEffect } from "react"
// export default  function ManualHeader(){
//     //1.enableweb3是连接metamask，isWeb3Enable判断是否连接了metamask，account是得到连接之后的账户 isweb3EnableLoading是判断是否在加载metamask页面
//     const {enableWeb3,isWeb3Enabled,account,Moralis,deactivateWeb3,isWeb3EnableLoading}=useMoralis()
//     //因为 useMoralis是个hook，数以数据改变的时候会自动render ，类似useState()
//     //2.但是这个按钮只有你摁了 才回去检测你是否连接，你链接之后刷新页面，又会重新出现connect，当然我们已经连结果了。所以需要useEffect
//     useEffect(()=>{
//         if(isWeb3Enabled)return 
//         //3.但是出现了问题，每次刷新页面，如果你没链接，它会自动弹出metamask去链接，所以我们需要一个值来判断用户是否已经主动连接过。
//         if(window.localStorage.getItem("connected")){
//              enableWeb3() //注意这里不用await
//         } 
//         //4.当你disconnect之后，isWeb3Enable发生变化，又会检测一遍，让你重新connect，所以要判断是否disconnect了
//     },[isWeb3Enabled])//两个参数，第二个参数是一个数组，该函数会不断的监听检查里面的值，如果某个值发生变化，就会执行第一个参数的函数
//     //这里会执行两次是因为 strict mode，在加载的时候会渲染两次，加载的时候会自动执行，即使第二个参数里面的值是空的或者没变化

//     //5.应对disconnect的情况
//     useEffect(()=>{
//         Moralis.onAccountChanged((account)=>{
//             console.log("account changed ", account)
//             if (account==null){ //表示metamask手动disconnect
//                 window.localStorage.removeItem("connected")
//                 deactivateWeb3()//设置 isWebEnable false
//                 console.log("NUll account found")
//             }
//         })
//     },[account]) 
   
//     return(
//         <div>
//             {account?(<div>Connected to {account.slice(0,6)}...{account.slice(account.length-4)}</div>):(<button onClick={async ()=>{await enableWeb3()
//             window.localStorage.setItem("connected","inject")}} disabled={isWeb3EnableLoading}>connect</button>)}
//         </div>
//     )
// }