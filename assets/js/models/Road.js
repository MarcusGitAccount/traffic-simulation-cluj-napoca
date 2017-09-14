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

import {radToDegrees, distanceBetween2DPoints} from './Utils.js';

const _slope = Symbol('_slope');

const defaultDrawingOptions = {strokeColor: '##eee', lineWidth: 1};

class Road {
  constructor(start, end, drivingOptions, lane, drawingOptions = defaultDrawingOptions) {
    this.start = start; // x, y
    this.end = end;
    this.distance = distanceBetween2DPoints(start, end);
    this.drawingOptions = drawingOptions;
    this.angleForCar = null;
    this.cars = [];
    this.drivingOptions = drivingOptions;
    this[_slope] = null;
  }
  
  addCar(car) {
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
    window.globalContext.lineWidth = this.drawingOptions.lineWidth;
    window.globalContext.moveTo(this.start.x, this.start.y);
    window.globalContext.lineTo(this.end.x, this.end.y);
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
    if (!this[_slope])
      this[_slope] = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
      
    return this[_slope];
  }
}
export default Road;