import { ethers } from 'ethers'

export class SwapMonitor {
    private FACTORY_ADDRESS: string = '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
    private FACTORY_ABI: string[] = [
        "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
    ]
    private POOL_ABI: string[] = [
        "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
        "function token0() external view returns (address)",
        "function token1() external view returns (address)",
    ]
    private PUBLIC_NODE_URL: string = '/rpc'
    private provider: ethers.providers.JsonRpcProvider
    private factory: ethers.Contract | undefined
    private addressZero: string = "0x0000000000000000000000000000000000000000"
    private onSwapCallback?: (data: any) => void

    constructor(
        onSwap?: (data: any) => void
    ) {
        this.onSwapCallback = onSwap
        this.provider = this.initProvider()
        this.factory = this.initFactory() 
    }

    initFactory(){
        try{
            const factory = new ethers.Contract(this.FACTORY_ADDRESS, this.FACTORY_ABI, this.provider)
            return factory
        } catch (error) {
            console.error('Failed to initialize factory', error)
        }
    }

    initProvider() {
        try {
            console.log('Initializing provider...')
            return new ethers.providers.JsonRpcProvider(this.PUBLIC_NODE_URL)
        } catch (error) {
            console.error('Failed to initialize provider', error)
            throw error
        }
    }

    async getPoolByAddress(poolAddress: string): Promise<ethers.Contract> {
        const pool = new ethers.Contract(poolAddress, this.POOL_ABI, this.provider)
        return pool
    }

    async tryGetPoolAddress(token0: string, token1: string, fee: number): Promise<string> {
        console.log('Trying to get pool address for fee', fee)
        if (!this.factory) {
            throw new Error('Factory not initialized')
        }

        const poolAddress = await this.factory.getPool(token0, token1, fee)
        if (poolAddress === this.addressZero) {
            throw new Error(`No pool address found for fee ${fee}`)
        }
        console.log('Pool address found for fee', fee)
        console.log('Pool address', poolAddress)
        return poolAddress
    }

    startListening(pool: ethers.Contract){
        pool.on('Swap', (
            sender: string, 
            recipient: string, 
            amount0: ethers.BigNumber, 
            amount1: ethers.BigNumber, 
                sqrtPriceX96: ethers.BigNumber, 
                liquidity: ethers.BigNumber, 
                tick: number
            ) => {
                console.log('Whoop') // Whoop Whoop :D
                const swapData = {
                    sender,
                    recipient,
                    amount0: ethers.utils.formatEther(amount0),
                    amount1: ethers.utils.formatEther(amount1),
                    sqrtPriceX96: sqrtPriceX96.toString(),
                    liquidity: liquidity.toString(),
                    tick: tick.toString()
                }
                
            // Call the callback if it exists
            this.onSwapCallback?.(swapData)
        })
    }

    // getMarkerCap(){
    //     // this function should get the market cap of a smart contract
    // }
    // labelSwap(swapData: any){
    //     // this function should label the swap data as whale, dolphin, shrimp based on the amount of tokens swapped
    //     const amount0 = parseFloat(swapData.amount0)
    //     const amount1 = parseFloat(swapData.amount1)
    //     if (amount0 > 1000000 || amount1 > 1000000) {
    //         return 'whale'
    //     } else if (amount0 > 100000 || amount1 > 100000) {
    //         return 'dolphin'
    //     } else {
    //         return 'shrimp'
    //     }
    // }

    stopListening(pool: ethers.Contract){
        pool.removeAllListeners('Swap')
    }
}

