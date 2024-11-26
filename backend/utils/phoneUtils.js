import { parsePhoneNumberFromString } from "libphonenumber-js"

const formatPhoneNumber = (number) => {
  const phoneNumber = parsePhoneNumberFromString(number, "PK")
  return phoneNumber ? phoneNumber.format("E.164") : null
}

export default formatPhoneNumber
