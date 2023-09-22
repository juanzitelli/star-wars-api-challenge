import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { CreateStarshipInput } from "./dto/create-starship.input";

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

  async spawnRandomEnemy(params: { starshipId: number }) {
    const starshipsResponse = await fetch(`${process.env.SWAPI_URL}/starships`);
    const starshipsData = await starshipsResponse.json();

    if (!starshipsData.results.length) {
      return null;
    }

    const randomStarshipData =
      starshipsData.results[
        Math.floor(Math.random() * starshipsData.results.length)
      ];

    const randomEnemy: CreateStarshipInput = {
      cargoCapacity: Math.floor(Math.random() * 10) + 1,
      currentPlanetId: null,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      model: randomStarshipData.model,
      name: randomStarshipData.name,
    };

    const spawnedEnemy = await this.prisma.starship.create({
      data: {
        ...randomEnemy,
        enemies: {
          connect: {
            id: params.starshipId,
          },
        },
      },
      include: {
        enemies: true,
      },
    });

    await this.prisma.starship.update({
      where: {
        id: params.starshipId,
      },
      data: {
        enemies: {
          connect: {
            id: spawnedEnemy.id,
          },
        },
      },
    });

    return spawnedEnemy;
  }
}
