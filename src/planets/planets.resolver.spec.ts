import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsService } from "./../starships/starships.service";
import { PlanetsResolver } from "./planets.resolver";
import { PlanetsService } from "./planets.service";

describe("PlanetsResolver", () => {
  let resolver: PlanetsResolver;
  let planetsService: jest.Mocked<PlanetsService>;
  let starshipsService: jest.Mocked<StarshipsService>;

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
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: StarshipsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    resolver = moduleRef.get<PlanetsResolver>(PlanetsResolver);

    planetsService = moduleRef.get<PlanetsService>(
      PlanetsService,
    ) as unknown as jest.Mocked<PlanetsService>;

    starshipsService = moduleRef.get<StarshipsService>(
      StarshipsService,
    ) as unknown as jest.Mocked<StarshipsService>;
  });

  describe("resolver", () => {
    it("should be defined", () => {
      expect(resolver).toBeDefined();
    });
  });

  describe("create", () => {
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
  });

  describe("findOne", () => {
    it("should return a planet by id", async () => {
      const findOneReturnValue: Awaited<ReturnType<PlanetsService["create"]>> =
        {
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

  describe("calculateDistanceToStarshipInput", () => {
    it("should fail when the planetId doesn't exist", async () => {
      planetsService.findOne.mockResolvedValueOnce(null);
      expect(
        resolver.calculateDistanceToStarship({
          planetId: null,
          starshipId: 1,
        }),
      ).rejects.toThrowError(NotFoundException);
    });

    it("should fail when the starshipId doesn't exist", async () => {
      starshipsService.findOne.mockResolvedValueOnce(null);
      expect(
        resolver.calculateDistanceToStarship({
          planetId: 1,
          starshipId: null,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update planet when input is valid", async () => {
      const planet = {
        id: 12,
        name: "Super Venus",
        climate: "Hot",
        latitude: 25.18271739591083,
        longitude: 123.106917192224,
        population: 0,
        terrain: "Rocky",
      };
      planetsService.findOne.mockResolvedValueOnce(planet);
      planetsService.update.mockResolvedValueOnce(planet);

      expect(await resolver.updatePlanet(planet)).toEqual(planet);
    });

    it("should throw error when the id is invalid", async () => {
      planetsService.findOne.mockResolvedValueOnce(null);
      expect(
        resolver.updatePlanet({
          id: 12,
          name: "Super Venus",
          climate: "Hot",
          latitude: 25.18271739591083,
          longitude: 123.106917192224,
          population: 0,
          terrain: "Rocky",
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove planet when input is valid", async () => {
      const planet = {
        id: 12,
        name: "Super Venus",
        climate: "Hot",
        latitude: 25.18271739591083,
        longitude: 123.106917192224,
        population: 0,
        terrain: "Rocky",
      };
      planetsService.findOne.mockResolvedValueOnce(planet);
      planetsService.remove.mockResolvedValueOnce(planet);

      expect(await resolver.removePlanet(planet.id)).toEqual(planet);
    });

    it("should throw error when the id is invalid", async () => {
      planetsService.findOne.mockResolvedValueOnce(null);
      expect(resolver.removePlanet(null)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
