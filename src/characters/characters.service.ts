import { Injectable, NotFoundException } from "@nestjs/common";
import { Character, Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { CreateCharacterInput } from "./dto/create-character.input";
import { UpdateCharacterInput } from "./dto/update-character.input";

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: CreateCharacterInput }): Promise<Character> {
    return await this.prisma.character.create({
      ...params,
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }

  async update(params: {
    data: UpdateCharacterInput;
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    const character = await this.prisma.character.findUnique({
      where: params.where,
    });

    if (!character) {
      throw new NotFoundException(
        `Couldn't find a character with the given parameters`,
      );
    }

    const planet = await this.prisma.planet.findUnique({
      where: { id: params.data.currentLocationId },
    });

    if (!planet) {
      throw new NotFoundException(
        `Couldn't find a planet with the given currentLocationId`,
      );
    }

    return await this.prisma.character.update({
      ...params,
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }

  async findAll(
    params: Prisma.CharacterFindManyArgs,
  ): Promise<Array<Character>> {
    return this.prisma.character.findMany({
      ...params,
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }

  async findOne(params: Prisma.CharacterFindUniqueArgs): Promise<Character> {
    return await this.prisma.character.findUnique({
      ...params,
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }

  async remove(params: {
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    return this.prisma.character.delete({
      ...params,
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }

  async relocate(params: {
    planetId: number;
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    return this.prisma.character.update({
      data: { currentLocationId: params.planetId },
      where: params.where,
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }

  async embark(params: {
    starshipId: number;
    characterId: number;
  }): Promise<Character> {
    return await this.prisma.character.update({
      data: {
        starship: {
          connect: {
            id: params.starshipId,
          },
        },
      },
      where: {
        id: params.characterId,
      },
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }

  async disembark(params: {
    characterId: number;
    starshipId: number;
  }): Promise<Character> {
    return await this.prisma.character.update({
      data: {
        starship: {
          disconnect: {
            id: params.starshipId,
          },
        },
      },
      where: {
        id: params.characterId,
      },
      include: {
        currentLocation: true,
        starship: true,
      },
    });
  }
}
