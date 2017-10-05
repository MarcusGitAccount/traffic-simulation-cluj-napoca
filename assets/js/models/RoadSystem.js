/*
  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
*/

'use strict';

import {default as DirectedGraph} from './DirectedGraph.js';
import {default as Queue} from './Queue.js';
import {default as Road} from './Road.js';
import {default as Multigraph} from './Multigraph.js';
import {default as LinkedList} from './LinkedList.js';
import {randomInt, testForPointInSegment, segmentToVector, 
        angleBetween2DVectors, radToDegrees, fixDecimals, point2D} from './Utils.js';

class RoadSystem extends Multigraph {
  constructor(points) {
    super();
    this.points = points;
    this.reversedList = {};
  }
  
  createReversed() {
    this.vertices.forEach(vertex => {
      this.reversedList[vertex] = new Map();
    });
  }
  
  addReveredEdge(firstVertex, secondVertex, weight) {
    if (!this.reversedList[firstVertex].get(secondVertex))
      this.reversedList[firstVertex].set(secondVertex, new LinkedList());
    
    this.reversedList[firstVertex].get(secondVertex).add(weight);
  }
  
  getRandomEdge(vertexId) {
    return this.vertexEdges(vertexId).getKeytPosition(randomInt(0, this.vertexEdgesNumber(vertexId)));
  }
  
  debug() {
    for (let vertex = 0; vertex < this.points.length; vertex++) {
      console.log(`Current point: ${vertex}`);
      console.log('Coming to this point: ', this.reversedList[vertex]);
      console.log('Leaving this point: ', this.vertexEdges(vertex));
    }
  }

  addLane() {
    /*
      Solution: make the directed graph a directed multigraph
      in order to support multiple lanes between two points.
      This way traffic on different lanes can be controlled in
      different manners:
        1.) Control the shortest path between two points
            by directly knowing how many cars are on each
            each between those two points
        2.) Being able to add different traffic directions
            between two points. Up/down maybe.
            
      How to implement this solution:
      Getting road info: A -> B or B -> A, A(x, y) and B(x, y)
      TODO:
        - Modify the DirectedGraph class to support directed multigraph
        (between each two vertices can exist more than one directed edge)
        A -> B (1), A -> B (2), A -> B (3), ...
        - Mofidy the Road class to support lanes and drawing points.
        We will still use the start/end points to determine the lanes' edges
        but the drawing points will be totally different.
        Interior angle of the shape -> uppper road
        Exterior angle of the shape -> down road going in the opposite direction
        - Modify the RoadSystem and add addLane/addLanes method
      For each lane:
        (A, B) or (B, A) for (start, end) road coordinates
        After getting the road info do the following
        - for roads going up adjust the drawing point a little bit harder
        (viceversa for the down roads)
        - get the number of lanes for each direction of the road
        (A -> B and B -> A)
        - for each lane in each direction add the lanes (look up the drawing 
        in the notebook)
        Iterate through vertices
        - for edges entering the vertex modify the lane ending points
        - for edges leaving the vertex modify the lane starting points
          Note: starting/ending points are the drawing points for each lane
        After you got the basic lanes(A->B || B->A) call the addLanes method
        in the RoadSystem to add the lanes(edges) to the graph.
    */
  }
  
  adaptedBfs(start = 0, callback = null) {
    /*
      Make an initial call for this method before adding
      more lanes to each road piece/main edge, call it whatever
      floats your boat.
      
      How it should work:
      Create a version of bfs to traverse the graph. Additionaly,
      you have to remember the node you came from for each one that
      is checked during the traverse.
      
      For you from the next day, dumbass:
        - You need to updated the starting/ending points for a lane
          only if they are unset/null. Don't worry. :p
    */
    
    const visited = [...new Array(this.points.length)].fill(false);
    const previous = [...new Array(this.points.length)].fill(null);
    const result  = [];
    const queue = new Queue();
    
    visited[start] = true;
    queue.push(start);
    while (!queue.isEmpty) {
      const top = queue.pop();
      
      // call me callback ;)
      result.push(top);
      for (const neighbour of this.neighbours(top).keys()) {
        if (!visited[neighbour]) {
          visited[neighbour] = true;
          previous[neighbour] = top;
          queue.push(neighbour);
        }
      }
    }
    
    return {result, visited, previous};
  }
  
  addDrawingPointsForLanes(start = 0) {
    const bfs = this.adaptedBfs(start);
    let sum = 0;

    for (const pair of this.getAllEdges()) {
      const {start, end} = pair.data;
      const previous = bfs.previous[start];
      
      console.log(previous, start, end);
    }
    
    for (const pair of this.getAllEdges()) {
      
    }
    
    for (let vertex = 0; vertex < this.points.length; vertex++) {
      if (bfs.previous[vertex] === null) {
        continue;
      }
    
      // console.log(`Previous: ${bfs.previous[vertex]}, Current: ${vertex}`);

      const previous = this.getEdge(bfs.previous[vertex], vertex).head.data;
      const after = this.vertexEdges(vertex);
      //console.log('Next:', after);
      for (const [_, lanes] of after) {
        const DISTANCE = 10;
        const angle = fixDecimals(
            angleBetween2DVectors(
              segmentToVector({start: previous.start, end: previous.end}),
              segmentToVector({start: lanes.head.data.start, end: lanes.head.data.end})
            ),
            2
          );
          
        /*
          TODO
          - get the half angle
          - get point at a distance X from it, and slope of that angle starting
            from vertex point
          - add startings/ending !!!!!
          - create new Road with known properties
          - push road
          - check in the end for lanes that do not have endings/startings (there should
            be none I think)
        */
        
        const slope = fixDecimals(angle / 2, 2);
        const {x, y} = previous.end;

        const newPoint = point2D(
          x + DISTANCE * Math.cos(slope),
          y + DISTANCE * Math.sin(slope)
        );
        
        // console.log('new point location on canvas:', newPoint, this.points[vertex], vertex);
        
        window.globalContext.fillStyle = '#255255';
        window.globalContext.fillRect(newPoint.x, newPoint.y, 3, 3);
        sum++;
    /*    console.log(previous, lanes.head.data);
        console.log('Angle: ', angle);*/
      }
    }
    console.log('Points drawn', sum);
  }
  
  drawRoads() {
    for (let vertex = 0; vertex < this.points.length; vertex++) {
      const roadLanes = this.vertexEdges(vertex);
      
      for (const [_, lanes] of roadLanes) {
        // _ is the key, named this way because there is
        // no need for it here
        if (lanes.size === 0) {
          continue;
        }

        const generator = lanes.generate();
        let currentLane = generator.next();
        
        while (currentLane.done === false) {
          currentLane.value.data.draw();
          currentLane = generator.next();
        }
      }
    }
  }

  debug() {
    console.log('Debugging: ');
    console.log('First key in a map: ', this.reversedList[1].keys().next().value)
  }

  updateCars() {
    for (let vertex = 0; vertex < this.points.length; vertex++) {
      const roadLanes = this.vertexEdges(vertex);
      
      for (const [neighborVertex, lanes] of roadLanes) {
        if (lanes.size === 0) {
          continue;
        }

        const generator = lanes.generate();
        let currentLane = generator.next();
        
        while (currentLane.done === false) {
          const lane = currentLane.value.data;
          const {start, end, drawingPoints} = lane;

          lane.adaptSpeed();
          for (const car of lane.cars) {
            car.draw(lane.slope, lane.lanesInfo);
  
            if (!testForPointInSegment(car.position, drawingPoints)) {
              lane.deleteCar(car);
              if (this.vertexEdgesNumber(neighborVertex) > 0) {
                const nextVertex = this.getRandomEdge(neighborVertex);
                const nextRoad = this.getEdge(neighborVertex, nextVertex);
                const nextLane = nextRoad.head.data;
                
                car.position = nextLane.start;
                nextLane.addCar(car);
              }
            }
          }

          currentLane = generator.next();
        } 
      }
    }
  }
}

export default RoadSystem;