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

  moveFrom(dot, distance, force) {
    if (distance === 0) {
      this.y += Math.random()
      this.x += Math.random()
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
    this.vx += cos * force
    this.vy += sin * force
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

  block() {
    if (this.x > canvas.width) {
      this.x=canvas.width
    }
    if (this.x < 0) {
      this.x=0
    }
    if (this.y > canvas.height) {
      this.y=canvas.height
    }
    if (this.y < 0) {
      this.y=0
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
      this.block()
    }
    this.draw()
  }
}

class Simulation {
  constructor(dots, color, ctx) {
    this.ctx = ctx
    this.dots = []
    for (let i = 0; i < dots; i++) {
      if (color=="random"){
        let tcolor = colors[Math.floor((Math.random()*6))]
        this.addDot(100+Math.random()*100, 100+Math.random()*100,tcolor)
      }else {
        this.addDot(100+Math.random()*100, 100+Math.random()*100,color)
      }
    }
  }
  addDot(x, y, color) {
    this.dots.push(new Dot(x, y, color, this.ctx))
  }
  update() {
    for (let dot1 of this.dots) {
      for (let dot2 of this.dots) {
        if (dot1 == dot2) {
          continue
        }
        let distance = getDistance(dot1, dot2)
        if (distance < settings.maxDistance) {
          let force = accelerator(matrix[dot1.color][dot2.color], distance)
          dot1.moveFrom(dot2, distance, force)
        }
      }
    }
    for (let dot of this.dots) {
      dot.update()
    }
  }
}


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
    simulation.update();
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

document.addEventListener("keydown", (event) => {
  if (event.key == ' ') {
    if (event.repeat) return;
    play = !play
  }
  if (event.key == 'r') {
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
  if (event.key == 'g') {
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
  ++mouseDown;
})
document.addEventListener("mouseup",function() {
  --mouseDown;
})

document.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left //maybe use offsetX,Y
  const y = e.clientY - rect.top
  let color = (dcolor=="random") ? colors[Math.floor((Math.random()*6))]:dcolor 
  simulation.addDot(x, y,color)
})

document.addEventListener('mousemove', function(e) {
  if (mouseDown) {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left //maybe use offsetX,Y
  const y = e.clientY - rect.top
  let color = (dcolor=="random") ? colors[Math.floor((Math.random()*6))]:dcolor
  simulation.addDot(x, y,color)
  }
})