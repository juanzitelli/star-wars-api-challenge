import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsService } from "./../starships/starships.service";
import { PlanetsResolver } from "./planets.resolver";
import { PlanetsService } from "./planets.service";

describe("PlanetsResolver", () => {
  let resolver: PlanetsResolver;
  let planetsService: jest.Mocked<PlanetsService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsResolver,
        {
          provide: PlanetsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        PrismaService,
        StarshipsService,
      ],
    }).compile();

    resolver = moduleRef.get<PlanetsResolver>(PlanetsResolver);

    planetsService = moduleRef.get<PlanetsService>(
      PlanetsService,
    ) as unknown as jest.Mocked<PlanetsService>;
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should create a planet when the input is valid", async () => {
    const createReturnValue: Awaited<ReturnType<PlanetsService["create"]>> = {
      id: 13,
      name: "Jupiter",
      climate: "Gas Giant",
      latitude: 64.52151816723162,
      longitude: -63.95491918219119,
      population: 0,
      terrain: "Gas",
    };

    planetsService.create.mockResolvedValueOnce(createReturnValue);

    expect(
      await resolver.createPlanet({
        ...createReturnValue,
      }),
    ).toBe(createReturnValue);
  });

  it("should return a planet by id", async () => {
    const findOneReturnValue: Awaited<ReturnType<PlanetsService["create"]>> = {
      id: 1,
      name: "Jupiter",
      climate: "Gas Giant",
      latitude: 64.52151816723162,
      longitude: -63.95491918219119,
      population: 0,
      terrain: "Gas",
    };

    planetsService.findOne = jest
      .fn()
      .mockResolvedValueOnce(findOneReturnValue);

    expect(await resolver.findOne(1)).toBe(findOneReturnValue);
  });

  it("should throw an error if planet not found", async () => {
    planetsService.findOne.mockResolvedValueOnce(null);

    await expect(resolver.findOne(1)).rejects.toThrow(NotFoundException);
  });
});
