import test from "ava"
import grade from "../index"

// The grades here are mostly just frozen. The snippets are extremely random.

const sentences = [
  "他喜欢吹牛。",
  "我们明天将一起吃午饭。",
  "他们站在那，互相怒视着对方。",
  "他的严重的错误导致了重大的损失。",
  "這個世界變了，但天啊，魔鬼並未改變！",
  "好多智慧的冠冕，无非是一只“成功”的金尿壶，摆着堂皇的架势而已。",
]

for (const sentence of sentences) {
  test(`grade ${sentence}`, async (t) => {
    console.log(sentence, await grade(sentence))
    t.pass()
  })
}
