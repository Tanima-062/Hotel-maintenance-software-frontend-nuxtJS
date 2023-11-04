export const stringToNumArray = (s: string, split: string): number[] | '' => {
  if (s) {
    const result: number[] = []
    // 前後のスペースを削除した後連続した空白を一つのスペースで置換後配列にする
    const arrayString = s.trim().replace(/ +/g, ' ').split(split)

    for (const num in arrayString) {
      const parsedNumber = parseInt(arrayString[num], 10)
      if (!Number.isNaN(parsedNumber)) {
        result.push(parsedNumber)
      }
    }

    return result
  }
  return ''
}
