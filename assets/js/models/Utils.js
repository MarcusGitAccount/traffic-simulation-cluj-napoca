'use strict';

import {default as BinaryHeap} from './BinaryHeap.js';

function point2D(x, y) {
  return {x, y};
}

function vector2D(i, j) {
  const newObject = {i, j};
  const modulo = function() {
    return Math.sqrt(this.i * this.i + this.j * this.j);
  };
  
  Object.defineProperty(newObject, 'modulo', {
    configurable: false,
    get: modulo
  });
  
  return newObject;
}

function segmentToVector(start, end) {
  return vector2D(end.x - start.x, end.y - start.y);
}

function degreesToRad(angle) {
  return angle * Math.PI / 180;
}

function radToDegrees(angle) {
  return angle * 180 / Math.PI;
}

function angleBetween2DVectors(a, b) {
  return Math.acos(
    (a.i * b.i + a.j * b.j) / (a.modulo * b.modulo)
  ); // rads
}

function getRequestAnimationFrameFunction() {
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame  ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);      
          }; 
}

function distanceBetween2DPoints(start, end) {
	return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}
  
function segmentSlope(start, end) {
  return (end.y - start.y) / (end.x - start.x);
}

function determinant2(input) {
  return input[0][0] * input[1][1] - input[0][1] * input[1][0];
}

function determinant3(input) {
  /*
    0,0 0,1 0,2
    1,0 1,1 1,2
    2,0 2,1 2,2
  */
  
  return (
    input[0][0] * input[1][1] * input[2][2] +
    input[0][1] * input[1][2] * input[2][0] +
    input[1][0] * input[2][1] * input[0][2] - 
    input[2][0] * input[1][1] * input[0][2] - 
    input[0][0] * input[2][1] * input[1][2] - 
    input[2][2] * input[1][0] * input[0][1]
  );
}

function testForColiniarity(A, B, C) {
  const result = determinant3([
    [A.x, A.y, 1],
    [B.x, B.y, 1],
    [C.x, C.y, 1],
  ]);
  
  return checkIfCloseAFToZero(result); 
}

function checkIfCloseAFToZero(value) {
  return Math.abs(value) < 1e-10;
}

function fixDecimals(nbr, points) {
	const phase = Math.pow(10, points);

	return Math.floor(nbr * phase) / phase;
}

function testForPointInSegment(point, segment) {
  const firstDistance = distanceBetween2DPoints(point, segment.start) + distanceBetween2DPoints(point, segment.end);
  const secondDistance = distanceBetween2DPoints(segment.start, segment.end);
  
  return fixDecimals(firstDistance, 8) === fixDecimals(secondDistance, 8);
}

function latLngToCanvasXY(coords, bounds, canvasDimensions) {
  // console.log(coords, bounds, canvasDimensions)
  
  return point2D(
    Math.floor(((coords.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) *  canvasDimensions.width),
    Math.floor(((coords.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * canvasDimensions.height)
  );
}

function randomInt(min, max) {
  if (max === 0 && min === max)
    return -1;
  
  return Math.floor(Math.random() * (max - min) + min);
}

function addHeapsortToPrototype() {
  Array.prototype.heapsort = function(cmp) {
    const heap = new BinaryHeap((parent, child) => parent < child);
    const result = [];
    
    heap.insert(...this);
    while (heap.size > 0) {
      result.push(heap.pop());
    }
    
    return result;
  };
}


export {
  point2D, distanceBetween2DPoints,
  getRequestAnimationFrameFunction, 
  vector2D, angleBetween2DVectors, segmentToVector,
  degreesToRad, radToDegrees,
  segmentSlope, testForColiniarity, testForPointInSegment,
  latLngToCanvasXY, randomInt,
  addHeapsortToPrototype
};