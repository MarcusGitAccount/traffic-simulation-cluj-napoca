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
          
          let colorIndex = 0;
          
          for (const pair of data.pairs) {
            roads.push(new Road(
              latLngToCanvasXY(pair.start, data.bounds, dimensions),
              latLngToCanvasXY(pair.end, data.bounds, dimensions),
              {maxSpeed: 2},
              null
              //{strokeColor: colorsArray[colorIndex % colorsArray.length], lineWidth: 1}
            ));
            
          }
          colorIndex++;
          
          for (let index = 0; index < roads.length; index++)
            //console.log(index, roads[index].start, roads[index].end);
          
          return Promise.resolve(true);
        })
        .then(done => {
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
          
          roadSystem = new RoadSystem(roads);
          console.log(roadSystem)
          if (done === true)
            window.requestAnimFrame(animationStep);
        })
        .catch(error => {
          console.log(error);
          
          throw error;
        });
  
})();

function animationStep(timestamp) {
  canvas.width = canvas.width;
  
  for (const road of roadSystem.roadsArray)
    road.draw();
  
  for (let index = 0; index < roadSystem.roadsArray.length; index++) {
    roads[index].adaptSpeed();
    
    for (const car of roads[index].cars) {
      const {start, end} = roads[index];
      
      car.draw(roads[index].slope);
      
      if (!testForPointInSegment(car.position, {start, end})) {
        //console.log(index, roadSystem.vertexEdgesNumber(index));
        roadSystem.roadsArray[index].deleteCar(car);
        if (roadSystem.vertexEdgesNumber(index) > 0) {
          const newIndex = roadSystem.getRandomEdge(index);

          car.position = roadSystem.roadsArray[newIndex].start;
          roadSystem.roadsArray[newIndex].addCar(car);
        }
      }
    }
  }
  
  window.requestAnimFrame(animationStep);
}

const cmp = (a, b) => a < b;
const heap = new BinaryHeap(cmp); // min heap

Promise.resolve(true)
  .then(async function(_) {
    heap.push(3, 8, 9, 1, 6, 5); // 1 3 5 8 6 9
    heap.debug();
    console.log(heap.pop());

    return Promise.resolve(true);
  })
  .then(_ => {
    heap.debug();
  })
  .catch(error => console.log(error));
  
