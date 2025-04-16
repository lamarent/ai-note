-- Add default dev user
INSERT INTO "User" ("id", "email", "name", "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dev@example.com',
  'Development User',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
); 