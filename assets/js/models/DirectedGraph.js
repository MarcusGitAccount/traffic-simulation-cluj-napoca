'use strict';

/*
  ɿ(｡･ɜ･)ɾ Ⓦⓗⓐⓣ？¯

  How to make code: (∩°-°)⊃━☆ﾟ.*･｡ﾟ 

  vertices =  nodes
*/

const _adjacencyList = Symbol('_adjacencyList');

(function updateSetPrototype() {
  Set.prototype.getItemAtPosition = function(position) {
    let index = 0;

    if (position >= this.size)
      return -1;
    
    for (let item of this) {
      if (index === position)
        return item;
      
      index++;
    }
  };
})();

class DirectedGraph {
  constructor() {
    this[_adjacencyList] = {};
  }

  addVertices(...vertexIds) {
    // create new list
    for (const id of vertexIds)
      this[_adjacencyList][id] = new Set(); // update to Sets after the concept works
  }
  
  removeVertex(vertexId) {
    // remove edges that come to this vertex
    for (const vertex in this[_adjacencyList]) { 
      if (this[_adjacencyList][vertex].has(vertexId))
        this[_adjacencyList][vertex].delete(vertexId);
    }
    
    // remove edges that leave this vertex
    delete this[_adjacencyList][vertexId]; 
  }
  
  checkIfVertexExists(vertexId) {
    return this[_adjacencyList].hasOwnProperty(vertexId);
  }
  
  addEdge(firstVertex, secondVertex) {
    for (const vertex of [firstVertex, secondVertex])
      if (!this.checkIfVertexExists(vertex))
        this.addVertex(vertex);
    
    this[_adjacencyList][firstVertex].add(secondVertex);
  }
  
  removeEdge(firstVertex, secondVertex) {
    if (this.checkIfVertexExists(firstVertex))
      if (this[_adjacencyList][firstVertex].has(secondVertex))
        this[_adjacencyList][firstVertex].delete(secondVertex);
  }
  
  vertexEdgesNumber(vertexId) {
    return this[_adjacencyList][vertexId].size;
  }
  
  vertexEdges(vertexId) {
    return this[_adjacencyList][vertexId];
  }
  
  get veritecesNumber() {
    return Object.keys(this[_adjacencyList]).length;
  }
  
  get vertices() {
    return Object.keys(this[_adjacencyList]);
  }
  
  get verticesList() {
    return this[_adjacencyList];
  }
}

export default DirectedGraph;