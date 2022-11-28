import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { WagmiConfig, createClient, configureChains, chain } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.optimism],
    [publicProvider()]
)
const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
})
function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <WagmiConfig client={client}>
                <NotificationProvider>
                    <Component {...pageProps} />
                </NotificationProvider>
            </WagmiConfig>
        </MoralisProvider>
    )
}

export default MyApp
