"use client"
import { Web3Auth } from "@web3auth/modal"
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector"
import { useCallback, useEffect, useState } from "react"
import { sepolia, useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi"
import { usePublicClient } from "wagmi"
import { Loader } from "@/components/loader"
import { SmartAccount, signerToSafeSmartAccount } from "permissionless/accounts"
import { Address, Chain, Hash, Transport, http } from "viem"
import { CustomSigner } from "./customSigner"
import { SmartAccountClient, createSmartAccountClient } from "permissionless"
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico"
import { DemoTransactionButton } from "@/components/demo-transaction"

if (!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID)
    throw new Error("Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID")

const web3authInstance = new Web3Auth({
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
    chainConfig: {
        chainNamespace: "eip155",
        chainId: "0xAA36A7",
        rpcTarget: process.env.NEXT_PUBLIC_RPC_URL!,
        displayName: "Ethereum sepolia",
        blockExplorer: "https://sepolia.etherscan.io",
        ticker: "ETH",
        tickerName: "Ethereum"
    }
})

const pimlicoPaymaster = createPimlicoPaymasterClient({
    transport: http(process.env.NEXT_PUBLIC_PIMLICO_PAYMASTER_RPC_HOST!)
})

const connector = new Web3AuthConnector({
    options: {
        web3AuthInstance: web3authInstance
    }
})

export const Web3AuthFlow = () => {
    const { isConnected } = useAccount()
    const [showLoader, setShowLoader] = useState<boolean>(false)
    const [smartAccountClient, setSmartAccountClient] =
        useState<SmartAccountClient<Transport, Chain, SmartAccount> | null>(
            null
        )
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()
    const [txHash, setTxHash] = useState<string | null>(null)
    const { disconnect } = useDisconnect()

    const { connect } = useConnect({
        connector: connector
    })

    const signIn = useCallback(async () => {
        setShowLoader(true)
        connect()
    }, [connect])

    const signOut = useCallback(async () => {
        setShowLoader(false)
        disconnect()
    }, [disconnect])


    useEffect(() => {
        ;(async () => {
            if (isConnected && walletClient && publicClient) {
                const customSigner = new CustomSigner(walletClient)

                const safeSmartAccountClient = await signerToSafeSmartAccount(
                    publicClient,
                    {
                        entryPoint: process.env
                            .NEXT_PUBLIC_ENTRYPOINT! as Address,
                        signer: customSigner,
                        safeVersion: "1.4.1",
                        saltNonce: BigInt(0)
                    }
                )

                const smartAccountClient = createSmartAccountClient({
                    account: safeSmartAccountClient,
                    chain: sepolia,
                    transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC_HOST!),
                    sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation
                })

                setSmartAccountClient(smartAccountClient)
            }
        })()
    }, [isConnected, walletClient, publicClient])

    const onSendTransaction = (txHash: Hash) => {
        setTxHash(txHash)
    }

    if (isConnected && smartAccountClient) {
        return (
            <div>
                <div>
                    Smart contract wallet address:{" "}
                    <p className="fixed left-0 top-0 flex flex-col w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                        <code>{smartAccountClient.account?.address}</code>
                    </p>
                </div>
                <div className="flex gap-x-4">
                    <button
                        onClick={signOut}
                        className="mt-6 flex justify-center items-center w-64 cursor-pointer border-2 border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign out
                    </button>
                    <DemoTransactionButton
                        smartAccountClient={smartAccountClient}
                        onSendTransaction={onSendTransaction}
                    />
                </div>
                {txHash && (
                    <p className="mt-4">
                        Transaction hash:{" "}
                        <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            {txHash}
                        </a>
                    </p>
                )}
            </div>
        )
    }

    return (
        <button
            onClick={signIn}
            className="flex justify-center items-center w-64 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            {!showLoader && <p className="mr-4">Sign in with Web3Auth</p>}
            {showLoader && <Loader />}
        </button>
    )
}
