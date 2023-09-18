import { CreatePlanetInput } from './create-planet.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePlanetInput extends PartialType(CreatePlanetInput) {
  @Field(() => Int)
  id: number;
}
