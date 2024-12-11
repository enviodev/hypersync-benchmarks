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

## Notes

While HyperSync excels at fetching all the data and returning it where it really shines is filterring the data.

Please feel free to experiment with creating your own scenarios that include multiple contracts / events etc.

Network latency plays a big factor in the speed of these tests. If you have a bad internet connection with high latency and lots of dropped packets, the benchmarks will perform badly. At the time of writing the Envio team has a cluster in Frankfurt and in Chicago, by default traffic goes to Frankfurt - let us know if you want to use the Chicago cluster.

These benchmarks include the time it takes to decode your events and the time it takes to save all of the data into parquet files. We believe that this is fair - since in real world usage you would likely save the data to disk and want decoded events.

