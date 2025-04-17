import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";
import { SessionRepository } from "../repositories/sessionRepository";

// Mock the Prisma client
const mockPrisma = mockDeep<PrismaClient>();

// Create a repository instance with the mocked Prisma client
const sessionRepo = new SessionRepository(mockPrisma as any);

// Reset mocks before each test
beforeEach(() => {
  mockReset(mockPrisma);
});

describe("SessionRepository", () => {
  describe("findAll", () => {
    it("should return all sessions with related data", async () => {
      // Arrange
      const mockSessions = [
        {
          id: "1",
          title: "Session 1",
          description: "Description 1",
          ownerId: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: { id: "user1", name: "User 1", email: "user1@example.com" },
          collaborators: [],
          categories: [],
          ideas: [],
        },
        {
          id: "2",
          title: "Session 2",
          description: "Description 2",
          ownerId: "user2",
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: { id: "user2", name: "User 2", email: "user2@example.com" },
          collaborators: [],
          categories: [],
          ideas: [],
        },
      ];

      // Mock the Prisma client's findMany method to return mock data
      mockPrisma.session.findMany.mockResolvedValue(mockSessions as any);

      // Act
      const result = await sessionRepo.findAll();

      // Assert
      expect(result).toEqual(mockSessions);
      expect(mockPrisma.session.findMany).toHaveBeenCalledWith({
        include: {
          owner: true,
          collaborators: true,
          categories: true,
          ideas: true,
        },
      });
    });
  });

  describe("findById", () => {
    it("should return a session by ID with related data", async () => {
      // Arrange
      const mockSession = {
        id: "1",
        title: "Session 1",
        description: "Description 1",
        ownerId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: { id: "user1", name: "User 1", email: "user1@example.com" },
        collaborators: [],
        categories: [],
        ideas: [],
      };

      // Mock the Prisma client's findUnique method to return mock data
      mockPrisma.session.findUnique.mockResolvedValue(mockSession as any);

      // Act
      const result = await sessionRepo.findById("1");

      // Assert
      expect(result).toEqual(mockSession);
      expect(mockPrisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: {
          owner: true,
          collaborators: true,
          categories: true,
          ideas: true,
        },
      });
    });

    it("should return null if session does not exist", async () => {
      // Mock the Prisma client's findUnique method to return null
      mockPrisma.session.findUnique.mockResolvedValue(null);

      // Act
      const result = await sessionRepo.findById("nonexistent");

      // Assert
      expect(result).toBeNull();
      expect(mockPrisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: "nonexistent" },
        include: {
          owner: true,
          collaborators: true,
          categories: true,
          ideas: true,
        },
      });
    });
  });

  describe("create", () => {
    it("should create a new session and return it with related data", async () => {
      // Arrange
      const sessionData = {
        title: "New Session",
        description: "Description",
        ownerId: "user1",
      };

      const mockCreatedSession = {
        id: "123",
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: { id: "user1", name: "User 1", email: "user1@example.com" },
        collaborators: [],
      };

      // Mock the Prisma client's create method to return mock data
      mockPrisma.session.create.mockResolvedValue(mockCreatedSession as any);

      // Act
      const result = await sessionRepo.create(sessionData);

      // Assert
      expect(result).toEqual(mockCreatedSession);
      expect(mockPrisma.session.create).toHaveBeenCalledWith({
        data: sessionData,
        include: {
          owner: true,
          collaborators: true,
        },
      });
    });
  });

  describe("update", () => {
    it("should update an existing session and return it with related data", async () => {
      // Arrange
      const sessionId = "123";
      const updateData = {
        title: "Updated Session",
        description: "Updated Description",
      };

      const mockUpdatedSession = {
        id: sessionId,
        ...updateData,
        ownerId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: { id: "user1", name: "User 1", email: "user1@example.com" },
        collaborators: [],
        categories: [],
        ideas: [],
      };

      // Mock the Prisma client's update method to return mock data
      mockPrisma.session.update.mockResolvedValue(mockUpdatedSession as any);

      // Act
      const result = await sessionRepo.update(sessionId, updateData);

      // Assert
      expect(result).toEqual(mockUpdatedSession);
      expect(mockPrisma.session.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: updateData,
        include: {
          owner: true,
          collaborators: true,
          categories: true,
          ideas: true,
        },
      });
    });
  });

  describe("delete", () => {
    it("should delete a session by ID", async () => {
      // Arrange
      const sessionId = "123";
      const mockDeletedSession = {
        id: sessionId,
        title: "Session",
        description: "Description",
        ownerId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the Prisma client's delete method to return mock data
      mockPrisma.session.delete.mockResolvedValue(mockDeletedSession as any);

      // Act
      const result = await sessionRepo.delete(sessionId);

      // Assert
      expect(result).toEqual(mockDeletedSession);
      expect(mockPrisma.session.delete).toHaveBeenCalledWith({
        where: { id: sessionId },
      });
    });
  });
});
