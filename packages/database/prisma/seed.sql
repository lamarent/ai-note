-- Add default dev user
INSERT INTO "User" ("id", "email", "name", "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dev@example.com',
  'Development User',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Add a sample session
INSERT INTO "Session" ("id", "title", "description", "ownerId", "createdAt", "updatedAt", "isPublic")
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Sample Brainstorming Session',
  'A sample session for development purposes',
  '00000000-0000-0000-0000-000000000000',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  true
);

-- Add sample categories
INSERT INTO "Category" ("id", "name", "color", "sessionId", "createdAt", "updatedAt")
VALUES 
(
  'c1111111-1111-1111-1111-111111111111',
  'High Priority',
  '#ff0000',
  '11111111-1111-1111-1111-111111111111',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c2222222-2222-2222-2222-222222222222',
  'Medium Priority',
  '#ffaa00',
  '11111111-1111-1111-1111-111111111111',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Low Priority',
  '#00ff00',
  '11111111-1111-1111-1111-111111111111',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Add sample ideas
INSERT INTO "Idea" ("id", "content", "position", "sessionId", "categoryId", "createdAt", "updatedAt")
VALUES 
(
  'i1111111-1111-1111-1111-111111111111',
  'Implement user authentication',
  '{"x": 100, "y": 100}',
  '11111111-1111-1111-1111-111111111111',
  'c1111111-1111-1111-1111-111111111111',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'i2222222-2222-2222-2222-222222222222',
  'Add drag and drop functionality',
  '{"x": 300, "y": 150}',
  '11111111-1111-1111-1111-111111111111',
  'c2222222-2222-2222-2222-222222222222',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'i3333333-3333-3333-3333-333333333333',
  'Implement theme switching',
  '{"x": 500, "y": 200}',
  '11111111-1111-1111-1111-111111111111',
  'c3333333-3333-3333-3333-333333333333',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'i4444444-4444-4444-4444-444444444444',
  'Add export to PDF feature',
  '{"x": 200, "y": 300}',
  '11111111-1111-1111-1111-111111111111',
  'c2222222-2222-2222-2222-222222222222',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
); 