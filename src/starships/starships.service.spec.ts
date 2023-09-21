import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsService } from "./starships.service";

describe("StarshipsService", () => {
  let service: StarshipsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    starship: {
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
        StarshipsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StarshipsService>(StarshipsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

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

    expect(await service.create(params)).toEqual(params.data);
  });

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

    expect(await service.update(params)).toEqual({
      id: 1,
      name: "Updated Starship",
    });
  });

  it("should find all starships", async () => {
    const starships = [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2" },
    ];

    prismaService.starship.findMany = jest.fn().mockResolvedValue(starships);

    expect(await service.findAll({})).toEqual(starships);
  });

  it("should find a starship", async () => {
    const params = { where: { id: 1 } };

    prismaService.starship.findUnique = jest.fn().mockResolvedValue({
      id: 1,
      name: "Test Starship",
    });

    expect(await service.findOne(params)).toEqual({
      id: 1,
      name: "Test Starship",
    });
  });

  it("should remove a starship", async () => {
    const params = { where: { id: 1 } };

    prismaService.starship.delete = jest.fn().mockResolvedValue({
      id: params.where.id,
      name: "Removed Test Starship",
    });

    expect(await service.remove(params)).toEqual({
      id: params.where.id,
      name: "Removed Test Starship",
    });
  });
});
