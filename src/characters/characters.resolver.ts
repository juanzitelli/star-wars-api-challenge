import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CharactersService } from "./characters.service";
import { CreateCharacterInput } from "./dto/create-character.input";
import { UpdateCharacterInput } from "./dto/update-character.input";
import { Character } from "./models/character.model";

@Resolver(() => Character)
export class CharactersResolver {
  constructor(private readonly charactersService: CharactersService) {}

  @Mutation(() => Character)
  createCharacter(
    @Args("createCharacterInput")
    createCharacterInput: CreateCharacterInput,
  ) {
    return this.charactersService.create({ data: createCharacterInput });
  }

  @Query(() => [Character], { name: "characters" })
  findAll() {
    return this.charactersService.findAll();
  }

  @Query(() => Character, { name: "character" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.charactersService.findOne({ where: { id } });
  }

  @Mutation(() => Character)
  updateCharacter(
    @Args("updateCharacterInput")
    updateCharacterInput: UpdateCharacterInput,
    id: number,
  ) {
    return this.charactersService.update({
      data: updateCharacterInput,
      where: { id },
    });
  }

  @Mutation(() => Character)
  removeCharacter(@Args("id", { type: () => Int }) id: number) {
    return this.charactersService.remove({ where: { id } });
  }
}
