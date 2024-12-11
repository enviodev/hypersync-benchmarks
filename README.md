# Basic data fetch benchmarks for hypersync

## Setup

```bash
pnpm install
```

## Run benchmarks

```bash
pnpm benchmark <scenario>
```

### Available Scenarios

- `all logs`: Retrieves every log entry within the block range.
- `all transactions`: Fetches all transactions within the block range.
- `all block headers`: Gets all block headers within the specified range.
- `erc-20 transfers`: Retrieves all ERC-20 transfer events.
- `erc-721 transfers`: Retrieves all NFT transfer events.
- `all usdc transfers`: Fetches all USDC token transfer events.
- `all traces`: Retrieves all transaction traces within the block range.
- `everything`: Fetches all available data (logs, transactions, traces, and blocks).
