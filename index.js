'use strict';

const path = require('path');

const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const apiRouter = require('./api.js')(express.Router());

app.set('case sensitive routing', false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/api', apiRouter);

app.get('/', (request, response) => {
  response.status(200).redirect('/assets').send('root path');
});

app.get('*', (request, response) => {
  response.status(404).send('Route not found');
});

const listener = app.listen(process.env.PORT, process.env.IP, () => {
  const {address, port} = listener.address();
  
  console.log(`Server up and running on https://${address}:${port}`);
});