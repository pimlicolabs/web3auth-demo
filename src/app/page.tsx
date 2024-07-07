"use client"

import { Home } from "@/components/home"
import { createConfig } from "wagmi"
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"
import Web3AuthConnectorInstance from "@/components/web3auth/web3AuthInstance"


const queryClient = new QueryClient() 

// Set up client
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [
    Web3AuthConnectorInstance([sepolia]),
  ],
});

export default function Main() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <Home />
            </QueryClientProvider>
        </WagmiProvider>
    )
}
