const RanDomNumber = () => {
  try {
    const min = 100000 // Minimum 6-digit number
    const max = 999999 // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min
  } catch (error) {
    throw new Error(`Error generating random number: ${error.message}`)
  }
}

export default RanDomNumber
