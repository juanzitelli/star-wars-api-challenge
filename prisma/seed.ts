import { PrismaClient, SensitivityToTheForce } from "@prisma/client";

const prisma = new PrismaClient();

function randomLatitude() {
  return Math.random() * 180 - 90;
}

function randomLongitude() {
  return Math.random() * 360 - 180;
}

async function main() {
  const venus = await prisma.planet.create({
    data: {
      name: "Venus",
      population: 0,
      climate: "Hot",
      terrain: "Rocky",
      latitude: randomLatitude(),
      longitude: randomLongitude(),
    },
  });

  const jupiter = await prisma.planet.create({
    data: {
      name: "Jupiter",
      population: 0,
      climate: "Gas Giant",
      terrain: "Gas",
      latitude: randomLatitude(),
      longitude: randomLongitude(),
    },
  });

  const xWing = await prisma.starship.create({
    data: {
      name: "X-Wing",
      model: "T-65B",
      cargoCapacity: 110,
      latitude: randomLatitude(),
      longitude: randomLongitude(),
      currentPlanetId: venus.id,
    },
  });

  const yWing = await prisma.starship.create({
    data: {
      name: "Y-Wing",
      model: "BTL-B Y-wing starfighter",
      cargoCapacity: 110,
      latitude: randomLatitude(),
      longitude: randomLongitude(),
      currentPlanetId: jupiter.id,
    },
  });

  await prisma.character.create({
    data: {
      name: "Leia Organa",
      species: "Human",
      sensitivityToTheForce: SensitivityToTheForce.High,
      currentLocationId: venus.id,
      starships: {
        connect: { id: xWing.id },
      },
    },
  });

  await prisma.character.create({
    data: {
      name: "Han Solo",
      species: "Human",
      sensitivityToTheForce: SensitivityToTheForce.Low,
      currentLocationId: jupiter.id,
      starships: {
        connect: { id: yWing.id },
      },
    },
  });
  const earth = await prisma.planet.create({
    data: {
      name: "Earth",
      population: 10000,
      climate: "Varied",
      terrain: "Varied",
      latitude: randomLatitude(),
      longitude: randomLongitude(),
    },
  });

  const mars = await prisma.planet.create({
    data: {
      name: "Mars",
      population: 0,
      climate: "Arid",
      terrain: "Rocky",
      latitude: randomLatitude(),
      longitude: randomLongitude(),
    },
  });

  const millenniumFalcon = await prisma.starship.create({
    data: {
      name: "Millennium Falcon",
      model: "YT-1300f",
      cargoCapacity: 100000,
      latitude: randomLatitude(),
      longitude: randomLongitude(),
      currentPlanetId: earth.id,
    },
  });

  const starDestroyer = await prisma.starship.create({
    data: {
      name: "Star Destroyer",
      model: "Imperial I-class Star Destroyer",
      cargoCapacity: 500000,
      latitude: randomLatitude(),
      longitude: randomLongitude(),
      currentPlanetId: mars.id,
    },
  });

  await prisma.character.create({
    data: {
      name: "Luke Skywalker",
      species: "Human",
      sensitivityToTheForce: SensitivityToTheForce.High,
      currentLocationId: earth.id,
      starships: {
        connect: { id: millenniumFalcon.id },
      },
    },
  });

  await prisma.character.create({
    data: {
      name: "Darth Vader",
      species: "Human",
      sensitivityToTheForce: SensitivityToTheForce.High,
      currentLocationId: mars.id,
      starships: {
        connect: { id: starDestroyer.id },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
