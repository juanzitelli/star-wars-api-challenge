import { Module } from "@nestjs/common";
import { PrismaService } from "./../db/prisma.service";
import { StarshipsResolver } from "./starships.resolver";
import { StarshipsService } from "./starships.service";

@Module({
  providers: [StarshipsResolver, StarshipsService, PrismaService],
})
export class StarshipsModule {}
