import { NotFoundException, ParseIntPipe } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StarshipsService } from "./../starships/starships.service";
import { CalculateDistanceToStarshipInput } from "./dto/calculate-distance-to-starship.input";
import { CreatePlanetInput } from "./dto/create-planet.input";
import { UpdatePlanetInput } from "./dto/update-planet.input";
import { Distance } from "./models/distance.model";
import { Planet } from "./models/planet.model";
import { PlanetsService } from "./planets.service";

@Resolver(() => Planet)
export class PlanetsResolver {
  constructor(
    private readonly planetsService: PlanetsService,
    private readonly starshipService: StarshipsService,
  ) {}

  @Mutation(() => Planet)
  async createPlanet(
    @Args("createPlanetInput") createPlanetInput: CreatePlanetInput,
  ) {
    return await this.planetsService.create({ data: createPlanetInput });
  }

  @Query(() => [Planet], { name: "planets" })
  async findAll() {
    return await this.planetsService.findAll({
      include: { characters: true, starships: true },
    });
  }

  @Query(() => Planet, { name: "planet" })
  async findOne(@Args("id", { type: () => Int }, ParseIntPipe) id: number) {
    const planet = await this.planetsService.findOne({ where: { id } });

    if (!planet)
      throw new NotFoundException(`Couldn't find a planet with the given id`);

    return planet;
  }

  @Query(() => Distance, { name: "calculateDistanceToStarship" })
  async calculateDistanceToStarship(
    @Args("calculateDistanceToStarshipInput")
    calculateDistanceToStarshipInput: CalculateDistanceToStarshipInput,
  ) {
    const planet = await this.planetsService.findOne({
      where: { id: calculateDistanceToStarshipInput.planetId },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    const starship = await this.starshipService.findOne({
      where: { id: calculateDistanceToStarshipInput.starshipId },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    if (!planet) {
      throw new NotFoundException(
        `Couldn't find a planet with the given parameters`,
      );
    }

    if (!starship) {
      throw new NotFoundException(
        `Couldn't find a starship with the given parameters`,
      );
    }

    return await this.planetsService.calculateDistanceToStarship({
      planet,
      starship,
    });
  }

  @Mutation(() => Planet)
  async updatePlanet(
    @Args("updatePlanetInput") { id, ...updatePlanetInput }: UpdatePlanetInput,
  ) {
    const planet = await this.planetsService.findOne({
      where: {
        id,
      },
    });

    if (!planet) {
      throw new NotFoundException(
        `Couldn't find a planet with the given parameters`,
      );
    }

    return await this.planetsService.update({
      data: updatePlanetInput,
      where: { id },
    });
  }

  @Mutation(() => Planet)
  async removePlanet(
    @Args("id", { type: () => Int }, ParseIntPipe) id: number,
  ) {
    const planet = await this.planetsService.findOne({
      where: { id },
    });

    if (!planet) {
      throw new NotFoundException(
        `Couldn't find a planet with the given parameters`,
      );
    }
    return this.planetsService.remove({ where: { id } });
  }
}
