function add(...vectors) {
  return vectors.reduce((total, current) => {
    for (let i = 0; i < current.length; i++)
      total[i] += current[i];
    
    return total;
  }, Array.from({length: vectors[0].length}, () => 0));
}

function multiply(vector, scalar) {
  const result = [...vector];
  
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

function normalization(vector, product = dot) {
  const magnitude = norm(vector, product);
  
  return multiply(vector, 1 / magnitude);
}

function copy(vector) {
  return [...vector];
}

function orthogonalization(...base) {
  const result = [];

  for (let i = 0; i < base.length; i++) {
    const current  = copy(base[i]);
    let   modified = copy(base[i]); 

    for (let j = 0; j < i; j++) {
      const pos = base[j];
      const coefficient = -dot(current, pos) / dot(pos, pos);
      
      console.log(coefficient)
      modified = add(modified, multiply(pos, coefficient));
    }

    result.push(modified);
  }

  return result;
}