import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from 'cors';
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { buildContext } from "./graphql/context/index.js";
import { AuthResolver } from "./resolvers/auth.resolver.js";
import { CommentResolver } from "./resolvers/comment.resolver.js";
import { IdeaResolver } from "./resolvers/idea.resolver.js";
import { UserResolver } from "./resolvers/user.resolver.js";
import { VoteResolver } from "./resolvers/vote.resolver.js";

async function bootstrap() {
  const app = express();

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }))

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, IdeaResolver, CommentResolver, VoteResolver],
    validate: false,
    emitSchemaFile: "./src/schema.gql"
  })

  const server = new ApolloServer({
    schema
  })

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async (args) => {
        const ctx = await buildContext(args)
        return ctx
      }
    })
  )

  app.listen({
    port: 4000,
  }, () => {
    console.log("Server is running at port 4000")
  })

}

bootstrap()
