'use strict';

class TimestampInterval {
  constructor(low, high) {
    this.low = low;
    this.high = high;
    this.finished = false;
  }
  
  inLimits(value, callback) {
    if (value >= this.low && value <= this.high && !this.finished) {
      this.finished = true;
      callback();
    }
  }
}

export default TimestampInterval;