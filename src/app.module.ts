import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CharactersModule } from "./characters/characters.module";
import { PlanetsModule } from "./planets/planets.module";
import { StarshipsModule } from "./starships/starships.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
    }),
    CharactersModule,
    PlanetsModule,
    StarshipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
