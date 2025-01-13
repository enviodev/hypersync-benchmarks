# Basic data fetch benchmarks for hypersync

## Results

**Blocks Scanned:** 100,000 most recent on Ethereum Mainnet

| Scenario | Runs | Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- | --- | --- |
| all-blocks-data | 3 | 1.47 | 1.74 | 1.59 | 1.56 |
| all-logs | 3 | 24.92 | 25.43 | 25.13 | 25.05 |
| all-transactions | 3 | 44.27 | 45.88 | 45.05 | 45.00 |
| all-traces | 3 | 75.86 | 78.23 | 76.74 | 76.13 |
| all-ens-name-registerred | 3 | 3.87 | 4.66 | 4.38 | 4.60 |
| crypto-punk-bought | 3 | 0.18 | 0.18 | 0.18 | 0.18 |
| erc-20-and-721-transfers | 3 | 12.19 | 12.40 | 12.31 | 12.35 |
| all-usdc-transfers | 3 | 2.46 | 2.59 | 2.51 | 2.49 |
| everything | 3 | 136.90 | 138.11 | 137.46 | 137.37 |

These results are shown in detail in the [Hetzner-100-000-blocks.md](./benchmarks/Hetzner-100-000-blocks.md) file.

## Setup

```bash
pnpm install
```

## Run benchmarks

Specific benchmark:
```bash
pnpm benchmark <scenario>
```

All benchmarks:
```bash
pnpm multi-runner # runs all benchmarks 3 times (can be configured at the top of the `scripts/multi-runner.ts` file)
pnpm format-aggregate-results # formats the results into a markdown summary.
```

### Available Scenarios

- `all-blocks-data`
- `all-logs`
- `all-transactions`
- `all-traces`
- `all-ens-name-registerred`
- `crypto-punks-bought`
- `erc-20-and-721-transfers`
- `all-usdc-transfers`
- `everything`

The results will be saved in the 'results' folder with the schenario that was run - the raw data (in parquet format) that was fetched, and the benchmark results in a text file.

You can use a parquet viewer such as a plugin for VSCode like [Parquet Explorer](https://marketplace.visualstudio.com/items?itemName=AdamViola.parquet-explorer) to view the parquet files.

## Notes

While HyperSync excels at fetching all the data and returning it where it really shines is filterring the data (eg. fetching only the events of a set of types with specific topic filters, or set of transactions from a certain EOA). In the benchmark for `crypto-punk-bought` we fetched only 58 logs, but very short time (0.18s average to fetch and decode).

Please feel free to experiment with creating your own scenarios that include multiple contracts / events etc. See more in the [docs](https://docs.envio.dev/docs/HyperSync/hypersync-query) on hypersync query format

Network latency and bandwidth plays a big factor in the speed of these tests. If you have a bad internet connection with high latency and lots of dropped packets, the benchmarks will perform badly. At the time of writing the Envio team has a cluster in Frankfurt and in Chicago, by default traffic goes to Frankfurt - let us know if you want to use the Chicago cluster.

These benchmarks include the time it takes to decode your events and the time it takes to save all of the data into parquet files. We believe that this is fair - since in real world usage you would likely save the data to disk and want decoded events.

HyperSync also excells at scanning larger ranges of blocks than just the last 100000 blocks - this is easy to configure by editing the `BLOCK_RANGE` variable in the `src/benchmark.ts` file.

While these examples are written in Typescript, HyperSync libraries are also available in Python, Rust, and Golang. Additionally a json API is exposed - but is less efficient than the Apache Arrow Flight (binary) transport that is used in these clients.

These benchmarks fetch more data than is typically needed for most indexing aplications - and the less columns you fetch the faster the benchmarks results will be.

Our system doesn't do any caching of the data since the variety of query types is so broad - it didn't make sense to implement a caching. So there is no such thing as a 'cold' vs 'hot' run in this benchmark.

## Config

You can change the config in the `src/config.ts` file.

- `SAVE_DATA_AS_PARQUET` - default is true. If false, the data will be streamed in batches. This in nice for seeing real-time progress. Saving to parquet has slight overhead.
- `BLOCK_RANGE` - the number of blocks from the current block that will be scanned.
