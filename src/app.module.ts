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
import { GraphQLFormattedError } from "graphql";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      formatError: (formattedError: GraphQLFormattedError) => {
        return {
          message: formattedError.extensions.originalError?.["message"],
          status: formattedError.extensions.originalError?.["statusCode"],
          error: formattedError.extensions.originalError?.["error"],
        };
      },
    }),
    CharactersModule,
    PlanetsModule,
    StarshipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
