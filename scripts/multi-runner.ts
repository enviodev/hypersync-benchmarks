import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';


///////////////////
// Configuration
///////////////////

// List of scenarios you want to run; feel free to trim or expand
const SCENARIOS = [
  'all-blocks-data',
  'all-logs',
  'all-transactions',
  'all-traces',
  'all-ens-name-registerred',
  'crypto-punk-bought',
  'erc-20-and-721-transfers',
  'all-usdc-transfers',
  'everything'
];

// How many times should each scenario be run?
const TIMES_TO_RUN_EACH_SCENARIO = 3;

///////////////////
// Config End
///////////////////

interface BenchmarkResult {
  fromBlock?: number;
  toBlock?: number;
  resultCounts: any;
  performanceResult: number; // in milliseconds
}

function getMedian(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  } else {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
}


// benchmark start-time - formatted as YYYY-MM-DD_HH:MM
const benchmarkStartTime = new Date().toISOString().replace('T', '_').slice(0, 16);
console.log(`${benchmarkStartTime}`);


async function runBenchmarks() {
  // We'll store the final aggregated results in this object
  const aggregatedResults: {
    [scenario: string]: {
      runs: BenchmarkResult[],
      stats: {
        min: number;
        max: number;
        average: number;
        median: number;
      }
    }
  } = {};

  for (const scenario of SCENARIOS) {
    console.log(`Running scenario: ${scenario}`);

    // For each scenario we keep track of all the run results
    const scenarioRunResults: BenchmarkResult[] = [];

    for (let i = 0; i < TIMES_TO_RUN_EACH_SCENARIO; i++) {
      // We give a unique folder suffix for each run
      const suffix = `${benchmarkStartTime}run-${i + 1}`;

      console.log(`  → Starting run #${i + 1} with suffix "${suffix}"...`);
      // This will sync-block until the command finishes
      execSync(`pnpm benchmark ${scenario} --save-json --folder-suffix "${suffix}"`, { stdio: 'inherit' });

      // The benchmark script writes output to:
      //    results/<scenario>/<fromBlock>-<toBlock>-<suffix>/results.json
      // We need to find that newly created folder to parse the JSON.

      // The simplest approach is to look within results/<scenario> for a directory that ends with '-<suffix>', 
      // then read its results.json.
      const scenarioDir = path.join('results', scenario);
      const possibleDirs = fs.readdirSync(scenarioDir);

      // Attempt to find the directory that ends with `-run-X`.
      // Because fromBlock-toBlock might vary or be unknown, we scan for the subfolder that ends with `-${suffix}`.
      const runDirectoryName = possibleDirs.find(d => d.endsWith(`-${suffix}`));

      if (!runDirectoryName) {
        console.error(`Could not find a directory for suffix: ${suffix}`);
        continue;
      }

      const runDirPath = path.join(scenarioDir, runDirectoryName);
      const resultJsonPath = path.join(runDirPath, 'results.json');
      if (!fs.existsSync(resultJsonPath)) {
        console.error(`No results.json found for run ${i + 1} of scenario ${scenario}.`);
        continue;
      }

      // Parse the JSON
      const content = fs.readFileSync(resultJsonPath, 'utf8');
      let parsed: any;
      try {
        parsed = JSON.parse(content);
      } catch (err) {
        console.error(`Error parsing JSON from ${resultJsonPath}:`, err);
        continue;
      }

      // We will assume that the script was updated to store fromBlock and toBlock in the result JSON, 
      // along with the total time, and the resultCounts. If it wasn't, you can adapt as needed:
      // e.g. performanceResult might be a part of "performanceResultString" etc.
      const singleRunResult: BenchmarkResult = {
        fromBlock: parsed.fromBlock,
        toBlock: parsed.toBlock,
        resultCounts: parsed.resultCounts,
        // If the script stored time in a string, you need to parse out the numeric portion.
        // For example, if we stored "Time taken for data fetching: 1234.56 milliseconds"
        // you would do something like parseFloat(...) on it. If you stored directly as a number, just read it:
        performanceResult: parsed.performanceResult || 0
      };

      scenarioRunResults.push(singleRunResult);
    }

    // Now compute statistics (min, max, average, median) for the scenario
    const times = scenarioRunResults.map(r => r.performanceResult);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const avgTime = times.reduce((acc, val) => acc + val, 0) / times.length;
    const medianTime = getMedian(times);

    aggregatedResults[scenario] = {
      runs: scenarioRunResults,
      stats: {
        min: minTime,
        max: maxTime,
        average: avgTime,
        median: medianTime
      }
    };
  }

  // Finally, print or save the aggregated results. We'll do both.
  console.log('\n------ All Benchmarks Done ------\n');

  for (const scenario of Object.keys(aggregatedResults)) {
    const { runs, stats } = aggregatedResults[scenario];
    console.log(`Scenario: ${scenario}`);
    console.log(`  Runs: `);
    runs.forEach((r, idx) => {
      console.log(`    Run #${idx + 1}: (Blocks ${r.fromBlock}→${r.toBlock}) time: ${r.performanceResult.toFixed(2)} ms`);
      console.log(`      Entities: ${JSON.stringify(r.resultCounts, null, 2)}`);
    });
    console.log(`  Stats: (ms) min=${stats.min.toFixed(2)}, max=${stats.max.toFixed(2)}, average=${stats.average.toFixed(2)}, median=${stats.median.toFixed(2)}`);
    console.log('');
  }

  // Save the aggregated results as JSON
  const outputFile = `aggregate-results-${benchmarkStartTime}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(aggregatedResults, null, 2), 'utf8');
  console.log(`Aggregated results saved to ${outputFile}`);
}

// Run everything
runBenchmarks().catch(err => {
  console.error(`Error running benchmarks: ${err}`);
  process.exit(1);
});
