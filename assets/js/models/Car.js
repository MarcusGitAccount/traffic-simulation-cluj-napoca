'use strict';

/*defining symbols for private variables*/
import {point2D} from './Utils.js';

const _road = Symbol('_road');

/*
class Car {
  constructor(road, interval, context, callback, drawingOptions = {color: 'red', lineWidth: 1}) {
    this.context = context;
    this.elapsed = 5000;
    this.updateValue = 2000;
    this.drawingOptions = drawingOptions;
    this.interval = interval;
    this.road = road;
    this.timeElapsedCallback = callback;
  }

  get scale() {
    return this.road.scale - 2 * (this.road.drawingOptions.lineWidth || 1);
  }

  get road() {
    return this[_road];
  }
 
  set road(updatedRoadPiece) {
    window.requestAnimationFrame((timestamp) => {
      if (this[_road])
        this.deleteFromCanvas();

      this[_road] = updatedRoadPiece;
      this.updateToCanvas();
    });
  }

  deleteFromCanvas() {
    let {x, y} = this[_road].position;
    const scale = this.scale;

    x += this[_road].drawingOptions.lineWidth;
    y += this[_road].drawingOptions.lineWidth;

    this.context.clearRect(x, y, scale, scale);
  }

  updateToCanvas() {
    let {x, y} = this[_road].position;
    const scale = this.scale;

    x += this[_road].drawingOptions.lineWidth;
    y += this[_road].drawingOptions.lineWidth;

    this.context.fillStyle = this.drawingOptions.color;
    this.context.fillRect(x, y, scale, scale);
  }

  updateElapsed(delta, callback) {
    this.elapsed += delta;

    if (this.elapsed >= this.interval) {
      this.elapsed = 0;

      if (callback) {
        callback();
        return ;
      }

      this.timeElapsedCallback();
    }
  }
}
*/

class Car {
  constructor(id, position, width, length, lane, velocity, type = null, drawingOptions = {strokeColor: '#ff0000'}) {
    this.id = id;
    this.width = width;
    this.length = length;
    this.lane = lane;
    this.velocity = velocity; // for both X and Y
    this.position = position;
    this.type = type;
    this.drawingOptions = drawingOptions;
  }
  
  draw(angle) {
    const {x, y} = this.position;
    const end = point2D(
      x + this.length * Math.cos(angle),
      y + this.width * Math.sin(angle)
    );

    window.globalContext.beginPath();
    window.globalContext.moveTo(x, y);
    window.globalContext.lineWidth = 5;
    window.globalContext.lineTo(end.x, end.y);
    window.globalContext.strokeStyle = this.drawingOptions.strokeColor;

    this.position = end;
  }
}

export default Car;