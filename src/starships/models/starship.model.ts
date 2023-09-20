import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Starship as StarshipSchema } from "@prisma/client";

@ObjectType()
export class Starship {
  @Field(() => Int)
  id: StarshipSchema["id"];

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
}
