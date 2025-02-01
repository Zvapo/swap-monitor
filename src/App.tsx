import { useState } from 'react'
import DexMonitor from './components/DexMonitor'
import TokenForm from './components/TokenForm'
import AllPoolsForm from './components/AllPoolsForm'
import MonitoringModeSelector from './components/MonitoringModeSelector'
import PoolAddressForm from './components/PoolAddressForm'

type MonitoringMode = 'token-pair' | 'all-pools' | 'specific-pool'

interface TokenPairConfig {
    type: 'token-pair'
    token0: string
    token1: string
    fee: number
}

interface AllPoolsConfig { // need to add number of pools so i do not get overloaded with logs
    type: 'all-pools'
}

interface PoolAddressConfig {
    type: 'specific-pool'
    poolAddress: string
}

type MonitorConfig = TokenPairConfig | AllPoolsConfig | PoolAddressConfig | undefined

function App() {
    const [monitoringMode, setMonitoringMode] = useState<MonitoringMode>('token-pair')
    const [monitorConfig, setMonitorConfig] = useState<MonitorConfig>()
    const [isMonitoring, setIsMonitoring] = useState(false)

    const handleTokenFormSubmit = (data: { token0: string, token1: string, fee: number }) => {
        setMonitorConfig({
            type: 'token-pair',
            ...data
        })
        setIsMonitoring(true)
    }

    const handleAllPoolsSubmit = () => {
        setMonitorConfig({ type: 'all-pools' })
        setIsMonitoring(true)
    }

    const handlePoolAddressSubmit = (data: { poolAddress: string }) => {
        setMonitorConfig({
            type: 'specific-pool',
            ...data
        })
        setIsMonitoring(true)
    }

    const handleStopMonitoring = () => {
        setIsMonitoring(false)
        setMonitorConfig(undefined)
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-center text-blue-400">
                    Base Network DEX Monitor
                </h1>
            </header>

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Input Section */}
                <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-blue-300 mb-4">
                        Monitor Configuration
                    </h2>
                    
                    <MonitoringModeSelector 
                        currentMode={monitoringMode}
                        onModeChange={setMonitoringMode}
                    />

                    {monitoringMode === 'token-pair' ? (
                        <TokenForm 
                            onSubmit={handleTokenFormSubmit}
                            isMonitoring={isMonitoring}
                        />
                    ) : monitoringMode === 'all-pools' ? (
                        <AllPoolsForm 
                            onSubmit={handleAllPoolsSubmit}
                            isMonitoring={isMonitoring}
                        />
                    ) : (
                        <PoolAddressForm
                            onSubmit={handlePoolAddressSubmit}
                            isMonitoring={isMonitoring}
                        />
                    )}
                </section>
                
                {/* Monitor Section */}
                <section className="bg-gray-800 rounded-lg p-6 shadow-lg flex-1">
                    <h2 className="text-xl font-semibold text-blue-300 mb-4">
                        Live Monitor
                    </h2>
                    <DexMonitor 
                        config={monitorConfig}
                        onStop={handleStopMonitoring}
                    />
                </section>
            </div>
        </div>
    )
}

export default App
