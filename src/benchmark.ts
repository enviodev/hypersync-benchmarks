import { HypersyncClient, Decoder, TransactionField, LogField, BlockField, TraceField, Query, StreamConfig, presetQueryLogs, presetQueryBlocksAndTransactions, presetQueryBlocksAndTransactionHashes, HexOutput } from "@envio-dev/hypersync-client";
import { performance, PerformanceObserver } from 'node:perf_hooks';
import * as fs from 'fs';
import * as path from 'path';
import { countAllRowsRetrieved } from "./lib/count-parquet-rows";

const BLOCK_RANGE = 100_000;

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
  // Setup Performance Observer to log measures
  let performanceResultString = '';
  const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      performanceResultString += `[Performance] ${entry.name}: ${entry.duration.toFixed(2)} ms\n`;
    });
    performance.clearMarks();
    performance.clearMeasures();
    obs.disconnect();
  });
  obs.observe({ entryTypes: ['measure'] });

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

  // Start performance measurement
  performance.mark('fetch-start');

  // Fetch data using streaming
  const receiver = await client.collectParquet(parquetFolderName, createQuery(fromBlock, toBlock), streamingConfig);

  // End performance measurement
  performance.mark('fetch-end');
  performance.measure('Benchmark Duration', 'fetch-start', 'fetch-end');
  const measures = performance.getEntriesByName('Benchmark Duration');

  console.log(`Benchmarking scenario: ${scenario} `);
  console.log(`Time taken for data fetching: ${measures[0].duration.toFixed(2)} milliseconds`);

  // Clear performance entries
  performance.clearMarks();
  performance.clearMeasures();

  let resultCounts = await countAllRowsRetrieved(parquetFolderName, fetchedDataTypes);
  console.log(resultCounts);
  console.log(performanceResultString);

  // write the results to a file
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
