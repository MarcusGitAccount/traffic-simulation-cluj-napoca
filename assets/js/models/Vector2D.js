'use strict';

//  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ

export default class Vector2D {
  /*
    @param origin: point2D {x, y}
    @param magnitude: Number
    @param direction: Object, {i, j}
  */
  constructor(origin, magnitude, direction) {
    this.origin = origin;
    this.magnitude = magnitude;
    this.direction = direction;
  }
  
  get absoluteValue() {
    return Math.sqrt(
      Math.pow(this.direction.i, 2),
      Math.pow(this.direction.j, 2)
    );
  }
  
  /*
    @params start, end: point2D {x, y}
  */
  static vectorFromSegment(start, end) {
    //this.constructor(start, end, {i: 1, j: 3});
    

    return this;
  }
}