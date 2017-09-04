const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(morgan('common'));
app.use(compression());

module.exports = app;