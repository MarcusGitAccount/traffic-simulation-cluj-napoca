// Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ

'use strict';

import {point2D, multiplyVectorByScalar} from './Utils.js';
import VectorOperations from './Vector2D.js';
import {multiplyVectorByScalar} from './Utils.js';
import {default as environmentConstants} from '../constants.js';


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
    this.drawingOptions = drawingOptions;
    /* The following properties are there in order to calculate forces that apply to the car.*/
    
    this.environmentConstants = environmentConstants;
    
    this.carConstants = {
      frictionCoefficient: 0.3,
      frontalArea: 2.2, // square meters
      horsePower: 100,
      torque: 1, // Nm => Force * distance
      weight: 1000, // kg
      maxRpm: 7000 // max revolutions per minute
    };
    
    this.forces = {
      velocity: VectorOperations.nullVectorVersors(),
      traction: VectorOperations.nullVectorVersors(),
      airDrag:  VectorOperations.nullVectorVersors(),
      rollingResistance: VectorOperations.nullVectorVersors()
    };
  }

  get speed() {
    return this.forces.velocity.absoluteValue;
  }
  
  cdrag() {
    
  }
  
  fdrag() {
    
  }
  
  
  ftraction() {
    
  }
  
  get cbraking() {
    
  }
  
  fbraking() {
    const versors = this.forces.velocity.unitDownscale;
    
    return multiplyVectorByScalar(versors, this.cbraking);
  }
  
  
  flong() {
    const vl = this.forces.velocity.versors;
    const ad = this.forces.velocity.airDrag;
    const rr = this.forces.velocity.rollingResistance;
    
    const i  = vl.i + ad.i + rr.i;
    const j  = vl.j + ad.j + rr.j; 
    
    // resistance forces are in opposite directions from the traction
    // => at constast speeds the long force is 0
  
    return new Vector({i, j});
  }

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