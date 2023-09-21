import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsService } from "./../starships/starships.service";
import { PlanetsResolver } from "./planets.resolver";
import { PlanetsService } from "./planets.service";

describe("PlanetsResolver", () => {
  let resolver: PlanetsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsResolver,
        PlanetsService,
        PrismaService,
        StarshipsService,
      ],
    }).compile();

    resolver = module.get<PlanetsResolver>(PlanetsResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
