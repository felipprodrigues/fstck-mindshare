import bcrypt from "bcryptjs"

export const hashPassword = async(plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)

  console.log(salt, "salt aqui")
  return bcrypt.hash(plainPassword, salt)
}
