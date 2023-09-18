import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Planet as PlanetSchema } from "@prisma/client";

@ObjectType()
export class Planet {
  @Field(() => String)
  id: PlanetSchema["id"];

  @Field(() => String)
  name: PlanetSchema["name"];

  @Field(() => Int)
  population: PlanetSchema["population"];

  @Field(() => String)
  climate: PlanetSchema["climate"];

  @Field(() => String)
  terrain: PlanetSchema["terrain"];

  @Field(() => Float)
  latitude: PlanetSchema["latitude"];

  @Field(() => Float)
  longitude: PlanetSchema["longitude"];
}

/**
 * model Planet {
  id         Int         @id @default(autoincrement())
  name       String
  population Int
  climate    String
  terrain    String
  latitude   Float
  longitude  Float
  characters Character[]
  starships  Starship[]
}
 */
