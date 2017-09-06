'use strict';

function startEnd(x, y) {
  return {x, y};
}

function getRequestAnimationFrameFunction() {
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame  ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);      
          }; 
}

export {startEnd, getRequestAnimationFrameFunction};