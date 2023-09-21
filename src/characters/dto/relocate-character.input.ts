import { Field, InputType, Int } from "@nestjs/graphql";
import { Character as CharacterSchema } from "@prisma/client";
import { IsInt, IsNotEmpty } from "class-validator";

@InputType()
export class RelocateCharacterInput {
  @Field(() => Int)
  @IsNotEmpty()
  planetId: CharacterSchema["currentLocationId"];

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  characterId: CharacterSchema["id"];
}
