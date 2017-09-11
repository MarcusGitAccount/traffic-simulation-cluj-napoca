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

const carColors = ['#ff0000', '#00ff00'];

const roads = [
  new Road(point2D(10, 300), point2D(10, 20)),
  new Road(point2D(10, 20), point2D(210, 20), 200, {number: 2, width: 22}),
  new Road(point2D(210, 20), point2D(450, 160), 107, {number: 2, width: 22}),
  new Road(point2D(450, 160), point2D(710, 60), 200, 2),
  new Road(point2D(710, 60), point2D(110, 460), 200, 2),
  new Road(point2D(110, 460), point2D(510, 660), 200, 2)
];

const cars = [
  new Car(1, roads[0].start, 5, 5, null, .0000000000000001)
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
      
      car.drawingOptions.strokeColor = carColors[index % carColors.length];
      car.draw(roads[index].slope);
      
      if (!testForPointInSegment(car.position, {start, end})) {
        roads[index].deleteCar(car);
        if (roads[index + 1]) {
          car.position = roads[index + 1].start;
          roads[index + 1].addCar(car);
        }
      }
    }
  }
  
  window.requestAnimFrame(animationStep);
}