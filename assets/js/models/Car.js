'use strict';

/*defining symbols for private variables*/
import {point2D} from './Utils.js';

const _road = Symbol('_road');
const _velocity = Symbol('_velocity');

const defaultDrawingOptions = {strokeColor: '#ff0000', lineWidth: 5};


class Car {
  constructor(id, position, width, length, lane, velocity, specs, drawingOptions = defaultDrawingOptions) {
    this.id = id;
    this.width = width;
    this.length = length;
    this.lane = lane;
    this.velocity = velocity;
    this.position = position;
    this.specs = specs;
    this.drawingOptions = drawingOptions;
  }


  updatePosition(angle) {
    const {x, y} = this.position;
    
    this.position = {
      x: x + Math.cos(angle) * this.velocity,
      y: y + Math.sin(angle) * this.velocity
    };
  }

  draw(angle) {
    this.updatePosition(angle);

    const {x, y} = this.position;
    const end = point2D(
      x + this.length * Math.cos(angle),
      y + this.width * Math.sin(angle)
    );

    window.globalContext.beginPath();
    window.globalContext.moveTo(x, y);
    window.globalContext.lineWidth = this.drawingOptions.lineWidth;
    window.globalContext.strokeStyle = this.drawingOptions.strokeColor;
    window.globalContext.lineTo(end.x, end.y);
    window.globalContext.stroke();
  }
}

export default Car;