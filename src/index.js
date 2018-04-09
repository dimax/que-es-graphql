'use strict';

const koa = require('koa');

const cors = require('./cors');
const router = require('./router');

const app = new koa();
const PORT = 3000;

app.use(cors);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);

console.log('GraphiQL server initiated at: http://localhost:3000/graphiql');
