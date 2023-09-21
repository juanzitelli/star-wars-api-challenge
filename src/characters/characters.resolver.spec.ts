import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./../planets/planets.service";
import { StarshipsResolver } from "./../starships/starships.resolver";
import { StarshipsService } from "./../starships/starships.service";
import { CharactersResolver } from "./characters.resolver";
import { CharactersService } from "./characters.service";
import { CreateCharacterInput } from "./dto/create-character.input";
import { EmbarkCharacterInput } from "./dto/embark-character.input";

describe("CharactersResolver", () => {
  let resolver: CharactersResolver;
  let charactersService: jest.Mocked<CharactersService>;
  let planetsService: jest.Mocked<PlanetsService>;
  let starshipsService: jest.Mocked<StarshipsService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersResolver,
        StarshipsResolver,
        PrismaService,
        {
          provide: CharactersService,
          useValue: {
            create: jest.fn(),
            embark: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: StarshipsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
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

    resolver = moduleRef.get<CharactersResolver>(CharactersResolver);

    charactersService = moduleRef.get<CharactersService>(
      CharactersService,
    ) as unknown as jest.Mocked<CharactersService>;
    planetsService = moduleRef.get<PlanetsService>(
      PlanetsService,
    ) as jest.Mocked<PlanetsService>;
    starshipsService = moduleRef.get<StarshipsService>(
      StarshipsService,
    ) as jest.Mocked<StarshipsService>;
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should reject embarking a character to a starship because of cargo capacity", async () => {
    const params: EmbarkCharacterInput = {
      characterId: 1,
      starshipId: 1,
    };

    starshipsService.findOne.mockResolvedValue({
      cargoCapacity: 0,
      id: 11,
      name: "X-Wing",
      model: "T-65B",
      currentPlanetId: 1,
      starshipId: 1,
      latitude: 30.43530749668798,
      longitude: 56.89623295380929,
    });

    charactersService.update.mockResolvedValue({
      id: params.characterId,
      name: "Han Solo",
      sensitivityToTheForce: "Low",
      species: "Human",
      currentLocationId: 1,
      starshipId: 14,
    });

    await expect(async () =>
      resolver.embarkCharacter(params),
    ).rejects.toThrowError();
  });

  it("should embark a character when both character and starship input are valid", async () => {
    const findOneReturnValue: Awaited<
      ReturnType<CharactersService["findOne"]>
    > = {
      id: 12,
      name: "Han Solo",
      sensitivityToTheForce: "Low",
      species: "Human",
      starshipId: 14,
      currentLocationId: 1,
    };

    charactersService.findOne.mockResolvedValue(findOneReturnValue);

    const findOneStarshipReturnValue: Awaited<
      ReturnType<StarshipsService["findOne"]>
    > = {
      id: 12,
      currentPlanetId: 1,
      starshipId: 1,
      name: "Y-Wing",
      model: "BTL-B Y-wing starfighter",
      cargoCapacity: 2,
      latitude: -40.90587021435161,
      longitude: 83.6093189837539,
    };

    starshipsService.findOne.mockResolvedValue(findOneStarshipReturnValue);

    const findAllReturnValue: Awaited<
      ReturnType<CharactersService["findAll"]>
    > = [findOneReturnValue];

    charactersService.findAll.mockResolvedValue(findAllReturnValue);

    charactersService.embark.mockResolvedValue(findOneReturnValue);

    expect(
      await resolver.embarkCharacter({
        characterId: findOneReturnValue.id,
        starshipId: findOneStarshipReturnValue.id,
      }),
    ).toEqual(findOneReturnValue);
  });

  it("should create a new character when provided valid data", async () => {
    const params: CreateCharacterInput = {
      name: "Han Solo",
      sensitivityToTheForce: "Low",
      species: "Human",
      currentLocationId: 13,
    };

    planetsService.findOne.mockResolvedValue({
      id: params.currentLocationId,
      name: "Jupiter",
      climate: "Gas Giant",
      latitude: 64.52151816723162,
      longitude: -63.95491918219119,
      population: 0,
      terrain: "Gas",
    });

    const expectedValue = {
      id: 1,
      starshipId: null,
      ...params,
    };

    charactersService.create.mockResolvedValue(expectedValue);

    expect(await resolver.createCharacter(params)).toEqual(expectedValue);
  });

  it("should throw an error when provided an invalid planet id", async () => {
    const params: CreateCharacterInput = {
      name: "new CharactersService",
      currentLocationId: 1,
      sensitivityToTheForce: "Low",
      species: "Human",
    };

    planetsService.findOne.mockResolvedValue(null);

    await expect(resolver.createCharacter(params)).rejects.toThrow(
      new BadRequestException(
        `Couldn't find a planet with the given currentLocationId`,
      ),
    );
  });
});
