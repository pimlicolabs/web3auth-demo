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
        <div>
            <button
                onClick={handleSendTransaction}
                disabled={isPending}
                className="flex justify-center items-center w-64 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
                {!isPending && "Send userOp"}
                {isPending && <Loader />}
            </button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && "Waiting for confirmation..."}
            {isConfirmed && "Transaction confirmed."}
            {error && <div>Error: {error.message}</div>}
        </div>
    )
}
