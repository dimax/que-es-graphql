const { makeExecutableSchema } = require('graphql-tools');

const datosDePrueba = {
  persons: [
    {
      id: 1,
      name: 'Pepe',
      age: 5,
      followers: [],
    }
  ],
  posts: [
    {
      id: 1,
      title: 'Soy la rana',
      author: 1,
    }
  ],
};

const typeDefs = /* GraphQL */`

type Query {
  # Recupera todas las personas o,
  # Si se pasa el parámetro \`last\`, recupera las últimas \`last\` personas
  allPersons(last: Int): [Person!]
  allPosts(author: ID): [Post!]
}

type Mutation {
  # Agrega una nueva persona
  createPerson(name: String!, age: Int!): Person!
}

type Person {
  id: ID!
  name: String!
  age: Int!
  followers: [Person]!
}

type Post {
  id: ID!
  title: String!
  author: Person!
}
`

/*******************************************
 * Tipos de datos
 */

const Person = {
  id: (root) => root.id,
  name: (root) => root.name,
  age: (root) => root.age,
  followers: (root) => root.followers,
};
const Post = {
  id: (root) => root.id,
  title: (root) => root.title,
  author: (root) => datosDePrueba.persons.reduce((author, actual) => (
    author || actual.id === root.author && actual
  )),
};

/*******************************************
 * Consultas
 */

const Query = {
  // Este método se encarga de manejar las dos posibles
  // consultas de `allPersons`
  allPersons: (last) => (
    last
      ? datosDePrueba.persons.slice(
        datosDePrueba.persons.length - last,
        datosDePrueba.persons.length,
      )
      : datosDePrueba.persons
  ),
  allPosts: (id) => (
    !id ? datosDePrueba.posts
    : datosDePrueba.posts.filter(post => post.author === id)
  ),
};

/*******************************************
 * Mutaciones
 */

const Mutation = {
  createPerson: (_, { name, age }) => {
    const person = {
      id: datosDePrueba.persons.length + 1,
      name,
      age,
    };

    datosDePrueba.persons.push(person);

    return person;
  },
};

const resolvers = {
  Query,
  Mutation,

  Person,
  Post,
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
