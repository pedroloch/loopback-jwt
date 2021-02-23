import { compare, genSalt, hash } from 'bcrypt'

const round = 10

export const hashPassword = async (password: string) => {
  const salt = await genSalt(round)
  return hash(password, salt)
}

export const comparePassword = async (
  providedPassword: string,
  storedPassword: string
) => {
  const passwordMatch = await compare(providedPassword, storedPassword)

  return passwordMatch
}
