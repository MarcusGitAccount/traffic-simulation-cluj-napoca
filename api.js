'use strict';

const fetch = require('node-fetch');
const proj4 = require('proj4');

const projections = {
  utm: "+proj=utm +zone=34t",
  wgs84: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
};

function startEnd(start, end) {
  return {start, end};
}

function getUtm(coords) {
  const result =  proj4(projections.wgs84, projections.utm, [coords.lng, coords.lat]);
  
  return {
    easting: result[0], // oX
    northing: result[1] // oY
  };
}

const centerSquarePoints = [
/*  startEnd({lat: 46.773777343799175, lng: 23.588075637817383} ,{lat: 46.77562532713712, lng: 23.590580821037292}),
  startEnd({lat: 46.77562532713712, lng: 23.590580821037292}, {lat: 46.774710528202135, lng: 23.591803908348083}),
  startEnd({lat: 46.77429169940724, lng: 23.592286705970764}, {lat: 46.773696516042655, lng: 23.588220477104187}),
  startEnd({lat: 46.774192502636616, lng: 23.59211504459381}, {lat: 46.77467378896449, lng: 23.59185755252838}),
  startEnd({lat: 46.77411534946648, lng: 23.59037697315216}, {lat: 46.77486850663835, lng: 23.58968496322632})*/
  {
    start: {lat: 46.773781379807524,lng: 23.58806787222754},
    end:   {lat: 46.77488095105854, lng: 23.589667275956423},
  },
  {
    start: {lat: 46.77488095105854, lng: 23.589667275956423},
    end:   {lat: 46.775623000948556,lng: 23.59058520784507},
  },
  {
    start: {lat: 46.775623000948556,lng: 23.59058520784507},
    end:   {lat: 46.77471540405222, lng: 23.59181175856475},
  },
  {
    start: {lat: 46.77471540405222,lng: 23.59181175856475},
    end:   {lat: 46.77429367376812,lng: 23.592295011235933},
  },
  {  
    start: {lat: 46.77471540405222,lng: 23.59181175856475},
    end:   {lat: 46.77419829442854,lng: 23.592122984174388},
  },
  {   
    start: {lat: 46.77429367376812,lng: 23.592295011235933},
    end:   {lat: 46.77419829442854,lng: 23.592122984174388},
  },
  {  
    start: {lat: 46.77488095105854,lng: 23.589667275956423},
    end:   {lat: 46.77411916855766,lng: 23.590376558733723},
  },
  {  
    start: {lat: 46.77419829442854,lng: 23.592122984174388},
    end:   {lat: 46.77411916855766,lng: 23.590376558733723},
  },
  { 
    start: {lat: 46.77411916855766,lng: 23.590376558733723},
    end:   {lat: 46.77370555612028,lng: 23.58821318920320}
  }
];

let arrayKeys = {};
let pointsArray = [];
let index = 0;

module.exports = (router) => {
  router.get('/', (request, response) => {
    response.status(200).send("Root route for this application's api");
  });
  
  router.get('/points', (request, response) => {
    const bounds = {
      minLat:  999,
      maxLat: -999,
      minLng:  999,
      maxLng: -999
    };  
    
    for (const pair of centerSquarePoints) {
      for (const prop in pair) {
        if (pair[prop].lat > bounds.maxLat)
          bounds.maxLat = pair[prop].lat;
        else if (pair[prop].lat < bounds.minLat)
          bounds.minLat = pair[prop].lat;

        if (pair[prop].lng > bounds.maxLng)
          bounds.maxLng = pair[prop].lng;
        else if (pair[prop].lng < bounds.minLng)
          bounds.minLng = pair[prop].lng;
      }
    }
    
    centerSquarePoints.forEach(pair => {
    	for (const p in pair) {
    		const prop = `${pair[p].lat},${pair[p].lng}`;
    
    		if (!arrayKeys.hasOwnProperty(prop)) {
    			arrayKeys[prop] = {
    			  index: index++,
    			  point: pair[p]
    			};
    		}
    	}
    });
    
    for (let i = 0; i < centerSquarePoints.length; i++) {
      for (const p of ['start', 'end']) {
        const prop = `${centerSquarePoints[i][p].lat},${centerSquarePoints[i][p].lng}`;
        
        centerSquarePoints[i][p] = arrayKeys[prop];
      }
    }
    
    for (const prop in arrayKeys) {
      pointsArray[arrayKeys[prop].index] = arrayKeys[prop].point;
    }
    
    response.status(200).json({pairs: centerSquarePoints, bounds: bounds, points: pointsArray});
  });

  return router;
};