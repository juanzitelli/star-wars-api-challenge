import { Field, InputType, Int } from "@nestjs/graphql";
import { Starship as StarshipSchema } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class SpawnRandomEnemyInput {
  @Field(() => Int)
  @IsNotEmpty()
  starshipId: StarshipSchema["id"];
}
