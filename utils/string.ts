export const zenkaku2Hankaku = (str: String) => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    // eslint-disable-next-line
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  })
}

export const hankaku2Zenkaku = (str: string): string => {
  const base: string = str
  return base.replace(/[A-Za-z0-9]/g, function (s) {
    // eslint-disable-next-line
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
  })
}
