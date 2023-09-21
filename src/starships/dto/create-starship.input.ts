import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { Starship as StarshipSchema } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateStarshipInput {
  @Field(() => String)
  @IsNotEmpty()
  name: StarshipSchema["name"];

  @Field(() => String)
  @IsNotEmpty()
  model: StarshipSchema["model"];

  @Field(() => Int)
  @IsNotEmpty()
  cargoCapacity: StarshipSchema["cargoCapacity"];

  @Field(() => Float)
  @IsNotEmpty()
  latitude: StarshipSchema["latitude"];

  @Field(() => Float)
  @IsNotEmpty()
  longitude: StarshipSchema["longitude"];

  @Field(() => Int)
  @IsNotEmpty()
  currentPlanetId: StarshipSchema["currentPlanetId"];
}
