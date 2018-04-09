<template>
  <div id="app">
    <h4 v-if="!loading">Alta de autor</h4>
    <div>
      <input
        v-model="user.name"
        type="text"
      >
      <input
        v-model="user.age"
        type="number"
      >
    </div>
    <button @click="createUser()">Submit</button>
    <h4 v-if="loading">Loading...</h4>
    <h4 v-if="!loading">Listado de autores</h4>
    <ul>
      <li
        v-for="user in users"
        :key="user.id"
      >{{user.name}}
    </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag';

const USERS = gql`
query AllUsersQuery {
  users {
    id
    name
  }
}
`

const CREATE_USER = gql`
  mutation CreateUserMutation($name: String!, $age: Int!) {
    createUser(
      name: $name,
      age: $age,
    ) {
      id
    }
  }
`

export default {
  data() {
    return {
      users: [],
      user: {
        name: '',
        age: 0,
      },
      loading: 0,
    };
  },
  apollo: {
    users: {
      query: USERS,
    },
  },
  methods: {
    createUser() {
      const { user: { name, age } } = this.$data;

      this.$apollo.mutate({
        mutation: CREATE_USER,
        variables: {
          name,
          age,
        },
      }).then(({ data: { createUser: { id }}}) => {
        const user = {
          id,
          name,
          age,
        };

        this.users = [...this.users, user];
        this.user = {
          name: '',
          age: 0,
        };
      });
    },
  },
};
</script>
