import path from "path";
import { ParquetReader } from '@dsnp/parquetjs';

async function countRowsInParquetFile(filePath: string): Promise<number> {
  const reader = await ParquetReader.openFile(filePath);
  const totalRows = reader.metadata?.row_groups.reduce((sum, rg) => sum + rg.num_rows.toNumber(), 0);
  await reader.close();
  return totalRows ?? 0;
}

const countRowsRetrieved = async (dirPath: string, type: string) => {
  const parquetFilePath = path.join(dirPath, `${type}.parquet`);
  const totalRows = await countRowsInParquetFile(parquetFilePath);
  return `Total ${type} fetched: ${totalRows}`;
}

export const countAllRowsRetrieved = async (dirPath: string, types: string[]) => {
  const results = await Promise.all(types.map(type => countRowsRetrieved(dirPath, type)));
  return results.join('\n');
}

