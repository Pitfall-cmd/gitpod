import Image from "next/image"
import styles from "../styles/Home.module.css"
//如何检测到你的listed上去的nft？第一种是修改合约 再写一个array 来遍历获得，但是这耗费更多的gas 不可取
// 第二种就是 通过event来检测
//我们会监听这些event，然后把这些event存到数据库里面，当需要的时候在读取
//这里有两种第一种是Moralis 提供中心化的数据库，还有一种是theGraph提供去中心化的
export default function Home() {
    return <div className={styles.container}>NFT Marketplace Home page</div>
}
