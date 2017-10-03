'use strict';

//  How to make code: (∩°-°)⊃━☆ﾟ.*･｡ﾟ

const _node = Symbol('_node');


// Bad code below, please don't forget to refactor it
class Queue {
  // FIFO - first in, first out
  // implemtation using a linked list
  // add to the head(beggining)
  // remove the last(end)
  // first -> _ -> _ -> _ -> _ -> last  
  
  // enqueue -> pushing in queue
  // dequeue -> poping the queue
  
  constructor() {
    this.first = this.last = null;
  }
  
  [_node](data) {
    return {
      data: data,
      next: null
    };
  }
  
  push(data) {
    const node = this[_node](data);
    
    if (this.last)
      this.last.next = node;
      
    this.last = node;
    
    if (!this.first)
      this.first = this.last;
  }
  
  pop() {
    if (!this.first)
      throw new Error('Empty queue. Nothing to be popped.');
    
    const removedData = this.first.data;
    
    this.first = this.first.next;
    
    if (!this.first)
      this.last = null;
      
    return removedData;
  }
  
  peek() {
    return this.first.data;
  }
  
  get isEmpty() {
    return this.first === null;
  }
}

export default Queue;