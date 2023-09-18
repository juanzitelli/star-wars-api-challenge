import { Module } from "@nestjs/common";
import { PlanetsResolver } from "./planets.resolver";
import { PlanetsService } from "./planets.service";

@Module({
  providers: [PlanetsResolver, PlanetsService],
})
export class PlanetsModule {}
