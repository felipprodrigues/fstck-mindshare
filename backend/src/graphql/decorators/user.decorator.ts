import { User } from "@prisma/client";
import { createParameterDecorator, ResolverData } from "type-graphql";
import { prismaClient } from "../../../prisma/prisma.js";
import { GraphqlContext } from "../context/index.js";

export const GqlUser = () => {
  return createParameterDecorator(
    async({ context }: ResolverData<GraphqlContext>): Promise<User | null> => {
    if(!context || !context.user) return null;

    try{
      const user = await prismaClient.user.findUnique({
        where: {
          id: context.user
        }
      })
      if(!user) throw new Error("User not found");
      return user;
    }catch(err){
      console.log("Error fetching user:", err);
      return null;
    }
  })

}

