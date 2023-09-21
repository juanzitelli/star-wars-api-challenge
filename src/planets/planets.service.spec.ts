import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./planets.service";

describe("PlanetsService", () => {
  let service: PlanetsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    planet: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      remove: jest.fn(),
    },
    starship: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a planet", async () => {
    const params: { data: Prisma.PlanetCreateInput } = {
      data: {
        climate: "Sandy",
        latitude: 37.7749,
        longitude: -122.4194,
        name: "Saturn",
        population: 30000,
        terrain: "Rocky",
      },
    };

    prismaService.planet.create = jest.fn().mockResolvedValue(params.data);

    expect(await service.create(params)).toEqual(params.data);
  });

  it("should update a planet", async () => {
    const params: {
      data: Prisma.PlanetUpdateInput;
      where: Prisma.PlanetWhereUniqueInput;
    } = {
      data: { name: "Updated Planet" },
      where: { id: 1 },
    };

    prismaService.planet.update = jest.fn().mockResolvedValue({
      id: 1,
      name: "Updated Planet",
    });

    expect(await service.update(params)).toEqual({
      id: 1,
      name: "Updated Planet",
    });
  });

  it("should find all planets", async () => {
    const planets = [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2" },
    ];

    prismaService.planet.findMany = jest.fn().mockResolvedValue(planets);

    expect(await service.findAll({})).toEqual(planets);
  });

  it("should find a planet", async () => {
    const params = { where: { id: 1 } };

    prismaService.planet.findUnique = jest.fn().mockResolvedValue({
      id: 1,
      name: "Test Planet",
    });

    expect(await service.findOne(params)).toEqual({
      id: 1,
      name: "Test Planet",
    });
  });

  it("should remove a planet", async () => {
    const params = { where: { id: 1 } };

    prismaService.planet.delete = jest.fn().mockResolvedValue({
      id: params.where.id,
      name: "Removed Test Planet",
    });

    expect(await service.remove(params)).toEqual({
      id: params.where.id,
      name: "Removed Test Planet",
    });
  });

  it("calculateDistanceToStarship returns the correct distance between a planet and a starship", async () => {
    const planet = {
      latitude: 40.7128,
      longitude: 74.006,
    };

    const starship = {
      latitude: 37.7749,
      longitude: 122.4194,
    };

    prismaService.planet.findUnique = jest.fn().mockResolvedValue(planet);

    prismaService.starship.findUnique = jest.fn().mockResolvedValue(starship);

    const { distanceInMeters } = await service.calculateDistanceToStarship({
      planet,
      starship,
    });

    expect(distanceInMeters).toBeCloseTo(4129086.1650573094);
  });
});
