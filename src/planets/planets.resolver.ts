import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreatePlanetInput } from "./dto/create-planet.input";
import { UpdatePlanetInput } from "./dto/update-planet.input";
import { Planet } from "./models/planet.model";
import { PlanetsService } from "./planets.service";

@Resolver(() => Planet)
export class PlanetsResolver {
  constructor(private readonly planetsService: PlanetsService) {}

  @Mutation(() => Planet)
  createPlanet(
    @Args("createPlanetInput") createPlanetInput: CreatePlanetInput,
  ) {
    return this.planetsService.create({ data: createPlanetInput });
  }

  @Query(() => [Planet], { name: "planets" })
  findAll() {
    return this.planetsService.findAll();
  }

  @Query(() => Planet, { name: "planet" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.planetsService.findOne({ where: { id } });
  }

  @Mutation(() => Planet)
  updatePlanet(
    @Args("updatePlanetInput") { id, ...updatePlanetInput }: UpdatePlanetInput,
  ) {
    return this.planetsService.update({
      data: updatePlanetInput,
      where: { id },
    });
  }

  @Mutation(() => Planet)
  removePlanet(@Args("id", { type: () => Int }) id: number) {
    return this.planetsService.remove({ where: { id } });
  }
}
