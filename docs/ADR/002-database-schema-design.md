# ADR 2: Database Schema Design

## Status

Accepted

## Date

2023-08-23

## Context

We need to design a database schema for the AI Brainstorm application that efficiently stores brainstorming sessions, ideas, and their relationships. The schema should be optimized for the core use cases while allowing for future extensibility.

## Decision Drivers

- Efficient data access patterns for core functionality
- Support for hierarchical relationships between ideas
- Ability to categorize and tag ideas
- Performance considerations
- Future extensibility (e.g., user accounts, collaboration)
- Compatibility with Prisma ORM

## Options Considered

### Option 1: Simple Flat Schema

```
Session (id, title, description, createdAt, updatedAt)
Idea (id, sessionId, content, category, position, createdAt, updatedAt, isAiGenerated)
Tag (id, name)
IdeaTag (ideaId, tagId)
```

Pros:

- Simple to implement and query
- Easy to understand

Cons:

- Limited support for hierarchical relationships
- May require complex queries for advanced features

### Option 2: Hierarchical Ideas with Adjacency List

```
Session (id, title, description, createdAt, updatedAt)
Idea (id, sessionId, content, category, parentId, position, createdAt, updatedAt, isAiGenerated)
Tag (id, name)
IdeaTag (ideaId, tagId)
```

Pros:

- Supports parent-child relationships between ideas
- Familiar pattern that's well-supported in SQL databases
- Easy to implement in Prisma

Cons:

- Recursive queries can be complex
- Limited depth querying efficiency

### Option 3: Materialized Path for Deep Hierarchies

```
Session (id, title, description, createdAt, updatedAt)
Idea (id, sessionId, content, category, path, position, createdAt, updatedAt, isAiGenerated)
Tag (id, name)
IdeaTag (ideaId, tagId)
```

Pros:

- Efficient querying of entire hierarchies
- Good for deep nesting

Cons:

- More complex to implement and maintain
- Path updates can be expensive

## Decision

We have decided to use Option 2: Hierarchical Ideas with Adjacency List as our database schema design.

The schema will include the following tables:

```prisma
model Session {
  id          String   @id @default(uuid())
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  ideas       Idea[]
}

model Idea {
  id           String   @id @default(uuid())
  content      String
  session      Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId    String
  category     String?
  tags         IdeaTag[]
  position     Int
  parent       Idea?    @relation("IdeaToIdea", fields: [parentId], references: [id])
  parentId     String?
  children     Idea[]   @relation("IdeaToIdea")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  isAiGenerated Boolean @default(false)
}

model Tag {
  id      String   @id @default(uuid())
  name    String   @unique
  ideas   IdeaTag[]
  createdAt DateTime @default(now())
}

model IdeaTag {
  idea     Idea     @relation(fields: [ideaId], references: [id], onDelete: Cascade)
  ideaId   String
  tag      Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId    String

  @@id([ideaId, tagId])
}
```

For the MVP, we will defer implementing user authentication tables, but the schema is designed to easily incorporate them in the future.

## Rationale

We chose Option 2 for the following reasons:

1. **Balance of Simplicity and Functionality**: It provides a good balance between implementation simplicity and the ability to model hierarchical relationships.

2. **Prisma Compatibility**: The adjacency list pattern works well with Prisma's relation system and is easy to implement.

3. **Query Efficiency**: For the expected depth of idea hierarchies (typically not more than 2-3 levels), the adjacency list performs adequately.

4. **Flexibility**: The schema allows ideas to be organized in categories and tagged, enabling flexible organization.

5. **Future Extensibility**: The design can be easily extended to include user accounts, permissions, and collaborative features in the future.

## Consequences

### Positive

- Simple and understandable schema
- Efficient querying for common operations
- Good support for idea organization
- Easy to implement with Prisma

### Negative

- Deep hierarchies might require multiple queries
- Recursive operations can be more complex

### Neutral

- Will need to implement position maintenance logic for reordering ideas
- May need to optimize queries for large datasets in the future

## Related Decisions

- [ADR 1: Technology Stack Selection](./001-tech-stack-selection.md)
- [ADR 3: AI Integration Approach]
