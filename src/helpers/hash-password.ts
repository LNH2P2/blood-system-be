import * as bcrypt from 'bcrypt'

const HashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error('Password is required')
  }

  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (err) {
    throw new Error(`Error hashing password: ${err.message}`)
  }
}

export default HashPassword