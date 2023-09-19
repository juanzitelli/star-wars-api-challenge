import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { Planet as PlanetSchema } from "@prisma/client";
@InputType()
export class CreatePlanetInput {
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
