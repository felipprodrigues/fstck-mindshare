# Backend Architecture & Development Flow

This document explains the system design of the GraphQL backend — what each folder is responsible for, how the pieces connect, and how a request flows through the app.

---

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── prisma.ts
│   └── dev.db
├── src/
│   ├── index.ts
│   ├── schema.gql
│   ├── resolvers/
│   ├── services/
│   ├── models/
│   ├── dtos/
│   │   ├── input/
│   │   └── output/
│   ├── middlewares/
│   ├── graphql/
│   │   ├── context/
│   │   └── decorators/
│   └── utils/
└── prisma.config.ts
```

---

## Design Strategy: Layered Architecture

The backend follows a **layered architecture**, where each layer has a single responsibility and only talks to the layer directly below it.

```
Request
   ↓
Resolver       ← receives the GraphQL operation, validates auth, calls service
   ↓
Service        ← contains the business logic, talks to the database
   ↓
Prisma Client  ← executes the query against the database
   ↓
Database (SQLite)
```

This separation keeps concerns isolated — a resolver doesn't touch the DB directly, and a service doesn't know anything about GraphQL.

---

## `/resolvers`

Resolvers are the **entry point for every GraphQL operation**. They map directly to queries and mutations in the schema.

Each resolver class is decorated with `@Resolver()` and contains methods decorated with `@Query()` or `@Mutation()`. TypeGraphQL reads these decorators and builds the GraphQL schema from them.

```ts
@Resolver(() => IdeaModel)
export class IdeaResolver {
  private ideaService = new IdeaService()

  @Mutation(() => IdeaModel)
  @UseMiddleware(isAuth)
  async createIdea(
    @Arg('data', () => CreateIdeaInput) data: CreateIdeaInput,
    @GqlUser() user: User
  ): Promise<IdeaModel> {
    return this.ideaService.create(user.id, data);
  }
}
```

The resolver's only job is to:
1. Declare the operation and its types
2. Guard it with middleware if needed
3. Extract the arguments and current user
4. Delegate to the service

---

## `/services`

Services contain the **business logic**. They receive plain data from resolvers and are responsible for interacting with the database through Prisma Client.

A service doesn't know it's inside a GraphQL server — it just receives arguments and returns data. This makes it easy to test or reuse outside of a resolver context.

```ts
export class IdeaService {
  async create(authorId: string, data: CreateIdeaInput) {
    return prismaClient.idea.create({
      data: { ...data, authorId }
    });
  }
}
```

---

## `/models`

Models define the **GraphQL response types** — the shape of data returned to the client. They are TypeScript classes decorated with `@ObjectType()` so TypeGraphQL can include them in the schema.

```ts
@ObjectType()
export class IdeaModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
```

Models are what the client sees. They don't have to match the Prisma model exactly — you can expose or hide fields as needed.

---

## `/dtos`

DTO stands for **Data Transfer Object**. This folder defines the shape of data coming _into_ the server (inputs) and going _out_ (outputs).

### `dtos/input/`

Input types define what the client must send in a mutation. Decorated with `@InputType()`.

```ts
@InputType()
export class CreateIdeaInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
```

### `dtos/output/`

Output types define the shape of non-model responses — like auth responses that bundle a token with a user object.

```ts
@ObjectType()
export class RegisterOutput {
  @Field(() => String)
  token!: string;

  @Field(() => UserModel)
  user!: UserModel;
}
```

The distinction between `models/` and `dtos/output/` is intent: models represent entities (User, Idea), outputs represent operation results (RegisterOutput, LoginOutput).

---

## `/middlewares`

Middleware runs **before a resolver method executes**. The `isAuth` middleware checks whether the request has a valid user in context — if not, it throws before the resolver is ever called.

```ts
export const isAuth: MiddlewareFn<GraphqlContext> = async ({ context }, next) => {
  if (!context.user) throw new Error("User not authenticated");
  return next();
}
```

Applied to a resolver with `@UseMiddleware(isAuth)`.

---

## `/graphql/context`

The context is a **shared object passed to every resolver** on every request. It's built once per request in `index.ts` and contains the decoded user ID from the JWT (if present), the token itself, and the raw req/res objects.

```ts
export type GraphqlContext = {
  user: string | undefined;  // user ID from JWT
  token: string | undefined;
  req: Request;
  res: Response;
}
```

The context is how resolvers know who is making the request — without passing the token manually to every operation.

---

## `/graphql/decorators`

Custom parameter decorators extend TypeGraphQL's built-in argument system. `@GqlUser()` is a decorator that reads `context.user` (the user ID) and fetches the full `User` record from the database — so resolvers receive a typed `User` object directly instead of a raw string ID.

```ts
// usage in a resolver
async createIdea(@GqlUser() user: User) { ... }
```

---

## `/utils`

Utility functions with no dependency on GraphQL or Prisma. Purely logic.

- `jwt.ts` — sign and verify JWT tokens
- `hash.ts` — hash and compare passwords with bcrypt

---

## `index.ts` — How It All Composes

`index.ts` is the **composition root** — where every layer is wired together and the server starts.

```ts
async function bootstrap() {
  const app = express();

  // 1. Build the GraphQL schema from all resolvers
  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, IdeaResolver, CommentResolver, VoteResolver],
    emitSchemaFile: "./src/schema.gql"  // writes schema.gql as a side effect
  });

  // 2. Create the Apollo Server with that schema
  const server = new ApolloServer({ schema });
  await server.start();

  // 3. Mount Apollo as Express middleware on /graphql
  app.use("/graphql", express.json(), expressMiddleware(server, {
    context: async (args) => buildContext(args)  // builds context per request
  }));

  app.listen({ port: 4000 });
}
```

The flow on every request:
1. Express receives the HTTP request at `/graphql`
2. `buildContext` runs — extracts and verifies the JWT, attaches the user ID to context
3. Apollo parses the GraphQL operation
4. TypeGraphQL routes it to the correct resolver method
5. Middleware runs (e.g. `isAuth`) — request is blocked here if unauthenticated
6. The resolver calls the service
7. The service queries the database via Prisma Client
8. The result travels back up and Apollo sends the response

---

## `schema.gql`

This file is auto-generated by TypeGraphQL on every server start (`emitSchemaFile`). It's the full GraphQL schema in SDL (Schema Definition Language) — the contract between client and server. You don't edit it manually.
