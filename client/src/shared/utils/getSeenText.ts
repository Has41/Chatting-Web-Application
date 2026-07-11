import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

// Shorten "minutes" to "min" and remove "ago"; the caller adds "ago".
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "just now",
    m: "1min",
    mm: "%dmin",
    h: "1h",
    hh: "%dh",
    d: "1 day",
    dd: "%ddays",
    M: "1mo",
    MM: "%dmo",
    y: "1yr",
    yy: "%dyrs"
  }
})

const getSeenText = (seenAt: string | Date): string => {
  const diffSeconds = dayjs().diff(dayjs(seenAt), "seconds")

  if (diffSeconds < 5) {
    return "Seen just now"
  } else {
    return `Seen ${dayjs(seenAt).fromNow()} ago`
  }
}

export default getSeenText
