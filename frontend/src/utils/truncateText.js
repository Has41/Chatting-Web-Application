const truncateText = (text, wordLimit = 7, charLimit = 10) => {
  let finalText
  if (text.indexOf(" ") !== -1) {
    const words = text.split(" ")
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."
    }
    return text
  } else {
    if (text.length > charLimit) {
      finalText = text.slice(0, charLimit) + "..."
      return finalText
    }
  }
}

export default truncateText
