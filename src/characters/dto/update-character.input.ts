import { Field, InputType, PartialType } from "@nestjs/graphql";
import { Character as CharacterSchema } from "@prisma/client";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateCharacterInput } from "./create-character.input";

@InputType()
export class UpdateCharacterInput extends PartialType(CreateCharacterInput) {
  @Field(() => Number)
  @IsInt()
  @IsNotEmpty()
  id: CharacterSchema["id"];
}
