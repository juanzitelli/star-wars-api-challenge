import { Field, InputType, Int } from "@nestjs/graphql";
import {
  Character as CharacterSchema,
  Starship as StarshipSchema,
} from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class EmbarkCharacterInput {
  @Field(() => Int)
  @IsNotEmpty()
  starshipId: StarshipSchema["id"];

  @Field(() => Int)
  @IsNotEmpty()
  characterId: CharacterSchema["id"];
}
