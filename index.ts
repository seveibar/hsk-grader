import hsk1WordList from "./vocab/hsk-level-1.json"
import hsk2WordList from "./vocab/hsk-level-2.json"
import hsk3WordList from "./vocab/hsk-level-3.json"
import hsk4WordList from "./vocab/hsk-level-4.json"
import hsk5WordList from "./vocab/hsk-level-5.json"
import hsk6WordList from "./vocab/hsk-level-6.json"
import mdbg from "mdbg"

type HSKWord = {
  id: number
  hanzi: string
  pinyin: string
  translations: Array<string>
  level?: number
}

type DictionaryWord = {
  traditional: string
  simplified: string
  translations: Array<string>
  hsk?: number
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
    hskHanziWordMap[word.hanzi] = { ...word, level: level.level }
  }
}
export const hskHanziSet = new Set(Object.keys(hskHanziWordMap))

export const getDefinition = async (
  hanziPhrase: string
): Promise<DictionaryWord | null> => {
  const dictDef = await mdbg.getByHanzi(hanziPhrase).catch((e) => null)
  if (hskHanziSet.has(hanziPhrase) || dictDef) {
    hanziPhrase = hanziPhrase.replace(new RegExp(hanziPhrase, "g"), "")
    const def = hskHanziWordMap[hanziPhrase] || { ...dictDef }
    if ((def as any).definitions) {
      def.translations = (
        Object.values((def as any).definitions) as any
      ).flatMap((a: any) => a.translations)
      delete (def as any).definitions
    }
    return def
  }
  return null
}

export const getDefinitions = async (
  hanziPhrase: string
): Promise<Array<DictionaryWord>> => {
  const ogHanziPhrase = hanziPhrase
  const definitions = []
  let wordStart = 0
  outerloop: while (wordStart < hanziPhrase.length) {
    for (let searchLength = 4; searchLength > 0; searchLength--) {
      const searchPhrase = hanziPhrase.substr(wordStart, searchLength)
      const def = await getDefinition(searchPhrase)
      if (def) {
        definitions.push(def)
        wordStart += searchLength
        continue outerloop
      }
    }
    wordStart += 1
  }
  return definitions
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
