'use strict';

import {default as Car} from './models/Car.js';
import {default as Road} from './models/Road.js';
import {
  point2D, 
  getRequestAnimationFrameFunction as getRequestAnimFrame, 
  testForPointInSegment
} from './models/Utils.js';

const canvas = document.querySelector('canvas');

window.globalContext = canvas.getContext('2d');
window.requestAnimFrame = getRequestAnimFrame();

const roads = [
  new Road(point2D(10, 20), point2D(210, 20), 200, {number: 2, width: 22}),
  new Road(point2D(210, 20), point2D(450, 160), 107, {number: 2, width: 22}),
 // new Road(point2D(310, 60), point2D(510, 60), 200, 2)
];

const cars = [
  new Car(1, point2D(10, 20), 5, 5, null, .1)
];

(function init() {
  canvas.width = 1000;
  canvas.height = 750;
  
  roads[0].addCar(cars[0]);
  
  for (const road of roads)
    if (!road.isMockup)
      road.draw();

  window.requestAnimFrame(animationStep);
  
})();

function animationStep(timestamp) {
  for (let index = 0; index < roads.length; index++) {
    for (const car of roads[index].cars) {
      const {start, end} = roads[index];
      
      car.draw(roads[index].slope);
      if (!testForPointInSegment(car.position, {start, end})) {
        console.log(roads[index].end, car.position, index);
        roads[index].deleteCar(car);
        car.drawingOptions.strokeColor = '#00ff00';
        if (roads[index + 1]) {
          console.log(`Added car to the next piece of road ${roads[index + 1]}`)
          roads[index + 1].addCar(car);
          console.log(roads[index].cars, roads[index + 1].cars)
        }
      }
    }
  }
  
  window.requestAnimFrame(animationStep);
}