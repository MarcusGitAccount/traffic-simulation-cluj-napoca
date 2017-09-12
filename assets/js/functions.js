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

const roads = [/*
  new Road(point2D(210, 300), point2D( 10, 300), {maxSpeed: 2   }),
  new Road(point2D( 10, 300), point2D( 10,  20), {maxSpeed: 1   }),
  new Road(point2D( 10,  20), point2D(210,  20), {maxSpeed: 1.25}),
  new Road(point2D(210,  20), point2D(450, 160), {maxSpeed: 1.5 }),
  new Road(point2D(450, 160), point2D(710,  60), {maxSpeed: 2   }),
  new Road(point2D(710,  60), point2D(110, 460), {maxSpeed: 1.75}),
  new Road(point2D(110, 460), point2D(510, 660), {maxSpeed: 2   }),
  new Road(point2D(510, 660), point2D(999, 660), {maxSpeed: 2   })*/
];

let cars = [
/*new Car(1, roads[0].start, 10, 7.5, null, 1.5, {maxSpeed: 2   }),
new Car(2, roads[1].start, 10, 7.5, null,  .5, {maxSpeed: 1   }),
new Car(3, roads[2].start, 10, 7.5, null, .75, {maxSpeed: 1.75}),
new Car(4, roads[3].start, 10, 7.5, null, 3.5, {maxSpeed: 4.5 })*/
];

(function init() {
  canvas.width = 1000;
  canvas.height = 750;
  
  window.fetch(`${window.location.origin}/api/points`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          
          for (const dataArray of data.points) {
            for (const point of dataArray) {
              roads.push(new Road(
                point2D(Math.floor(point.start.utm.easting % 1000) , Math.floor(point.start.utm.northing % 1000)),
                point2D(Math.floor(point.end.utm.easting % 1000), Math.floor(point.end.utm.northing % 1000)),
                {maxSpeed: 2}
              ));
            }
          }

          return Promise.resolve(true);
        })
        .then(done => {
          console.log(roads);
          
          cars = [
            new Car(1, roads[0].start, 10, 7.5, null, 1.5, {maxSpeed: 2   }),
            new Car(2, roads[1].start, 10, 7.5, null,  .5, {maxSpeed: 1   }),
            new Car(3, roads[2].start, 10, 7.5, null, .75, {maxSpeed: 1.75}),
            new Car(4, roads[3].start, 10, 7.5, null, 3.5, {maxSpeed: 4.5 })
          ];
          
            for (let index = 0; index < cars.length; index++)
            roads[index].addCar(cars[index]);

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
  
  for (const road of roads)
    road.draw();
  
  for (let index = 0; index < roads.length; index++) {
    roads[index].adaptSpeed();
    
    for (const car of roads[index].cars) {
      const {start, end} = roads[index];
      
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