/*
  Make code:
 (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
*/

'use strict';

import {default as Car} from './models/Car.js';
import {default as Road} from './models/Road.js';
import {default as RoadSystem} from './models/RoadSystem.js';
import {
  getRequestAnimationFrameFunction as getRequestAnimFrame, 
  testForPointInSegment,
  latLngToCanvasXY, degreesToRad,
  randomInt
} from './models/Utils.js';
import {default as DirectedGraph} from './models/DirectedGraph.js';
import {default as BinaryHeap} from './models/BinaryHeap.js';

const canvas = document.querySelector('canvas');

window.globalContext = canvas.getContext('2d');
window.requestAnimFrame = getRequestAnimFrame();

const roads = [];
let roadSystem;

const colorsArray = ['#E65100', '#607D8B', 'red', 'cyan', 'pink', '#1B5E20', '#18FFFF', '#311B92'];

const cars = [];

(function init() {
  canvas.width = 1000;
  canvas.height = 650;

  window.fetch(`${window.location.origin}/api/points`)
        .then(async function(response) {
          return await response.json();
        })
        .then(data => {
          const dimensions = {
            width: canvas.width,
            height: canvas.height
          };
          
          let temp;

          // every canvas is drawn in the 4th square of the XoY system
          // thus you have to invert the bottom and top oY(latitude in this case) bounds
          // swap(bottom, top)
          
          temp = data.bounds.maxLat;
          data.bounds.maxLat = data.bounds.minLat;
          data.bounds.minLat = temp;

          roadSystem = new RoadSystem(data.points);
          roadSystem.addVertices(...Object.keys(data.points));

          for (const pair of data.pairs) {
            const roadPiece = new Road(
              latLngToCanvasXY(pair.start.point, data.bounds, dimensions),
              latLngToCanvasXY(pair.end.point, data.bounds, dimensions),
              pair,
              {maxSpeed: 2},
              null
            );

            roadSystem.addEdge(pair.start.index, pair.end.index, roadPiece);
            roads.push(roadPiece);
          }

          cars.push(
            ...[
              new Car(1, roads[0].start, 10, 7.5, null, 1.5, {maxSpeed: 2   }),
              new Car(2, roads[1].start, 10, 7.5, null,  .5, {maxSpeed: 1   }),
              new Car(3, roads[2].start, 10, 7.5, null, .75, {maxSpeed: 1.75}),
              new Car(4, roads[3].start, 10, 7.5, null, 3.5, {maxSpeed: 4.5 }),
              new Car(5, roads[4].start, 10, 7.5, null, 3.5, {maxSpeed: 4.5 }),
              new Car(6, roads[5].start, 10, 7.5, null, 3.5, {maxSpeed: 4.5 })
            ]
          );

          for (let index = 0; index < cars.length; index++)
            roads[index].addCar(cars[index]);

          roads[0].drawingOptions = {strokeColor: 'blue', lineWidth: 2};
          roads[1].drawingOptions = {strokeColor: 'green', lineWidth: 2};
          roads[roads.length - 1].drawingOptions = {strokeColor: 'red', lineWidth: 2};

          return Promise.resolve(true);
        })
        .then(done => {
          if (done === true) {
            // bit of debugging
            console.log(roadSystem.verticesList);
            console.log('bfs: ', ...roadSystem.bfs(0));
            console.log(roadSystem.vertexEdges(1));
            console.log(roadSystem);
            
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
  // this seems to works for Chrome, not sure for other browsers

  canvas.width = canvas.width;

  roadSystem.drawRoads();
  roadSystem.updateCars();

  window.requestAnimFrame(animationStep);
}