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

class Road {
  constructor(position, next, options = null, direction = 'up') {
    this.scale = 10;
    this.position = position;
    this.options = options;
    this.next = next;
    this.direction = 'up';
  }
}

class Car {
  constructor(road) {
    this.scale = 10;
    this.road = road;
    this.timestamp = 1000;
  }
}

class timestampInterval {
  constructor(value, low, high) {
    this.value = value;
    this.low = low;
    this.high = high;
    this.finished = false;
  }
  
  get inLimits() {
    if (this.value >= this.low && this.value <= this.high)
      return true;
    return false;
  }
}


function startEnd(x, y) {
  return {x, y};
}

function init() {
  canvas.width = 1000;
  canvas.height = 750;
  
  context.strokeStyle = '#000';
  
  window.fetch(`${window.location.origin}/api/points`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.log(error));
  
  const roadCoordinates = [
    startEnd(10, 10), startEnd(10, 30), startEnd(10, 50), startEnd(10, 70),
    startEnd(10, 90), startEnd(10, 110), startEnd(10, 130), startEnd(10, 150), 
    startEnd(10, 170), startEnd(10, 190), startEnd(10, 210), startEnd(10, 230), 
  ];
  
  const roadPieces = ((coords) => {
    const result = [];
    
    for (let index = 0; index < coords.length - 1; index++) {
      result.push(new Road(coords[index], coords[index + 1]));
    }
    
    result.push(new Road(coords[coords.length - 1], null));
    return result;
  })(roadCoordinates);
  
  for (const piece of roadPieces)
    context.strokeRect(piece.position.x, piece.position.y, piece.scale, piece.scale);
  
  window.requestAnimFrame(step);
}

let alertTimestamp = false;

function step(timestamp) {
  if (Math.floor(timestamp) >= 2000 && Math.floor(timestamp) <= 2500 && !alertTimestamp) {
    alertTimestamp = true;
    alert('hi');
  }
  
  window.requestAnimFrame(step);

}

init();