const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true
})

const MONTH_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
})

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short"
})

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value))

const startOfLocalDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const getLocalDayDifference = (date: Date, now = new Date()) => {
  const dayStart = startOfLocalDay(date).getTime()
  const todayStart = startOfLocalDay(now).getTime()

  return Math.round((dayStart - todayStart) / DAY)
}

export const formatTime = (value: string | Date, casing: "upper" | "lower" = "lower") => {
  const formatted = TIME_FORMATTER.format(toDate(value))

  return casing === "lower" ? formatted.toLowerCase() : formatted
}

export const formatCalendarDay = (value: string | Date, now = new Date()) => {
  const date = toDate(value)
  const dayDifference = getLocalDayDifference(date, now)

  if (dayDifference === 0) return "Today"
  if (dayDifference === -1) return "Yesterday"
  if (dayDifference < -1 && dayDifference >= -6) return WEEKDAY_FORMATTER.format(date)

  return MONTH_DAY_FORMATTER.format(date)
}

export const formatCompactRelativePast = (value: string | Date, now = new Date()) => {
  const diffMs = Math.max(0, now.getTime() - toDate(value).getTime())
  const diffSeconds = Math.floor(diffMs / SECOND)

  if (diffSeconds < 45) return "just now"
  if (diffSeconds < 90) return "1min"

  const diffMinutes = Math.round(diffMs / MINUTE)
  if (diffMinutes < 45) return `${diffMinutes}min`
  if (diffMinutes < 90) return "1h"

  const diffHours = Math.round(diffMs / HOUR)
  if (diffHours < 22) return `${diffHours}h`
  if (diffHours < 36) return "1 day"

  const diffDays = Math.round(diffMs / DAY)
  if (diffDays < 26) return `${diffDays}days`
  if (diffDays < 46) return "1mo"

  const diffMonths = Math.round(diffDays / 30)
  if (diffDays < 320) return `${diffMonths}mo`
  if (diffDays < 548) return "1yr"

  return `${Math.round(diffDays / 365)}yrs`
}
