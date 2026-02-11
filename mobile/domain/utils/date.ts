import { format } from 'date-fns'

export const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss'
export const toDateTime = (date: Date) => {
  return format(date, dateTimeFormat)
}
