import { Injectable } from "@nestjs/common";
import { Character, Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: Prisma.CharacterCreateInput;
  }): Promise<Character> {
    const { data } = params;
    return this.prisma.character.create({ data });
  }

  async update(params: {
    data: Prisma.CharacterUpdateInput;
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    const { data, where } = params;
    return this.prisma.character.update({ where, data });
  }

  async findAll(): Promise<Array<Character>> {
    return this.prisma.character.findMany({
      include: {
        starship: true,
      },
    });
  }

  async findOne(params: {
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    const { where } = params;
    return this.prisma.character.findUnique({
      where,
      include: { starship: true },
    });
  }

  async remove(params: {
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    const { where } = params;
    return this.prisma.character.delete({ where });
  }

  async relocate(params: {
    planetId: number;
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    const { planetId, where } = params;
    return this.prisma.character.update({
      data: { currentLocationId: planetId },
      where,
    });
  }

  async embark(params: {
    starshipId: number;
    characterId: number;
  }): Promise<Character> {
    const { starshipId, characterId } = params;

    const starshipPassengers = await this.prisma.character.findMany({
      where: {
        starshipId: starshipId,
      },
      select: {
        id: true,
      },
    });

    const { cargoCapacity, name } = await this.prisma.starship.findUnique({
      where: {
        id: starshipId,
      },
      select: {
        cargoCapacity: true,
        name: true,
      },
    });

    if (starshipPassengers.length < cargoCapacity) {
      return this.prisma.character.update({
        data: {
          starship: {
            connect: {
              id: starshipId,
            },
          },
        },
        where: {
          id: characterId,
        },
      });
    }

    throw new Error(
      `Can't embark a new character to ${name} since it's cargo capacity of ${cargoCapacity} is complete`,
    );
  }

  async disembark(params: { characterId: number }): Promise<Character> {
    const { characterId } = params;
    return this.prisma.character.update({
      data: {
        starshipId: null,
      },
      where: {
        id: characterId,
      },
    });
  }
}
