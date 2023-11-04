import { format, parse } from 'date-fns'
import ja from 'date-fns/locale/ja'
import { DATE_FORMAT, PARSE_DATE_FORMAT } from './const'

export const formatDate = (
  date: string | Date,
  formatdate: string = DATE_FORMAT
) => {
  return format(typeof date === 'string' ? new Date(date) : date, formatdate, {
    locale: ja,
  })
}

/**
 * TimeZoneついてのDateは現地のTimeZoneに変換しない
 * @param date APIから返した
 * @param formatdate 変換したいDateの形
 * @param parseFormat 変換前Dateの形（@param date の形）
 */
export const formatTZDate = (
  date: string | Date,
  formatdate: string = DATE_FORMAT,
  parseFormat: string = PARSE_DATE_FORMAT
) => {
  const newDate =
    typeof date === 'string'
      ? parse(date, parseFormat, new Date(), { locale: ja })
      : date
  return format(newDate, formatdate)
}

export const getWeekName = (weekNumber: number): string => {
  switch (weekNumber) {
    case 0:
      return '日'
    case 1:
      return '月'
    case 2:
      return '火'
    case 3:
      return '水'
    case 4:
      return '木'
    case 5:
      return '金'
    case 6:
      return '土'
  }
  return ''
}
