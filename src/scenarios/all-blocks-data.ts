import { BlockField, HexOutput, Query, StreamConfig } from "@envio-dev/hypersync-client";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  return {
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
        // BlockField.L1BlockNumber, // Not on Mainnet - only arbitrum and similar
        // BlockField.SendCount, // Not on Mainnet - only arbitrum and similar
        // BlockField.SendRoot, // Not on Mainnet - only arbitrum and similar
        BlockField.MixHash
      ]
    },
    includeAllBlocks: true,
  }
};

export const streamingConfig: StreamConfig = {
  hexOutput: HexOutput.Prefixed
};
