'use strict';

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
  
export {
  point2D, distanceBetween2DPoints,
  getRequestAnimationFrameFunction, 
  vector2D, angleBetween2DVectors, segmentToVector,
  degreesToRad, radToDegrees
};