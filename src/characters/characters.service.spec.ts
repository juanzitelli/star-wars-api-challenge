import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { CharactersService } from "./characters.service";
import { EmbarkCharacterInput } from "./dto/embark-character.input";
import { DisembarkCharacterInput } from "./dto/disembark-character.input";

describe("CharactersService", () => {
  let service: CharactersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    character: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      remove: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a character", async () => {
    const params: { data: Prisma.CharacterCreateInput } = {
      data: {
        name: "Test Character",
        currentLocation: {
          connect: {
            id: 1,
          },
        },
        sensitivityToTheForce: "High",
        species: "animal",
      },
    };

    prismaService.character.create = jest.fn().mockResolvedValue(params.data);

    expect(await service.create(params)).toEqual(params.data);
  });

  it("should update a character", async () => {
    const params: {
      data: Prisma.CharacterUpdateInput;
      where: Prisma.CharacterWhereUniqueInput;
    } = {
      data: { name: "Updated Character" },
      where: { id: 1 },
    };

    prismaService.character.update = jest.fn().mockResolvedValue({
      id: 1,
      name: "Updated Character",
    });

    expect(await service.update(params)).toEqual({
      id: 1,
      name: "Updated Character",
    });
  });

  it("should find all characters", async () => {
    const characters = [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2" },
    ];

    prismaService.character.findMany = jest.fn().mockResolvedValue(characters);

    expect(await service.findAll()).toEqual(characters);
  });

  it("should find a character", async () => {
    const params = { where: { id: 1 } };

    prismaService.character.findUnique = jest.fn().mockResolvedValue({
      id: 1,
      name: "Test Character",
    });

    expect(await service.findOne(params)).toEqual({
      id: 1,
      name: "Test Character",
    });
  });

  it("should remove a character", async () => {
    const params = { where: { id: 1 } };

    prismaService.character.delete = jest.fn().mockResolvedValue({
      id: params.where.id,
      name: "Removed Test Character",
    });

    expect(await service.remove(params)).toEqual({
      id: params.where.id,
      name: "Removed Test Character",
    });
  });

  it("should relocate a character", async () => {
    const params: {
      planetId: number;
      where: Prisma.CharacterWhereUniqueInput;
    } = { where: { id: 1 }, planetId: 1 };

    prismaService.character.update = jest.fn().mockResolvedValue({
      id: params.where.id,
    });

    expect(await service.relocate(params)).toEqual({
      id: params.where.id,
    });
  });

  it("should embark a character to a starship", async () => {
    const params: EmbarkCharacterInput = {
      characterId: 1,
      starshipId: 1,
    };

    prismaService.character.update = jest.fn().mockResolvedValue({
      id: params.characterId,
    });

    expect(await service.embark(params)).toEqual({
      id: params.characterId,
    });
  });

  it("should disembark a character to a starship", async () => {
    const params: DisembarkCharacterInput = {
      characterId: 1,
    };

    prismaService.character.update = jest.fn().mockResolvedValue({
      id: params.characterId,
    });

    expect(await service.disembark(params)).toEqual({
      id: params.characterId,
    });
  });
});
