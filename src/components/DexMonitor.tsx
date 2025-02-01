import { useEffect, useState } from 'react'
import { SwapMonitor } from '../scripts/getSwaps'
import { ethers } from 'ethers'

interface DexMonitorProps {
    config?: {
        type: 'token-pair' | 'all-pools' | 'specific-pool'
        token0?: string
        token1?: string
        fee?: number
        poolAddress?: string
        allPools?: boolean
        pool?: ethers.Contract
    },
    onStop: () => void
}

export default function DexMonitor({ config, onStop }: DexMonitorProps) {
    const [isListening, setIsListening] = useState(false)
    const [swapMonitor, setSwapMonitor] = useState<SwapMonitor | null>(null)
    const [logs, setLogs] = useState<Array<{
        timestamp: string,
        message: string,
        type: 'info' | 'success' | 'error' | 'stop' | 'swap'
    }>>([])

    const addLog = (message: string, type: 'info' | 'success' | 'error' | 'stop' | 'swap' = 'info') => {
        setLogs(prevLogs => [...prevLogs, {
            timestamp: new Date().toISOString(),
            message,
            type
        }])
    }
    const monitor = new SwapMonitor()
    const stopMonitoring = () => {
        if (swapMonitor) {
            swapMonitor.stopListening()
            setIsListening(false)
            addLog('Monitoring stopped', 'stop')
            onStop()
        }
    }

    useEffect(() => {
        if (!config) return

        // monitor for a pool
        if (config.type === 'specific-pool' && config.poolAddress) {
            // Initialize monitor for specific pool
            setSwapMonitor(monitor)
            
            const initializeMonitor = async () => {
                try {
                    addLog('Initializing monitor...', 'info')
                    const pool = await monitor.getPoolByAddress(config.poolAddress!)
                    addLog(`Found the pool with address ${config.poolAddress}`, 'success')

                    // Set the callback before starting to listen
                    monitor.onSwapCallback = (swapData) => {
                        const swapMessage = `Swap: ${swapData.amount0} token0 ↔️ ${swapData.amount1} token1`
                        addLog(swapMessage, 'swap')
                    }

                    monitor.startListening(pool)
                    setIsListening(true)
                    addLog('Monitoring started', 'success')
                } catch (error: any) {
                    addLog(`Error: ${error.message}`, 'error')
                    console.error('Failed to initialize monitor', error)
                }
            }

            initializeMonitor()


        // monitor for a token pair
        } else if (config.type === 'token-pair' && config.token0 && config.token1 && config.fee) {
            // Existing token pair logic
            setSwapMonitor(monitor)
            
            const initializeMonitor = async () => {
                try {
                    addLog('Initializing monitor...', 'info')
                    const poolAddress = await monitor.tryGetPoolAddress(config.token0!, config.token1!, config.fee!)
                    const pool = await monitor.getPoolByAddress(poolAddress)
                    
                    addLog(`Found a pool with the address ${poolAddress}`, 'success')

                    // Set the callback before starting to listen
                    monitor.onSwapCallback = (swapData) => {
                        const swapMessage = `Swap: ${swapData.amount0} token0 ↔️ ${swapData.amount1} token1`
                        addLog(swapMessage, 'swap')
                    }
                    
                    monitor.startListening(pool)
                    setIsListening(true)
                    addLog('Monitoring started', 'success')
                } catch (error: any) {
                    addLog(`Error: ${error.message}`, 'error')
                    console.error('Failed to initialize monitor', error)
                }
            }

            initializeMonitor()
        }

        else if (config.type === 'all-pools') {
            // monitor for all pools
        }

        return () => {
            if (swapMonitor) {
                swapMonitor.stopListening()
                setIsListening(false)
            }
        }
    }, [config]) // Re-run when config changes

    return (
        <div className="space-y-4">
            {/* Status Bar with Stop Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-300">
                        Status: {isListening ? 'Monitoring' : 'Stopped'}
                    </span>
                </div>
                {isListening && (
                    <button
                        onClick={stopMonitoring}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                                 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500
                                 transition-colors"
                    >
                        Stop Monitoring
                    </button>
                )}
            </div>

            {/* Updated Log Window */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 h-[500px] overflow-y-auto">
                <div className="p-4 font-mono text-sm">
                    <pre className="text-gray-300 whitespace-pre-wrap">
                        {logs.map((log, index) => (
                            <div key={index}>
                                <span className="text-gray-500">[{log.timestamp}] </span>
                                <span className={`
                                    ${log.type === 'info' && 'text-blue-400'}
                                    ${log.type === 'success' && 'text-green-400'}
                                    ${log.type === 'error' && 'text-red-400'}
                                    ${log.type === 'stop' && 'text-red-400'}
                                    ${log.type === 'swap' && 'text-yellow-400'}
                                `}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    )
}
