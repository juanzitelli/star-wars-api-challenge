import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";

@Injectable()
export class StarshipsService {
  constructor(private prisma: PrismaService) {}

  async create(params: Prisma.StarshipCreateArgs) {
    return await this.prisma.starship.create(params);
  }

  async findAll(params: Prisma.StarshipFindManyArgs) {
    return await this.prisma.starship.findMany(params);
  }

  async findOne(params: Prisma.StarshipFindUniqueArgs) {
    return await this.prisma.starship.findUnique(params);
  }

  async update(params: Prisma.StarshipUpdateArgs) {
    return await this.prisma.starship.update(params);
  }

  async remove(params: Prisma.StarshipDeleteArgs) {
    return await this.prisma.starship.delete(params);
  }
}
