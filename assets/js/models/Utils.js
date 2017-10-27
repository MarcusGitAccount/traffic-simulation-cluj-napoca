'use strict';

import {default as BinaryHeap} from './BinaryHeap.js';

function point2D(x, y) {
  return {x, y};
}

function vector2D(i, j, distance) {
  const newObject = {i, j};
  const absoluteValue = function() {
    return Math.sqrt(this.i * this.i + this.j * this.j);
  };
  
  Object.defineProperty(newObject, 'absoluteValue', {
    configurable: false,
    get: absoluteValue
  });
  
  return newObject;
}

function segment(start, end) {
  return {start, end};
}

function segmentToVector(segment, distance) {
  const {start, end} = segment;
  
  if (!distance) {
    distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - end.x, 2));
  }
  
  return vector2D(end.x - start.x, end.y - start.y, distance);
}

function degreesToRad(angle) {
  return angle * Math.PI / 180;
}

function radToDegrees(angle) {
  return angle * 180 / Math.PI;
}


// @param: vector, Object, {i, j, modulo<get>} (vector2D)
function unitVector(vector) {
  let {i, j} = vector;
  const absoluteValue = Math.sqrt(i * i +  j * j);
  const unitDownscale = 1 / absoluteValue;
  
  i *= unitDownscale;
  j *= unitDownscale;
  
  return {i, j};
}

function addTwoVectors(a, b) {
  return {
    i: a.i + b.i,
    j: a.j + b.j
  };
}

function multiplyVectorByScalar(vector, scalar) {
  return {
    i: vector.i * scalar,
    j: vector.j * scalar
  };
}

function bisectingVector(vectorA, vectorB, areOpposite = false, scalar = 1) {
  const unitA = unitVector(vectorA);
  const unitB = unitVector(multiplyVectorByScalar(vectorB, areOpposite ? 1 : -1));
  const result = multiplyVectorByScalar(addTwoVectors(unitA, unitB), 0.5);

  return multiplyVectorByScalar(unitVector(result), scalar);
}

function angleBetween2DVectors(a, b) {
  if (b.absoluteValue && b.absoluteValue == 0)  
    throw new Error('Division by zero.');
  
  return Math.acos(
    (a.i * b.i + a.j * b.j) / (a.absoluteValue * b.absoluteValue)
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

function fixDecimals(nbr, points = 0) {
	const phase = Math.pow(10, points);

	return Math.floor(nbr * phase) / phase;
}

function testForPointInSegment(point, segment) {
  const firstDistance = distanceBetween2DPoints(point, segment.start) + distanceBetween2DPoints(point, segment.end);
  const secondDistance = distanceBetween2DPoints(segment.start, segment.end);
  
  return fixDecimals(firstDistance, 8) === fixDecimals(secondDistance, 8);
}

function latLngToCanvasXY(coords, bounds, canvasDimensions, canvasOffset = point2D(0, 0)) {
  const {width, height} = canvasDimensions;
  
  return point2D(
    Math.floor(((coords.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width) + canvasOffset.x,
    Math.floor(((coords.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height) - canvasOffset.y
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
    while (!heap.empty) {
      result.push(heap.pop());
    }
    
    return result;
  };
}

function getLanesDividers(size) {
  let difference = Math.floor(size / 2);
  const result = [];

  if (size % 2 === 0)
    difference -= .5;

  for (let index = 0; index < size; index++)
    result.push(index - difference);
    
  return result;
}

function getLanesDividersImproved(size, width) {
  let difference = Math.floor(size / 2);
  const result = [];

  if (size % 2 === 0)
    difference -= .5;

  for (let index = 0; index < size; index++)
    result.push(index - difference);
    
  return result;
}

function intDivision(a, b) {
  return (a - (a % b)) / b;
}

export {
  point2D, distanceBetween2DPoints,
  getRequestAnimationFrameFunction, 
  vector2D, angleBetween2DVectors, segmentToVector,
  degreesToRad, radToDegrees,
  segmentSlope, testForColiniarity, testForPointInSegment,
  latLngToCanvasXY, randomInt,
  addHeapsortToPrototype,
  getLanesDividers, getLanesDividersImproved,
  intDivision, fixDecimals, segment, bisectingVector, addTwoVectors,
  multiplyVectorByScalar
};