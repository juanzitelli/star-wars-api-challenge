<p align="center">
  🌑
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  🚀
</p>

# Summary

For the challenge that was proposed to me about making an API related to Star Wars, I used the proposed technologies such as TypeScript, Nest.js and TDD. To run the application you need two things: a PostgreSQL database running locally and then this Nest application. The steps to build the project are detailed below.

## Setup

### 0. Clone the repository down to your machine

Run `git clone git@github.com:juanzitelli/star-wars-api-challenge.git` to clone the repository using SSH.

### 0.5 Recommended package manager and Node.js

Before starting, make sure you have Node.js installed on your machine by running `node -v` on your terminal. If it's not installed I suggest you use a very cool Node version manager called `fnm` [https://github.com/Schniz/fnm](https://github.com/Schniz/fnm) and follow the instructions to get the node version specified in `/.nvmrc` installed and available on your machine.

Secondly, I suggest you use `pnpm` as the package manager to interact with the project. After you have node installed you can run `npm install -g pnpm` to install it. Whatever other package manager you prefer is fine as well.

### 1. Environment

There's a .env.sample file located at `/.env.sample` that you can use as reference for creating your own `.env` file containing the three required values:

```text
PORT=3000 # The port the application will use to run
DATABASE_URL="postgresql://postgres:abc123@localhost:5432/postgres?schema=public" # REQUIRED: This is the connection string Prisma will use to connect to the PostgreSQL database.
SWAPI_URL="https://swapi.dev/api" # External API required for spawning random enemies
```

### 2. PostgreSQL database

This step requires you to setup a local `PostgreSQL` database. There's many different approaches to get this done but the easiest one is definitely using Docker. To achieve this do the following:

1. If you haven't got it installed on your machine already, download and install `Docker` from their official website: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
2. Follow the instructions the website provides and make sure it's installed and running on your device.
3. If you installed it correctly, you should be able to run the following command to setup a `PostgreSQL` database locally:
   1. `docker run --name postgres-db -e POSTGRES_PASSWORD=abc123 -p 5432:5432 -d postgres`.
      1. `postgres-db` will be the name of the Docker container that holds the database.
      2. `abc123` will be the password that you then need to pass into the `DATABASE_URL` environment variable.
      3. `5432` will be the port from which you will connect to the db engine.
4. You then should be able to see the container running either using Docker Desktop (available to you after docker is installed) or the CLI tools (`docker ps -a`)

### 3. Install dependencies

Run the following command to install all the required dependencies for the project using `pnpm`

```bash
$ pnpm install
```

### 4. Pushing the schema to the recently created postgres-db database

In your terminal, cd into the project folder and run `pnpm prisma:push` to push the Prisma schema to the recently created `PostgreSQL` database.

### 5. Seeding the database

In your terminal, run `pnpm prisma:seed` to push the `Prisma` schema to the recently created database to insert some test data to play around with the API.

### 6. Run tests

I suggest you run tests to make sure the project's working fine using the following command

```bash
$ pnpm test
# or to run them in watch mode
$ pnpm test -- --watch
```

### 7. Run the project

You can either run it in "production" or "dev" mode. Here are the commands for each mode.

```bash
# Production mode
$ pnpm build && pnpm start

# Dev mode
$ pnpm dev
```

### 8. Navigate to the GraphQL playground

If you set everything up correctly you should be able to navigate to `http://localhost:3000/graphql` (make sure the port matches the port you specified in the PORT environment variable) and see a GraphQL playground to mess around with the API.

### 9. Copy demo queries into the playground

I've provided with several queries for you to copy and paste into the playground in `/src/queries.gql`.

# Functionality

> A checked item equals to a finished feature 📔

- [x] Standard CRUD operations for Planet, Character, and Starship.

Use the following queries/mutations to CRUD these three entities.

```graphql
  # Mutations
  createCharacter(createCharacterInput: CreateCharacterInput!): Character!
  createPlanet(createPlanetInput: CreatePlanetInput!): Planet!
  createStarship(createStarshipInput: CreateStarshipInput!): Starship!
  removeCharacter(id: Int!): Character!
  removePlanet(id: Int!): Planet!
  removeStarship(id: Int!): Starship!
  updateCharacter(updateCharacterInput: UpdateCharacterInput!): Character!
  updatePlanet(updatePlanetInput: UpdatePlanetInput!): Planet!
  updateStarship(updateStarshipInput: UpdateStarshipInput!): Starship!

  # Queries
  character(id: Int!): Character!
  characters: [Character!]!
  planet(id: Int!): Planet!
  planets: [Planet!]!
  starship(id: Int!): Starship!
  starships: [Starship!]!
```

- [x] Functionality to relocate a character from one planet to another.

Use the following mutation to relocate a character.

```graphql
  relocateCharacter(relocateCharacterInput: RelocateCharacterInput!): Character!
```

- [x] Boarding or disembarking a character from a starship.

Use the following mutations to board/disembark a character.

```graphql
  disembarkCharacter(
    disembarkCharacterInput: DisembarkCharacterInput!
  ): Character!
  embarkCharacter(embarkCharacterInput: EmbarkCharacterInput!): Character!
```

- [ ] Traveling capability for a starship from its current location to a destination planet.

I didn't make it to developing this feature mostly because of time, but I'd picture it like the following: A Starship has a given set of terrains where it can land succesfully on and a Planet has a defined terrain. If the Starship contains the terrain the Planet has on it's surface then it can land.

- [x] Calculate the distance of a starship from a specified planet using a GPS-like algorithm.

Use the following mutation to calculate the distance of a starship from a specific planet.

```graphql
  calculateDistanceToStarship(
    calculateDistanceToStarshipInput: CalculateDistanceToStarshipInput!
  ): Distance!
```

- [ ] Recognize nearby enemy starships within a set range.

Again, I didn't make it to this feature because of time but I'd take in a given distance in meters and use the current "distance calculation" feature and given a starshipId fetch the current starship then loop over all starships and check whether their "distance" is shorter than the distance in meters passed into the query.

- [x] Spawn random enemy starships in the universe.

Use the following mutation to spawn an enemy starship into the universe.

```graphql
  spawnRandomEnemy(spawnRandomEnemyInput: SpawnRandomEnemyInput!): Starship!
```

## Input/Types reference

```graphql
input CalculateDistanceToStarshipInput {
  planetId: Int!
  starshipId: Int!
}

type Character {
  currentLocation: Planet
  currentLocationId: Float!
  enemies: [Character!]
  id: Float!
  name: String!
  sensitivityToTheForce: String!
  species: String!
  starship: Starship
  starshipId: Float
}

input CreateCharacterInput {
  currentLocationId: Float!
  name: String!
  sensitivityToTheForce: String!
  species: String!
}

input CreatePlanetInput {
  climate: String!
  latitude: Float!
  longitude: Float!
  name: String!
  population: Int!
  terrain: String!
}

input CreateStarshipInput {
  cargoCapacity: Int!
  currentPlanetId: Int!
  latitude: Float!
  longitude: Float!
  model: String!
  name: String!
}

input DisembarkCharacterInput {
  characterId: Int!
}

type Distance {
  distanceInMeters: Float!
}

input EmbarkCharacterInput {
  characterId: Int!
  starshipId: Int!
}

type Planet {
  characters: [Character!]
  climate: String!
  id: String!
  latitude: Float!
  longitude: Float!
  name: String!
  population: Int!
  starships: [Starship!]
  terrain: String!
}

input RelocateCharacterInput {
  characterId: Int!
  planetId: Int!
}

input SpawnRandomEnemyInput {
  starshipId: Int!
}

type Starship {
  cargoCapacity: Int!
  currentPlanet: Planet
  currentPlanetId: Int
  enemies: [Starship!]
  id: Int!
  latitude: Float!
  longitude: Float!
  model: String!
  name: String!
  passengers: [Character!]
}

input UpdateCharacterInput {
  currentLocationId: Float
  id: Float!
  name: String
  sensitivityToTheForce: String
  species: String
}

input UpdatePlanetInput {
  climate: String
  id: Int!
  latitude: Float
  longitude: Float
  name: String
  population: Int
  terrain: String
}

input UpdateStarshipInput {
  cargoCapacity: Int
  currentPlanetId: Int
  id: Int!
  latitude: Float
  longitude: Float
  model: String
  name: String
}
```
