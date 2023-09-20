import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";

@Injectable()
export class PlanetsService {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.PlanetCreateInput }) {
    return await this.prisma.planet.create(params);
  }

  async findAll() {
    return await this.prisma.planet.findMany();
  }

  async findOne(params: { where: Prisma.PlanetWhereUniqueInput }) {
    return await this.prisma.planet.findUnique(params);
  }

  async update(params: {
    data: Prisma.PlanetUpdateInput;
    where: Prisma.PlanetWhereUniqueInput;
  }) {
    return await this.prisma.planet.update(params);
  }

  async remove(params: { where: Prisma.PlanetWhereUniqueInput }) {
    return await this.prisma.planet.delete(params);
  }

  async calculateDistanceToStarship(params: {
    planetId: number;
    starshipId: number;
  }) {
    const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
    /*
      This function calculates the shortest distance between two points 
      on the surface of a sphere using the Haversine formula.
      It's particularly used for geographic distance calculations on Earth. 

      Futher information can be found here: https://en.wikipedia.org/wiki/Haversine_formula
    */
    const getDistanceInMeters = (
      planetLatitude: number,
      planetLongitude: number,
      starshipLatitude: number,
      starshipLongitude: number,
    ): number => {
      // The average radius of the Earth is 6371 kilometers.
      const earthRadius = 6371e3; // Earth radius in meters

      // Difference in coordinates converted to radians
      const deltaLatitude = toRadians(starshipLatitude - planetLatitude);
      const deltaLongitude = toRadians(starshipLongitude - planetLongitude);

      // Haversine formula component
      const a =
        Math.pow(Math.sin(deltaLatitude / 2), 2) +
        Math.cos(toRadians(planetLatitude)) *
          Math.cos(toRadians(starshipLatitude)) *
          Math.pow(Math.sin(deltaLongitude / 2), 2);

      // Another part of the Haversine formula
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // The shortest distance across Earth's surface between two points, in meters
      return earthRadius * c;
    };

    const planet = await this.prisma.planet.findUnique({
      where: { id: params.planetId },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    const starship = await this.prisma.starship.findUnique({
      where: { id: params.starshipId },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    const distance = getDistanceInMeters(
      planet.latitude,
      planet.longitude,
      starship.latitude,
      starship.longitude,
    );

    return { distance };
  }
}
