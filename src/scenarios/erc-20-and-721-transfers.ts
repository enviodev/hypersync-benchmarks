import { HexOutput, LogField, Decoder, Query, StreamConfig } from "@envio-dev/hypersync-client";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  const erc20TransferTopic = 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a6a9c8fef15';
  return {
    fromBlock,
    toBlock,
    logs: [{
      topics: [[`0x${erc20TransferTopic}`]],
    }],
    fieldSelection: {
      log: [
        LogField.TransactionHash,
        LogField.BlockNumber,
        LogField.Address,
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
  // NOTE: we can't decode these all in a batch without looking at the number of indexed fields. Since ERC20 and ERC721
  //       have different numbers of indexed fields, we can't use a single decoder for both.
  //       We would have to count the number of indexed fields and determine which decoder to use based on that.
  // eventSignature: 'Transfer(address indexed from, address indexed to, uint256 value)'
};

