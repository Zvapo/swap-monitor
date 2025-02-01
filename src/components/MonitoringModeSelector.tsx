import React from 'react'

interface MonitoringModeSelectorProps {
    currentMode: 'token-pair' | 'all-pools' | 'specific-pool'
    onModeChange: (mode: 'token-pair' | 'all-pools' | 'specific-pool') => void
}

export default function MonitoringModeSelector({ currentMode, onModeChange }: MonitoringModeSelectorProps) {
    return (
        <div className="flex gap-4 mb-6">
            <button
                onClick={() => onModeChange('token-pair')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                    ${currentMode === 'token-pair' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                Monitor Token Pair
            </button>
            <button
                onClick={() => onModeChange('all-pools')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                    ${currentMode === 'all-pools' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                Monitor All Pools
            </button>
            <button
                onClick={() => onModeChange('specific-pool')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                    ${currentMode === 'specific-pool' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                Monitor A Pool
            </button>
        </div>
    )
} 