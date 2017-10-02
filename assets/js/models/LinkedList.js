'use strict';

//  How to make code: (∩°-°)⊃━☆ﾟ.*･｡ﾟ

const _length = Symbol('_length');

class LinkedList {
  constructor() {
    this.head = null;
    this[_length] = 0;
  }
  
  node(data) {
    const next = null;
    
    return {data, next};
  }
  
  add(data) {
    const newNode = this.node(data);

    this[_length]++;
    if (this.head === null) {
      this.head = newNode;
      return ;
    }
    
    this.last.next = newNode;
  }
  
  addMultipleValues(...values) {
    for (const value of values)
      this.add(value);
  }
  
  deleteFirstOccurrence(data) {
    let current = this.head;
    
    if (this.head.data === data) {
      this[_length]--;
      this.head = current.next;
      return ;
    }
    
    while (current && current.next) {
      if (current.next.data === data) {
        this[_length]--;
        current.next = current.next.next;
        return ;
      }
      
      current = current.next;
    }
  }
  
  pushFront(data) {
    const node    = this.node(data);

    node.next = this.head;
    this.head = node;
  }
  
  get last() {
    let current = this.head;
    
    while (current.next !== null)
      current = current.next;
      
    return current;
  }
  
  get length() {
    return this[_length];
  }
  
  print() {
    let current = this.head;
    
    process.stdout.write('Printing the list: ');
    while (current !== null) {
      process.stdout.write(`${current.data} `);
      current = current.next;
    }
    
    console.log('');
  }
}

export default LinkedList;