'use strict';

import {distanceBetween2DPoints, point2D, segmentToVector, unitVector} from './Utils.js';
import {default as LinkedList} from './LinkedList.js';
const _slope = Symbol('_slope');

const defaultDrawingOptions = {strokeColor: 'grey', lineWidth: 4};
const defaultLanesInfo = {numberOfLanes: 1, size: 4};

class Road {
  constructor(start, end, coords, drivingOptions, lanesInfo = defaultLanesInfo, drawingOptions = defaultDrawingOptions) {
    this.start = start; // x, y
    this.end = end;
    this.coords = coords;
    this.drawingPoints = {start, end};
    
    this.origin = start;
    this.distance = Math.floor(distanceBetween2DPoints(start, end));
    this.positionVector = segmentToVector({start, end});
    this.absoluteValue  = Math.sqrt(
      this.positionVector.i * this.positionVector.i + 
      this.positionVector.j * this.positionVector.j
    );
    this.unitVector = unitVector(this.positionVector);
    this.slope= Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);

    this.lanesInfo = lanesInfo; 
    this.cars = [];
    this.drawingOptions = drawingOptions;
    this.drivingOptions = drivingOptions;
  }
  
  addCar() {

  }
  
  deleteCar(car) {
  }

  draw() {
    window.globalContext.beginPath();
    window.globalContext.strokeStyle = this.drawingOptions.strokeColor;
    window.globalContext.lineWidth = 1;
    window.globalContext.moveTo(this.drawingPoints .start.x, this.drawingPoints.start.y);
    window.globalContext.lineTo(this.drawingPoints .end.x, this.drawingPoints.end.y);
    window.globalContext.stroke();

    window.globalContext.beginPath();
    window.globalContext.strokeStyle = 'pink';
    window.globalContext.lineWidth = 1;
    window.globalContext.moveTo(this.drawingPoints.start.x, this.drawingPoints.start.y);
    window.globalContext.lineTo(this.drawingPoints.end.x, this.drawingPoints.end.y);
    window.globalContext.stroke();

  }
}

export default Road;