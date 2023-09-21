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
        StarshipsResolver,
        CharactersResolver,
        PrismaService,
        {
          provide: CharactersService,
          useValue: {
            create: jest.fn(),
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
    charactersService = moduleRef.get<CharactersService>(
      CharactersService,
    ) as unknown as jest.Mocked<CharactersService>;
    resolver = moduleRef.get<CharactersResolver>(CharactersResolver);
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

    charactersService.update = jest.fn().mockResolvedValue({
      id: params.characterId,
    });

    starshipsService.findOne = jest.fn().mockResolvedValue({
      cargoCapacity: 0,
      name: "ship",
    });

    await expect(async () =>
      charactersService.embark(params),
    ).rejects.toThrowError();
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
      name: "new character",
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
