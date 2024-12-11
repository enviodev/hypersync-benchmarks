import { TraceField, HexOutput, Query, StreamConfig } from "@envio-dev/hypersync-client";

export const createQuery = (fromBlock: number, toBlock: number): Query => {
  return {
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
};

export const streamingConfig: StreamConfig = {
  hexOutput: HexOutput.Prefixed
};

export const fetchedDataTypes = ['traces'];
