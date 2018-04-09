'use strict';

const cors = require('@koa/cors');

const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true,
};

module.exports = cors(corsOptions);
