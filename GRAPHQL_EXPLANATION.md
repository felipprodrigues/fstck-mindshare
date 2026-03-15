# What is GraphQL?

GraphQL is a query language for APIs created by Facebook in 2012. The core idea is simple: instead of the server deciding what data to return, **the client asks for exactly what it needs**.

In a REST API, you hit an endpoint like `GET /users/1` and receive whatever the server decided to include — sometimes too much, sometimes not enough. With GraphQL, there's a single endpoint and you describe the shape of the response yourself.

---

## How it works

Everything goes through one endpoint (usually `/graphql`). You send a request with an operation — a **query**, **mutation**, or **subscription** — and the server returns exactly the shape you asked for.

### Query

Read-only. You ask for data, you get data.

```graphql
query {
  user(id: "1") {
    name
    email
  }
}
```

Response:

```json
{
  "data": {
    "user": {
      "name": "John",
      "email": "john@doe.com"
    }
  }
}
```

Notice you only get `name` and `email` — nothing else. If you also wanted the user's ideas, you'd just add them to the query:

```graphql
query {
  user(id: "1") {
    name
    email
    ideas {
      title
    }
  }
}
```

One request, nested data. No need for a second `GET /users/1/ideas` call.

---

### Mutation

Write operations — create, update, delete.

```graphql
mutation {
  createIdea(data: { title: "Build a GraphQL API" }) {
    id
    title
    createdAt
  }
}
```

Just like a query, you specify what fields you want back from the created/updated resource.

---

### Subscription

Real-time updates over WebSocket. When something changes on the server, the client gets notified.

```graphql
subscription {
  ideaCreated {
    id
    title
  }
}
```

Less common in simple CRUD apps, but useful for things like live feeds or notifications.

---

## The Schema

The schema is the contract of the API. It defines every type, query, mutation, and field available. Both client and server rely on it.

```graphql
type Idea {
  id: ID!
  title: String!
  author: User!
  comments: [Comment!]!
}
```

The `!` means non-nullable — the field will always be present. This strong typing is one of GraphQL's biggest strengths: you know exactly what to expect, and tools like Apollo Studio give you autocomplete and validation for free.

---

## Resolvers

A resolver is just a function that returns the data for a field. When a query comes in, GraphQL walks through each field in the request and calls the corresponding resolver.

```ts
// resolver for the "ideas" query
async ideas() {
  return prismaClient.idea.findMany();
}
```

If the query also asks for `author` on each idea, GraphQL calls the `author` resolver for each one. This is why n+1 queries can be a concern in GraphQL — but that's a topic for DataLoader.

---

## GraphQL vs REST

| | REST | GraphQL |
|---|---|---|
| Endpoints | One per resource | Single endpoint |
| Response shape | Fixed by server | Defined by client |
| Over-fetching | Common | Not possible |
| Under-fetching | Requires multiple requests | Handled in one query |
| Type safety | Optional | Built-in |
| Real-time | Needs extra setup | Native via subscriptions |

REST is simpler to start with and has better HTTP caching out of the box. GraphQL shines when you have complex, nested data and multiple clients (web, mobile) with different data needs.

---

## In this project

This backend uses:

- **TypeGraphQL** — define schema and resolvers with TypeScript decorators
- **Apollo Server** — the GraphQL server
- **Prisma** — ORM to talk to the database
- **JWT** — auth tokens passed via HTTP headers and read in the GraphQL context
