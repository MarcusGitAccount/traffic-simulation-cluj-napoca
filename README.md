# Traffic Simulator for Cluj-Napoca

### Severely undocumented repo, future updates will fix this.

## About

This projects aims to create a traffic simulator for Cluj-Napoca, Romania. The firsts steps are to choose a zone to represent(in this case Mihai Viteazu Square, main central area of the town as seen in the printscreen below) on the scene(canvas) and create a prototype that will be used in the near future to develop the traffic AI and roads and road logic.

http://prntscr.com/gke16s

## Currently developed

- Roadsystem created with a multigraph and linked lists of 2D vectors. (as seen here: http://prntscr.com/h6ht77)
- Math utils for linear algebra problems that occured during the project development and more.
- Mockup api for fetching the points for the roads.
- Data structures such as Queue, Stack, BinaryHeap, PriorityQueue, LinkedList, Multigraph etc..
- Models suchs as Road, Car (they are currently in development)

## Currently working on:

- Updating the Car model and creating the AI for cars. (will be using graphs to easy work with distances between cars)
- Updating the Road model
- Enhancing the API.

## Installation

- clone the repo
- npm i
- npm start

Note: 
1°. You may have to change the environment variables IP and PORT as they are by default set to 0.0.0.0 and 8080.
2°. No transcripters/loaders such as babel are used to transforms the ES6 code. The project makes use of the ES6 module system and             await/async implemented in Chrome's 61 V8 engine.
3°. The api is currently just a mockup that sends data collected from Google Maps by hand. :(

## Technologies used:
- NodeJS version > 8.5.0
- 2D canvas api

## License

<a href="https://github.com/MarcusGitAccount/traffic-simulation-cluj-napoca/blob/master/gplv3.txt">License link(gplv3)</a>
