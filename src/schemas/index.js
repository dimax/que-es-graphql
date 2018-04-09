const { makeExecutableSchema } = require('graphql-tools');

const datosDePrueba = {
  users: [
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
      user_id: 1,
    }
  ],
};

const typeDefs = /* GraphQL */`

type Query {
  users(id: ID): [User]!
  # Recupera los seguidores de un usuario o,
  # si se pasa el parámetro \`last\`, recupera los últimos \`last\` seguidores
  followers(user: ID!, last: Int): [User]!
  posts(user: ID): [Post]!
}

type Mutation {
  # Agrega un nuevo Usuario
  createUser(name: String!, age: Int!): User!
}

type User {
  id: ID!
  name: String!
  age: Int!
  posts: [Post]!
  followers: [User]!
}

type Post {
  id: ID!
  title: String!
  user: User!
}
`

/*******************************************
 * Tipos de datos
 */

const User = {
  id: (root) => root.id,
  name: (root) => root.name,
  age: (root) => root.age,
  posts: (root) => datosDePrueba.posts.filter(post => post.id === root.id),
  followers: (root) => root.followers,
};
const Post = {
  id: (root) => root.id,
  title: (root) => root.title,
  user: (root) => datosDePrueba.users.reduce((user, actual) => (
    user || actual.id === root.user_id && actual
  )),
};

/*******************************************
 * Consultas
 */

const Query = {
  // Este método se encarga de manejar las dos posibles
  // consultas de `users`
  users: (last) => (
    !last
      ? datosDePrueba.users
      : datosDePrueba.users.slice(
        datosDePrueba.users.length - last,
        datosDePrueba.users.length,
      )
  ),
  followers: (id, last) => (
    datosDePrueba.users
      .filter(user => user.id === id)
      .slice(
        !last ? 0 : datosDePrueba.users.length - last,
        datosDePrueba.users.length
      )
  ),
  posts: (id) => (
    !id
      ? datosDePrueba.posts
      : datosDePrueba.posts.filter(post => post.user_id === id)
  ),
};

/*******************************************
 * Mutaciones
 */

const Mutation = {
  createUser: (_, { name, age }) => {
    const user = {
      id: datosDePrueba.users.length + 1,
      name,
      age,
      followers: [],
    };

    datosDePrueba.users.push(user);

    return user;
  },
};

const resolvers = {
  Query,
  Mutation,

  User,
  Post,
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
