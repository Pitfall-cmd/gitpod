import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import Header from "../components/Header"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider,ApolloClient,InMemoryCache } from "@apollo/client"
//这一段创建一个客户端 告诉这个客户端去哪里执行graphQL
//发出的请求到一个中心化的服务器上，但是数据存储在去中心化的图Indexer上面，类似IPFS一样
const client=new ApolloClient({
    cache: new InMemoryCache(),
    uri:"https://api.studio.thegraph.com/query/39280/nft-marketplace/v0.0.1"
})
function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false} appId={APP_ID} serverUrl={SERVER_URL}>
            <ApolloProvider client={client}>
                <NotificationProvider>
                    {/* <Header /> */}
                    <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>                            
            </MoralisProvider>
        </div>
    )
}

export default MyApp
