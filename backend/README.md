# GraphQL Backend

A GraphQL API built with TypeScript, TypeGraphQL, Prisma, and SQLite. Supports user authentication, ideas, comments, and votes.

## Stack

- **Runtime:** Node.js + TypeScript
- **GraphQL:** TypeGraphQL + Apollo Server
- **ORM:** Prisma v7 (SQLite)
- **Auth:** JWT

## Database

### Table Relationships

![Table Relationships](./assets/table-visualization.png)

## API Reference

### Queries

![Queries](./assets/query-reference.png)

### Mutations

![Mutations](./assets/mutation-reference.png)

## Demo

Screen recording of queries and mutations running live in Apollo GraphQL Studio:

![Demo](./assets/apollo-graphql.gif)

## Getting Started

```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```
