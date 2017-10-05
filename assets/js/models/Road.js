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

/*[
  {lat: 46.773781379807524,lng: 23.58806787222754},
  {lat: 46.77488095105854, lng: 23.589667275956423},
  {lat: 46.77488095105854, lng: 23.589667275956423},
  {lat: 46.775623000948556,lng: 23.59058520784507},
  {lat: 46.775623000948556,lng: 23.59058520784507},
  {lat: 46.77471540405222, lng: 23.59181175856475},
  {lat: 46.77471540405222,lng: 23.59181175856475},
  {lat: 46.77429367376812,lng: 23.592295011235933},
  {lat: 46.77471540405222,lng: 23.59181175856475},
  {lat: 46.77419829442854,lng: 23.592122984174388},
  {lat: 46.77429367376812,lng: 23.592295011235933},
  {lat: 46.77419829442854,lng: 23.592122984174388},
  {lat: 46.77488095105854,lng: 23.589667275956423},
  {lat: 46.77411916855766,lng: 23.590376558733723},
  {lat: 46.77419829442854,lng: 23.592122984174388},
  {lat: 46.77411916855766,lng: 23.590376558733723},
  {lat: 46.77411916855766,lng: 23.590376558733723},
  {lat: 46.77370555612028,lng: 23.58821318920320}
]
*/
'use strict';

import {distanceBetween2DPoints, point2D, getLanesDividers} from './Utils.js';
import {default as LinkedList} from './LinkedList.js';
const _slope = Symbol('_slope');

const defaultDrawingOptions = {strokeColor: 'grey', lineWidth: 4};
const defaultLanesInfo = {numberOfLanes: 1, size: 4};

class Road {
  constructor(start, end, coords, drivingOptions, lanesInfo = defaultLanesInfo, drawingOptions = defaultDrawingOptions) {
    this.start = start; // x, y
    this.end = end;
    this.drawingPoints = {start, end};
    this.coords = coords;
    this.distance = Math.floor(distanceBetween2DPoints(start, end));
    this.lanesInfo = lanesInfo; /*
      Example: this.lanesInfo: {
        numberOfLanes: 4,
        size: 5
      }
    */
    this.lanesInfo['startingPoints'] = new LinkedList();
    this.lanesInfo['endingPoints'] = new LinkedList(); 
    this.lanesInfo['dividers'] = [-4, -2, 2, 4];// getLanesDividers(this.lanesInfo.numberOfLanes);
    this.drawingOptions = drawingOptions;
    this.angleForCar = null;
    this.cars = []; //[...new Array(this.lanesInfo)];
    this.drivingOptions = drivingOptions;
    this[_slope] = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
  }
  
  addCar(car, lane) {
    if (this.drivingOptions && this.drivingOptions.speedLimit < car.velocity)
      car.velocity = this.drivingOptions.speedLimit;
    this.cars.push(car);
  }
  
  deleteCar(car) {
    this.cars.splice(this.cars.indexOf(car), 1);
  }

  draw() {
    window.globalContext.beginPath();
    window.globalContext.strokeStyle = this.drawingOptions.strokeColor;
    window.globalContext.lineWidth = 1;//this.lanesInfo.size * this.lanesInfo.numberOfLanes;
    window.globalContext.moveTo(this.drawingPoints .start.x, this.drawingPoints.start.y);
    window.globalContext.lineTo(this.drawingPoints .end.x, this.drawingPoints.end.y);
    window.globalContext.stroke();

    window.globalContext.beginPath();
    window.globalContext.strokeStyle = 'pink';
    window.globalContext.lineWidth = 1;
    window.globalContext.moveTo(this.drawingPoints.start.x, this.drawingPoints.start.y);
    window.globalContext.lineTo(this.drawingPoints.end.x, this.drawingPoints.end.y);
    window.globalContext.stroke();

    // this.drawParallelLine(10);
    
/*  for (const divider of this.lanesInfo.dividers) {
      this.drawParallelLine(this.lanesInfo.size * divider); 
    }*/
  }
  
  drawParallelLine(distance) {
    const parallelSlope = -Math.pow(this.slope, -1);
    const update = (point, slope) => {
      return point2D(
        point.x + distance * Math.cos(slope),
        point.y + distance * Math.sin(slope)
      );
    };
    const start = update(this.start, parallelSlope);
    const end   = update(this.end, parallelSlope);
    
    window.globalContext.beginPath();
    window.globalContext.strokeStyle = '#FF0080';
    window.globalContext.lineWidth = 1;
    window.globalContext.moveTo(start.x, start.y);
    window.globalContext.lineTo(end.x, end.y);
    window.globalContext.stroke();
  }
  
  get minimumCarVelocity() {
    let _min = 999;
    
    for (const car of this.cars)
      if (car.velocity < _min)
        _min = car.velocity;
        
    return _min;
  }
  
  adaptSpeed() {
    for (let index = 0; index < this.cars.length; index++) {
      const _min = this.minimumCarVelocity;
      
      if (this.cars[index].velocity !== this.minimumCarVelocity)
        this.cars[index].velocity = _min;
      else if (this.cars[index].maxSpeed < this.drivingOptions.maxSpeed)
        this.cars[index].velocity += .1;
      else if (this.cars[index].maxSpeed > this.drivingOptions.maxSpeed)
        this.cars[index].velocity -= .55;
    }
  }
  
  get slope() {
    return this[_slope];
  }
}
export default Road;