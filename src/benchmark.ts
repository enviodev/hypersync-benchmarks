import { HypersyncClient, Decoder, TransactionField, LogField, BlockField, TraceField, Query, StreamConfig, presetQueryLogs, presetQueryBlocksAndTransactions, presetQueryBlocksAndTransactionHashes, HexOutput } from "@envio-dev/hypersync-client";
import { performance, PerformanceObserver } from 'node:perf_hooks';
import * as fs from 'fs';
import * as path from 'path';
import { countAllRowsRetrieved } from "./lib/count-parquet-rows";
import { BLOCK_RANGE, SAVE_DATA_AS_PARQUET } from "./config";

type QueryResponseData = {
  [key: string]: any[]; // Adjust this type based on the actual structure
};

// Helper function to get the current Ethereum height using fetch
async function getCurrentHeight(): Promise<number> {
  const response = await fetch('https://eth.hypersync.xyz/height');
  if (!response.ok) {
    throw new Error(`Failed to fetch current height: ${response.statusText}`);
  }
  const data = await response.json();
  return data.height;
}

// Main benchmarking function
async function benchmark(scenario: string) {
  // Create HyperSync client
  const client = HypersyncClient.new();

  // Get current Ethereum height to calculate the block range
  const currentHeight = await getCurrentHeight();
  const fromBlock = currentHeight - BLOCK_RANGE;
  const toBlock = currentHeight;

  let createQuery, streamingConfig, fetchedDataTypes;

  try {
    ({ createQuery, streamingConfig, fetchedDataTypes } = require(`./scenarios/${scenario}`));
  } catch (error) {
    console.error(`Error loading scenario - make sure it exists '${scenario}':`, error);
    process.exit(1);
  }

  const parquetFolderName = `results/${scenario}/${fromBlock}-${toBlock}`;

  console.log(`Benchmarking scenario: ${scenario}`);
  console.log(`Fetching data from block ${fromBlock} to block ${toBlock}`);

  // Start performance measurement
  performance.mark('fetch-start');

  // Fetch data
  let totalItemsOfType: { [key: string]: number } = {};
  if (SAVE_DATA_AS_PARQUET) {
    // show a dot every 5 seconds to indicate progress
    const intervalId = setInterval(() => {
      process.stdout.write('.');
    }, 2000);

    await client.collectParquet(parquetFolderName, createQuery(fromBlock, toBlock), streamingConfig);

    clearInterval(intervalId);
    console.log('\nDone!');
  } else {
    const receiver = await client.stream(createQuery(fromBlock, toBlock), streamingConfig);

    let totalItems = 0;
    const allData: any[] = [];

    while (true) {
      const res = await receiver.recv();
      if (res === null) {
        break; // No more data
      }

      let fetchProgress = "Batch fetched:\n";
      for (const type of fetchedDataTypes) {
        let fetchedDataOfType: any[] | undefined = ((res.data as any) as { [key: string]: any[] })[type];
        if (fetchedDataOfType && fetchedDataOfType.length > 0) {
          totalItemsOfType[type] = (totalItemsOfType[type] || 0) + fetchedDataOfType.length;
          fetchProgress += `[${type}] ${fetchedDataOfType.length}\n`;
        }
      }
      console.log(fetchProgress);
    }
  }

  // End performance measurement
  performance.mark('fetch-end');
  performance.measure('Benchmark Duration', 'fetch-start', 'fetch-end');
  const measures = performance.getEntriesByName('Benchmark Duration');

  let performanceResultString = `Time taken for data fetching: ${measures[0].duration.toFixed(2)} milliseconds`;

  let resultCounts = "";
  if (SAVE_DATA_AS_PARQUET) {
    resultCounts = await countAllRowsRetrieved(parquetFolderName, fetchedDataTypes);
  } else {
    for (const type of fetchedDataTypes) {
      resultCounts += `[${type}] ${totalItemsOfType[type]}\n`;
    }
  }

  console.log("---------------------------\nFetching complete. Results:");
  console.log(resultCounts);
  console.log(performanceResultString);

  // write the results to a file
  fs.mkdirSync(parquetFolderName, { recursive: true });
  fs.writeFileSync(`${parquetFolderName}/results.txt`, `${resultCounts}\n${performanceResultString}`);
}

// Entry point
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: ts-node src/benchmark.ts <scenario> [modification]');
    console.error('Available scenarios:');
    console.error('  - all-blocks-data');
    console.error('  - all-logs');
    console.error('  - all-transactions');
    console.error('  - all-traces');
    console.error('  - all-ens-name-registerred');
    console.error('  - crypto-punks-bought');
    console.error('  - erc-20-and-721-transfers');
    console.error('  - all-usdc-transfers');
    console.error('  - everything');
    process.exit(1);
  }

  const scenario = args[0];

  await benchmark(scenario);
}

main().catch((error) => {
  console.error('An error occurred:', error);
});
