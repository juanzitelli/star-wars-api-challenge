import { Injectable } from '@nestjs/common';
import { CreatePlanetInput } from './dto/create-planet.input';
import { UpdatePlanetInput } from './dto/update-planet.input';

@Injectable()
export class PlanetsService {
  create(createPlanetInput: CreatePlanetInput) {
    return 'This action adds a new planet';
  }

  findAll() {
    return `This action returns all planets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planet`;
  }

  update(id: number, updatePlanetInput: UpdatePlanetInput) {
    return `This action updates a #${id} planet`;
  }

  remove(id: number) {
    return `This action removes a #${id} planet`;
  }
}
