/*
  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
*/

'use strict';

import {default as Car} from './models/Car.js';
import {default as Road} from './models/Road.js';
import {default as RoadSystem} from './models/RoadSystem.js';
import {
  getRequestAnimationFrameFunction as getRequestAnimFrame, 
  latLngToCanvasXY,
} from './models/Utils.js';

const canvas = document.querySelector('canvas');

window.globalContext = canvas.getContext('2d');
window.requestAnimFrame = getRequestAnimFrame();

const roads = [];
let roadSystem;

const colorsArray = ['#E65100', '#607D8B', 'red', 'cyan', 'pink', '#1B5E20', '#18FFFF', '#311B92'];

const cars = [];

(function init() {
  canvas.width  = 1000;
  canvas.height = 650;

  window.fetch(`${window.location.origin}/api/points`)
        .then(async function(response) {
          return await response.json();
        })
        .then(async function(data) {
          let temp;

          // every canvas is drawn in the 4th square of the XoY system
          // thus you have to invert the bottom and top oY(latitude in this case) bounds
          // swap(bottom, top)
          
          temp = data.bounds.maxLat;
          data.bounds.maxLat = data.bounds.minLat;
          data.bounds.minLat = temp;

          roadSystem = new RoadSystem(data.points);
          roadSystem.addVertices(...Object.keys(data.points));
          roadSystem.createReversed();
          
          return Promise.resolve({done: true, data: data});
        })
        .then(async function(response) {
          const dimensions = {
            width: canvas.width,
            height: canvas.height
          };
          const {done, data} = response;
          
          if (done) {
            for (const pair of data.pairs) {
              const roadPiece = new Road(
                latLngToCanvasXY(pair.start.point, data.bounds, dimensions),
                latLngToCanvasXY(pair.end.point, data.bounds, dimensions),
                pair,
                {maxSpeed: 1},
                {numberOfLanes: 4, size: 5}
              );
              
              console.log(`edge: ${pair.start.index} -> ${pair.end.index} cost: ${roadPiece.distance}`);
              roadSystem.addEdge(pair.start.index, pair.end.index, roadPiece);
              roadSystem.addReveredEdge(pair.end.index, pair.start.index, roadPiece);

              roads.push(roadPiece);
            }
            
            return Promise.resolve(true);
          }
        })
        .then(async function(done) {
          if (done === true) {
            const costs = roadSystem.dijkastra(7, (road) => road.distance);
            
            cars.push(
              ...[
                new Car(7, roads[7].start, 10, 7.5, 0, 1.5, {maxSpeed: 1.5 }, {strokeColor: 'blue',   lineWidth: 3.5}),
                new Car(7, roads[7].start, 10, 7.5, 1, 1.5, {maxSpeed: 1   }, {strokeColor: 'green',  lineWidth: 3.5}),
                new Car(7, roads[7].start, 10, 7.5, 2, 1.5, {maxSpeed: 1.75}, {strokeColor: 'orange', lineWidth: 3.5}),
                new Car(7, roads[7].start, 10, 7.5, 3, 1.5, {maxSpeed: 1.5 }, {strokeColor: 'pink',   lineWidth: 3.5}),
                new Car(4, roads[4].start, 10, 7.5, 0, .75, {maxSpeed: 1.5 }),
                new Car(5, roads[5].start, 10, 7.5, 0, 1.5, {maxSpeed: 1.5 }),
                new Car(6, roads[6].start, 10, 7.5, 0,  .5, {maxSpeed: 1.5 }),
                new Car(1, roads[1].start, 10, 7.5, 0, 1.5, {maxSpeed: 1.5 },  {strokeColor: 'cyan',   lineWidth: 15}),
                new Car(0, roads[0].start, 10, 7.5, 3, 3.5, {maxSpeed: 1 })
              ]
            );

            for (const car of cars)
              roads[car.id].addCar(car);

            console.log('\n', roadSystem, '\n');
            
            console.log('bfs: ', roadSystem.bfs(7));
            
            costs.distances.forEach((cost ,index) => {
              console.log(`Optimal cost to get from node 7 to ${index}: ${cost}`);
            });
            console.log('');
            costs.previousNodes.forEach((node, index) => {
              console.log(`Previous node: ${node} -> ${index}`);
            });
            
              console.log(roadSystem.points);
  
              for (let edge in roadSystem.points) {
                console.log(edge, roadSystem.vertexEdges(edge));
              }
            
            roadSystem.debug();
            window.requestAnimFrame(animationStep);
          }
        })
        .catch(error => {
          console.log(error);

          throw error;
        });
  
})();

function animationStep(timestamp) {
  // find a better way to reset the canvas
  // this seems to work for Chrome, not sure for other browsers

  window.globalContext.clearRect(0, 0, canvas.width, canvas.height);

  roadSystem.drawRoads();
  roadSystem.updateCars();

  window.requestAnimFrame(animationStep);
}