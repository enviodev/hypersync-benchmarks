import { HypersyncClient, Decoder, TransactionField, LogField, BlockField, TraceField, Query, StreamConfig, presetQueryLogs, presetQueryBlocksAndTransactions, presetQueryBlocksAndTransactionHashes } from "@envio-dev/hypersync-client";
import { performance, PerformanceObserver } from 'node:perf_hooks';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to get the current Ethereum height using fetch
async function getCurrentHeight(): Promise<number> {
  const response = await fetch('https://eth.hypersync.xyz/height');
  if (!response.ok) {
    throw new Error(`Failed to fetch current height: ${response.statusText}`);
  }
  const data = await response.json();
  return data.height;
}

// Helper function to write data to Parquet (placeholder implementation)
async function saveToParquet(filename: string, data: any): Promise<void> {
  // Placeholder: Implement actual Parquet saving logic here
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

// Main benchmarking function
async function benchmark(scenario: string, modification?: string) {
  // Create HyperSync client
  const client = HypersyncClient.new();

  // Performance marks for benchmarking
  performance.mark('benchmark-start');

  // Get current Ethereum height
  const currentHeight = await getCurrentHeight();
  const fromBlock = currentHeight - 100_000;
  const toBlock = currentHeight;

  // Define the query and streamConfig based on the scenario
  let query: Query;
  let streamConfig: StreamConfig = { reverse: false };
  let decoder: Decoder | null = null;
  let outputFilename: string | null = null;

  switch (scenario.toLowerCase()) {
    case 'all-logs':
      query = {
        fromBlock,
        toBlock,
        logs: [{}], // Empty log selection means all logs
        fieldSelection: {
          log: [
            LogField.Removed,
            LogField.LogIndex,
            LogField.TransactionIndex,
            LogField.TransactionHash,
            LogField.BlockHash,
            LogField.BlockNumber,
            LogField.Address,
            LogField.Data,
            LogField.Topic0,
            LogField.Topic1,
            LogField.Topic2,
            LogField.Topic3
          ]
        },
      };
      break;

    case 'all-transactions':
      query = {
        fromBlock,
        toBlock,
        transactions: [{}], // Empty transaction selection means all transactions
        fieldSelection: {
          transaction: [
            TransactionField.BlockHash,
            TransactionField.BlockNumber,
            TransactionField.From,
            TransactionField.Gas,
            TransactionField.GasPrice,
            TransactionField.Hash,
            TransactionField.Input,
            TransactionField.Nonce,
            TransactionField.To,
            TransactionField.TransactionIndex,
            TransactionField.Value,
            TransactionField.V,
            TransactionField.R,
            TransactionField.S,
            TransactionField.YParity,
            TransactionField.MaxPriorityFeePerGas,
            TransactionField.MaxFeePerGas,
            TransactionField.ChainId,
            TransactionField.AccessList,
            TransactionField.MaxFeePerBlobGas,
            TransactionField.BlobVersionedHashes,
            TransactionField.CumulativeGasUsed,
            TransactionField.EffectiveGasPrice,
            TransactionField.GasUsed,
            TransactionField.ContractAddress,
            TransactionField.LogsBloom,
            TransactionField.Kind,
            TransactionField.Root,
            TransactionField.Status,
            TransactionField.L1Fee,
            TransactionField.L1GasPrice,
            TransactionField.L1GasUsed,
            TransactionField.L1FeeScalar,
            TransactionField.GasUsedForL1
          ]
        },
      };
      break;

    case 'all-block-headers':
      query = {
        fromBlock,
        toBlock,
        blocks: [{}],
        fieldSelection: {
          block: [
            BlockField.Number,
            BlockField.Hash,
            BlockField.ParentHash,
            BlockField.Nonce,
            BlockField.Sha3Uncles,
            BlockField.LogsBloom,
            BlockField.TransactionsRoot,
            BlockField.StateRoot,
            BlockField.ReceiptsRoot,
            BlockField.Miner,
            BlockField.Difficulty,
            BlockField.TotalDifficulty,
            BlockField.ExtraData,
            BlockField.Size,
            BlockField.GasLimit,
            BlockField.GasUsed,
            BlockField.Timestamp,
            BlockField.Uncles,
            BlockField.BaseFeePerGas,
            BlockField.BlobGasUsed,
            BlockField.ExcessBlobGas,
            BlockField.ParentBeaconBlockRoot,
            BlockField.WithdrawalsRoot,
            BlockField.Withdrawals,
            BlockField.L1BlockNumber,
            BlockField.SendCount,
            BlockField.SendRoot,
            BlockField.MixHash
          ]
        },
        includeAllBlocks: true,
      };
      break;

    case 'all-traces':
      query = {
        fromBlock,
        toBlock,
        traces: [{}], // Empty trace selection means all traces
        fieldSelection: {
          trace: [
            TraceField.From,
            TraceField.To,
            TraceField.CallType,
            TraceField.Gas,
            TraceField.Input,
            TraceField.Init,
            TraceField.Value,
            TraceField.Author,
            TraceField.RewardType,
            TraceField.BlockHash,
            TraceField.BlockNumber,
            TraceField.Address,
            TraceField.Code,
            TraceField.GasUsed,
            TraceField.Output,
            TraceField.Subtraces,
            TraceField.TraceAddress,
            TraceField.TransactionHash,
            TraceField.TransactionPosition,
            TraceField.Kind,
            TraceField.Error
          ]
        },
      };
      break;

    case 'erc-20-transfers':
      // The topic0 for ERC-20 Transfer event
      const erc20TransferTopic = 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a6a9c8fef15';
      query = {
        fromBlock,
        toBlock,
        logs: [{
          topics: [[`0x${erc20TransferTopic}`]],
        }],
        fieldSelection: {
          log: [
            LogField.Removed,
            LogField.LogIndex,
            LogField.TransactionIndex,
            LogField.TransactionHash,
            LogField.BlockHash,
            LogField.BlockNumber,
            LogField.Address,
            LogField.Data,
            LogField.Topic0,
            LogField.Topic1,
            LogField.Topic2,
            LogField.Topic3
          ],
          transaction: [TransactionField.Hash], // Include transaction hash
        },
      };
      // Handle modifications
      if (modification) {
        if (modification.toLowerCase() === 'decoded') {
          decoder = Decoder.fromSignatures(['Transfer(address,address,uint256)']);
        } else if (modification.toLowerCase() === 'saved-to-parquet') {
          outputFilename = path.join('output', `erc20_transfers_${fromBlock}_${toBlock}.parquet`);
        }
      }
      break;

    case 'erc-721-transfers':
      // The topic0 for ERC-721 Transfer event
      const erc721TransferTopic = 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a6a9c8fef15';
      query = {
        fromBlock,
        toBlock,
        logs: [{
          topics: [[`0x${erc721TransferTopic}`]],
        }],
        fieldSelection: {
          log: [
            LogField.Removed,
            LogField.LogIndex,
            LogField.TransactionIndex,
            LogField.TransactionHash,
            LogField.BlockHash,
            LogField.BlockNumber,
            LogField.Address,
            LogField.Data,
            LogField.Topic0,
            LogField.Topic1,
            LogField.Topic2,
            LogField.Topic3

          ],
          transaction: [TransactionField.Hash], // Include transaction hash
        },
      };
      // Handle modifications
      if (modification) {
        if (modification.toLowerCase() === 'decoded') {
          decoder = Decoder.fromSignatures(['Transfer(address,address,uint256)']);
        } else if (modification.toLowerCase() === 'saved-to-parquet') {
          outputFilename = path.join('output', `erc721_transfers_${fromBlock}_${toBlock}.parquet`);
        }
      }
      break;

    case 'all-usdc-transfers':
      // USDC contract address and Transfer event topic
      const usdcContractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      const transferTopic = 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a6a9c8fef15';
      query = {
        fromBlock,
        toBlock,
        logs: [{
          address: [usdcContractAddress],
          topics: [[`0x${transferTopic}`]],
        }],
        fieldSelection: {
          log: [
            LogField.Removed,
            LogField.LogIndex,
            LogField.TransactionIndex,
            LogField.TransactionHash,
            LogField.BlockHash,
            LogField.BlockNumber,
            LogField.Address,
            LogField.Data,
            LogField.Topic0,
            LogField.Topic1,
            LogField.Topic2,
            LogField.Topic3
          ],
          transaction: [TransactionField.Hash], // Include transaction hash
        },
      };
      // Handle modifications
      if (modification) {
        if (modification.toLowerCase() === 'decoded') {
          decoder = Decoder.fromSignatures(['Transfer(address,address,uint256)']);
        } else if (modification.toLowerCase() === 'saved-to-parquet') {
          outputFilename = path.join('output', `usdc_transfers_${fromBlock}_${toBlock}.parquet`);
        }
      }
      break;

    case 'everything':
      query = {
        fromBlock,
        toBlock,
        logs: [{}],
        transactions: [{}],
        traces: [{}],
        blocks: [{}],
        fieldSelection: {
          log: [
            LogField.Removed,
            LogField.LogIndex,
            LogField.TransactionIndex,
            LogField.TransactionHash,
            LogField.BlockHash,
            LogField.BlockNumber,
            LogField.Address,
            LogField.Data,
            LogField.Topic0,
            LogField.Topic1,
            LogField.Topic2,
            LogField.Topic3
          ],
          transaction: [
            TransactionField.BlockHash,
            TransactionField.BlockNumber,
            TransactionField.From,
            TransactionField.Gas,
            TransactionField.GasPrice,
            TransactionField.Hash,
            TransactionField.Input,
            TransactionField.Nonce,
            TransactionField.To,
            TransactionField.TransactionIndex,
            TransactionField.Value,
          ],
          block: [BlockField.Number, BlockField.Hash, BlockField.ParentHash, BlockField.Nonce, BlockField.Sha3Uncles, BlockField.LogsBloom, BlockField.TransactionsRoot, BlockField.StateRoot, BlockField.ReceiptsRoot, BlockField.Miner, BlockField.Difficulty, BlockField.TotalDifficulty, BlockField.ExtraData, BlockField.Size, BlockField.GasLimit, BlockField.GasUsed, BlockField.Timestamp, BlockField.Uncles, BlockField.BaseFeePerGas, BlockField.BlobGasUsed, BlockField.ExcessBlobGas, BlockField.ParentBeaconBlockRoot, BlockField.WithdrawalsRoot, BlockField.Withdrawals, BlockField.L1BlockNumber, BlockField.SendCount, BlockField.SendRoot, BlockField.MixHash],
          trace: [TraceField.From, TraceField.To, TraceField.CallType, TraceField.Gas, TraceField.Input, TraceField.Init, TraceField.Value, TraceField.Author, TraceField.RewardType, TraceField.BlockHash, TraceField.BlockNumber, TraceField.Address, TraceField.Code, TraceField.GasUsed, TraceField.Output, TraceField.Subtraces, TraceField.TraceAddress, TraceField.TransactionHash, TraceField.TransactionPosition, TraceField.Kind, TraceField.Error]
        },
        includeAllBlocks: true,
      };
      break;

    default:
      console.error(`Unknown scenario: ${scenario}`);
      process.exit(1);
  }

  // Start performance measurement
  performance.mark('fetch-start');

  // Fetch data using streaming
  const receiver = await client.stream(query, streamConfig);

  let totalItems = 0;
  const allData: any[] = [];

  while (true) {
    const res = await receiver.recv();
    if (res === null) {
      break; // No more data
    }

    // Handle data based on scenario
    if (res.data.logs && res.data.logs.length > 0) {
      totalItems += res.data.logs.length;

      // Decode logs if decoder is provided
      if (decoder) {
        const decodedLogs = decoder.decodeLogsSync(res.data.logs);
        // You can process or output the decoded logs here
      }

      // Save to data array if we need to write to Parquet later
      if (outputFilename) {
        allData.push(...res.data.logs);
      }
    }
    if (res.data.transactions && res.data.transactions.length > 0) {
      totalItems += res.data.transactions.length;
    }
    if (res.data.blocks && res.data.blocks.length > 0) {
      totalItems += res.data.blocks.length;
    }
    if (res.data.traces && res.data.traces.length > 0) {
      totalItems += res.data.traces.length;
    }
  }

  // End performance measurement
  performance.mark('fetch-end');
  performance.measure('Benchmark Duration', 'fetch-start', 'fetch-end');
  const measures = performance.getEntriesByName('Benchmark Duration');

  performance.mark('benchmark-end');
  performance.measure('Total Benchmark Time', 'benchmark-start', 'benchmark-end');

  console.log(`Benchmarking scenario: ${scenario} ${modification ? `(${modification})` : ''}`);
  console.log(`Total items fetched: ${totalItems}`);
  console.log(`Time taken for data fetching: ${measures[0].duration.toFixed(2)} milliseconds`);

  const totalMeasures = performance.getEntriesByName('Total Benchmark Time');
  console.log(`Total benchmarking time: ${totalMeasures[0].duration.toFixed(2)} milliseconds`);

  // Save to Parquet if needed
  if (outputFilename) {
    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputFilename), { recursive: true });
    await saveToParquet(outputFilename, allData);
    console.log(`Data saved to Parquet file: ${outputFilename}`);
  }

  // Clear performance entries
  performance.clearMarks();
  performance.clearMeasures();
}

// Entry point
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: ts-node src/benchmark.ts <scenario> [modification]');
    console.error('Available scenarios:');
    console.error('  - all-logs');
    console.error('  - all-transactions');
    console.error('  - all-block-headers');
    console.error('  - erc-20-transfers');
    console.error('  - erc-721-transfers');
    console.error('  - all-usdc-transfers');
    console.error('  - all-traces');
    console.error('  - everything');
    process.exit(1);
  }

  const scenario = args[0];
  const modification = args[1];

  // Setup Performance Observer to log measures
  const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`[Performance] ${entry.name}: ${entry.duration.toFixed(2)} ms`);
    });
    performance.clearMarks();
    performance.clearMeasures();
    obs.disconnect();
  });
  obs.observe({ entryTypes: ['measure'] });

  await benchmark(scenario, modification);
}

main().catch((error) => {
  console.error('An error occurred:', error);
});
