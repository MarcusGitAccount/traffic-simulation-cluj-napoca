'use strict';

//  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
// class to hold all the forces that apply to
// a car while moving

import {default as Vector} from './Vector2D.js';

class Forces {
  constructor() {
    this.velocity  = new Vector();
    this.dragForce = new Vector();
    this.rollingResistance = new Vector();
    
    /*
      At low speeds the rolling resistance is the main resistance force,
      at high speeds the drag takes over in magnitude. At approx. 100 km/h
      (60 mph, 30 m/s) they are equal ([Zuvich]). This means Crr must be
      approximately 30 times the value of Cdrag
    */
    
    this.constants = {
      // define constants such as direction, drag, rolling resistancce etc..
      
    };
  }
  
  calculateDrag() {
    this.dragForce.versors = this.velocity.scalarMultiplication(/*...*/);
  }
  
  get speed() {
    return this.velocity.absoluteValue;
  }
  
  get flong() {
    const i = this.velocity.versors.i + this.dragForce.versors.i + this.rollingResistance.versors.i;
    const j = this.velocity.versors.j + this.dragForce.versors.j + this.rollingResistance.versors.j;
  
    // resistance forces are in opposite directions from the traction
    // => at constast speeds the long force is 0
  
    return new Vector(i, j);
  }
}

export default Forces;