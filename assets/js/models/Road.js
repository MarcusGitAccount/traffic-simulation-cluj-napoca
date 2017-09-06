/*
{lat: 46.773777343799175, lng: 23.588075637817383}
{lat: 46.77562532713712, lng: 23.590580821037292}
{lat: 46.77562532713712, lng: 23.590580821037292}
{lat: 46.774710528202135, lng: 23.591803908348083}
{lat: 46.77429169940724, lng: 23.592286705970764}
{lat: 46.773696516042655, lng: 23.588220477104187}
{lat: 46.774192502636616, lng: 23.59211504459381}
{lat: 46.77467378896449, lng: 23.59185755252838}
{lat: 46.77411534946648, lng: 23.59037697315216}
{lat: 46.77486850663835, lng: 23.58968496322632}
*/

class Road {
  constructor(position, next, options = null, drawingOptions = {lineWidth: 1}, direction = 'up') {
    this.scale = 10;
    this.position = position;
    this.options = options;
    this.next = next;
    this.direction = 'up';
    this.drawingOptions = drawingOptions;
  }
}

export default Road;