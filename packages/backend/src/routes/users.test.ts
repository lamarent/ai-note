import { Hono } from "hono";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPrismaClient, UserRepository } from "@ai-brainstorm/database";
import userRoutes from "./users";

// Mock the getPrismaClient and UserRepository
vi.mock("@ai-brainstorm/database", () => {
  const mockUserRepo = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  };

  return {
    getPrismaClient: vi.fn().mockResolvedValue({}),
    UserRepository: vi.fn(() => mockUserRepo),
  };
});

describe("User Routes", () => {
  let app: Hono;
  let mockEnv: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let mockUserRepo: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup mock environment
    mockEnv = { DB: {} };

    // Set up the app with the routes
    app = new Hono();
    app.route("/", userRoutes);

    // Get the mocked repository
    mockUserRepo = new UserRepository({} as any) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  describe("GET /", () => {
    it("should return all users", async () => {
      // Arrange
      const mockUsers = [
        { id: "1", name: "User 1", email: "user1@example.com" },
        { id: "2", name: "User 2", email: "user2@example.com" },
      ];
      (mockUserRepo.findAll as any).mockResolvedValue(mockUsers); // eslint-disable-line @typescript-eslint/no-explicit-any

      // Act
      const res = await app.request("/", {
        method: "GET",
        env: mockEnv,
      });
      const data = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(data).toEqual(mockUsers);
      expect(mockUserRepo.findAll).toHaveBeenCalled();
      expect(getPrismaClient).toHaveBeenCalledWith(mockEnv.DB);
    });

    it("should handle errors", async () => {
      // Arrange
      mockUserRepo.findAll.mockRejectedValue(new Error("Database error"));

      // Act
      const res = await app.request("/", {
        method: "GET",
        env: mockEnv,
      });
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Failed to fetch users");
    });
  });

  describe("GET /:id", () => {
    it("should return a user by ID", async () => {
      // Arrange
      const mockUser = { id: "1", name: "User 1", email: "user1@example.com" };
      mockUserRepo.findById.mockResolvedValue(mockUser);

      // Act
      const res = await app.request("/1", {
        method: "GET",
        env: mockEnv,
      });
      const data = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(data).toEqual(mockUser);
      expect(mockUserRepo.findById).toHaveBeenCalledWith("1");
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      mockUserRepo.findById.mockResolvedValue(null);

      // Act
      const res = await app.request("/999", {
        method: "GET",
        env: mockEnv,
      });
      const data = await res.json();

      // Assert
      expect(res.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("User not found");
    });
  });

  describe("POST /", () => {
    it("should create a new user", async () => {
      // Arrange
      const mockUserData = { email: "new@example.com", name: "New User" };
      const mockCreatedUser = { id: "3", ...mockUserData };
      mockUserRepo.create.mockResolvedValue(mockCreatedUser);

      // Act
      const res = await app.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUserData),
        env: mockEnv,
      });
      const data = await res.json();

      // Assert
      expect(res.status).toBe(201);
      expect(data).toEqual(mockCreatedUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith(mockUserData);
    });

    it("should handle validation errors", async () => {
      // Arrange
      const invalidUserData = { email: "not-an-email" }; // Missing name
      mockUserRepo.create.mockRejectedValue(new Error("Validation failed"));

      // Act
      const res = await app.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidUserData),
        env: mockEnv,
      });
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Failed to create user");
    });
  });
});
