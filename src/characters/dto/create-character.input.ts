import { Field, InputType } from "@nestjs/graphql";
import { Character as CharacterSchema } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCharacterInput {
  @Field(() => Number)
  @IsNotEmpty()
  id: CharacterSchema["id"];

  @Field(() => String)
  @IsNotEmpty()
  name: CharacterSchema["name"];

  @Field(() => String)
  @IsNotEmpty()
  species: CharacterSchema["species"];

  @Field(() => String)
  @IsNotEmpty()
  sensitivityToTheForce: CharacterSchema["sensitivityToTheForce"];

  @Field(() => Number)
  @IsNotEmpty()
  currentLocationId: CharacterSchema["currentLocationId"];
}
