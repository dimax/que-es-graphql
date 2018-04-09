'use strict';

const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const mySchema = require('./schemas');

const router = new koaRouter();

// koaBody is needed just for POST.
router.post('/graphql', koaBody(), graphqlKoa({ schema: mySchema }));
router.get('/graphql', graphqlKoa({ schema: mySchema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

module.exports = router;
