'use strict';

import {default as Road} from './Road.js';
import {default as DirectedGraph} from './DirectedGraph.js';
import {randomInt, testForPointInSegment} from './Utils.js';

const _createSystem = Symbol('_createSystem');

class RoadSystem extends DirectedGraph {
  constructor(points) {
    super();
    this.points = points;
  }
  
  getRandomEdge(vertexId) {
    return this.vertexEdges(vertexId).getKeytPosition(randomInt(0, this.vertexEdgesNumber(vertexId)));
  }
  
  [_createSystem]() {
    for (let i = 0; i < this.roadsArray.length; i++) {
      for (let j = 0; j < this.roadsArray.length; j++) {
        if (this.roadsArray[i].end.x === this.roadsArray[j].start.x &&
            this.roadsArray[i].end.y === this.roadsArray[j].start.y &&
            i != j) 
        {
          // console.log(`${i} -> ${j}`);
          this.addEdge(i, j);
        }
      }
    }
  }
  
  drawRoads() {
    for (let vertex = 0; vertex < this.points.length; vertex++) {
      this.vertexEdges(vertex).forEach((road) => {
        road.draw();
      });
    }
  }
  
  updateCars() {
    for (let vertex = 0; vertex < this.points.length; vertex++) {
      this.vertexEdges(vertex).forEach((road, neighborVertex) => {
        const {start, end} = road;
        
        road.adaptSpeed();
        for (const car of road.cars) {
          car.draw(road.slope);
          
          if (!testForPointInSegment(car.position, {start, end})) {
            road.deleteCar(car);
            if (this.vertexEdgesNumber(neighborVertex) > 0) {
              const nextVertex = this.getRandomEdge(neighborVertex);
              const nextRoad = this.getEdge(neighborVertex, nextVertex);

              car.position = nextRoad.start;
              nextRoad.addCar(car);
            }
          }
        }
        
      });
    }
  }
}

export default RoadSystem;