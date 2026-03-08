const truncateText = (text: string, wordLimit: number = 7, charLimit: number = 10): string => {
  if (text.indexOf(" ") !== -1) {
    const words = text.split(" ")
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."
    }
    return text
  } else {
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "..."
    }
  }
  return text
}

export default truncateText
