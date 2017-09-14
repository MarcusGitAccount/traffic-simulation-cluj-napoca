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

module.exports = (router) => {
  router.get('/', (request, response) => {
    response.status(200).send("Root route for this application's api");
  });
  
  router.get('/points', (request, response) => {
  /*    Promise.all(centerSquarePoints.map(async function(pair) {
      return await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${pair.start.lat},${pair.start.lng}&destination=${pair.end.lat},${pair.end.lng}`);
    }))
      .then(async function(responses) {
        return Promise.all(
          responses.map(async function(res) {
            return await res.json();
          })
        );
      })
      .then(async function(data) {
        const points = [];
        const bounds = { 
          northeast: { lat: -999, lng: -999},
          southwest: { lat: 999, lng: 999 } 
        };
        
        console.log(data[0].routes[0].legs[0])
        
        data.forEach(item => {
          const bound = item.routes[0].bounds;

          if (bound.northeast.lat > bounds.northeast.lat)
            bounds.northeast.lat = bound.northeast.lat;
          if (bound.northeast.lng > bounds.northeast.lng)
            bounds.northeast.lng = bound.northeast.lng;
          
          if (bound.southwest.lat < bounds.southwest.lat)
            bounds.southwest.lat = bound.southwest.lat;
          if (bound.southwest.lng < bounds.southwest.lng)
            bounds.southwest.lng = bound.southwest.lng;  
        });
        
        data.forEach(item => {
          points.push(item.routes[0].legs[0].steps.map(step => {
            return {
              start: {
                wgs84: step.start_location,
                utm: getUtm(step.start_location)
              },
              end: {
                wgs84: step.end_location,
                utm: getUtm(step.end_location)
              },
              distance: step.distance.value
            };
          }));
        });
        
        const _bounds = {
          northeast: {
            wgs84: bounds.northeast,
            utm: getUtm(bounds.northeast)
          },
          southwest: {
            wgs84: bounds.southwest,
            utm: getUtm(bounds.southwest)
          }
        };
        
        return Promise.resolve({points, bounds, _bounds});
      })
      .then(dataSet => {
        const {points, _bounds} = dataSet;
        
        response.status(200).json({points, _bounds, totalDistance});
      })
      .catch(error => {
        response.status(204).send(new Error(error));
      });*/
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
    
    response.status(200).json({pairs: centerSquarePoints, bounds: bounds});
  });

  return router;
};