export interface Session {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}

export interface Idea {
  id: string;
  content: string;
  sessionId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSessionData {
  name: string;
  description?: string;
}

export interface UpdateSessionData {
  name: string;
  description?: string;
}

export interface CreateIdeaData {
  content: string;
  sessionId: string;
}

export interface UpdateIdeaData {
  content: string;
}

export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  name: string;
}
