import React from 'react'

interface AllPoolsFormProps {
    onSubmit: () => void
    isMonitoring: boolean
}

export default function AllPoolsForm({ onSubmit, isMonitoring }: AllPoolsFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            <p className="text-gray-300 mb-4">
                Monitor all swaps across all pools on the DEX. 
                This will generate a high volume of events.
            </p>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         focus:ring-offset-gray-800 transition-colors"
            >
                Start Monitoring All Pools
            </button>
        </form>
    )
} 