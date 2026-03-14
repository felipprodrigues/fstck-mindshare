import { prismaClient } from "../../prisma/prisma.js";
import { CreateUserInput } from "../dtos/input/user.input.js";

export class UserService {

  async createUser(data: CreateUserInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })
    if(existingUser) throw new Error("User already registered");

    const user = await prismaClient.user.create({
      data: {
        email: data.email,
        name: data.name,
      }
    })
    return user;
  }

  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id
      }
    })

    if(!user) throw new Error("User not found");

    return user;
  }
}
