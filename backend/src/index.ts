import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { buildContext } from "./graphql/context/index.js";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/user.resolver";

async function bootstrap() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver],
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
