'use strict';

const path = require('path');

const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const proj4 = require('proj4');

const fetch = require('node-fetch');

const coords = [23.558636, 46.796938];

const app = express();

const apiRouter = require('./api.js')(express.Router());

app.set('case sensitive routing', false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/api', apiRouter);

app.get('/', (request, response) => {
  response.status(200).redirect('/assets');
});

app.get('*', (request, response) => {
  response.status(404).send('Route not found');
});

const listener = app.listen(process.env.PORT, process.env.IP, () => {
  const {address, port} = listener.address();
  
  console.log(`Server up and running on https://${address}:${port}`);
});

/*(function doOrDoNot() {
  let points = [
     {lat: 46.773777343799175, lng: 23.588075637817383}
    ,{lat: 46.77562532713712, lng: 23.590580821037292}
    ,{lat: 46.77562532713712, lng: 23.590580821037292}
    ,{lat: 46.774710528202135, lng: 23.591803908348083}
    ,{lat: 46.77429169940724, lng: 23.592286705970764}
    ,{lat: 46.773696516042655, lng: 23.588220477104187}
    ,{lat: 46.774192502636616, lng: 23.59211504459381}
    ,{lat: 46.77467378896449, lng: 23.59185755252838}
    ,{lat: 46.77411534946648, lng: 23.59037697315216}
    ,{lat: 46.77486850663835, lng: 23.58968496322632}
];

  points = points.map(point => {
      return `${point.lat},${point.lng}`;
  });
  
  console.log(points.join('|'));
  
  // const url = `https://roads.googleapis.com/v1/nearestRoads?points=${points.join('|')}&key=AIzaSyCJ_LkfJBftPS7lwRBXfqjstDbET49WWXY`;
  
 // le url = 'https://roads.googleapis.com/v1/nearestRoads?points=46.773777343799175,23.588075637817383|46.77562532713712,23.590580821037292|46.77562532713712,23.590580821037292|46.774710528202135,23.591803908348083|46.77429169940724,23.592286705970764|46.773696516042655,23.588220477104187|46.774192502636616,23.59211504459381|46.77467378896449,23.59185755252838|46.77411534946648,23.59037697315216|46.77486850663835,23.58968496322632&key=AIzaSyCJ_LkfJBftPS7lwRBXfqjstDbET49WWXY';
  
  const url = 'https://roads.googleapis.com/v1/nearestRoads?points=46.773781379807524,23.588067872227533|46.775623000948556,23.590585207845074|46.775623000948556,23.590585207845074|46.77471540405222,23.59181175856475|46.77471540405222,23.59181175856475|46.77429367376812,23.592295011235926|46.77370555612028,23.588213189203213|46.77419829442854,23.5921229841744|46.77467768940776,23.591863489633567|46.77411916855766,23.590376558733723|46.77488095105854,23.589667275956423&key=AIzaSyCJ_LkfJBftPS7lwRBXfqjstDbET49WWXY';
  

  fetch(url)
  	.then(async function(response) { return await response.json(); })
  	.then(async function(data) {
  		return Promise.resolve(data.snappedPoints.map(point => {
  			return {
  				lat: point.location.latitude,
  				lng: point.location.longitude
  			};
  		}));
  	})
  	.then(data => {
  		data = data.map(point => `${point.lat},${point.lng}`);
  
  		console.log(data.join('\n'));
  	})
  	.catch(error => console.log(error));
})();*/