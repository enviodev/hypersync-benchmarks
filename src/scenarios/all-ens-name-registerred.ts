import { HexOutput, LogField, Decoder, Query, StreamConfig } from "@envio-dev/hypersync-client";
import { SAVE_DATA_AS_PARQUET } from "../config";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  const usdcContractAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';
  const transferTopic = '0xb3d987963d01b2f68493b4bdb130988f157ea43070d4ad840fee0466ed9370d9';
  return {
    fromBlock,
    toBlock,
    logs: [{
      address: [usdcContractAddress],
      topics: [[transferTopic]],
    }],
    fieldSelection: {
      log: [
        LogField.TransactionHash,
        LogField.BlockNumber,
        LogField.Data,
        LogField.Topic0,
        LogField.Topic1,
        LogField.Topic2,
        LogField.Topic3
      ],
    },
  };
};

export const streamingConfig: StreamConfig = {
  hexOutput: HexOutput.Prefixed,
  eventSignature: SAVE_DATA_AS_PARQUET ? 'NameRegistered(uint256 indexed id, address indexed owner, uint256 expires)' : undefined,
};

export const fetchedDataTypes = SAVE_DATA_AS_PARQUET ? ['logs', 'decoded_logs'] : ['logs'];
