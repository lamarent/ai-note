import { PrismaClientType } from "../prismaClient";

export class UserRepository {
  constructor(private prisma: PrismaClientType) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; name: string | null }) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: { email?: string; name?: string | null }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
