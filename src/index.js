'use strict';

const koa = require('koa');
const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const mySchema = require('./schemas');

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

// koaBody is needed just for POST.
router.post('/graphql', koaBody(), graphqlKoa({ schema: mySchema }));
router.get('/graphql', graphqlKoa({ schema: mySchema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);

console.log('GraphiQL server initiated at: http://localhost:3000/graphiql');