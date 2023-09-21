import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";

@Injectable()
export class StarshipsService {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.StarshipCreateInput }) {
    return await this.prisma.starship.create({
      ...params,
      include: {
        currentPlanet: true,
      },
    });
  }

  async findAll(params: Prisma.StarshipFindManyArgs) {
    return await this.prisma.starship.findMany({
      ...params,
      include: {
        currentPlanet: true,
      },
    });
  }

  async findOne(params: {
    where: Prisma.StarshipWhereUniqueInput;
    select?: Prisma.StarshipSelect;
  }) {
    return await this.prisma.starship.findUnique({
      ...params,
      include: {
        currentPlanet: true,
      },
    });
  }

  async update(params: {
    data: Prisma.StarshipUpdateInput;
    where: Prisma.StarshipWhereUniqueInput;
  }) {
    return await this.prisma.starship.update({
      ...params,
      include: {
        currentPlanet: true,
      },
    });
  }

  async remove(params: { where: Prisma.StarshipWhereUniqueInput }) {
    return await this.prisma.starship.delete(params);
  }
}
