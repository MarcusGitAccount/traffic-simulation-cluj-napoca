'use strict';

//  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
export default class VectorOperations {

  // set components/versors, whatever
  static setVersors(i, j) {
    return {i, j};
  }
  
  // @param segment: {point2D, point2d}
  static segmentToVersors(segment) {
    const {start, end} = segment;
    
    return this.setVersors(end.x - start.x, end.y - start.y);
  }

  static absoluteValue(versors) {
    const {i, j} = versors;
    
    return Math.sqrt(i * i + j * j);
  }
  
  static add(...vectors) {
    return (
      vectors.reduce((total, current) => {
        total.i += current.i;
        total.j += current.j;
        
        return total;
      }, this.nullVector())  
    );
  }
  
  static scalarMul(versors, scalar = 1) {
    versors.i *= scalar;
    versors.j *= scalar;
    
    return versors;
  }
  
  static dotProd(a, b) {
    return a.i * b.i + a.j + b.j;
  }
  
  static unitVector(versors) {
    const unitDownscale = 1 / this.absoluteValue(versors);

    return this.scalarMul(versors, unitDownscale);
  }
  
  static nullVector() {
    return this.setVersors(0, 0);
  }
}