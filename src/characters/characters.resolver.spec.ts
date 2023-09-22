import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Character, SensitivityToTheForce } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./../planets/planets.service";
import { StarshipsResolver } from "./../starships/starships.resolver";
import { StarshipsService } from "./../starships/starships.service";
import { CharactersResolver } from "./characters.resolver";
import { CharactersService } from "./characters.service";
import { CreateCharacterInput } from "./dto/create-character.input";
import { EmbarkCharacterInput } from "./dto/embark-character.input";
import { UpdateCharacterInput } from "./dto/update-character.input";

describe("CharactersResolver", () => {
  let charactersResolver: CharactersResolver;
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
            disembark: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            relocate: jest.fn(),
            remove: jest.fn(),
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

    charactersResolver = moduleRef.get<CharactersResolver>(CharactersResolver);

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

  describe("resolver", () => {
    it("should be defined", () => {
      expect(charactersResolver).toBeDefined();
    });
  });

  describe("createCharacter", () => {
    it("should create a new character when provided valid data", async () => {
      const params: CreateCharacterInput = {
        name: "Han Solo",
        sensitivityToTheForce: SensitivityToTheForce["Low"],
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

      expect(await charactersResolver.createCharacter(params)).toEqual(
        expectedValue,
      );
    });

    it("should throw an error when creating a character and provided an invalid planet id", async () => {
      const params: CreateCharacterInput = {
        name: "new CharactersService",
        currentLocationId: 1,
        sensitivityToTheForce: SensitivityToTheForce["Low"],
        species: "Human",
      };

      planetsService.findOne.mockResolvedValue(null);

      await expect(charactersResolver.createCharacter(params)).rejects.toThrow(
        new BadRequestException(
          `Couldn't find a planet with the given currentLocationId`,
        ),
      );
    });
  });

  describe("findOne", () => {
    it("should find one character when input is valid", async () => {
      const character: Character = {
        id: 11,
        name: "Leia",
        currentLocationId: 14,
        sensitivityToTheForce: SensitivityToTheForce["Low"],
        species: "Alien",
        starshipId: null,
      };

      charactersService.findOne.mockResolvedValue(character);

      expect(await charactersResolver.findOne(character.id)).toEqual(character);
    });

    it("should throw error when input is invalid", async () => {
      charactersService.findOne.mockResolvedValue(null);
      expect(charactersResolver.findOne(null)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe("updateCharacter", () => {
    const updateCharacter = {
      id: 11,
      name: "Leia",
      currentLocationId: 14,
      sensitivityToTheForce: SensitivityToTheForce["Low"],
      species: "Alien",
      starshipId: null,
    } as const;

    it("should update a character when the input is valid", async () => {
      charactersService.findOne.mockResolvedValueOnce(updateCharacter);

      planetsService.findOne.mockResolvedValue({
        id: 13,
        name: "Jupiter",
        climate: "Gas Giant",
        latitude: 64.52151816723162,
        longitude: -63.95491918219119,
        population: 0,
        terrain: "Gas",
      });

      charactersService.update.mockResolvedValueOnce(updateCharacter);

      expect(
        await charactersResolver.updateCharacter(
          updateCharacter as UpdateCharacterInput,
        ),
      ).toEqual(updateCharacter);
    });
    it("should throw error when the character provided doesn't exist", async () => {
      charactersService.findOne.mockResolvedValueOnce(null);
      expect(
        charactersResolver.updateCharacter(updateCharacter),
      ).rejects.toThrowError(NotFoundException);
    });

    it("should throw error when the currentLocationId provided doesn't exist", async () => {
      planetsService.findOne.mockResolvedValueOnce(null);
      charactersService.findOne.mockResolvedValueOnce(updateCharacter);
      expect(
        charactersResolver.updateCharacter(updateCharacter),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe("removeCharacter", () => {
    const character = {
      id: 11,
      name: "Leia",
      currentLocationId: 14,
      sensitivityToTheForce: SensitivityToTheForce["Low"],
      species: "Alien",
      starshipId: null,
    } as const;

    it("should remove a character when the input is valid", async () => {
      charactersService.findOne.mockResolvedValueOnce(character);
      charactersService.remove.mockResolvedValueOnce(character);

      expect(await charactersResolver.removeCharacter(character.id)).toEqual(
        character,
      );
    });

    it("should throw error when the input is invalid", async () => {
      charactersService.findOne.mockResolvedValueOnce(null);
      expect(charactersResolver.removeCharacter(null)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe("relocateCharacter", () => {
    const planet = {
      id: 13,
      name: "Jupiter",
      climate: "Gas Giant",
      latitude: 64.52151816723162,
      longitude: -63.95491918219119,
      population: 0,
      terrain: "Gas",
    };

    const character = {
      id: 11,
      name: "Leia",
      currentLocationId: 14,
      sensitivityToTheForce: SensitivityToTheForce.High,
      species: "Alien",
      starshipId: null,
    };

    it("should relocate a character when input is valid", async () => {
      planetsService.findOne.mockResolvedValue(planet);
      charactersService.findOne.mockResolvedValue(character);
      charactersService.relocate.mockResolvedValue(character);

      expect(
        await charactersResolver.relocateCharacter({
          characterId: character.id,
          planetId: planet.id,
        }),
      ).toEqual(character);
    });

    it("should throw error when planetId is invalid", async () => {
      planetsService.findOne.mockResolvedValue(null);
      charactersService.findOne.mockResolvedValue(character);
      charactersService.relocate.mockResolvedValue(character);

      expect(
        charactersResolver.relocateCharacter({
          characterId: character.id,
          planetId: null,
        }),
      ).rejects.toThrowError(BadRequestException);
    });

    it("should throw error when characterId is invalid", async () => {
      planetsService.findOne.mockResolvedValue(planet);
      charactersService.findOne.mockResolvedValue(null);
      charactersService.relocate.mockResolvedValue(null);

      expect(
        charactersResolver.relocateCharacter({
          characterId: null,
          planetId: planet.id,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe("embarkCharacter", () => {
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
        sensitivityToTheForce: SensitivityToTheForce["Low"],
        species: "Human",
        currentLocationId: 1,
        starshipId: 14,
      });

      await expect(async () =>
        charactersResolver.embarkCharacter(params),
      ).rejects.toThrowError();
    });

    it("should embark a character when both character and starship input are valid", async () => {
      const findOneReturnValue: Awaited<
        ReturnType<CharactersService["findOne"]>
      > = {
        id: 12,
        name: "Han Solo",
        sensitivityToTheForce: SensitivityToTheForce["Low"],
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
        await charactersResolver.embarkCharacter({
          characterId: findOneReturnValue.id,
          starshipId: findOneStarshipReturnValue.id,
        }),
      ).toEqual(findOneReturnValue);
    });
  });

  describe("disembarkCharacter", () => {
    const character = {
      id: 12,
      name: "Han Solo",
      sensitivityToTheForce: SensitivityToTheForce["Low"],
      species: "Human",
      starshipId: 14,
      currentLocationId: 1,
    };
    it("should disembark a character when input is valid", async () => {
      charactersService.findOne.mockResolvedValue(character);
      charactersService.disembark.mockResolvedValue(character);
      expect(
        await charactersResolver.disembarkCharacter({ characterId: 12 }),
      ).toEqual(character);
    });

    it("should throw error if character isn't found", async () => {
      charactersService.findOne.mockResolvedValue(null);
      expect(
        charactersResolver.disembarkCharacter({ characterId: null }),
      ).rejects.toThrowError(NotFoundException);
    });

    it("should throw error if character hasn't been boarded onto a starship", async () => {
      charactersService.findOne.mockResolvedValue({
        ...character,
        starshipId: null,
      });
      expect(
        charactersResolver.disembarkCharacter({ characterId: 3 }),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
