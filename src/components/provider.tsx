import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "@web3auth/modal/react/wagmi"
import { type ReactNode } from "react"
import { Web3AuthProvider } from "@web3auth/modal/react"

if (!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID) {
    // get from https://dashboard.web3auth.io
    throw new Error("missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID env var")
}

const web3AuthOptions: Web3AuthOptions = {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
}

const web3authConfig = {
    web3AuthOptions
}

const queryClient = new QueryClient()

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <Web3AuthProvider config={web3authConfig}>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider>{children}</WagmiProvider>
            </QueryClientProvider>
        </Web3AuthProvider>
    )
}
