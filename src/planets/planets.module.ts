import { Module } from "@nestjs/common";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsService } from "./../starships/starships.service";
import { PlanetsResolver } from "./planets.resolver";
import { PlanetsService } from "./planets.service";

@Module({
  providers: [PlanetsResolver, PlanetsService, StarshipsService, PrismaService],
})
export class PlanetsModule {}
