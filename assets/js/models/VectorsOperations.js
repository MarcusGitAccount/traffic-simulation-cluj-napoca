'use strict';

function add(...vectors) {
  return vectors.reduce((total, current) => {
    for (let i = 0; i < current.length; i++)
      total[i] += current[i];
    
    return total;
  }, Array.from({length: vectors[0].length}, () => 0));
}

function multiply(vector, scalar) {
  const result = copy(vector);
  
  return result.map(component => component * scalar);
} 

function dot(a, b) {
  return Array.from({
    length: a.length
  }, (_, index) => a[index] * b[index]).reduce((total, curr) => total + curr);
}

function norm(vector, product = dot) {
  return Math.sqrt(product(vector, vector));
}

function unit(vector, product = dot) {
  const magnitude = norm(vector, product);
  
  return multiply(vector, 1 / magnitude);
}

function copy(vector) {
  return [...vector];
}

function zero(dimension = 2) {
  return Array.from({
    length: dimension
  }, () => 0);
}

function segmentToVersors(segment) {
  const vector = Array.from({length: segment.start.length});
  
  for (let index = 0; index < vector.length; index++)
    vector[index++] = segment.end[index] - segment.start[index];

  return vector;
}

export {
  add, multiply, dot, unit, copy,
  zero, segmentToVersors, norm
}