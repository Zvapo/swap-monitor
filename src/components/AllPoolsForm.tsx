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
            <p className="text-gray-300">
                Monitor swaps in pools added to the last 200 blocks added to the factory. 
            </p>
            <p className="text-xs text-gray-400 mb-4">
                This might generate a high volume of events and a 429 error.
            </p>
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