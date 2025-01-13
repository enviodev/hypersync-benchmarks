# Hetzner->IP Projects

This benchmark is run between Hetzner and IP Projects both in Germany but over the public internet with a low roundtrip message time (measured at 5.4ms using `ping`). It is queried from a AMD Ryzen™ 7 3700X machine. Hetzner has a 1Gbps connection to the public internet.

Unformated results are available in the raw-results.json file.

**Blocks Scanned:** 100,000 most recent

## Scenario: all-blocks-data

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 1.47 | 1.74 | 1.59 | 1.56 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510808 → 21610808 | 1740.23 | blocks: 100000 |
| 2 | 21510808 → 21610808 | 1467.47 | blocks: 100000 |
| 3 | 21510809 → 21610809 | 1562.41 | blocks: 100000 |


## Scenario: all-logs

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 24.92 | 25.43 | 25.13 | 25.05 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510809 → 21610809 | 25053.97 | raw_logs: 43790805 |
| 2 | 21510811 → 21610811 | 24919.60 | raw_logs: 43791266 |
| 3 | 21510814 → 21610814 | 25425.62 | raw_logs: 43790655 |


## Scenario: all-transactions

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 44.27 | 45.88 | 45.05 | 45.00 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510816 → 21610816 | 44996.15 | transactions: 16366221 |
| 2 | 21510820 → 21610820 | 45881.98 | transactions: 16366069 |
| 3 | 21510824 → 21610824 | 44269.25 | transactions: 16366041 |


## Scenario: all-traces

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 75.86 | 78.23 | 76.74 | 76.13 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510828 → 21610828 | 78232.33 | traces: 98644707 |
| 2 | 21510835 → 21610835 | 76128.61 | traces: 98643972 |
| 3 | 21510842 → 21610842 | 75857.96 | traces: 98643796 |


## Scenario: all-ens-name-registerred

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 3.87 | 4.66 | 4.38 | 4.60 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510848 → 21610848 | 4663.63 | raw_logs: 8949<br>decoded_logs: 8949 |
| 2 | 21510849 → 21610849 | 4599.07 | raw_logs: 8949<br>decoded_logs: 8949 |
| 3 | 21510849 → 21610849 | 3873.04 | raw_logs: 8949<br>decoded_logs: 8949 |


## Scenario: crypto-punk-bought

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 0.18 | 0.18 | 0.18 | 0.18 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510850 → 21610850 | 180.15 | raw_logs: 58<br>decoded_logs: 58 |
| 2 | 21510850 → 21610850 | 178.21 | raw_logs: 58<br>decoded_logs: 58 |
| 3 | 21510850 → 21610850 | 182.09 | raw_logs: 58<br>decoded_logs: 58 |


## Scenario: erc-20-and-721-transfers

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 12.19 | 12.40 | 12.31 | 12.35 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510850 → 21610850 | 12189.07 | raw_logs: 22599721 |
| 2 | 21510852 → 21610852 | 12397.32 | raw_logs: 22600028 |
| 3 | 21510853 → 21610853 | 12354.15 | raw_logs: 22600169 |


## Scenario: all-usdc-transfers

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 2.46 | 2.59 | 2.51 | 2.49 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510854 → 21610854 | 2460.54 | raw_logs: 1695478<br>decoded_logs: 1695478 |
| 2 | 21510854 → 21610854 | 2486.86 | raw_logs: 1695478<br>decoded_logs: 1695478 |
| 3 | 21510855 → 21610855 | 2591.51 | raw_logs: 1695468<br>decoded_logs: 1695468 |


## Scenario: everything

**Overall Stats**

| Min (s) | Max (s) | Avg (s) | Median (s) |
| --- | --- | --- | --- |
| 136.90 | 138.11 | 137.46 | 137.37 |

**Detailed Runs** (total 3)

| Run # | Block Range | Performance (ms) | Entities |
| --- | --- | --- | --- |
| 1 | 21510855 → 21610855 | 136896.81 | raw_logs: 43790056<br>transactions: 16365386<br>traces: 98642841<br>blocks: 100000 |
| 2 | 21510866 → 21610866 | 138111.89 | raw_logs: 43790292<br>transactions: 16365227<br>traces: 98643373<br>blocks: 100000 |
| 3 | 21510878 → 21610878 | 137369.39 | raw_logs: 43790585<br>transactions: 16364988<br>traces: 98643017<br>blocks: 100000 |
