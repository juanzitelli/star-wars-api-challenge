import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreatePlanetInput } from "./create-planet.input";

@InputType()
export class UpdatePlanetInput extends PartialType(CreatePlanetInput) {
  @Field(() => Int)
  id: number;
}
