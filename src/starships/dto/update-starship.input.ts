import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { Starship as StarshipSchema } from "@prisma/client";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateStarshipInput } from "./create-starship.input";

@InputType()
export class UpdateStarshipInput extends PartialType(CreateStarshipInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: StarshipSchema["id"];
}
