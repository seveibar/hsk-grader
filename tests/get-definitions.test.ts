import test from "ava"
import { getDefinitions } from "../index"

const sentences = [
  "他喜欢吹牛。",
  "我们明天将一起吃午饭。",
  "他们站在那，互相怒视着对方。",
  "他的严重的错误导致了重大的损失。",
  "這個世界變了，但天啊，魔鬼並未改變！",
  "好多智慧的冠冕，无非是一只“成功”的金尿壶，摆着堂皇的架势而已。",
]

for (const sentence of sentences) {
  test(`get definitions for ${sentence}`, async (t) => {
    const defs = await getDefinitions(sentence)
    console.log(`${sentence} => ${defs.length} definitions`)
    t.pass(`${sentence} => ${defs.length} definitions`)
  })
}
