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


module.exports = (router) => {
  router.get('/', (request, response) => {
    response.status(200).send("Root route for this application's api");
  });
  
  router.get('/points', (request, response) => {
        
    Promise.resolve({centerSquarePoints: [
    {
      end: {lat: 46.773781379807524,lng: 23.58806787222754},
      start:   {lat: 46.77488095105854, lng: 23.589667275956423},
    },
    {
      end: {lat: 46.77488095105854, lng: 23.589667275956423},
      start:   {lat: 46.775623000948556,lng: 23.59058520784507},
    },
    {
      end: {lat: 46.775623000948556,lng: 23.59058520784507},
      start:   {lat: 46.77471540405222, lng: 23.59181175856475},
    },
    {
      end: {lat: 46.77471540405222,lng: 23.59181175856475},
      start:   {lat: 46.77429367376812,lng: 23.592295011235933},
    },
    {  
      end: {lat: 46.77471540405222,lng: 23.59181175856475},
      start:   {lat: 46.77419829442854,lng: 23.592122984174388},
    },
    {   
      end: {lat: 46.77429367376812,lng: 23.592295011235933},
      start:   {lat: 46.77419829442854,lng: 23.592122984174388},
    },
    {  
      end: {lat: 46.77488095105854,lng: 23.589667275956423},
      start:   {lat: 46.77411916855766,lng: 23.590376558733723},
    },
    {  
      end: {lat: 46.77419829442854,lng: 23.592122984174388},
      start:   {lat: 46.77411916855766,lng: 23.590376558733723},
    },
    { 
      end: {lat: 46.77411916855766,lng: 23.590376558733723},
      start:   {lat: 46.77370555612028,lng: 23.58821318920320}
    }
    ]})
      .then(async function(data) {
        const {centerSquarePoints} = data;
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
        
        return Promise.resolve({bounds, centerSquarePoints});
      })
      .then(async function(response) {
        const {centerSquarePoints, bounds} = response;
        let arrayKeys = {};
        let pointsArray = [];
        let index = 0;
  
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
        
        return Promise.resolve({bounds, centerSquarePoints, pointsArray});
    })
      .then((data) => {
        response.setHeader('Cache-Control', 'no-cache');
        response.status(200).json({pairs: data.centerSquarePoints, bounds: data.bounds, points: data.pointsArray});
      })
      .catch(error => console.log(error));
  });

  return router;
};