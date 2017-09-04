'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


window.requestAnimFrame = (() => {
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame  ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);      
          }; 
})();