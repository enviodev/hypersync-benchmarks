import { HexOutput, LogField, Decoder, Query, StreamConfig } from "@envio-dev/hypersync-client";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  const usdcContractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
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
  eventSignature: 'Transfer(address indexed from, address indexed to, uint256 value)'
}; 
