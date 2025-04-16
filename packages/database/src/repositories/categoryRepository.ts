import { PrismaClientType } from "../prismaClient";

export class CategoryRepository {
  constructor(private prisma: PrismaClientType) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        session: true,
        ideas: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        session: true,
        ideas: true,
      },
    });
  }

  async findBySessionId(sessionId: string) {
    return this.prisma.category.findMany({
      where: { sessionId },
      include: {
        ideas: true,
      },
    });
  }

  async create(data: { name: string; color: string; sessionId: string }) {
    return this.prisma.category.create({
      data,
      include: {
        session: true,
        ideas: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      color?: string;
    }
  ) {
    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        session: true,
        ideas: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async deleteBySessionId(sessionId: string) {
    return this.prisma.category.deleteMany({
      where: { sessionId },
    });
  }
}
