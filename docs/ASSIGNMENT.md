# Assignment

## Finalis - Back End Developer

### Coding Challenge

## Star Wars Universe API Challenge

### Overview:

Your mission, should you choose to accept, is to develop a backend system that simulates the vast and intriguing Star Wars universe. The crux of this challenge revolves around understanding and utilizing object-oriented programming, design patterns, and ensuring your code exudes clarity and elegance.

### Specifications:

You have 7 days to complete the challenge, we are going to evaluate your implementation more than how far you go. On the last day send an email with a link to the repository. If you have any doubts or questions, do not hesitate to contact the TL at omar@finalis.com or HR team at recruiting@finalis.com

### Technologies:

- NestJS
- Typescript
- TDD

### Entities and Attributes:

**Planet:**

- Attributes: Name, Population, Climate, Terrain, Coordinates (latitude and longitude)

**Character:**

- Attributes: Name, Species, Sensitivity to the Force, Current Location (Reference to Planet)

**Starship:**

- Attributes: Name, Model, Cargo Capacity, Current Location (coordinates), Passengers (Reference to Characters), Enemies (Reference to other Starships)

### API Endpoints:

- Standard CRUD operations for Planet, Character, and Starship.
- Functionality to relocate a character from one planet to another.
- Boarding or disembarking a character from a starship.
- Traveling capability for a starship from its current location to a destination planet.
- Calculate the distance of a starship from a specified planet using a GPS-like algorithm.
- Recognize nearby enemy starships within a set range.
- Spawn random enemy starships in the universe.

> **Note:** Feel free to introduce any additional features you envision. We encourage you to unleash your creativity!

### Bonus Objectives:

- Introduction of caching solutions, such as Redis.
- Containerization of the application via Docker. (optional)

### Additional Considerations:

- A GraphQL interface, offering a flexible querying methodology.
- Include utilities for GraphQL, examples Apollo Server.

### How to Start:

- Create a new public github repository
- Add a readme file with an explanation of working functionalities and pending functionalities

If you complete the challenge with rest, implementing swagger if you use graphQL is not necessary. In both cases add in the readme file how to run and access to them.

Best of luck, and as they say in a galaxy far, far away... "May the Force be with you!".
