import {
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
} from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlanetsService } from "./../planets/planets.service";
import { CreateStarshipInput } from "./dto/create-starship.input";
import { UpdateStarshipInput } from "./dto/update-starship.input";
import { Starship } from "./models/starship.model";
import { StarshipsService } from "./starships.service";

@Resolver(() => Starship)
export class StarshipsResolver {
  constructor(
    private readonly starshipsService: StarshipsService,
    private readonly planetsService: PlanetsService,
  ) {}

  @Mutation(() => Starship)
  async createStarship(
    @Args("createStarshipInput") createStarshipInput: CreateStarshipInput,
  ) {
    const planet = await this.planetsService.findOne({
      where: {
        id: createStarshipInput.currentPlanetId,
      },
    });

    if (!planet) {
      throw new BadRequestException(
        `Couldn't find any planet with the given currentPlanetId`,
      );
    }

    return await this.starshipsService.create({ data: createStarshipInput });
  }

  @Query(() => [Starship], { name: "starships" })
  async findAll() {
    return await this.starshipsService.findAll({
      include: {
        currentPlanet: true,
      },
    });
  }

  @Query(() => Starship, { name: "starship" })
  async findOne(@Args("id", { type: () => Int }, ParseIntPipe) id: number) {
    const starship = await this.starshipsService.findOne({ where: { id } });

    if (!starship) {
      throw new NotFoundException(
        `Couldn't find a starship with the given parameters`,
      );
    }

    return starship;
  }

  @Mutation(() => Starship)
  async updateStarship(
    @Args("updateStarshipInput")
    { id, ...updateStarshipInput }: UpdateStarshipInput,
  ) {
    const planet = await this.planetsService.findOne({
      where: {
        id: updateStarshipInput.currentPlanetId,
      },
    });

    if (!planet) {
      throw new BadRequestException(
        `Couldn't find any planet with the given currentPlanetId`,
      );
    }

    const starship = await this.starshipsService.findOne({
      where: { id },
    });

    if (!starship) {
      throw new NotFoundException(
        `Couldn't find a starship with the given parameters`,
      );
    }

    return await this.starshipsService.update({
      data: updateStarshipInput,
      where: { id },
    });
  }

  @Mutation(() => Starship)
  async removeStarship(
    @Args("id", { type: () => Int }, ParseIntPipe) id: number,
  ) {
    const starship = await this.starshipsService.findOne({
      where: { id },
    });

    if (!starship) {
      throw new NotFoundException(
        `Couldn't find a starship with the given parameters`,
      );
    }

    return this.starshipsService.remove({ where: { id } });
  }
}
