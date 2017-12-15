// Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ

'use strict';

import {point2D} from './Utils.js';
import * as vop from './VectorsOperations.js';
import {default as environmentConstants} from '../constants.js';

const defaultDrawingOptions = {
  strokeColor: '#ff0000', 
  lineWidth: 2
};

class Car {
  constructor(id, units, velocity, roadConstants, drawingOptions = defaultDrawingOptions) {
    this.id = id;
    // scalar that is multiplied with the directions vector
    this.units = units;
    // traveled units on the road vector
    // each car is just a unit vector multiplied with a scalar
    // the unit vector of the coincides with the road's unit vector
    this.travelled = 0;
    // number of units to move at one frame interval
    this.drawingOptions = drawingOptions;
    /* The following properties are there in order to calculate forces that apply to the car.*/
    
    this.environmentConstants = environmentConstants;
    this.rpm = 1000;
    this.currentRoadConstants = roadConstants;

    this.carConstants = {
      frictionCoefficient: 0.3,
      frontalArea: 2.2, // square meters
      horsePower: 100,
      torque: 1, // Nm => Force * distance
      weight: 1000, // kg
      maxRpm: 7000 // max revolutions per minute
    };
    
    this.position = vop.zero();
    this.velocity = vop.zero();
  }
  // => to increase overall acceleration => you increase rpm

  get engineforce() {
    return this.carConstants.torque * this.rpm / 5252;
  }

  get speed() {
    // in rendering should be the 60th part(60 fps)
    return vop.norm(this.velocity);
  }
  
  get c_drag() {
    // https://en.wikipedia.org/wiki/Automobile_drag_coefficient
    // depends on the type of the car
    const {frictionCoefficient, frontalArea} = this.carConstants;
    const {rho} = this.environmentConstants;
    
    return .5 * frictionCoefficient * frontalArea * rho;
  }

  get c_braking() {}
  
  get c_rollingresistance() {
    return this.c_drag * 30;
  }

  fdrag() {
    return vop.multiply(
      this.velocity,
      -this.c_drag * this.speed
    );
  }
    
  ftraction() {
    return vop.multiply(
      vop.unit(this.velocity),
      this.engineforce
    );
  }
   
  fbraking() {
    return vop.multiply(
      vop.multiply(
        vop.unit(this.velocity), -1
      ),
      this.c_braking
    );
  }
  
  frollingresistance() {
    return vop.scalarMul(
      -this.c_rollingresistance,
      this.velocity
    );
  } 
  
  flong() {
    const vl = this.ftraction();
    const ad = this.fdrag();
    const rr = this.frollingresistance();
       
    // resistance forces are in opposite directions from the traction
    // => at constast speeds the long force is 0
  
    return vop.add(vl, ad, rr);
  }

  get acceleratation() {
    const F = vop.add(this.flong(), this.engineforce());

    return vop.multiply(this.flong(), 1 / this.weight);
  }

  update(timeDifference, callback = null) {
    this.position = vop.add(
      this.position,
      vop.multiply(this.velocity, timeDifference)
    );

    this.velocity = vop.add(
      this.velocity, 
      vop.multiply(this.acceleratation, timeDifference)
    );

    if (callback != null)
      callback.call(this);
  }

  updateToNewRoad(origin, unitvector) {
    this.origin = origin;
    this.unitVector = unitvector;
    this.traveled = 0;
  }
  
  draw(angle, roadLanesInfo) {
    const {x, y} = this.origin;
    const {i, j} = vop.multiply(this.positionVector, this.units);
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