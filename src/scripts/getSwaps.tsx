import { ethers } from 'ethers'

export class SwapMonitor {
    private FACTORY_ADDRESS: string = '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
    private FACTORY_ABI: string[] = [
        "event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)",
        "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
    ]
    private POOL_ABI: string[] = [
        "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
        "function token0() external view returns (address)",
        "function token1() external view returns (address)",
    ]
    private PUBLIC_NODE_URL: string = '/rpc'
    private provider: ethers.providers.JsonRpcProvider
    private factory: ethers.Contract
    private pools: ethers.Contract[] | undefined
    private addressZero: string = "0x0000000000000000000000000000000000000000"
    public onSwapCallback?: (data: any) => void

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
            throw new Error('Failed to initialize factory')
        }
    }

    initProvider() {
        try {
            console.log('Initializing provider...')
            return new ethers.providers.JsonRpcProvider(this.PUBLIC_NODE_URL)
        } catch (error) {
            console.error('Failed to initialize provider', error)
            throw new Error('Failed to initialize provider')
        }
    }

    async getPools(numberOfBlocks: number = 100) {
        /*
            This function will get the pool addresses of the pools created by the factory in the last numberOfBlocks blocks
            It uses a batch size of 10 blocks per query by default
            It will then return the pool addresses in an array
        */
        try {
            // Get current block number
            const batchSize = 10
            const endBlock = await this.provider.getBlockNumber()
            const startBlock = Math.max(0, endBlock - numberOfBlocks)
            console.log(`Querying from block ${startBlock} to ${endBlock} in ${Math.ceil((endBlock - startBlock) / batchSize)} batches`)
            const filter = this.factory.filters.PoolCreated()
            
            let allEvents: any[] = []
            
            // Loop through blocks in batches
            for (let currentBlock = startBlock; currentBlock < endBlock; currentBlock += batchSize) {
                const batchEndBlock = Math.min(currentBlock + batchSize - 1, endBlock)
                
                try {
                    console.log(`Querying batch from ${currentBlock} to ${batchEndBlock}`)
                    const batchEvents = await this.factory.queryFilter(
                        filter,
                        currentBlock,
                        batchEndBlock
                    )
                    
                    // Handle events that failed to decode
                    const processedEvents = batchEvents.map(event => {
                        if (event.args === null && event.data) {
                            // Parse the pool address from data field
                            // Pool address is the last 20 bytes of the data
                            const poolAddress = '0x' + event.data.slice(-40)
                            return {
                                ...event,
                                args: {
                                    token0: event.topics[1],
                                    token1: event.topics[2],
                                    fee: parseInt(event.topics[3], 16),
                                    pool: poolAddress
                                }
                            }
                        }
                        return event
                    })
                    
                    allEvents = [...allEvents, ...processedEvents]
                    
                    // Add delay between batches (500ms)
                    if (currentBlock + batchSize < endBlock) {
                        await new Promise(resolve => setTimeout(resolve, 500))
                    }
                } catch (error) {
                    console.error(`Failed to fetch events for batch ${currentBlock}-${batchEndBlock}:`, error)
                    throw error
                }
            }
            console.log('Total events found:', allEvents.length)
            console.log('All events:', allEvents)
            return allEvents
                .map(event => event.args?.pool)
                .filter(address => address && address !== this.addressZero)
        } catch (error) {
            console.error('Failed to get pools:', error)
            throw error
        }
    }

    async getPoolByAddress(poolAddress: string): Promise<ethers.Contract> {
        const pool = new ethers.Contract(poolAddress, this.POOL_ABI, this.provider)
        this.pools?.push(pool) // add pool to the pools array
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

    startListening(pool: ethers.Contract, delayMs?: number){
        pool.on('Swap', async (
            sender: string, 
            recipient: string, 
            amount0: ethers.BigNumber, 
            amount1: ethers.BigNumber, 
            sqrtPriceX96: ethers.BigNumber, 
            liquidity: ethers.BigNumber, 
            tick: number
        ) => {
            // Add optional delay if specified
            if (delayMs) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }

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
            
            if (this.onSwapCallback) {
                this.onSwapCallback(swapData)
            }
        })
    }

    stopListening(){
        if (this.pools) {
            for (const pool of this.pools) {
                pool.removeAllListeners('Swap')
            }
        }
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
}

