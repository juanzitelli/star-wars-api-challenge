import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./../planets/planets.service";
import { StarshipsResolver } from "./starships.resolver";
import { StarshipsService } from "./starships.service";

describe("StarshipsResolver", () => {
  let resolver: StarshipsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipsResolver,
        StarshipsService,
        PlanetsService,
        PrismaService,
      ],
    }).compile();

    resolver = module.get<StarshipsResolver>(StarshipsResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
