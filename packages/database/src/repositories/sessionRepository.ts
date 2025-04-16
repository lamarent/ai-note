import { PrismaClientType } from "../prismaClient";

export class SessionRepository {
  constructor(private prisma: PrismaClientType) {}

  async findAll() {
    return this.prisma.session.findMany({
      include: {
        owner: true,
        collaborators: true,
        categories: true,
        ideas: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: {
        owner: true,
        collaborators: true,
        categories: true,
        ideas: true,
      },
    });
  }

  async findByOwnerId(ownerId: string) {
    return this.prisma.session.findMany({
      where: { ownerId },
      include: {
        owner: true,
        collaborators: true,
        categories: true,
        ideas: true,
      },
    });
  }

  async create(data: {
    title: string;
    description?: string | null;
    ownerId: string;
    collaborators?: { connect: { id: string }[] };
  }) {
    return this.prisma.session.create({
      data,
      include: {
        owner: true,
        collaborators: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      collaborators?:
        | { connect: { id: string }[] }
        | { disconnect: { id: string }[] };
    }
  ) {
    return this.prisma.session.update({
      where: { id },
      data,
      include: {
        owner: true,
        collaborators: true,
        categories: true,
        ideas: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.session.delete({
      where: { id },
    });
  }
}
