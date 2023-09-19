import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { Starship as StarshipSchema } from "@prisma/client";

@InputType()
export class CreateStarshipInput {
  @Field(() => String)
  name: StarshipSchema["name"];

  @Field(() => String)
  model: StarshipSchema["model"];

  @Field(() => Int)
  cargoCapacity: StarshipSchema["cargoCapacity"];

  @Field(() => Float)
  latitude: StarshipSchema["latitude"];

  @Field(() => Float)
  longitude: StarshipSchema["longitude"];

  @Field(() => Int)
  currentPlanetId: StarshipSchema["currentPlanetId"];

  @Field(() => Int)
  starshipId: StarshipSchema["starshipId"];
}
