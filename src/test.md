In Apollo Server, we write resolvers to fulfill the GraphQL queries, mutations, etc. Therefore, here are examples of GraphQL queries and mutations (request part) using this schema.

### Query:

Fetch a single character by ID:

    ```graphql
    query {
      character(id: 1) {
        id
        name
        sensitivityToTheForce
        species
        currentLocationId
      }
    }
    ```

Fetch all characters:

    ```graphql
    query {
      characters {
        id
        name
        sensitivityToTheForce
        species
        currentLocationId
      }
    }
    ```

### Mutation:

Create a new character:

    ```graphql
    mutation {
      createCharacter(createCharacterInput: {
        id: 1
        name: "Anakin Skywalker"
        sensitivityToTheForce: "High"
        species: "Human"
        currentLocationId: 100
      }) {
        id
        name
        sensitivityToTheForce
        species
        currentLocationId
      }
    }
    ```

Update a character:

    ```graphql
    mutation {
      updateCharacter(updateCharacterInput: {
        id: 1
        name: "Darth Vader"
        sensitivityToTheForce: "High"
        species: "Human"
        currentLocationId: 101
      }) {
        id
        name
        sensitivityToTheForce
        species
        currentLocationId
      }
    }
    ```

Remove a character:

    ```graphql
    mutation {
      removeCharacter(id: 1) {
        id
      }
    }
    ```

Please note for the server to resolve these requests we need corresponding resolver functions defined for each of these operations.
