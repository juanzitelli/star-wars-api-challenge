import { Module } from "@nestjs/common";
import { PrismaModule } from "src/db/prisma.module";
import { CharactersResolver } from "./characters.resolver";
import { CharactersService } from "./characters.service";

@Module({
  imports: [PrismaModule],
  providers: [CharactersResolver, CharactersService],
})
export class CharactersModule {}
