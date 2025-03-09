import moment from "moment"

// Shorten "minutes" to "min" and remove "ago"
moment.updateLocale("en", {
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

const getSeenText = (seenAt) => {
  const diffSeconds = moment().diff(moment(seenAt), "seconds")

  if (diffSeconds < 5) {
    return "Seen just now"
  } else {
    return `Seen ${moment(seenAt).fromNow()} ago`
  }
}

export default getSeenText
