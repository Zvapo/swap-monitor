import React, { useState } from 'react'

interface TokenFormProps {
    onSubmit: (data: {
        token0: string,
        token1: string,
        fee: number
    }) => void,
    isMonitoring: boolean,
}

export default function TokenForm({ onSubmit }: TokenFormProps) {
    const [formData, setFormData] = useState({
        token0: '',
        token1: '',
        fee: 10000
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Token0 Input */}
            <div className="space-y-2">
                <label htmlFor="token0" className="block text-sm font-medium text-gray-300">
                    Token0 Address
                </label>
                <input
                    type="text"
                    id="token0"
                    placeholder="0x..."
                    value={formData.token0}
                    onChange={(e) => setFormData(prev => ({ ...prev, token0: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-gray-100 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400">
                    Enter the token0 address you want to monitor
                </p>
            </div>

            {/* Token1 Input */}
            <div className="space-y-2">
                <label htmlFor="token1" className="block text-sm font-medium text-gray-300">
                    Token1 Address
                </label>
                <input
                    type="text"
                    id="token1"
                    placeholder="0x..."
                    value={formData.token1}
                    onChange={(e) => setFormData(prev => ({ ...prev, token1: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-gray-100 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400">
                    Enter the token1 address you want to monitor
                </p>
            </div>

            {/* Fee Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fee Tier
                </label>
                <div className="flex gap-6">
                    {[
                        { value: 500, label: '0.05%' },
                        { value: 3000, label: '0.3%' },
                        { value: 10000, label: '1%' }
                    ].map(({ value, label }) => (
                        <label key={value} className="inline-flex items-center">
                            <input
                                type="radio"
                                name="fee"
                                value={value}
                                checked={formData.fee === value}
                                onChange={(e) => setFormData(prev => ({ ...prev, fee: Number(e.target.value) }))}
                                className="form-radio h-4 w-4 text-blue-500"
                            />
                            <span className="ml-2 text-gray-300">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         focus:ring-offset-gray-800 transition-colors"
            >
                Start Monitoring
            </button>
        </form>
    )
}