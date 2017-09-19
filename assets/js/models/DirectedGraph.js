'use strict';

/*
  ɿ(｡･ɜ･)ɾ Ⓦⓗⓐⓣ？¯

  How to make code: (∩°-°)⊃━☆ﾟ.*･｡ﾟ 

  vertices =  nodes
*/

const _adjacencyList = Symbol('_adjacencyList'); // Symbols for private properties
const _dfs = Symbol('_dfs');

(function updateMapPrototype() {
  Map.prototype.getKeytPosition = function(position) {
    let index = 0;

    if (position >= this.size)
      return -1;
    
    for (let item of this.keys()) {
      if (index === position)
        return item;
      
      index++;
    }
  };
})();

class DirectedGraph {
  constructor() {
    this[_adjacencyList] = {};
    this[_dfs] = {
      visited: [],
      result: [],
      dfs: (vertex) => {
        this[_dfs].visited[vertex] = true;
        this[_dfs].result.push(vertex);
        
        for (const neighbour of this[_adjacencyList][vertex])
          if (!this[_dfs].visited[neighbour])
            this[_dfs].dfs(neighbour);
      }
    };
  }

  addVertices(...vertexIds) {
    // create new list
    for (const id of vertexIds) {
      this[_adjacencyList][id] = new Map();
      this[_dfs].visited[id] = false;
    }
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

  checkIfEdgeExists(firstVertex, secondVertex) {
    if (!this.checkIfVertexExists(firstVertex) || !this.checkIfVertexExists(secondVertex))
      return false;
      
    return this[_adjacencyList][firstVertex].has(secondVertex);
  } 
  
  addEdge(firstVertex, secondVertex, weight) {
    for (const vertex of [firstVertex, secondVertex])
      if (!this.checkIfVertexExists(vertex))
        this.addVertex(vertex);
    
    this[_adjacencyList][firstVertex].set(secondVertex, weight);
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
  
  getEdge(start, end) {
    return this[_adjacencyList][start].get(end);
  }
  
  dfs(start) {
    this[_dfs].result = [];
    this[_dfs].visited = this[_dfs].visited.map(_ => false);
    this[_dfs].dfs(start);

    return this[_dfs].result;
  }
  
  bfs(start) {
    const result = [];
    const size = this.veritecesNumber;
    const visited = [...new Array(size + 1)].fill(false);
    const queue = [];
    
    queue.push(start);
    visited[start] = true;
    
    while (queue.length > 0) {
      const top = queue.shift();
      
      result.push(top);
      for (const neighbour of this[_adjacencyList][top].keys()) {
        if (visited[neighbour] === false) {
          queue.push(neighbour);
          visited[neighbour] = true;
        }
      }
    }
    
    return result;
  } 
}

export default DirectedGraph;