import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./../db/prisma.service";

@Injectable()
export class PlanetsService {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.PlanetCreateInput }) {
    return await this.prisma.planet.create(params);
  }

  async findAll(params: Prisma.PlanetFindManyArgs) {
    return await this.prisma.planet.findMany(params);
  }

  async findOne(params: {
    where: Prisma.PlanetWhereUniqueInput;
    select?: Prisma.PlanetSelect;
  }) {
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
    planet: {
      latitude: number;
      longitude: number;
    };
    starship: {
      latitude: number;
      longitude: number;
    };
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

    const distanceInMeters = getDistanceInMeters(
      params.planet.latitude,
      params.planet.longitude,
      params.starship.latitude,
      params.starship.longitude,
    );

    return { distanceInMeters };
  }
}
