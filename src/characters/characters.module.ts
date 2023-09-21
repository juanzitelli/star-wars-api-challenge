import { Module } from "@nestjs/common";
import { PrismaModule } from "./../db/prisma.module";
import { PrismaService } from "./../db/prisma.service";
import { PlanetsService } from "./../planets/planets.service";
import { StarshipsService } from "./../starships/starships.service";
import { CharactersResolver } from "./characters.resolver";
import { CharactersService } from "./characters.service";

@Module({
  imports: [PrismaModule],
  providers: [
    CharactersResolver,
    CharactersService,
    StarshipsService,
    PlanetsService,
    PrismaService,
  ],
})
export class CharactersModule {}
