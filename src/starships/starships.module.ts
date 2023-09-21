import { Module } from "@nestjs/common";
import { PlanetsService } from "src/planets/planets.service";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsResolver } from "./starships.resolver";
import { StarshipsService } from "./starships.service";

@Module({
  providers: [
    StarshipsResolver,
    StarshipsService,
    PlanetsService,
    PrismaService,
  ],
})
export class StarshipsModule {}
