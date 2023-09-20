import { Field, ObjectType } from "@nestjs/graphql";
import { Character as CharacterSchema } from "@prisma/client";
import { Starship } from "./../../starships/models/starship.model";

@ObjectType()
export class Character {
  @Field(() => Number)
  id: CharacterSchema["id"];

  @Field(() => String)
  name: CharacterSchema["name"];

  @Field(() => String)
  species: CharacterSchema["species"];

  @Field(() => String)
  sensitivityToTheForce: CharacterSchema["sensitivityToTheForce"];

  @Field(() => Number)
  currentLocationId: CharacterSchema["currentLocationId"];

  @Field(() => Starship, { nullable: true })
  starship: Starship;

  @Field(() => Number, { nullable: true })
  starshipId: CharacterSchema["starshipId"];
}
