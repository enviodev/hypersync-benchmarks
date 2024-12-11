import { HypersyncClient, Decoder, TransactionField, Query } from "@envio-dev/hypersync-client";

async function main() {
  // Create hypersync client using the mainnet hypersync endpoint
  const client = HypersyncClient.new();

  // The query to run
  const query: Query = {
    "fromBlock": 0,
    "transactions": [
      {},
    ],
    "fieldSelection": {
      "transaction": [
        TransactionField.BlockNumber,
        TransactionField.Hash,
        TransactionField.From,
        TransactionField.To,
        TransactionField.Value,
      ]
    }
  };

  // Stream data in reverse order
  //
  // This will parallelize internal requests so we don't have to worry about pipelining/parallelizing make request -> handle response -> handle data loop
  const receiver = await client.stream(query, { reverse: true });

  while (true) {
    let res = await receiver.recv();
    if (res === null) {
      console.log("No data to receive, waiting for more data...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }
    for (const tx of res.data.transactions) {
      console.log(tx);
    }
  }
}

main();
