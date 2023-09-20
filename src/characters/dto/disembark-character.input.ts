import { Field, InputType, Int } from "@nestjs/graphql";
import { Character as CharacterSchema } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DisembarkCharacterInput {
  @Field(() => Int)
  @IsNotEmpty()
  characterId: CharacterSchema["id"];
}
