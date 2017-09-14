/*
  Make code:
 (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
*/

'use strict';

import {default as Car} from './models/Car.js';
import {default as Road} from './models/Road.js';
import {
  getRequestAnimationFrameFunction as getRequestAnimFrame, 
  testForPointInSegment,
  latLngToCanvasXY
} from './models/Utils.js';
import {default as DirectedGraph} from './models/DirectedGraph.js';

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

const colorsArray = ['#E65100', '#607D8B', 'red', 'cyan', 'pink', '#1B5E20', '#18FFFF', '#311B92'];

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
        .then(async function(response) {
          return await response.json();
        })
        .then(data => {
          const leftTopBounds = {
            x: data._bounds.southwest.utm.easting,
            y: data._bounds.southwest.utm.northing
          };
          
          const bounds = {
            minLat: data._bounds.southwest.wgs84.lat,
            maxLat: data._bounds.northeast.wgs84.lat,
            minLng: data._bounds.southwest.wgs84.lng,
            maxLng: data._bounds.northeast.wgs84.lng,
          };
          
          const dimensions = {
            width: canvas.width,
            height: canvas.height
          };
          
          let colorIndex = 0;
          
          for (const dataArray of data.points) {
            for (const point of dataArray) {
              roads.push(new Road(/*
                point2D(Math.floor(point.start.utm.easting - leftTopBounds.x) , Math.floor(point.start.utm.northing - leftTopBounds.y)),
                point2D(Math.floor(point.end.utm.easting - leftTopBounds.x), Math.floor(point.end.utm.northing - leftTopBounds.y)),*/
                latLngToCanvasXY(point.start.wgs84, bounds, dimensions),
                latLngToCanvasXY(point.end.wgs84, bounds, dimensions),
                {maxSpeed: 2},
                null,
                {strokeColor: colorsArray[colorIndex % colorsArray.length], lineWidth: 1}
              ));
              
            }
            
            colorIndex++;

          }

          return Promise.resolve(true);
        })
        .then(done => {
/*          for (const road of roads) {
            console.log(road.start, road.end);
          }*/
          
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

const graph = new DirectedGraph();

graph.addVertices(1, 2, 3, 4, 5, 6, 7);

graph.addEdge(1, 2);
graph.addEdge(1, 3);
graph.addEdge(3, 4);
graph.addEdge(5, 3);
graph.addEdge(2, 6);
graph.addEdge(2, 5);
graph.addEdge(6, 7);
graph.addEdge(7 ,2);

console.log(graph.debug);