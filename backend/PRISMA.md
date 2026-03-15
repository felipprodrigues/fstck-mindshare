# Prisma (Based on This Project)

This project uses Prisma as the ORM for the `backend` app with:
- **Schema:** `backend/prisma/schema.prisma`
- **Migrations:** `backend/prisma/migrations/`
- **Database:** SQLite (`backend/prisma/dev.db`)
- **Config:** `backend/prisma.config.ts`

---

## What is Prisma?

Prisma sits between your TypeScript code and your database. You define your data models in `schema.prisma`, and Prisma handles three things:

1. **Migrations** — generates and applies SQL to keep the database in sync with your schema
2. **Prisma Client** — a fully type-safe query builder generated from your schema
3. **Schema as source of truth** — the schema file is what both the DB and TypeScript code are derived from

---

## The Schema

Your models live in `schema.prisma`. Each model maps to a database table.

```prisma
model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  password  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  ideas     Idea[]
  comments  Comment[]
  votes     Vote[]
}
```

Key decorators:
- `@id` → primary key
- `@default(uuid())` → Prisma generates a UUID on insert
- `@unique` → unique index in the DB
- `String?` → nullable field (the `?` means optional)
- `@default(now())` → timestamp set automatically on insert
- `@updatedAt` → Prisma updates this automatically whenever the record changes
- `Idea[]` → relation — one user has many ideas

---

## Relations

Relations in Prisma are defined on both sides of the relationship.

```prisma
model Idea {
  id       String @id @default(uuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments Comment[]
  votes    Vote[]
}
```

- `authorId` is the foreign key column in the database
- `author` is the relation field — it doesn't exist in the DB, it's a Prisma abstraction
- `onDelete: Cascade` means if the user is deleted, their ideas are deleted too

The `@@unique([userId, ideaId])` on the `Vote` model is a **composite unique constraint** — it ensures a user can only vote once per idea.

---

## Migrations

A migration is a versioned SQL file that records what changed in the database schema.

Think of it like a git commit for your database. Every time you change `schema.prisma`, you create a migration — Prisma generates the SQL, applies it, and saves it to the `migrations/` folder so anyone pulling the repo can replay the same changes.

This project's migration history:

```
migrations/
├── 20260228183803_create_user/
├── 20260314174039_change_user_pwd_to_nullable/
├── 20260314175227_create_ideas/
└── 20260315180309_create_comments_and_vote/
```

Each folder contains a `migration.sql` with the raw SQL Prisma generated and applied.

To create a new migration after changing the schema:

```bash
npx prisma migrate dev --name describe_your_change
```

---

## Prisma Client

After running migrations, Prisma generates a type-safe client from the schema. In Prisma v7 (used in this project), you need to run generate separately:

```bash
npx prisma generate
```

This updates `node_modules/.prisma/client` with types that match your current schema. If you add a new model and skip this step, TypeScript won't know about it.

The client is instantiated once and reused:

```ts
// prisma/prisma.ts
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL });
export const prismaClient = new PrismaClient({ adapter });
```

Usage in a service:

```ts
// fetch all ideas with their author
const ideas = await prismaClient.idea.findMany({
  include: { author: true }
});

// create a comment
const comment = await prismaClient.comment.create({
  data: { content, ideaId, authorId }
});
```

---

## Prisma v7 Config

Older Prisma versions read the database URL from `schema.prisma` directly. v7 moved that to a separate config file:

```ts
// prisma.config.ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "file:./prisma/dev.db",
  },
});
```

This means `schema.prisma` only defines models and types — connection details live in `prisma.config.ts` and `.env`.

---

## Important files

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Source of truth for all data models |
| `prisma/migrations/` | Versioned SQL history |
| `prisma/dev.db` | SQLite database file (not committed) |
| `prisma.config.ts` | Prisma CLI config — schema path, migrations path, DB URL |
| `prisma/prisma.ts` | Prisma Client singleton used across the app |
