const settings = {
  airFriction:0.99//normal friction, always active
  ,slideFriction:0.8//friction along edges perpendicular to edges
  ,absorption:0.8//loses when bounce off
  ,gravity:2// self explaintory
  ,complicatedGravity: true
  ,complicatedBounce: true
  ,slowdown: false
  ,vx:0//starting velocities
  ,vy:0
}


class SettingsInput{
  constructor(setting,isNum){
    this.input=document.createElement("input")
    this.input.setting = setting
    
    if (isNum){
      this.input.type="text"
      this.input.value=settings[setting]
      this.input.oninput = function() {
        if (this.value.match(/^\-?\d+\.?\d*$/)) settings[this.setting] = parseFloat(this.value);
      }
    } else{
      this.input.type="checkbox"
      this.input.checked=settings[setting];
      this.input.oninput = function() {
        settings[this.setting] = this.checked;
        console.log(settings[this.setting])
      }
    }
    
    this.label = document.createElement("label")
    this.label.appendChild(document.createTextNode(setting+": "));
    this.label.appendChild(this.input)
    settingsDiv.appendChild(this.label);
    settingsDiv.appendChild(document.createElement("br"));
  }
}


class Dot {
  constructor(x,y,radius,color){
    this.x=x
    this.y=y
    this.vx=settings.vx //velocities
    this.vy=settings.vy
    this.radius=radius
    this.color=color
    this.draw()
  }
  updateVelocities(){
    if (!(this.y+this.vy+this.radius>canvas.height)){// only gravity if it isn't going to crash into the wall
      this.vy+=settings.gravity
    } else {//if it is going to crash
      if (settings.complicatedGravity) {
        //distance to travel to wall divided by how fast it's traveling t=d/r r>d
        var dist=canvas.height-(this.y+this.radius)
        if (dist>1){
          let time=dist/this.vy
          this.vy+=settings.gravity*time
        }
      }
    }//problem: doesn't account for air resistance(unders) or increasing velocity(overs), so will slightly over/underestimate depending on that
    //problem: 
    this.vx*=settings.airFriction//airfric
    this.vy*=settings.airFriction
    this.slidefric()
  }
  
  slidefric() {
      if (this.y + this.vy + this.radius > canvas.height || this.y - this.radius - this.vy < 0) { //slidefric, calculates will be inside wall?
          this.vx *= settings.slideFriction
      }
      if (this.x + this.vx + this.radius > canvas.width || this.x - this.radius - this.vx < 0) {
          this.vy *= settings.slideFriction
      }
  }
  
  updateLocation(){
    this.x+=this.vx
    this.y+=this.vy
  }
  
  bounce(){
    if (settings.complicatedBounce) {
      this.complicatedBounce()
    } else {
      if (this.x+this.radius>canvas.width||this.x-this.radius<0){
        this.vx*=-1
        this.x+=this.vx
        this.vx*=settings.absorption
      }
      if (this.y+this.radius>canvas.height||this.y-this.radius<0){
        this.vy*=-1
        this.y+=this.vy
        this.vy*=settings.absorption
      }
    }
  }
  
  complicatedBounce() {
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) { // is inside wall?
          if (this.x + this.radius > canvas.width) {
              this.x -= 2 * (this.x + this.radius - canvas.width)
          }
          if (this.x - this.radius < 0) {
              this.x += 2 * (0 - this.x + this.radius)
          }
          this.vx *= -1
          this.vx *= settings.absorption
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          if (this.y + this.radius > canvas.height) {
              this.y -= 2 * (this.y + this.radius - canvas.height)
          }
          if (this.y - this.radius < 0) {
              this.y += 2 * (0 - this.y + this.radius)
          }
          this.vy *= -1
          this.vy *= settings.absorption
      }
  }
  
  draw(){
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
  }

  update(){
    this.updateVelocities()
    this.updateLocation()
    this.bounce()
    this.draw()
  }
}


const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const observer = new ResizeObserver((entries) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});
observer.observe(canvas)
const settingsDiv = document.getElementById("settings")
var play=true


const dots = []
var dot = new Dot(10,10,10,"red")

const numInputs = ["airFriction","slideFriction","absorption","gravity","vx","vy"]
numInputs.forEach((value,index,array) =>{array[index]=new SettingsInput(value,true)})
const checkInputs = ["complicatedGravity","complicatedBounce","slowdown"]
checkInputs.forEach((value,index,array) =>{array[index]=new SettingsInput(value,false)})

function render() {
  if (play){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dot.update();
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

document.addEventListener("keydown",(event) => {
  if(event.key==' ') {
    if (event.repeat) return; 
    play=!play
  }
  if (event.key=='r') {
    dot = new Dot(10,10,10,"red")
  }
  if (event.key=='s'){
    if (settingsDiv.style.display === "none") {
      settingsDiv.style.display = "block";
    } else {
      settingsDiv.style.display = "none";
    }
  }
})

document.addEventListener('mousedown', function(e) {
  if (!play){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    dot.vx=-(dot.x-x)/2
    dot.vy=-(dot.y-y)/2
    ctx.lineWidth=2
    ctx.beginPath();
    ctx.moveTo(dot.x,dot.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    dot.draw()
  }
})