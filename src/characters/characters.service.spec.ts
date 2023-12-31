import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { CharactersService } from "./characters.service";
import { CreateCharacterInput } from "./dto/create-character.input";
import { EmbarkCharacterInput } from "./dto/embark-character.input";
import { UpdateCharacterInput } from "./dto/update-character.input";

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
    starship: {
      findUnique: jest.fn(),
    },
    planet: {
      findUnique: jest.fn(),
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

  describe("service", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });
  });

  describe("create", () => {
    it("should create a character when the input is valid", async () => {
      const params: { data: CreateCharacterInput } = {
        data: {
          name: "Test Character",
          sensitivityToTheForce: "High",
          species: "animal",
          currentLocationId: 1,
        },
      };

      prismaService.character.create = jest.fn().mockResolvedValue(params.data);

      expect(await service.create(params)).toEqual(params.data);
    });
  });

  describe("update", () => {
    it("should update a character", async () => {
      const params: {
        data: UpdateCharacterInput;
        where: Prisma.CharacterWhereUniqueInput;
      } = {
        data: {
          name: "Updated Character",
          currentLocationId: 1,
          id: 1,
          sensitivityToTheForce: "High",
          species: "Human",
        },
        where: { id: 1 },
      };

      prismaService.planet.findUnique = jest.fn().mockResolvedValue({
        id: 1,
      });

      prismaService.character.update = jest.fn().mockResolvedValue({
        id: 1,
        name: "Updated Character",
      });

      prismaService.character.findUnique = jest.fn().mockResolvedValue({
        id: 1,
      });

      expect(await service.update(params)).toEqual({
        id: 1,
        name: "Updated Character",
      });
    });
  });

  describe("findAll", () => {
    it("should find all characters", async () => {
      const characters = [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" },
      ];

      prismaService.character.findMany = jest
        .fn()
        .mockResolvedValue(characters);

      expect(await service.findAll({})).toEqual(characters);
    });
  });

  describe("findOne", () => {
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
  });

  describe("remove", () => {
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
  });

  describe("relocate", () => {
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
  });

  describe("embark", () => {
    it("should embark a character to a starship", async () => {
      const params: EmbarkCharacterInput = {
        characterId: 1,
        starshipId: 1,
      };

      prismaService.character.update = jest.fn().mockResolvedValue({
        id: params.characterId,
      });

      prismaService.starship.findUnique = jest.fn().mockResolvedValue({
        cargoCapacity: 10,
        name: "ship",
      });

      expect(await service.embark(params)).toEqual({
        id: params.characterId,
      });
    });
  });

  describe("disembark", () => {
    it("should disembark a character to a starship", async () => {
      const params = {
        characterId: 1,
        starshipId: 1,
      };

      prismaService.character.update = jest.fn().mockResolvedValue({
        id: params.characterId,
      });

      expect(await service.disembark(params)).toEqual({
        id: params.characterId,
      });
    });
  });
});
