import { Loader } from "@/components/loader"
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { zeroAddress } from "viem"

export const SendDemoUserOp = () => {
    const {
        data: hash,
        error,
        isPending,
        sendTransaction
    } = useSendTransaction()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash
        })

    const handleSendTransaction = async () => {
        sendTransaction({
            to: zeroAddress,
            data: "0x",
            value: BigInt(0)
        })
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <button
                onClick={handleSendTransaction}
                disabled={isPending}
                className="flex justify-center items-center w-64 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
                {!isPending && "Send userOp"}
                {isPending && <Loader />}
            </button>
            {hash && (
                <div className="text-center space-y-2">
                    <div className="text-sm text-gray-600">
                        Transaction Hash: 
                        <div className="font-mono text-xs break-all mt-1">{hash}</div>
                    </div>
                    {isConfirming && (
                        <div className="text-sm text-yellow-600">
                            Waiting for confirmation...
                        </div>
                    )}
                    {isConfirmed && (
                        <div className="text-sm text-green-600 font-semibold">
                            ✓ Transaction confirmed
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="text-sm text-red-600">
                    Error: {error.message}
                </div>
            )}
        </div>
    )
}
