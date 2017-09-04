'use strict';

const path = require('path');

const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

app.set('case sensitive routing', false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (request, response) => {
  response.status(200).send('root path');
});

app.get('*', (request, response) => {
  response.status(404).send('Route not found');
});

const listener = app.listen(process.env.PORT, process.env.IP, () => {
  const {address, port} = listener.address();
  
  console.log(`Server up and running on https://${address}:${port}`);
});

fetch('https://maps.googleapis.com/maps/api/directions/json?origin=46.773777343799175,23.588075637817383&destination=46.77562532713712,23.590580821037292')
	.then(res => res.json())
	.then(data => {
	  console.log(data.routes[0].legs[0].steps.map(step => {
	    return {
	      start: step.start_location,
	      end: step.end_location,
	      distance: step.distance.value,
	      instructions: step.html_instructions
	    }
	  }))
	})
	.catch(error => console.log(error));

function startEnd(start, end) {
  return {start, end};
}
	
const centerSquarePoints = [
  startEnd({lat: 46.773777343799175, lng: 23.588075637817383} ,{lat: 46.77562532713712, lng: 23.590580821037292}),
  startEnd({lat: 46.77562532713712, lng: 23.590580821037292}, {lat: 46.774710528202135, lng: 23.591803908348083}),
  startEnd({lat: 46.77429169940724, lng: 23.592286705970764}, {lat: 46.773696516042655, lng: 23.588220477104187}),
  startEnd({lat: 46.774192502636616, lng: 23.59211504459381}, {lat: 46.77467378896449, lng: 23.59185755252838}),
  startEnd({lat: 46.77411534946648, lng: 23.59037697315216}, {lat: 46.77486850663835, lng: 23.58968496322632})
];


Promise.all(centerSquarePoints.map(async function(pair) {
  return await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${pair.start.lat},${pair.start.lng}&destination=${pair.end.lat},${pair.end.lng}`);
}))
  .then(responses => {
    responses.map((responses) => {
      Promise.all(async function(response) {
        return await response.json();
      });
    });
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    throw error;
  });