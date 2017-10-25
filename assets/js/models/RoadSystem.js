/*
  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
*/

'use strict';

import {default as Queue} from './Queue.js';
import {default as Road} from './Road.js';
import {default as Multigraph} from './Multigraph.js';
import {default as Multigraph2} from './Multigraph2.js';
import {default as LinkedList} from './LinkedList.js';
import {
  randomInt, testForPointInSegment, segmentToVector, 
  angleBetween2DVectors, fixDecimals, point2D, radToDegrees,
  bisectingVector
} from './Utils.js';

class RoadSystem extends Multigraph2 {
  constructor(points) {
    super();
    this.points = points;
    this.reversedList = {};
    this.reversedList['getEdge'] = (start, end) => {
      return this.reversedList[start].get(end);
    };
    this.laneCoords = [];
    this.upsDownsCoords = [];
  }
  
  getPointForReversed(point, distance, slope) {
    return point2D(
      fixDecimals(point.x + distance * Math.cos(slope), 2),
      fixDecimals(point.y + distance * Math.sin(slope), 2)
    );
  }
  
  reversedRoad(road, leaving = false) {
    return new Road(
      road.end, 
      this.getPointForReversed(road.end, -road.distance, road.slope), 
      road.coords, road.drivingOptions, road.lanesInfo
    );
  }

  createReversed() {
    this.vertices.forEach(vertex => {
      this.reversedList[vertex] = new Map();
    });
  }
  
  addReversedEdge(firstVertex, secondVertex, weight) {
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

  // overriding/enhancing some methods
  addEdge(a, b, weight) {
    super.addEdge(a, b, weight);
  }
  
  // @params: start: {prev, current}
  createUpsDownsCoords(start) {
    const upsDownsList = [];
    const dfsResult = this.__dfs(start.prev, start.current);
    
    const absoluteValue = (value) => {
      const {i, j} = value;
      
      return Math.sqrt(i * i + j * j);
    };
    
    for (const anglePoints of dfsResult) {
      const {previous, current, next} = anglePoints;
      
      const comingEdge  = this.getEdge(previous, current).generate().next().value.data;
      const leavingEdge = this.getEdge(current, next).generate().next().value.data;
    
      const previousVector = segmentToVector({start: comingEdge.start,  end: comingEdge.end});
      const afterVector    = segmentToVector({start: leavingEdge.start, end: leavingEdge.end});
      const bisection      = bisectingVector(previousVector, afterVector, false, 10);

      console.log('bisection\'s position vector:', bisection);
      console.log('bisection\'s absolute value:', fixDecimals(absoluteValue(bisection), 2));
 
      upsDownsList.push({
        verticesPair: [previous, current], 
        up: comingEdge.end,
        down: point2D(comingEdge.end.x + bisection.i, comingEdge.end.y + bisection.j)
      });
      
      // console.log(previous, current, next, fixDecimals(radToDegrees(angle) / 2, 2));
    }
    
    console.log(upsDownsList);
    return upsDownsList;
  }
  
  setup(start) {
    const upsDownsCoords = this.createUpsDownsCoords(start);
    
    for (const pair of upsDownsCoords) {
      const [startVertex, endVertex] = this.up
      
      console.log(this.getEdge());
    }
  }
  
  /*drawUpsDowns() {
    for (const pair of this.upsDownsCoords) {
      const {up, down} = pair;

      //window.globalContext.fillStyle = 'orange';
      //window.globalContext.fillRect(up.x, up.y, 5, 5);
      window.globalContext.fillStyle = 'cyan';
      window.globalContext.fillRect(down.x, down.y, 2, 2);

      window.globalContext.beginPath();
      window.globalContext.lineWidth = 2;
      window.globalContext.moveTo(up.x, up.y);
      window.globalContext.lineTo(down.x, down.y);
      window.globalContext.stroke();

    }
  }*/
  
  addLanes(startingPoint = 0) {
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
    this.addDrawingPointsForLanes(startingPoint);
    for (const pair of this.getAllEdges()) {
      if (pair.data.end) {
        let {start, end} = pair.data;
        const edge = this.getEdge(start, end).head.data;
        let {startingPoints, endingPoints, angleStart, angleEnd} = edge.lanesInfo;

        /*console.log('vertices', start, end);
        console.log(startingPoints.length, endingPoints.length);
        console.log(edge);*/

        let startIterator = startingPoints.head;
        let endIterator   = endingPoints.head;
        
        angleStart = fixDecimals(radToDegrees(angleStart), 2);
        angleEnd   = fixDecimals(radToDegrees(angleEnd),   2);
        console.log(`${start} -> ${end}`);
        console.log(startingPoints.length, endingPoints.length);
        start = parseInt(start, 10);
        while (startIterator) {
          const newEdge = new Road(
            startIterator.data,
            endIterator.data,
            edge.coords,
            {maxSpeed: 1}
          );
          
          console.log(startIterator.data, endIterator.data, angleStart, angleEnd);
          this.addEdge(start, end, newEdge);

          startIterator = startIterator.next;
          endIterator   = endIterator.next;
        }
      }
    }
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
  
  createNewPoint(point, distance, slope) {
    const {x, y} = point;
    return point2D(
      fixDecimals(x + distance * Math.cos(slope), 2),
      fixDecimals(y + distance * Math.sin(slope), 2)
    );
  }
  
  addDrawingPointsForLanes(start = 0) {
    /*
      For you from the next day: DRY, u dummie.
      Clean this mess, please. Thanks.0
       
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

  for (const pair of this.getAllEdges()) {
    const {start, end} = pair.data;

    if (!this.reversedList[start])
      continue;
      
    if (this.reversedList[start].size === 0) {
      const after    = this.getEdge(start, end).head.data;
      const distance = after.lanesInfo.size;
      const meetingPoint = after.start;
      
      if (after.lanesInfo.startingPoints.length === 0) 
        for (let index = 0; index < after.lanesInfo.numberOfLanes - 1; index++) {
          const point = this.createNewPoint(meetingPoint, index * distance, Math.PI / 2);
          after.lanesInfo.startingPoints.add(point);
        }
    }

    for (const previousVertex of this.reversedList[start].keys()){
      let angle, meetingPoint, slope;
  
      angle = Math.PI / 2;
      if (!end) {
        meetingPoint = this.getEdge(previousVertex, parseInt(start, 10)).head.data.end;
      }
      else {
        const previous = this.getEdge(previousVertex, parseInt(start, 10)).head.data;
        const after    = this.getEdge(start, end).head.data;
        const previousVector = segmentToVector({start: previous.start, end: previous.end});
        const afterVector = segmentToVector({start: after.start, end: after.end});
        
        
        meetingPoint = previous.end;
        angle = fixDecimals(angleBetween2DVectors(previousVector, afterVector), 2);
      }

      slope = fixDecimals(angle / 2, 2);
      if (previousVertex) {
        const previous = this.getEdge(previousVertex, parseInt(start, 10)).head.data;
        const distance = previous.lanesInfo.size;
        
        if (previous.lanesInfo.endingPoints.length === 0)
          for (let index = 0; index < previous.lanesInfo.numberOfLanes - 1; index++) {
            const point = this.createNewPoint(meetingPoint, (index + 1) * distance, slope);
            previous.lanesInfo.angleEnd = slope;
            previous.lanesInfo.endingPoints.add(point);
          }
      }
      
      if (end) {
        const after    = this.getEdge(start, end).head.data;
        const distance = after.lanesInfo.size;
        
        if (after.lanesInfo.startingPoints.length === 0)
          for (let index = 0; index < after.lanesInfo.numberOfLanes - 1; index++) {
            const point = this.createNewPoint(meetingPoint, (index + 1) * distance, slope);
            after.lanesInfo.angleStart = slope;
            after.lanesInfo.startingPoints.add(point);
          }
        }
      }
    }
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
        /*
          Better and cleaner way to do it: 
          (i leave the previous one here tho, it's fancier:)
          
          for (const item of lanes.generate())
            item.data.draw();
        */
      }
    }
  }

  debug() {}

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
          const {drawingPoints} = lane;

          lane.adaptSpeed();
          for (const car of lane.cars) {
            car.draw(lane.slope, lane.lanesInfo);
  
            if (!testForPointInSegment(car.position, drawingPoints)) {
              lane.deleteCar(car);
              if (this.vertexEdgesNumber(neighborVertex) > 0) {
                const nextVertex = this.getRandomEdge(neighborVertex);
                const nextRoad   = this.getEdge(neighborVertex, nextVertex);
                const nextLane   = nextRoad.head.data;
                
                if (nextVertex !== ~neighborVertex) {
                  car.position = nextLane.start;
                  nextLane.addCar(car);
                }
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