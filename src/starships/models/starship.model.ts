import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Starship as StarshipSchema } from "@prisma/client";
import { Character } from "./../../characters/models/character.model";
import { Planet } from "./../../planets/models/planet.model";

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

  @Field(() => Int, { nullable: true })
  currentPlanetId: StarshipSchema["currentPlanetId"];

  @Field(() => Planet, { nullable: true })
  currentPlanet: Planet;

  @Field(() => [Character], { nullable: true })
  passengers: Array<Character>;
}
