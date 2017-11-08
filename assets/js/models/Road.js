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