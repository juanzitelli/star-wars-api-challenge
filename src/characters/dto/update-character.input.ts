import { Field, InputType, PartialType } from "@nestjs/graphql";
import { Character as CharacterSchema } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
import { CreateCharacterInput } from "./create-character.input";

@InputType()
export class UpdateCharacterInput extends PartialType(CreateCharacterInput) {
  @Field(() => Number)
  @IsNotEmpty()
  id: CharacterSchema["id"];

  @Field(() => String)
  name: CharacterSchema["name"];

  @Field(() => String)
  species: CharacterSchema["species"];

  @Field(() => String)
  sensitivityToTheForce: CharacterSchema["sensitivityToTheForce"];

  @Field(() => Number)
  currentLocationId: CharacterSchema["currentLocationId"];
}
