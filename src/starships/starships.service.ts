import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";

@Injectable()
export class StarshipsService {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.StarshipCreateInput }) {
    return await this.prisma.starship.create(params);
  }

  async findAll() {
    return await this.prisma.starship.findMany();
  }

  async findOne(params: { where: Prisma.StarshipWhereUniqueInput }) {
    return await this.prisma.starship.findUnique(params);
  }

  async update(params: {
    data: Prisma.StarshipUpdateInput;
    where: Prisma.StarshipWhereUniqueInput;
  }) {
    return await this.prisma.starship.update(params);
  }

  async remove(params: { where: Prisma.StarshipWhereUniqueInput }) {
    return await this.prisma.starship.delete(params);
  }
}
