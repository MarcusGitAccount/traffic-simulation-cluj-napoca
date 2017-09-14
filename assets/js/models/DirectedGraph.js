'use strict';

/*
  ¯\_〳 •̀ o •́ 〵_/¯
  How to make code: (∩°-°)⊃━☆ﾟ.*･｡ﾟ 

  vertices =  nodes
*/

const _adjacencyList = Symbol('_adjacencyList');

class DirectedGraph {
  constructor() {
    this[_adjacencyList] = {};
  }
  addVertices(...vertexIds) {
    // create new list
    for (const id of vertexIds)
      this[_adjacencyList][id] = []; // update to Sets after the concept works
  }
  
  removeVertex(vertexId) {
    // remove edges that come to this vertex
    for (const vertex in this[_adjacencyList]) { 
      const index = vertex.indexOf(vertexId);
      
      if (index >= 0)
        vertex.splice(index, 1);
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
        
    if (this[_adjacencyList][firstVertex].indexOf(secondVertex) < 0)
      this[_adjacencyList][firstVertex].push(secondVertex);
  }
  
  removeEdge(firstVertex, secondVertex) {
    try {
      const index = this[_adjacencyList].indexOf(secondVertex);
      
      this[_adjacencyList][firstVertex].splice(index, 1);
    }
    catch(e) {
      let printingMethod = 'log';
      
      if (console.error)
        printingMethod = 'error';
      
      console[printingMethod](e);
    }
  }
  
  get veritecesNumber() {
    return this[_adjacencyList].length;
  }
  
  get vertices() {
    return Object.keys(this[_adjacencyList]);
  }
  
  get debug() {
    return this[_adjacencyList];
  }
}

export default DirectedGraph;