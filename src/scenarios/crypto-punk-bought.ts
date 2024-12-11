import { HexOutput, LogField, Query, StreamConfig } from "@envio-dev/hypersync-client";
import { SAVE_DATA_AS_PARQUET } from "../config";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  return {
    fromBlock,
    toBlock,
    logs: [{
      topics: [['0x58e5d5a525e3b40bc15abaa38b5882678db1ee68befd2f60bafe3a7fd06db9e3']],
    }],
    fieldSelection: {
      log: [
        // LogField.Removed,
        // LogField.LogIndex,
        // LogField.TransactionIndex,
        // LogField.TransactionHash,
        // LogField.BlockHash,
        // LogField.BlockNumber,
        // LogField.Address,
        LogField.Data,
        LogField.Topic0,
        LogField.Topic1,
        LogField.Topic2,
        LogField.Topic3
      ],
    }
  };
};

export const streamingConfig: StreamConfig = {
  hexOutput: HexOutput.Prefixed,
  eventSignature: SAVE_DATA_AS_PARQUET ? "PunkBought(uint256 indexed punkIndex, uint256 value, address indexed fromAddress, address indexed toAddress)" : undefined,
};

export const fetchedDataTypes = SAVE_DATA_AS_PARQUET ? ['logs', 'decoded_logs'] : ['logs'];
