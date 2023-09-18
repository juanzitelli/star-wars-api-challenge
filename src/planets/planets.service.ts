import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";

@Injectable()
export class PlanetsService {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.PlanetCreateInput }) {
    return await this.prisma.planet.create(params);
  }

  async findAll() {
    return await this.prisma.planet.findMany();
  }

  async findOne(params: { where: Prisma.PlanetWhereUniqueInput }) {
    return await this.prisma.planet.findUnique(params);
  }

  async update(params: {
    data: Prisma.PlanetUpdateInput;
    where: Prisma.PlanetWhereUniqueInput;
  }) {
    return await this.prisma.planet.update(params);
  }

  async remove(params: { where: Prisma.PlanetWhereUniqueInput }) {
    return await this.prisma.planet.delete(params);
  }
}
