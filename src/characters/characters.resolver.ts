import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ParseIntPipe,
} from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlanetsService } from "./../planets/planets.service";
import { StarshipsService } from "./../starships/starships.service";
import { CharactersService } from "./characters.service";
import { CreateCharacterInput } from "./dto/create-character.input";
import { DisembarkCharacterInput } from "./dto/disembark-character.input";
import { EmbarkCharacterInput } from "./dto/embark-character.input";
import { RelocateCharacterInput } from "./dto/relocate-character.input";
import { UpdateCharacterInput } from "./dto/update-character.input";
import { Character } from "./models/character.model";

@Resolver(() => Character)
export class CharactersResolver {
  constructor(
    private readonly charactersService: CharactersService,
    private readonly planetsService: PlanetsService,
    private readonly starshipsService: StarshipsService,
  ) {}

  @Mutation(() => Character)
  async createCharacter(
    @Args("createCharacterInput")
    createCharacterInput: CreateCharacterInput,
  ) {
    const planet = await this.planetsService.findOne({
      where: { id: createCharacterInput.currentLocationId },
    });

    if (!planet) {
      throw new BadRequestException(
        `Couldn't find a planet with the given currentLocationId`,
      );
    }

    return await this.charactersService.create({
      data: createCharacterInput,
    });
  }

  @Query(() => [Character], { name: "characters" })
  async findAll() {
    return await this.charactersService.findAll({
      include: {
        starship: true,
      },
    });
  }

  @Query(() => Character, { name: "character" })
  async findOne(@Args("id", { type: () => Int }, ParseIntPipe) id: number) {
    const character = await this.charactersService.findOne({ where: { id } });

    if (!character) {
      throw new NotFoundException(
        `Couldn't find a character with the given parameters`,
      );
    }

    return character;
  }

  @Mutation(() => Character)
  async updateCharacter(
    @Args("updateCharacterInput")
    updateCharacterInput: UpdateCharacterInput,
  ) {
    return await this.charactersService.update({
      data: updateCharacterInput,
      where: { id: updateCharacterInput.id },
    });
  }

  @Mutation(() => Character)
  async removeCharacter(
    @Args("id", { type: () => Int }, ParseIntPipe) id: number,
  ) {
    const character = await this.charactersService.findOne({ where: { id } });

    if (!character) {
      throw new NotFoundException(
        `Couldn't find a character with the given parameters`,
      );
    }
    return await this.charactersService.remove({ where: { id } });
  }

  @Mutation(() => Character)
  async relocateCharacter(
    @Args("relocateCharacterInput")
    relocateCharacterInput: RelocateCharacterInput,
  ) {
    const planet = await this.planetsService.findOne({
      where: { id: relocateCharacterInput.planetId },
    });

    if (!planet) {
      throw new BadRequestException(
        `Couldn't find a planet with the given planetId`,
      );
    }

    const character = await this.charactersService.findOne({
      where: { id: relocateCharacterInput.characterId },
    });

    if (!character) {
      throw new NotFoundException(
        `Couldn't find a character with the given characterId`,
      );
    }

    return await this.charactersService.relocate({
      planetId: relocateCharacterInput.planetId,
      where: { id: relocateCharacterInput.characterId },
    });
  }

  @Mutation(() => Character)
  async embarkCharacter(
    @Args("embarkCharacterInput")
    { characterId, starshipId }: EmbarkCharacterInput,
  ) {
    const character = await this.charactersService.findOne({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(
        `Couldn't find a character with the given characterId`,
      );
    }
    const starship = await this.starshipsService.findOne({
      where: { id: starshipId },
    });

    if (!starship) {
      throw new NotFoundException(
        `Couldn't find a starship with the given starshipId`,
      );
    }

    const starshipPassengers = await this.charactersService.findAll({
      where: {
        starshipId: starshipId,
      },
    });

    if (starshipPassengers.length < starship.cargoCapacity) {
      // Note: I know I should "disembark" a character if it's already boarded onto a ship
      // but since overriding the currentStarship works, I'll leave it like that.
      return await this.charactersService.embark({
        characterId,
        starshipId,
      });
    }

    // TODO: Figure out right error for this
    throw new InternalServerErrorException(
      `Can't embark a new character to ${starship.name} since it's cargo capacity of ${starship.cargoCapacity} is complete`,
    );
  }

  @Mutation(() => Character)
  async disembarkCharacter(
    @Args("disembarkCharacterInput")
    { characterId }: DisembarkCharacterInput,
  ) {
    const character = await this.charactersService.findOne({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(
        `Couldn't find a character with the given characterId`,
      );
    }

    if (!character.starshipId) {
      throw new NotFoundException(
        `Character hasn't been boarded onto a starship`,
      );
    }

    return await this.charactersService.disembark({
      characterId,
      starshipId: character.starshipId,
    });
  }
}
