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
    return this.prisma.character.findMany();
  }

  async findOne(params: {
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    const { where } = params;
    return this.prisma.character.findUnique({ where });
  }

  async remove(params: {
    where: Prisma.CharacterWhereUniqueInput;
  }): Promise<Character> {
    const { where } = params;
    return this.prisma.character.delete({ where });
  }
}
