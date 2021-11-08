import hsk1WordList from "./vocab/hsk-level-1.json"
import hsk2WordList from "./vocab/hsk-level-2.json"
import hsk3WordList from "./vocab/hsk-level-3.json"
import hsk4WordList from "./vocab/hsk-level-4.json"
import hsk5WordList from "./vocab/hsk-level-5.json"
import hsk6WordList from "./vocab/hsk-level-6.json"

const levels = [
  { wordList: hsk1WordList, level: 1 },
  { wordList: hsk2WordList, level: 2 },
  { wordList: hsk3WordList, level: 3 },
  { wordList: hsk4WordList, level: 4 },
  { wordList: hsk5WordList, level: 5 },
  { wordList: hsk6WordList, level: 6 },
]

export async function grade(sentence: string) {
  const levelFreqCount = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  }

  for (const level of levels) {
    for (const word of level.wordList) {
      if (sentence.includes(word.hanzi)) {
        levelFreqCount[level.level] += 1
      }
    }
  }

  let weightedSum = 0,
    totalFreqCount = 0
  for (const [levelStr, freqCount] of Object.entries(levelFreqCount)) {
    totalFreqCount += freqCount
    weightedSum += parseInt(levelStr) * freqCount
  }

  if (weightedSum === 0) return 6

  return weightedSum / totalFreqCount
}

export default grade
