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
  
  static addVectors(...vectors) {
    return (
      vectors.reduce((total, current) => {
        total.i += current.i;
        total.j += current.j;
        
        return total;
      }, this.nullVector())  
    );
  }
  
  static scalarMultiplication(versors, scalar = 1) {
    versors.i *= scalar;
    versors.j *= scalar;
    
    return versors;
  }
  
  static scalarProduct(...vectors) {
    const result = vectors.reduce((total, current) => {
      total.i += current.i;
      total.j += current.j;
      
      return total;
    }, this.nullVector());
    
    return result.i + result.j;
  }
  
  static unitVector(versors) {
    const unitDownscale = 1 / this.absoluteValue(versors);

    return this.scalarMultiplication(versors, unitDownscale);
  }
  
  static nullVector() {
    return this.setVersors(0, 0);
  }
}