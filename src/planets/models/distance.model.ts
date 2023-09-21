import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Distance {
  @Field(() => Number)
  distanceInMeters: number;
}
