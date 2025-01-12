import * as fs from 'fs';

/**

 Usage:
   ts-node scripts/format-aggregate-results.ts <path-to-json> [--summary]

 - <path-to-json>: The path to the JSON file with the aggregated benchmark results.
 - --summary: (Optional) If provided, prints only a summary row for each benchmark scenario. 
              Otherwise prints a more detailed multi-table output for each scenario.

 Example:
   ts-node scripts/format-aggregate-results.ts ./aggregate-results-2025-01-12_19:35.json
   ts-node scripts/format-aggregate-results.ts ./aggregate-results-2025-01-12_19:35.json --summary

*/

function createDetailedMarkdownTable(data: any) {
  let output = '';

  // Calculate blocks scanned from first scenario's first run
  const firstScenario = Object.values(data)[0] as any;
  const firstRun = firstScenario.runs[0];
  const blocksScanned = firstRun.toBlock - firstRun.fromBlock;
  output += `**Blocks Scanned:** ${blocksScanned.toLocaleString()}\n\n`;

  for (const scenario of Object.keys(data)) {
    const { runs, stats } = data[scenario];

    output += `\n## Scenario: ${scenario}\n\n`;

    //
    // Table: High-level Stats
    //
    output += `**Overall Stats**\n\n`;
    output += `| Min (s) | Max (s) | Avg (s) | Median (s) |\n`;
    output += `| --- | --- | --- | --- |\n`;
    output += `| ${(stats.min / 1000).toFixed(2)} | ${(stats.max / 1000).toFixed(2)} | ${(stats.average / 1000).toFixed(2)} | ${(stats.median / 1000).toFixed(2)} |\n\n`;

    //
    // Table: Each run
    //
    output += `**Detailed Runs** (total ${runs.length})\n\n`;
    output += `| Run # | Block Range | Performance (ms) | Entities |\n`;
    output += `| --- | --- | --- | --- |\n`;
    runs.forEach((run: any, index: number) => {
      const fromBlock = run.fromBlock ?? 'N/A';
      const toBlock = run.toBlock ?? 'N/A';
      const blockRange = `${fromBlock} → ${toBlock}`;
      const perf = run.performanceResult?.toFixed(2) ?? 'N/A';

      // We'll want to show the resultCounts, might be an array or an object:
      // If resultCounts is an array of {type, totalRows}, we'll map them:
      let entityString = '';
      if (Array.isArray(run.resultCounts)) {
        // Start of Selection
        entityString = run.resultCounts.map(
          (entry: any) => `${entry.type === 'logs' ? 'raw_logs' : entry.type}: ${entry.totalRows}`
        ).join('<br>');
      } else {
        // If it was structured differently, we can adapt
        entityString = JSON.stringify(run.resultCounts, null, 2)
          .replace(/\n/g, '<br>')
          .replace(/\s/g, '&nbsp;')
      }

      output += `| ${index + 1} | ${blockRange} | ${perf} | ${entityString} |\n`;
    });

    output += '\n';
  }

  return output;
}

function createSummaryMarkdownTable(data: any) {
  // Calculate blocks scanned from first scenario's first run
  const firstScenario = Object.values(data)[0] as any;
  const firstRun = firstScenario.runs[0];
  const blocksScanned = firstRun.toBlock - firstRun.fromBlock;
  let output = `**Blocks Scanned:** ${blocksScanned.toLocaleString()}\n\n`;

  // Print just a table row for each scenario
  output += `| Scenario | Runs | Min (s) | Max (s) | Avg (s) | Median (s) |\n`;
  output += `| --- | --- | --- | --- | --- | --- |\n`;

  for (const scenario of Object.keys(data)) {
    const { runs, stats } = data[scenario];
    output += `| ${scenario} | ${runs.length} | ${(stats.min / 1000).toFixed(2)} | ${(stats.max / 1000).toFixed(2)} | ${(stats.average / 1000).toFixed(2)} | ${(stats.median / 1000).toFixed(2)} |\n`;
  }

  return output;
}

function findLatestAggregateFile(): string | null {
  const files = fs.readdirSync('.');
  const aggregateFiles = files.filter(f => f.startsWith('aggregate-results-') && f.endsWith('.json'));

  if (aggregateFiles.length === 0) {
    return null;
  }

  // Sort files by date in filename (newest first)
  return aggregateFiles.sort().reverse()[0];
}

async function main() {
  const args = process.argv.slice(2);
  const summaryMode = args.includes('--summary');

  // If no file specified, try to find latest
  let filePath = args[0];
  if (!filePath || filePath === '--summary') {
    let maybeFilePath = findLatestAggregateFile();
    if (!maybeFilePath) {
      console.error('No aggregate results file found. Please run the multi benchmark case first.');
      process.exit(1);
    }
    filePath = maybeFilePath;
    console.log(`Using latest results file: ${filePath}`);
  }

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file "${filePath}":`, err);
    process.exit(1);
  }

  let data: any;
  try {
    data = JSON.parse(content);
  } catch (err) {
    console.error(`Error parsing JSON from "${filePath}":`, err);
    process.exit(1);
  }

  let output = '';
  if (summaryMode) {
    output = createSummaryMarkdownTable(data);
  } else {
    output = createDetailedMarkdownTable(data);
  }

  // Print to console
  console.log(output);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 
