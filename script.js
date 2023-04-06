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
var fps;
const times = [];

var simulation = new Simulation(100, "random", ctx)

function render() {
  if (play) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    simulation.update(settings.timeSteps);
    displayInfo()
  }
  if (settings.slowdown) {
    setTimeout(() => {
      requestAnimationFrame(render);
    }, 500);
  } else {
    requestAnimationFrame(render)
  }
}
var lastTime=performance.now();  
requestAnimationFrame(render);


function displayInfo() {
    ctx.fillStyle = "black"
    ctx.font = "10px Arial"
    times.push(1000 / (performance.now() - lastTime))
    if (times.length > 20) {
        times.shift()
    }
    fps = times.reduce((a, b) => a + b, 0) / times.length
    ctx.fillText("dots: " + simulation.dots.length + " fps: " + fps.toFixed(2), canvas.width - 95, canvas.height - 10)
    lastTime = performance.now()
}

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