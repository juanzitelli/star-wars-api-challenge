import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateStarshipInput } from "./dto/create-starship.input";
import { UpdateStarshipInput } from "./dto/update-starship.input";
import { Starship } from "./models/starship.model";
import { StarshipsService } from "./starships.service";

@Resolver(() => Starship)
export class StarshipsResolver {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Mutation(() => Starship)
  createStarship(
    @Args("createStarshipInput") createStarshipInput: CreateStarshipInput,
  ) {
    return this.starshipsService.create({ data: createStarshipInput });
  }

  @Query(() => [Starship], { name: "starships" })
  findAll() {
    return this.starshipsService.findAll();
  }

  @Query(() => Starship, { name: "starship" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.starshipsService.findOne({ where: { id } });
  }

  @Mutation(() => Starship)
  updateStarship(
    @Args("updateStarshipInput") updateStarshipInput: UpdateStarshipInput,
  ) {
    return this.starshipsService.update({
      where: { id: updateStarshipInput.id },
      data: updateStarshipInput,
    });
  }

  @Mutation(() => Starship)
  removeStarship(@Args("id", { type: () => Int }) id: number) {
    return this.starshipsService.remove({ where: { id } });
  }
}
