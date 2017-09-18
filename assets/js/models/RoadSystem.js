'use strict';

import {default as DirectedGraph} from './DirectedGraph.js';
import {randomInt} from './Utils.js';

const _createSystem = Symbol('_createSystem');

class RoadSystem extends DirectedGraph {
  constructor(roadsArray) {
    super();
    // this.points 
    this.roadsArray = roadsArray;
    
    for (let index = 0; index < this.roadsArray.length; index++)
      this.addVertices(index);
    
    
    this[_createSystem]();
  }
  
  getRandomEdge(vertexId) {
    return this.vertexEdges(vertexId).getItemAtPosition(randomInt(0, this.vertexEdgesNumber(vertexId)));
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
}

export default RoadSystem;