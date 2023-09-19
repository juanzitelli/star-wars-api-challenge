import { Field, InputType, Int } from "@nestjs/graphql";
import { Character as CharacterSchema } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class RelocateCharacterArgs {
  @Field(() => Int)
  @IsNotEmpty()
  planetId: CharacterSchema["currentLocationId"];

  @Field(() => Int)
  @IsNotEmpty()
  id: CharacterSchema["id"];
}
