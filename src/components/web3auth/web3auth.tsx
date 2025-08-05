"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Loader } from "@/components/loader"
import { Hash } from "viem"
import {
    useWeb3AuthConnect,
    useWeb3AuthDisconnect
} from "@web3auth/modal/react"
import { SendUserOperation } from "../send-useroperation"

if (!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID)
    throw new Error("Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID")

export const Web3AuthFlow = () => {
    const { connect, isConnected, connectorName } = useWeb3AuthConnect()
    const { disconnect } = useWeb3AuthDisconnect()
    const { address } = useAccount()

    const [showLoader, setShowLoader] = useState<boolean>(false)
    const [txHash, setTxHash] = useState<string | null>(null)

    const onSendTransaction = (txHash: Hash) => {
        setTxHash(txHash)
    }

    const loggedInView = (
        <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4">
                Connected to {connectorName}
            </h2>
            <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                    Smart contract wallet address:
                </p>
                <p className="font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <code>{address}</code>
                </p>
                <SendUserOperation />
            </div>
            <button
                onClick={() => disconnect()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
                Sign out
            </button>
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

    const unloggedInView = (
        <button
            onClick={() => connect()}
            className="flex justify-center items-center w-64 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            {!showLoader && <p className="mr-4">Sign in with Web3Auth</p>}
            {showLoader && <Loader />}
        </button>
    )

    return (
        <div className="flex items-center justify-center py-16">
            {isConnected ? loggedInView : unloggedInView}
        </div>
    )
}
