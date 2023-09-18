import { Module } from "@nestjs/common";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsResolver } from "./planets.resolver";
import { PlanetsService } from "./planets.service";

@Module({
  providers: [PlanetsResolver, PlanetsService, PrismaService],
})
export class PlanetsModule {}
