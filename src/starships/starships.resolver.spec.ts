import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./../planets/planets.service";
import { CreateStarshipInput } from "./dto/create-starship.input";
import { StarshipsResolver } from "./starships.resolver";
import { StarshipsService } from "./starships.service";

describe("StarshipsResolver", () => {
  let resolver: StarshipsResolver;
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
    resolver = moduleRef.get<StarshipsResolver>(StarshipsResolver);
    planetsService = moduleRef.get<PlanetsService>(
      PlanetsService,
    ) as unknown as jest.Mocked<PlanetsService>;
    starshipsService = moduleRef.get<StarshipsService>(
      StarshipsService,
    ) as unknown as jest.Mocked<StarshipsService>;
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

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

    const result = await resolver.createStarship(createStarshipInput);
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
      resolver.createStarship(createStarshipInput),
    ).rejects.toThrowError();
  });

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

    const result = await resolver.removeStarship(id);
    expect(result).toBeDefined();
    expect(starshipsService.remove).toHaveBeenCalledWith({ where: { id } });
  });

  it("should throw an error when trying to remove a non-existent starship", async () => {
    const id: number = 1;
    starshipsService.findOne.mockResolvedValueOnce(null);

    await expect(resolver.removeStarship(id)).rejects.toThrowError();
  });

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
      await resolver.spawnRandomEnemy({ starshipId: originalStarship.id }),
    ).toEqual(newEnemy);
  });

  it("should throw an error before spawning a random enemy when the input is valid", async () => {
    const id: number = 1;
    starshipsService.findOne.mockResolvedValueOnce(null);

    await expect(
      resolver.spawnRandomEnemy({ starshipId: id }),
    ).rejects.toThrowError();
  });
});
