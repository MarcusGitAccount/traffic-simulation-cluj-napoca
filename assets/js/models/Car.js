// Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ

'use strict';

import {point2D, multiplyVectorByScalar} from './Utils.js';

const defaultDrawingOptions = {
  strokeColor: '#ff0000', 
  lineWidth: 2
};

class Car {
  constructor(id, units, velocity, drawingOptions = defaultDrawingOptions) {
    this.id = id;
    this.origin = this.unitVector = null;
    // scalar that is multiplied with the directions vector
    this.units = units;
    // traveled units on the road vector
    // each car is just a unit vector multiplied with a scalar
    // the unit vector of the coincides with the road's unit vector
    this.traveled = 0;
    // number of units to move at one frame interval
    this.velocity = velocity;
    this.drawingOptions = drawingOptions;
    /* The following properties are there in order to calculate forces that apply to the car.*/
    this.frictionCoefficient = 0.3;
    this.frontalArea = 2.2; // square meters
    
    //
    this.horsePower = 100;
    this.torque     = 1;
  }

  /*
    Dumb idea:
      Make the cars in a lane a graph.
  */

  updatePosition() {
    const {x, y} = this.origin;
    const {i, j} = multiplyVectorByScalar(this.positionVector, this.velocity);
    
    this.traveled += this.velocity;
    this.origin = point2D(x + i, y + j);
  }

  updateToNewRoad(origin, unitvector) {
    this.origin = origin;
    this.unitVector = unitvector;
    this.traveled = 0;
  }
  
  accelerate() {
    
  }
  
  decelerate() {
    
  }
  
  draw(angle, roadLanesInfo) {
    const {x, y} = this.origin;
    const {i, j} = multiplyVectorByScalar(this.positionVector, this.units);
    const end = point2D(
      x + i,
      y + j
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