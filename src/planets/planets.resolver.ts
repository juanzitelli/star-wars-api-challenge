import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PlanetsService } from './planets.service';
import { Planet } from './entities/planet.entity';
import { CreatePlanetInput } from './dto/create-planet.input';
import { UpdatePlanetInput } from './dto/update-planet.input';

@Resolver(() => Planet)
export class PlanetsResolver {
  constructor(private readonly planetsService: PlanetsService) {}

  @Mutation(() => Planet)
  createPlanet(@Args('createPlanetInput') createPlanetInput: CreatePlanetInput) {
    return this.planetsService.create(createPlanetInput);
  }

  @Query(() => [Planet], { name: 'planets' })
  findAll() {
    return this.planetsService.findAll();
  }

  @Query(() => Planet, { name: 'planet' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.planetsService.findOne(id);
  }

  @Mutation(() => Planet)
  updatePlanet(@Args('updatePlanetInput') updatePlanetInput: UpdatePlanetInput) {
    return this.planetsService.update(updatePlanetInput.id, updatePlanetInput);
  }

  @Mutation(() => Planet)
  removePlanet(@Args('id', { type: () => Int }) id: number) {
    return this.planetsService.remove(id);
  }
}
