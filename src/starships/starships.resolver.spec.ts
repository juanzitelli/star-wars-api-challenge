import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./../planets/planets.service";
import { CreateStarshipInput } from "./dto/create-starship.input";
import { StarshipsResolver } from "./starships.resolver";
import { StarshipsService } from "./starships.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("StarshipsResolver", () => {
  let starshipsResolver: StarshipsResolver;
  let planetsService: jest.Mocked<PlanetsService>;
  let starshipsService: jest.Mocked<StarshipsService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipsResolver,

        PrismaService,
        {
          provide: StarshipsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            spawnRandomEnemy: jest.fn(),
          },
        },
        {
          provide: PlanetsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    starshipsResolver = moduleRef.get<StarshipsResolver>(StarshipsResolver);
    planetsService = moduleRef.get<PlanetsService>(
      PlanetsService,
    ) as unknown as jest.Mocked<PlanetsService>;
    starshipsService = moduleRef.get<StarshipsService>(
      StarshipsService,
    ) as unknown as jest.Mocked<StarshipsService>;
  });

  it("should be defined", () => {
    expect(starshipsResolver).toBeDefined();
  });

  describe("createStarship", () => {
    it("should create a starship", async () => {
      const createStarshipInput: CreateStarshipInput = {
        cargoCapacity: 1000,
        currentPlanetId: 12,
        latitude: 22.0,
        longitude: 23.0,
        model: "A-Wing",
        name: "Star Destroyer",
      };

      planetsService.findOne.mockResolvedValueOnce({
        id: createStarshipInput.currentPlanetId,
        name: "Jupiter",
        climate: "Gas Giant",
        latitude: 64.52151816723162,
        longitude: -63.95491918219119,
        population: 0,
        terrain: "Gas",
      });

      starshipsService.create.mockResolvedValueOnce({
        id: 1,
        cargoCapacity: 1000,
        currentPlanetId: 12,
        latitude: 22.0,
        longitude: 23.0,
        model: "A-Wing",
        name: "Star Destroyer",
        starshipId: 1,
      });

      const result =
        await starshipsResolver.createStarship(createStarshipInput);
      expect(result).toBeDefined();
      expect(starshipsService.create).toHaveBeenCalledWith({
        data: createStarshipInput,
      });
    });

    it("should throw an error when no planet is found during starship creation", async () => {
      const createStarshipInput: CreateStarshipInput = {
        cargoCapacity: 1000,
        currentPlanetId: 12,
        latitude: 22.0,
        longitude: 23.0,
        model: "A-Wing",
        name: "Star Destroyer",
      };
      planetsService.findOne.mockResolvedValueOnce(null);

      await expect(
        starshipsResolver.createStarship(createStarshipInput),
      ).rejects.toThrowError();
    });
  });

  describe("findOne", () => {
    it("should find a planet when the input is valid", async () => {
      const id: number = 1;
      const starship = {
        id,
        cargoCapacity: 1000,
        currentPlanetId: 12,
        latitude: 22.0,
        longitude: 23.0,
        model: "A-Wing",
        name: "Star Destroyer",
        starshipId: 1,
      };

      starshipsService.findOne.mockResolvedValueOnce(starship);

      expect(await starshipsResolver.findOne(id)).toEqual(starship);
    });

    it("should throw an error when the input is invalid", async () => {
      starshipsService.findOne.mockResolvedValueOnce(null);

      expect(starshipsResolver.findOne(null)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe("updateStarship", () => {
    it("should throw error when the starshipId is invalid", async () => {
      starshipsService.findOne.mockResolvedValueOnce(null);
      planetsService.findOne.mockResolvedValueOnce({
        id: 1,
        name: "Super Venus",
        climate: "Hot",
        latitude: 25.18271739591083,
        longitude: 123.106917192224,
        population: 0,
        terrain: "Rocky",
      });

      expect(
        starshipsResolver.updateStarship({ id: null }),
      ).rejects.toThrowError(NotFoundException);
    });

    it("should throw error when the currentPlanetId is invalid", async () => {
      planetsService.findOne.mockResolvedValueOnce(null);
      starshipsService.findOne.mockResolvedValueOnce({
        id: 11,
        name: "X-Wing",
        model: "T-65B",
        cargoCapacity: 1,
        latitude: 30.43530749668798,
        longitude: 56.89623295380929,
        currentPlanetId: null,
        starshipId: null,
      });

      expect(starshipsResolver.updateStarship({ id: 11 })).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe("removeStarship", () => {
    it("should remove a starship", async () => {
      const id: number = 1;

      starshipsService.findOne.mockResolvedValueOnce({
        id,
        cargoCapacity: 1000,
        currentPlanetId: 12,
        latitude: 22.0,
        longitude: 23.0,
        model: "A-Wing",
        name: "Star Destroyer",
        starshipId: 1,
      });

      starshipsService.remove.mockResolvedValueOnce({
        id: 1,
        cargoCapacity: 1000,
        currentPlanetId: 12,
        latitude: 22.0,
        longitude: 23.0,
        model: "A-Wing",
        name: "Star Destroyer",
        starshipId: 1,
      });

      const result = await starshipsResolver.removeStarship(id);
      expect(result).toBeDefined();
      expect(starshipsService.remove).toHaveBeenCalledWith({ where: { id } });
    });

    it("should throw an error when trying to remove a non-existent starship", async () => {
      const id: number = 1;
      starshipsService.findOne.mockResolvedValueOnce(null);

      await expect(starshipsResolver.removeStarship(id)).rejects.toThrowError();
    });
  });

  describe("spawnRandomEnemy", () => {
    it("should spawn a random enemy when the input is valid", async () => {
      const originalStarship = {
        id: 11,
        name: "X-Wing",
        model: "T-65B",
        cargoCapacity: 1,
        passengers: [],
        enemies: [
          {
            id: 20,
            name: "Sentinel-class landing craft",
          },
          {
            id: 21,
            name: "Millennium Falcon",
          },
        ],
        latitude: 30.43530749668798,
        longitude: 56.89623295380929,
      };

      const newEnemy = {
        id: 23,
        name: "Y-wing",
        model: "BTL Y-wing",
        cargoCapacity: 110,
        latitude: -26.24614771059775,
        longitude: 162.5088320499494,
        currentPlanetId: null,
        starshipId: null,
        enemies: [
          { ...originalStarship, currentPlanetId: null, starshipId: null },
        ],
      };

      starshipsService.findOne.mockResolvedValueOnce({
        ...originalStarship,
        currentPlanetId: null,
        starshipId: null,
      });

      starshipsService.spawnRandomEnemy.mockResolvedValueOnce(newEnemy);

      expect(
        await starshipsResolver.spawnRandomEnemy({
          starshipId: originalStarship.id,
        }),
      ).toEqual(newEnemy);
    });

    it("should throw an error before spawning a random enemy when the input is invalid", async () => {
      const id: number = 1;
      starshipsService.findOne.mockResolvedValueOnce(null);

      await expect(
        starshipsResolver.spawnRandomEnemy({ starshipId: id }),
      ).rejects.toThrowError();
    });
  });
});
