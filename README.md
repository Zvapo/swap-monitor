# Base Network DEX Monitor

A React application for monitoring swaps on Base Network DEX pools.
As of now this application allows to:
- Monitor a swap pool based on two token addresses and a fee.
- Monitor all swaps in pools added to the last 200 blocks added to the factory.
- Monitor a swap pool based on its address.

All registered swaps are displayed in a UI.

## Prerequisites

- Node.js (v22.13.0)
- pnpm (v9.15.4)

## Setup
- The default network is Base.
- The default node provider is [base.llamarpc.com](https://base.llamarpc.com) from [Chainlist](https://chainlist.org/)
- You can change the network and node provider in the [vite.config.ts](./vite.config.ts) file.

## Installation

1. Install pnpm if you haven't already:
   ```bash
   npm install -g pnpm
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/Zvapo/Dex-monitor.git
   cd Dex-monitor
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

## Notes:
- Beware of the 429 error when monitoring all pools.

## License:
- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
- Essentially, feel free to use this code for your own projects.