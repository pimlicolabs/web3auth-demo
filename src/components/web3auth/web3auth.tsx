"use client"

import { useAccount } from "wagmi"
import {
    useWeb3AuthConnect,
    useWeb3AuthDisconnect
} from "@web3auth/modal/react"
import { SendDemoUserOp } from "../send-demo-user-op"

if (!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID)
    throw new Error("Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID")

export const Web3AuthFlow = () => {
    const { connect, isConnected, connectorName } = useWeb3AuthConnect()
    const { disconnect } = useWeb3AuthDisconnect()
    const { address } = useAccount()

    const loggedInView = (
        <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4">
                Connected to {connectorName}
            </h2>
            <div className="mb-6 space-y-4 flex flex-col items-center">
                <div>
                    <p className="text-sm text-gray-600 mb-2">
                        Smart contract wallet address:
                    </p>
                    <p className="font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <code>{address}</code>
                    </p>
                </div>
                
                <SendDemoUserOp />
            </div>
            
            <button
                onClick={() => disconnect()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
                Sign out
            </button>
        </div>
    )

    const unloggedInView = (
        <button
            onClick={() => connect()}
            className="flex justify-center items-center w-64 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            <p className="mr-4">Sign in with Web3Auth</p>
        </button>
    )

    return (
        <div className="flex items-center justify-center py-16">
            {isConnected ? loggedInView : unloggedInView}
        </div>
    )
}
