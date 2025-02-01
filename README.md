# Base Network DEX Monitor

A React application for monitoring swaps on Base Network DEX pools.
As of now, this application allows to pass two token addresses and a fee to monitor a specific pool.
Registered swaps are displayed in a UI.

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

## Prerequisites

- Node.js (v16 or higher recommended)
- pnpm package manager

## Notes:
- The application as of now does not support monitoring all pools.
- The application as of now does not support monitoring a pool by its address.

## License:
- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
- Essentially, feel free to use this code for your own projects.