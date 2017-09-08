'use strict';

import {default as Car} from './models/Car.js';
import {default as TimestampInterval} from './models/TimestampInterval.js';
import {default as Road} from './models/Road.js';
import {
  point2D, 
  getRequestAnimationFrameFunction as getRequestAnimFrame, 
  segmentToVector, 
  angleBetween2DVectors,
  radToDegrees
} from './models/Utils.js';

const canvas = document.querySelector('canvas');

window.globalContext = canvas.getContext('2d');
window.requestAnimFrame = getRequestAnimFrame();

const roads = [
  new Road(point2D(0, 0), point2D(10, 0), 0, 0, true),
  new Road(point2D(10, 20), point2D(210, 20), 200, 2),
  new Road(point2D(210, 20), point2D(450, 160), 107, 2),
 // new Road(point2D(310, 60), point2D(510, 60), 200, 2)
];

const cars = [
  new Car(1, point2D(10, 20), 5, 5, null)
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
  
}

const a = segmentToVector(roads[0].start, roads[0].end);
const b = segmentToVector(roads[1].start, roads[1].end);

console.log(a, b, radToDegrees(angleBetween2DVectors(a, b)));
