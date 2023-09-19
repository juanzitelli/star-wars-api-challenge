import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Starship {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;
}
