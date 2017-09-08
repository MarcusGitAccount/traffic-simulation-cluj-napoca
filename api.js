'use strict';

const fetch = require('node-fetch');

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

module.exports = (router) => {
  router.get('/', (request, response) => {
    response.status(200).send("Root route for this application's api");
  });
  
  router.get('/points', (request, response) => {
    Promise.all(centerSquarePoints.map(async function(pair) {
      return await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${pair.start.lat},${pair.start.lng}&destination=${pair.end.lat},${pair.end.lng}`);
    }))
      .then(responses => {
        return Promise.all(
          responses.map(async function(res) {
            return await res.json();
          })
        );
      })
      .then(data => {
        const points = [];
        const bounds = { 
          northeast: { lat: -999, lng: -999},
          southwest: { lat: 999, lng: 999 } 
        };
        
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
          points.push(...item.routes[0].legs[0].steps.map(step => {
            return {
              start: step.start_location,
              end: step.end_location,
              distance: step.distance.value
            };
          }));
        });
        
        return Promise.resolve({points, bounds});
      })
      .then(dataSet => {
        const {points, bounds} = dataSet;
        const totalDistance = points.reduce((prev, current) => prev + current.distance, 0);

        response.status(200).json({points, bounds, totalDistance});
      })
      .catch(error => {
        response.status(204).send(new Error(error));
      });
  });

  return router;
};