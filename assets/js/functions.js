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
  constructor(position, next, options = null, drawingOptions = {lineWidth: 1}, direction = 'up') {
    this.scale = 10;
    this.position = position;
    this.options = options;
    this.next = next;
    this.direction = 'up';
    this.drawingOptions = drawingOptions;
  }
}

const _road = Symbol('_road');

class Car {
  constructor(road, interval, context, drawingOptions = {color: 'red', lineWidth: 1}) {
    this[_road] = road;
    this.context = context;
    this.drawingOptions = drawingOptions;
    this.elapsed = 0;
    this.interval = interval;
  }
  
  get scale() {
    return this.road.scale - 2 * (this.road.drawingOptions.lineWidth || 1);
  }
  
  get road() {
    return this[_road];
  }
  
  set road(updatedRoadPiece) {
    this.deleteFromCanvas({x: this[_road].position.x + this[_road].drawingOptions.lineWidth, y: this[_road].position.y + this[_road].drawingOptions.lineWidth}, this.scale);
    this[_road] = updatedRoadPiece;
    this.updateToCanvas({x: this[_road].position.x + this[_road].drawingOptions.lineWidth, y: this[_road].position.y + this[_road].drawingOptions.lineWidth}, this.scale);
  }
  
  deleteFromCanvas(position, scale) {
    this.context.clearRect(position.x, position.y, scale, scale);
  }
  
  updateToCanvas(position, scale) {
    this.context.fillStyle = this.drawingOptions.color;
    this.context.fillRect(position.x, position.y, scale, scale);
  }
  
  updateElapsed(delta, callback) {
    this.elapsed += delta;
    
    if (this.elapsed >= this.interval) {
      this.elapsed -= this.interval;
      callback();
    }
  }
}

class timestampInterval {
  constructor(low, high) {
    this.low = low;
    this.high = high;
    this.finished = false;
  }
  
  inLimits(value, callback) {
    if (value >= this.low && value <= this.high && !this.finished) {
      this.finished = true;
      callback();
    }
  }
}

function startEnd(x, y) {
  return {x, y};
}

function init() {
  canvas.width = 1000;
  canvas.height = 750;
  
  context.strokeStyle = '#000';
  /*
  window.fetch(`${window.location.origin}/api/points`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch
    (error => console.log(error));
  */
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
  const cars = [new Car(roadPieces[0], 1000, context)];

  for (const piece of roadPieces) {
    context.lineWidth = piece.drawingOptions.lineWidth || 1;
    context.strokeRect(piece.position.x, piece.position.y, piece.scale, piece.scale);
  }
  
  for (const car of cars) {
    let {x, y} = car.road.position;
    
    x += car.drawingOptions.lineWidth;
    y += car.drawingOptions.lineWidth;
    
    context.fillStyle = car.drawingOptions.color;
    context.fillRect(x, y, car.scale, car.scale, car.scale);
  }
  
  
  
  for (const piece of roadPieces) {
    window.setTimeout(() => cars[0].road = piece, 1000)
  }
  
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