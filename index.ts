import hsk1WordList from "./vocab/hsk-level-1.json"
import hsk2WordList from "./vocab/hsk-level-2.json"
import hsk3WordList from "./vocab/hsk-level-3.json"
import hsk4WordList from "./vocab/hsk-level-4.json"
import hsk5WordList from "./vocab/hsk-level-5.json"
import hsk6WordList from "./vocab/hsk-level-6.json"

type HSKWord = {
  id: number
  hanzi: string
  pinyin: string
  translations: Array<string>
}

export const levels: Array<{ wordList: Array<HSKWord>; level: number }> = [
  { wordList: hsk1WordList, level: 1 },
  { wordList: hsk2WordList, level: 2 },
  { wordList: hsk3WordList, level: 3 },
  { wordList: hsk4WordList, level: 4 },
  { wordList: hsk5WordList, level: 5 },
  { wordList: hsk6WordList, level: 6 },
]

export const hskHanziWordMap: { [hanzi: string]: HSKWord } = {}
for (const level of levels) {
  for (const word of level.wordList) {
    hskHanziWordMap[word.hanzi] = word
  }
}
export const hskHanziSet = new Set(Object.keys(hskHanziWordMap))

export const getDefinitions = (hanziPhrase: string) => {
  const ogHanziPhrase = hanziPhrase
  const definitions = []
  let searchLength = 4
  while (searchLength > 0) {
    // Find all hanzi definitions with searchLength size, if found remove
    for (let i = 0; i < hanziPhrase.length - searchLength; i++) {
      const searchPhrase = hanziPhrase.substr(i, searchLength)
      if (hskHanziSet.has(searchPhrase)) {
        hanziPhrase = hanziPhrase.replace(new RegExp(searchPhrase, "g"), "")
        definitions.push({
          ...hskHanziWordMap[searchPhrase],
          order: ogHanziPhrase.indexOf(searchPhrase),
        })
      }
    }
    searchLength -= 1
  }
  return definitions.sort((a, b) => a.order - b.order)
}

export async function grade(sentence: string) {
  const levelFreqCount = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
  }

  for (const { wordList, level } of levels) {
    for (const word of wordList) {
      if (sentence.includes(word.hanzi)) {
        ;(levelFreqCount as any)[level.toString()] += 1
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
