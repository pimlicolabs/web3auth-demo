import { SmartAccountClient } from "permissionless"
import { SmartAccount } from "permissionless/accounts"
import { Chain, Hash, Transport, zeroAddress } from "viem"
import { Loader } from "@/components/loader"
import { useState } from "react"

export const DemoTransactionButton = ({
    smartAccountClient,
    onSendTransaction
}: {
    smartAccountClient: SmartAccountClient<Transport, Chain, SmartAccount>
    onSendTransaction: (txHash: Hash) => void
}) => {
    const [loading, setLoading] = useState<boolean>(false)

    const sendTransaction = async () => {
        setLoading(true)
        const txHash = await smartAccountClient.sendTransaction({
            to: zeroAddress,
            data: "0x",
            value: BigInt(0)
        })
        onSendTransaction(txHash)
        setLoading(false)
    }

    return (
        <div>
            <button
                onClick={sendTransaction}
                className="mt-6 flex justify-center items-center w-64 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {!loading && <p className="mr-4">Demo transaction</p>}
                {loading && <Loader />}
            </button>
        </div>
    )
    _
}
