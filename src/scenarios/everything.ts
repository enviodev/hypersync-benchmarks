import { BlockField, TransactionField, TraceField, LogField, HexOutput, Query, StreamConfig } from "@envio-dev/hypersync-client";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  return {
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
        // TransactionField.L1Fee, // Not relevant for Eth Mainnet
        // TransactionField.L1GasPrice, // Not relevant for Eth Mainnet
        // TransactionField.L1GasUsed, // Not relevant for Eth Mainnet
        // TransactionField.L1FeeScalar, // Not relevant for Eth Mainnet
        // TransactionField.GasUsedForL1 // Not relevant for Eth Mainnet
      ],
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
        BlockField.MixHash
      ],
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
    includeAllBlocks: true,
  };
};

export const streamingConfig: StreamConfig = {
  hexOutput: HexOutput.Prefixed
};

export const fetchedDataTypes = ['logs', 'transactions', 'traces', 'blocks'];
