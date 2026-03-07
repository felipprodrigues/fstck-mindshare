import { User } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma.js";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";

export class AuthService {
  async login(data: LoginInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })

    if(!existingUser) throw new Error("User not registered")

    const compare = await comparePassword(data.password, existingUser.password)
    if(!compare) throw new Error("Invalid password");

    return this.generateTokens(existingUser)
  }


  async register(data: RegisterInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })

    if(existingUser) throw new Error("User already exists")

    const hash = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash
      }
    })

    return this.generateTokens(user)
  }

  generateTokens(user: User) {
    const token = signJwt({
      id: user.id,
      email: user.email,
    }, "15min")
    const refreshToken = signJwt({
      id: user.id,
      email: user.email,
    }, "1d")

    return {
      token, refreshToken, user
    }
  }
}

