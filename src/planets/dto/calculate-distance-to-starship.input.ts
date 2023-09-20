import { Field, InputType, Int } from "@nestjs/graphql";
import {
  Planet as PlanetSchema,
  Starship as StarshipSchema,
} from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CalculateDistanceToStarshipInput {
  @Field(() => Int)
  @IsNotEmpty()
  starshipId: StarshipSchema["id"];

  @Field(() => Int)
  @IsNotEmpty()
  planetId: PlanetSchema["id"];
}
