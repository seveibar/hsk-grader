# HSK Grader

Grade the difficulty of a sentence based on the level of HSK phrases used.

This currently only supports Traditional Chinese.

Thanks to [@clem109 for dumping the hsk files](https://github.com/clem109/hsk-vocabulary)

## Installation

`yarn add hsk-grader` or `npm install hsk-grader`

## Usage

```ts
import grade from "hsk-grader"

await grade("我们明天将一起吃午饭。")
// Outputs: 1.166
```
