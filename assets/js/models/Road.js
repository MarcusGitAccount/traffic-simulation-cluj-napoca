/*
  {lat: 46.773777343799175, lng: 23.588075637817383}
  {lat: 46.77562532713712, lng: 23.590580821037292}
  {lat: 46.77562532713712, lng: 23.590580821037292}
  {lat: 46.774710528202135, lng: 23.591803908348083}
  {lat: 46.77429169940724, lng: 23.592286705970764}
  {lat: 46.773696516042655, lng: 23.588220477104187}
  {lat: 46.774192502636616, lng: 23.59211504459381}
  {lat: 46.77467378896449, lng: 23.59185755252838}
  {lat: 46.77411534946648, lng: 23.59037697315216}
  {lat: 46.77486850663835, lng: 23.58968496322632}
*/

'use strict';

import {radToDegrees} from './Utils.js';

const _slope = Symbol('_slope');

class Road {
  constructor(start, end, distance, lane, isMockup = false, drawingOptions = null) {
    this.start = start; // x, y
    this.end = end;
    this.distance = distance; // m
  //  this.lanes = lane.number;
  //  this.laneWidth = lane.width ;
    this.isMockup = isMockup;
    this.drawingOptions = drawingOptions;
    this.angleForCar = null;
    this.cars = [];
    this[_slope] = null;
  }
  
  addCar(car) {
    this.cars.push(car);
  }
  
  deleteCar(car) {
    this.cars.splice(this.cars.indexOf(car), 1);
  }
  
  draw() {
    window.globalContext.beginPath();
    window.globalContext.moveTo(this.start.x, this.start.y);
    window.globalContext.lineTo(this.end.x, this.end.y);
    window.globalContext.stroke();
  }
  
  get slope() {
    if (!this[_slope])
      this[_slope] = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
      
    return this[_slope];
  }
}

export default Road;