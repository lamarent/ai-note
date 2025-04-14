# API Design - AI-Powered Brainstorming App

## Base URL

```
https://api.brainstorm-app.example.com/v1
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Session Management

#### Create a new brainstorming session

```
POST /sessions
```

**Request Body:**

```json
{
  "title": "Project Kickoff Ideas",
  "description": "Brainstorming session for our new product",
  "template_id": "mind-map-template",
  "is_collaborative": true
}
```

**Response:**

```json
{
  "session_id": "sess_12345",
  "title": "Project Kickoff Ideas",
  "description": "Brainstorming session for our new product",
  "created_at": "2023-05-15T14:22:30Z",
  "updated_at": "2023-05-15T14:22:30Z",
  "owner_id": "user_789",
  "share_link": "https://brainstorm.app/s/abcd1234",
  "ideas": []
}
```

#### Get a brainstorming session

```
GET /sessions/{session_id}
```

**Response:**

```json
{
  "session_id": "sess_12345",
  "title": "Project Kickoff Ideas",
  "description": "Brainstorming session for our new product",
  "created_at": "2023-05-15T14:22:30Z",
  "updated_at": "2023-05-15T14:30:45Z",
  "owner_id": "user_789",
  "share_link": "https://brainstorm.app/s/abcd1234",
  "ideas": [
    {
      "idea_id": "idea_1",
      "content": "Create a mobile app version",
      "created_by": "user_789",
      "position": { "x": 100, "y": 150 },
      "group_id": "group_1"
    }
  ]
}
```

#### Update a brainstorming session

```
PATCH /sessions/{session_id}
```

**Request Body:**

```json
{
  "title": "Updated Project Kickoff Ideas",
  "description": "Refined description"
}
```

#### Delete a brainstorming session

```
DELETE /sessions/{session_id}
```

### Idea Management

#### Create a new idea

```
POST /sessions/{session_id}/ideas
```

**Request Body:**

```json
{
  "content": "Implement dark mode",
  "position": { "x": 250, "y": 300 },
  "group_id": "group_2"
}
```

**Response:**

```json
{
  "idea_id": "idea_2",
  "content": "Implement dark mode",
  "created_at": "2023-05-15T14:35:20Z",
  "created_by": "user_789",
  "position": { "x": 250, "y": 300 },
  "group_id": "group_2"
}
```

#### Update an idea

```
PATCH /sessions/{session_id}/ideas/{idea_id}
```

**Request Body:**

```json
{
  "content": "Implement dark and light mode",
  "position": { "x": 275, "y": 320 }
}
```

#### Delete an idea

```
DELETE /sessions/{session_id}/ideas/{idea_id}
```

### AI Integration

#### Generate ideas with AI

```
POST /ai/generate-ideas
```

**Request Body:**

```json
{
  "session_id": "sess_12345",
  "topic": "Ways to improve user engagement",
  "count": 5
}
```

**Response:**

```json
{
  "ideas": [
    {
      "content": "Implement a points-based reward system",
      "confidence": 0.92
    },
    {
      "content": "Create interactive onboarding tutorials",
      "confidence": 0.89
    },
    {
      "content": "Add social sharing capabilities",
      "confidence": 0.85
    },
    {
      "content": "Develop personalized notification strategies",
      "confidence": 0.83
    },
    {
      "content": "Implement gamification elements",
      "confidence": 0.78
    }
  ]
}
```

#### Expand an idea with AI

```
POST /ai/expand-idea
```

**Request Body:**

```json
{
  "idea": "Implement gamification elements",
  "depth": "medium"
}
```

**Response:**

```json
{
  "expansion": [
    "Create achievement badges for completing actions",
    "Develop a progression system with levels",
    "Add leaderboards for competitive features",
    "Implement challenges with special rewards",
    "Create a virtual currency that can be earned through engagement"
  ]
}
```

### Collaboration

#### Invite participants

```
POST /sessions/{session_id}/invites
```

**Request Body:**

```json
{
  "emails": ["participant@example.com"],
  "role": "collaborator"
}
```

#### Get session participants

```
GET /sessions/{session_id}/participants
```

**Response:**

```json
{
  "participants": [
    {
      "user_id": "user_789",
      "email": "owner@example.com",
      "name": "Jane Smith",
      "role": "owner",
      "online": true
    },
    {
      "user_id": "user_456",
      "email": "participant@example.com",
      "name": "John Doe",
      "role": "collaborator",
      "online": false
    }
  ]
}
```

### Export

#### Export session

```
GET /sessions/{session_id}/export?format=pdf
```

Supported formats: `pdf`, `markdown`, `json`, `image`

## WebSocket API

Connect to the WebSocket endpoint for real-time collaboration:

```
wss://api.brainstorm-app.example.com/v1/sessions/{session_id}/realtime
```

### Events

#### User joined

```json
{
  "type": "user_joined",
  "data": {
    "user_id": "user_456",
    "name": "John Doe"
  }
}
```

#### Idea created

```json
{
  "type": "idea_created",
  "data": {
    "idea_id": "idea_3",
    "content": "Add multilingual support",
    "created_by": "user_456",
    "position": { "x": 400, "y": 200 },
    "timestamp": "2023-05-15T14:42:10Z"
  }
}
```

#### Idea updated

```json
{
  "type": "idea_updated",
  "data": {
    "idea_id": "idea_3",
    "content": "Add multilingual support with auto-detection",
    "updated_by": "user_456",
    "position": { "x": 420, "y": 220 },
    "timestamp": "2023-05-15T14:45:22Z"
  }
}
```

#### Cursor moved

```json
{
  "type": "cursor_moved",
  "data": {
    "user_id": "user_456",
    "position": { "x": 350, "y": 280 },
    "timestamp": "2023-05-15T14:46:05Z"
  }
}
```
