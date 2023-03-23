function randomNumber(a,b,index=false){
  //random number from a to b
  if (index){
    return Math.floor(Math.random() * (b - a) + a)
  }else {
    return (Math.random() * (b - a) + a)-(0.5*(b-a))
  }
}
function getDistance(dot1, dot2) {//is positive
  let dx=Math.abs(dot1.x-dot2.x)
  let dy=Math.abs(dot1.y-dot2.y)
  if (settings.wrap){
    if (dx>(canvas.width*0.5)){
      dx=canvas.width-dx
    }
    if (dy>(canvas.height*0.5)){
      dy=canvas.height-dy
    }
  }
  return Math.sqrt(dx*dx + dy*dy)
}

function accelerator(factor, distance) {
  let force;
  if (distance < settings.minDistance) {
    force = (settings.repel / settings.minDistance) * distance - settings.repel
  } else if (distance > settings.maxDistance) {
    force = 0
  } else {
    let mid = (settings.minDistance + settings.maxDistance) / 2
    let slope = factor / (mid - settings.minDistance)
    force = -(slope * Math.abs(distance - mid)) + factor
  }
  return force
}

class Dot {
  constructor(x, y, color, ctx) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.vx = 0;
    this.vy = 0
    this.color = color
    this.draw()
  }

  moveFrom(dot, distance, force,step) {
    if (distance === 0) {
      this.y += (Math.random()-0.5)*(1/step)
      this.x += (Math.random()-0.5)*(1/step)
      return;
    }
    let dx=(dot.x - this.x)
    let dy= (dot.y - this.y)
    if (settings.wrap){
      if (Math.abs(dx)>(canvas.width*0.5)){
        let neg = dx/Math.abs(dx)
        dx=canvas.width-Math.abs(dx)
        dx*=-1*neg
      }
      if (Math.abs(dy)>(canvas.height*0.5)){
        let neg = dy/Math.abs(dy)
        dy=canvas.height-Math.abs(dy)
        dy*=-1*neg
      }
    }
    let cos = dx / distance
    let sin = dy / distance
    this.vx += cos * force*(1/step)
    this.vy += sin * force*(1/step)
  }

  wrap() {
    if (this.x > canvas.width) {
      this.x=this.x-canvas.width
    }
    if (this.x < 0) {
      this.x=canvas.width-this.x
    }
    if (this.y > canvas.height) {
      this.y=this.y-canvas.height
    }
    if (this.y < 0) {
      this.y=canvas.height-this.y
    }
    
  }

  bounce() {
    if (this.x > canvas.width||this.x < 0) {
      this.x-=this.vx
      this.vx*=-1
    }
    if (this.y > canvas.height||this.y < 0) {
      this.y-=this.vy
      this.vy*=-1
    }
  }

  move(){
    this.x+=this.vx
    this.y+=this.vy
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, settings.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  update() {
    this.vx*=settings.friction
    this.vy*=settings.friction
    this.move()
    if (settings.wrap){
      this.wrap()
    } else{
      this.bounce()
    }
  }
}

class Simulation {
  constructor(dots, color, ctx) {
    this.ctx = ctx
    this.dots = []
    for (let i = 0; i < dots; i++) {
      if (color=="random"){
        let tcolor = colors[randomNumber(0,6,true)]
        this.addDot(100+randomNumber(0,dots), 100+randomNumber(0,dots),tcolor)
      }else {
        this.addDot(100+randomNumber(0,dots), 100+randomNumber(0,dots),color)
      }
    }
  }
  addDot(x, y, color) {
    this.dots.push(new Dot(x, y, color, this.ctx))
  }
  update(steps) {
    for(let i=0;i<steps;i++){
      for (let dot1 of this.dots) {
        for (let dot2 of this.dots) {
          if (dot1 == dot2) {
            continue
          }
          let distance = getDistance(dot1, dot2)
          if (distance < settings.maxDistance) {
            let force = accelerator(matrix[dot1.color][dot2.color], distance)
            dot1.moveFrom(dot2, distance, force,steps)
          }
        }
      }
      for (let dot of this.dots) {
        dot.update()
      }
    }
    for (let dot of this.dots) {
      dot.draw()
    }
  }
}


const bgText= document.getElementById("bg-text")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const observer = new ResizeObserver(() => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});
observer.observe(canvas)
var play = true
var dcolor="random"

var simulation = new Simulation(100, "random", ctx)

function render() {
  if (play) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    simulation.update(settings.timeSteps);
  }
  if (settings.slowdown) {
    setTimeout(() => {
      requestAnimationFrame(render);
    }, 500);
  } else {
    requestAnimationFrame(render)
  }
}
requestAnimationFrame(render);


function addDot(x,y){
  for (let i=0;i<settings.brushSize;i++){
    let color = (dcolor=="random")?colors[randomNumber(0,6,true)]:dcolor
    simulation.addDot(x+randomNumber(0,settings.brushSize*2), y+randomNumber(0,settings.brushSize*2),color)
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key == ' ') {
    if (event.repeat) return;
    play = !play
  }
  if (event.key == 'r') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    simulation = new Simulation(100, "random", ctx)
  }
  if (event.key == 'e') {
    dcolor="red"
  }
  if (event.key == 'o') {
    dcolor="orange"
  }
  if (event.key == 'y') {
    dcolor="yellow"
  }
  if (event.key == 'n') {
    dcolor="green"
  }
  if (event.key == 'b') {
    dcolor="blue"
  }
  if (event.key == 'p') {
    dcolor="purple"
  }
  if (event.key == 'a') {
    dcolor="random"
  }
})
var mouseDown = 0;
document.body.addEventListener("mousedown",function() { 
  mouseDown=1;
})
document.addEventListener("mouseup",function() {
  mouseDown=0;
})

document.addEventListener('mousedown', function(e) {
  if(e.target==canvas||e.target==bgText){
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left //maybe use offsetX,Y
    const y = e.clientY - rect.top
    addDot(x,y)
  }
})

document.addEventListener('mousemove', function(e) {
  if (mouseDown) {
    if(e.target==canvas||e.target==bgText){
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left //maybe use offsetX,Y
      const y = e.clientY - rect.top
      addDot(x,y)
    }
  }
})