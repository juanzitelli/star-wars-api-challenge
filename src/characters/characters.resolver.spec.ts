import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { CharactersResolver } from "./characters.resolver";
import { CharactersService } from "./characters.service";

describe("CharactersResolver", () => {
  let resolver: CharactersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharactersResolver, CharactersService, PrismaService],
    }).compile();

    resolver = module.get<CharactersResolver>(CharactersResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
