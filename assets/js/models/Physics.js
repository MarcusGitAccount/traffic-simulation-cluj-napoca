'use strict';

//  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
// class to hold all the forces that apply to
// a car while moving

import {default as Vector} from './Vector2D.js';

class Forces {
  constructor() {
    this.velocity = new Vector();
    this.constants = {
      // define constants such as direction, drag etc..
    };
  }
  
  get speed() {
    return this.velocity.absoluteValue;
  }
}

export default Forces;