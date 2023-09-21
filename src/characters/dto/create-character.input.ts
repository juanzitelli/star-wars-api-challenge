import { Field, InputType } from "@nestjs/graphql";
import {
  Character as CharacterSchema,
  SensitivityToTheForce,
} from "@prisma/client";
import { IsIn, IsNotEmpty } from "class-validator";

@InputType()
export class CreateCharacterInput {
  @Field(() => String)
  @IsNotEmpty()
  name: CharacterSchema["name"];

  @Field(() => String)
  @IsNotEmpty()
  species: CharacterSchema["species"];

  @Field(() => String)
  @IsNotEmpty()
  @IsIn([
    SensitivityToTheForce.High,
    SensitivityToTheForce.Low,
    SensitivityToTheForce.Medium,
  ])
  sensitivityToTheForce: CharacterSchema["sensitivityToTheForce"];

  @Field(() => Number)
  @IsNotEmpty()
  currentLocationId: CharacterSchema["currentLocationId"];
}
