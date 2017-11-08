'use strict';

//  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
export default class Vector2D {
  constructor(i = 0, j = 0) {
    this.versors.i = i;
    this.versors.j = j;
  }

  scalarMultiplication(scalar) {
    this.versors.i *= scalar;
    this.versors.j *= scalar;
  
    return this.versors;
  }
  
  set origin(point) {
    this.origin = point;
  }

  get absoluteValue() {
    const {i, j} = this.versors;
    
    return Math.sqrt(i * i + j * j);
  }
  
  static segmentToVector(segment) {
    const i = segment.end.x - segment.start.x;
    const j = segment.end.y - segment.start.y;
    
    return {i, j};
  }
  
  static unitVector(vector = this.versors) {
    let {i, j} = vector;
    const absoluteValue = Math.sqrt(i * i +  j * j);
    const unitDownscale = 1 / absoluteValue;
    
    i *= unitDownscale;
    j *= unitDownscale;
    
    return {i, j};
  }  
}