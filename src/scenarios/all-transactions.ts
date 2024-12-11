import { TransactionField, HexOutput, Query, StreamConfig } from "@envio-dev/hypersync-client";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  return {
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
};

export const streamingConfig: StreamConfig = {
  hexOutput: HexOutput.Prefixed
};

export const fetchedDataTypes = ['transactions'];
