'use strict';

/*defining symbols for private variables*/
import {point2D, randomInt} from './Utils.js';

const _road = Symbol('_road');
const _velocity = Symbol('_velocity');

const defaultDrawingOptions = {strokeColor: '#ff0000', lineWidth: 2};

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
    this.position = point2D(
      this.position.x + Math.cos(angle) * this.velocity,
      this.position.y + Math.sin(angle) * this.velocity
    );
  }

  draw(angle, roadLanesInfo) {
    const laneSlope = -Math.pow(angle, -1);
    
    this.updatePosition(angle);

    const {x, y} = point2D(
      this.position.x + Math.cos(laneSlope) * roadLanesInfo.size * roadLanesInfo.dividers[this.lane],
      this.position.y + Math.sin(laneSlope) * roadLanesInfo.size * roadLanesInfo.dividers[this.lane]
    );

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