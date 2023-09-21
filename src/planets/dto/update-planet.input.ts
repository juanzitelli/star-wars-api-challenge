import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { Planet as PlanetSchema } from "@prisma/client";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreatePlanetInput } from "./create-planet.input";

@InputType()
export class UpdatePlanetInput extends PartialType(CreatePlanetInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: PlanetSchema["id"];
}
