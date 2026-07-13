import { formatCompactRelativePast } from "@shared/utils/dateTime"

const getSeenText = (seenAt: string | Date): string => {
  const relativeTime = formatCompactRelativePast(seenAt)

  if (relativeTime === "just now") {
    return "Seen just now"
  }

  return `Seen ${relativeTime} ago`
}

export default getSeenText
