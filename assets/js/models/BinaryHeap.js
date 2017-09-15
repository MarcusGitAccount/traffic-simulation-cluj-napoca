'use strict';

/**
    How to make code: (∩°-°)⊃━☆ﾟ.*･｡ﾟ 
**/

const _heap = Symbol('_heap');
const _parent = Symbol('_parent');
const _children = Symbol('_children');
const _insert = Symbol('_insert');

class BinaryHeap {
  constructor(cmpFunction) {
    /*
      cmpFunction: 
        @first  argument -> parent node
        @second argument -> child  node
        @out             -> Boolean true/false
      Example: 
        function (parent, child) { return parent < child; } min heap
        function (parent, child) { return parent > child; } max heap
    */
    this.cmpFunction = cmpFunction;
    this[_heap] = [];
  }
  
  get size() { return this[_heap].length; }
  
  debug() { console.log('Heap values: ', ...this[_heap]); }
  
  [_insert](value) {
    let index = this[_heap].push(value) - 1;
    let parent, temp;
    
    while (index > 0 && !this.cmpFunction(this[_heap][this[_parent](index)], value)) {
      parent = this[_parent](index);

      temp = this[_heap][parent]; // swap parent with child
      this[_heap][parent] =  value;
      this[_heap][index]  = temp;
      
      index = parent;
    }
    
  }
  
  pop() {
    this[_heap][0] = this[_heap][this.size - 1];
    this[_heap].pop();
    this.heapify(0);
  }
  
  heapify(index) {
    const {left, right} = this[_children](index);
    let largest = index;
    
    if (left < this.size && !this.cmpFunction(this[_heap][largest], this[_heap][left]))
      largest = left;
    else if (right < this.size && !this.cmpFunction(this[_heap][largest], this[_heap][right]))
      largest = right;
    
    console.log(left, right, largest);
    this.debug();
    
    if (largest !== index) {
      const temp = this[_heap][index];
      
      this[_heap][index]   = this[_heap][largest];
      this[_heap][largest] = temp;
      this.heapify(largest);
    }
  }
  
  [_parent](index) { return Math.floor((index - 1) / 2); }
  
  [_children](index) { return {left: 2 * index + 1, right: 2 * index + 2}; }
  
  insert(...values) {
    for (const value of values)
      this[_insert](value);
  }
}

export default BinaryHeap;