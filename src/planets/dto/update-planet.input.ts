import { Field, Float, InputType, Int, PartialType } from "@nestjs/graphql";
import { Planet as PlanetSchema } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
import { CreatePlanetInput } from "./create-planet.input";

@InputType()
export class UpdatePlanetInput extends PartialType(CreatePlanetInput) {
  @Field(() => Int)
  @IsNotEmpty()
  id: PlanetSchema["id"];

  @Field(() => String)
  name: PlanetSchema["name"];

  @Field(() => Int)
  population: PlanetSchema["population"];

  @Field(() => String)
  climate: PlanetSchema["climate"];

  @Field(() => String)
  terrain: PlanetSchema["terrain"];

  @Field(() => Float)
  latitude: PlanetSchema["latitude"];

  @Field(() => Float)
  longitude: PlanetSchema["longitude"];
}
