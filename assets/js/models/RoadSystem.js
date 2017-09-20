/*
  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
*/

'use strict';

import {default as DirectedGraph} from './DirectedGraph.js';
import {randomInt, testForPointInSegment} from './Utils.js';

class RoadSystem extends DirectedGraph {
  constructor(points) {
    super();
    this.points = points;
  }
  
  getRandomEdge(vertexId) {
    return this.vertexEdges(vertexId).getKeytPosition(randomInt(0, this.vertexEdgesNumber(vertexId)));
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
          car.draw(road.slope, road.lanesInfo);

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