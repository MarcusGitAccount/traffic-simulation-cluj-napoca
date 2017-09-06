'use strict';

const _road = Symbol('_road');

class Car {
  constructor(road, interval, context, drawingOptions = {color: 'red', lineWidth: 1}) {
    this[_road] = road;
    this.context = context;
    this.drawingOptions = drawingOptions;
    this.elapsed = 0;
    this.interval = interval;
  }
  
  get scale() {
    return this.road.scale - 2 * (this.road.drawingOptions.lineWidth || 1);
  }
  
  get road() {
    return this[_road];
  }
  
  set road(updatedRoadPiece) {
    this.deleteFromCanvas({x: this[_road].position.x + this[_road].drawingOptions.lineWidth, y: this[_road].position.y + this[_road].drawingOptions.lineWidth}, this.scale);
    this[_road] = updatedRoadPiece;
    this.updateToCanvas({x: this[_road].position.x + this[_road].drawingOptions.lineWidth, y: this[_road].position.y + this[_road].drawingOptions.lineWidth}, this.scale);
  }
  
  deleteFromCanvas(position, scale) {
    this.context.clearRect(position.x, position.y, scale, scale);
  }
  
  updateToCanvas(position, scale) {
    this.context.fillStyle = this.drawingOptions.color;
    this.context.fillRect(position.x, position.y, scale, scale);
  }
  
  updateElapsed(delta, callback) {
    this.elapsed += delta;
    
    if (this.elapsed >= this.interval) {
      this.elapsed = 0;
      callback();
    }
  }
}

export default Car;