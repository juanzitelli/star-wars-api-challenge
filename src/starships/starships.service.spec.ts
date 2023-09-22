import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsService } from "./starships.service";
import { CreateStarshipInput } from "./dto/create-starship.input";

describe("StarshipsService", () => {
  let starshipsService: StarshipsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipsService,
        {
          provide: PrismaService,
          useValue: {
            starship: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              remove: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    starshipsService = module.get<StarshipsService>(StarshipsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(starshipsService).toBeDefined();
  });

  describe("create", () => {
    it("should create a starship", async () => {
      const params: { data: Prisma.StarshipCreateInput } = {
        data: {
          name: "Test ship",
          latitude: 123.1231231,
          longitude: 123.1231231,
          model: "Super ship",
          cargoCapacity: 1,
          currentPlanet: {
            connect: {
              id: 1,
            },
          },
        },
      };

      prismaService.starship.create = jest.fn().mockResolvedValue(params.data);

      expect(await starshipsService.create(params)).toEqual(params.data);
    });
  });

  describe("update", () => {
    it("should update a starship", async () => {
      const params: {
        data: Prisma.StarshipUpdateInput;
        where: Prisma.StarshipWhereUniqueInput;
      } = {
        data: { name: "Updated Starship" },
        where: { id: 1 },
      };

      prismaService.starship.update = jest.fn().mockResolvedValue({
        id: 1,
        name: "Updated Starship",
      });

      expect(await starshipsService.update(params)).toEqual({
        id: 1,
        name: "Updated Starship",
      });
    });
  });

  describe("findAll", () => {
    it("should find all starships", async () => {
      const starships = [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" },
      ];

      prismaService.starship.findMany = jest.fn().mockResolvedValue(starships);

      expect(await starshipsService.findAll({})).toEqual(starships);
    });
  });

  describe("findOne", () => {
    it("should find a starship", async () => {
      const params = { where: { id: 1 } };

      prismaService.starship.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        name: "Test Starship",
      });

      expect(await starshipsService.findOne(params)).toEqual({
        id: 1,
        name: "Test Starship",
      });
    });
  });

  describe("remove", () => {
    it("should remove a starship", async () => {
      const params = { where: { id: 1 } };

      prismaService.starship.delete = jest.fn().mockResolvedValue({
        id: params.where.id,
        name: "Removed Test Starship",
      });

      expect(await starshipsService.remove(params)).toEqual({
        id: params.where.id,
        name: "Removed Test Starship",
      });
    });
  });

  describe("spawnRandomEnemy", () => {
    it("should spawn random enemy", async () => {
      const randomEnemy: CreateStarshipInput = {
        cargoCapacity: 1000,
        currentPlanetId: null,
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
        model: "Model",
        name: "Name",
      };

      prismaService.starship.create = jest.fn().mockResolvedValue(randomEnemy);

      expect(
        await starshipsService.spawnRandomEnemy({
          starshipId: 1,
        }),
      ).toEqual(randomEnemy);
    });
  });
});
