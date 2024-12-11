import { HexOutput, LogField } from "@envio-dev/hypersync-client";

import { Query, StreamConfig } from "@envio-dev/hypersync-client";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  return {
    fromBlock,
    toBlock,
    logs: [{}], // Empty log selection means all logs
    fieldSelection: {
      log: [
        // LogField.Removed, // Not relevant for us
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
  }
};

export const streamingConfig: StreamConfig = {
  hexOutput: HexOutput.Prefixed
};
