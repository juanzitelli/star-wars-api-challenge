import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./../planets/planets.service";
import { StarshipsService } from "./../starships/starships.service";
import { CharactersResolver } from "./characters.resolver";
import { CharactersService } from "./characters.service";
import { EmbarkCharacterInput } from "./dto/embark-character.input";

describe("CharactersResolver", () => {
  let resolver: CharactersResolver;
  let characterService: CharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersResolver,
        CharactersService,
        StarshipsService,
        PlanetsService,
        PrismaService,
      ],
    }).compile();

    resolver = module.get<CharactersResolver>(CharactersResolver);
    characterService = module.get<CharactersService>(CharactersService);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should reject embarking a character to a starship because of cargo capacity", async () => {
    const params: EmbarkCharacterInput = {
      characterId: 1,
      starshipId: 1,
    };

    characterService.update = jest.fn().mockResolvedValue({
      id: params.characterId,
    });

    characterService.findOne = jest.fn().mockResolvedValue({
      cargoCapacity: 0,
      name: "ship",
    });

    await expect(async () =>
      characterService.embark(params),
    ).rejects.toThrowError();
  });
});
