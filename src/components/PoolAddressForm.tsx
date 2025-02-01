import React, { useState } from 'react'

interface PoolAddressFormProps {
    onSubmit: (data: {
        poolAddress: string
    }) => void,
    isMonitoring: boolean
}

export default function PoolAddressForm({ onSubmit, isMonitoring }: PoolAddressFormProps) {
    const [poolAddress, setPoolAddress] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ poolAddress })
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Pool Address Input */}
            <div className="space-y-2">
                <label htmlFor="poolAddress" className="block text-sm font-medium text-gray-300">
                    Pool Address
                </label>
                <input
                    type="text"
                    id="poolAddress"
                    placeholder="0x..."
                    value={poolAddress}
                    onChange={(e) => setPoolAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-gray-100 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400">
                    Enter the Uniswap V3 pool contract address you want to monitor
                </p>
            </div>

            <button
                type="submit"
                disabled={isMonitoring}
                className={`w-full px-4 py-2 rounded-lg font-medium
                         transition-colors
                         ${isMonitoring 
                             ? 'bg-gray-600 cursor-not-allowed' 
                             : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                         }
                         text-white focus:outline-none focus:ring-offset-2
                         focus:ring-offset-gray-800`}
            >
                {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
            </button>
        </form>
    )
} 