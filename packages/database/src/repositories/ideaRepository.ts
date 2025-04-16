import { PrismaClientType } from "../prismaClient";

export class IdeaRepository {
  constructor(private prisma: PrismaClientType) {}

  async findAll() {
    const ideas = await this.prisma.idea.findMany({
      include: {
        session: true,
        category: true,
      },
    });
    return ideas.map(this.parsePosition);
  }

  async findById(id: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id },
      include: {
        session: true,
        category: true,
      },
    });
    return idea ? this.parsePosition(idea) : null;
  }

  async findBySessionId(sessionId: string) {
    const ideas = await this.prisma.idea.findMany({
      where: { sessionId },
      include: {
        category: true,
      },
    });
    return ideas.map(this.parsePosition);
  }

  async findByCategoryId(categoryId: string) {
    const ideas = await this.prisma.idea.findMany({
      where: { categoryId },
      include: {
        session: true,
      },
    });
    return ideas.map(this.parsePosition);
  }

  async create(data: {
    content: string;
    position: { x: number; y: number };
    sessionId: string;
    categoryId?: string | null;
  }) {
    const { position, ...restData } = data;
    const created = await this.prisma.idea.create({
      data: {
        ...restData,
        position: JSON.stringify(position),
      },
      include: {
        session: true,
        category: true,
      },
    });
    return this.parsePosition(created);
  }

  async update(
    id: string,
    data: {
      content?: string;
      position?: { x: number; y: number };
      categoryId?: string | null;
    }
  ) {
    const updateData: any = {};

    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    if (data.categoryId !== undefined) {
      updateData.categoryId = data.categoryId;
    }

    if (data.position !== undefined) {
      updateData.position = JSON.stringify(data.position);
    }

    const updated = await this.prisma.idea.update({
      where: { id },
      data: updateData,
      include: {
        session: true,
        category: true,
      },
    });
    return this.parsePosition(updated);
  }

  async delete(id: string) {
    return this.prisma.idea.delete({
      where: { id },
    });
  }

  async deleteBySessionId(sessionId: string) {
    return this.prisma.idea.deleteMany({
      where: { sessionId },
    });
  }

  // Helper method to parse position from database string to object
  private parsePosition(idea: any): any {
    if (idea && typeof idea.position === "string") {
      try {
        idea.position = JSON.parse(idea.position);
      } catch (e) {
        console.error("Failed to parse position:", e);
        idea.position = { x: 0, y: 0 }; // Default position on error
      }
    }
    return idea;
  }
}
